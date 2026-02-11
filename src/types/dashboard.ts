export interface DashboardStats {
  today: {
    sales: number
    revenue: number
    paymentsReceived: number
  }
  thisMonth: {
    sales: number
    revenue: number
  }
}

export interface SalesTodayResponse {
  sales: any[]
  summary: {
    totalSales: number
    totalRevenue: number
    date: string
  }
}
