import { and, desc, eq, sql } from "drizzle-orm"
import { db } from "../drizzle/db"
import { goal, goalContribution } from "../drizzle/schema"

export async function getAllGoals(financialProfileId: string) {
  return db
    .select({
      goal,
      totalContributionInPaisa: sql<number>`coalesce(sum(${goalContribution.amountInPaisa}), 0)`,
    })
    .from(goal)
    .leftJoin(goalContribution, eq(goalContribution.goalId, goal.id))
    .where(and(eq(goal.financialProfileId, financialProfileId)))
    .groupBy(goal.id)
    .orderBy(desc(goal.targetDate), desc(goal.status))
}

export async function getActiveGoals(financialProfileId: string) {
  return db
    .select({
      goal,
      totalContributionInPaisa: sql<number>`coalesce(sum(${goalContribution.amountInPaisa}), 0)`,
    })
    .from(goal)
    .leftJoin(goalContribution, eq(goalContribution.goalId, goal.id))
    .where(
      and(
        eq(goal.financialProfileId, financialProfileId),
        eq(goal.status, "active"),
      ),
    )
    .groupBy(goal.id)
    .having(
      sql`
      coalesce(sum(${goalContribution.amountInPaisa}), 0) < ${goal.targetAmountInPaisa}
      AND ${goal.targetDate} >= now()
    `,
    )
}

export async function getGoalById(goalId: string) {
  const res = await db
    .select({
      goal,
      totalContributionInPaisa: sql<number>`coalesce(sum(${goalContribution.amountInPaisa}), 0)`,
    })
    .from(goal)
    .leftJoin(goalContribution, eq(goalContribution.goalId, goal.id))
    .where(and(eq(goal.id, goalId)))
    .groupBy(goal.id)

  return res[0] ?? null
}

export async function getGoalBySlug(slug: string) {
  const res = await db
    .select({
      goal,
      totalContributionInPaisa: sql<number>`coalesce(sum(${goalContribution.amountInPaisa}), 0)`,
    })
    .from(goal)
    .leftJoin(goalContribution, eq(goalContribution.goalId, goal.id))
    .where(and(eq(goal.slug, slug)))
    .groupBy(goal.id)

  return res[0] ?? null
}
