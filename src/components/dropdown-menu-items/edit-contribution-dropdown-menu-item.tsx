"use client"

import { useState } from "react"

import { Goal, GoalContribution } from "@/lib/drizzle/schema"

import { DropdownMenuItem } from "../ui/dropdown-menu"
import AppDialog from "@/components/app-dialog"
import GoalContributionForm from "../forms/goal-contribution-form"

export default function EditContributionDropdownMenuItem({
  goal,
  totalContributionInPaisa,
  contribution,
  onClose,
}: {
  goal: Pick<Goal, "id" | "targetAmountInPaisa">
  totalContributionInPaisa: number
  contribution: Partial<GoalContribution>
  onClose?: () => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleDialogClose() {
    setDialogOpen(false)
    onClose?.()
  }

  return (
    <AppDialog
      title="Edit Transaction"
      open={dialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleDialogClose()
        }
        setDialogOpen(open)
      }}
      trigger={
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            setDialogOpen(true)
          }}
        >
          Edit
        </DropdownMenuItem>
      }
    >
      {({ close }) => (
        <GoalContributionForm
          goal={goal}
          totalContributionInPaisa={totalContributionInPaisa}
          contribution={contribution}
          onSuccess={() => {
            close()
            onClose?.()
          }}
        />
      )}
    </AppDialog>
  )
}
