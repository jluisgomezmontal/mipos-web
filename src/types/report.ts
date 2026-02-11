export interface SalesReport {
  sales: Array<{
    date: string
    totalSales: number
    totalRevenue: number
    averageTicket: number
  }>
  summary: {
    totalSales: number
    totalRevenue: number
    averageTicket: number
    startDate: string
    endDate: string
  }
}

export interface TopProduct {
  productId: string
  productName: string
  sku: string
  quantitySold: number
  totalRevenue: number
  profit: number
}

export interface TopProductsReport {
  products: TopProduct[]
  summary: {
    totalProducts: number
    totalQuantitySold: number
    totalRevenue: number
  }
}

export interface BranchRevenue {
  branchId: string
  branchName: string
  branchCode: string
  totalSales: number
  totalRevenue: number
  averageTicket: number
}

export interface BranchRevenueReport {
  branches: BranchRevenue[]
  summary: {
    totalBranches: number
    totalSales: number
    totalRevenue: number
  }
}

export interface PaymentMethodStats {
  method: string
  count: number
  totalAmount: number
  percentage: number
}

export interface PaymentMethodsReport {
  methods: PaymentMethodStats[]
  summary: {
    totalPayments: number
    totalAmount: number
  }
}

export interface ReportFilters {
  startDate: string
  endDate: string
  branchId?: string
  limit?: number
}
