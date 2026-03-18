import { getTotalDebitTransactionAmountByCycle } from "../queries/transactions"
import { getMonthlyCycleById } from "./monthly-cycle"

export async function getCycleFinancialState(cycleId: string) {
  const res = await getMonthlyCycleById(cycleId)
  if (!res) return null

  const { spendingBudgetInPaisa } = res

  const totalDebitAmountInPaisa =
    (await getTotalDebitTransactionAmountByCycle(cycleId)) ?? 0

  const effectiveBudget = Math.max(0, spendingBudgetInPaisa)

  const monthSurplusInPaisa = Math.max(
    0,
    effectiveBudget - totalDebitAmountInPaisa,
  )

  const monthDeficitInPaisa = Math.max(
    0,
    totalDebitAmountInPaisa - effectiveBudget,
  )

  const safeToSpendInPaisa = monthSurplusInPaisa

  return {
    spendingBudgetInPaisa: effectiveBudget,
    totalDebitAmountInPaisa,
    monthSurplusInPaisa,
    monthDeficitInPaisa,
    safeToSpendInPaisa,
  }
}
