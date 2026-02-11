import { apiClient } from '@/lib/api-client'
import { 
  TenantInfo,
  UpdateTenantInfoRequest,
  UpdateTenantSettingsRequest
} from '@/types/settings'

export const settingsService = {
  async getTenantInfo(): Promise<{ user: any; tenant: TenantInfo }> {
    const response = await apiClient.get<{ user: any; tenant: TenantInfo }>('/auth/me')
    return response.data!
  },

  async updateTenantInfo(data: UpdateTenantInfoRequest): Promise<{ tenant: TenantInfo }> {
    const response = await apiClient.patch<{ tenant: TenantInfo }>('/auth/tenant', data)
    return response.data!
  },

  async updateTenantSettings(data: UpdateTenantSettingsRequest): Promise<{ tenant: TenantInfo }> {
    const response = await apiClient.patch<{ tenant: TenantInfo }>('/auth/tenant/settings', data)
    return response.data!
  },
}
