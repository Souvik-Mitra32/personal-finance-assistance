import { and, eq, gte, lte, sum } from "drizzle-orm"
import { db } from "../drizzle/db"
import { transaction } from "../drizzle/schema"

export async function getSpendingByCategory(
  financialProfileId: string,
  monthlyCycle: { cycleStartDate: Date; cycleEndDate: Date },
) {
  return db
    .select({
      category: transaction.category,
      amountInPaisa: sum(transaction.amountInPaisa),
    })
    .from(transaction)
    .where(
      and(
        eq(transaction.financialProfileId, financialProfileId),
        gte(transaction.date, monthlyCycle.cycleStartDate),
        lte(transaction.date, monthlyCycle.cycleEndDate),
      ),
    )
    .groupBy(transaction.category)
}
