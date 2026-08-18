// Supabase 미설정 시 안내 페이지 — .env.local 작성 방법 (개발자용)
import { isSupabaseConfigured } from '@/lib/env';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const code: React.CSSProperties = {
  display: 'block', background: 'var(--ink)', color: '#EFECE3', borderRadius: 10,
  padding: '14px 16px', fontSize: 12.5, lineHeight: 1.7, overflowX: 'auto',
  fontFamily: 'var(--font-mono-stack)', whiteSpace: 'pre',
};

export default function SetupPage() {
  if (isSupabaseConfigured()) redirect('/');

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '48px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <h1 className="disp" style={{ fontSize: 24 }}>⚙ 초기 설정 필요</h1>
      <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#3D4B60' }}>
        Supabase 환경변수가 아직 없습니다. <b>kk-next/.env.local</b> 파일을 만들고
        Supabase 프로젝트의 키를 입력한 뒤 dev 서버를 재시작하세요.
      </p>

      <div>
        <h2 style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>1 · Supabase 프로젝트 생성</h2>
        <p style={{ fontSize: 13.5, color: '#3D4B60', lineHeight: 1.6 }}>
          <a href="https://supabase.com" style={{ color: '#3D7DD8', fontWeight: 700 }}>supabase.com</a> →
          New project → 생성 후 <b>Settings → API</b>에서 URL과 키 2개를 복사.
        </p>
      </div>

      <div>
        <h2 style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>2 · .env.local 작성</h2>
        <code style={code}>{`NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...   # 서버 전용`}</code>
      </div>

      <div>
        <h2 style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>3 · 마이그레이션 실행</h2>
        <p style={{ fontSize: 13.5, color: '#3D4B60', lineHeight: 1.6 }}>
          Supabase 대시보드 <b>SQL Editor</b>에서 <b>supabase/migrations/</b>의
          0001 → 0002 → 0003을 순서대로 실행.
        </p>
      </div>

      <div>
        <h2 style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>4 · 계정 생성 (Auth → Add user)</h2>
        <code style={code}>{`-- 관리자: 이메일+비밀번호 생성 후
insert into profiles (id, role, name) values ('<user-uuid>', 'manager', '관리자이름');

-- 기사: 이메일 driver-99000001@kkllc.mn / 비밀번호 = PIN 생성 후
insert into profiles (id, role, name) values ('<user-uuid>', 'driver', 'Ганбаа');
update drivers set user_id = '<user-uuid>' where name = 'Ганбаа';`}</code>
      </div>

      <p style={{ fontSize: 13, color: '#8A8062' }}>
        자세한 내용: kk-next/README.md · 푸시(FCM)는 없어도 앱은 정상 동작합니다.
      </p>
    </main>
  );
}
