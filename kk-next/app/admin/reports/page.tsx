'use client';

// Тайлан — 일/월 매출 + 제품별 판매량 (08-roadmap P2). CSS 막대로 렌더(라이브러리 無).
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { fmtMNT } from '@/lib/types';

interface DeliveredOrder {
  id: number; delivered_at: string; subtotal_mnt: number; delivery_fee_mnt: number;
  total_weight_kg: number;
  driver: { name: string } | null;
  items: { qty: number; unit_price_mnt: number; product: { name_mn: string; band_color: string | null } | null }[];
}

const card: React.CSSProperties = {
  background: 'rgba(19,37,63,.55)', border: '1px solid var(--line)', borderRadius: 13, padding: '16px 18px',
};

export default function ReportsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [orders, setOrders] = useState<DeliveredOrder[]>([]);

  useEffect(() => {
    const since = new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10);
    supabase.from('orders')
      .select('id, delivered_at, subtotal_mnt, delivery_fee_mnt, total_weight_kg, driver:drivers(name), items:order_items(qty, unit_price_mnt, product:products(name_mn, band_color))')
      .eq('status', 'delivered').gte('delivered_at', since)
      .then(({ data }) => setOrders((data ?? []) as unknown as DeliveredOrder[]));
  }, [supabase]);

  const { days, monthTotal, monthCount, products, driverKpi } = useMemo(() => {
    const today = new Date();
    const days: { date: string; total: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 86400_000).toISOString().slice(0, 10);
      days.push({ date: d, total: 0 });
    }
    const month = today.toISOString().slice(0, 7);
    let monthTotal = 0, monthCount = 0;
    const prod = new Map<string, { qty: number; revenue: number; band: string | null }>();
    for (const o of orders) {
      const total = o.subtotal_mnt + o.delivery_fee_mnt;
      const day = days.find((x) => x.date === o.delivered_at?.slice(0, 10));
      if (day) day.total += total;
      if (o.delivered_at?.startsWith(month)) { monthTotal += total; monthCount++; }
      for (const it of o.items) {
        const key = it.product?.name_mn ?? '?';
        const p = prod.get(key) ?? { qty: 0, revenue: 0, band: it.product?.band_color ?? null };
        p.qty += it.qty; p.revenue += it.qty * it.unit_price_mnt;
        prod.set(key, p);
      }
    }
    const products = [...prod.entries()].sort((a, b) => b[1].qty - a[1].qty);

    // P3: 기사 KPI (최근 30일 배송완료 기준)
    const kpi = new Map<string, { count: number; revenue: number; weight: number }>();
    for (const o of orders) {
      const name = o.driver?.name ?? '—';
      const k = kpi.get(name) ?? { count: 0, revenue: 0, weight: 0 };
      k.count++; k.revenue += o.subtotal_mnt + o.delivery_fee_mnt; k.weight += Number(o.total_weight_kg);
      kpi.set(name, k);
    }
    const driverKpi = [...kpi.entries()].sort((a, b) => b[1].count - a[1].count);
    return { days, monthTotal, monthCount, products, driverKpi };
  }, [orders]);

  const maxDay = Math.max(1, ...days.map((d) => d.total));
  const maxQty = Math.max(1, ...products.map(([, p]) => p.qty));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 className="disp" style={{ fontSize: 21 }}>Тайлан</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <div style={card}>
          <div style={{ fontSize: 11.5, color: 'var(--mut)', fontWeight: 700 }}>Энэ сарын орлого</div>
          <div className="mono" style={{ fontSize: 23, fontWeight: 700, color: '#EFECE3', marginTop: 5 }}>{fmtMNT(monthTotal)}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 11.5, color: 'var(--mut)', fontWeight: 700 }}>Энэ сарын хүргэлт</div>
          <div className="mono" style={{ fontSize: 23, fontWeight: 700, color: '#EFECE3', marginTop: 5 }}>{monthCount}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 11.5, color: 'var(--mut)', fontWeight: 700 }}>Дундаж захиалга</div>
          <div className="mono" style={{ fontSize: 23, fontWeight: 700, color: '#EFECE3', marginTop: 5 }}>
            {fmtMNT(monthCount ? Math.round(monthTotal / monthCount) : 0)}
          </div>
        </div>
      </div>

      {/* 최근 14일 매출 막대 */}
      <div style={card}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#EFECE3', marginBottom: 14 }}>Сүүлийн 14 өдрийн орлого</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 130 }}>
          {days.map((d) => (
            <div key={d.date} title={`${d.date} · ${fmtMNT(d.total)}`}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', maxWidth: 34, borderRadius: '5px 5px 0 0', background: d.total ? 'linear-gradient(180deg, var(--kraft), var(--kraft-deep))' : 'var(--ink3)', height: `${Math.max(3, (d.total / maxDay) * 100)}%` }} />
              <span className="mono" style={{ fontSize: 9, color: 'var(--mut)' }}>{d.date.slice(8)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 제품별 판매량 */}
      <div style={card}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#EFECE3', marginBottom: 14 }}>Бүтээгдэхүүнээр (сүүлийн 30 өдөр)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {products.map(([name, p]) => (
            <div key={name} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 76px 120px', gap: 12, alignItems: 'center', fontSize: 12.5 }}>
              <span style={{ color: '#EFECE3', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
              <div style={{ height: 11, borderRadius: 999, background: 'var(--ink3)', overflow: 'hidden' }}>
                <div style={{ width: `${(p.qty / maxQty) * 100}%`, height: '100%', borderRadius: 999, background: p.band ?? 'var(--kraft)' }} />
              </div>
              <span className="mono" style={{ textAlign: 'right', fontWeight: 700, color: '#EFECE3' }}>{p.qty}ш</span>
              <span className="mono" style={{ textAlign: 'right', color: 'var(--mut)' }}>{fmtMNT(p.revenue)}</span>
            </div>
          ))}
          {products.length === 0 && <div style={{ fontSize: 13, color: 'var(--mut)' }}>Сүүлийн 30 өдөрт хүргэгдсэн захиалга алга.</div>}
        </div>
      </div>

      {/* 기사 KPI (P3) */}
      <div style={card}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#EFECE3', marginBottom: 14 }}>Жолоочийн KPI (сүүлийн 30 өдөр)</div>
        <div className="table-scroll">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 520 }}>
          {driverKpi.map(([name, k]) => (
            <div key={name} style={{ display: 'grid', gridTemplateColumns: '34px 1fr 90px 90px 130px', gap: 12, alignItems: 'center', fontSize: 12.5 }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--ink3)', color: 'var(--kraft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                {name.charAt(0)}
              </span>
              <span style={{ color: '#EFECE3', fontWeight: 700 }}>{name}</span>
              <span className="mono" style={{ textAlign: 'right', color: '#EFECE3', fontWeight: 700 }}>{k.count} хүргэлт</span>
              <span className="mono" style={{ textAlign: 'right', color: 'var(--mut)' }}>
                {k.weight >= 1000 ? `${(k.weight / 1000).toFixed(1)}т` : `${Math.round(k.weight)}кг`}
              </span>
              <span className="mono" style={{ textAlign: 'right', color: 'var(--mut)' }}>{fmtMNT(k.revenue)}</span>
            </div>
          ))}
          {driverKpi.length === 0 && <div style={{ fontSize: 13, color: 'var(--mut)' }}>Мэдээлэл алга.</div>}
        </div>
        </div>
      </div>
    </div>
  );
}
