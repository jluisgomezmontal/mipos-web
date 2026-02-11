import { apiClient } from '@/lib/api-client'
import {
  Inventory,
  InventoryResponse,
  InventoryMovement,
  InventoryMovementsResponse,
  CreateInventoryMovementRequest,
  InventoryFilters,
  MovementFilters,
} from '@/types/inventory'

export const inventoryService = {
  async getInventory(filters?: InventoryFilters): Promise<InventoryResponse> {
    const params = new URLSearchParams()
    
    if (filters?.branchId) params.append('branchId', filters.branchId)
    if (filters?.productId) params.append('productId', filters.productId)
    if (filters?.lowStock !== undefined) params.append('lowStock', filters.lowStock.toString())

    const queryString = params.toString()
    const url = `/inventory${queryString ? `?${queryString}` : ''}`
    
    const response = await apiClient.get<InventoryResponse>(url)
    return response.data!
  },

  async getInventoryByProduct(productId: string, branchId: string): Promise<{ inventory: Inventory }> {
    const response = await apiClient.get<{ inventory: Inventory }>(
      `/inventory/product/${productId}/branch/${branchId}`
    )
    return response.data!
  },

  async createMovement(data: CreateInventoryMovementRequest): Promise<{ movement: InventoryMovement }> {
    const response = await apiClient.post<{ movement: InventoryMovement }>('/inventory/movements', data)
    return response.data!
  },

  async getMovements(filters?: MovementFilters): Promise<InventoryMovementsResponse> {
    const params = new URLSearchParams()
    
    if (filters?.branchId) params.append('branchId', filters.branchId)
    if (filters?.productId) params.append('productId', filters.productId)
    if (filters?.type) params.append('type', filters.type)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const queryString = params.toString()
    const url = `/inventory/movements${queryString ? `?${queryString}` : ''}`
    
    const response = await apiClient.get<InventoryMovementsResponse>(url)
    return response.data!
  },

  async updateInventorySettings(
    productId: string,
    branchId: string,
    settings: { minStock?: number; maxStock?: number }
  ): Promise<{ inventory: Inventory }> {
    const response = await apiClient.put<{ inventory: Inventory }>(
      `/inventory/product/${productId}/branch/${branchId}`,
      settings
    )
    return response.data!
  },
}
