'use client';

// 제품 카탈로그 — 포대 SVG + 수량 스테퍼 + Сагслах (04 문서 §4)
import { useState } from 'react';
import { Sack } from '@/components/Sack';
import { addToCart } from '@/lib/cart';
import { fmtMNT, type Product } from '@/lib/types';

export function Catalog({ products }: { products: Product[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
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
    width: 30, height: 30, borderRadius: 7, border: '1px solid var(--site-line)',
    background: '#fff', color: 'var(--site-text)', fontSize: 15, fontWeight: 800, cursor: 'pointer',
  };

  return (
    <div style={{ background: '#FBFAF5', border: '1px solid var(--site-line)', borderRadius: 14, padding: '16px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative' }}>
        <Sack band={p.band_color} />
        <span className="mono" style={{ position: 'absolute', top: 2, right: -12, background: 'var(--ink)', color: '#EFECE3', fontSize: 9.5, fontWeight: 700, borderRadius: 999, padding: '2px 7px' }}>
          {p.weight_kg}кг
        </span>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: 14.5, color: 'var(--site-text)' }}>{p.name_mn}</div>
        <div style={{ fontSize: 11.5, color: '#8A8062', marginTop: 3, minHeight: 16 }}>{p.use_mn}</div>
        <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: 'var(--site-text)', marginTop: 6 }}>{fmtMNT(p.price_mnt)}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button style={stepBtn} onClick={() => step(-1)}>−</button>
        <input className="mono" value={qty} inputMode="numeric"
          onChange={(e) => setQty(Math.max(1, Number(e.target.value.replace(/\D/g, '')) || 1))}
          style={{ width: 52, height: 30, textAlign: 'center', border: '1px solid var(--site-line)', borderRadius: 7, fontSize: 14, fontWeight: 700, background: '#fff' }} />
        <button style={stepBtn} onClick={() => step(1)}>+</button>
      </div>
      <button onClick={add}
        style={{ width: '100%', padding: '9px 0', borderRadius: 9, border: 0, fontSize: 13, fontWeight: 800, cursor: 'pointer', background: added ? 'var(--st-done)' : 'var(--ink)', color: '#EFECE3', transition: 'background .15s' }}>
        {added ? '✓ Нэмэгдлээ' : 'Сагслах'}
      </button>
    </div>
  );
}
