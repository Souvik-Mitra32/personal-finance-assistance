"use client"

import { deleteGoalContributionAction } from "@/lib/actions/goal-contributions"
import { ActionDropdownMenuItem } from "../ui/action-dropdown-menu-item"

export default function DeleteContributionDropdownMenuItem({
  contributionId,
  onClose,
}: {
  contributionId: string
  onClose?: () => void
}) {
  async function deleteContribution() {
    const res = await deleteGoalContributionAction(contributionId)

    if (!res.success) {
      onClose?.()
      return {
        error: true,
        message: res.error || "Failed to delete contribution",
      }
    }

    return { error: false }
  }

  return (
    <ActionDropdownMenuItem
      variant="destructive"
      onSelect={(e) => e.preventDefault()}
      action={deleteContribution}
      requireAreYouSure
    >
      Delete
    </ActionDropdownMenuItem>
  )
}
