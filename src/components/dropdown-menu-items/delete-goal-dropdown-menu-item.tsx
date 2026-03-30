"use client"

import { ComponentProps } from "react"
import { useRouter } from "next/navigation"

import { DropdownMenuItem } from "../ui/dropdown-menu"
import { ActionDropdownMenuItem } from "../ui/action-dropdown-menu-item"

import { deleteGoalAction } from "@/lib/actions/goals"

export default function DeleteGoalDropdownMenuItem({
  goalId,
  onClose,
  ...dropdownMenuItemProps
}: {
  goalId: string
  onClose?: () => void
} & ComponentProps<typeof DropdownMenuItem>) {
  const router = useRouter()

  async function deleteGoal() {
    const res = await deleteGoalAction(goalId)

    if (!res.success) {
      return {
        error: true,
        message: res.error || "Failed to delete goal",
      }
    }

    onClose?.()
    router.push("/goals")

    return { error: false }
  }

  return (
    <ActionDropdownMenuItem
      variant="destructive"
      onSelect={(e) => e.preventDefault()}
      action={deleteGoal}
      requireAreYouSure
      {...dropdownMenuItemProps}
    >
      Delete
    </ActionDropdownMenuItem>
  )
}
