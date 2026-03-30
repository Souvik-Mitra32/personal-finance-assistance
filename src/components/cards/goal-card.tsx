"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { Goal } from "@/lib/drizzle/schema"
import { formatCurrencyFromPaisa } from "@/lib/formatters"
import { getGoalProgressData, getGoalStatus } from "@/lib/utils/goal-progress"

import { BellRing } from "lucide-react"
import { Separator } from "../ui/separator"
import { Label } from "../ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import GoalBadge from "../badges/goal-badge"
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
  totalContributionInPaisa,
}: {
  goalAllocationInPaisa: number
  goal: Pick<
    Goal,
    "id" | "name" | "status" | "targetAmountInPaisa" | "targetDate" | "slug"
  >
  totalContributionInPaisa: number
}) {
  const router = useRouter()
  const goalProgressData = getGoalProgressData(
    goal.targetAmountInPaisa,
    totalContributionInPaisa,
  )

  const status = getGoalStatus(goal, totalContributionInPaisa)
  const isContributable = status === "active"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <CardTitle>{goal.name}</CardTitle>
          <GoalBadge status={status} />
        </div>
        <CardAction>
          <GoalDropdownMenu
            goal={goal}
            goalAllocationInPaisa={goalAllocationInPaisa}
            totalContributionInPaisa={totalContributionInPaisa}
            isContributable={isContributable}
          />
        </CardAction>
      </CardHeader>
      <CardContent
        onClick={() => router.push(`/goals/${goal.slug}`)}
        className="cursor-pointer"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-xl font-medium">
              {formatCurrencyFromPaisa(goal.targetAmountInPaisa)}
            </div>
            <Progress value={goalProgressData.progressPercentage} />
            <div className="flex items-center gap-4">
              <div className="mr-auto text-lg font-medium">
                {formatCurrencyFromPaisa(totalContributionInPaisa)}{" "}
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
