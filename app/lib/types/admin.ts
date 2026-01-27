import type { Order, OrderStatus, PaymentStatus, Product, Category, PromoCode } from './index'

/**
 * Dashboard Statistics
 */
export interface DashboardStats {
  orders_today: number
  revenue_today: number
  new_orders_count: number
  avg_order_value_today: number
  recent_orders: Order[]
}

/**
 * Admin Order Filters
 */
export interface AdminOrderFilters {
  status?: OrderStatus
  payment_status?: PaymentStatus
  date_from?: string
  date_to?: string
  search?: string
  sort_by?: 'created_at' | 'total_amount'
  sort_order?: 'asc' | 'desc'
  page?: number
}

/**
 * Admin Product Filters
 */
export interface AdminProductFilters {
  category_id?: number
  is_active?: boolean
  in_stock?: boolean
  search?: string
  sort_by?: 'created_at' | 'price' | 'sales_count'
  sort_order?: 'asc' | 'desc'
  page?: number
}

/**
 * Update Order Status Request
 */
export interface UpdateOrderStatusRequest {
  status: OrderStatus
  comment?: string
}

/**
 * Create/Update Product Request
 */
export interface ProductFormData {
  name: string
  slug: string
  description: string
  price: number
  compare_at_price?: number
  category_id: number
  images: string[]
  stock: number
  sku: string
  weight?: number
  height?: number
  flower_types?: string[]
  colors?: string[]
  occasions?: string[]
  meta_title?: string
  meta_description?: string
  is_featured?: boolean
  is_new?: boolean
  is_active?: boolean
}

/**
 * Create/Update Category Request
 */
export interface CategoryFormData {
  name: string
  slug: string
  description?: string
  image_url?: string
  parent_id?: number
  sort_order?: number
  is_active?: boolean
}

/**
 * Create/Update Promo Code Request
 */
export interface PromoCodeFormData {
  code: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  min_order_amount?: number
  max_discount?: number
  applicable_to?: 'all' | 'category' | 'product'
  category_ids?: number[]
  product_ids?: number[]
  usage_limit?: number
  per_user_limit?: number
  valid_from: string
  valid_until: string
  is_active?: boolean
}

/**
 * Admin Promo Code Filters
 */
export interface AdminPromoCodeFilters {
  is_active?: boolean
  valid?: boolean
  page?: number
}
