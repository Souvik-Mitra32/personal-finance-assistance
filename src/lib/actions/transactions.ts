"use server"

import { refresh } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "../drizzle/db"
import { transaction } from "../drizzle/schema"
import { createTransactionSchema } from "../validators/transaction"
import {
  getMonthlyCycleById,
  getOrCreateMonthlyCycle,
} from "../finance/monthly-cycle"

import { convertRupeesToPaisa } from "../utils"
import { normalizeDate } from "../utils/date"

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

  const cycle = await getOrCreateMonthlyCycle(financialProfileId, data.date)

  if (!cycle) return { success: false, error: "Monthly cycle not found" }

  if (cycle.status !== "active")
    return {
      success: false,
      error: "Monthly cycle is not active",
    }

  const today = normalizeDate(new Date())
  const txDate = normalizeDate(data.date)
  const start = normalizeDate(cycle.cycleStartDate)
  const end = normalizeDate(cycle.cycleEndDate)

  if (txDate < start || txDate > end)
    return {
      success: false,
      error: "Transaction date is out of bounds",
    }

  if (txDate > today)
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

  const existingTx = await db.query.transaction.findFirst({
    where: (tx, { eq }) => eq(tx.id, transactionId),
  })

  if (!existingTx) return { success: false, error: "Transaction not found" }

  const oldCycle = await getMonthlyCycleById(existingTx.cycleId)

  if (!oldCycle || oldCycle.status !== "active") {
    return { success: false, error: "Cannot edit closed cycle" }
  }

  const newCycle = await getOrCreateMonthlyCycle(
    existingTx.financialProfileId,
    data.date,
  )

  if (!newCycle || newCycle.status !== "active") {
    return { success: false, error: "Target cycle not active" }
  }

  const txDate = normalizeDate(data.date)
  const start = normalizeDate(newCycle.cycleStartDate)
  const end = normalizeDate(newCycle.cycleEndDate)
  const today = normalizeDate(new Date())

  if (txDate < start || txDate > end) {
    return {
      success: false,
      error: "Transaction date is out of bounds",
    }
  }

  if (txDate > today) {
    return {
      success: false,
      error: "Future transactions not allowed",
    }
  }

  const { amount, ...rest } = data
  const amountInPaisa = convertRupeesToPaisa(amount)

  await db.transaction(async (tx) => {
    const rows = await tx
      .update(transaction)
      .set({
        ...rest,
        amountInPaisa,
        cycleId: newCycle.id,
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

export async function deleteTransactionAction(
  transactionId: string,
  options?: { redirectOnSuccess?: boolean },
) {
  const existingTx = await db.query.transaction.findFirst({
    where: (tx, { eq }) => eq(tx.id, transactionId),
  })

  if (!existingTx) {
    return { success: false, error: "Transaction not found" }
  }

  const cycle = await getMonthlyCycleById(existingTx.cycleId)

  if (!cycle || cycle.status !== "active") {
    return {
      success: false,
      error: "Cannot delete transaction from closed cycle",
    }
  }

  await db.transaction(async (tx) => {
    const result = await tx
      .delete(transaction)
      .where(eq(transaction.id, transactionId))
      .returning({ id: transaction.id })

    if (!result || result.length === 0) {
      throw new Error("Failed to delete transaction")
    }
  })

  if (options?.redirectOnSuccess !== false) refresh()

  return { success: true, error: null }
}
