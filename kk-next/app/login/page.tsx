'use client';

// 로그인 — 관리자(이메일+비밀번호) / 기사(전화+PIN, 01 문서)
// 기사 계정은 관리자가 Supabase Auth에 email `driver-{전화숫자}@kkllc.mn`, password=PIN 으로 생성한다.
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const driverEmail = (phone: string) => `driver-${phone.replace(/\D/g, '')}@kkllc.mn`;

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [mode, setMode] = useState<'manager' | 'driver'>('manager');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const f = new FormData(e.currentTarget);
    const supabase = createClient();

    const email = mode === 'manager'
      ? String(f.get('email'))
      : driverEmail(String(f.get('phone')));
    const password = String(f.get(mode === 'manager' ? 'password' : 'pin'));

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setErr(mode === 'manager' ? 'И-мэйл эсвэл нууц үг буруу байна' : 'Утас эсвэл PIN буруу байна');
      setBusy(false);
      return;
    }
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', data.user.id).single();
    const next = search.get('next');
    router.replace(next ?? (profile?.role === 'driver' ? '/driver' : '/admin'));
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '10px 0', borderRadius: 9, fontSize: 14, fontWeight: 700,
    cursor: 'pointer', border: '1px solid var(--line)',
    background: active ? 'var(--kraft)' : 'transparent',
    color: active ? 'var(--ink)' : 'var(--mut)',
  });
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 9, fontSize: 15,
    background: 'var(--ink2)', border: '1px solid var(--line)', color: '#EFECE3',
  };

  return (
    <main className="blueprint" style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: 380, maxWidth: '100%', background: 'var(--ink2)', border: '1px solid var(--line)', borderRadius: 16, padding: 28 }}>
        <div className="disp" style={{ color: '#EFECE3', fontSize: 22, marginBottom: 4 }}>KK LLC</div>
        <div style={{ color: 'var(--mut)', fontSize: 13, marginBottom: 22 }}>Захиалга · хүргэлтийн систем</div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button type="button" style={tabStyle(mode === 'manager')} onClick={() => setMode('manager')}>Менежер</button>
          <button type="button" style={tabStyle(mode === 'driver')} onClick={() => setMode('driver')}>Жолооч</button>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'manager' ? (
            <>
              <input name="email" type="email" placeholder="И-мэйл" required style={inputStyle} />
              <input name="password" type="password" placeholder="Нууц үг" required style={inputStyle} />
            </>
          ) : (
            <>
              <input name="phone" inputMode="tel" placeholder="Утас (9900-0001)" required style={{ ...inputStyle, fontFamily: 'var(--font-mono-stack)' }} />
              <input name="pin" type="password" inputMode="numeric" placeholder="PIN" required style={{ ...inputStyle, fontFamily: 'var(--font-mono-stack)' }} />
            </>
          )}
          {err && <div style={{ color: 'var(--st-cancel)', fontSize: 13 }}>{err}</div>}
          <button type="submit" disabled={busy}
            style={{ padding: '13px 0', borderRadius: 9, border: 0, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, fontSize: 15, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
            {busy ? 'Түр хүлээнэ үү…' : 'Нэвтрэх'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
