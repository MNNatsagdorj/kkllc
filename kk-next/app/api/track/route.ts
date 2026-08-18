// GET /api/track?phone= — 공개 주문조회 (04 문서 §6)
// 서비스 롤로 조회하되 최소 필드만 반환: 번호·상태·품목요약·합계·예정일. 주소·기사 미노출.
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const phone = new URL(request.url).searchParams.get('phone')?.trim();
  if (!phone) return NextResponse.json({ error: 'phone шаардлагатай' }, { status: 400 });

  const db = createAdminClient();
  const { data: customers } = await db.from('customers').select('id').eq('phone', phone);
  const ids = (customers ?? []).map((c) => c.id);
  if (!ids.length) return NextResponse.json({ orders: [] });

  const { data: orders } = await db.from('orders')
    .select('id, status, created_at, scheduled_date, subtotal_mnt, delivery_fee_mnt, is_free_delivery, items:order_items(qty, product:products(name_mn))')
    .in('customer_id', ids)
    .order('created_at', { ascending: false })
    .limit(3);

  type Row = {
    id: number; status: string; created_at: string; scheduled_date: string | null;
    subtotal_mnt: number; delivery_fee_mnt: number; is_free_delivery: boolean;
    items: { qty: number; product: { name_mn: string } | null }[];
  };
  const result = ((orders ?? []) as unknown as Row[]).map((o) => ({
    id: o.id,
    status: o.status,
    created_at: o.created_at,
    scheduled_date: o.scheduled_date,
    total_mnt: o.subtotal_mnt + o.delivery_fee_mnt,
    is_free_delivery: o.is_free_delivery,
    items_summary: o.items.map((i) => `${i.product?.name_mn ?? '?'} ×${i.qty}`).join(' · '),
  }));
  return NextResponse.json({ orders: result });
}
