export interface Withdrawal {
  amount: number
  reason: string
  withdrawnBy: {
    _id: string
    firstName: string
    lastName: string
  }
  withdrawnAt: string
}

export interface PaymentSummary {
  count: number
  amount: number
}

export interface SalesSummary {
  totalSales: number
  totalRevenue: number
  averageTicket: number
}

export interface PaymentsSummary {
  cash: PaymentSummary
  card: PaymentSummary
  transfer: PaymentSummary
}

export interface CashRegisterClosing {
  _id: string
  tenantId: string
  branchId: {
    _id: string
    name: string
    code: string
  }
  cashierId: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  closingNumber: string
  openedAt: string
  closedAt?: string
  initialCash: number
  finalCash?: number
  withdrawals: Withdrawal[]
  totalWithdrawals: number
  expectedCash: number
  difference: number
  status: 'OPEN' | 'CLOSED'
  sales: SalesSummary
  payments: PaymentsSummary
  notes?: string
  closedBy?: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface OpenRegisterData {
  branchId: string
  initialCash: number
}

export interface WithdrawalData {
  amount: number
  reason: string
}

export interface CloseRegisterData {
  cashRegisterId: string
  finalCash: number
  notes?: string
}

export interface ClosingSummary {
  sales: SalesSummary
  payments: PaymentsSummary
  withdrawals: {
    count: number
    total: number
    items: Withdrawal[]
  }
  initialCash: number
  expectedCash: number
  totalWithdrawals: number
}

export interface ClosingHistoryFilters {
  branchId?: string
  cashierId?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface ClosingHistoryResponse {
  closings: CashRegisterClosing[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ClosingDetailResponse {
  closing: CashRegisterClosing
  sales: Array<{
    _id: string
    saleNumber: string
    total: number
    status: string
    createdAt: string
  }>
}
