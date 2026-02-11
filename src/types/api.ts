export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

export interface ApiError {
  success: false
  message: string
  errors?: Array<{
    field: string
    message: string
  }>
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
