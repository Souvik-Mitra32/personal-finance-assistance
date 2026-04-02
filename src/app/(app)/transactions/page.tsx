import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/queries/auth"
import { getFinancialProfileByUserId } from "@/lib/queries/financial-profiles"
import { getTransactionsByFinancialProfileId } from "@/lib/queries/transactions"

import { Card, CardContent } from "@/components/ui/card"
import TransactionsTable from "@/components/tables/transactions-table"
import AddTransactionButton from "@/components/buttons/add-transaction-button"
import { determineCycleWindow } from "@/lib/finance/monthly-cycle"

export default async function TransactionsPage() {
  const user = await getCurrentUser()
  const financialProfile = await getFinancialProfileByUserId(user.id)

  if (financialProfile == null) redirect("/")

  const { cycleStartDate } = determineCycleWindow(
    new Date(),
    financialProfile.cycleStartDay,
  )

  const transactions = await getTransactionsByFinancialProfileId(
    financialProfile.id,
  )

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <section className="space-y-5">
        <div className="flex justify-between flex-wrap gap-4">
          <div className="max-w-80 space-y-1">
            <h1 className="text-2xl font-semibold">Transactions</h1>
          </div>

          <div className="flex gap-3 justify-end">
            {/* TODO: Add filter button */}

            <AddTransactionButton
              financialProfileId={financialProfile.id}
              cycleStartDate={cycleStartDate}
            />
          </div>
        </div>

        <Card>
          <CardContent>
            <TransactionsTable
              transactions={transactions}
              financialProfileId={financialProfile.id}
              cycleStartDay={financialProfile.cycleStartDay}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
