"use client"

import { Fragment } from "react/jsx-runtime"
import { usePathname } from "next/navigation"
import Link from "next/link"

import { SidebarTrigger } from "./ui/sidebar"
import { Separator } from "./ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function formatSegment(segment: string): string {
  // Handle dynamic segments
  if (segment.startsWith("[") && segment.endsWith("]")) {
    return segment.slice(1, -1).charAt(0).toUpperCase() + segment.slice(2, -1)
  }

  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function AppHeader() {
  const pathname = usePathname()

  // Handle Homepage
  // if (pathname === "/") {
  //   return (
  //     <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
  //       <SidebarTrigger className="-ml-1" />
  //       <Separator orientation="vertical" className="mr-2 h-4" />
  //       <Breadcrumb>
  //         <BreadcrumbList>
  //           <BreadcrumbItem>
  //             <BreadcrumbPage>Dashboard</BreadcrumbPage>
  //           </BreadcrumbItem>
  //         </BreadcrumbList>
  //       </Breadcrumb>
  //     </header>
  //   )
  // }

  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs = [] // include home route item if always there

  // Build breadcrumbs with proper paths
  let currentPath = "" // include home route if always there
  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`
    breadcrumbs.push({
      label: formatSegment(segments[i] as string),
      href: currentPath,
      isLast: i === segments.length - 1,
    })
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <Fragment key={item.href}>
              {index > 0 && <BreadcrumbSeparator className="md:block" />}

              {item.isLast ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
