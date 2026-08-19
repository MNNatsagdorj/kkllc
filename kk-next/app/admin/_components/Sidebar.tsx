'use client';

// 사이드바 — P1 Самбар + P2 페이지 전체 (05 문서 레이아웃)
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const MENU: { label: string; href: string }[] = [
  { label: 'Самбар', href: '/admin' },
  { label: 'Захиалга', href: '/admin/orders' },
  { label: 'Жолооч', href: '/admin/drivers' },
  { label: 'Нөөц', href: '/admin/inventory' },
  { label: 'Харилцагч', href: '/admin/customers' },
  { label: 'Тайлан', href: '/admin/reports' },
];

export function Sidebar({ managerName, onNavigate }: { managerName: string; onNavigate?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const logout = async () => {
    await createClient().auth.signOut();
    router.replace('/login');
  };

  return (
    <aside className="no-print" style={{ width: 190, flexShrink: 0, borderRight: '1px solid var(--line)', padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div className="disp" style={{ fontSize: 19, color: '#EFECE3', padding: '0 10px', marginBottom: 18 }}>
        KK <span style={{ color: 'var(--kraft)' }}>LLC</span>
      </div>
      {MENU.map((m) => {
        const active = pathname === m.href;
        return (
          <Link key={m.href} href={m.href} onClick={onNavigate}
            style={{ padding: '9px 10px', borderRadius: 8, fontSize: 13.5, fontWeight: active ? 700 : 500, background: active ? 'var(--ink3)' : 'transparent', color: active ? '#EFECE3' : 'var(--mut)' }}>
            {m.label}
          </Link>
        );
      })}
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
