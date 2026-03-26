"use client"

import { useState } from "react"

import { Goal } from "@/lib/drizzle/schema"

import { DropdownMenuItem } from "../ui/dropdown-menu"
import AppDialog from "@/components/app-dialog"
import GoalForm from "../forms/goal-form"

export default function EditGoalDropdownMenuItem({
  goal,
  onClose,
}: {
  goal: Pick<
    Goal,
    "id" | "targetAmountInPaisa" | "name" | "targetDate" | "status"
  >
  onClose?: () => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleDialogClose() {
    setDialogOpen(false)
    onClose?.()
  }

  return (
    <AppDialog
      title="Edit Goal"
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
        <GoalForm
          defaultValues={goal}
          onSuccess={() => {
            close()
            onClose?.()
          }}
        />
      )}
    </AppDialog>
  )
}
