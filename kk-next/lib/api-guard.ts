// Route Handler 공용 가드 — 세션·역할 검사 후 프로필 반환
import 'server-only';
import { NextResponse } from 'next/server';
import { getProfile, type SessionProfile } from './auth';
import type { Role } from './status';

export async function requireRole(...roles: Role[]):
  Promise<{ profile: SessionProfile } | { error: NextResponse }> {
  const profile = await getProfile();
  if (!profile) {
    return { error: NextResponse.json({ error: 'Нэвтрээгүй байна' }, { status: 401 }) };
  }
  if (roles.length && !roles.includes(profile.role)) {
    return { error: NextResponse.json({ error: 'Эрх хүрэлцэхгүй байна' }, { status: 403 }) };
  }
  return { profile };
}

export const badRequest = (msg: string) =>
  NextResponse.json({ error: msg }, { status: 400 });
