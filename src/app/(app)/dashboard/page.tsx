import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/queries/auth"
import { getFinancialProfileByUserId } from "@/lib/queries/financial-profiles"

import { getOrCreateMonthlyCycle } from "@/lib/finance/monthly-cycle"
import { getCycleFinancialState } from "@/lib/finance/financial-state"
import { getTransactionsByFinancialProfileId } from "@/lib/queries/transactions"
import { getSpendingByCategory } from "@/lib/queries/expenses"

import { formatCurrencyFromPaisa } from "@/lib/formatters"

import TransactionsTable from "@/components/tables/transactions-table"
import GoalsTable from "@/components/tables/goals-table"
import EmptyData from "@/components/empty-data"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeftRight, Flag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getAllGoals } from "@/lib/queries/goals"

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

  const [goals, spendings] = await Promise.all([
    getAllGoals(financialProfile.id),
    getSpendingByCategory(financialProfile.id, monthlyCycle),
  ])

  const spent = cycleState.totalDebitAmountInPaisa
  const budget = cycleState.spendingBudgetInPaisa
  const usage = getUsageData(
    cycleState.totalDebitAmountInPaisa,
    cycleState.spendingBudgetInPaisa,
  )

  return (
    <section className="space-y-5">
      <div className="max-w-80 space-y-1">
        <h1 className="text-2xl font-semibold">Dashbaord</h1>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6 min-w-0">
          {/* Safe to Spend */}
          <div className="space-y-2">
            <div className="font-medium">Safe to Spend</div>

            <div className="flex flex-wrap items-baseline space-x-2">
              <div className="text-4xl">
                {formatCurrencyFromPaisa(cycleState.safeToSpendInPaisa)}
              </div>
              <div className="text-muted-foreground text-sm">
                {usage.details}
              </div>
            </div>

            <div className="text-sm">
              {formatCurrencyFromPaisa(spent)} /{" "}
              {formatCurrencyFromPaisa(budget)}
            </div>

            <Progress value={usage.usagePercentage} />

            <div className="flex justify-between text-sm">
              <Badge variant="outline">{usage.status}</Badge>
              <span>{usage.usagePercentage.toFixed(0)}%</span>
            </div>
          </div>

          {/* Goal progress */}
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="font-medium">Goal Progress</div>
            </div>

            {goals.length > 0 ? (
              <GoalsTable goals={goals} />
            ) : (
              <EmptyData
                title="No goals found"
                description="No goals yet. Lets add your first goal."
                icon={<Flag />}
                className="border border-dashed"
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6 min-w-0">
          {/* Spendings */}
          <div className="@container lg:col-span-2 space-y-2">
            <div className="space-y-1">
              <div className="font-medium">Spendings</div>
              <div className="text-sm text-muted-foreground">
                Expenses by categories this month
              </div>
            </div>

            <div className="grid @[596px]:grid-cols-3 @[396px]:grid-cols-2 gap-4">
              {spendings.map(({ category, amountInPaisa }) => (
                <Card key={category}>
                  <CardContent className="space-y-2">
                    <div className="text-muted-foreground">
                      {category.slice(0, 1).toUpperCase()}
                      {category.slice(1).replace("_", " ")}
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <div className="text-lg font-medium mr-auto">
                        {formatCurrencyFromPaisa(Number(amountInPaisa) ?? 0)}
                      </div>
                      {/* <div className="flex items-center gap-1">
                        <ArrowUp size={14} />
                        <span className="text-sm">8%</span>
                      </div> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Configurations */}
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="font-medium">Configurations</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center space-x-2">
                <span className="text-muted-foreground">Income</span>
                <span>
                  {formatCurrencyFromPaisa(
                    financialProfile.monthlyIncomeInPaisa,
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center space-x-2">
                <span className="text-muted-foreground">Expense</span>
                <span>
                  {formatCurrencyFromPaisa(
                    financialProfile.fixedMonthlyExpensesInPaisa,
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center space-x-2">
                <span className="text-muted-foreground">Saving Rate</span>
                <span>{financialProfile.savingsRate}%</span>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="font-medium">Recent Transactions</div>
            </div>

            {transactions.length > 0 ? (
              <TransactionsTable
                financialProfileId={financialProfile.id}
                cycleStartDay={financialProfile.cycleStartDay}
                transactions={transactions}
              />
            ) : (
              <EmptyData
                title="No transactions found"
                description="No transactions yet. Lets add your first transaction."
                icon={<ArrowLeftRight />}
                className="border border-dashed"
              />
            )}
          </div>
        </div>
      </div>
    </section>
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
