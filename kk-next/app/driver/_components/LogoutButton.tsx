'use client';

// 기사 헤더 로그아웃 — 관리자 Sidebar의 Гарах와 동일한 흐름
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LogoutButton() {
  const router = useRouter();
  const logout = async () => {
    await createClient().auth.signOut();
    router.replace('/login');
  };
  return (
    <button onClick={logout}
      style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--mut)', background: 'none', border: '1px solid var(--line)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer' }}>
      Гарах
    </button>
  );
}
