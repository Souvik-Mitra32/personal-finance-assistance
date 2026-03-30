"use client"

import { ComponentProps, useState } from "react"

import { Goal } from "@/lib/drizzle/schema"

import { SquarePen } from "lucide-react"
import { Button } from "../ui/button"
import AppDialog from "@/components/app-dialog"
import GoalForm from "../forms/goal-form"

export default function EditGoalButton({
  goal,
  totalContributionInPaisa,
  ...buttonProps
}: {
  goal: Pick<
    Goal,
    "id" | "targetAmountInPaisa" | "name" | "targetDate" | "status"
  >
  totalContributionInPaisa: number
} & ComponentProps<typeof Button>) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <AppDialog
      title={`Edit ${goal.name}`}
      open={dialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          setDialogOpen(false)
        }
        setDialogOpen(open)
      }}
      trigger={
        <Button {...buttonProps}>
          <SquarePen />
          Edit
        </Button>
      }
    >
      {({ close }) => (
        <GoalForm
          defaultValues={goal}
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
