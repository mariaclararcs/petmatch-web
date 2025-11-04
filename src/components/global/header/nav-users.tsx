"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { getUserPermissions } from "@/lib/permissions"

export function NavUsers() {
  const router = useRouter()
  const { data: session } = useSession()
  const userType = session?.user?.type_user
  const permissions = getUserPermissions(userType)

  // Só renderiza se o usuário for admin
  if (!permissions.canManageUsers) {
    return null
  }

  return (
    <Link href="/usuarios" className="hover:underline text-lg">
      Usuários
    </Link>
  )
}
