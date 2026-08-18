// POST /api/orders — 주문 생성 (관리자 드로어 + 공개 웹사이트)
// 단가·합계·중량·배송비는 전부 서버에서 계산한다 (03 문서 원칙).
// 관리자 세션 → source 'manager', 비로그인 → source 'website' (칸반 Шинэ로 직행).
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { badRequest } from '@/lib/api-guard';
import { getProfile } from '@/lib/auth';
import { calcDelivery, calcTotalWeight } from '@/lib/delivery';

interface ItemReq { product_id: string; qty: number }
interface CreateReq {
  customer: {
    id?: string; name: string; phone: string;
    type?: 'individual' | 'shop'; district?: string; address?: string;
    lat?: number; lng?: number;
  };
  items: ItemReq[];
  district?: string;
  address: string;
  lat?: number; lng?: number;
  payment_method?: 'cash' | 'transfer' | 'credit';
  scheduled_date?: string;
  note?: string;
}

export async function POST(request: Request) {
  const profile = await getProfile();
  const isManager = profile?.role === 'manager';

  const body = (await request.json()) as CreateReq;
  if (!body?.customer?.name || !body.customer.phone) return badRequest('Харилцагчийн нэр/утас дутуу');
  if (!body.address) return badRequest('Хаяг оруулна уу');
  const items = (body.items ?? []).filter((i) => i.product_id && i.qty > 0);
  if (!items.length) return badRequest('Дор хаяж нэг бараа сонгоно уу');

  const db = createAdminClient();

  // 고객: id 지정 → 그대로, 아니면 전화로 매칭, 없으면 신규 등록
  let customerId = body.customer.id ?? null;
  if (!customerId) {
    const { data: existing } = await db.from('customers')
      .select('id').eq('phone', body.customer.phone).limit(1).maybeSingle();
    if (existing) customerId = existing.id;
    else {
      const { data: created, error } = await db.from('customers').insert({
        name: body.customer.name,
        phone: body.customer.phone,
        type: body.customer.type ?? 'individual',
        district: body.customer.district ?? body.district ?? null,
        address: body.customer.address ?? body.address,
        lat: body.customer.lat ?? body.lat ?? null,
        lng: body.customer.lng ?? body.lng ?? null,
      }).select('id').single();
      if (error) return badRequest(error.message);
      customerId = created.id;
    }
  }

  // 제품 스냅샷 → 합계·중량·배송비 계산 (BR-1)
  const ids = items.map((i) => i.product_id);
  const { data: products, error: pErr } = await db.from('products')
    .select('id, name_mn, price_mnt, weight_kg, is_active').in('id', ids);
  if (pErr) return badRequest(pErr.message);

  const rows = items.map((i) => {
    const p = products?.find((x) => x.id === i.product_id);
    if (!p || !p.is_active) throw new Error(`Бараа олдсонгүй: ${i.product_id}`);
    return { ...i, price: p.price_mnt as number, weight: p.weight_kg as number };
  });
  const subtotal = rows.reduce((s, r) => s + r.price * r.qty, 0);
  const totalQty = rows.reduce((s, r) => s + r.qty, 0);
  const totalWeight = calcTotalWeight(rows.map((r) => ({ qty: r.qty, weight_kg: r.weight })));
  const delivery = calcDelivery(rows);

  const { data: order, error: oErr } = await db.from('orders').insert({
    customer_id: customerId,
    status: 'new',
    district: body.district ?? null,
    address: body.address,
    lat: body.lat ?? null,
    lng: body.lng ?? null,
    total_qty: totalQty,
    total_weight_kg: totalWeight,
    subtotal_mnt: subtotal,
    delivery_fee_mnt: delivery.fee,
    is_free_delivery: delivery.isFree,
    payment_method: body.payment_method ?? null,
    cash_amount_mnt: body.payment_method === 'cash' ? subtotal + delivery.fee : null,
    scheduled_date: body.scheduled_date ?? null,
    source: isManager ? 'manager' : 'website',
    note: body.note ?? null,
    created_by: profile?.userId ?? null,
  }).select('id').single();
  if (oErr) return badRequest(oErr.message);

  const { error: iErr } = await db.from('order_items').insert(rows.map((r) => ({
    order_id: order.id,
    product_id: r.product_id,
    qty: r.qty,
    unit_price_mnt: r.price,
  })));
  if (iErr) return badRequest(iErr.message);

  await db.from('order_status_history').insert({
    order_id: order.id, status: 'new', changed_by: profile?.userId ?? null,
  });

  return NextResponse.json({ id: order.id, delivery }, { status: 201 });
}
