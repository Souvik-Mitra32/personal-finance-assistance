"use client"

import { Transaction } from "@/lib/drizzle/schema"

import { DropdownMenuItem } from "../ui/dropdown-menu"
import AppDialog from "@/components/app-dialog"
import TransactionForm from "@/components/forms/transaction-form"

export default function EditTransactionDropdownMenuItem({
  financialProfileId,
  cycleStartDay,
  defaultValues,
}: {
  financialProfileId: string
  cycleStartDay: number
  defaultValues?: Pick<
    Transaction,
    "description" | "amountInPaisa" | "date" | "type" | "category" | "note"
  >
}) {
  return (
    <AppDialog
      title="Edit Transaction"
      trigger={
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Edit
        </DropdownMenuItem>
      }
    >
      {({ close }) => (
        <TransactionForm
          financialProfileId={financialProfileId}
          cycleStartDay={cycleStartDay}
          defaultValues={defaultValues}
          onSuccess={close}
        />
      )}
    </AppDialog>
  )
}
