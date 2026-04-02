import { format } from "date-fns"

import { Transaction } from "@/lib/drizzle/schema"

import { cn } from "@/lib/utils"
import { formatCurrencyFromPaisa } from "@/lib/formatters"

import TransactionDropdownMenu from "../dropdown-menus/transaction-dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { determineCycleWindow } from "@/lib/finance/monthly-cycle"

export default function TransactionsTable({
  financialProfileId,
  cycleStartDay,
  transactions,
}: {
  financialProfileId: string
  cycleStartDay: number
  transactions: Transaction[]
}) {
  const { cycleStartDate } = determineCycleWindow(new Date(), cycleStartDay)
  return (
    <Table className="text-gray-500">
      <TableHeader>
        <TableRow>
          <TableHead className="text-gray-500">Transactions</TableHead>
          <TableHead className="text-gray-500 w-[16%]">Amount</TableHead>
          <TableHead className="text-gray-500 w-[20%]">Date</TableHead>
          <TableHead className="text-gray-500 w-[24%]">Category</TableHead>
          <TableHead className="text-right w-[8%]">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions &&
          transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="text-accent-foreground font-medium">
                {tx.description}
              </TableCell>
              <TableCell
                className={cn(
                  tx.type === "debit" ? "text-destructive" : "text-success",
                )}
              >
                {tx.type === "debit" ? "-" : "+"}
                {formatCurrencyFromPaisa(tx.amountInPaisa)}
              </TableCell>
              <TableCell>{format(tx.date, "MMM dd, yyyy")}</TableCell>
              <TableCell>{`${`${tx.category.slice(0, 1).toUpperCase()}${tx.category.slice(1)}`.replace("_", " ")}`}</TableCell>
              <TableCell className="text-right">
                <TransactionDropdownMenu
                  financialProfileId={financialProfileId}
                  cycleStartDate={cycleStartDate}
                  transaction={tx}
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
