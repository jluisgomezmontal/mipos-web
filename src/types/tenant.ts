export interface TenantListItem {
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
  createdAt: string
  updatedAt: string
  owner?: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  stats?: {
    totalUsers: number
    totalBranches: number
    totalProducts: number
  }
}

export interface TenantsResponse {
  tenants: TenantListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface TenantFilters {
  search?: string
  isActive?: string
  plan?: string
  page?: number
  limit?: number
  sort?: string
}
