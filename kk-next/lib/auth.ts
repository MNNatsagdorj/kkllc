// 세션 → 역할 조회 헬퍼 (서버 전용)
import { createClient } from './supabase/server';
import type { Role } from './status';

export interface SessionProfile {
  userId: string;
  role: Role;
  name: string | null;
  driverId: string | null; // role='driver'일 때 drivers.id
}

/** 로그인 세션의 프로필. 미로그인/프로필 없음 → null */
export async function getProfile(): Promise<SessionProfile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles').select('role, name').eq('id', user.id).single();
  if (!profile) return null;

  let driverId: string | null = null;
  if (profile.role === 'driver') {
    const { data: d } = await supabase
      .from('drivers').select('id').eq('user_id', user.id).single();
    driverId = d?.id ?? null;
  }
  return { userId: user.id, role: profile.role as Role, name: profile.name, driverId };
}
