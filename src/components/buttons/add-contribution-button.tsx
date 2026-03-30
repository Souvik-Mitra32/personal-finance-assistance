"use client"

import { ComponentProps, useState } from "react"

import { Goal } from "@/lib/drizzle/schema"

import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import AppDialog from "@/components/app-dialog"
import GoalContributionForm from "../forms/goal-contribution-form"

export default function AddContributionButton({
  goal,
  goalAllocationInPaisa,
  totalContributionInPaisa,
  ...buttonProps
}: {
  goal: Pick<Goal, "id" | "targetAmountInPaisa">
  goalAllocationInPaisa: number
  totalContributionInPaisa: number
} & ComponentProps<typeof Button>) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <AppDialog
      title="Add Contribution"
      open={dialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          setDialogOpen(false)
        }
        setDialogOpen(open)
      }}
      trigger={
        <Button {...buttonProps}>
          <Plus />
          Contribute
        </Button>
      }
    >
      {({ close }) => (
        <GoalContributionForm
          goal={goal}
          goalAllocationInPaisa={goalAllocationInPaisa}
          totalContributionInPaisa={totalContributionInPaisa}
          onSuccess={() => {
            close()
            setDialogOpen(false)
          }}
        />
      )}
    </AppDialog>
  )
}
