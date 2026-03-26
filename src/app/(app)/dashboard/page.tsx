import Link from "next/link"
import { redirect } from "next/navigation"
import { format } from "date-fns"

import { getCurrentUser } from "@/lib/queries/auth"
import { getFinancialProfileByUserId } from "@/lib/queries/financial-profiles"

import { getOrCreateMonthlyCycle } from "@/lib/finance/monthly-cycle"
import { getCycleFinancialState } from "@/lib/finance/financial-state"
import { getTransactionsByFinancialProfileId } from "@/lib/queries/transactions"

import { formatCurrencyFromPaisa } from "@/lib/formatters"

import { Progress } from "@/components/ui/progress"
import TransactionsTable from "@/components/tables/transactions-table"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  const financialProfile = await getFinancialProfileByUserId(user.id)
  if (financialProfile == null) redirect("/")

  const [monthlyCycle, transactions] = await Promise.all([
    getOrCreateMonthlyCycle(financialProfile.id, new Date()),
    getTransactionsByFinancialProfileId(financialProfile.id),
  ])
  if (monthlyCycle == null) redirect("/")

  const cycleState = await getCycleFinancialState(monthlyCycle.id)
  if (cycleState == null) redirect("/")

  const spent = cycleState.totalDebitAmountInPaisa
  const budget = cycleState.spendingBudgetInPaisa
  const usage = getUsageData(
    cycleState.totalDebitAmountInPaisa,
    cycleState.spendingBudgetInPaisa,
  )

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <section className="space-y-5">
        <div className="max-w-80 space-y-1">
          <h1 className="text-2xl font-semibold">Dashbaord</h1>
        </div>

        {/* 1. Safe to Spend */}
        <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Safe to Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {formatCurrencyFromPaisa(cycleState.safeToSpendInPaisa)}
              </div>

              <p className="text-sm text-muted-foreground">{usage.details}</p>

              <div className="text-sm mt-1">
                {formatCurrencyFromPaisa(spent)} /{" "}
                {formatCurrencyFromPaisa(budget)}
              </div>

              <Progress value={usage.usagePercentage} />

              <div className="flex justify-between text-sm mt-2">
                <span>{usage.status}</span>
                <span>{usage.usagePercentage.toFixed(0)}%</span>
              </div>
            </CardContent>
          </Card>

          {/* 2. Cycle Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Cycle Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div>
                {format(monthlyCycle.cycleStartDate, "do MMM")} -{" "}
                {format(monthlyCycle.cycleEndDate, "do MMM")}
              </div>

              <div>Budget: {formatCurrencyFromPaisa(budget)}</div>

              <div>Spent: {formatCurrencyFromPaisa(spent)}</div>
            </CardContent>
          </Card>

          {/* 3. Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardAction>
                <Link href="/transactions">View All</Link>
              </CardAction>
            </CardHeader>
            <CardContent>
              <TransactionsTable
                transactions={transactions.slice(0, 5)}
                financialProfileId={financialProfile.id}
                cycleStartDay={financialProfile.cycleStartDay}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

function getUsageData(spent: number, budget: number) {
  if (budget <= 0) {
    return {
      usagePercentage: 0,
      status: "No Budget",
      details: "No spending budget available",
    }
  }

  const usagePercentage = (spent / budget) * 100
  const cappedPercentage = Math.min(usagePercentage, 100)

  if (usagePercentage > 100)
    return {
      usagePercentage: cappedPercentage,
      status: "Overspent",
      details: `Overspent by ${formatCurrencyFromPaisa(spent - budget)}`,
    }

  if (usagePercentage === 100)
    return {
      usagePercentage: 100,
      status: "Limit Reached",
      details: "Budget fully used",
    }

  if (usagePercentage > 80)
    return {
      usagePercentage: cappedPercentage,
      status: "Near Limit",
      details: "Close to budget limit",
    }

  return {
    usagePercentage: cappedPercentage,
    status: "On Track",
    details: "Remaining for this cycle",
  }
}
