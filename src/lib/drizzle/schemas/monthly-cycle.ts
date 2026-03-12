import {
  pgTable,
  text,
  timestamp,
  date,
  bigint,
  pgEnum,
  index,
} from "drizzle-orm/pg-core"
import { user } from "./auth"

export const cycleStatusEnum = pgEnum("cycle_status", ["active", "closed"])

export const monthlyCycle = pgTable(
  "monthly_cycle",
  {
    id: text("id")
      .primaryKey()
      .$default(() => crypto.randomUUID()),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    cycleMonth: text("cycle_month").notNull(), // e.g. 2026-03

    cycleStartDate: date("cycle_start_date").notNull(),
    cycleEndDate: date("cycle_end_date").notNull(),

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

    variableSpendingInPaisa: bigint("variable_spending_in_paisa", {
      mode: "number",
    })
      .notNull()
      .default(0),

    monthSurplusInPaisa: bigint("month_surplus_in_paisa", { mode: "number" })
      .notNull()
      .default(0),

    monthDeficitInPaisa: bigint("month_deficit_in_paisa", { mode: "number" })
      .notNull()
      .default(0),

    reserveUsedInPaisa: bigint("reserve_used_in_paisa", { mode: "number" })
      .notNull()
      .default(0),

    deficitCarryForwardInPaisa: bigint("deficit_carry_forward_in_paisa", {
      mode: "number",
    })
      .notNull()
      .default(0),

    status: cycleStatusEnum("status").notNull().default("active"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("monthly_cycle_user_month_idx").on(table.userId, table.cycleMonth),
  ],
)
