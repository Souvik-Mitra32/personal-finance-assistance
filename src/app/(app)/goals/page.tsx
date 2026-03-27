import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/queries/auth"
import { getFinancialProfileByUserId } from "@/lib/queries/financial-profiles"
import { getGoalsByFinancialProfileId } from "@/lib/queries/goals"
import { getOrCreateMonthlyCycle } from "@/lib/finance/monthly-cycle"

import GoalCard from "@/components/cards/goal-card"
import AddGoalButton from "@/components/buttons/add-goal-button"
import { getContributionsByGoalId } from "@/lib/queries/goal-contributions"
import { Goal } from "@/lib/drizzle/schema"

export default async function GoalsPage() {
  const user = await getCurrentUser()

  const financialProfile = await getFinancialProfileByUserId(user.id)
  if (financialProfile == null) redirect("/")

  const cycle = await getOrCreateMonthlyCycle(financialProfile.id, new Date())
  if (cycle == null) redirect("/")

  const goals = await getGoalsByFinancialProfileId(financialProfile.id)

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <section className="space-y-5">
        <div className="flex justify-between flex-wrap gap-4">
          <div className="max-w-80 space-y-1">
            <h1 className="text-2xl font-semibold">Goals</h1>
          </div>

          <div className="flex gap-3 justify-end">
            <AddGoalButton />
          </div>
        </div>

        <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-4">
          {/* TODO: Add empty state */}
          {goals.map((goal) => (
            <GoalCardWrapper
              key={goal.id}
              goal={goal}
              goalAllocationInPaisa={cycle.goalAllocationInPaisa}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

async function GoalCardWrapper({
  goalAllocationInPaisa,
  goal,
}: {
  goalAllocationInPaisa: number
  goal: Goal
}) {
  const contributions = await getContributionsByGoalId(goal.id)

  return (
    <GoalCard
      goal={goal}
      goalAllocationInPaisa={goalAllocationInPaisa}
      contributions={contributions}
    />
  )
}
