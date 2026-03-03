export type UserRole = 'OWNER' | 'ADMIN' | 'CASHIER'| 'SUPERUSER'

export interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  tenantId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Tenant {
  _id: string
  name: string
  businessName: string
  email: string
  phone?: string
  taxId?: string
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
  settings?: {
    currency?: string
    timezone?: string
    taxRate?: number
  }
  isActive: boolean
  subscription?: {
    plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE'
    expiresAt?: string
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  tenant: Tenant
  tokens: AuthTokens
}

export interface RegisterTenantRequest {
  tenant: {
    name: string
    businessName: string
    email: string
    phone?: string
    taxId?: string
  }
  owner: {
    email: string
    password: string
    firstName: string
    lastName: string
  }
}

export interface RegisterTenantResponse {
  tenant: Tenant
  user: User
  tokens: AuthTokens
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  tokens: AuthTokens
}
