import { z } from "zod"

export const financialProfileSchema = z.object({
  monthlyIncome: z.coerce.number().int().min(1, "Must be at least 1"),
  fixedMonthlyExpenses: z.coerce.number().int().min(1, "Required"),
  cycleStartDay: z.coerce.number().int().min(1).max(31),
  savingsRate: z.coerce
    .number()
    .int()
    .max(100, "Maximum savings rate is 100")
    .default(30),
  currentBalance: z.coerce.number().int().default(0),
  currentSpends: z.coerce.number().int().optional().default(0),
})
