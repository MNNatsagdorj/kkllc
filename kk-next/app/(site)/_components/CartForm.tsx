'use client';

// 장바구니 상세 + 100ш 미터 + 주문 폼 → 성공 시 주문번호 + track 링크 (04 문서)
import { useState } from 'react';
import Link from 'next/link';
import { useCart, setCartQty, clearCart } from '@/lib/cart';
import { calcDelivery } from '@/lib/delivery';
import { Meter } from '@/components/Meter';
import { UB_DISTRICTS, fmtMNT, type Product } from '@/lib/types';

const input: React.CSSProperties = {
  width: '100%', padding: '11px 13px', borderRadius: 9, fontSize: 14,
  background: '#fff', border: '1px solid var(--site-line)', color: 'var(--site-text)',
};
const label: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 700, color: '#8A8062', marginBottom: 5 };

export function CartForm({ products }: { products: Product[] }) {
  const cart = useCart();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: number; phone: string } | null>(null);

  const rows = cart
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.product_id) }))
    .filter((r) => r.product);
  const subtotal = rows.reduce((s, r) => s + r.product!.price_mnt * r.qty, 0);
  const delivery = calcDelivery(rows.map((r) => ({ qty: r.qty })));

  if (done) {
    return (
      <div style={{ background: '#FBFAF5', border: '1px solid var(--site-line)', borderRadius: 16, padding: '34px 26px', textAlign: 'center' }}>
        <div style={{ fontSize: 40 }}>✅</div>
        <h2 className="disp" style={{ fontSize: 20, color: 'var(--site-text)', margin: '10px 0 6px' }}>
          Захиалга <span className="mono" style={{ color: 'var(--kraft-deep)' }}>#{done.id}</span> хүлээн авлаа
        </h2>
        <p style={{ fontSize: 13.5, color: '#5E6C80', lineHeight: 1.6 }}>
          Манай менежер удахгүй холбогдоно. Явцыг утасны дугаараар шалгаж болно.
        </p>
        <Link href={`/track?phone=${encodeURIComponent(done.phone)}`}
          style={{ display: 'inline-block', marginTop: 16, padding: '11px 22px', borderRadius: 9, background: 'var(--ink)', color: '#EFECE3', fontWeight: 800, fontSize: 13.5 }}>
          Захиалга шалгах →
        </Link>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0', color: '#8A8062' }}>
        Сагс хоосон байна. <Link href="/#products" style={{ color: 'var(--kraft-deep)', fontWeight: 700 }}>Бүтээгдэхүүн үзэх →</Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null); setBusy(true);
    const f = new FormData(e.currentTarget);
    const phone = String(f.get('phone')).trim();
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { name: String(f.get('name')).trim(), phone },
        district: String(f.get('district') || '') || undefined,
        address: String(f.get('address')).trim(),
        items: rows.map((r) => ({ product_id: r.product_id, qty: r.qty })),
        note: String(f.get('note') || '').trim() || undefined,
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) { setErr(json.error ?? 'Алдаа гарлаа — дахин оролдоно уу'); return; }
    clearCart();
    setDone({ id: json.id, phone });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 품목 목록 */}
      <div style={{ background: '#FBFAF5', border: '1px solid var(--site-line)', borderRadius: 14, overflow: 'hidden' }}>
        {rows.map((r, i) => (
          <div key={r.product_id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < rows.length - 1 ? '1px solid #EEE9DB' : 'none' }}>
            <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: 'var(--site-text)' }}>{r.product!.name_mn}</span>
            <input className="mono" inputMode="numeric" value={r.qty}
              onChange={(e) => setCartQty(r.product_id, Math.max(0, Number(e.target.value.replace(/\D/g, '')) || 0))}
              style={{ width: 62, height: 32, textAlign: 'center', border: '1px solid var(--site-line)', borderRadius: 7, fontSize: 14, fontWeight: 700, background: '#fff' }} />
            <span className="mono" style={{ width: 100, textAlign: 'right', fontSize: 13.5, fontWeight: 700, color: 'var(--site-text)' }}>
              {fmtMNT(r.product!.price_mnt * r.qty)}
            </span>
            <button onClick={() => setCartQty(r.product_id, 0)}
              style={{ background: 'none', border: 0, color: '#B9AF93', cursor: 'pointer', fontSize: 15 }}>✕</button>
          </div>
        ))}
      </div>

      {/* 합계 + 미터 */}
      <div style={{ background: '#FBFAF5', border: '1px solid var(--site-line)', borderRadius: 14, padding: '15px 16px', display: 'flex', flexDirection: 'column', gap: 11 }}>
        <Meter calc={delivery} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#5E6C80' }}>
          <span>Барааны дүн</span><span className="mono">{fmtMNT(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#5E6C80' }}>
          <span>Хүргэлт</span>
          <span className="mono" style={{ color: delivery.isFree ? 'var(--st-done)' : undefined, fontWeight: 700 }}>
            {delivery.isFree ? 'ҮНЭГҮЙ' : fmtMNT(delivery.fee)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #EEE9DB', paddingTop: 10, alignItems: 'baseline' }}>
          <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--site-text)' }}>Нийт дүн</span>
          <span className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--site-text)' }}>{fmtMNT(subtotal + delivery.fee)}</span>
        </div>
      </div>

      {/* 주문 폼 */}
      <form onSubmit={submit} style={{ background: '#FBFAF5', border: '1px solid var(--site-line)', borderRadius: 14, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div><span style={label}>Нэр</span><input name="name" required style={input} placeholder="Болд" /></div>
          <div><span style={label}>Утас</span><input name="phone" required className="mono" style={input} placeholder="9911-2233" inputMode="tel" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 10 }}>
          <div>
            <span style={label}>Дүүрэг</span>
            <select name="district" style={input}>
              <option value="">—</option>
              {UB_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div><span style={label}>Хаяг</span><input name="address" required style={input} placeholder="Хороо, гудамж, байр…" /></div>
        </div>
        <div><span style={label}>Нэмэлт тэмдэглэл</span><input name="note" style={input} /></div>
        {err && <div style={{ color: 'var(--st-cancel)', fontSize: 13, fontWeight: 700 }}>{err}</div>}
        <button type="submit" disabled={busy}
          style={{ padding: '14px 0', borderRadius: 10, border: 0, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, fontSize: 15, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
          {busy ? 'Илгээж байна…' : 'Захиалга илгээх'}
        </button>
      </form>
    </div>
  );
}
