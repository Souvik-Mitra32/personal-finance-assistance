import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, index, integer } from "drizzle-orm/pg-core"
import { user } from "./auth"

export const financialProfile = pgTable(
  "financial_profile",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    monthlyIncomeInPaisa: integer("monthly_income_in_paisa").notNull(),
    fixedMonthlyExpensesInPaisa: integer(
      "fixed_monthly_expenses_in_paisa",
    ).notNull(),

    savingsRate: integer("savings_rate").notNull().default(30),
    cycleStartDay: integer("cycle_start_day").notNull().default(1),

    unallocatedBalanceInPaisa: integer("unallocated_balance_in_paisa")
      .notNull()
      .default(0),
    reserveBalanceInPaisa: integer("reserve_balance_in_paisa")
      .notNull()
      .default(0),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("financial_profile_user_idx").on(table.userId)],
)

export const financialProfileRelations = relations(
  financialProfile,
  ({ one }) => ({
    user: one(user, {
      fields: [financialProfile.userId],
      references: [user.id],
    }),
  }),
)
