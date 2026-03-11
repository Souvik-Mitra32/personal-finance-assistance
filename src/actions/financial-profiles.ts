"use server"

import { redirect } from "next/navigation"

import { db } from "@/lib/drizzle/db"
import { financialProfile } from "@/lib/drizzle/schema"
import { financialProfileSchema } from "@/lib/validators/financial-profile"

export async function createFinancialProfileAction(
  userId: string,
  unsafeData: unknown,
) {
  const { success, data } = financialProfileSchema.safeParse(unsafeData)
  if (!success) return "Invalid inputs"

  const [newFinancialProfile] = await db
    .insert(financialProfile)
    .values({
      ...data,
      userId,
      monthlyIncomeInPaisa: data.monthlyIncome * 100,
      fixedMonthlyExpensesInPaisa: data.fixedMonthlyExpenses * 100,
      unallocatedBalanceInPaisa: data.currentBalance * 100,
    })
    .returning({ id: financialProfile.id })
    .catch(() => [{ id: null }])

  if (newFinancialProfile.id == null)
    return "Failed to create financial profile"

  redirect("/")
}
