'use client';

// 제품 카탈로그 — 포대 SVG + 수량 스테퍼 + Сагслах (04 문서 §4)
import { useState } from 'react';
import { Sack } from '@/components/Sack';
import { addToCart } from '@/lib/cart';
import { fmtMNT, type Product } from '@/lib/types';

export function Catalog({ products }: { products: Product[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
      {products.map((p) => <Card key={p.id} p={p} />)}
    </div>
  );
}

function Card({ p }: { p: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const add = () => {
    addToCart(p.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1300);
  };

  const step = (d: number) => setQty((q) => Math.max(1, q + d));
  const stepBtn: React.CSSProperties = {
    width: 30, height: 30, border: '1px solid var(--site-line)',
    background: '#fff', color: 'var(--site-text)', fontSize: 15, fontWeight: 800, cursor: 'pointer',
  };

  // Нүүр C 시안 카드: 직각 화이트, 상단 포대 비주얼(#EDEBE6), Oswald 제목, 옐로 액션
  return (
    <div style={{ background: '#fff', border: '1px solid var(--site-line)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', background: '#EDEBE6', display: 'flex', justifyContent: 'center', padding: '18px 0 12px' }}>
        <Sack band={p.band_color} />
        <span className="mono" style={{ position: 'absolute', top: 10, right: 10, border: '1px solid rgba(20,24,29,.2)', color: '#626B76', fontSize: 10, fontWeight: 700, letterSpacing: '.06em', padding: '3px 7px' }}>
          {p.weight_kg} КГ
        </span>
      </div>
      <div style={{ padding: '15px 15px 16px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <div className="disp" style={{ fontSize: 18, color: 'var(--site-text)' }}>{p.name_mn}</div>
        <div style={{ fontSize: 12, color: '#626B76', minHeight: 16 }}>{p.use_mn}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 10, borderTop: '1px solid rgba(20,24,29,.08)', paddingTop: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: '#9AA0A6' }}>Нэгж үнэ</div>
            <div className="mono" style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--site-text)' }}>{fmtMNT(p.price_mnt)}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button style={stepBtn} onClick={() => step(-1)}>−</button>
            <input className="mono" value={qty} inputMode="numeric"
              onChange={(e) => setQty(Math.max(1, Number(e.target.value.replace(/\D/g, '')) || 1))}
              style={{ width: 46, height: 30, textAlign: 'center', border: '1px solid var(--site-line)', fontSize: 14, fontWeight: 700, background: '#fff' }} />
            <button style={stepBtn} onClick={() => step(1)}>+</button>
          </div>
        </div>
        <button onClick={add}
          style={{ width: '100%', marginTop: 10, padding: '11px 0', border: 0, fontSize: 13, fontWeight: 700, cursor: 'pointer', background: added ? 'var(--st-done)' : 'var(--accent)', color: added ? '#fff' : 'var(--accent-ink)', transition: 'background .15s' }}>
          {added ? '✓ Нэмэгдлээ' : 'Сагслах'}
        </button>
      </div>
    </div>
  );
}
