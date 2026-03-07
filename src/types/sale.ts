export type SaleStatus = 'PENDING' | 'PAID' | 'CANCELLED'
export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER'

export interface SaleItem {
  productId: string
  productSnapshot: {
    sku: string
    name: string
    price: number
    cost: number
    taxRate: number
    imageUrl?: string
  }
  quantity: number
  unitPrice: number
  discount: number
  taxAmount: number
  subtotal: number
  total: number
}

export interface Sale {
  _id: string
  tenantId: string
  branchId: string
  saleNumber: string
  items: SaleItem[]
  subtotal: number
  discount: number
  taxAmount: number
  total: number
  status: SaleStatus
  customerId?: string
  customerInfo?: {
    name?: string
    email?: string
    phone?: string
  }
  cashierId: string
  notes?: string
  cancelledAt?: string
  cancelledBy?: string
  cancellationReason?: string
  createdAt: string
  updatedAt: string
}

export interface CreateSaleRequest {
  branchId: string
  items: {
    productId: string
    quantity: number
    unitPrice: number
    discount?: number
  }[]
  discount?: number
  customerId?: string
  customerInfo?: {
    name?: string
    email?: string
    phone?: string
  }
  notes?: string
}

export interface SalesResponse {
  sales: Sale[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

export interface SaleFilters {
  branchId?: string
  status?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface Payment {
  _id: string
  tenantId: string
  saleId: string
  method: PaymentMethod
  amount: number
  status: string
  reference?: string
  externalId?: string
  metadata?: Record<string, any>
  processedAt?: string
  processedBy?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentRequest {
  saleId: string
  method: PaymentMethod
  amount: number
  reference?: string
  metadata?: Record<string, any>
}
