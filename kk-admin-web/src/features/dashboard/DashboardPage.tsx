import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Banknote, ShoppingBag, Users, BarChart3, TriangleAlert, Box } from 'lucide-react'
import { getData } from '../../lib/api'
import { fmtMNT, fmtNum } from '../../lib/format'
import { ORDER_ST, CAT_FILL } from '../../lib/theme'
import { Card, CardHead } from '../../components/ui/Card'
import { Kpi } from '../../components/ui/Kpi'
import { BarChart } from '../../components/ui/Bars'
import { StatusPill } from '../../components/ui/Pill'
import { Spinner } from '../../components/ui/Spinner'
import type { DashboardSummary, SalesOrder, Product, ChartPoint, NameAmount } from '../../types'

export default function DashboardPage() {
  const nav = useNavigate()
  const summary = useQuery({ queryKey: ['dashboard', 'summary'], queryFn: () => getData<DashboardSummary>('/dashboard/summary') })
  const chart = useQuery({ queryKey: ['dashboard', 'chart'], queryFn: () => getData<ChartPoint[]>('/dashboard/sales-chart', { range: '7d' }) })
  const recent = useQuery({ queryKey: ['dashboard', 'recent'], queryFn: () => getData<SalesOrder[]>('/dashboard/recent-orders', { limit: 5 }) })
  const low = useQuery({ queryKey: ['dashboard', 'low'], queryFn: () => getData<Product[]>('/dashboard/low-stock', { limit: 4 }) })
  const cat = useQuery({ queryKey: ['dashboard', 'cat'], queryFn: () => getData<NameAmount[]>('/dashboard/category-share') })

  const s = summary.data
  const catTotal = Math.max(1, (cat.data ?? []).reduce((a, c) => a + c.amount, 0))
  const bars = (chart.data ?? []).map((c) => ({ label: c.label, value: c.amount, display: (c.amount / 1e6).toFixed(1) }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* KPI */}
      <div className="r-kpi4">
        <Kpi label="Энэ сарын борлуулалт" value={fmtMNT(s?.monthRevenue)} icon={<Banknote size={17} />} iconBg="#eef3fa" iconColor="#15396B"
          delta={s?.revenueDeltaPct != null ? `${Math.abs(s.revenueDeltaPct)}%` : null} deltaUp={(s?.revenueDeltaPct ?? 0) >= 0} />
        <Kpi label="Захиалга" value={fmtNum(s?.ordersCount)} icon={<ShoppingBag size={17} />}
          delta={s?.ordersDeltaPct != null ? `${Math.abs(s.ordersDeltaPct)}%` : null} deltaUp={(s?.ordersDeltaPct ?? 0) >= 0} />
        <Kpi label="Шинэ харилцагч" value={fmtNum(s?.newCustomers)} icon={<Users size={17} />} />
        <Kpi label="Дундаж захиалга" value={fmtMNT(s?.avgOrder)} icon={<BarChart3 size={17} />} />
      </div>

      {/* chart + category */}
      <div className="r-main2">
        <Card>
          <CardHead title="Борлуулалтын явц" sub="Сүүлийн 7 хоног · сая ₮" />
          {chart.isLoading ? <Spinner /> : bars.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#a1a1aa', fontSize: 13 }}>Хүргэгдсэн захиалга алга</div>
          ) : <BarChart data={bars} height={200} />}
        </Card>

        <Card>
          <CardHead title="Ангиллын борлуулалт" sub="Энэ сар" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(cat.data ?? []).map((c, i) => {
              const pct = Math.round((c.amount / catTotal) * 100)
              return (
                <div key={c.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                    <span style={{ fontSize: 13, color: '#3f3f46', fontWeight: 450 }}>{c.name}</span>
                    <span style={{ fontSize: 13, color: '#18181b', fontWeight: 600 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 8, background: '#f4f4f5', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: CAT_FILL[i % CAT_FILL.length], borderRadius: 5 }} />
                  </div>
                </div>
              )
            })}
            {(cat.data?.length ?? 0) === 0 && <div style={{ color: '#a1a1aa', fontSize: 13 }}>Мэдээлэл алга</div>}
          </div>
        </Card>
      </div>

      {/* recent orders + low stock */}
      <div className="r-main2">
        <Card pad={0}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 14px' }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#18181b' }}>Сүүлийн захиалга</div>
            <button onClick={() => nav('/orders')} style={{ border: 0, background: 'none', color: '#18181b', fontWeight: 500, fontSize: 13, cursor: 'pointer' }}>Бүгд →</button>
          </div>
          {(recent.data ?? []).map((o) => {
            const st = ORDER_ST[o.status]
            return (
              <div key={o.id} className="kk-row" onClick={() => nav('/orders')} style={{ display: 'grid', gridTemplateColumns: '64px 1fr 120px 148px', alignItems: 'center', fontSize: 13, padding: '12px 20px', borderTop: '1px solid #f6f6f7', cursor: 'pointer' }}>
                <span style={{ fontWeight: 600, color: '#18181b' }} className="tnum">{o.code}</span>
                <span style={{ color: '#3f3f46', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.customerName}</span>
                <span style={{ textAlign: 'right', fontWeight: 600, color: '#18181b' }} className="tnum">{fmtMNT(o.total)}</span>
                <span style={{ paddingLeft: 16 }}><StatusPill st={st} /></span>
              </div>
            )
          })}
          {(recent.data?.length ?? 0) === 0 && <div style={{ padding: '24px', textAlign: 'center', color: '#a1a1aa', fontSize: 13 }}>Захиалга алга</div>}
        </Card>

        <Card pad={0}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 20px 14px' }}>
            <TriangleAlert size={18} style={{ color: '#f59e0b' }} />
            <div style={{ fontWeight: 600, fontSize: 15, color: '#18181b' }}>Нөөц багатай</div>
            <button onClick={() => nav('/products')} style={{ marginLeft: 'auto', border: 0, background: 'none', color: '#18181b', fontWeight: 500, fontSize: 12.5, cursor: 'pointer' }}>Бараа →</button>
          </div>
          {(low.data ?? []).map((p) => {
            const color = p.stock === 0 ? '#b91c1c' : p.stock < 12 ? '#b45309' : '#3f3f46'
            return (
              <div key={p.id} className="kk-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderTop: '1px solid #f6f6f7' }}>
                <span style={{ width: 36, height: 36, borderRadius: 8, background: '#f4f4f5', color: '#71717a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Box size={19} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#18181b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: '#a1a1aa', marginTop: 1 }}>үлдэгдэл</div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color }} className="tnum">{p.stock} ш</span>
              </div>
            )
          })}
          {(low.data?.length ?? 0) === 0 && <div style={{ padding: '24px', textAlign: 'center', color: '#a1a1aa', fontSize: 13 }}>Бүх бараа хангалттай</div>}
        </Card>
      </div>
    </div>
  )
}
