import { z } from "zod"

export const financialProfileSchema = z.object({
  monthlyIncome: z.coerce.number().int().min(1, "Required"),
  fixedMonthlyExpenses: z.coerce.number().int().min(1, "Required"),
  cycleStartDay: z.number().int().min(1).max(31),
  savingsRate: z.number().int().min(0).max(100).default(30),
  currentBalance: z.coerce.number().int().optional().default(0),
  currentSpends: z.coerce.number().int().optional().default(0),
})
