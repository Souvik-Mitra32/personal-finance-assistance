import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/queries/auth"
import { getFinancialProfileByUserId } from "@/lib/queries/financial-profiles"
import { getAllGoals } from "@/lib/queries/goals"
import { getOrCreateMonthlyCycle } from "@/lib/finance/monthly-cycle"

import GoalCard from "@/components/cards/goal-card"
import AddGoalButton from "@/components/buttons/add-goal-button"

export default async function GoalsPage() {
  const user = await getCurrentUser()

  const financialProfile = await getFinancialProfileByUserId(user.id)
  if (financialProfile == null) redirect("/")

  const cycle = await getOrCreateMonthlyCycle(financialProfile.id, new Date())
  if (cycle == null) redirect("/")

  const goals = await getAllGoals(financialProfile.id)

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
          {goals.map(({ goal, totalContributionInPaisa }) => (
            <GoalCard
              key={goal.id}
              goalAllocationInPaisa={cycle.goalAllocationInPaisa}
              goal={goal}
              totalContributionInPaisa={totalContributionInPaisa}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
