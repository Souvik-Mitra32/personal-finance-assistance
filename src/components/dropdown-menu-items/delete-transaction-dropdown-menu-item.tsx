"use client"

import { deleteTransactionAction } from "@/lib/actions/transactions"
import { ActionDropdownMenuItem } from "../ui/action-dropdown-menu-item"

export default function DeleteTransactionDropdownMenuItem({
  transactionId,
  onClose,
}: {
  transactionId: string
  onClose?: () => void
}) {
  async function deleteTransaction() {
    const res = await deleteTransactionAction(transactionId)

    if (!res.success) {
      onClose?.()
      return {
        error: true,
        message: res.error || "Failed to delete transaction",
      }
    }

    return { error: false }
  }

  return (
    <ActionDropdownMenuItem
      variant="destructive"
      onSelect={(e) => e.preventDefault()}
      action={deleteTransaction}
      requireAreYouSure
    >
      Delete
    </ActionDropdownMenuItem>
  )
}
