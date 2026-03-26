import { eq, sql } from "drizzle-orm"
import { db } from "../drizzle/db"
import { goalContribution } from "../drizzle/schema"
import { getGoalById } from "../queries/goals"

export async function getGoalProgress(goalId: string) {
  const goal = await getGoalById(goalId)

  if (!goal) return null

  const contributions = await db
    .select({
      total: sql<number>`coalesce(sum(${goalContribution.amountInPaisa}), 0)`,
    })
    .from(goalContribution)
    .where(eq(goalContribution.goalId, goalId))

  const totalSaved = contributions[0]?.total ?? 0
  const target = goal.targetAmountInPaisa

  const progressPercentage = target === 0 ? 0 : (totalSaved / target) * 100

  return {
    targetAmountInPaisa: target,
    totalSavedInPaisa: totalSaved,
    remainingInPaisa: Math.max(0, target - totalSaved),
    progressPercentage: Math.min(progressPercentage, 100),
    isCompleted: totalSaved >= target,
  }
}
