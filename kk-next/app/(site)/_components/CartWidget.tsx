'use client';

// 헤더 장바구니 — 버튼(수량 배지) + 우측 슬라이드 드로어.
// 기존 하단 고정 CartBar를 대체: 콘텐츠를 가리지 않고 어느 페이지서든 접근.
import { useState } from 'react';
import Link from 'next/link';
import { useCart, setCartQty } from '@/lib/cart';
import { calcDelivery } from '@/lib/delivery';
import { Meter } from '@/components/Meter';
import { fmtMNT, type Product } from '@/lib/types';

export function CartWidget({ products }: { products: Product[] }) {
  const cart = useCart();
  const [open, setOpen] = useState(false);

  const rows = cart
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.product_id) }))
    .filter((r) => r.product);
  const totalQty = rows.reduce((s, r) => s + r.qty, 0);
  const subtotal = rows.reduce((s, r) => s + r.product!.price_mnt * r.qty, 0);
  const delivery = calcDelivery(rows.map((r) => ({ qty: r.qty })));

  return (
    <>
      {/* 헤더 버튼 — 항상 보임 (스티키 헤더) */}
      <button onClick={() => setOpen(true)} title="Сагс"
        style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'rgba(255,255,255,.09)', border: 0, cursor: 'pointer', flex: 'none' }}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#EFECE3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1.6" /><circle cx="19" cy="21" r="1.6" />
          <path d="M2 3h3l2.6 12.6a1.8 1.8 0 0 0 1.8 1.4h9.3a1.8 1.8 0 0 0 1.8-1.4L22.5 7H6" />
        </svg>
        {totalQty > 0 && (
          <span className="mono" style={{ position: 'absolute', top: -6, right: -7, minWidth: 19, height: 19, borderRadius: 999, background: 'var(--accent)', color: 'var(--accent-ink)', fontSize: 10.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
            {totalQty > 999 ? '999+' : totalQty}
          </span>
        )}
      </button>

      {/* 슬라이드 드로어 */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 80 }}>
          <div onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15,18,22,.55)' }} />
          <aside style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 390, maxWidth: '94vw', background: '#F6F5F2', display: 'flex', flexDirection: 'column', boxShadow: '-14px 0 40px rgba(0,0,0,.25)' }}>
            <div style={{ background: '#14181D', color: '#fff', padding: '15px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="disp" style={{ fontSize: 16, letterSpacing: '.04em' }}>ТАНЫ САГС</span>
              {totalQty > 0 && <span className="mono" style={{ fontSize: 12.5, color: 'rgba(255,255,255,.65)' }}>{totalQty}ш</span>}
              <button onClick={() => setOpen(false)}
                style={{ marginLeft: 'auto', background: 'none', border: 0, color: 'rgba(255,255,255,.7)', fontSize: 19, cursor: 'pointer' }}>✕</button>
            </div>

            {rows.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#8A8062', fontSize: 14 }}>
                <span style={{ fontSize: 34 }}>🛒</span>
                Сагс хоосон байна
                <button onClick={() => setOpen(false)}
                  style={{ marginTop: 6, background: '#14181D', color: '#fff', border: 0, fontWeight: 700, fontSize: 13, padding: '11px 20px', cursor: 'pointer' }}>
                  Бүтээгдэхүүн үзэх
                </button>
              </div>
            ) : (
              <>
                {/* 품목 리스트 */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {rows.map((r) => (
                    <div key={r.product_id} style={{ background: '#fff', border: '1px solid var(--site-line)', padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--site-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.product!.name_mn}
                        </div>
                        <div className="mono" style={{ fontSize: 11.5, color: '#8A8062', marginTop: 2 }}>
                          {fmtMNT(r.product!.price_mnt)} × {r.qty}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <button onClick={() => setCartQty(r.product_id, Math.max(0, r.qty - 1))}
                          style={{ width: 26, height: 26, border: '1px solid var(--site-line)', background: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', color: 'var(--site-text)' }}>−</button>
                        <span className="mono" style={{ width: 34, textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'var(--site-text)' }}>{r.qty}</span>
                        <button onClick={() => setCartQty(r.product_id, r.qty + 1)}
                          style={{ width: 26, height: 26, border: '1px solid var(--site-line)', background: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', color: 'var(--site-text)' }}>+</button>
                      </div>
                      <span className="mono" style={{ width: 86, textAlign: 'right', fontSize: 13, fontWeight: 700, color: 'var(--site-text)' }}>
                        {fmtMNT(r.product!.price_mnt * r.qty)}
                      </span>
                      <button onClick={() => setCartQty(r.product_id, 0)} title="Хасах"
                        style={{ background: 'none', border: 0, color: '#B9AF93', cursor: 'pointer', fontSize: 15 }}>✕</button>
                    </div>
                  ))}
                </div>

                {/* 합계 + 체크아웃 */}
                <div style={{ borderTop: '1px solid var(--site-line)', background: '#fff', padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Meter calc={delivery} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#5E6C80' }}>
                    <span>Барааны дүн</span><span className="mono">{fmtMNT(subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#5E6C80' }}>
                    <span>Хүргэлт</span>
                    <span className="mono" style={{ color: delivery.isFree ? 'var(--st-done)' : undefined, fontWeight: 700 }}>
                      {delivery.isFree ? 'ҮНЭГҮЙ' : fmtMNT(delivery.fee)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--site-line)', paddingTop: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--site-text)' }}>Нийт дүн</span>
                    <span className="mono" style={{ fontSize: 19, fontWeight: 700, color: 'var(--site-text)' }}>{fmtMNT(subtotal + delivery.fee)}</span>
                  </div>
                  <Link href="/cart" onClick={() => setOpen(false)}
                    style={{ textAlign: 'center', background: 'var(--accent)', color: 'var(--accent-ink)', fontWeight: 800, fontSize: 14.5, padding: '14px 0' }}>
                    Захиалах →
                  </Link>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
