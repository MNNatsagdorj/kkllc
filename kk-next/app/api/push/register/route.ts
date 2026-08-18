// POST /api/push/register — 기사 FCM 토큰 저장 (06 문서)
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole, badRequest } from '@/lib/api-guard';

export async function POST(request: Request) {
  const auth = await requireRole('driver');
  if ('error' in auth) return auth.error;
  if (!auth.profile.driverId) return badRequest('Жолоочийн бүртгэл холбогдоогүй байна');

  const { token } = (await request.json()) as { token?: string };
  if (!token) return badRequest('token шаардлагатай');

  const db = createAdminClient();
  const { error } = await db.from('drivers')
    .update({ fcm_token: token }).eq('id', auth.profile.driverId);
  if (error) return badRequest(error.message);
  return NextResponse.json({ ok: true });
}
