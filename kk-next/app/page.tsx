// 공개 사이트 홈 — Phase 2에서 04-website-spec.md 대로 개편 예정. 지금은 진입 안내만.
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24 }}>
      <h1 className="disp" style={{ fontSize: 30, color: 'var(--site-text)' }}>KK LLC</h1>
      <p style={{ color: '#5E6C80', fontSize: 15, textAlign: 'center' }}>
        Барилгын материалын захиалга · хүргэлтийн систем
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link href="/admin" style={{ padding: '11px 22px', borderRadius: 9, background: 'var(--ink)', color: '#EFECE3', fontWeight: 700, fontSize: 14 }}>
          Менежер →
        </Link>
        <Link href="/driver" style={{ padding: '11px 22px', borderRadius: 9, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 700, fontSize: 14 }}>
          Жолооч →
        </Link>
      </div>
    </main>
  );
}
