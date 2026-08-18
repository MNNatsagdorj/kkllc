export interface Category {
  id: number
  name: string
  iconKey: string
  sortOrder: number
  active: boolean
  productCount?: number
}

export interface Product {
  id: number
  sku: string
  name: string
  brand?: string | null
  categoryId: number
  categoryName?: string
  price: number
  pack?: string | null
  stock: number
  status: 'active' | 'low' | 'out'
}

export interface OrderItem {
  id?: number
  productId: number
  productName: string
  unitPrice: number
  qty: number
  lineTotal: number
}

export interface SalesOrder {
  id: number
  code: string
  customerId?: number | null
  customerName: string
  phone?: string | null
  total: number
  status: 'pending' | 'shipping' | 'delivered' | 'canceled'
  orderedAt: string
  deliveredAt?: string | null
  note?: string | null
  deliveryAddress?: string | null
  deliveryLat?: number | null
  deliveryLng?: number | null
  source: 'admin' | 'web' | 'telegram'
  itemsSummary?: string
  items?: OrderItem[]
}

export interface ProductionLog {
  id: number
  prodDate: string
  productId: number
  productName: string
  qty: number
  note?: string | null
}

export interface ProductionMonth {
  monthTotal: number
  days: { date: string; total: number }[]
}

export interface Material {
  id: number
  name: string
  unit: string
  defaultPrice: number
  active: boolean
}

export interface Supplier {
  id: number
  name: string
  phone?: string | null
}

export interface Purchase {
  id: number
  purchaseDate: string
  materialId: number
  materialName: string
  supplierId?: number | null
  supplierName?: string | null
  qty: number
  unit: string
  unitPrice: number
  total: number
  payStatus: 'paid' | 'pending'
}

export interface PurchaseSummary {
  monthTotal: number
  cnt: number
  unpaid: number
  avg: number
}

export interface Quote {
  id: number
  customerName: string
  phone?: string | null
  productText?: string | null
  message: string
  estimate?: number | null
  status: 'new' | 'answered' | 'closed'
  isRead: boolean
  source: 'web' | 'telegram' | 'admin'
  receivedAt: string
}

export interface Customer {
  id: number
  name: string
  phone?: string | null
  tier: 'new' | 'reg' | 'vip'
  type: 'company' | 'business' | 'individual'
  address?: string | null
  lat?: number | null
  lng?: number | null
  email?: string | null
  note?: string | null
  ordersCount?: number
  totalSpent?: number
}

export interface CustomerDetail {
  customer: Customer
  recentOrders: SalesOrder[]
}

export interface DashboardSummary {
  monthRevenue?: number
  revenueDeltaPct?: number | null
  ordersCount?: number
  ordersDeltaPct?: number | null
  newCustomers?: number
  avgOrder?: number
}

export interface NameAmount { name: string; amount: number }
export interface MonthAmount { month: string; amount: number }
export interface RevCost { month: string; revenue: number; cost: number }
export interface TopProduct { productId: number; productName: string; sold: number }
export interface ProfitRow { revenue: number; cost: number; grossProfit: number; margin: number; costRatio: number }
export interface ChartPoint { label: string; amount: number }
