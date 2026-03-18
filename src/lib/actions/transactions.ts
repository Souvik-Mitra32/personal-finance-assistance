"use server"

import { refresh } from "next/cache"

import { db } from "../drizzle/db"
import { transaction } from "../drizzle/schema"
import { createTransactionSchema } from "../validators/transaction"
import { getOrCreateMonthlyCycle } from "../finance/monthly-cycle"

import { convertRupeesToPaisa, normalizeDate } from "../utils"
import { eq } from "drizzle-orm"

export async function addTransactionAction(
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
      throw new Error("Failed to add transaction")
    }
  })

  if (options?.redirectOnSuccess !== false) refresh()

  return { success: true, error: null }
}

export async function editTransactionAction(
  {
    transactionId,
    cycleStartDay,
    unsafeData,
  }: {
    transactionId: string
    cycleStartDay: number
    unsafeData: unknown
  },
  options?: { redirectOnSuccess?: boolean },
) {
  const transactionSchema = createTransactionSchema(cycleStartDay)
  const result = transactionSchema.safeParse(unsafeData)

  if (!result.success) return { success: false, error: "Invalid inputs" }

  const data = result.data

  // Fetch transaction to get financialProfileId for cycle resolution
  const existingTx = await db.query.transaction.findFirst({
    where: (tx, { eq }) => eq(tx.id, transactionId),
    columns: { financialProfileId: true, date: true },
  })

  if (!existingTx) return { success: false, error: "Transaction not found" }

  // IMPORTANT: use date-driven cycle resolution
  const cycle = await getOrCreateMonthlyCycle(
    existingTx.financialProfileId,
    data.date,
  )

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
      .update(transaction)
      .set({
        ...rest,
        financialProfileId: existingTx.financialProfileId,
        cycleId: cycle.id,
        amountInPaisa,
      })
      .where(eq(transaction.id, transactionId))
      .returning({ id: transaction.id })

    if (!rows || rows.length === 0) {
      throw new Error("Failed to update transaction")
    }
  })

  if (options?.redirectOnSuccess !== false) refresh()

  return { success: true, error: null }
}
