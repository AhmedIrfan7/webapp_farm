export type UserRole = 'admin' | 'customer' | 'farm'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  address: string | null
  city: string | null
  role: UserRole
  business_name: string | null
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  unit: string
  category: 'milk' | 'dairy'
  image_url: string | null
  stock_quantity: number
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface SilageProduct {
  id: string
  name: string
  type: string
  description: string | null
  price_per_ton: number
  available_quantity: number | null
  minimum_order: number
  unit: string
  image_url: string | null
  is_available: boolean
  created_at: string
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type PaymentMethod = 'cod' | 'bank_transfer' | 'online'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  total_amount: number
  delivery_address: string | null
  delivery_city: string | null
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  notes: string | null
  estimated_delivery: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
  profiles?: Profile
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_purchase: number
  products?: Product
}

export type SilageOrderStatus =
  | 'inquiry'
  | 'quoted'
  | 'confirmed'
  | 'processing'
  | 'delivered'
  | 'cancelled'

export interface SilageOrder {
  id: string
  user_id: string | null
  farm_name: string
  contact_person: string
  email: string
  phone: string
  product_id: string | null
  quantity_tons: number
  delivery_address: string | null
  requested_delivery_date: string | null
  status: SilageOrderStatus
  quote_amount: number | null
  notes: string | null
  created_at: string
  updated_at: string
  silage_products?: SilageProduct
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  products?: Product
}

export interface Testimonial {
  id: string
  customer_name: string
  customer_image: string | null
  content: string
  rating: number
  is_visible: boolean
  created_at: string
}

export interface DashboardStats {
  total_orders: number
  total_revenue: number
  total_customers: number
  pending_orders: number
  silage_orders: number
  monthly_revenue: { month: string; revenue: number }[]
}
