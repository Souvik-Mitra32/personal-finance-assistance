"use client"

import { useState } from "react"

import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import AppDialog from "@/components/app-dialog"
import TransactionForm from "@/components/forms/transaction-form"

export default function AddTransactionButton({
  financialProfileId,
  cycleStartDate,
}: {
  financialProfileId: string
  cycleStartDate: Date
}) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <AppDialog
      title="Add Transaction"
      open={dialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          setDialogOpen(false)
        }
        setDialogOpen(open)
      }}
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
          cycleStartDate={cycleStartDate}
          onSuccess={() => {
            close()
            setDialogOpen(false)
          }}
        />
      )}
    </AppDialog>
  )
}
