import { UserRole } from './auth'

export interface UserListItem {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  tenantId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface CreateUserRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
}

export interface UpdateUserRequest {
  email?: string
  firstName?: string
  lastName?: string
  role?: UserRole
  isActive?: boolean
  password?: string
}

export interface UsersResponse {
  users: UserListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface UserFilters {
  search?: string
  role?: UserRole
  isActive?: string
  page?: number
  limit?: number
  sort?: string
}

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPERUSER: 'Super Usuario',
  OWNER: 'Propietario',
  ADMIN: 'Administrador',
  CASHIER: 'Cajero',
}

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  SUPERUSER: 'Acceso total al sistema multi-tenant',
  OWNER: 'Acceso completo al sistema',
  ADMIN: 'Gestión de operaciones y configuración',
  CASHIER: 'Operación de punto de venta',
}
