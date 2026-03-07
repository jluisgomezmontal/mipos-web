import { apiClient } from '@/lib/api-client'
import { 
  TenantListItem, 
  TenantsResponse, 
  TenantFilters 
} from '@/types/tenant'

// NOTA: El backend necesita implementar el endpoint /api/v1/admin/tenants
// Por ahora, retornamos datos vacíos
export const tenantService = {
  async getTenants(filters?: TenantFilters): Promise<TenantsResponse> {
    // TODO: Implementar endpoint en el backend
    // El endpoint debería ser: GET /api/v1/admin/tenants (solo para SUPERUSER)
    
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive)
    if (filters?.plan) params.append('plan', filters.plan)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.sort) params.append('sort', filters.sort)

    const queryString = params.toString()
    const url = `/admin/tenants${queryString ? `?${queryString}` : ''}`
    
    const response = await apiClient.get<TenantsResponse>(url)
    return response.data!
  },

  async getTenantById(id: string): Promise<{ tenant: TenantListItem }> {
    const response = await apiClient.get<{ tenant: TenantListItem }>(`/tenants/${id}`)
    return response.data!
  },

  async updateTenant(id: string, data: Partial<TenantListItem>): Promise<{ tenant: TenantListItem }> {
    const response = await apiClient.patch<{ tenant: TenantListItem }>(`/tenants/${id}`, data)
    return response.data!
  },

  async deleteTenant(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/tenants/${id}`)
    return response.data!
  },
}
