"use server"

import { redirect } from "next/navigation"

import { db } from "@/lib/drizzle/db"
import { financialProfile } from "@/lib/drizzle/schema"
import { financialProfileSchema } from "@/lib/validators/financial-profile"
import { getOrCreateMonthlyCycle } from "../finance/monthly-cycle"

import { convertRupeesToPaisa } from "../utils"

export async function createFinancialProfileAction(
  userId: string,
  unsafeData: unknown,
  options?: { redirectOnSuccess?: boolean },
) {
  const result = financialProfileSchema.safeParse(unsafeData)
  if (!result.success) return { success: false, error: "Invalid inputs" }

  const data = result.data

  const rows = await db
    .insert(financialProfile)
    .values({
      ...data,
      userId,
      monthlyIncomeInPaisa: convertRupeesToPaisa(data.monthlyIncome),
      fixedMonthlyExpensesInPaisa: convertRupeesToPaisa(
        data.fixedMonthlyExpenses,
      ),
    })
    .returning({ id: financialProfile.id })

  if (rows == null || rows.length === 0)
    return { success: false, error: "Failed to create financial profile" }

  const newFinancialProfile = rows[0]

  const monthlyCycle = await getOrCreateMonthlyCycle(
    newFinancialProfile.id,
    new Date(),
  )

  if (monthlyCycle == null)
    return { success: false, error: "Failed to create monthly cycle" }

  if (options?.redirectOnSuccess !== false) redirect("/")

  return {
    success: true,
    error: null,
  }
}
