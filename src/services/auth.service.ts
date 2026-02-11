import { apiClient } from '@/lib/api-client'
import {
  LoginRequest,
  LoginResponse,
  RegisterTenantRequest,
  RegisterTenantResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
} from '@/types/auth'

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
    return response.data!
  },

  async register(data: RegisterTenantRequest): Promise<RegisterTenantResponse> {
    const response = await apiClient.post<RegisterTenantResponse>('/auth/register', data)
    return response.data!
  },

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh-token', {
      refreshToken,
    })
    return response.data!
  },

  async getMe(): Promise<{ user: User }> {
    const response = await apiClient.get<{ user: User }>('/auth/me')
    return response.data!
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      localStorage.removeItem('tenant')
    }
  },
}
