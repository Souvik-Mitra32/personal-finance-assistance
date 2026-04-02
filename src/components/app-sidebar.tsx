"use client"

import { ComponentProps, useEffect } from "react"
import { usePathname } from "next/navigation"

import { ArrowDownUp, Bolt, Flag, Gem, LayoutDashboard } from "lucide-react"
import { NavUser } from "./nav-user"
import { NavMain } from "./nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Goals",
      url: "/goals",
      icon: Flag,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: ArrowDownUp,
    },
    {
      title: "Configurations",
      url: "/configurations",
      icon: Bolt,
    },
  ],
}

export function AppSidebar({
  user,
  ...props
}: ComponentProps<typeof Sidebar> & {
  user: {
    name: string
    email: string
    avatar?: string | null
  }
}) {
  const { setOpenMobile } = useSidebar()
  const pathname = usePathname()

  const items = data.navMain.map((item) => ({
    ...item,
    isActive: pathname === item.url,
  }))

  useEffect(() => {
    setOpenMobile(false)
  }, [setOpenMobile, pathname])

  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton className="w-fit px-1.5">
            <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <Gem className="size-3" />
            </div>

            <span className="truncate font-medium">Finance</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <NavMain items={items} />
      </SidebarHeader>

      <SidebarContent />

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
