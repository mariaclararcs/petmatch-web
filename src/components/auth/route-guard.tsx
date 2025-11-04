'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { getUserPermissions, UserPermissions } from '@/lib/permissions'

interface RouteGuardProps {
  children: React.ReactNode
  requiredPermission?: keyof UserPermissions
  requiredUserType?: 'admin' | 'ong' | 'adopter'
  redirectTo?: string
}

export function RouteGuard({ 
  children, 
  requiredPermission, 
  requiredUserType,
  redirectTo = '/home' 
}: RouteGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Aguarda carregar a sessão

    if (!session) {
      router.push('/login')
      return
    }

    const userType = session.user?.type_user
    const permissions = getUserPermissions(userType)

    // Verifica tipo de usuário específico
    if (requiredUserType) {
      const userTypeLower = userType?.toLowerCase() || ''
      if (userTypeLower !== requiredUserType.toLowerCase()) {
        router.push(redirectTo)
        return
      }
    }

    // Verifica permissão específica
    if (requiredPermission) {
      if (!permissions[requiredPermission]) {
        router.push(redirectTo)
        return
      }
    }
  }, [session, status, router, requiredPermission, requiredUserType, redirectTo])

  if (status === 'loading') {
    return (
      <div className="flex flex-col justify-center items-center mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p>Verificando permissões...</p>
      </div>
    )
  }

  if (!session) {
    return null // Redirecionamento em andamento
  }

  const userType = session.user?.type_user
  const permissions = getUserPermissions(userType)

  // Verifica tipo de usuário específico
  if (requiredUserType) {
    const userTypeLower = userType?.toLowerCase() || ''
    if (userTypeLower !== requiredUserType.toLowerCase()) {
      return null // Redirecionamento em andamento
    }
  }

  // Verifica permissão específica
  if (requiredPermission && !permissions[requiredPermission]) {
    return null // Redirecionamento em andamento
  }

  return <>{children}</>
}
