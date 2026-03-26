"use client"

import { useState } from "react"

import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import AppDialog from "@/components/app-dialog"
import GoalForm from "../forms/goal-form"

export default function AddGoalButton() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <AppDialog
      title="Add Goal"
      open={dialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          setDialogOpen(false)
        }
        setDialogOpen(open)
      }}
      trigger={
        <Button>
          <Plus />
          Add Goal
        </Button>
      }
    >
      {({ close }) => (
        <GoalForm
          onSuccess={() => {
            close()
            setDialogOpen(false)
          }}
        />
      )}
    </AppDialog>
  )
}
