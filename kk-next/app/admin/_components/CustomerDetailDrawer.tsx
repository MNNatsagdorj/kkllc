'use client';

// 고객 상세 드로어 — 구 관리자(kk-admin-web) 상세 모달 이식 + Зээл(외상) 상환 통합.
// 연락처 · 핀 지도 · 메모 · 총 구매액 · 최근 주문 목록.
import dynamic from 'next/dynamic';
import { StatusChip } from '@/components/StatusChip';
import { fmtMNT, fmtOrderNo, type OrderStatus } from '@/lib/types';

const PinMap = dynamic(() => import('@/components/PinMap').then((m) => m.PinMap), { ssr: false });

export interface CustomerRow {
  id: string; name: string; phone: string; type: 'individual' | 'shop';
  district: string | null; address: string | null; email: string | null;
  tier: 'new' | 'reg' | 'vip'; lat: number | null; lng: number | null;
  note: string | null; credit_balance: number;
}
export interface MiniOrder {
  id: number; customer_id: string; status: OrderStatus; created_at: string;
  subtotal_mnt: number; delivery_fee_mnt: number; payment_method: string | null;
}

export const TIER_MN: Record<CustomerRow['tier'], { label: string; color: string }> = {
  vip: { label: 'VIP', color: '#E3A63B' },
  reg: { label: 'Тогтмол', color: '#8A94A6' },
  new: { label: 'Шинэ', color: '#4CAF7D' },
};

export function TierChip({ tier }: { tier: CustomerRow['tier'] | null }) {
  const t = TIER_MN[tier ?? 'new'] ?? TIER_MN.new;
  return (
    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.03em', color: t.color, border: `1px solid color-mix(in srgb, ${t.color} 45%, transparent)`, background: `color-mix(in srgb, ${t.color} 14%, transparent)`, borderRadius: 999, padding: '2px 8px' }}>
      {t.label}
    </span>
  );
}

const section: React.CSSProperties = {
  background: 'var(--ink)', border: '1px solid var(--line)', borderRadius: 11, padding: '13px 15px',
};
const heading: React.CSSProperties = {
  fontSize: 10.5, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase',
  color: 'var(--mut)', marginBottom: 9,
};

export function CustomerDetailDrawer({ customer, orders, onClose, onEdit, onRepay }: {
  customer: CustomerRow;
  orders: MiniOrder[];
  onClose: () => void;
  onEdit: () => void;
  onRepay: () => void;
}) {
  const delivered = orders.filter((o) => o.status === 'delivered');
  const totalSpent = delivered.reduce((s, o) => s + o.subtotal_mnt + o.delivery_fee_mnt, 0);
  const phoneDigits = customer.phone.replace(/\D/g, '');

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(4,10,20,.55)' }} />
      <aside style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 440, maxWidth: '94vw', background: 'var(--ink2)', borderLeft: '1px solid var(--line)', padding: 20, overflowY: 'auto', color: '#EFECE3', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* 헤더 — 이니셜 아바타 + 이름 + 태그 + 수정 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--ink3)', color: 'var(--kraft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, flexShrink: 0 }}>
            {customer.name.charAt(0)}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{customer.name}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 5, alignItems: 'center' }}>
              <TierChip tier={customer.tier} />
              <span style={{ fontSize: 11, color: 'var(--mut)' }}>{customer.type === 'shop' ? 'Дэлгүүр' : 'Хувь хүн'}</span>
            </div>
          </div>
          <button onClick={onEdit} title="Засах"
            style={{ fontSize: 12, fontWeight: 700, color: 'var(--kraft)', background: 'none', border: '1px dashed color-mix(in srgb, var(--kraft) 45%, transparent)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
            ✎ Засах
          </button>
          <button onClick={onClose} style={{ background: 'none', border: 0, color: 'var(--mut)', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>

        {/* 총 구매액 + Зээл */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={section}>
            <div style={heading}>Нийт худалдан авалт</div>
            <div className="mono" style={{ fontSize: 17, fontWeight: 700 }}>{fmtMNT(totalSpent)}</div>
            <div className="mono" style={{ fontSize: 11.5, color: 'var(--mut)', marginTop: 2 }}>{orders.length} захиалга</div>
          </div>
          <div style={section}>
            <div style={heading}>Зээл үлдэгдэл</div>
            <div className="mono" style={{ fontSize: 17, fontWeight: 700, color: customer.credit_balance > 0 ? 'var(--st-asg)' : 'var(--mut)' }}>
              {fmtMNT(customer.credit_balance)}
            </div>
            {customer.credit_balance > 0 && (
              <button onClick={onRepay}
                style={{ marginTop: 6, fontSize: 11.5, fontWeight: 700, color: 'var(--st-done)', background: 'none', border: '1px solid var(--line)', borderRadius: 7, padding: '4px 10px', cursor: 'pointer' }}>
                Төлөлт бүртгэх
              </button>
            )}
          </div>
        </div>

        {/* 연락처 */}
        <div style={section}>
          <div style={heading}>Холбоо барих</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 13.5 }}>
            <a href={`tel:${phoneDigits}`} className="mono" style={{ color: '#5CA8FF', fontWeight: 700 }}>☎ {customer.phone}</a>
            {customer.email && <a href={`mailto:${customer.email}`} style={{ color: '#EFECE3' }}>✉ {customer.email}</a>}
            {(customer.district || customer.address) && (
              <span style={{ lineHeight: 1.5 }}>
                📍 {customer.district && <b style={{ color: '#5CA8FF' }}>{customer.district} · </b>}
                {customer.address}
              </span>
            )}
          </div>
          {customer.lat != null && customer.lng != null && (
            <div style={{ marginTop: 10 }}>
              <PinMap lat={customer.lat} lng={customer.lng} height={165} expandable />
            </div>
          )}
        </div>

        {/* 메모 */}
        {customer.note && (
          <div style={{ padding: '11px 14px', background: 'color-mix(in srgb, var(--kraft) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--kraft) 35%, transparent)', borderRadius: 10, fontSize: 13, color: 'var(--kraft)', lineHeight: 1.5 }}>
            {customer.note}
          </div>
        )}

        {/* 최근 주문 */}
        <div style={section}>
          <div style={heading}>Сүүлийн захиалгууд</div>
          {orders.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--mut)' }}>Захиалга байхгүй.</div>
          ) : orders.slice(0, 10).map((o) => (
            <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--line)', fontSize: 12.5 }}>
              <span className="mono" style={{ color: 'var(--kraft)', fontWeight: 700, width: 54 }}>{fmtOrderNo(o.id)}</span>
              <span className="mono" style={{ color: 'var(--mut)', width: 76 }}>{o.created_at.slice(0, 10)}</span>
              <span className="mono" style={{ flex: 1, textAlign: 'right', fontWeight: 700 }}>{fmtMNT(o.subtotal_mnt + o.delivery_fee_mnt)}</span>
              <StatusChip status={o.status} />
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
