import { z } from "zod"

export const goalContributionSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .max(1_00_00_000, "Amount too large"),

  note: z.preprocess(
    (val) => (val === undefined || val === "" ? null : val),
    z.string().max(200, "Note too long").nullable(),
  ),
})
