import { notFound, redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/queries/auth"
import { getFinancialProfileByUserId } from "@/lib/queries/financial-profiles"
import { getGoalBySlug } from "@/lib/queries/goals"

export default async function GoalDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const user = await getCurrentUser()

  const financialProfile = await getFinancialProfileByUserId(user.id)
  if (financialProfile == null) redirect("/")

  const { slug } = await params
  const goalSlug = decodeURIComponent(slug)

  const goal = await getGoalBySlug(goalSlug)
  if (goal == null) return notFound()

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <section className="space-y-5">{goal.name}</section>
    </main>
  )
}
