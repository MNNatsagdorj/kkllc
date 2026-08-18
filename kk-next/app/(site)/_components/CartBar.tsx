'use client';

// 하단 고정 장바구니 바 — 요약 + 100ш 미터 (04 문서 §5)
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { calcDelivery } from '@/lib/delivery';
import { Meter } from '@/components/Meter';
import { fmtMNT, type Product } from '@/lib/types';

export function CartBar({ products }: { products: Product[] }) {
  const cart = useCart();
  const rows = cart
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.product_id) }))
    .filter((r) => r.product);
  if (!rows.length) return null;

  const totalQty = rows.reduce((s, r) => s + r.qty, 0);
  const subtotal = rows.reduce((s, r) => s + r.product!.price_mnt * r.qty, 0);
  const delivery = calcDelivery(rows.map((r) => ({ qty: r.qty })));
  const summary = rows.map((r) => `${r.product!.name_mn} ×${r.qty}`).join(' · ');

  return (
    <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40, background: '#FFFDF8', borderTop: '1px solid var(--site-line)', boxShadow: '0 -8px 30px rgba(20,38,62,.10)', padding: '12px 20px' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: 12.5, color: '#8A8062', fontWeight: 700 }}>Таны сагс</div>
          <div style={{ fontSize: 13, color: 'var(--site-text)', fontWeight: 600, margin: '2px 0 7px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {summary} = {totalQty}ш
          </div>
          <Meter calc={delivery} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="mono" style={{ fontSize: 19, fontWeight: 700, color: 'var(--site-text)' }}>
            {fmtMNT(subtotal + delivery.fee)}
          </div>
          <Link href="/cart"
            style={{ display: 'inline-block', marginTop: 6, padding: '10px 22px', borderRadius: 9, background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, fontSize: 13.5 }}>
            Захиалах →
          </Link>
        </div>
      </div>
    </div>
  );
}
