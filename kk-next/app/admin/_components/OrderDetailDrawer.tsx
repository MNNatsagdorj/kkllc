'use client';

// 주문 상세 드로어 — 칸반 카드/주문 목록 행 클릭으로 열림.
// 고객·주소(핀 지도)·품목·금액·기사·상태 이력·증빙 사진까지 한 화면에.
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { StatusChip } from '@/components/StatusChip';
import { fmtWeight, type OrderRow } from '@/lib/queries';
import { fmtMNT, fmtOrderNo } from '@/lib/types';
import { STATUS_LABEL_MN, STATUS_COLOR } from '@/lib/status';

const PinMap = dynamic(() => import('@/components/PinMap').then((m) => m.PinMap), {
  ssr: false,
  loading: () => (
    <div style={{ height: 170, borderRadius: 10, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mut)', fontSize: 12.5 }}>
      Газрын зураг ачаалж байна…
    </div>
  ),
});

const PAY_MN: Record<string, string> = { cash: 'Бэлэн', transfer: 'Данс', credit: 'Зээл' };
const SOURCE_MN: Record<string, string> = { manager: 'Админ', website: 'Вэб', voice: 'Дуу' };

const section: React.CSSProperties = {
  background: 'var(--ink)', border: '1px solid var(--line)', borderRadius: 11, padding: '13px 15px',
};
const heading: React.CSSProperties = {
  fontSize: 10.5, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase',
  color: 'var(--mut)', marginBottom: 9,
};
const row: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 13, padding: '3px 0',
};

const fmtDT = (iso: string) => iso.slice(5, 16).replace('T', ' ');

export function OrderDetailDrawer({ order, onClose }: { order: OrderRow; onClose: () => void }) {
  const supabase = useMemo(() => createClient(), []);
  const [history, setHistory] = useState<{ status: string; changed_at: string }[]>([]);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('order_status_history')
      .select('status, changed_at').eq('order_id', order.id).order('changed_at')
      .then(({ data }) => setHistory((data ?? []) as { status: string; changed_at: string }[]));
  }, [supabase, order.id]);

  useEffect(() => {
    if (!order.proof_photo_url) { setProofUrl(null); return; }
    supabase.storage.from('delivery-proofs').createSignedUrl(order.proof_photo_url, 3600)
      .then(({ data }) => setProofUrl(data?.signedUrl ?? null));
  }, [supabase, order.proof_photo_url]);

  // pending 승인/거절 — Realtime이 보드·드로어를 함께 갱신
  const decide = async (status: 'new' | 'cancelled') => {
    if (status === 'cancelled' && !window.confirm('Энэ захиалгыг татгалзах уу?')) return;
    setBusy(true); setErr(null);
    const res = await fetch(`/api/orders/${order.id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    if (!res.ok) setErr((await res.json()).error ?? 'Алдаа гарлаа');
  };

  const total = order.subtotal_mnt + order.delivery_fee_mnt;
  const phoneDigits = order.customer?.phone?.replace(/\D/g, '') ?? '';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(4,10,20,.55)' }} />
      <aside style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 440, maxWidth: '94vw', background: 'var(--ink2)', borderLeft: '1px solid var(--line)', padding: 20, overflowY: 'auto', color: '#EFECE3', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--kraft)' }}>{fmtOrderNo(order.id)}</span>
          <StatusChip status={order.status} />
          <span style={{ fontSize: 11, color: 'var(--mut)' }}>{SOURCE_MN[order.source]}</span>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 0, color: 'var(--mut)', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>
        <div className="mono" style={{ fontSize: 11.5, color: 'var(--mut)', marginTop: -6 }}>
          Үүссэн {fmtDT(order.created_at)}
          {order.scheduled_date && <> · Хүргэх өдөр {order.scheduled_date}</>}
          {order.delivered_at && <> · Хүргэгдсэн {fmtDT(order.delivered_at)}</>}
        </div>

        {/* pending 승인 */}
        {order.status === 'pending' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => decide('new')} disabled={busy}
              style={{ flex: 1, padding: '11px 0', borderRadius: 9, fontSize: 13.5, fontWeight: 800, border: 0, background: 'var(--st-done)', color: '#fff', cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
              ✓ Зөвшөөрөх
            </button>
            <button onClick={() => decide('cancelled')} disabled={busy}
              style={{ padding: '11px 16px', borderRadius: 9, fontSize: 13.5, fontWeight: 700, background: 'transparent', color: 'var(--st-cancel)', border: '1px solid color-mix(in srgb, var(--st-cancel) 50%, transparent)', cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
              Татгалзах
            </button>
          </div>
        )}
        {err && <div style={{ fontSize: 12.5, color: 'var(--st-cancel)', fontWeight: 700 }}>{err}</div>}

        {/* 고객 */}
        <div style={section}>
          <div style={heading}>Харилцагч</div>
          <div style={{ fontSize: 14.5, fontWeight: 700 }}>
            {order.customer?.name ?? '—'}
            {order.customer?.type === 'shop' && <span style={{ fontSize: 11, color: 'var(--kraft)', marginLeft: 8 }}>Дэлгүүр</span>}
          </div>
          {phoneDigits && (
            <a href={`tel:${phoneDigits}`} className="mono" style={{ fontSize: 13, color: '#5CA8FF', fontWeight: 700 }}>
              ☎ {order.customer?.phone}
            </a>
          )}
        </div>

        {/* 주소 + 핀 지도 */}
        <div style={section}>
          <div style={heading}>Хаяг</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>
            {order.district && <b style={{ color: '#5CA8FF' }}>{order.district} · </b>}
            {order.address}
          </div>
          {order.lat != null && order.lng != null && (
            <div style={{ marginTop: 10 }}>
              <PinMap lat={order.lat} lng={order.lng} height={170} expandable />
            </div>
          )}
          {order.note && (
            <div style={{ marginTop: 9, fontSize: 12.5, color: 'var(--mut)', borderLeft: '2px solid var(--line)', paddingLeft: 9 }}>
              {order.note}
            </div>
          )}
        </div>

        {/* 품목 */}
        <div style={section}>
          <div style={heading}>Бараа · {order.total_qty}ш · {fmtWeight(Number(order.total_weight_kg))}</div>
          {order.items.map((it) => (
            <div key={it.id} style={{ ...row, borderBottom: '1px solid var(--line)', padding: '7px 0', alignItems: 'baseline' }}>
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>
                {it.product?.name_mn ?? '?'}
                <span className="mono" style={{ fontSize: 11, color: 'var(--mut)', marginLeft: 7 }}>
                  {fmtMNT(it.unit_price_mnt)} × {it.qty}
                </span>
              </span>
              <span className="mono" style={{ fontWeight: 700 }}>{fmtMNT(it.unit_price_mnt * it.qty)}</span>
            </div>
          ))}
          <div style={{ ...row, marginTop: 6 }}>
            <span style={{ color: 'var(--mut)' }}>Барааны дүн</span>
            <span className="mono">{fmtMNT(order.subtotal_mnt)}</span>
          </div>
          <div style={row}>
            <span style={{ color: 'var(--mut)' }}>Хүргэлт</span>
            <span className="mono" style={{ color: order.is_free_delivery ? 'var(--st-done)' : undefined, fontWeight: 700 }}>
              {order.is_free_delivery ? 'ҮНЭГҮЙ' : fmtMNT(order.delivery_fee_mnt)}
            </span>
          </div>
          <div style={{ ...row, borderTop: '1px solid var(--line)', paddingTop: 8, marginTop: 4 }}>
            <span style={{ fontWeight: 800 }}>Нийт дүн</span>
            <span className="mono" style={{ fontSize: 16, fontWeight: 700 }}>{fmtMNT(total)}</span>
          </div>
          {order.payment_method && (
            <div style={row}>
              <span style={{ color: 'var(--mut)' }}>Төлбөр</span>
              <span style={{ fontWeight: 700, color: 'var(--kraft)' }}>
                {PAY_MN[order.payment_method]}
                {order.payment_method === 'cash' && order.cash_amount_mnt != null && (
                  <span className="mono" style={{ marginLeft: 7 }}>{fmtMNT(order.cash_amount_mnt)}</span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* 기사 */}
        {order.driver && (
          <div style={section}>
            <div style={heading}>Жолооч</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
              <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--ink3)', color: 'var(--kraft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>
                {order.driver.name.charAt(0)}
              </span>
              <span>
                <b>{order.driver.name}</b>
                <span className="mono" style={{ display: 'block', fontSize: 11.5, color: 'var(--mut)' }}>
                  {order.driver.phone}
                  {order.driver.vehicle && <> · {order.driver.vehicle.model} {order.driver.vehicle.plate}</>}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* 상태 이력 */}
        {history.length > 0 && (
          <div style={section}>
            <div style={heading}>Явцын түүх</div>
            {history.map((h, i) => (
              <div key={i} style={{ ...row, alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[h.status as keyof typeof STATUS_COLOR] ?? 'var(--mut)' }} />
                  {STATUS_LABEL_MN[h.status as keyof typeof STATUS_LABEL_MN] ?? h.status}
                </span>
                <span className="mono" style={{ fontSize: 11.5, color: 'var(--mut)' }}>{fmtDT(h.changed_at)}</span>
              </div>
            ))}
          </div>
        )}

        {/* 배송 증빙 사진 */}
        {proofUrl && (
          <div style={section}>
            <div style={heading}>Хүргэлтийн баталгаа</div>
            {/* signed URL은 next/image 도메인 설정과 무관하게 표시 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={proofUrl} alt="Хүргэлтийн зураг" style={{ width: '100%', borderRadius: 9, border: '1px solid var(--line)' }} />
          </div>
        )}

        {order.status === 'delivered' && (
          <Link href={`/admin/receipt/${order.id}`}
            style={{ textAlign: 'center', padding: '11px 0', borderRadius: 9, fontSize: 13.5, fontWeight: 800, background: 'var(--kraft)', color: 'var(--ink)' }}>
            Падаан хэвлэх →
          </Link>
        )}
      </aside>
    </div>
  );
}
