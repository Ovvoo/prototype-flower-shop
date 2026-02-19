import type { Order, Product, Category, PromoCode, PaginatedResponse } from '@/lib/types'
import type {
  DashboardStats,
  AdminOrderFilters,
  AdminProductFilters,
  AdminPromoCodeFilters,
  UpdateOrderStatusRequest,
  ProductFormData,
  CategoryFormData,
  PromoCodeFormData,
} from '@/lib/types/admin'
import apiClient from './client'

/**
 * Admin API Service
 * Requires admin/manager role authentication
 */
export const adminApi = {
  // ==================== Dashboard ====================

  /**
   * Get dashboard statistics
   */
  async getDashboard(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/admin/dashboard')
  },

  // ==================== Orders Management ====================

  /**
   * Get filtered list of orders
   */
  async getOrders(filters?: AdminOrderFilters): Promise<PaginatedResponse<Order>> {
    const raw = await apiClient.get<any>('/admin/orders', filters)
    return {
      ...raw,
      meta: { current_page: raw.current_page, last_page: raw.last_page, per_page: raw.per_page, total: raw.total, from: raw.from ?? 0, to: raw.to ?? 0 },
    }
  },

  /**
   * Get order details
   */
  async getOrder(id: number): Promise<Order> {
    return apiClient.get<Order>(`/admin/orders/${id}`)
  },

  /**
   * Update order status
   */
  async updateOrderStatus(id: number, data: UpdateOrderStatusRequest): Promise<Order> {
    const response = await apiClient.put<{ message: string; order: Order }>(
      `/admin/orders/${id}/status`,
      data
    )
    return response.order
  },

  // ==================== Products Management ====================

  /**
   * Get filtered list of products
   */
  async getProducts(filters?: AdminProductFilters): Promise<PaginatedResponse<Product>> {
    const raw = await apiClient.get<any>('/admin/products', filters)
    return {
      ...raw,
      meta: { current_page: raw.current_page, last_page: raw.last_page, per_page: raw.per_page, total: raw.total, from: raw.from ?? 0, to: raw.to ?? 0 },
    }
  },

  /**
   * Get product details
   */
  async getProduct(id: number): Promise<Product> {
    return apiClient.get<Product>(`/admin/products/${id}`)
  },

  /**
   * Create new product
   */
  async createProduct(data: ProductFormData): Promise<Product> {
    const response = await apiClient.post<{ message: string; product: Product }>(
      '/admin/products',
      data
    )
    return response.product
  },

  /**
   * Update product
   */
  async updateProduct(id: number, data: Partial<ProductFormData>): Promise<Product> {
    const response = await apiClient.put<{ message: string; product: Product }>(
      `/admin/products/${id}`,
      data
    )
    return response.product
  },

  /**
   * Delete product
   */
  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/admin/products/${id}`)
  },

  // ==================== Categories Management ====================

  /**
   * Get all categories with tree structure
   */
  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/admin/categories')
  },

  /**
   * Get category details
   */
  async getCategory(id: number): Promise<Category> {
    return apiClient.get<Category>(`/admin/categories/${id}`)
  },

  /**
   * Create new category
   */
  async createCategory(data: CategoryFormData): Promise<Category> {
    const response = await apiClient.post<{ message: string; category: Category }>(
      '/admin/categories',
      data
    )
    return response.category
  },

  /**
   * Update category
   */
  async updateCategory(id: number, data: Partial<CategoryFormData>): Promise<Category> {
    const response = await apiClient.put<{ message: string; category: Category }>(
      `/admin/categories/${id}`,
      data
    )
    return response.category
  },

  /**
   * Delete category
   */
  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/admin/categories/${id}`)
  },

  // ==================== Promo Codes Management ====================

  /**
   * Get list of promo codes
   */
  async getPromoCodes(filters?: AdminPromoCodeFilters): Promise<PaginatedResponse<PromoCode>> {
    const raw = await apiClient.get<any>('/admin/promo-codes', filters)
    return {
      ...raw,
      meta: { current_page: raw.current_page, last_page: raw.last_page, per_page: raw.per_page, total: raw.total, from: raw.from ?? 0, to: raw.to ?? 0 },
    }
  },

  /**
   * Get promo code details
   */
  async getPromoCode(id: number): Promise<PromoCode> {
    return apiClient.get<PromoCode>(`/admin/promo-codes/${id}`)
  },

  /**
   * Create new promo code
   */
  async createPromoCode(data: PromoCodeFormData): Promise<PromoCode> {
    const response = await apiClient.post<{ message: string; promo_code: PromoCode }>(
      '/admin/promo-codes',
      data
    )
    return response.promo_code
  },

  /**
   * Update promo code
   */
  async updatePromoCode(id: number, data: Partial<PromoCodeFormData>): Promise<PromoCode> {
    const response = await apiClient.put<{ message: string; promo_code: PromoCode }>(
      `/admin/promo-codes/${id}`,
      data
    )
    return response.promo_code
  },

  /**
   * Delete promo code
   */
  async deletePromoCode(id: number): Promise<void> {
    await apiClient.delete(`/admin/promo-codes/${id}`)
  },
}
