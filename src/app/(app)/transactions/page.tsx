import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/queries/auth"
import { getFinancialProfileByUserId } from "@/lib/queries/financial-profiles"
import { getTransactionsByFinancialProfileId } from "@/lib/queries/transactions"

import { Card, CardContent } from "@/components/ui/card"
import FilterTransactionsDialog from "@/components/dialogs/filter-transactions-dialog"
import TransactionsTable from "@/components/tables/transactions-table"
import TransactionFormDialog from "@/components/dialogs/transaction-form-dialog"

export default async function TransactionsPage() {
  const user = await getCurrentUser()
  const financialProfile = await getFinancialProfileByUserId(user.id)

  if (financialProfile == null) redirect("/")

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
            {/* <FilterTransactionsDialog /> */}
            <TransactionFormDialog
              financialProfileId={financialProfile.id}
              cycleStartDay={financialProfile.cycleStartDay}
            />
          </div>
        </div>

        <Card>
          <CardContent>
            <TransactionsTable transactions={transactions} />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
