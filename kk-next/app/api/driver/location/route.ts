// POST /api/driver/location — 배송 중 기사 앱이 현재 위치를 주기 보고
// 최신값만 drivers에 덮어씀 → /track 고객 지도에서 사용. 이력 저장 없음.
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole, badRequest } from '@/lib/api-guard';

export async function POST(request: Request) {
  const auth = await requireRole('driver');
  if ('error' in auth) return auth.error;
  const { profile } = auth;
  if (!profile.driverId) return badRequest('Жолоочийн профайл олдсонгүй');

  const { lat, lng } = (await request.json()) as { lat?: number; lng?: number };
  if (typeof lat !== 'number' || typeof lng !== 'number' || !isFinite(lat) || !isFinite(lng)) {
    return badRequest('lat/lng шаардлагатай');
  }

  const db = createAdminClient();
  const { error } = await db.from('drivers')
    .update({ last_lat: lat, last_lng: lng, last_loc_at: new Date().toISOString() })
    .eq('id', profile.driverId);
  if (error) return badRequest(error.message);
  return NextResponse.json({ ok: true });
}
