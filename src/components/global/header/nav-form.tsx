"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { getUserPermissions } from "@/lib/permissions"

export function NavForm() {
  const { data: session } = useSession()
  const userType = session?.user?.type_user
  const permissions = getUserPermissions(userType)

  // Só renderiza se o usuário for ong
  if (!permissions.canManageAnimals || permissions.canManageUsers) {
    return null
  }

  return (
    <Link href="/solicitacoes-adocao" className="hover:underline text-lg">
      Formulários
    </Link>
  )
}
