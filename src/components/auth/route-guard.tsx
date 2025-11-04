'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { getUserPermissions, UserPermissions } from '@/lib/permissions'
import LoadingComponent from '../loading'

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
      <LoadingComponent />
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
