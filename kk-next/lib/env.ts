// Supabase 환경변수 설정 여부 — 미설정 시 앱을 죽이지 않고 /setup 안내로 보낸다
export const isSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
