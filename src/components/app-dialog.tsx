"use client"

import { useState, ReactNode } from "react"

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
  children: (ctx: { close: () => void }) => ReactNode
}

export default function AppDialog({
  title,
  trigger,
  children,
}: AppDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {children({ close: () => setOpen(false) })}
      </DialogContent>
    </Dialog>
  )
}
