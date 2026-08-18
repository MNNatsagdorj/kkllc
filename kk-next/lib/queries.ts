// Supabase 조인 select 문자열 + 결과 행 타입 (관리자·기사 공용)
import type { CustomerType, OrderSource, OrderStatus, PaymentMethod } from './types';

export const ORDER_SELECT =
  '*, items:order_items(*, product:products(name_mn, weight_kg, band_color)), ' +
  'customer:customers(name, phone, type), ' +
  'driver:drivers(id, name, phone, vehicle:vehicles(model, plate, capacity_kg))';

export interface VehicleRow { model: string; plate: string; capacity_kg: number }

export interface OrderItemRow {
  id: string;
  order_id: number;
  product_id: string;
  qty: number;
  unit_price_mnt: number;
  batch_no: string | null;
  loaded: boolean;
  product: { name_mn: string; weight_kg: number; band_color: string | null } | null;
}

export interface OrderRow {
  id: number;
  customer_id: string | null;
  status: OrderStatus;
  district: string | null;
  address: string;
  lat: number | null;
  lng: number | null;
  total_qty: number;
  total_weight_kg: number;
  subtotal_mnt: number;
  delivery_fee_mnt: number;
  is_free_delivery: boolean;
  payment_method: PaymentMethod | null;
  cash_amount_mnt: number | null;
  driver_id: string | null;
  scheduled_date: string | null;
  source: OrderSource;
  note: string | null;
  proof_photo_url: string | null;
  created_at: string;
  delivered_at: string | null;
  customer: { name: string; phone: string; type: CustomerType } | null;
  driver: { id: string; name: string; phone: string; vehicle: VehicleRow | null } | null;
  items: OrderItemRow[];
}

export interface DriverRow {
  id: string;
  name: string;
  phone: string;
  is_active: boolean;
  vehicle: VehicleRow | null;
}

export const itemsSummary = (o: OrderRow) =>
  o.items.map((i) => `${i.product?.name_mn ?? '?'} ×${i.qty}`).join(' · ');

export const fmtWeight = (kg: number) =>
  kg >= 1000 ? `${(kg / 1000).toFixed(1).replace(/\.0$/, '')}т` : `${Math.round(kg).toLocaleString('en-US')}кг`;
