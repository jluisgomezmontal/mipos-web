import { apiClient } from '@/lib/api-client'
import { DashboardStats } from '@/types/dashboard'

export const dashboardService = {
  async getDashboardStats(branchId?: string): Promise<DashboardStats> {
    const params = branchId ? `?branchId=${branchId}` : ''
    const response = await apiClient.get<DashboardStats>(`/reports/dashboard${params}`)
    return response.data!
  },
}
