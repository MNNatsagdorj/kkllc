import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { api, getData, type PageResult } from '../../lib/api'
import { fmtMNT, fmtM, fmtNum } from '../../lib/format'
import { PAY_ST, BAR_COLORS } from '../../lib/theme'
import { toast } from '../../store/ui'
import { KpiSimple } from '../../components/ui/Kpi'
import { Card, CardHead } from '../../components/ui/Card'
import { HBar } from '../../components/ui/Bars'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Field, Input, Select } from '../../components/ui/Input'
import { StatusPill } from '../../components/ui/Pill'
import { Spinner } from '../../components/ui/Spinner'
import type { Material, NameAmount, Purchase, PurchaseSummary, Supplier } from '../../types'

const thisMonth = () => new Date().toISOString().slice(0, 7)

export default function PurchasesPage() {
  const qc = useQueryClient()
  const [month, setMonth] = useState(thisMonth())
  const [pay, setPay] = useState('')
  const [open, setOpen] = useState(false)
  const [matId, setMatId] = useState(0)
  const [qty, setQty] = useState(0)
  const [unitPrice, setUnitPrice] = useState(0)

  const list = useQuery({ queryKey: ['purchases', month, pay], queryFn: () => getData<PageResult<Purchase>>('/purchases', { month, payStatus: pay || undefined, size: 100 }) })
  const summary = useQuery({ queryKey: ['purchases-sum', month], queryFn: () => getData<PurchaseSummary>('/purchases/summary', { month }) })
  const byMat = useQuery({ queryKey: ['spend-mat', month], queryFn: () => getData<NameAmount[]>('/reports/spend-by-material', { month }) })
  const bySup = useQuery({ queryKey: ['spend-sup', month], queryFn: () => getData<NameAmount[]>('/reports/spend-by-supplier', { month }) })
  const materials = useQuery({ queryKey: ['materials'], queryFn: () => getData<Material[]>('/materials') })
  const suppliers = useQuery({ queryKey: ['suppliers'], queryFn: () => getData<Supplier[]>('/suppliers') })

  const create = useMutation({
    mutationFn: (body: Record<string, unknown>) => api.post('/purchases', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['purchases'] }); qc.invalidateQueries({ queryKey: ['purchases-sum'] }); qc.invalidateQueries({ queryKey: ['spend-mat'] }); qc.invalidateQueries({ queryKey: ['spend-sup'] }); qc.invalidateQueries({ queryKey: ['reports'] }); toast('Худалдан авалт бүртгэгдлээ'); setOpen(false) },
    onError: (e) => toast((e as Error).message, 'error'),
  })
  const setPaid = useMutation({
    mutationFn: ({ id, payStatus }: { id: number; payStatus: string }) => api.patch(`/purchases/${id}/pay-status`, { payStatus }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['purchases'] }); qc.invalidateQueries({ queryKey: ['purchases-sum'] }); toast('Шинэчлэгдлээ') },
    onError: (e) => toast((e as Error).message, 'error'),
  })
  const del = useMutation({
    mutationFn: (id: number) => api.delete(`/purchases/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['purchases'] }); qc.invalidateQueries({ queryKey: ['purchases-sum'] }); toast('Устгагдлаа') },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  const onMat = (id: number) => { setMatId(id); const m = materials.data?.find((x) => x.id === id); if (m) setUnitPrice(m.defaultPrice) }
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const f = new FormData(e.currentTarget)
    create.mutate({ purchaseDate: String(f.get('purchaseDate')), materialId: matId, supplierName: String(f.get('supplierName') || '') || null, qty, unitPrice, payStatus: String(f.get('payStatus')) })
  }
  const matMax = Math.max(1, ...(byMat.data ?? []).map((m) => m.amount))
  const supMax = Math.max(1, ...(bySup.data ?? []).map((m) => m.amount))
  const GRID = '70px 1.3fr 1.3fr 110px 100px 130px 120px 40px'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 13, color: '#71717a' }}>Түүхий эд, материалын худалдан авалт</div>
        <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: 160, height: 38, marginLeft: 'auto' }} />
        <Select value={pay} onChange={(e) => setPay(e.target.value)} style={{ width: 150, height: 38 }}>
          <option value="">Бүх төлбөр</option><option value="paid">Төлсөн</option><option value="pending">Төлөгдөөгүй</option>
        </Select>
        <Button onClick={() => { setOpen(true); setMatId(0); setQty(0); setUnitPrice(0) }}><Plus size={15} />Худалдан авалт</Button>
      </div>

      <div className="r-kpi4">
        <KpiSimple label="Энэ сарын зардал" value={fmtM(summary.data?.monthTotal)} sub="Нийт худалдан авалт" />
        <KpiSimple label="Худалдан авалтын тоо" value={fmtNum(summary.data?.cnt)} sub="Энэ сар" />
        <KpiSimple label="Төлөгдөөгүй үлдэгдэл" value={fmtM(summary.data?.unpaid)} sub="Төлбөр хүлээгдэж буй" subColor="#b45309" />
        <KpiSimple label="Дундаж зардал" value={fmtMNT(summary.data?.avg)} sub="1 худалдан авалтад" />
      </div>

      <div className="r-eq2">
        <Card>
          <CardHead title="Материалын зардал" sub="Энэ сар" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {(byMat.data ?? []).map((m, i) => <HBar key={m.name} name={m.name} valueLabel={fmtMNT(m.amount)} pct={(m.amount / matMax) * 100} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
            {(byMat.data?.length ?? 0) === 0 && <div style={{ color: '#a1a1aa', fontSize: 13 }}>Мэдээлэл алга</div>}
          </div>
        </Card>
        <Card>
          <CardHead title="Нийлүүлэгчээр" sub="Энэ сарын зардал" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {(bySup.data ?? []).map((m, i) => <HBar key={m.name} name={m.name} valueLabel={fmtMNT(m.amount)} pct={(m.amount / supMax) * 100} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
            {(bySup.data?.length ?? 0) === 0 && <div style={{ color: '#a1a1aa', fontSize: 13 }}>Мэдээлэл алга</div>}
          </div>
        </Card>
      </div>

      <div className="table-wrap">
      <div className="card table-min" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: 10, fontSize: 11.5, fontWeight: 600, color: '#a1a1aa', padding: '13px 20px', borderBottom: '1px solid #f1f1f3', background: '#fcfcfd' }}>
          <span>Огноо</span><span>Материал</span><span>Нийлүүлэгч</span><span style={{ textAlign: 'right' }}>Тоо хэмжээ</span><span style={{ textAlign: 'right' }}>Нэгж үнэ</span><span style={{ textAlign: 'right' }}>Нийт дүн</span><span style={{ paddingLeft: 12 }}>Төлөв</span><span></span>
        </div>
        {list.isLoading ? <Spinner /> : (list.data?.items ?? []).map((p) => (
          <div key={p.id} className="kk-row" style={{ display: 'grid', gridTemplateColumns: GRID, gap: 10, alignItems: 'center', fontSize: 13, padding: '14px 20px', borderBottom: '1px solid #f6f6f7' }}>
            <span style={{ color: '#a1a1aa', fontSize: 12.5 }}>{p.purchaseDate.slice(5)}</span>
            <span style={{ fontWeight: 500, color: '#18181b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.materialName}</span>
            <span style={{ color: '#71717a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.supplierName ?? '-'}</span>
            <span style={{ textAlign: 'right', color: '#3f3f46' }} className="tnum">{fmtNum(p.qty)} {p.unit}</span>
            <span style={{ textAlign: 'right', color: '#3f3f46' }} className="tnum">{fmtMNT(p.unitPrice)}</span>
            <span style={{ textAlign: 'right', fontWeight: 600, color: '#18181b' }} className="tnum">{fmtMNT(p.total)}</span>
            <span style={{ paddingLeft: 12, cursor: 'pointer' }} onClick={() => setPaid.mutate({ id: p.id, payStatus: p.payStatus === 'paid' ? 'pending' : 'paid' })}><StatusPill st={PAY_ST[p.payStatus]} /></span>
            <span style={{ textAlign: 'right' }}><button onClick={() => { if (confirm('Устгах уу?')) del.mutate(p.id) }} style={{ border: 0, background: 'none', color: '#c4c4cc', cursor: 'pointer', display: 'flex' }}><Trash2 size={16} /></button></span>
          </div>
        ))}
        {!list.isLoading && (list.data?.items.length ?? 0) === 0 && <div style={{ padding: '48px 20px', textAlign: 'center', color: '#a1a1aa', fontSize: 13.5 }}>Үр дүн олдсонгүй.</div>}
      </div>
      </div>

      <Modal open={open} title="Худалдан авалт бүртгэх" onClose={() => setOpen(false)}
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Цуцлах</Button><Button form="pur-form" type="submit" disabled={create.isPending}>Бүртгэх</Button></>}>
        <form id="pur-form" onSubmit={submit} className="r-eq2">
          <Field label="Материал" span2>
            <Select value={matId} onChange={(e) => onMat(Number(e.target.value))} required>
              <option value={0} disabled>— сонгох —</option>
              {(materials.data ?? []).map((m) => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
            </Select>
          </Field>
          <Field label="Нийлүүлэгч" span2>
            <Input name="supplierName" list="sup-list" placeholder="Ж: Дархан гипс ХХК" />
            <datalist id="sup-list">{(suppliers.data ?? []).map((s) => <option key={s.id} value={s.name} />)}</datalist>
          </Field>
          <Field label="Тоо хэмжээ"><Input type="number" step="0.01" value={qty || ''} onChange={(e) => setQty(Number(e.target.value))} placeholder="5000" required /></Field>
          <Field label="Нэгж үнэ (₮)"><Input type="number" value={unitPrice || ''} onChange={(e) => setUnitPrice(Number(e.target.value))} placeholder="800" required /></Field>
          <Field label="Огноо"><Input name="purchaseDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required /></Field>
          <Field label="Төлбөрийн төлөв"><Select name="payStatus" defaultValue="paid"><option value="paid">Төлсөн</option><option value="pending">Төлөгдөөгүй</option></Select></Field>
          <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8f9fb', border: '1px solid #f1f1f3', borderRadius: 11, padding: '14px 16px' }}>
            <span style={{ fontSize: 13, color: '#71717a' }}>Нийт дүн</span>
            <span style={{ fontSize: 20, fontWeight: 680, color: '#15396B' }}>{fmtMNT(Math.round(qty * unitPrice))}</span>
          </div>
        </form>
      </Modal>
    </div>
  )
}
