import { apiClient } from '@/lib/api-client'
import { 
  UserListItem, 
  UsersResponse, 
  UserFilters,
  CreateUserRequest,
  UpdateUserRequest
} from '@/types/user'

export const userService = {
  async getUsers(filters?: UserFilters): Promise<UsersResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.role) params.append('role', filters.role)
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.sort) params.append('sort', filters.sort)

    const queryString = params.toString()
    const url = `/auth/users${queryString ? `?${queryString}` : ''}`
    
    const response = await apiClient.get<UsersResponse>(url)
    return response.data!
  },

  async getUserById(id: string): Promise<{ user: UserListItem }> {
    const response = await apiClient.get<{ user: UserListItem }>(`/auth/users/${id}`)
    return response.data!
  },

  async createUser(data: CreateUserRequest): Promise<{ user: UserListItem }> {
    const response = await apiClient.post<{ user: UserListItem }>('/auth/users', data)
    return response.data!
  },

  async updateUser(id: string, data: UpdateUserRequest): Promise<{ user: UserListItem }> {
    const response = await apiClient.patch<{ user: UserListItem }>(`/auth/users/${id}`, data)
    return response.data!
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/auth/users/${id}`)
    return response.data!
  },
}
