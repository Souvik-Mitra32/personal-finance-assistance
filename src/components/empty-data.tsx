"use client"

import { ComponentProps, ReactNode } from "react"

import { LucideIcon } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function EmptyData({
  title,
  description,
  icon,
  children,
  ...emptyProps
}: {
  title: string
  description: string
  icon?: ReactNode
  children?: ReactNode
} & ComponentProps<typeof Empty>) {
  return (
    <Empty {...emptyProps}>
      <EmptyHeader>
        {icon && <EmptyMedia variant="icon">{icon}</EmptyMedia>}
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{children}</EmptyContent>
    </Empty>
  )
}
