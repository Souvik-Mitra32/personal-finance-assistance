"use client"

import { useState } from "react"

import { Goal, GoalContribution } from "@/lib/drizzle/schema"

import { MoreHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import EditContributionDropdownMenuItem from "../dropdown-menu-items/edit-contribution-dropdown-menu-item"
import DeleteContributionDropdownMenuItem from "../dropdown-menu-items/delete-contribution-dropdown-menu-item"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ContributionDropdownMenu({
  goal,
  totalContributionInPaisa,
  contribution,
}: {
  goal: Pick<Goal, "id" | "targetAmountInPaisa">
  totalContributionInPaisa: number
  contribution: GoalContribution
}) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontalIcon />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <EditContributionDropdownMenuItem
          goal={goal}
          totalContributionInPaisa={totalContributionInPaisa}
          contribution={contribution}
          onClose={() => setOpen(false)}
        />
        <DropdownMenuSeparator />
        <DeleteContributionDropdownMenuItem
          contributionId={contribution.id}
          onClose={() => setOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
