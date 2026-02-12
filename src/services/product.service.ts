import { apiClient } from '@/lib/api-client'
import { Product, ProductsResponse, ProductFilters } from '@/types/product'

export const productService = {
  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.category) params.append('category', filters.category)
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.sort) params.append('sort', filters.sort)

    const queryString = params.toString()
    const url = `/products${queryString ? `?${queryString}` : ''}`
    
    const response = await apiClient.get<ProductsResponse>(url)
    return response.data!
  },

  async getProductById(id: string): Promise<{ product: Product }> {
    const response = await apiClient.get<{ product: Product }>(`/products/${id}`)
    return response.data!
  },

  async getProductBySku(sku: string): Promise<{ product: Product }> {
    const response = await apiClient.get<{ product: Product }>(`/products/sku/${sku}`)
    return response.data!
  },

  async getProductByBarcode(barcode: string): Promise<{ product: Product }> {
    const response = await apiClient.get<{ product: Product }>(`/products/barcode/${barcode}`)
    return response.data!
  },

  async createProduct(data: Omit<Product, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Promise<{ product: Product }> {
    const response = await apiClient.post<{ product: Product }>('/products', data)
    return response.data!
  },

  async updateProduct(id: string, data: Partial<Omit<Product, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>>): Promise<{ product: Product }> {
    const response = await apiClient.patch<{ product: Product }>(`/products/${id}`, data)
    return response.data!
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/products/${id}`)
    return response.data!
  },
}
