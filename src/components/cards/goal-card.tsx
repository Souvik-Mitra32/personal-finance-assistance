"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { Goal, GoalContribution } from "@/lib/drizzle/schema"
import { formatCurrencyFromPaisa } from "@/lib/formatters"

import { BellRing } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "../ui/separator"
import { Label } from "../ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import GoalDropdownMenu from "../dropdown-menus/goal-dropdown-menu"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function GoalCard({
  goalAllocationInPaisa,
  goal,
  contributions,
}: {
  goalAllocationInPaisa: number
  goal: Pick<
    Goal,
    "id" | "name" | "status" | "targetAmountInPaisa" | "targetDate" | "slug"
  >
  contributions: GoalContribution[]
}) {
  const router = useRouter()
  const goalProgressData = getGoalProgressData(
    goal.targetAmountInPaisa,
    contributions,
  )

  const badgeVariant =
    goal.status === "paused"
      ? "outline"
      : goal.status === "completed"
        ? "success"
        : goal.status === "cancelled"
          ? "destructive"
          : ("default" as const)

  return (
    <Card
      onClick={() => router.push(`/goals/${goal.slug}`)}
      className="cursor-pointer"
    >
      <CardHeader>
        <div className="flex items-center space-x-2">
          <CardTitle>{goal.name}</CardTitle>
          <Badge variant={badgeVariant}>{goal.status}</Badge>
        </div>
        <CardAction>
          <GoalDropdownMenu
            goal={goal}
            goalAllocationInPaisa={goalAllocationInPaisa}
            totalContributionInPaisa={goalProgressData.totalContributionInPaisa}
          />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-xl font-medium">
              {formatCurrencyFromPaisa(goal.targetAmountInPaisa)}
            </div>
            <Progress value={goalProgressData.progressPercentage} />
            <div className="flex items-center gap-4">
              <div className="mr-auto text-lg font-medium">
                {formatCurrencyFromPaisa(
                  goalProgressData.totalContributionInPaisa,
                )}{" "}
                <span className="text-sm text-muted-foreground">
                  Saved so far
                </span>
              </div>
              <div className="text-muted-foreground">
                {goalProgressData.progressPercentage}%
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="mr-auto text-muted-foreground">Target</div>
              <div>{format(goal.targetDate, "MMM, yyyy")}</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="mr-auto text-muted-foreground">Remaining</div>
              <div>
                {formatCurrencyFromPaisa(goalProgressData.remainingInPaisa)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <div className="w-full flex items-center space-x-3">
          <div className="flex items-center space-x-2 mr-auto">
            <Label htmlFor="auto-save" className="text-muted-foreground">
              Auto-save
            </Label>
            <Switch id="auto-save" defaultChecked={false} disabled />
          </div>

          <div className="flex items-center space-x-2 text-muted-foreground">
            <BellRing />
            <div>Apr 5</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

function getGoalProgressData(
  target: number,
  contributions: GoalContribution[],
) {
  const saved = contributions.reduce((a, c) => a + c.amountInPaisa, 0)

  if (saved === 0)
    return {
      totalContributionInPaisa: 0,
      remainingInPaisa: target,
      progressPercentage: 0,
    }

  if (saved >= target)
    return {
      totalContributionInPaisa: target,
      remainingInPaisa: 0,
      progressPercentage: 100,
    }

  const progressPercentage = (saved / target) * 100

  return {
    totalContributionInPaisa: saved,
    remainingInPaisa: target - saved,
    progressPercentage: Math.min(progressPercentage, 100),
  }
}
