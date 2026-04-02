"use server"

import { refresh } from "next/cache"
import { redirect } from "next/navigation"
import { and, eq, sql } from "drizzle-orm"
import { isPast } from "date-fns"

import { db } from "../drizzle/db"
import { goal as goalTable, goalContribution } from "../drizzle/schema"
import { goalSchema } from "../validators/goal"
import { getCurrentUser } from "../queries/auth"
import { getFinancialProfileByUserId } from "../queries/financial-profiles"

import { convertRupeesToPaisa } from "../utils"
import { createSlug } from "../utils/slug"
import { normalizeDate } from "../utils/date"

export async function createGoalAction(
  unsafeData: unknown,
  options?: { redirectOnSuccess?: boolean },
): Promise<{ success: true; error: null } | { success: false; error: string }> {
  const result = goalSchema.safeParse(unsafeData)
  if (!result.success) {
    return { success: false, error: "Invalid inputs" }
  }

  const user = await getCurrentUser()
  const financialProfile = await getFinancialProfileByUserId(user.id)

  if (!financialProfile) {
    return {
      success: false,
      error: "Financial profile not found for the user",
    }
  }

  const { targetAmount, name, targetDate, status } = result.data

  const targetAmountInPaisa = convertRupeesToPaisa(targetAmount)

  if (isPast(targetDate)) {
    return {
      success: false,
      error: "Target date must be in the future",
    }
  }

  const rows = await db
    .insert(goalTable)
    .values({
      financialProfileId: financialProfile.id,
      targetAmountInPaisa,
      name,
      targetDate,
      status,
      slug: createSlug(name),
    })
    .returning({ slug: goalTable.slug })

  if (!rows || rows.length === 0) {
    return { success: false, error: "Failed to create goal" }
  }

  const newGoal = rows[0]!

  const shouldRedirect = options?.redirectOnSuccess === true
  if (shouldRedirect) {
    redirect(`/goals/${newGoal.slug}`)
  } else {
    refresh()
  }

  return { success: true, error: null }
}

export async function editGoalAction(
  goalId: string,
  unsafeData: unknown,
  options?: { redirectOnSuccess?: boolean },
): Promise<{ success: true; error: null } | { success: false; error: string }> {
  const result = goalSchema.safeParse(unsafeData)
  if (!result.success) {
    return { success: false, error: result.error.message || "Invalid inputs" }
  }

  const user = await getCurrentUser()
  const financialProfile = await getFinancialProfileByUserId(user.id)

  if (!financialProfile) {
    return {
      success: false,
      error: "Financial profile not found for the user",
    }
  }

  const updatedGoal = await db.transaction(async (tx) => {
    const rows = await tx
      .select({
        goal: goalTable,
        totalContributionInPaisa: sql<number>`coalesce(sum(${goalContribution.amountInPaisa}), 0)`,
      })
      .from(goalTable)
      .leftJoin(goalContribution, eq(goalContribution.goalId, goalTable.id))
      .where(
        and(
          eq(goalTable.id, goalId),
          eq(goalTable.financialProfileId, financialProfile.id),
        ),
      )
      .groupBy(goalTable.id)

    if (!rows || rows.length === 0 || !rows[0]) {
      throw new Error("Goal not found")
    }

    const { totalContributionInPaisa } = rows[0]

    const { name, targetAmount, targetDate, status } = result.data
    const today = normalizeDate(new Date())
    const normalizedDate = normalizeDate(targetDate)

    if (normalizedDate < today) {
      throw new Error("Target date must be in the future")
    }

    const targetAmountInPaisa = convertRupeesToPaisa(targetAmount)

    if (targetAmountInPaisa < totalContributionInPaisa) {
      throw new Error(
        "Target amount cannot be less than total contributions made towards the goal",
      )
    }

    const [updatedGoal] = await tx
      .update(goalTable)
      .set({
        name,
        targetAmountInPaisa,
        targetDate,
        status,
        slug: createSlug(name),
      })
      .where(and(eq(goalTable.id, goalId)))
      .returning({ slug: goalTable.slug })

    if (updatedGoal == null) {
      throw new Error("Failed to update goal")
    }

    return updatedGoal
  })

  const shouldRedirect = options?.redirectOnSuccess === true
  if (shouldRedirect) {
    redirect(`/goals/${updatedGoal.slug}`)
  } else {
    refresh()
  }

  return { success: true, error: null }
}

export async function deleteGoalAction(
  goalId: string,
  options?: { redirectOnSuccess?: boolean },
): Promise<{ success: true; error: null } | { success: false; error: string }> {
  const user = await getCurrentUser()
  const financialProfile = await getFinancialProfileByUserId(user.id)

  if (!financialProfile) {
    return {
      success: false,
      error: "Financial profile not found for the user",
    }
  }

  await db.transaction(async (tx) => {
    const rows = await tx
      .select({
        goalId: goalTable.id,
        contributionCount: sql<number>`count(${goalContribution.id})`,
      })
      .from(goalTable)
      .leftJoin(goalContribution, eq(goalContribution.goalId, goalTable.id))
      .where(
        and(
          eq(goalTable.id, goalId),
          eq(goalTable.financialProfileId, financialProfile.id),
        ),
      )
      .groupBy(goalTable.id)

    if (!rows || rows.length === 0) {
      throw new Error("Goal not found")
    }

    const { contributionCount } = rows[0] as {
      contributionCount: number
      goalId: string
    }

    if (contributionCount > 0) {
      throw new Error("Cannot delete goal with existing contributions")
    }

    await tx.delete(goalTable).where(eq(goalTable.id, goalId))
  })

  const shouldRedirect = options?.redirectOnSuccess === true
  if (shouldRedirect) {
    redirect("/goals")
  } else {
    refresh()
  }

  return { success: true, error: null }
}
