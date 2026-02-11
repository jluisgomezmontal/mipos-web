import { apiClient } from '@/lib/api-client'
import {
  Sale,
  SalesResponse,
  CreateSaleRequest,
  SaleFilters,
  Payment,
  CreatePaymentRequest,
} from '@/types/sale'
import { SalesTodayResponse } from '@/types/dashboard'

export const saleService = {
  async createSale(data: CreateSaleRequest): Promise<{ sale: Sale }> {
    const response = await apiClient.post<{ sale: Sale }>('/sales', data)
    return response.data!
  },

  async getSales(filters?: SaleFilters): Promise<SalesResponse> {
    const params = new URLSearchParams()
    
    if (filters?.branchId) params.append('branchId', filters.branchId)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const queryString = params.toString()
    const url = `/sales${queryString ? `?${queryString}` : ''}`
    
    const response = await apiClient.get<SalesResponse>(url)
    return response.data!
  },

  async getSaleById(id: string): Promise<{ sale: Sale }> {
    const response = await apiClient.get<{ sale: Sale }>(`/sales/${id}`)
    return response.data!
  },

  async getSalesToday(branchId?: string): Promise<SalesTodayResponse> {
    const params = branchId ? `?branchId=${branchId}` : ''
    const response = await apiClient.get<SalesTodayResponse>(`/sales/today${params}`)
    return response.data!
  },

  async cancelSale(id: string, reason: string): Promise<{ sale: Sale }> {
    const response = await apiClient.patch<{ sale: Sale }>(`/sales/${id}/cancel`, {
      status: 'CANCELLED',
      cancellationReason: reason,
    })
    return response.data!
  },

  async createPayment(data: CreatePaymentRequest): Promise<{ payment: Payment }> {
    const response = await apiClient.post<{ payment: Payment }>('/payments', data)
    return response.data!
  },

  async getPaymentsBySale(saleId: string): Promise<{
    payments: Payment[]
    summary: {
      saleTotal: number
      totalPaid: number
      remainingBalance: number
      isPaid: boolean
    }
  }> {
    const response = await apiClient.get<{
      payments: Payment[]
      summary: {
        saleTotal: number
        totalPaid: number
        remainingBalance: number
        isPaid: boolean
      }
    }>(`/payments/sale/${saleId}`)
    return response.data!
  },
}
