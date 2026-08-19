'use client';

// 칸반 보드: Шинэ | Хуваарилсан | Замд(loading 배지 포함) | Хүргэгдсэн(오늘)
// Supabase Realtime 구독으로 자동 갱신 (05 문서)
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ORDER_SELECT, type OrderRow, type DriverRow } from '@/lib/queries';
import { fmtMNT } from '@/lib/types';
import type { Product } from '@/lib/types';
import { OrderCard } from './OrderCard';
import { NewOrderDrawer } from './NewOrderDrawer';
import { AssignModal } from './AssignModal';
import { OrderDetailDrawer } from './OrderDetailDrawer';

const COLUMNS: { key: string; label: string; match: (o: OrderRow) => boolean }[] = [
  { key: 'new', label: 'Шинэ', match: (o) => o.status === 'pending' || o.status === 'new' },
  { key: 'assigned', label: 'Хуваарилсан', match: (o) => o.status === 'assigned' },
  { key: 'way', label: 'Замд', match: (o) => o.status === 'loading' || o.status === 'en_route' },
  { key: 'done', label: 'Хүргэгдсэн', match: (o) => o.status === 'delivered' },
];

export function Board() {
  const supabase = useMemo(() => createClient(), []);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [drivers, setDrivers] = useState<DriverRow[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [assignFor, setAssignFor] = useState<OrderRow | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  // id로 참조 → Realtime refetch 시 드로어 내용도 최신 유지
  const detail = detailId != null ? orders.find((o) => o.id === detailId) ?? null : null;

  const notify = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const refetch = useCallback(async () => {
    // 진행 중 전체 + 오늘 완료/취소분
    const { data } = await supabase.from('orders')
      .select(ORDER_SELECT)
      .or(`status.in.(pending,new,assigned,loading,en_route),and(status.in.(delivered,cancelled),created_at.gte.${today})`)
      .order('created_at', { ascending: false });
    if (data) setOrders(data as unknown as OrderRow[]);
  }, [supabase, today]);

  useEffect(() => {
    refetch();
    supabase.from('drivers').select('id, name, phone, is_active, vehicle:vehicles(model, plate, capacity_kg)')
      .eq('is_active', true)
      .then(({ data }) => setDrivers((data ?? []) as unknown as DriverRow[]));
    supabase.from('products').select('*').eq('is_active', true).order('sku')
      .then(({ data }) => setProducts((data ?? []) as Product[]));

    const ch = supabase.channel('board')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, refetch)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, refetch)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [supabase, refetch]);

  // 상단 통계 칩 (오늘 기준, 05 문서)
  const stats = useMemo(() => {
    const todays = orders.filter((o) => o.created_at?.slice(0, 10) === today);
    const enRoute = orders.filter((o) => o.status === 'en_route').length;
    const revenue = orders
      .filter((o) => o.status === 'delivered' && o.delivered_at?.slice(0, 10) === today)
      .reduce((s, o) => s + o.subtotal_mnt + o.delivery_fee_mnt, 0);
    const main = products[0];
    return [
      { label: 'өнөөдрийн захиалга', value: String(todays.length) },
      { label: 'замд', value: String(enRoute), accent: true },
      { label: 'өнөөдрийн орлого', value: fmtMNT(revenue) },
      { label: main ? `${main.name_mn} үлдэгдэл` : 'үлдэгдэл', value: main ? `${main.stock_qty}ш` : '—' },
    ];
  }, [orders, products, today]);

  const visible = orders.filter((o) => o.status !== 'cancelled');

  return (
    <div>
      {/* 상단바 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
        <h1 className="disp" style={{ fontSize: 21 }}>Самбар</h1>
        <span className="mono" style={{ fontSize: 12.5, color: 'var(--mut)' }}>{today}</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginLeft: 'auto' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: 'var(--ink2)', border: '1px solid var(--line)', borderRadius: 10, padding: '7px 13px' }}>
              <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: s.accent ? 'var(--st-way)' : '#EFECE3' }}>{s.value}</span>
              <span style={{ fontSize: 11, color: 'var(--mut)', marginLeft: 7 }}>{s.label}</span>
            </div>
          ))}
          <button onClick={() => setDrawerOpen(true)}
            style={{ background: 'var(--kraft)', color: 'var(--ink)', fontWeight: 800, fontSize: 13.5, border: 0, borderRadius: 9, padding: '9px 16px', cursor: 'pointer' }}>
            + Шинэ захиалга
          </button>
        </div>
      </div>

      {/* 칸반 4열 */}
      <div className="kanban-scroll">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(250px, 1fr))', gap: 14, minWidth: 1040 }}>
          {COLUMNS.map((col) => {
            const cards = visible.filter(col.match);
            return (
              <div key={col.key} style={{ background: 'rgba(19,37,63,.55)', border: '1px solid var(--line)', borderRadius: 13, padding: 11, minHeight: 300 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 6px 10px' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '.05em', textTransform: 'uppercase' }}>{col.label}</span>
                  <span className="mono" style={{ fontSize: 11.5, color: 'var(--mut)' }}>{cards.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {cards.map((o) => (
                    <OrderCard key={o.id} order={o} onAssign={() => setAssignFor(o)} onOpen={() => setDetailId(o.id)} />
                  ))}
                  {cards.length === 0 && (
                    <div style={{ padding: '26px 0', textAlign: 'center', fontSize: 12, color: 'var(--mut)' }}>Хоосон</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {drawerOpen && (
        <NewOrderDrawer
          products={products}
          drivers={drivers}
          onClose={() => setDrawerOpen(false)}
          onCreated={(msg) => { setDrawerOpen(false); notify(msg); refetch(); }}
        />
      )}
      {detail && <OrderDetailDrawer order={detail} onClose={() => setDetailId(null)} />}
      {assignFor && (
        <AssignModal
          order={assignFor}
          drivers={drivers}
          candidates={orders.filter((o) =>
            o.id !== assignFor.id && o.status === 'new' &&
            !!o.district && o.district === assignFor.district)}
          onClose={() => setAssignFor(null)}
          onDone={(msg) => { setAssignFor(null); notify(msg); refetch(); }}
        />
      )}
      {toast && (
        <div style={{ position: 'fixed', bottom: 22, left: '50%', transform: 'translateX(-50%)', background: '#EFECE3', color: 'var(--ink)', fontSize: 13.5, fontWeight: 700, padding: '11px 20px', borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,.4)', zIndex: 90 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
