import { Goal } from "@/lib/drizzle/schema"
import { getGoalProgress } from "@/lib/finance/goal"

import { formatCurrencyFromPaisa } from "@/lib/formatters"

import { Progress } from "../ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function GoalsTable({
  goals,
}: {
  goals: { goal: Goal; totalContributionInPaisa: number }[]
}) {
  return (
    <Table className="text-gray-500">
      <TableHeader>
        <TableRow>
          <TableHead className="text-gray-500">Goals</TableHead>
          <TableHead className="text-gray-500">Saved</TableHead>
          <TableHead className="text-gray-500">Progress</TableHead>
          <TableHead className="text-right text-gray-500">Remaining</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {goals.map(async ({ goal }) => {
          const progress = await getGoalProgress(goal.id)
          return (
            progress && (
              <TableRow key={goal.id}>
                <TableCell>
                  <div className="text-accent-foreground font-medium">
                    {goal.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatCurrencyFromPaisa(progress.targetAmountInPaisa)}
                  </div>
                </TableCell>
                <TableCell>
                  {formatCurrencyFromPaisa(progress.totalSavedInPaisa)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Progress value={progress.progressPercentage} />
                    <div>{progress.progressPercentage.toFixed(0)}%</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">365 days</TableCell>
              </TableRow>
            )
          )
        })}
      </TableBody>
    </Table>
  )
}
