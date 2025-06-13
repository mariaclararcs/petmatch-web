"use client"

import { ChevronDown, LogOut } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import type { User } from "next-auth"
import { signOut } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function NavUser({ user }: { user: User }) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start p-1 h-fit gap-2 data-[state=open]:bg-accent"
        >
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
          </div>
            <Avatar className="h-10 w-10 rounded-lg">
                <AvatarFallback className="h-10 w-10 rounded-xg">
                    <Image
                        src={user.image || "/images/default-avatar.jpg"}
                        alt={user.name ? `${user.name}'s avatar` : "Default avatar"}
                        width={40}
                        height={40}
                        className="size-full object-cover rounded-full"
                        priority
                    />
                </AvatarFallback>
            </Avatar>
          <ChevronDown className="ml-auto size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-10 w-10 rounded-xg">
              <AvatarFallback className="h-10 w-10 rounded-xg">
                <Image
                  src={user.image || "/images/default-avatar.jpg"}
                  alt={user.name ? `${user.name}'s avatar` : "Default avatar"}
                  width={40}
                  height={40}
                  className="size-full object-cover rounded-full"
                  priority
                />
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/listagem-animais")}
        >
          Listagem de Animais
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer justify-between"
          onClick={() => {
            signOut({
              redirect: true,
              callbackUrl: "/",
            });
          }}
        >
          Sair
          <LogOut className="mr-2 size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}