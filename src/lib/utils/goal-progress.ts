import { isPast, isToday } from "date-fns"
import { Goal, GOAL_STATUSES } from "../drizzle/schema"

export function getGoalProgressData(target: number, saved: number) {
  if (saved === 0)
    return {
      remainingInPaisa: target,
      progressPercentage: 0,
    }

  if (saved >= target)
    return {
      remainingInPaisa: 0,
      progressPercentage: 100,
    }

  const progressPercentage = (saved / target) * 100

  return {
    remainingInPaisa: target - saved,
    progressPercentage: Math.min(progressPercentage, 100),
  }
}

export function getGoalStatus(
  goal: Pick<Goal, "targetAmountInPaisa" | "targetDate" | "status">,
  saved: number,
) {
  const targetAmount = goal.targetAmountInPaisa
  const isGoalPast = isPast(goal.targetDate) && !isToday(goal.targetDate)

  let status: (typeof GOAL_STATUSES)[number] | "completed" | "expired" =
    goal.status

  if (saved >= targetAmount) status = "completed"

  if (isGoalPast) status = "expired"

  return status
}
