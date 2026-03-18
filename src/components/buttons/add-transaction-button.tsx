"use client"

import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import AppDialog from "@/components/app-dialog"
import TransactionForm from "@/components/forms/transaction-form"

export default function AddTransactionButton({
  financialProfileId,
  cycleStartDay,
}: {
  financialProfileId: string
  cycleStartDay: number
}) {
  return (
    <AppDialog
      title="Add Transaction"
      trigger={
        <Button>
          <Plus />
          Add Transaction
        </Button>
      }
    >
      {({ close }) => (
        <TransactionForm
          financialProfileId={financialProfileId}
          cycleStartDay={cycleStartDay}
          onSuccess={close}
        />
      )}
    </AppDialog>
  )
}
