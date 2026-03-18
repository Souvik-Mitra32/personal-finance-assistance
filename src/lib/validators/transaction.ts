import { z } from "zod"
import {
  CREDIT_TRANSACTION_CATEGORIES,
  DEBIT_TRANSACTION_CATEGORIES,
} from "@/data/constants"

export function createTransactionSchema(cycleStartDay: number) {
  const minDate = new Date()
  minDate.setDate(cycleStartDay)
  minDate.setHours(0, 0, 0, 0)

  return z
    .object({
      type: z.enum(["debit", "credit"]),

      amount: z.coerce.number({ error: "Required" }).int().positive(),

      category: z.string({ error: "Required" }),

      description: z
        .string()
        .min(2, "Must be minimum 2 characters")
        .max(100, "Must be within 100 characters"),

      date: z.date().refine((d) => d >= minDate, {
        message: `Date must be after ${cycleStartDay}`,
      }),

      note: z.string({ error: "Required" }).max(300).optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.type === "debit" &&
        !DEBIT_TRANSACTION_CATEGORIES.includes(data.category as any)
      ) {
        ctx.addIssue({
          path: ["category"],
          code: "custom",
          message: "Invalid debit category",
        })
      }

      if (
        data.type === "credit" &&
        !CREDIT_TRANSACTION_CATEGORIES.includes(data.category as any)
      ) {
        ctx.addIssue({
          path: ["category"],
          code: "custom",
          message: "Invalid credit category",
        })
      }
    })
}
