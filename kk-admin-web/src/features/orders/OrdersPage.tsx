import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { api, getData, type PageResult } from '../../lib/api'
import { fmtMNT, fmtDate } from '../../lib/format'
import { ORDER_ST, SOURCE_LABEL } from '../../lib/theme'
import { useSearch } from '../../store/search'
import { toast } from '../../store/ui'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Field, Input, Select, Textarea } from '../../components/ui/Input'
import { StatusPill } from '../../components/ui/Pill'
import { Avatar } from '../../components/ui/Avatar'
import { Spinner } from '../../components/ui/Spinner'
import type { Product, SalesOrder } from '../../types'

const TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'Бүгд' },
  { key: 'pending', label: 'Хүлээгдэж буй' },
  { key: 'shipping', label: 'Хүргэгдэж буй' },
  { key: 'delivered', label: 'Хүргэгдсэн' },
]
interface Line { productId: number; qty: number }

export default function OrdersPage() {
  const qc = useQueryClient()
  const query = useSearch((s) => s.query).trim().toLowerCase()
  const [tab, setTab] = useState('all')
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<SalesOrder | null>(null)
  const [lines, setLines] = useState<Line[]>([{ productId: 0, qty: 1 }])

  const orders = useQuery({ queryKey: ['orders'], queryFn: () => getData<PageResult<SalesOrder>>('/orders', { size: 200 }) })
  const products = useQuery({ queryKey: ['products', 'all'], queryFn: () => getData<PageResult<Product>>('/products', { size: 100 }) })
  const prodList = products.data?.items ?? []
  const all = orders.data?.items ?? []
  const counts = (k: string) => (k === 'all' ? all.length : all.filter((o) => o.status === k).length)

  let rows = all
  if (tab !== 'all') rows = rows.filter((o) => o.status === tab)
  if (query) rows = rows.filter((o) => (o.code + o.customerName + (o.itemsSummary ?? '') + (o.phone ?? '')).toLowerCase().includes(query))

  const create = useMutation({
    mutationFn: (body: Record<string, unknown>) => api.post('/orders', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); toast('Захиалга үүсгэгдлээ'); setOpen(false); setLines([{ productId: 0, qty: 1 }]) },
    onError: (e) => toast((e as Error).message, 'error'),
  })
  const changeStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => api.patch(`/orders/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); qc.invalidateQueries({ queryKey: ['products'] }); toast('Төлөв шинэчлэгдлээ'); setDetail(null) },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  const total = lines.reduce((sum, l) => { const p = prodList.find((x) => x.id === l.productId); return sum + (p ? p.price * l.qty : 0) }, 0)

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const items = lines.filter((l) => l.productId > 0 && l.qty > 0)
    if (items.length === 0) { toast('Дор хаяж нэг бараа сонгоно уу', 'error'); return }
    create.mutate({ customerName: String(f.get('customerName')), phone: String(f.get('phone') || '') || null, note: String(f.get('note') || '') || null, items })
  }

  const GRID = '78px 1.5fr 1.5fr 100px 64px 116px'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {TABS.map((t) => {
          const active = tab === t.key
          return (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ border: `1px solid ${active ? '#18181b' : '#ececef'}`, background: active ? '#18181b' : '#fff', color: active ? '#fff' : '#3f3f46', fontWeight: 500, fontSize: 13, padding: '7px 14px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
              {t.label}
              <span style={{ background: active ? 'rgba(255,255,255,.18)' : '#f4f4f5', color: active ? '#fff' : '#71717a', fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 10 }}>{counts(t.key)}</span>
            </button>
          )
        })}
        <Button style={{ marginLeft: 'auto' }} onClick={() => setOpen(true)}><Plus size={15} />Шинэ захиалга</Button>
      </div>

      <div className="table-wrap">
      <div className="card table-min" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: 12, fontSize: 11.5, fontWeight: 600, color: '#a1a1aa', padding: '13px 20px', borderBottom: '1px solid #f1f1f3', background: '#fcfcfd' }}>
          <span>Код</span><span>Харилцагч</span><span>Бараа</span><span style={{ textAlign: 'right' }}>Дүн</span><span style={{ textAlign: 'center' }}>Огноо</span><span style={{ textAlign: 'right' }}>Төлөв</span>
        </div>
        {orders.isLoading ? <Spinner /> : rows.map((o, i) => (
          <div key={o.id} className="kk-row" onClick={() => setDetail(o)} style={{ display: 'grid', gridTemplateColumns: GRID, gap: 12, alignItems: 'center', fontSize: 13, padding: '14px 20px', borderBottom: '1px solid #f6f6f7', cursor: 'pointer' }}>
            <span style={{ fontWeight: 600, color: '#18181b' }} className="tnum">{o.code}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0, overflow: 'hidden' }}>
              <Avatar name={o.customerName} index={i} size={30} />
              <div style={{ minWidth: 0 }}>
                <div style={{ color: '#18181b', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.customerName}</div>
                <div style={{ fontSize: 11.5, color: '#a1a1aa' }}>{o.phone}</div>
              </div>
            </div>
            <span style={{ color: '#71717a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{o.itemsSummary}</span>
            <span style={{ textAlign: 'right', fontWeight: 600, color: '#18181b' }} className="tnum">{fmtMNT(o.total)}</span>
            <span style={{ textAlign: 'center', color: '#a1a1aa', fontSize: 12.5 }}>{fmtDate(o.orderedAt).slice(5)}</span>
            <span style={{ textAlign: 'right' }}><StatusPill st={ORDER_ST[o.status]} /></span>
          </div>
        ))}
        {!orders.isLoading && rows.length === 0 && <div style={{ padding: '48px 20px', textAlign: 'center', color: '#a1a1aa', fontSize: 13.5 }}>Үр дүн олдсонгүй.</div>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', fontSize: 12.5, color: '#a1a1aa' }}>
          <span>Нийт {rows.length} захиалга</span>
        </div>
      </div>
      </div>

      {/* 신규 주문 */}
      <Modal open={open} title="Шинэ захиалга" onClose={() => setOpen(false)} width={620}
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Цуцлах</Button><Button form="ord-form" type="submit" disabled={create.isPending}>Захиалга үүсгэх</Button></>}>
        <form id="ord-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="r-eq2">
            <Field label="Харилцагчийн нэр"><Input name="customerName" placeholder="Ж: Б. Болдбаатар" required /></Field>
            <Field label="Утас"><Input name="phone" placeholder="9900-0000" /></Field>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#3f3f46', marginBottom: 7 }}>Бараа</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lines.map((l, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <Select value={l.productId} onChange={(e) => setLines((ls) => ls.map((x, j) => j === i ? { ...x, productId: Number(e.target.value) } : x))} style={{ flex: 1 }}>
                    <option value={0}>— сонгох —</option>
                    {prodList.map((p) => <option key={p.id} value={p.id}>{p.name} ({fmtMNT(p.price)})</option>)}
                  </Select>
                  <Input type="number" min={1} value={l.qty} style={{ width: 80 }} onChange={(e) => setLines((ls) => ls.map((x, j) => j === i ? { ...x, qty: Number(e.target.value) } : x))} />
                  <button type="button" onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))} style={{ border: 0, background: 'none', color: '#c4c4cc', cursor: 'pointer', width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={() => setLines((ls) => [...ls, { productId: 0, qty: 1 }])} style={{ alignSelf: 'flex-start' }}><Plus size={15} />Мөр нэмэх</Button>
            </div>
          </div>
          <Field label="Тэмдэглэл"><Textarea name="note" rows={2} /></Field>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#18181b', borderRadius: 11, padding: '14px 16px' }}>
            <span style={{ fontSize: 13, color: '#a1a1aa' }}>Нийт дүн</span>
            <span style={{ fontSize: 20, fontWeight: 680, color: '#fff' }}>{fmtMNT(total)}</span>
          </div>
        </form>
      </Modal>

      {/* 상세 + 상태변경 */}
      <Modal open={!!detail} title={detail ? `Захиалга ${detail.code}` : ''} onClose={() => setDetail(null)}
        footer={<Button variant="secondary" onClick={() => setDetail(null)}>Хаах</Button>}>
        {detail && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 18, borderBottom: '1px solid #f1f1f3', marginBottom: 18 }}>
              <Avatar name={detail.customerName} index={0} size={42} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#18181b' }}>{detail.customerName}</div>
                <div style={{ fontSize: 12.5, color: '#a1a1aa', marginTop: 2 }}>{detail.phone || '-'} · {fmtDate(detail.orderedAt)} · {SOURCE_LABEL[detail.source]}</div>
              </div>
              <StatusPill st={ORDER_ST[detail.status]} />
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: '#a1a1aa', letterSpacing: '.04em', marginBottom: 10 }}>БАРАА</div>
            <div style={{ background: '#f8f9fb', border: '1px solid #f1f1f3', borderRadius: 11, padding: '14px 16px', fontSize: 14, color: '#3f3f46', lineHeight: 1.55 }}>{detail.itemsSummary || '-'}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, padding: '14px 16px', background: '#18181b', borderRadius: 11 }}>
              <span style={{ fontSize: 13, color: '#a1a1aa' }}>Нийт дүн</span>
              <span style={{ fontSize: 20, fontWeight: 680, color: '#fff' }}>{fmtMNT(detail.total)}</span>
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: '#a1a1aa', letterSpacing: '.04em', margin: '20px 0 10px' }}>ТӨЛӨВ ШИНЭЧЛЭХ</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {detail.status === 'pending' && <StatusBtn st="shipping" onClick={() => changeStatus.mutate({ id: detail.id, status: 'shipping' })} />}
              {(detail.status === 'pending' || detail.status === 'shipping') && <StatusBtn st="delivered" onClick={() => changeStatus.mutate({ id: detail.id, status: 'delivered' })} />}
              {detail.status !== 'canceled' && <StatusBtn st="canceled" onClick={() => changeStatus.mutate({ id: detail.id, status: 'canceled' })} />}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function StatusBtn({ st, onClick }: { st: keyof typeof ORDER_ST; onClick: () => void }) {
  const s = ORDER_ST[st]
  return (
    <button onClick={onClick} style={{ border: `1px solid ${s.bg}`, background: s.bg, color: s.c, fontWeight: 500, fontSize: 12.5, padding: '7px 13px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />{s.label}
    </button>
  )
}
