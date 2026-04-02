"use server"

import { redirect } from "next/navigation"
import { refresh } from "next/cache"
import { eq, sql } from "drizzle-orm"

import { db } from "../drizzle/db"
import {
  goal as goalTable,
  goalContribution,
  GoalContribution,
  Goal,
} from "../drizzle/schema"
import { getGoalById } from "../queries/goals"
import { getCurrentUser } from "../queries/auth"

import { convertRupeesToPaisa } from "../utils"
import { getGoalStatus } from "../utils/goal-progress"
import { normalizeDate } from "../utils/date"

export async function addGoalContributionAction(
  goalId: string,
  contribution: {
    amount: number
    note: string | null
  },
  options?: { redirectOnSuccess?: boolean },
) {
  const amountInPaisa = convertRupeesToPaisa(contribution.amount)

  const data = await getGoalById(goalId)

  if (data == null) {
    return { success: false, error: "Goal not found" }
  }

  const { goal, totalContributionInPaisa } = data

  const status = getGoalStatus(goal, totalContributionInPaisa)

  if (status !== "active") {
    return { success: false, error: "Goal is not active" }
  }

  const targetDate = normalizeDate(goal.targetDate)
  const today = normalizeDate(new Date())

  if (targetDate < today) {
    return { success: false, error: "Goal is past" }
  }

  await db.transaction(async (tx) => {
    const res = await tx
      .select({
        total: sql<number>`coalesce(sum(${goalContribution.amountInPaisa}), 0)`,
      })
      .from(goalContribution)
      .where(eq(goalContribution.goalId, goalId))

    const total = res[0]?.total ?? 0

    if (total >= goal.targetAmountInPaisa) {
      throw new Error("Goal already achieved")
    }

    await tx
      .insert(goalContribution)
      .values({ goalId, amountInPaisa, note: contribution.note })
  })

  const shouldRedirect = options?.redirectOnSuccess === true
  if (shouldRedirect) {
    redirect(`/goals/${goal.slug}`)
  } else {
    refresh()
  }

  return { success: true, error: null }
}

export async function editGoalContributionAction(
  contributionId: string,
  contribution: {
    amount: number
    note: string | null
  },
  options?: { redirectOnSuccess?: boolean },
) {
  await getCurrentUser()

  const { amount, note } = contribution
  const amountInPaisa = convertRupeesToPaisa(amount)

  const goal = await db.transaction(async (tx) => {
    const rows = await tx
      .select({
        contribution: goalContribution,
        goal: goalTable,
      })
      .from(goalContribution)
      .innerJoin(goalTable, eq(goalContribution.goalId, goalTable.id))
      .where(eq(goalContribution.id, contributionId))
      .limit(1)

    if (!rows || rows.length === 0) {
      throw new Error("Contribution not found")
    }

    const { contribution, goal } = rows[0] as {
      contribution: GoalContribution
      goal: Goal
    }

    const totalResult = await tx
      .select({
        total: sql<number>`coalesce(sum(${goalContribution.amountInPaisa}), 0)`,
      })
      .from(goalContribution)
      .where(eq(goalContribution.goalId, goal.id))

    const totalContributionInPaisa = totalResult[0]?.total ?? 0

    const status = getGoalStatus(goal, totalContributionInPaisa)

    if (status !== "active" && status !== "completed")
      throw new Error("Goal is not active")

    // Compute max allowed
    const maxAllowed =
      goal.targetAmountInPaisa -
      (totalContributionInPaisa - contribution.amountInPaisa)

    if (amountInPaisa > maxAllowed) {
      throw new Error("Amount exceeds allowed limit")
    }

    await tx
      .update(goalContribution)
      .set({
        amountInPaisa,
        note,
      })
      .where(eq(goalContribution.id, contributionId))

    return goal
  })

  const shouldRedirect = options?.redirectOnSuccess === true
  if (shouldRedirect) {
    redirect(`/goals/${goal.slug}`)
  } else {
    refresh()
  }

  return { success: true, error: null }
}

export async function deleteGoalContributionAction(
  contributionId: string,
  options?: { redirectOnSuccess?: boolean },
) {
  await getCurrentUser()

  await db.transaction(async (tx) => {
    const row = await tx
      .select({
        id: goalContribution.id,
        goalId: goalContribution.goalId,
      })
      .from(goalContribution)
      .where(eq(goalContribution.id, contributionId))
      .limit(1)

    if (!row || row.length === 0) {
      throw new Error("Contribution not found")
    }

    await tx
      .delete(goalContribution)
      .where(eq(goalContribution.id, contributionId))
  })

  const shouldRedirect = options?.redirectOnSuccess === true
  if (!shouldRedirect) {
    refresh()
  }

  return { success: true, error: null }
}
