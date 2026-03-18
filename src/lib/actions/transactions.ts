"use server"

import { refresh } from "next/cache"

import { db } from "../drizzle/db"
import { transaction } from "../drizzle/schema"
import { createTransactionSchema } from "../validators/transaction"
import { getOrCreateMonthlyCycle } from "../finance/monthly-cycle"

import { convertRupeesToPaisa, normalizeDate } from "../utils"

export async function createTransactionAction(
  {
    financialProfileId,
    cycleStartDay,
    unsafeData,
  }: {
    financialProfileId: string
    cycleStartDay: number
    unsafeData: unknown
  },
  options?: { redirectOnSuccess?: boolean },
) {
  const transactionSchema = createTransactionSchema(cycleStartDay)
  const result = transactionSchema.safeParse(unsafeData)

  if (!result.success) return { success: false, error: "Invalid inputs" }

  const data = result.data

  // IMPORTANT: use date-driven cycle resolution
  const cycle = await getOrCreateMonthlyCycle(financialProfileId, data.date)

  if (!cycle) return { success: false, error: "Monthly cycle not found" }

  if (cycle.status !== "active")
    return {
      success: false,
      error: "Monthly cycle is not active",
    }

  // Normalize dates (prevent timezone bugs)
  const txDate = normalizeDate(data.date)
  const start = normalizeDate(cycle.cycleStartDate)
  const end = normalizeDate(cycle.cycleEndDate)

  if (txDate < start || txDate > end)
    return {
      success: false,
      error: "Transaction date is out of bounds",
    }

  if (txDate > new Date())
    return {
      success: false,
      error: "Future transactions not allowed",
    }

  const { amount, ...rest } = data
  const amountInPaisa = convertRupeesToPaisa(amount)

  await db.transaction(async (tx) => {
    const rows = await tx
      .insert(transaction)
      .values({
        ...rest,
        financialProfileId,
        cycleId: cycle.id,
        amountInPaisa,
      })
      .returning({ id: transaction.id })

    if (!rows || rows.length === 0) {
      throw new Error("Failed to create transaction")
    }
  })

  if (options?.redirectOnSuccess !== false) refresh()

  return { success: true, error: null }
}
