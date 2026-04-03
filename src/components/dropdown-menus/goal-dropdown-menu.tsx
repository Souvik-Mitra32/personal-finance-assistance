"use client"

import { useState } from "react"

import { Goal } from "@/lib/drizzle/schema"

import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import EditGoalDropdownMenuItem from "../dropdown-menu-items/edit-goal-dropdown-menu-item"
import DeleteGoalDropdownMenuItem from "../dropdown-menu-items/delete-goal-dropdown-menu-item"
import ContributeDropdownMenuItem from "../dropdown-menu-items/contribute-dropdown-menu-item"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function GoalDropdownMenu({
  goal,
  goalAllocationInPaisa,
  totalContributionInPaisa,
  isContributable,
}: {
  goal: Pick<
    Goal,
    "id" | "targetAmountInPaisa" | "name" | "targetDate" | "status" | "slug"
  >
  goalAllocationInPaisa: number
  totalContributionInPaisa: number
  isContributable: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <EditGoalDropdownMenuItem
            goal={goal}
            totalContributionInPaisa={totalContributionInPaisa}
            onClose={() => setOpen(false)}
          />
          <ContributeDropdownMenuItem
            isContributable={isContributable}
            goal={goal}
            goalAllocationInPaisa={goalAllocationInPaisa}
            totalContributionInPaisa={totalContributionInPaisa}
            onClose={() => setOpen(false)}
          />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DeleteGoalDropdownMenuItem
            goalId={goal.id}
            onClose={() => setOpen(false)}
            disabled={totalContributionInPaisa > 0}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
