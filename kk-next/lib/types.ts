// 02-data-model.md — 공용 타입 (세 화면 공통)

export type OrderStatus =
  | 'pending' | 'new' | 'assigned' | 'loading' | 'en_route' | 'delivered' | 'cancelled';

export type PaymentMethod = 'cash' | 'transfer' | 'credit'; // Бэлэн·Данс·Зээл
export type CustomerType = 'individual' | 'shop';
export type OrderSource = 'manager' | 'website' | 'voice';

export interface Product {
  id: string;
  sku: string;
  name_mn: string;
  use_mn?: string | null;
  weight_kg: number;
  price_mnt: number;
  stock_qty: number;
  band_color?: string | null;
  is_active: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  type: CustomerType;
  district?: string | null;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  credit_balance: number;
  note?: string | null;
}

export interface Vehicle {
  id: string;
  model: string;      // 'Майти'
  plate: string;      // '01-23 УБА'
  capacity_kg: number;
}

export interface Driver {
  id: string;
  user_id?: string | null;
  name: string;
  phone: string;
  vehicle_id?: string | null;
  vehicle?: Vehicle;
  fcm_token?: string | null;
  is_active: boolean;
}

export interface OrderItem {
  id?: string;
  order_id?: number;
  product_id: string;
  product?: Product;
  qty: number;
  unit_price_mnt: number;
  batch_no?: string | null;
  loaded: boolean;
}

export interface Order {
  id: number;                       // #1024 형식으로 표시
  customer_id?: string | null;
  customer?: Customer;
  status: OrderStatus;
  district?: string | null;
  address: string;
  lat?: number | null;
  lng?: number | null;
  total_qty: number;
  total_weight_kg: number;
  subtotal_mnt: number;
  delivery_fee_mnt: number;
  is_free_delivery: boolean;
  payment_method?: PaymentMethod | null;
  cash_amount_mnt?: number | null;
  driver_id?: string | null;
  driver?: Driver;
  scheduled_date?: string | null;
  source: OrderSource;
  note?: string | null;
  proof_photo_url?: string | null;
  created_at?: string;
  delivered_at?: string | null;
  items: OrderItem[];
}

// UB 지역구 상수 — select 옵션으로 사용, 자유 입력도 허용 (02 문서)
export const UB_DISTRICTS = ['БЗД', 'СХД', 'ХУД', 'БГД', 'ЧД', 'СБД', 'БНД', 'НД'] as const;

// 표기 규칙 (BR-9): 정수 MNT + 천단위 콤마 + ₮ 뒤붙임
export const fmtMNT = (n: number) => `${Math.round(n).toLocaleString('en-US')}₮`;
export const fmtOrderNo = (id: number) => `#${id}`;
