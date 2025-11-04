/**
 * Helper para verificar permissões baseado no tipo de usuário
 */

export type UserType = 'admin' | 'ong' | 'adopter' | string

export interface UserPermissions {
  canViewAnimals: boolean
  canManageAnimals: boolean
  canViewOngs: boolean
  canManageOngs: boolean
  canManageUsers: boolean
}

/**
 * Retorna as permissões baseadas no tipo de usuário
 */
export function getUserPermissions(userType: string | undefined | null): UserPermissions {
  const type = userType?.toLowerCase() || ''

  switch (type) {
    case 'admin':
      return {
        canViewAnimals: true,
        canManageAnimals: true,
        canViewOngs: true,
        canManageOngs: true,
        canManageUsers: true,
      }
    
    case 'ong':
      return {
        canViewAnimals: true,
        canManageAnimals: true, // ONGs podem gerenciar seus próprios animais
        canViewOngs: true,
        canManageOngs: false, // ONGs não podem gerenciar outras ONGs
        canManageUsers: false,
      }
    
    case 'adopter':
    case 'adotante': // Fallback para possível variação
      return {
        canViewAnimals: true,
        canManageAnimals: false,
        canViewOngs: true,
        canManageOngs: false,
        canManageUsers: false,
      }
    
    default:
      // Usuário não autenticado - apenas visualização básica
      return {
        canViewAnimals: true,
        canManageAnimals: false,
        canViewOngs: true,
        canManageOngs: false,
        canManageUsers: false,
      }
  }
}

/**
 * Verifica se o usuário pode acessar uma rota específica
 */
export function canAccessRoute(userType: string | undefined | null, route: string): boolean {
  const permissions = getUserPermissions(userType)

  const routePermissions: Record<string, keyof UserPermissions> = {
    '/animais': 'canViewAnimals',
    '/listagem-animais': 'canManageAnimals',
    '/ongs': 'canViewOngs',
    '/listagem-ongs': 'canManageOngs',
    '/usuarios': 'canManageUsers',
  }

  const permissionKey = routePermissions[route]
  return permissionKey ? permissions[permissionKey] : false
}
