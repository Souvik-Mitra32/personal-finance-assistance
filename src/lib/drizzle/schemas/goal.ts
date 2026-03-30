import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { financialProfile } from "./financial-profile"
import { goalContribution } from "./goal-contribution"

export const GOAL_STATUSES = ["active", "paused"] as const

const goalStatusEnum = pgEnum("goal_status", GOAL_STATUSES)

export const goal = pgTable(
  "goal",
  {
    id: text("id")
      .primaryKey()
      .$default(() => crypto.randomUUID()),

    financialProfileId: text("financial_profile_id")
      .notNull()
      .references(() => financialProfile.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    targetAmountInPaisa: integer("target_amount_in_paisa").notNull(),
    targetDate: date("target_date", { mode: "date" }).notNull(),

    status: goalStatusEnum("status").notNull().default("active"),

    slug: text("slug").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (c) => [
    unique("unique_goal_slug").on(c.slug),
    unique("unique_goal_name").on(c.name),
  ],
)

export const goalRelations = relations(goal, ({ one, many }) => ({
  financialProfile: one(financialProfile, {
    fields: [goal.financialProfileId],
    references: [financialProfile.id],
  }),
  contributions: many(goalContribution),
}))

export type Goal = typeof goal.$inferSelect
