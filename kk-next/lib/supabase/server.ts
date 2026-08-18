// 서버 컴포넌트/Route Handler용 클라이언트 — 세션 쿠키 기반 (RLS 적용)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options));
          } catch {
            // 서버 컴포넌트에서 호출 시 무시 — 미들웨어가 세션을 갱신한다
          }
        },
      },
    },
  );
}
