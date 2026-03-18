import { Transaction } from "@/lib/drizzle/schema"

import { MoreHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, convertPaisaToRupees } from "@/lib/utils"
import { formatCurrency, formatDate } from "@/lib/formatters"

export default function TransactionsTable({
  transactions,
}: {
  transactions: Transaction[]
}) {
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
                {formatCurrency(convertPaisaToRupees(tx.amountInPaisa))}
              </TableCell>
              <TableCell>{formatDate(tx.date.toLocaleDateString())}</TableCell>
              <TableCell>{`${`${tx.category.slice(0, 1).toUpperCase()}${tx.category.slice(1)}`.replace("_", " ")}`}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
