'use client';

// Захиалга — 전체 목록 + 필터(상태/기사/출처/기간) + 검색 (05 문서 P2)
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { StatusChip } from '@/components/StatusChip';
import { ORDER_SELECT, itemsSummary, fmtWeight, type OrderRow, type DriverRow } from '@/lib/queries';
import { STATUS_LABEL_MN } from '@/lib/status';
import { fmtMNT, fmtOrderNo } from '@/lib/types';
import { OrderDetailDrawer } from '../_components/OrderDetailDrawer';

const input: React.CSSProperties = {
  padding: '8px 11px', borderRadius: 8, fontSize: 12.5,
  background: 'var(--ink2)', border: '1px solid var(--line)', color: '#EFECE3',
};
const SOURCE_MN: Record<string, string> = { manager: 'Админ', website: 'Вэб', voice: 'Дуу' };

export default function OrdersPage() {
  const supabase = useMemo(() => createClient(), []);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [drivers, setDrivers] = useState<DriverRow[]>([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [driverId, setDriverId] = useState('');
  const [source, setSource] = useState('');
  const [from, setFrom] = useState('');
  const [busy, setBusy] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  // id로 참조 → Realtime refetch 시 드로어 내용도 최신 유지
  const detail = detailId != null ? orders.find((o) => o.id === detailId) ?? null : null;

  const refetch = useMemo(() => async () => {
    const { data } = await supabase.from('orders')
      .select(ORDER_SELECT).order('created_at', { ascending: false }).limit(300);
    if (data) setOrders(data as unknown as OrderRow[]);
  }, [supabase]);

  useEffect(() => {
    refetch();
    supabase.from('drivers').select('id, name, phone, is_active, vehicle:vehicles(model, plate, capacity_kg)')
      .then(({ data }) => setDrivers((data ?? []) as unknown as DriverRow[]));
    const ch = supabase.channel('orders-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, refetch)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [supabase, refetch]);

  const rows = orders.filter((o) => {
    if (status && o.status !== status) return false;
    if (driverId && o.driver_id !== driverId) return false;
    if (source && o.source !== source) return false;
    if (from && o.created_at.slice(0, 10) < from) return false;
    if (q) {
      const hay = `${o.id} ${o.customer?.name ?? ''} ${o.customer?.phone ?? ''} ${o.district ?? ''}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const cancel = async (o: OrderRow) => {
    if (!window.confirm(`${fmtOrderNo(o.id)} захиалгыг цуцлах уу?`)) return;
    setBusy(o.id);
    const res = await fetch(`/api/orders/${o.id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    });
    setBusy(null);
    if (res.ok) refetch();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <h1 className="disp" style={{ fontSize: 21 }}>Захиалга</h1>
        <span className="mono" style={{ fontSize: 12, color: 'var(--mut)' }}>{rows.length} / {orders.length}</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginLeft: 'auto' }}>
          <input style={{ ...input, width: 190 }} placeholder="Хайх: нэр · утас · №" value={q} onChange={(e) => setQ(e.target.value)} />
          <select style={input} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Бүх төлөв</option>
            {Object.entries(STATUS_LABEL_MN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select style={input} value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            <option value="">Бүх жолооч</option>
            {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select style={input} value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">Бүх эх үүсвэр</option>
            {Object.entries(SOURCE_MN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <input type="date" style={input} value={from} onChange={(e) => setFrom(e.target.value)} title="Энэ өдрөөс хойш" />
        </div>
      </div>

      <div className="table-scroll" style={{ background: 'rgba(19,37,63,.55)', border: '1px solid var(--line)', borderRadius: 13 }}>
        <div style={{ minWidth: 980 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '64px 76px 1.3fr 1.5fr 56px 110px 120px 110px 120px', gap: 10, padding: '11px 16px', fontSize: 10.5, fontWeight: 800, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--mut)', borderBottom: '1px solid var(--line)' }}>
          <span>№</span><span>Огноо</span><span>Харилцагч</span><span>Бараа</span><span>Дүүрэг</span>
          <span style={{ textAlign: 'right' }}>Дүн</span><span>Жолооч</span><span>Төлөв</span><span></span>
        </div>
        {rows.map((o) => (
          <div key={o.id} onClick={() => setDetailId(o.id)}
            style={{ display: 'grid', gridTemplateColumns: '64px 76px 1.3fr 1.5fr 56px 110px 120px 110px 120px', gap: 10, alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid var(--line)', fontSize: 12.5, cursor: 'pointer' }}>
            <span className="mono" style={{ fontWeight: 700, color: 'var(--kraft)' }}>{fmtOrderNo(o.id)}</span>
            <span className="mono" style={{ color: 'var(--mut)', fontSize: 11.5 }}>{o.created_at.slice(5, 10)}</span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', fontWeight: 600, color: '#EFECE3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.customer?.name ?? '—'}</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--mut)' }}>{o.customer?.phone}</span>
            </span>
            <span style={{ color: 'var(--mut)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{itemsSummary(o)}</span>
            <span style={{ color: '#5CA8FF', fontWeight: 700, fontSize: 11.5 }}>{o.district ?? '—'}</span>
            <span className="mono" style={{ textAlign: 'right', fontWeight: 700, color: '#EFECE3' }}>
              {fmtMNT(o.subtotal_mnt + o.delivery_fee_mnt)}
              <span style={{ display: 'block', fontSize: 10.5, fontWeight: 400, color: 'var(--mut)' }}>{fmtWeight(Number(o.total_weight_kg))} · {SOURCE_MN[o.source]}</span>
            </span>
            <span style={{ color: 'var(--mut)', fontSize: 12 }}>{o.driver?.name ?? '—'}</span>
            <span><StatusChip status={o.status} /></span>
            <span style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
              {o.status === 'delivered' && (
                <Link href={`/admin/receipt/${o.id}`} onClick={(e) => e.stopPropagation()}
                  style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--kraft)', border: '1px solid var(--line)', borderRadius: 7, padding: '4px 9px' }}>
                  Падаан
                </Link>
              )}
              {(o.status === 'new' || o.status === 'assigned') && (
                <button onClick={(e) => { e.stopPropagation(); cancel(o); }} disabled={busy === o.id}
                  style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--st-cancel)', background: 'none', border: '1px solid var(--line)', borderRadius: 7, padding: '4px 9px', cursor: 'pointer' }}>
                  Цуцлах
                </button>
              )}
            </span>
          </div>
        ))}
        {rows.length === 0 && <div style={{ padding: '38px 0', textAlign: 'center', color: 'var(--mut)', fontSize: 13 }}>Үр дүн олдсонгүй.</div>}
        </div>
      </div>

      {detail && <OrderDetailDrawer order={detail} onClose={() => setDetailId(null)} />}
    </div>
  );
}
