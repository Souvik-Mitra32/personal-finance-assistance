import { pgTable, text, integer, timestamp, index } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

import { monthlyCycle } from "./monthly-cycle"
import { financialProfile } from "../schema"

export const transaction = pgTable(
  "transaction",
  {
    id: text("id")
      .primaryKey()
      .$default(() => crypto.randomUUID()),

    financialProfileId: text("financial_profile_id")
      .notNull()
      .references(() => financialProfile.id, { onDelete: "cascade" }),

    cycleId: text("cycle_id")
      .notNull()
      .references(() => monthlyCycle.id, { onDelete: "cascade" }),

    type: text("type").notNull(), // debit | credit

    category: text("category").notNull(),

    description: text("description").notNull(),

    amountInPaisa: integer("amount_in_paisa").notNull(),

    date: timestamp("date", { mode: "date" }).notNull(),

    note: text("note"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("txn_financial_profile_idx").on(table.financialProfileId),
    index("txn_cycle_idx").on(table.cycleId),
  ],
)

export const transactionRelations = relations(transaction, ({ one }) => ({
  financialProfile: one(financialProfile, {
    fields: [transaction.financialProfileId],
    references: [financialProfile.id],
  }),
  monthlyCycle: one(monthlyCycle, {
    fields: [transaction.cycleId],
    references: [monthlyCycle.id],
  }),
}))

export type Transaction = typeof transaction.$inferSelect
