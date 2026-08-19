'use client';

// 주문 카드 (05 문서 필드 그대로)
import { StatusChip } from '@/components/StatusChip';
import { itemsSummary, fmtWeight, type OrderRow } from '@/lib/queries';
import { fmtMNT, fmtOrderNo } from '@/lib/types';

const PAY_MN: Record<string, string> = { cash: 'Бэлэн', transfer: 'Данс', credit: 'Зээл' };

function MiniChip({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '.03em', color, border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`, background: `color-mix(in srgb, ${color} 14%, transparent)`, borderRadius: 999, padding: '1px 7px' }}>
      {children}
    </span>
  );
}

export function OrderCard({ order, onAssign }: { order: OrderRow; onAssign: () => void }) {
  const time = order.created_at ? new Date(order.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';
  return (
    <div style={{ background: 'var(--ink2)', border: '1px solid var(--line)', borderRadius: 11, padding: '11px 13px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
        <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--kraft)' }}>
          {fmtOrderNo(order.id)}
          <span style={{ color: 'var(--mut)', fontWeight: 400, marginLeft: 7, fontSize: 11 }}>{time}</span>
        </span>
        <StatusChip status={order.status} />
      </div>

      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#EFECE3' }}>
        {order.customer?.name ?? '—'}
        {order.customer?.phone && (
          <span className="mono" style={{ fontSize: 11.5, fontWeight: 400, color: 'var(--mut)', marginLeft: 8 }}>{order.customer.phone}</span>
        )}
      </div>

      <div style={{ fontSize: 12, color: 'var(--mut)', margin: '5px 0 7px', lineHeight: 1.4 }}>
        {itemsSummary(order) || '—'}
      </div>

      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
        {order.district && <MiniChip color="#5CA8FF">{order.district}</MiniChip>}
        {order.is_free_delivery && <MiniChip color="var(--st-done)">ҮНЭГҮЙ</MiniChip>}
        {order.payment_method && <MiniChip color="var(--kraft)">{PAY_MN[order.payment_method]}</MiniChip>}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span className="mono" style={{ fontSize: 14.5, fontWeight: 700, color: '#EFECE3' }}>
          {fmtMNT(order.subtotal_mnt + order.delivery_fee_mnt)}
        </span>
        <span className="mono" style={{ fontSize: 11.5, color: 'var(--mut)' }}>{fmtWeight(Number(order.total_weight_kg))}</span>
      </div>

      <div style={{ borderTop: '1px solid var(--line)', marginTop: 9, paddingTop: 8 }}>
        {order.driver ? (
          // 적재 시작 전(new/assigned)까지는 눌러서 기사 교체 가능
          (order.status === 'new' || order.status === 'assigned') ? (
            <button onClick={onAssign} title="Жолооч солих"
              style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: 'var(--mut)', width: '100%', background: 'none', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--ink3)', color: 'var(--kraft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                {order.driver.name.charAt(0)}
              </span>
              {order.driver.name}
              {order.driver.vehicle && (
                <span className="mono">· {order.driver.vehicle.model} {order.driver.vehicle.plate}</span>
              )}
              <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 700, color: 'var(--kraft)', border: '1px dashed color-mix(in srgb, var(--kraft) 45%, transparent)', borderRadius: 6, padding: '2px 7px' }}>
                солих
              </span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: 'var(--mut)' }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--ink3)', color: 'var(--kraft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                {order.driver.name.charAt(0)}
              </span>
              {order.driver.name}
              {order.driver.vehicle && (
                <span className="mono">· {order.driver.vehicle.model} {order.driver.vehicle.plate}</span>
              )}
            </div>
          )
        ) : (
          <button onClick={onAssign}
            style={{ width: '100%', padding: '7px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, background: 'transparent', color: 'var(--kraft)', border: '1px dashed color-mix(in srgb, var(--kraft) 55%, transparent)', cursor: 'pointer' }}>
            + Жолооч хуваарилах
          </button>
        )}
      </div>
    </div>
  );
}
