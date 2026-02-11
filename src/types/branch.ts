export interface Branch {
  _id: string
  tenantId: string
  name: string
  code: string
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
  phone?: string
  email?: string
  isActive: boolean
  manager?: string
  createdAt: string
  updatedAt: string
}

export interface BranchesResponse {
  branches: Branch[]
}
