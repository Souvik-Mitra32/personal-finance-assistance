"use server"

import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

import { db } from "@/lib/drizzle/db"
import { getCurrentUser } from "../queries/auth"
import { financialProfile } from "@/lib/drizzle/schema"
import { getOrCreateMonthlyCycle } from "../finance/monthly-cycle"
import { financialProfileSchema } from "@/lib/validators/financial-profile"

import { convertRupeesToPaisa } from "../utils"
import { refresh } from "next/cache"

export async function createFinancialProfileAction(
  userId: string,
  unsafeData: unknown,
  options?: { redirectOnSuccess?: boolean },
) {
  await getCurrentUser()

  const result = financialProfileSchema.safeParse(unsafeData)
  if (!result.success) return { success: false, error: "Invalid inputs" }

  const { monthlyIncome, fixedMonthlyExpenses, currentBalance, ...rest } =
    result.data

  const rows = await db
    .insert(financialProfile)
    .values({
      ...rest,
      userId,
      monthlyIncomeInPaisa: convertRupeesToPaisa(monthlyIncome),
      fixedMonthlyExpensesInPaisa: convertRupeesToPaisa(fixedMonthlyExpenses),
      unallocatedBalanceInPaisa: currentBalance
        ? convertRupeesToPaisa(currentBalance)
        : 0,
    })
    .returning({ id: financialProfile.id })

  if (rows == null || rows.length === 0)
    return { success: false, error: "Failed to create financial profile" }

  const newFinancialProfile = rows[0]!

  const monthlyCycle = await getOrCreateMonthlyCycle(
    newFinancialProfile.id,
    new Date(),
  )

  if (monthlyCycle == null)
    return { success: false, error: "Failed to create monthly cycle" }

  const shouldRedirect = options?.redirectOnSuccess === true
  if (shouldRedirect) {
    redirect("/")
  } else {
    refresh()
  }

  return {
    success: true,
    error: null,
  }
}

export async function editFinancialProfileAction(
  financialProfileId: string,
  unsafeData: unknown,
  options?: { redirectOnSuccess?: boolean },
) {
  await getCurrentUser()

  const result = financialProfileSchema.safeParse(unsafeData)
  if (!result.success) return { success: false, error: "Invalid inputs" }

  const { monthlyIncome, fixedMonthlyExpenses, currentBalance, ...rest } =
    result.data

  await db
    .update(financialProfile)
    .set({
      ...rest,
      monthlyIncomeInPaisa: convertRupeesToPaisa(monthlyIncome),
      fixedMonthlyExpensesInPaisa: convertRupeesToPaisa(fixedMonthlyExpenses),
      unallocatedBalanceInPaisa: currentBalance
        ? convertRupeesToPaisa(currentBalance)
        : 0,
    })
    .where(eq(financialProfile.id, financialProfileId))
    .returning({ id: financialProfile.id })

  const shouldRedirect = options?.redirectOnSuccess === true
  if (shouldRedirect) {
    redirect("/configurations")
  } else {
    refresh()
  }

  return {
    success: true,
    error: null,
  }
}
