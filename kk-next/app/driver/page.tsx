'use client';

// 오늘의 배송 리스트 (06 문서 화면 1) — 본인 배정 주문만(RLS), Realtime 갱신
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { StatusChip } from '@/components/StatusChip';
import { ORDER_SELECT, itemsSummary, fmtWeight, type OrderRow } from '@/lib/queries';
import { fmtMNT, fmtOrderNo } from '@/lib/types';

const SECTIONS: { key: string; label: string; match: (o: OrderRow) => boolean; accent?: boolean }[] = [
  { key: 'now', label: 'Одоо явж байгаа', match: (o) => o.status === 'en_route' || o.status === 'loading', accent: true },
  { key: 'next', label: 'Дараагийн', match: (o) => o.status === 'assigned' },
  { key: 'done', label: 'Дууссан', match: (o) => o.status === 'delivered' },
];

export default function DriverHome() {
  const supabase = useMemo(() => createClient(), []);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const today = new Date().toISOString().slice(0, 10);

  const refetch = useCallback(async () => {
    const { data } = await supabase.from('orders')
      .select(ORDER_SELECT)
      .or(`status.in.(assigned,loading,en_route),and(status.eq.delivered,delivered_at.gte.${today})`)
      .order('created_at', { ascending: true });
    if (data) setOrders(data as unknown as OrderRow[]);
  }, [supabase, today]);

  useEffect(() => {
    refetch();
    const ch = supabase.channel('driver-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, refetch)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [supabase, refetch]);

  const active = orders.filter((o) => o.status !== 'delivered');
  const stats = [
    { v: String(orders.length), l: 'хүргэлт' },
    { v: fmtWeight(active.reduce((s, o) => s + Number(o.total_weight_kg), 0)), l: 'ачаатай' },
    { v: String(orders.filter((o) => o.status === 'delivered').length), l: 'дууссан' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 9, marginBottom: 18 }}>
        {stats.map((s) => (
          <div key={s.l} style={{ background: '#FBFAF5', border: '1px solid var(--site-line)', borderRadius: 12, padding: '12px 0', textAlign: 'center' }}>
            <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--site-text)' }}>{s.v}</div>
            <div style={{ fontSize: 11, color: '#8A8062', marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {SECTIONS.map((sec) => {
        const list = orders.filter(sec.match);
        if (!list.length) return null;
        return (
          <section key={sec.key} style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', color: '#8A8062', margin: '0 2px 9px' }}>
              {sec.label}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {list.map((o) => (
                <Link key={o.id} href={`/driver/orders/${o.id}`}
                  style={{ display: 'block', background: '#FBFAF5', borderRadius: 13, padding: '13px 15px', border: sec.accent ? '2px solid var(--st-way)' : '1px solid var(--site-line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--site-text)' }}>{fmtOrderNo(o.id)}</span>
                    <StatusChip status={o.status} />
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--site-text)' }}>{o.customer?.name ?? '—'}</div>
                  <div style={{ fontSize: 12.5, color: '#6B6350', margin: '3px 0 6px' }}>
                    {[o.district, o.address].filter(Boolean).join(' · ')}
                  </div>
                  <div style={{ fontSize: 12.5, color: '#6B6350' }}>{itemsSummary(o)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    <span className="mono" style={{ fontSize: 12, color: '#8A8062' }}>{fmtWeight(Number(o.total_weight_kg))}</span>
                    {o.is_free_delivery && <span className="st-chip" style={{ '--st': 'var(--st-done)' } as React.CSSProperties}>ҮНЭГҮЙ</span>}
                    {o.payment_method === 'cash' && (
                      <span className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--st-way)', marginLeft: 'auto' }}>
                        Бэлэн {fmtMNT(o.cash_amount_mnt ?? o.subtotal_mnt + o.delivery_fee_mnt)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#8A8062', fontSize: 14 }}>
          Өнөөдөр хуваарилагдсан хүргэлт алга.
        </div>
      )}
    </div>
  );
}
