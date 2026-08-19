'use client';

// 오늘의 배송 리스트 (06 문서 화면 1) — 본인 배정 주문만(RLS), Realtime 갱신
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { StatusChip } from '@/components/StatusChip';
import { ORDER_SELECT, itemsSummary, fmtWeight, type OrderRow } from '@/lib/queries';
import { fmtMNT, fmtOrderNo } from '@/lib/types';

// 섹션별 컬러 아이덴티티 — 진행(주황)·다음(호박)·완료(초록)를 한눈에 구분
const SECTIONS: {
  key: 'now' | 'next' | 'done'; label: string; icon: string; color: string;
  match: (o: OrderRow) => boolean;
}[] = [
  { key: 'now', label: 'Одоо явж байгаа', icon: '🚚', color: 'var(--st-way)', match: (o) => o.status === 'en_route' || o.status === 'loading' },
  { key: 'next', label: 'Дараагийн', icon: '📦', color: 'var(--st-asg)', match: (o) => o.status === 'assigned' },
  { key: 'done', label: 'Дууссан', icon: '✓', color: 'var(--st-done)', match: (o) => o.status === 'delivered' },
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
          <section key={sec.key} style={{ marginBottom: 24 }}>
            {/* 섹션 헤더: 컬러 아이콘 + 라벨 + 건수 + 컬러 라인 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '0 2px 10px' }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: sec.color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>
                {sec.icon}
              </span>
              <h2 style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', color: sec.color, margin: 0 }}>
                {sec.label}
              </h2>
              <span className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: sec.color, background: `color-mix(in srgb, ${sec.color} 14%, transparent)`, border: `1px solid color-mix(in srgb, ${sec.color} 40%, transparent)`, borderRadius: 999, padding: '1px 9px' }}>
                {list.length}
              </span>
              <span style={{ flex: 1, height: 2, background: `color-mix(in srgb, ${sec.color} 25%, transparent)`, borderRadius: 2 }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: sec.key === 'done' ? 7 : 10 }}>
              {sec.key === 'done'
                ? list.map((o) => (
                  // 완료: 컴팩트 한 줄 — 공간 최소화, 흐리게
                  <Link key={o.id} href={`/driver/orders/${o.id}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 11, background: '#FBFAF5', borderRadius: 11, padding: '10px 13px', border: '1px solid var(--site-line)', borderLeft: `4px solid ${sec.color}`, opacity: .78 }}>
                    <span style={{ color: sec.color, fontWeight: 800, fontSize: 14 }}>✓</span>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--site-text)' }}>{fmtOrderNo(o.id)}</span>
                    <span style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 700, color: 'var(--site-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {o.customer?.name ?? '—'}
                      <span style={{ fontWeight: 400, color: '#8A8062', marginLeft: 7, fontSize: 12 }}>{o.district}</span>
                    </span>
                    <span className="mono" style={{ fontSize: 11.5, color: '#8A8062', flexShrink: 0 }}>
                      {o.delivered_at ? o.delivered_at.slice(11, 16) : fmtWeight(Number(o.total_weight_kg))}
                    </span>
                  </Link>
                ))
                : list.map((o) => (
                  // 진행/다음: 컬러 레일 카드 — 진행 중은 배경 틴트 + 진행 버튼으로 강조
                  <Link key={o.id} href={`/driver/orders/${o.id}`}
                    style={{
                      display: 'block', borderRadius: 13, padding: sec.key === 'now' ? '15px 16px' : '13px 15px',
                      background: sec.key === 'now' ? `color-mix(in srgb, ${sec.color} 7%, #FBFAF5)` : '#FBFAF5',
                      border: `1px solid ${sec.key === 'now' ? `color-mix(in srgb, ${sec.color} 45%, transparent)` : 'var(--site-line)'}`,
                      borderLeft: `5px solid ${sec.color}`,
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--site-text)' }}>{fmtOrderNo(o.id)}</span>
                      <StatusChip status={o.status} />
                    </div>
                    <div style={{ fontSize: sec.key === 'now' ? 16 : 14.5, fontWeight: 800, color: 'var(--site-text)' }}>{o.customer?.name ?? '—'}</div>
                    <div style={{ fontSize: 12.5, color: '#6B6350', margin: '3px 0 6px' }}>
                      📍 {[o.district, o.address].filter(Boolean).join(' · ')}
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
                    {sec.key === 'now' && (
                      <div style={{ marginTop: 11, borderRadius: 10, background: sec.color, color: '#fff', textAlign: 'center', fontWeight: 800, fontSize: 13.5, padding: '11px 0' }}>
                        Үргэлжлүүлэх →
                      </div>
                    )}
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
