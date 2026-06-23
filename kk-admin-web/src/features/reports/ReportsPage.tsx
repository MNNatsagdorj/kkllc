import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Wallet } from 'lucide-react'
import { getData } from '../../lib/api'
import { fmtMNT, fmtNum } from '../../lib/format'
import { BAR_COLORS, CAT_FILL } from '../../lib/theme'
import { KpiSimple } from '../../components/ui/Kpi'
import { Card, CardHead } from '../../components/ui/Card'
import { BarChart, TwinBars, HBar } from '../../components/ui/Bars'
import { Input } from '../../components/ui/Input'
import { Spinner } from '../../components/ui/Spinner'
import type { DashboardSummary, MonthAmount, NameAmount, ProfitRow, RevCost, TopProduct } from '../../types'

const thisMonth = () => new Date().toISOString().slice(0, 7)

export default function ReportsPage() {
  const [month, setMonth] = useState(thisMonth())

  const summary = useQuery({ queryKey: ['dashboard', 'summary'], queryFn: () => getData<DashboardSummary>('/dashboard/summary') })
  const sales = useQuery({ queryKey: ['reports', 'sales'], queryFn: () => getData<MonthAmount[]>('/reports/sales', { months: 6 }) })
  const top = useQuery({ queryKey: ['reports', 'top'], queryFn: () => getData<TopProduct[]>('/reports/top-products', { limit: 5 }) })
  const cat = useQuery({ queryKey: ['reports', 'cat'], queryFn: () => getData<NameAmount[]>('/reports/category-share') })
  const profit = useQuery({ queryKey: ['reports', 'profit', month], queryFn: () => getData<ProfitRow>('/reports/purchase', { month }) })
  const rvc = useQuery({ queryKey: ['reports', 'rvc'], queryFn: () => getData<RevCost[]>('/reports/revenue-vs-cost', { months: 6 }) })
  const bySup = useQuery({ queryKey: ['reports', 'sup', month], queryFn: () => getData<NameAmount[]>('/reports/spend-by-supplier', { month }) })
  const byMat = useQuery({ queryKey: ['reports', 'mat', month], queryFn: () => getData<NameAmount[]>('/reports/spend-by-material', { month }) })

  const s = summary.data
  const p = profit.data
  const salesBars = (sales.data ?? []).map((m) => ({ label: m.month.slice(5), value: m.amount, display: (m.amount / 1e6).toFixed(1) }))
  const twin = (rvc.data ?? []).map((r) => ({ label: r.month.slice(5), a: r.revenue, b: r.cost }))
  const topMax = Math.max(1, ...(top.data ?? []).map((t) => t.sold))
  const catTotal = Math.max(1, (cat.data ?? []).reduce((a, c) => a + c.amount, 0))
  const supMax = Math.max(1, ...(bySup.data ?? []).map((m) => m.amount))
  const matTotal = Math.max(1, (byMat.data ?? []).reduce((a, c) => a + c.amount, 0))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* sales KPIs */}
      <div className="r-kpi4">
        <KpiSimple label="Нийт орлого (сар)" value={fmtMNT(s?.monthRevenue)} sub={s?.revenueDeltaPct != null ? `${s.revenueDeltaPct >= 0 ? '↑' : '↓'} ${Math.abs(s.revenueDeltaPct)}%` : undefined} subColor="#15803d" />
        <KpiSimple label="Захиалгын тоо" value={fmtNum(s?.ordersCount)} sub={s?.ordersDeltaPct != null ? `${s.ordersDeltaPct >= 0 ? '↑' : '↓'} ${Math.abs(s.ordersDeltaPct)}%` : undefined} subColor="#15803d" />
        <KpiSimple label="Дундаж захиалга" value={fmtMNT(s?.avgOrder)} />
        <KpiSimple label="Шинэ харилцагч" value={fmtNum(s?.newCustomers)} />
      </div>

      <Card>
        <CardHead title="Сарын борлуулалт" sub="Сүүлийн 6 сар · сая ₮" />
        {sales.isLoading ? <Spinner /> : salesBars.length === 0 ? <Empty /> : <BarChart data={salesBars} height={220} />}
      </Card>

      <div className="r-rep2">
        <Card pad={0}>
          <div style={{ padding: '18px 20px 14px', fontWeight: 600, fontSize: 15, color: '#18181b' }}>Шилдэг борлуулалттай бараа</div>
          {(top.data ?? []).map((t, i) => (
            <div key={t.productId} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderTop: '1px solid #f6f6f7' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#a1a1aa', width: 18 }}>{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#18181b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.productName}</div>
                <div style={{ height: 5, background: '#f1f1f3', borderRadius: 3, marginTop: 6, overflow: 'hidden' }}><div style={{ height: '100%', width: `${(t.sold / topMax) * 100}%`, background: '#15396B', borderRadius: 3 }} /></div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#18181b' }} className="tnum">{t.sold}</span>
            </div>
          ))}
          {(top.data?.length ?? 0) === 0 && <div style={{ padding: 20, textAlign: 'center', color: '#a1a1aa', fontSize: 13 }}>Мэдээлэл алга</div>}
        </Card>
        <Card>
          <CardHead title="Ангиллын хувь" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(cat.data ?? []).map((c, i) => {
              const pct = Math.round((c.amount / catTotal) * 100)
              return (
                <div key={c.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}><span style={{ fontSize: 13, color: '#3f3f46' }}>{c.name}</span><span style={{ fontSize: 13, color: '#18181b', fontWeight: 600 }}>{pct}%</span></div>
                  <div style={{ height: 8, background: '#f4f4f5', borderRadius: 5, overflow: 'hidden' }}><div style={{ height: '100%', width: `${pct}%`, background: CAT_FILL[i % CAT_FILL.length], borderRadius: 5 }} /></div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* purchase report */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 0', flexWrap: 'wrap' }}>
        <Wallet size={22} style={{ color: '#15396B' }} />
        <div style={{ fontWeight: 680, fontSize: 18, color: '#18181b' }}>Худалдан авалтын тайлан</div>
        <span style={{ fontSize: 12.5, color: '#a1a1aa' }}>Түүхий эдийн зардал ба ашгийн харьцаа</span>
        <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: 160, height: 36, marginLeft: 'auto' }} />
      </div>

      <div className="r-kpi4">
        <AccentKpi accent="#15396B" label="Борлуулалт" value={fmtMNT(p?.revenue)} sub="Энэ сарын орлого" />
        <AccentKpi accent="#F26C1B" label="Худалдан авалт" value={fmtMNT(p?.cost)} sub="Түүхий эдийн зардал" />
        <AccentKpi accent="#15803d" label="Цэвэр ашиг" value={fmtMNT(p?.grossProfit)} sub={`Маржин ${p?.margin ?? 0}%`} />
        <AccentKpi accent="#71717a" label="Өртгийн харьцаа" value={`${p?.costRatio ?? 0}%`} sub="Орлогод эзлэх" />
      </div>

      <div className="r-rep2">
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#18181b' }}>Орлого ба зардлын харьцуулалт</div>
            <div style={{ display: 'flex', gap: 14 }}>
              <Legend color="#15396B" label="Орлого" /><Legend color="#F26C1B" label="Зардал" />
            </div>
          </div>
          <div style={{ fontSize: 12.5, color: '#a1a1aa', marginBottom: 20 }}>Сүүлийн 6 сар · сая ₮</div>
          {rvc.isLoading ? <Spinner /> : twin.length === 0 ? <Empty /> : <TwinBars data={twin} height={200} />}
        </Card>
        <Card>
          <CardHead title="Нийлүүлэгчээр" sub="Энэ сарын зардал" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {(bySup.data ?? []).map((m, i) => <HBar key={m.name} name={m.name} valueLabel={fmtMNT(m.amount)} pct={(m.amount / supMax) * 100} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
            {(bySup.data?.length ?? 0) === 0 && <div style={{ color: '#a1a1aa', fontSize: 13 }}>Мэдээлэл алга</div>}
          </div>
        </Card>
      </div>

      <Card pad={0}>
        <div style={{ padding: '18px 20px 14px', fontWeight: 600, fontSize: 15, color: '#18181b' }}>Материалаар задаргаа</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 110px', gap: 10, fontSize: 11.5, fontWeight: 600, color: '#a1a1aa', padding: '0 20px 10px', borderBottom: '1px solid #f1f1f3' }}>
          <span>Материал</span><span style={{ textAlign: 'right' }}>Зардал</span><span style={{ textAlign: 'right' }}>Хувь</span>
        </div>
        {(byMat.data ?? []).map((m, i) => (
          <div key={m.name} className="kk-row" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 110px', gap: 10, alignItems: 'center', fontSize: 13, padding: '13px 20px', borderBottom: '1px solid #f6f6f7' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: BAR_COLORS[i % BAR_COLORS.length], flexShrink: 0 }} /><span style={{ color: '#18181b', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</span></span>
            <span style={{ textAlign: 'right', fontWeight: 600, color: '#18181b' }} className="tnum">{fmtMNT(m.amount)}</span>
            <span style={{ textAlign: 'right', color: '#71717a' }} className="tnum">{Math.round((m.amount / matTotal) * 100)}%</span>
          </div>
        ))}
        {(byMat.data?.length ?? 0) === 0 && <div style={{ padding: 20, textAlign: 'center', color: '#a1a1aa', fontSize: 13 }}>Мэдээлэл алга</div>}
      </Card>
    </div>
  )
}

function AccentKpi({ accent, label, value, sub }: { accent: string; label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="card" style={{ padding: 18, borderTop: `3px solid ${accent}` }}>
      <span style={{ fontSize: 13, color: '#71717a' }}>{label}</span>
      <div style={{ fontSize: 24, fontWeight: 680, color: '#18181b', marginTop: 10, letterSpacing: '-.02em' }} className="tnum">{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#a1a1aa', fontWeight: 500, marginTop: 6 }}>{sub}</div>}
    </div>
  )
}
function Legend({ color, label }: { color: string; label: string }) {
  return <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#71717a' }}><span style={{ width: 10, height: 10, borderRadius: 3, background: color }} />{label}</span>
}
function Empty() { return <div style={{ padding: '40px 0', textAlign: 'center', color: '#a1a1aa', fontSize: 13 }}>Мэдээлэл алга</div> }
