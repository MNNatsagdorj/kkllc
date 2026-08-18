// PATCH /api/orders/[id]/status — 상태 전이 (BR-3/4/6 서버 검증)
// delivered: 사진 필수 → delivered_at 기록 + 재고 차감. 이력 자동 기록.
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole, badRequest } from '@/lib/api-guard';
import { canTransition } from '@/lib/status';
import { sendSMS } from '@/lib/sms';
import type { Order, OrderStatus } from '@/lib/types';

interface StatusReq {
  status: OrderStatus;
  note?: string;
  proof_photo_url?: string; // delivered 직전 업로드한 Storage 경로
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole('manager', 'driver');
  if ('error' in auth) return auth.error;
  const { profile } = auth;

  const { id } = await params;
  const orderId = Number(id);
  const body = (await request.json()) as StatusReq;
  if (!body?.status) return badRequest('status шаардлагатай');

  const db = createAdminClient();
  const { data: order, error } = await db.from('orders')
    .select('*, items:order_items(*)').eq('id', orderId).single();
  if (error || !order) return NextResponse.json({ error: 'Захиалга олдсонгүй' }, { status: 404 });

  // 기사는 본인 배정 주문만
  if (profile.role === 'driver' && order.driver_id !== profile.driverId) {
    return NextResponse.json({ error: 'Таны захиалга биш байна' }, { status: 403 });
  }

  // 사진 증빙이 같이 오면 전이 검사 전에 반영 (BR-6)
  if (body.proof_photo_url) order.proof_photo_url = body.proof_photo_url;

  const check = canTransition(order as unknown as Order, body.status, profile.role);
  if (!check.ok) return badRequest(check.reason);

  const patch: Record<string, unknown> = { status: body.status };
  if (body.proof_photo_url) patch.proof_photo_url = body.proof_photo_url;
  if (body.note) patch.note = body.note;
  if (body.status === 'delivered') patch.delivered_at = new Date().toISOString();

  const { error: uErr } = await db.from('orders').update(patch).eq('id', orderId);
  if (uErr) return badRequest(uErr.message);

  if (body.status === 'delivered') {
    // 재고 차감 + 수불 기록 + Зээл(외상) 누적을 한 번에 (0004)
    const { error: sErr } = await db.rpc('apply_delivered_effects', { p_order_id: orderId });
    if (sErr) console.error('delivered effects failed', sErr);
  }

  // P3: 출발 시 고객 SMS "Ачаа тань замд гарлаа" (SMS_API_URL 미설정 시 skip)
  if (body.status === 'en_route' && order.customer_id) {
    const { data: cust } = await db.from('customers')
      .select('phone').eq('id', order.customer_id).single();
    await sendSMS(cust?.phone, `Ачаа тань замд гарлаа. Захиалга #${orderId} — KK LLC ☎ 7011-2233`);
  }

  await db.from('order_status_history').insert({
    order_id: orderId, status: body.status, changed_by: profile.userId,
  });

  return NextResponse.json({ ok: true });
}
