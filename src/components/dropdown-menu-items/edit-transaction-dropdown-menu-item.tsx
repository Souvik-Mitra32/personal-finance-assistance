"use client"

import { useState } from "react"

import { Transaction } from "@/lib/drizzle/schema"

import { DropdownMenuItem } from "../ui/dropdown-menu"
import AppDialog from "@/components/app-dialog"
import TransactionForm from "@/components/forms/transaction-form"

export default function EditTransactionDropdownMenuItem({
  financialProfileId,
  cycleStartDate,
  defaultValues,
  onClose,
}: {
  financialProfileId: string
  cycleStartDate: Date
  defaultValues: Pick<
    Transaction,
    | "id"
    | "description"
    | "amountInPaisa"
    | "date"
    | "type"
    | "category"
    | "note"
  >
  onClose?: () => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleDialogClose() {
    setDialogOpen(false)
    onClose?.()
  }

  return (
    <AppDialog
      title="Edit Transaction"
      open={dialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleDialogClose()
        }
        setDialogOpen(open)
      }}
      trigger={
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            setDialogOpen(true)
          }}
        >
          Edit
        </DropdownMenuItem>
      }
    >
      {({ close }) => (
        <TransactionForm
          financialProfileId={financialProfileId}
          cycleStartDate={cycleStartDate}
          defaultValues={defaultValues}
          onSuccess={() => {
            close()
            onClose?.()
          }}
        />
      )}
    </AppDialog>
  )
}
