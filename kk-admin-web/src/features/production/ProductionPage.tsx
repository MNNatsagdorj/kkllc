import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar } from 'lucide-react'
import { api, getData, type PageResult } from '../../lib/api'
import { toast } from '../../store/ui'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Field, Input, Select } from '../../components/ui/Input'
import { Spinner } from '../../components/ui/Spinner'
import type { Product, ProductionLog, ProductionMonth } from '../../types'

const WD = ['Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя', 'Ня']
const todayStr = () => new Date().toISOString().slice(0, 10)

export default function ProductionPage() {
  const qc = useQueryClient()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [selected, setSelected] = useState(todayStr())
  const [open, setOpen] = useState(false)

  const monthData = useQuery({ queryKey: ['production', year, month], queryFn: () => getData<ProductionMonth>('/production', { year, month }) })
  const dayData = useQuery({ queryKey: ['production-day', selected], queryFn: () => getData<ProductionLog[]>('/production', { date: selected }) })
  const products = useQuery({ queryKey: ['products', 'all'], queryFn: () => getData<PageResult<Product>>('/products', { size: 100 }) })

  const create = useMutation({
    mutationFn: (body: Record<string, unknown>) => api.post('/production', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['production'] }); qc.invalidateQueries({ queryKey: ['production-day'] }); qc.invalidateQueries({ queryKey: ['products'] }); toast('Үйлдвэрлэл бүртгэгдлээ'); setOpen(false) },
    onError: (e) => toast((e as Error).message, 'error'),
  })
  const del = useMutation({
    mutationFn: (id: number) => api.delete(`/production/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['production'] }); qc.invalidateQueries({ queryKey: ['production-day'] }); qc.invalidateQueries({ queryKey: ['products'] }); toast('Устгагдлаа') },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  const prev = () => { if (month === 1) { setMonth(12); setYear((y) => y - 1) } else setMonth((m) => m - 1) }
  const next = () => { if (month === 12) { setMonth(1); setYear((y) => y + 1) } else setMonth((m) => m + 1) }

  const startOffset = (new Date(year, month - 1, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month, 0).getDate()
  const dayMap = new Map((monthData.data?.days ?? []).map((d) => [d.date, d.total]))
  const cells: (number | null)[] = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const dstr = (d: number) => `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const dayTotal = (dayData.data ?? []).reduce((a, b) => a + b.qty, 0)

  return (
    <div className="r-split-prod">
      {/* calendar */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#18181b' }}>{year} оны {month}-р сар</div>
            <div style={{ fontSize: 12.5, color: '#a1a1aa', marginTop: 2 }}>Энэ сард нийт {monthData.data?.monthTotal ?? 0} ш үйлдвэрлэсэн</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={prev} className="kk-navbtn" style={navBtn}><ChevronLeft size={18} /></button>
            <button onClick={next} className="kk-navbtn" style={navBtn}><ChevronRight size={18} /></button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8, marginBottom: 8 }}>
          {WD.map((w) => <div key={w} style={{ textAlign: 'center', fontSize: 11.5, fontWeight: 600, color: '#a1a1aa' }}>{w}</div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8 }}>
          {cells.map((d, i) => {
            if (d === null) return <div key={i} />
            const ds = dstr(d)
            const total = dayMap.get(ds)
            const isToday = ds === todayStr()
            const isSel = ds === selected
            return (
              <button key={i} onClick={() => setSelected(ds)} style={{
                textAlign: 'left', borderRadius: 10, minHeight: 76, padding: '8px 9px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6,
                background: isSel ? '#f4f4f5' : '#fff',
                border: isSel ? '1.5px solid #18181b' : isToday ? '1px solid #15396B' : '1px solid #f1f1f3',
              }}>
                <span style={{ fontSize: 13, fontWeight: (isToday || isSel) ? 700 : 500, color: isToday ? '#15396B' : '#3f3f46' }}>{d}</span>
                {total != null && <span style={{ fontSize: 11, fontWeight: 600, color: '#15396B', background: '#eef3fa', padding: '2px 7px', borderRadius: 8, alignSelf: 'flex-start' }}>{total} ш</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* day panel */}
      <div className="card r-split-prod-panel" style={{ padding: 0, overflow: 'hidden', position: 'sticky', top: 0 }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #f1f1f3', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#18181b' }}>{selected}</div>
            <div style={{ fontSize: 12, color: '#a1a1aa', marginTop: 2 }}>Өдрийн үйлдвэрлэл</div>
          </div>
          <button onClick={() => setOpen(true)} style={{ border: 0, background: '#18181b', color: '#fff', width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus size={16} /></button>
        </div>
        {dayData.isLoading ? <Spinner /> : (dayData.data?.length ?? 0) === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: '50%', background: '#f4f4f5', color: '#c4c4cc', marginBottom: 12 }}><Calendar size={26} /></span>
            <div style={{ fontSize: 13.5, color: '#71717a' }}>Энэ өдөр бүртгэл алга.</div>
            <Button variant="secondary" style={{ marginTop: 14 }} onClick={() => setOpen(true)}>+ Үйлдвэрлэл бүртгэх</Button>
          </div>
        ) : (
          <div>
            {(dayData.data ?? []).map((l) => (
              <div key={l.id} className="kk-row" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 20px', borderBottom: '1px solid #f6f6f7' }}>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 500, color: '#18181b' }}>{l.productName}</div>{l.note && <div style={{ fontSize: 11.5, color: '#a1a1aa' }}>{l.note}</div>}</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#15396B' }} className="tnum">{l.qty} ш</span>
                <button onClick={() => { if (confirm('Устгах уу?')) del.mutate(l.id) }} style={{ border: 0, background: 'none', color: '#c4c4cc', cursor: 'pointer', display: 'flex' }}><Trash2 size={16} /></button>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: '#fafafa' }}>
              <span style={{ fontSize: 13, color: '#71717a' }}>Нийт</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#18181b' }}>{dayTotal} ш</span>
            </div>
          </div>
        )}
      </div>

      <Modal open={open} title="Үйлдвэрлэл бүртгэх" onClose={() => setOpen(false)}
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Цуцлах</Button><Button form="prod-reg" type="submit" disabled={create.isPending}>Бүртгэх</Button></>}>
        <form id="prod-reg" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); create.mutate({ prodDate: selected, productId: Number(f.get('productId')), qty: Number(f.get('qty')), note: String(f.get('note') || '') || null }) }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Огноо"><Input value={selected} disabled style={{ color: '#71717a', background: '#fafafa' }} /></Field>
          <Field label="Бараа">
            <Select name="productId" required defaultValue="">
              <option value="" disabled>— сонгох —</option>
              {(products.data?.items ?? []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </Field>
          <Field label="Тоо хэмжээ (ширхэг)"><Input name="qty" type="number" defaultValue={44} required /></Field>
          <div style={{ fontSize: 12, color: '#a1a1aa', marginTop: -8 }}>Нэг өдрийн дундаж үйлдвэрлэл ~44 ширхэг.</div>
        </form>
      </Modal>
    </div>
  )
}

const navBtn: React.CSSProperties = { border: '1px solid #ececef', background: '#fff', width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3f3f46', cursor: 'pointer' }
