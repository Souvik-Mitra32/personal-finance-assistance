import { and, eq, sum } from "drizzle-orm"
import { db } from "../drizzle/db"
import { transaction } from "../drizzle/schema"

export async function getTransactionsByFinancialProfileId(
  financialProfileId: string,
) {
  return db.query.transaction.findMany({
    where: eq(transaction.financialProfileId, financialProfileId),
    orderBy: (transaction, { desc }) => desc(transaction.date),
  })
}

export async function getTotalDebitTransactionAmountByCycle(cycleId: string) {
  const [{ amount }] = await db
    .select({ amount: sum(transaction.amountInPaisa) })
    .from(transaction)
    .where(and(eq(transaction.cycleId, cycleId), eq(transaction.type, "debit")))

  return Number(amount) ?? 0
}
