'use client';

// 사이드바 — Самбар(P1) + P2 메뉴는 자리만 (05 문서 레이아웃)
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const MENU: { label: string; href?: string; phase?: string }[] = [
  { label: 'Самбар', href: '/admin' },
  { label: 'Захиалга', phase: 'P2' },
  { label: 'Жолооч', phase: 'P2' },
  { label: 'Нөөц', phase: 'P2' },
  { label: 'Харилцагч', phase: 'P2' },
  { label: 'Тайлан', phase: 'P2' },
];

export function Sidebar({ managerName }: { managerName: string }) {
  const router = useRouter();
  const logout = async () => {
    await createClient().auth.signOut();
    router.replace('/login');
  };

  return (
    <aside style={{ width: 190, flexShrink: 0, borderRight: '1px solid var(--line)', padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div className="disp" style={{ fontSize: 19, color: '#EFECE3', padding: '0 10px', marginBottom: 18 }}>
        KK <span style={{ color: 'var(--kraft)' }}>LLC</span>
      </div>
      {MENU.map((m) =>
        m.href ? (
          <a key={m.label} href={m.href}
            style={{ padding: '9px 10px', borderRadius: 8, fontSize: 13.5, fontWeight: 700, background: 'var(--ink3)', color: '#EFECE3' }}>
            {m.label}
          </a>
        ) : (
          <span key={m.label}
            style={{ padding: '9px 10px', borderRadius: 8, fontSize: 13.5, color: 'var(--mut)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'default' }}>
            {m.label}
            <span style={{ fontSize: 9, fontWeight: 700, border: '1px solid var(--line)', borderRadius: 5, padding: '1px 5px' }}>{m.phase}</span>
          </span>
        ),
      )}
      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--line)', paddingTop: 12 }}>
        <div style={{ fontSize: 12.5, color: 'var(--mut)', padding: '0 10px 8px' }}>{managerName}</div>
        <button onClick={logout}
          style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8, fontSize: 13, color: 'var(--mut)', background: 'none', border: '1px solid var(--line)', cursor: 'pointer' }}>
          Гарах
        </button>
      </div>
    </aside>
  );
}
