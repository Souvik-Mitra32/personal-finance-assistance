import z from "zod"

import { GOAL_STATUSES } from "../drizzle/schema"

const goalStatusEnum = z.enum(GOAL_STATUSES)
export type GoalStatus = z.infer<typeof goalStatusEnum>

export const goalSchema = z.object({
  name: z.string().min(1, "Required").max(100),

  targetAmount: z.coerce.number().positive("Amount must be greater than 0"),

  targetDate: z.coerce.date().refine((date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return date >= today
  }, "Target date must be in the future"),

  status: goalStatusEnum.default("active"),
})
