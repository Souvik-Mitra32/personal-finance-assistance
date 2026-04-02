"use client"

import { useState } from "react"

import { Transaction } from "@/lib/drizzle/schema"

import { MoreHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import EditTransactionDropdownMenuItem from "../dropdown-menu-items/edit-transaction-dropdown-menu-item"
import DeleteTransactionDropdownMenuItem from "../dropdown-menu-items/delete-transaction-dropdown-menu-item"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TransactionDropdownMenu({
  financialProfileId,
  cycleStartDate,
  transaction,
}: {
  financialProfileId: string
  cycleStartDate: Date
  transaction: Transaction
}) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontalIcon />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <EditTransactionDropdownMenuItem
          financialProfileId={financialProfileId}
          cycleStartDate={cycleStartDate}
          defaultValues={transaction}
          onClose={() => setOpen(false)}
        />
        <DropdownMenuSeparator />
        <DeleteTransactionDropdownMenuItem
          transactionId={transaction.id}
          onClose={() => setOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
