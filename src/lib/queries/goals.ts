import { db } from "../drizzle/db"

export async function getGoalsByFinancialProfileId(financialProfileId: string) {
  return await db.query.goal.findMany({
    where: (g, { eq }) => eq(g.financialProfileId, financialProfileId),
  })
}

export async function getGoalById(goalId: string) {
  const res = await db.query.goal.findFirst({
    where: (g, { eq }) => eq(g.id, goalId),
  })

  return res ?? null
}

export async function getGoalBySlug(slug: string) {
  const res = await db.query.goal.findFirst({
    where: (g, { eq }) => eq(g.slug, slug),
  })

  return res ?? null
}
