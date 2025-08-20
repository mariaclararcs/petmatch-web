"use client"

import { DogIcon, MenuIcon, User2Icon } from "lucide-react"
import type * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

  const data = {
    navMain: [
      {
        title: "Home",
        url: "/home",
        icon: MenuIcon,
        items: [],
      },
      {
        title: "Animais",
        url: "/animais",
        icon: DogIcon,
        items: [],
      },
      {
        title: "Usuários",
        url: "/usuarios",
        icon: User2Icon,
        items: [],
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/home">
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer py-8"
              >
                Logo
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {session ? <NavUser user={session.user} /> : <Skeleton className="h-12 w-full" />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
