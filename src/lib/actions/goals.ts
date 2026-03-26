"use server"

import { refresh } from "next/cache"

import { db } from "../drizzle/db"
import { goal } from "../drizzle/schema"
import { goalSchema } from "../validators/goal"

import { getCurrentUser } from "../queries/auth"
import { getFinancialProfileByUserId } from "../queries/financial-profiles"

import { convertRupeesToPaisa } from "../utils"

export async function createGoalAction(
  unsafeData: unknown,
  options?: { redirectOnSuccess?: boolean },
) {
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

  const { targetAmount, ...rest } = result.data

  const targetAmountInPaisa = convertRupeesToPaisa(targetAmount)
  // TODO: Validate targetDate is in the future
  const rows = await db
    .insert(goal)
    .values({
      financialProfileId: financialProfile.id,
      targetAmountInPaisa,
      ...rest,
    })
    .returning({ id: goal.id })

  if (!rows || rows.length === 0) {
    return { success: false, error: "Failed to create goal" }
  }

  if (options?.redirectOnSuccess !== false) refresh()

  return { success: true, error: null }
}
