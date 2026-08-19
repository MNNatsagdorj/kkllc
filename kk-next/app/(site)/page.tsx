// 홈 — Нүүр C 시안: 히어로(포대 비주얼) + 옐로 무료배송 밴드 + 카탈로그(DB) + 계산기 + 조회 티저
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/lib/types';
import { Sack } from '@/components/Sack';
import { Catalog } from './_components/Catalog';
import { BagCalculator } from './_components/BagCalculator';
import { Certificates, type CertItem } from './_components/Certificates';

export const dynamic = 'force-dynamic';

const wrap: React.CSSProperties = { maxWidth: 1240, margin: '0 auto', padding: '0 20px' };

interface CertRow {
  id: string; title_mn: string; type: 'certificate' | 'test_report';
  issued_by: string | null; issued_at: string | null; product_id: string | null;
  file_path: string; product: { name_mn: string } | null;
}

export default async function Home() {
  const supabase = await createClient();
  const [{ data }, certRes] = await Promise.all([
    supabase.from('products').select('*').eq('is_active', true).order('price_mnt', { ascending: false }),
    supabase.from('certificates')
      .select('id, title_mn, type, issued_by, issued_at, product_id, file_path, product:products(name_mn)')
      .eq('is_active', true).order('sort').order('created_at', { ascending: false }),
  ]);
  const products = (data ?? []) as Product[];

  // 0008 미적용 시 certRes.error — 섹션만 숨기고 홈은 정상 동작
  const certRows = (certRes.data ?? []) as unknown as CertRow[];
  const certBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/certificates/`;
  const certs: CertItem[] = certRows.map((c) => ({
    id: c.id, title_mn: c.title_mn, type: c.type,
    issued_by: c.issued_by, issued_at: c.issued_at,
    product_name: c.product?.name_mn ?? null,
    url: certBase + c.file_path,
    isImage: /\.(jpe?g|png|webp|gif)$/i.test(c.file_path),
  }));
  const certifiedIds = [...new Set(certRows.map((c) => c.product_id).filter(Boolean))] as string[];

  return (
    <div style={{ paddingBottom: 64 }}>
      {/* 히어로 — 좌 텍스트 / 우 포대 비주얼 (시안 46/54 그리드) */}
      <section style={{ background: '#EDEBE6' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', alignItems: 'stretch' }} className="md:grid-cols-[46%_54%]">
          <div className="hero-pad" style={{ padding: '54px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ maxWidth: 470 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.16em', color: '#626B76', marginBottom: 15 }}>
                ҮЙЛДВЭРЛЭГЧ · БӨӨНИЙ БОЛОН ЖИЖИГЛЭН
              </div>
              <h1 className="disp" style={{ fontSize: 'clamp(30px, 4.5vw, 46px)', lineHeight: 1.1, margin: '0 0 15px', textTransform: 'uppercase', color: 'var(--site-text)' }}>
                Үйлдвэрээс шууд, бөөний үнээр
              </h1>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: '#4A525C', margin: '0 0 24px' }}>
                Замаск·цавууг өөрсдөө үйлдвэрлэнэ. Дэлгүүр, хувь хүнд аль алинд нь нийлүүлнэ.
                <b style={{ color: 'var(--site-text)' }}> 100+ш захиалгад УБ хот дотор хүргэлт үнэгүй.</b>
              </p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
                <a href="#products" style={{ background: '#14181D', color: '#fff', fontWeight: 700, fontSize: 14.5, padding: '14px 25px' }}>
                  Захиалга өгөх
                </a>
                <a href="tel:88204057" style={{ border: '1.5px solid #14181D', color: '#14181D', fontWeight: 700, fontSize: 14, padding: '13px 22px' }}>
                  Бөөний үнэ авах
                </a>
              </div>
              <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
                {[['10+ жил', 'туршлага'], [`${products.length} нэр төрөл`, 'бүтээгдэхүүн']].map(([v, l]) => (
                  <div key={l}>
                    <div className="disp" style={{ fontSize: 22, color: 'var(--site-text)' }}>{v}</div>
                    <div style={{ fontSize: 12, color: '#626B76' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 비주얼: 잉크 배경 + 실제 제품 포대 라인업 (시안의 hero image slot 대체) */}
          <div className="hero-visual" style={{ position: 'relative', minHeight: 320, background: '#14181D', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6, padding: '30px 16px 0' }}>
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="sack-wrap" style={{ transform: 'scale(1.25)', transformOrigin: 'bottom', flex: 'none' }}>
                <Sack band={p.band_color} />
              </div>
            ))}
            <div className="disp hero-badge" style={{ position: 'absolute', top: 20, left: 0, background: 'var(--accent)', color: 'var(--accent-ink)', padding: '9px 17px', fontSize: 14 }}>
              2026 КАТАЛОГ
            </div>
          </div>
        </div>
      </section>

      {/* 카탈로그 (DB 연동) */}
      <section id="products" style={{ ...wrap, marginTop: 52 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 20, marginBottom: 22 }}>
          <h2 className="disp" style={{ fontSize: 'clamp(21px, 4vw, 28px)', textTransform: 'uppercase', color: 'var(--site-text)', margin: 0 }}>
            Эрэлттэй бүтээгдэхүүн
          </h2>
          <a href="tel:88204057" style={{ fontSize: 13.5, fontWeight: 700, borderBottom: '2px solid var(--accent)', paddingBottom: 2, color: 'var(--site-text)' }} className="site-hide-m">
            Бөөний үнэ асуух →
          </a>
        </div>
        <Catalog products={products} certifiedIds={certifiedIds} />
      </section>

      {/* 인증서·시험성적서 */}
      <Certificates certs={certs} />

      {/* 우트 계산기 */}
      <BagCalculator />

      {/* 주문조회 티저 */}
      <section style={{ ...wrap, marginTop: 52 }}>
        <div style={{ background: '#fff', border: '1px solid var(--site-line)', padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div>
            <div className="disp" style={{ fontSize: 18, color: 'var(--site-text)', textTransform: 'uppercase' }}>Захиалгаа шалгах</div>
            <div style={{ fontSize: 13, color: '#5E6C80', marginTop: 4 }}>
              Бүртгүүлэх шаардлагагүй — захиалга өгсөн утасны дугаараа оруулаад явцаа хараарай.
            </div>
          </div>
          <Link href="/track" style={{ padding: '12px 22px', background: 'var(--accent)', color: 'var(--accent-ink)', fontWeight: 700, fontSize: 13.5 }}>
            Шалгах →
          </Link>
        </div>
      </section>
    </div>
  );
}
