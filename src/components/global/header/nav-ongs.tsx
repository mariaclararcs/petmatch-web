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

export function NavOngs() {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" className="hover:underline text-lg p-0 h-fit">
          <div className="flex items-center gap-1">
            ONGs
            <ChevronDown className="size-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-40 rounded-lg">
        <DropdownMenuItem asChild>
          <Link href="/ongs" className="w-full cursor-pointer">
            ONGs Cadastradas
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/listagem-ongs")}
        >
          Gerenciar ONGs
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}