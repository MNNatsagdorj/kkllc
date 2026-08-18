// 홈 — 히어로 + 무료배송 배너 + 카탈로그(DB) + 장바구니 바 + 주문조회 티저 (04 문서)
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/lib/types';
import { Catalog } from './_components/Catalog';
import { CartBar } from './_components/CartBar';

export const dynamic = 'force-dynamic';

const wrap: React.CSSProperties = { maxWidth: 1060, margin: '0 auto', padding: '0 20px' };

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.from('products')
    .select('*').eq('is_active', true).order('price_mnt', { ascending: false });
  const products = (data ?? []) as Product[];

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* 히어로 */}
      <section style={{ background: 'linear-gradient(180deg, #FBFAF5, var(--site-bg))', padding: '54px 0 40px' }}>
        <div style={wrap}>
          <h1 className="disp" style={{ fontSize: 'clamp(26px, 4.5vw, 42px)', lineHeight: 1.2, color: 'var(--site-text)', maxWidth: 640 }}>
            Үйлдвэрээс шууд.<br />Таны барилгад — <span style={{ color: 'var(--kraft-deep)' }}>өдөртөө.</span>
          </h1>
          <p style={{ fontSize: 15, color: '#5E6C80', maxWidth: 560, margin: '14px 0 20px', lineHeight: 1.65 }}>
            Замаск·цавууг өөрсдөө үйлдвэрлэнэ. Дэлгүүр, хувь хүнд аль алинд нь нийлүүлнэ.
            <b style={{ color: 'var(--site-text)' }}> 100+ш захиалгад УБ хот дотор хүргэлт үнэгүй.</b>
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 26 }}>
            <a href="#products" style={{ padding: '12px 22px', borderRadius: 9, background: 'var(--ink)', color: '#EFECE3', fontWeight: 800, fontSize: 14 }}>Захиалга өгөх</a>
            <a href="tel:70112233" style={{ padding: '12px 22px', borderRadius: 9, border: '1.5px solid var(--ink)', color: 'var(--ink)', fontWeight: 800, fontSize: 14 }}>Дэлгүүрт бөөний үнэ авах</a>
          </div>
          <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap' }}>
            {[['10+ жил', 'туршлага'], ['5 нэр төрөл', 'бүтээгдэхүүн'], ['24 цаг', 'дотор хүргэлт']].map(([v, l]) => (
              <div key={l}>
                <div className="disp" style={{ fontSize: 19, color: 'var(--site-text)' }}>{v}</div>
                <div style={{ fontSize: 12, color: '#8A8062' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 무료배송 배너 */}
      <section id="delivery" style={wrap}>
        <div style={{ background: 'var(--ink)', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div>
            <div className="disp" style={{ color: 'var(--kraft)', fontSize: 19 }}>100+ ширхэгт хүргэлт үнэгүй</div>
            <div style={{ color: 'var(--mut)', fontSize: 12.5, marginTop: 5 }}>
              УБ хотын бүх дүүрэгт · Өөрийн ачааны машинаар · Ажлын өдөр 09:00–19:00
            </div>
          </div>
          <span className="mono" style={{ background: 'var(--ink3)', border: '1px solid var(--line)', color: '#EFECE3', borderRadius: 999, padding: '8px 16px', fontSize: 12.5, fontWeight: 700 }}>
            100ш-ээс доош → хүргэлт 30,000₮
          </span>
        </div>
      </section>

      {/* 카탈로그 */}
      <section id="products" style={{ ...wrap, marginTop: 38 }}>
        <h2 className="disp" style={{ fontSize: 22, color: 'var(--site-text)', marginBottom: 16 }}>Бүтээгдэхүүн</h2>
        <Catalog products={products} />
      </section>

      {/* 주문조회 티저 */}
      <section style={{ ...wrap, marginTop: 44 }}>
        <div style={{ background: '#FBFAF5', border: '1px solid var(--site-line)', borderRadius: 16, padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15.5, color: 'var(--site-text)' }}>Захиалгаа шалгах</div>
            <div style={{ fontSize: 13, color: '#5E6C80', marginTop: 4 }}>
              Бүртгүүлэх шаардлагагүй — захиалга өгсөн утасны дугаараа оруулаад явцаа хараарай.
            </div>
          </div>
          <Link href="/track" style={{ padding: '11px 20px', borderRadius: 9, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, fontSize: 13.5 }}>
            Шалгах →
          </Link>
        </div>
      </section>

      <CartBar products={products} />
    </div>
  );
}
