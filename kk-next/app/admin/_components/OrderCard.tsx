'use client';

// 주문 카드 (05 문서 필드 그대로) + 웹 주문 승인/거절 (pending) + 배송 증빙 썸네일 (delivered)
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
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

export function OrderCard({ order, onAssign, onOpen }: { order: OrderRow; onAssign: () => void; onOpen: () => void }) {
  const time = order.created_at ? new Date(order.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);
  const [proofUrl, setProofUrl] = useState<string | null>(null);

  // 배송 완료 카드: 기사 증빙 사진 썸네일 (클릭 → 드로어에서 크게)
  useEffect(() => {
    if (order.status !== 'delivered' || !order.proof_photo_url) { setProofUrl(null); return; }
    supabase.storage.from('delivery-proofs').createSignedUrl(order.proof_photo_url, 3600)
      .then(({ data }) => setProofUrl(data?.signedUrl ?? null));
  }, [supabase, order.status, order.proof_photo_url]);

  // pending 승인/거절 — 성공 시 Realtime이 보드를 갱신
  const decide = async (status: 'new' | 'cancelled') => {
    if (status === 'cancelled' && !window.confirm('Энэ захиалгыг татгалзах уу?')) return;
    setBusy(true); setErr(null);
    const res = await fetch(`/api/orders/${order.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    if (!res.ok) setErr((await res.json()).error ?? 'Алдаа гарлаа');
  };

  return (
    // 카드 아무 곳이나 클릭 → 상세 드로어 (버튼은 stopPropagation)
    <div onClick={onOpen} style={{ background: 'var(--ink2)', border: '1px solid var(--line)', borderRadius: 11, padding: '11px 13px', cursor: 'pointer' }}>
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
        {order.source === 'website' && <MiniChip color="#9B8CFF">ВЭБ</MiniChip>}
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

      {proofUrl && (
        <div style={{ position: 'relative', marginTop: 9, borderRadius: 9, overflow: 'hidden', border: '1px solid var(--line)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={proofUrl} alt="Хүргэлтийн баталгаа" style={{ display: 'block', width: '100%', height: 92, objectFit: 'cover' }} />
          <span style={{ position: 'absolute', bottom: 6, left: 7, borderRadius: 999, padding: '2px 9px', fontSize: 9.5, fontWeight: 800, background: 'rgba(14,27,46,.8)', color: 'var(--st-done)' }}>
            📷 БАТАЛГАА
          </span>
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--line)', marginTop: 9, paddingTop: 8 }}>
        {order.status === 'pending' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 7 }}>
              <button onClick={(e) => { e.stopPropagation(); decide('new'); }} disabled={busy}
                style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 12.5, fontWeight: 800, border: 0, background: 'var(--st-done)', color: '#fff', cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
                ✓ Зөвшөөрөх
              </button>
              <button onClick={(e) => { e.stopPropagation(); decide('cancelled'); }} disabled={busy}
                style={{ padding: '8px 13px', borderRadius: 8, fontSize: 12.5, fontWeight: 700, background: 'transparent', color: 'var(--st-cancel)', border: '1px solid color-mix(in srgb, var(--st-cancel) 50%, transparent)', cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
                Татгалзах
              </button>
            </div>
            {err && <span style={{ fontSize: 11.5, color: 'var(--st-cancel)', fontWeight: 700 }}>{err}</span>}
          </div>
        ) : order.driver ? (
          // 적재 시작 전(new/assigned)까지는 눌러서 기사 교체 가능
          (order.status === 'new' || order.status === 'assigned') ? (
            <button onClick={(e) => { e.stopPropagation(); onAssign(); }} title="Жолооч солих"
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
          <button onClick={(e) => { e.stopPropagation(); onAssign(); }}
            style={{ width: '100%', padding: '7px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, background: 'transparent', color: 'var(--kraft)', border: '1px dashed color-mix(in srgb, var(--kraft) 55%, transparent)', cursor: 'pointer' }}>
            + Жолооч хуваарилах
          </button>
        )}
      </div>
    </div>
  );
}
