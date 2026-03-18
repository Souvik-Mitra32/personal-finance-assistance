"use client"

import { ActionDropdownMenuItem } from "../ui/action-dropdown-menu-item"

export default function DeleteTransactionDropdownMenuItem() {
  return (
    <ActionDropdownMenuItem
      variant="destructive"
      onSelect={(e) => e.preventDefault()}
      action={async () => ({ error: false })}
      requireAreYouSure
    >
      Delete
    </ActionDropdownMenuItem>
  )
}
