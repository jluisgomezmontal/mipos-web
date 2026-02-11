export type InventoryMovementType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'SALE'

export interface Inventory {
  _id: string
  tenantId: string
  productId: string | {
    _id: string
    sku: string
    name: string
    price: number
    category?: string
  }
  branchId: string | {
    _id: string
    name: string
    code: string
  }
  quantity: number
  minStock: number
  maxStock: number
  createdAt: string
  updatedAt: string
}

export interface InventoryMovement {
  _id: string
  tenantId: string
  productId: string | {
    _id: string
    sku: string
    name: string
    price: number
  }
  branchId: string | {
    _id: string
    name: string
    code: string
  }
  type: InventoryMovementType
  quantity: number
  previousQuantity: number
  newQuantity: number
  reason?: string
  reference?: string
  userId: string | {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface InventoryResponse {
  inventory: Inventory[]
}

export interface InventoryMovementsResponse {
  movements: InventoryMovement[]
  pagination?: {
    page: number
    limit: number
    total: number
  }
}

export interface CreateInventoryMovementRequest {
  productId: string
  branchId: string
  type: 'IN' | 'OUT' | 'ADJUSTMENT'
  quantity: number
  reason?: string
  reference?: string
}

export interface InventoryFilters {
  branchId?: string
  productId?: string
  lowStock?: boolean
}

export interface MovementFilters {
  branchId?: string
  productId?: string
  type?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}
