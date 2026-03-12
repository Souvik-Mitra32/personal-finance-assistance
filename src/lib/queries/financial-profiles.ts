import { db } from "@/lib/drizzle/db"

export type FinancialProfile = {
  id: string
  monthlyIncomeInPaisa: number
  fixedMonthlyExpensesInPaisa: number
  savingsRate: number
  cycleStartDay: number
  unallocatedBalanceInPaisa: number
  reserveBalanceInPaisa: number
}

export async function getFinancialProfileByUserId(
  userId: string,
): Promise<FinancialProfile | null> {
  const res = await db.query.financialProfile.findFirst({
    where: (t, f) => f.eq(t.userId, userId),
  })

  return res ?? null
}
