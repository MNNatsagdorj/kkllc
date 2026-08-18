// 공개 사이트 셸 — 네이비 상단바 + 석고 화이트 본문 + 푸터 (04 문서 §1·§7)
import Link from 'next/link';

const navLink: React.CSSProperties = { color: '#D8DEE8', fontSize: 13.5, fontWeight: 600 };

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--site-bg)' }}>
      <nav style={{ background: 'var(--ink)', padding: '0 20px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 22, height: 58 }}>
          <Link href="/" className="disp" style={{ color: '#EFECE3', fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 26, height: 30, background: 'var(--kraft)', borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', fontSize: 11, fontWeight: 900 }}>KK</span>
            KK LLC
          </Link>
          <div style={{ display: 'flex', gap: 18, marginLeft: 8 }} className="max-sm:hidden">
            <Link href="/#products" style={navLink}>Бүтээгдэхүүн</Link>
            <Link href="/#delivery" style={navLink}>Хүргэлт</Link>
            <Link href="/track" style={navLink}>Захиалга шалгах</Link>
            <Link href="/#about" style={navLink}>Бидний тухай</Link>
          </div>
          <a href="tel:70112233" className="mono"
            style={{ marginLeft: 'auto', background: 'var(--ink3)', border: '1px solid var(--line)', color: '#EFECE3', borderRadius: 999, padding: '6px 14px', fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap' }}>
            ☎ 7011-2233
          </a>
        </div>
      </nav>

      <div style={{ flex: 1 }}>{children}</div>

      <footer id="about" style={{ background: 'var(--ink)', color: 'var(--mut)', padding: '26px 20px', fontSize: 12.5, lineHeight: 1.8 }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '8px 34px', justifyContent: 'space-between' }}>
          <span style={{ color: '#EFECE3', fontWeight: 700 }}>Kokorozashi Kibou LLC — Барилгын материалын үйлдвэр</span>
          <span>Үйлдвэр: СХД, Улаанбаатар</span>
          <span className="mono">Захиалга: ☎ 7011-2233 · 09:00–19:00</span>
          <span>Хүргэлт: 100+ш үнэгүй · УБ бүх дүүрэг</span>
        </div>
      </footer>
    </div>
  );
}
