// POST /api/orders/[id]/assign — 기사 배정 (BR-5 용량 검사) + FCM 푸시
// 초과 시 409 + 경고(рейс 제안) 반환 → 프론트가 확인 후 force:true로 재요청 (차단 아님).
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole, badRequest } from '@/lib/api-guard';
import { checkCapacity } from '@/lib/delivery';
import { sendPush } from '@/lib/fcm';

interface AssignReq { driver_id: string; force?: boolean }

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireRole('manager');
  if ('error' in auth) return auth.error;

  const { id } = await params;
  const orderId = Number(id);
  const body = (await request.json()) as AssignReq;
  if (!body?.driver_id) return badRequest('driver_id шаардлагатай');

  const db = createAdminClient();
  const [{ data: order }, { data: driver }] = await Promise.all([
    db.from('orders')
      .select('*, items:order_items(qty, product:products(name_mn))')
      .eq('id', orderId).single(),
    db.from('drivers')
      .select('*, vehicle:vehicles(*)').eq('id', body.driver_id).single(),
  ]);
  if (!order) return NextResponse.json({ error: 'Захиалга олдсонгүй' }, { status: 404 });
  if (!driver) return NextResponse.json({ error: 'Жолооч олдсонгүй' }, { status: 404 });

  // BR-5: 차량 용량 검사 — 경고이지 차단이 아님
  const cap = driver.vehicle
    ? checkCapacity(Number(order.total_weight_kg), driver.vehicle.capacity_kg, driver.vehicle.model)
    : { overloaded: false, trips: 1 as const };
  if (cap.overloaded && !body.force) {
    return NextResponse.json(
      { warning: cap.message, trips: cap.trips }, { status: 409 });
  }

  const patch: Record<string, unknown> = { driver_id: body.driver_id };
  const becameAssigned = order.status === 'new';
  if (becameAssigned) patch.status = 'assigned';

  const { error: uErr } = await db.from('orders').update(patch).eq('id', orderId);
  if (uErr) return badRequest(uErr.message);

  if (becameAssigned) {
    await db.from('order_status_history').insert({
      order_id: orderId, status: 'assigned', changed_by: auth.profile.userId,
    });
  }

  // FCM 푸시: Шинэ хүргэлт #1030 хуваарилагдлаа / СХД · Блокны цавуу ×200 · 5.0т — 2 рейс
  type ItemRow = { qty: number; product: { name_mn: string } | null };
  const summary = ((order.items ?? []) as ItemRow[])
    .map((i) => `${i.product?.name_mn ?? '?'} ×${i.qty}`).join(' · ');
  const tons = `${(Number(order.total_weight_kg) / 1000).toFixed(1)}т`;
  const pushed = await sendPush(
    driver.fcm_token,
    `Шинэ хүргэлт #${orderId} хуваарилагдлаа`,
    `${order.district ?? ''} · ${summary} · ${tons}${cap.trips > 1 ? ` — ${cap.trips} рейс` : ''}`,
  );

  return NextResponse.json({ ok: true, pushed, trips: cap.trips });
}
