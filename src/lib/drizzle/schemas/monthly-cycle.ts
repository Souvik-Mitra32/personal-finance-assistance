import {
  pgTable,
  text,
  timestamp,
  date,
  bigint,
  pgEnum,
  index,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { financialProfile } from "./financial-profile"
import { transaction } from "./transaction"

export const cycleStatusEnum = pgEnum("cycle_status", ["active", "closed"])

export const monthlyCycle = pgTable(
  "monthly_cycle",
  {
    id: text("id")
      .primaryKey()
      .$default(() => crypto.randomUUID()),

    financialProfileId: text("financial_profile_id")
      .notNull()
      .references(() => financialProfile.id, { onDelete: "cascade" }),

    cycleMonth: text("cycle_month").notNull(), // e.g. 2026-03

    cycleStartDate: date("cycle_start_date", { mode: "date" }).notNull(),
    cycleEndDate: date("cycle_end_date", { mode: "date" }).notNull(),

    baseSurplusInPaisa: bigint("base_surplus_in_paisa", {
      mode: "number",
    }).notNull(),

    carryoverDeficitInPaisa: bigint("carryover_deficit_in_paisa", {
      mode: "number",
    })
      .notNull()
      .default(0),

    availableSurplusInPaisa: bigint("available_surplus_in_paisa", {
      mode: "number",
    }).notNull(),

    goalAllocationInPaisa: bigint("goal_allocation_in_paisa", {
      mode: "number",
    }).notNull(),

    spendingBudgetInPaisa: bigint("spending_budget_in_paisa", {
      mode: "number",
    }).notNull(),

    deficitCarryForwardInPaisa: bigint("deficit_carry_forward_in_paisa", {
      mode: "number",
    })
      .notNull()
      .default(0),

    status: cycleStatusEnum("status").notNull().default("active"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("monthly_cycle_financial_profile_idx").on(table.financialProfileId),
  ],
)

export const monthlyCycleRelations = relations(
  monthlyCycle,
  ({ one, many }) => ({
    financialProfile: one(financialProfile, {
      fields: [monthlyCycle.financialProfileId],
      references: [financialProfile.id],
    }),
    transactions: many(transaction),
  }),
)
