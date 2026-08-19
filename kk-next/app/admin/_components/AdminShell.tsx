'use client';

// 관리자 반응형 셸 — 데스크톱: 고정 사이드바 / 모바일(≤820px): 햄버거 드로어
import { useState } from 'react';
import { Sidebar } from './Sidebar';

export function AdminShell({ managerName, children }: {
  managerName: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="blueprint" style={{ minHeight: '100dvh', color: '#EFECE3' }}>
      {/* 모바일 상단바 */}
      <div className="admin-topbar no-print">
        <button onClick={() => setOpen(true)} aria-label="Цэс"
          style={{ background: 'none', border: '1px solid var(--line)', color: '#EFECE3', borderRadius: 8, width: 38, height: 38, fontSize: 17, cursor: 'pointer' }}>
          ☰
        </button>
        <span className="disp" style={{ fontSize: 16 }}>KK <span style={{ color: 'var(--kraft)' }}>LLC</span></span>
      </div>

      <div style={{ display: 'flex', minHeight: '100dvh' }}>
        {open && <div className="admin-overlay" onClick={() => setOpen(false)} />}
        <div className={`admin-sidebar-wrap${open ? ' open' : ''}`}>
          <Sidebar managerName={managerName} onNavigate={() => setOpen(false)} />
        </div>
        <main className="admin-main" style={{ flex: 1, minWidth: 0, padding: '18px 22px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
