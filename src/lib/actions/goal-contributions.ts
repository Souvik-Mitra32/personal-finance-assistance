"use server"

import { refresh } from "next/cache"
import { eq, sql } from "drizzle-orm"

import { db } from "../drizzle/db"
import { getGoalById } from "../queries/goals"
import { goalContribution } from "../drizzle/schema"

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

  if (options?.redirectOnSuccess !== false) refresh()

  return { success: true, error: null }
}
