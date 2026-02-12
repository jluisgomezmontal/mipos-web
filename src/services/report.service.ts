import { apiClient } from '@/lib/api-client'
import {
  SalesReport,
  TopProductsReport,
  BranchRevenueReport,
  PaymentMethodsReport,
  ReportFilters,
} from '@/types/report'

export const reportService = {
  async getSalesReport(filters: ReportFilters): Promise<SalesReport> {
    const params = new URLSearchParams()
    params.append('startDate', filters.startDate)
    params.append('endDate', filters.endDate)
    if (filters.branchId) params.append('branchId', filters.branchId)

    const response = await apiClient.get<SalesReport>(`/reports/sales?${params.toString()}`)
    return response.data!
  },

  async getTopProducts(filters: ReportFilters): Promise<TopProductsReport> {
    const params = new URLSearchParams()
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
    if (filters.branchId) params.append('branchId', filters.branchId)
    if (filters.limit) params.append('limit', filters.limit.toString())

    const response = await apiClient.get<TopProductsReport>(`/reports/top-products?${params.toString()}`)
    return response.data!
  },

  async getBranchRevenue(filters: Omit<ReportFilters, 'branchId'>): Promise<BranchRevenueReport> {
    const params = new URLSearchParams()
    params.append('startDate', filters.startDate)
    params.append('endDate', filters.endDate)

    const response = await apiClient.get<BranchRevenueReport>(`/reports/revenue-by-branch?${params.toString()}`)
    return response.data!
  },

  async getPaymentMethods(filters: ReportFilters): Promise<PaymentMethodsReport> {
    const params = new URLSearchParams()
    params.append('startDate', filters.startDate)
    params.append('endDate', filters.endDate)
    if (filters.branchId) params.append('branchId', filters.branchId)

    const response = await apiClient.get<PaymentMethodsReport>(`/reports/payment-methods?${params.toString()}`)
    return response.data!
  },

  async getSalesByUser(filters: ReportFilters): Promise<any> {
    const params = new URLSearchParams()
    params.append('startDate', filters.startDate)
    params.append('endDate', filters.endDate)
    if (filters.branchId) params.append('branchId', filters.branchId)

    const response = await apiClient.get(`/reports/sales-by-user?${params.toString()}`)
    return response.data!
  },
}
