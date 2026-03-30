import { notFound, redirect } from "next/navigation"
import { differenceInDays, format } from "date-fns"

import { getCurrentUser } from "@/lib/queries/auth"
import { getGoalBySlug } from "@/lib/queries/goals"
import { getOrCreateMonthlyCycle } from "@/lib/finance/monthly-cycle"
import { getGoalProgressData, getGoalStatus } from "@/lib/utils/goal-progress"
import { getFinancialProfileByUserId } from "@/lib/queries/financial-profiles"

import { formatCurrencyFromPaisa } from "@/lib/formatters"
import { normalizeDate } from "@/lib/utils/date"

import { Progress } from "@/components/ui/progress"
import GoalBadge from "@/components/badges/goal-badge"
import AddContributionButton from "@/components/buttons/add-contribution-button"
import EditGoalButton from "@/components/buttons/edit-goal-button"
import ContributionsTable from "@/components/tables/contributions-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DeleteGoalButton from "@/components/buttons/delete-goal-button"
import { getContributionsByGoalId } from "@/lib/queries/goal-contributions"

export default async function GoalDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const user = await getCurrentUser()

  const financialProfile = await getFinancialProfileByUserId(user.id)
  if (financialProfile == null) redirect("/")

  const cycle = await getOrCreateMonthlyCycle(financialProfile.id, new Date())
  if (cycle == null) redirect("/")

  const { slug } = await params
  const goalSlug = decodeURIComponent(slug)

  const data = await getGoalBySlug(goalSlug)
  if (data == null) return notFound()

  const { goal, totalContributionInPaisa } = data

  const contributions = await getContributionsByGoalId(goal.id)
  const today = normalizeDate(new Date())
  const targetDate = normalizeDate(goal.targetDate)

  const remainingDays = differenceInDays(targetDate, today)

  const { progressPercentage, remainingInPaisa } = getGoalProgressData(
    goal.targetAmountInPaisa,
    totalContributionInPaisa,
  )

  const status = getGoalStatus(goal, totalContributionInPaisa)
  const isContributable = status === "active"

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <section className="space-y-5">
        <div className="flex justify-between flex-wrap gap-4">
          <div className="max-w-80 space-y-1">
            <h1 className="text-2xl font-semibold">{goal.name}</h1>
            <GoalBadge status={status} />
          </div>

          <div className="flex gap-3 justify-end">
            <EditGoalButton
              goal={goal}
              totalContributionInPaisa={totalContributionInPaisa}
              variant="outline"
            />
            <DeleteGoalButton
              goalId={goal.id}
              disabled={totalContributionInPaisa > 0}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Progress</CardTitle>
              <CardDescription>
                {progressPercentage.toFixed(0)}% complete
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline space-x-3">
                    <div className="text-3xl font-semibold">
                      {formatCurrencyFromPaisa(totalContributionInPaisa)}
                    </div>
                  </div>

                  <Progress value={progressPercentage} />

                  <div className="flex justify-between space-x-3 text-muted-foreground">
                    <div>
                      {formatCurrencyFromPaisa(remainingInPaisa)} Remaining
                    </div>
                    <div>
                      {Math.max(remainingDays, 0)} day
                      {Math.max(remainingDays, 0) !== 1 ? "s" : ""} left
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="space-y-2">
                  <div className="text-muted-foreground">Target amount</div>
                  <div className="text-xl">
                    {formatCurrencyFromPaisa(goal.targetAmountInPaisa)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-muted-foreground">Target date</div>
                  <div className="text-xl">
                    {format(goal.targetDate, "MMM d, yyyy")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <div className="flex justify-between flex-wrap gap-4">
            <div className="max-w-80 space-y-1">
              <h2 className="text-xl font-semibold">Contributions</h2>
            </div>

            <div className="flex gap-3 justify-end">
              <AddContributionButton
                goal={goal}
                goalAllocationInPaisa={cycle.goalAllocationInPaisa}
                totalContributionInPaisa={totalContributionInPaisa}
                disabled={!isContributable}
              />
            </div>
          </div>

          <Card>
            <CardContent>
              <ContributionsTable
                goal={goal}
                contributions={contributions}
                totalContributionInPaisa={totalContributionInPaisa}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
