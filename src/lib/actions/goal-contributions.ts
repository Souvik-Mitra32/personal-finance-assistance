"use server"

import { refresh } from "next/cache"
import { db } from "../drizzle/db"
import { goalContribution } from "../drizzle/schema"
import { getGoalById } from "../queries/goals"

import { convertRupeesToPaisa } from "../utils"

export async function addGoalContributionAction(
  goalId: string,
  contribution: {
    amount: number
    note: string | null
  },
  options?: { redirectOnSuccess?: boolean },
) {
  const amountInPaisa = convertRupeesToPaisa(contribution.amount)

  const goal = await getGoalById(goalId)

  if (!goal) {
    return { success: false, error: "Goal not found" }
  }

  await db
    .insert(goalContribution)
    .values({ goalId, amountInPaisa, note: contribution.note })

  if (options?.redirectOnSuccess !== false) refresh()

  return { success: true, error: null }
}
