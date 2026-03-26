import { db } from "../drizzle/db"

export async function getContributionsByGoalId(goalId: string) {
  return db.query.goalContribution.findMany({
    where: (c, { eq }) => eq(c.goalId, goalId),
    orderBy: (c, { desc }) => desc(c.createdAt),
  })
}
