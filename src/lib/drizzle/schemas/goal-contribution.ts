import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { goal } from "./goal"

export const goalContribution = pgTable("goal_contribution", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),

  goalId: text("goal_id")
    .notNull()
    .references(() => goal.id, { onDelete: "cascade" }),

  amountInPaisa: integer("amount_in_paisa").notNull(),

  note: text("note"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const goalContributionRelations = relations(
  goalContribution,
  ({ one }) => ({
    goal: one(goal, {
      fields: [goalContribution.goalId],
      references: [goal.id],
    }),
  }),
)

export type GoalContribution = typeof goalContribution.$inferSelect
