import { format } from "date-fns"

import { Goal, GoalContribution } from "@/lib/drizzle/schema"
import { getContributionsByGoalId } from "@/lib/queries/goal-contributions"

import { formatCurrencyFromPaisa } from "@/lib/formatters"

import ContributionDropdownMenu from "../dropdown-menus/contribution-dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ContributionsTable({
  goal,
  contributions,
  totalContributionInPaisa,
}: {
  goal: Pick<Goal, "id" | "targetAmountInPaisa">
  contributions: GoalContribution[]
  totalContributionInPaisa: number
}) {
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
        {contributions.map((contribution) => (
          <TableRow key={contribution.id}>
            <TableCell className="text-green-500 font-medium">
              +{formatCurrencyFromPaisa(contribution.amountInPaisa)}
            </TableCell>
            <TableCell>
              {format(contribution.createdAt, "MMM dd, yyyy")}
            </TableCell>
            <TableCell>
              <p className="max-w-[30ch] truncate">
                {contribution.note ?? "NA"}
              </p>
            </TableCell>
            <TableCell className="text-right">
              <ContributionDropdownMenu
                goal={goal}
                totalContributionInPaisa={totalContributionInPaisa}
                contribution={contribution}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
