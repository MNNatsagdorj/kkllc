// POST /api/drivers — 기사 생성/수정 + 로그인(Auth) 자동 연결 (관리자 전용)
// 로그인 규약(01 문서): email `driver-{전화숫자}@kkllc.mn`, password = PIN.
// 신규 기사는 PIN 필수 → Auth 유저 생성 + profiles(role=driver) + drivers.user_id 연결.
// 기존 기사는 PIN 입력 시 재설정, 전화 변경 시 로그인 이메일도 갱신.
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole, badRequest } from '@/lib/api-guard';

const driverEmail = (phone: string) => `driver-${phone.replace(/\D/g, '')}@kkllc.mn`;

interface DriverReq {
  id?: string;
  name: string; phone: string;
  vehicle_id?: string | null;
  is_active?: boolean;
  pin?: string;
}

export async function POST(request: Request) {
  const auth = await requireRole('manager');
  if ('error' in auth) return auth.error;

  const body = (await request.json()) as DriverReq;
  if (!body?.name?.trim() || !body?.phone?.trim()) return badRequest('Нэр/утас дутуу');
  const pin = body.pin?.trim() || null;
  if (pin && !/^\d{4,8}$/.test(pin)) return badRequest('PIN 4–8 оронтой тоо байх ёстой');

  const db = createAdminClient();
  const patch = {
    name: body.name.trim(),
    phone: body.phone.trim(),
    vehicle_id: body.vehicle_id || null,
    is_active: body.is_active ?? true,
  };

  let driverId = body.id ?? null;
  let userId: string | null = null;

  if (driverId) {
    const { data: existing, error } = await db.from('drivers')
      .select('user_id').eq('id', driverId).single();
    if (error || !existing) return NextResponse.json({ error: 'Жолооч олдсонгүй' }, { status: 404 });
    userId = existing.user_id;
    const { error: uErr } = await db.from('drivers').update(patch).eq('id', driverId);
    if (uErr) return badRequest(uErr.message);
  } else {
    if (!pin) return badRequest('Шинэ жолоочид PIN заавал — утас+PIN-ээр нэвтэрнэ');
    const { data: created, error } = await db.from('drivers').insert(patch).select('id').single();
    if (error) return badRequest(error.message);
    driverId = created.id;
  }

  const email = driverEmail(patch.phone);
  if (userId) {
    // 기존 로그인: 전화 변경 → 이메일 갱신, PIN 입력 시 재설정
    const upd: { email: string; password?: string } = { email };
    if (pin) upd.password = pin;
    const { error } = await db.auth.admin.updateUserById(userId, upd);
    if (error) return badRequest(`Нэвтрэх эрх шинэчилж чадсангүй: ${error.message}`);
    await db.from('profiles').update({ name: patch.name }).eq('id', userId);
  } else if (pin) {
    // 로그인 신규 생성 + 프로필 + 기사 연결
    const { data: created, error } = await db.auth.admin.createUser({
      email, password: pin, email_confirm: true,
    });
    if (error || !created.user) {
      return badRequest(`Нэвтрэх эрх үүсгэж чадсангүй: ${error?.message ?? '?'}`);
    }
    userId = created.user.id;
    const { error: pErr } = await db.from('profiles')
      .insert({ id: userId, role: 'driver', name: patch.name });
    if (pErr) console.error('profiles insert failed', pErr);
    const { error: lErr } = await db.from('drivers').update({ user_id: userId }).eq('id', driverId);
    if (lErr) return badRequest(lErr.message);
  }

  return NextResponse.json({ ok: true, id: driverId, hasLogin: !!userId });
}
