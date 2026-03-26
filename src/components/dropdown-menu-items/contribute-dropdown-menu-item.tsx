"use client"

import { useState } from "react"

import { Goal } from "@/lib/drizzle/schema"

import { DropdownMenuItem } from "../ui/dropdown-menu"
import AppDialog from "@/components/app-dialog"
import GoalContributionForm from "../forms/goal-contribution-form"

export default function ContributeDropdownMenuItem({
  goal,
  goalAllocationInPaisa,
  totalContributionInPaisa,
  onClose,
}: {
  goal: Pick<Goal, "id" | "name" | "targetAmountInPaisa" | "status">
  goalAllocationInPaisa: number
  totalContributionInPaisa: number
  onClose?: () => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleDialogClose() {
    setDialogOpen(false)
    onClose?.()
  }

  return (
    <AppDialog
      title={`${goal.name} Contribution`}
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
          disabled={goal.status !== "active"}
        >
          Contribute
        </DropdownMenuItem>
      }
    >
      {({ close }) => (
        <GoalContributionForm
          goal={goal}
          goalAllocationInPaisa={goalAllocationInPaisa}
          totalContributionInPaisa={totalContributionInPaisa}
          onSuccess={() => {
            close()
            onClose?.()
          }}
        />
      )}
    </AppDialog>
  )
}
