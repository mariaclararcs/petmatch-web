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

export function NavAnimals() {
  const router = useRouter()

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
        <DropdownMenuItem asChild>
          <Link href="/animais" className="w-full cursor-pointer">
            Ver Animais
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/listagem-animais")}
        >
          Listagem de Animais
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}