// 서비스 롤 클라이언트 — RLS 우회. 서버 전용(track API, 상태 전이, 재고 차감).
// 절대 클라이언트 번들에 import 금지.
import 'server-only';
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
