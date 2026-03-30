"use client"

import { ComponentProps } from "react"
import { useRouter } from "next/navigation"

import { deleteGoalAction } from "@/lib/actions/goals"

import { Trash } from "lucide-react"
import { Button } from "../ui/button"
import { ActionButton } from "../ui/action-button"

export default function DeleteGoalButton({
  goalId,
  ...props
}: { goalId: string } & ComponentProps<typeof Button>) {
  const router = useRouter()

  async function deleteGoal() {
    const res = await deleteGoalAction(goalId, { redirectOnSuccess: false })

    if (!res.success) {
      return {
        error: true,
        message: res.error || "Failed to delete goal",
      }
    }

    router.push("/goals")
    return { error: false }
  }

  return (
    <ActionButton
      variant="destructive"
      {...props}
      action={deleteGoal}
      requireAreYouSure
    >
      <Trash />
      Delete
    </ActionButton>
  )
}
