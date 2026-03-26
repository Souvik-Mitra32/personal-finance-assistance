"use client"

import { ReactNode } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type AppDialogProps = {
  title: string
  trigger: ReactNode
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  children: (ctx: { close: () => void }) => ReactNode
}

export default function AppDialog({
  title,
  trigger,
  open,
  onOpenChange,
  children,
}: AppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {children({ close: () => onOpenChange(false) })}
      </DialogContent>
    </Dialog>
  )
}
