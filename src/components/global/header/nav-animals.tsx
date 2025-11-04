"use client"

import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { getUserPermissions } from "@/lib/permissions"

export function NavAnimals() {
  const router = useRouter()
  const { data: session } = useSession()
  const userType = session?.user?.type_user
  const permissions = getUserPermissions(userType)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" className="hover:underline text-lg p-0 h-fit">
          <div className="flex items-center gap-1">
            Animais
            <ChevronDown className="size-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-40 rounded-lg">
        {permissions.canViewAnimals && (
          <DropdownMenuItem asChild>
            <Link href="/animais" className="w-full cursor-pointer">
              Animais para Adoção
            </Link>
          </DropdownMenuItem>
        )}
        {permissions.canManageAnimals && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/listagem-animais")}
          >
            Gerenciar Animais
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}