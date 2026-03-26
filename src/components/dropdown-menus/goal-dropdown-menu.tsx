"use client"

import { useState } from "react"

import { Goal } from "@/lib/drizzle/schema"

import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import EditGoalDropdownMenuItem from "../dropdown-menu-items/edit-goal-dropdown-menu-item"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ContributeDropdownMenuItem from "../dropdown-menu-items/contribute-dropdown-menu-item"

export default function GoalDropdownMenu({
  goal,
  goalAllocationInPaisa,
  totalContributionInPaisa,
}: {
  goal: Pick<
    Goal,
    "id" | "targetAmountInPaisa" | "name" | "targetDate" | "status"
  >
  goalAllocationInPaisa: number
  totalContributionInPaisa: number
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
            onClose={() => setOpen(false)}
          />
          <ContributeDropdownMenuItem
            goal={goal}
            goalAllocationInPaisa={goalAllocationInPaisa}
            totalContributionInPaisa={totalContributionInPaisa}
            onClose={() => setOpen(false)}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
