import { apiClient } from '@/lib/api-client'
import { Branch, BranchesResponse } from '@/types/branch'

export const branchService = {
  async getBranches(isActive?: boolean): Promise<BranchesResponse> {
    const params = isActive !== undefined ? `?isActive=${isActive}` : ''
    const response = await apiClient.get<BranchesResponse>(`/branches${params}`)
    return response.data!
  },

  async getBranchById(id: string): Promise<{ branch: Branch }> {
    const response = await apiClient.get<{ branch: Branch }>(`/branches/${id}`)
    return response.data!
  },

  async createBranch(data: Omit<Branch, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<{ branch: Branch }> {
    const response = await apiClient.post<{ branch: Branch }>('/branches', data)
    return response.data!
  },

  async updateBranch(id: string, data: Partial<Omit<Branch, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>>): Promise<{ branch: Branch }> {
    const response = await apiClient.patch<{ branch: Branch }>(`/branches/${id}`, data)
    return response.data!
  },

  async deleteBranch(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/branches/${id}`)
    return response.data!
  },
}
