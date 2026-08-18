// /admin·/driver 접근 가드 + Supabase 세션 쿠키 갱신 (Next 16: middleware → proxy)
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isSupabaseConfigured } from './lib/env';

export async function proxy(request: NextRequest) {
  // 환경변수 미설정(.env.local 없음) → 크래시 대신 /setup 안내 페이지로
  if (!isSupabaseConfigured()) {
    const url = request.nextUrl.clone();
    url.pathname = '/setup';
    url.search = '';
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = pathname.startsWith('/admin') || pathname.startsWith('/driver');
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  // 역할(manager/driver) 검증은 각 layout 서버 컴포넌트에서 수행
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/driver/:path*', '/login'],
};
