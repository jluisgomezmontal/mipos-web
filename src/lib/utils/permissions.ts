import { UserRole } from '@/types/auth'

export const PERMISSIONS = {
  USERS_VIEW: ['OWNER', 'ADMIN'] as UserRole[],
  USERS_CREATE: ['OWNER', 'ADMIN'] as UserRole[],
  USERS_EDIT: ['OWNER', 'ADMIN'] as UserRole[],
  USERS_DELETE: ['OWNER', 'ADMIN'] as UserRole[],
  PRODUCTS_VIEW: ['OWNER', 'ADMIN'] as UserRole[],
  PRODUCTS_CREATE: ['OWNER', 'ADMIN'] as UserRole[],
  PRODUCTS_EDIT: ['OWNER', 'ADMIN'] as UserRole[],
  PRODUCTS_DELETE: ['OWNER', 'ADMIN'] as UserRole[],
  INVENTORY_VIEW: ['OWNER', 'ADMIN'] as UserRole[],
  INVENTORY_MANAGE: ['OWNER', 'ADMIN'] as UserRole[],
  SALES_VIEW: ['OWNER', 'ADMIN', 'CASHIER'] as UserRole[],
  SALES_CREATE: ['OWNER', 'ADMIN', 'CASHIER'] as UserRole[],
  REPORTS_VIEW: ['OWNER', 'ADMIN'] as UserRole[],
  SETTINGS_VIEW: ['OWNER', 'ADMIN'] as UserRole[],
  SETTINGS_EDIT: ['OWNER', 'ADMIN'] as UserRole[],
}

export type Permission = keyof typeof PERMISSIONS

export function hasPermission(userRole: UserRole | undefined, permission: Permission): boolean {
  if (!userRole) return false
  return PERMISSIONS[permission].includes(userRole)
}

export function canAccessUsers(userRole: UserRole | undefined): boolean {
  return hasPermission(userRole, 'USERS_VIEW')
}

export function canManageUsers(userRole: UserRole | undefined): boolean {
  return hasPermission(userRole, 'USERS_CREATE')
}
