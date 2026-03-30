import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { formatCurrencyFromPaisa } from "@/lib/formatters"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontal } from "lucide-react"

export default function ContributionsTable() {
  return (
    <Table className="text-gray-500">
      <TableHeader>
        <TableRow>
          <TableHead className="text-gray-500">Amount</TableHead>
          <TableHead className="text-gray-500 w-[24%]">Date</TableHead>
          <TableHead className="text-gray-500 w-[36%]">Note</TableHead>
          <TableHead className="text-right w-[8%]">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="text-green-500 font-medium">
            +{formatCurrencyFromPaisa(100000)}
          </TableCell>
          <TableCell>Mar 27, 2026</TableCell>
          <TableCell>
            <p className="truncate">Nothing</p>
          </TableCell>
          <TableCell className="text-right">
            <MoreHorizontal size={16} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
