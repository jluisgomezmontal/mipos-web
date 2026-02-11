export interface Product {
  _id: string
  tenantId: string
  sku: string
  name: string
  description?: string
  category?: string
  price: number
  cost?: number
  taxRate?: number
  barcode?: string
  image?: string
  attributes?: Record<string, any>
  isActive: boolean
  trackInventory: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

export interface ProductFilters {
  search?: string
  category?: string
  isActive?: string
  page?: number
  limit?: number
  sort?: string
}
