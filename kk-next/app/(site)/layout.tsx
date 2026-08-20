// 공개 사이트 셸 — Нүүр C 시안: 잉크 블랙 헤더(+장바구니 드로어) + 옐로 액센트 + 다크 푸터 + 채팅 플로팅
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/lib/types';
import { CartWidget } from './_components/CartWidget';

const navLink: React.CSSProperties = { color: 'rgba(255,255,255,.72)', fontSize: 13.5, fontWeight: 600 };

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // 장바구니 드로어용 제품 목록 (이름·가격) — 모든 사이트 페이지에서 접근 가능
  const supabase = await createClient();
  const { data } = await supabase.from('products').select('*').eq('is_active', true);
  const products = (data ?? []) as Product[];

  return (
    <div className="site-c" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--site-bg)' }}>
      <header style={{ background: '#14181D', position: 'sticky', top: 0, zIndex: 45 }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '11px 20px', display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', flex: 'none' }}>
            <span style={{ width: 34, height: 34, background: 'var(--accent)', color: 'var(--accent-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif', fontSize: 18, fontWeight: 700 }}>志</span>
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
              <span className="disp" style={{ fontSize: 15, letterSpacing: '.05em' }}>KOKOROZASHI KIBOU</span>
              <span className="site-brand-sub" style={{ fontSize: 8, letterSpacing: '.2em', color: 'rgba(255,255,255,.5)', fontWeight: 600 }}>ХУУРАЙ ЗУУРМАГИЙН ҮЙЛДВЭР</span>
            </span>
          </Link>
          <div style={{ display: 'flex', gap: 18, marginLeft: 10 }} className="site-nav-desktop">
            <Link href="/#products" style={navLink}>Бүтээгдэхүүн</Link>
            <Link href="/#certificates" style={navLink}>Гэрчилгээ</Link>
            <Link href="/track" style={navLink}>Захиалга шалгах</Link>
            <Link href="/#about" style={navLink}>Бидний тухай</Link>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="tel:88204057" className="mono site-phone-top"
              style={{ color: 'rgba(255,255,255,.75)', fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap' }}>
              ☎ 8820-4057
            </a>
            <CartWidget products={products} />
            <a href="tel:88204057" className="site-cta-quote"
              style={{ background: 'var(--accent)', color: 'var(--accent-ink)', fontWeight: 700, fontSize: 13, padding: '10px 17px', whiteSpace: 'nowrap' }}>
              Үнийн санал авах
            </a>
          </div>
        </div>
        {/* 모바일 전용 내비 (데스크톱 링크가 숨는 ≤640px에서만 표시) */}
        <nav className="site-nav-mobile">
          <Link href="/#products">Бүтээгдэхүүн</Link>
          <Link href="/#certificates">Гэрчилгээ</Link>
          <Link href="/track">Захиалга шалгах</Link>
          <Link href="/#about">Бидний тухай</Link>
          <a href="tel:88204057" className="mono">☎ 8820-4057</a>
        </nav>
      </header>

      <div style={{ flex: 1 }}>{children}</div>

      <footer id="about" style={{ background: '#14181D', color: 'rgba(255,255,255,.6)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '30px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px 24px', flexWrap: 'wrap', fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 24, height: 24, background: 'var(--accent)', color: 'var(--accent-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif', fontSize: 13, fontWeight: 700 }}>志</span>
            <span className="disp" style={{ fontSize: 13, color: '#fff', letterSpacing: '.05em' }}>KOKOROZASHI KIBOU</span>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/#products" style={{ color: 'rgba(255,255,255,.6)' }}>Бүтээгдэхүүн</Link>
            <Link href="/#certificates" style={{ color: 'rgba(255,255,255,.6)' }}>Гэрчилгээ</Link>
            <Link href="/track" style={{ color: 'rgba(255,255,255,.6)' }}>Захиалга шалгах</Link>
          </div>
          <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, lineHeight: 1.7 }} className="mono">
            © 2026 Kokorozashi Kibou ХХК · ☎ 8820-4057
            <br />
            Үйлдвэр:{' '}
            <a href="https://maps.app.goo.gl/j1h1R2w9vvPg5eyWA" target="_blank" rel="noopener noreferrer"
              style={{ color: 'rgba(255,255,255,.55)', textDecoration: 'underline' }}>
              СХД, 27-р хороо, 21-р хороолол, Тээвэрчдийн 12, 12 тоот, Улаанбаатар 18080 ↗
            </a>
          </div>
        </div>
      </footer>

      {/* 채팅 플로팅 — WhatsApp / WeChat */}
      <div className="chat-float" style={{ position: 'fixed', right: 20, bottom: 22, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 44 }}>
        <a href="weixin://" title="WeChat"
          style={{ width: 50, height: 50, borderRadius: '50%', background: '#07C160', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 22px rgba(0,0,0,.25)' }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="#fff"><path d="M9.5 4C5.9 4 3 6.4 3 9.4c0 1.7 1 3.2 2.4 4.2l-.6 2 2.2-1.1c.5.1 1 .2 1.6.2.2 0 .4 0 .6-.1-.1-.4-.2-.9-.2-1.3 0-2.8 2.7-5 6-5h.5C14.9 5.9 12.4 4 9.5 4zm5.5 6c-2.9 0-5.2 1.9-5.2 4.2s2.3 4.2 5.2 4.2c.5 0 1-.1 1.4-.2l1.9 1-.5-1.7c1.2-.8 2.2-2 2.2-3.3 0-2.3-2.3-4.2-5-4.2z" /></svg>
        </a>
        <a href="https://wa.me/97688204057" target="_blank" rel="noopener noreferrer" title="WhatsApp"
          style={{ width: 50, height: 50, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 22px rgba(0,0,0,.25)' }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="#fff"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3zm4.3 12.6c-.2.6-1.2 1.1-1.7 1.1-.4 0-1 .2-3.3-.8-2.8-1.2-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.3 1.1 2.3 1.4 2.6 1.6.3.1.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l1.8.9c.3.1.5.2.5.3.1.1.1.7-.3 1.2z" /></svg>
        </a>
      </div>
    </div>
  );
}
