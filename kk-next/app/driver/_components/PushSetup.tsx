'use client';

// 로그인 후 SW 등록 + FCM 토큰 저장 + 푸시 토스트 (06 문서)
import { useEffect, useState } from 'react';
import { setupPushAndSW } from '@/lib/push-client';

export function PushSetup() {
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    setupPushAndSW((title, body) => {
      setToast({ title, body });
      setTimeout(() => setToast(null), 6000);
    });
  }, []);

  if (!toast) return null;
  return (
    <div style={{ position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 90, width: 'min(92vw, 420px)', background: 'var(--ink2)', border: '1px solid color-mix(in srgb, var(--st-way) 55%, transparent)', borderRadius: 12, padding: '12px 16px', color: '#EFECE3', boxShadow: '0 10px 34px rgba(0,0,0,.4)' }}>
      <div style={{ fontSize: 13.5, fontWeight: 800 }}>{toast.title}</div>
      {toast.body && <div style={{ fontSize: 12.5, color: 'var(--mut)', marginTop: 3 }}>{toast.body}</div>}
    </div>
  );
}
