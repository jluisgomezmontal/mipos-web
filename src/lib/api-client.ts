import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { ApiError, ApiResponse } from '@/types/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('accessToken')
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) {
              throw new Error('No refresh token')
            }

            const response = await axios.post<ApiResponse<{ tokens: { accessToken: string; refreshToken: string } }>>(
              `${API_URL}/auth/refresh-token`,
              { refreshToken }
            )

            const { accessToken, refreshToken: newRefreshToken } = response.data.data!.tokens

            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', newRefreshToken)

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`
            }

            return this.client(originalRequest)
          } catch (refreshError) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('accessToken')
              localStorage.removeItem('refreshToken')
              localStorage.removeItem('user')
              localStorage.removeItem('tenant')
              window.location.href = '/login'
            }
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, config = {}) {
    const response = await this.client.get<ApiResponse<T>>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config = {}) {
    const response = await this.client.post<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config = {}) {
    const response = await this.client.put<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config = {}) {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config = {}) {
    const response = await this.client.delete<ApiResponse<T>>(url, config)
    return response.data
  }
}

export const apiClient = new ApiClient()

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined
    
    if (apiError?.errors && apiError.errors.length > 0) {
      return apiError.errors.map(e => e.message).join(', ')
    }
    
    if (apiError?.message) {
      return apiError.message
    }

    if (error.message === 'Network Error') {
      return 'Error de conexión. Verifica tu conexión a internet.'
    }

    if (error.code === 'ECONNABORTED') {
      return 'La solicitud tardó demasiado tiempo. Intenta de nuevo.'
    }

    return error.message || 'Ocurrió un error inesperado'
  }

  if (error instanceof Error) {
    // Traducir errores comunes de JavaScript
    if (error.message.includes("can't access property")) {
      return 'Error al procesar los datos. Por favor, recarga la página.'
    }
    if (error.message.includes('undefined')) {
      return 'Datos no disponibles. Por favor, intenta de nuevo.'
    }
    if (error.message.includes('null')) {
      return 'Información no encontrada. Por favor, verifica los datos.'
    }
    return error.message
  }

  return 'Ocurrió un error inesperado'
}
