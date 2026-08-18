import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Phone, Mail, MapPin } from 'lucide-react'
import { api, getData, type PageResult } from '../../lib/api'
import { fmtMNT, fmtNum, fmtDate } from '../../lib/format'
import { TIER_TAG, TYPE_TAG, ORDER_ST } from '../../lib/theme'
import { useSearch } from '../../store/search'
import { toast } from '../../store/ui'
import { KpiSimple } from '../../components/ui/Kpi'
import { Button, IconButton } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Field, Input, Select, Textarea } from '../../components/ui/Input'
import { TagPill, StatusPill } from '../../components/ui/Pill'
import { Avatar } from '../../components/ui/Avatar'
import { Spinner } from '../../components/ui/Spinner'
import { PinMap } from '../../components/map/PinMap'
import type { Customer, CustomerDetail } from '../../types'

interface Pin { lat: number | null; lng: number | null }

export default function CustomersPage() {
  const qc = useQueryClient()
  const query = useSearch((s) => s.query).trim().toLowerCase()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [pin, setPin] = useState<Pin>({ lat: null, lng: null })
  const [detailId, setDetailId] = useState<number | null>(null)

  const list = useQuery({ queryKey: ['customers'], queryFn: () => getData<PageResult<Customer>>('/customers', { size: 200 }) })
  const detailQ = useQuery({
    queryKey: ['customers', 'detail', detailId],
    queryFn: () => getData<CustomerDetail>(`/customers/${detailId}`),
    enabled: !!detailId,
  })
  let rows = list.data?.items ?? []
  const total = list.data?.total ?? rows.length
  const vip = rows.filter((c) => c.tier === 'vip').length
  const fresh = rows.filter((c) => c.tier === 'new').length
  if (query) rows = rows.filter((c) => (c.name + (c.phone ?? '') + (c.address ?? '')).toLowerCase().includes(query))

  const openEdit = (c: Customer | null) => {
    setEditing(c)
    setPin({ lat: c?.lat ?? null, lng: c?.lng ?? null })
    setOpen(true)
  }

  const save = useMutation({
    mutationFn: (body: Record<string, unknown>) => editing ? api.put(`/customers/${editing.id}`, body) : api.post('/customers', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); toast('Хадгалагдлаа'); setOpen(false) },
    onError: (e) => toast((e as Error).message, 'error'),
  })
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const f = new FormData(e.currentTarget)
    save.mutate({
      name: String(f.get('name')),
      phone: String(f.get('phone') || '') || null,
      tier: String(f.get('tier')),
      type: String(f.get('type')),
      email: String(f.get('email') || '') || null,
      address: String(f.get('address') || '') || null,
      note: String(f.get('note') || '') || null,
      lat: pin.lat,
      lng: pin.lng,
    })
  }

  const d = detailQ.data
  const GRID = '1.6fr 1.1fr 90px 130px 110px 60px'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="r-kpi3">
        <KpiSimple label="Нийт харилцагч" value={fmtNum(total)} />
        <KpiSimple label="VIP харилцагч" value={fmtNum(vip)} />
        <KpiSimple label="Шинэ харилцагч" value={fmtNum(fresh)} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => openEdit(null)}><Plus size={15} />Харилцагч нэмэх</Button>
      </div>

      <div className="table-wrap">
      <div className="card table-min" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: GRID, fontSize: 11.5, fontWeight: 600, color: '#a1a1aa', padding: '13px 20px', borderBottom: '1px solid #f1f1f3', background: '#fcfcfd' }}>
          <span>Харилцагч</span><span>Утас</span><span style={{ textAlign: 'center' }}>Захиалга</span><span style={{ textAlign: 'right' }}>Нийт дүн</span><span style={{ textAlign: 'center' }}>Зэрэг</span><span></span>
        </div>
        {list.isLoading ? <Spinner /> : rows.map((c, i) => (
          <div key={c.id} className="kk-row" onClick={() => setDetailId(c.id)} style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', fontSize: 13, padding: '14px 20px', borderBottom: '1px solid #f6f6f7', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
              <Avatar name={c.name} index={i} />
              <div style={{ minWidth: 0 }}>
                <div style={{ color: '#18181b', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: TYPE_TAG[c.type]?.c ?? '#a1a1aa' }}>{TYPE_TAG[c.type]?.label ?? '-'}</div>
              </div>
            </div>
            <span style={{ color: '#71717a' }} className="tnum">{c.phone ?? '-'}</span>
            <span style={{ textAlign: 'center', color: '#3f3f46' }} className="tnum">{c.ordersCount ?? 0}</span>
            <span style={{ textAlign: 'right', fontWeight: 600, color: '#18181b' }} className="tnum">{fmtMNT(c.totalSpent)}</span>
            <span style={{ textAlign: 'center' }}><TagPill tag={TIER_TAG[c.tier]} /></span>
            <span style={{ display: 'flex', justifyContent: 'flex-end' }}><IconButton onClick={(e) => { e.stopPropagation(); openEdit(c) }}><Pencil size={15} /></IconButton></span>
          </div>
        ))}
        {!list.isLoading && rows.length === 0 && <div style={{ padding: '48px 20px', textAlign: 'center', color: '#a1a1aa', fontSize: 13.5 }}>Үр дүн олдсонгүй.</div>}
      </div>
      </div>

      {/* 등록/수정 */}
      <Modal open={open} title={editing ? 'Харилцагч засах' : 'Харилцагч нэмэх'} onClose={() => setOpen(false)} width={620}
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Цуцлах</Button><Button form="cust-form" type="submit" disabled={save.isPending}>Хадгалах</Button></>}>
        <form id="cust-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="r-eq2">
            <Field label="Нэр"><Input name="name" defaultValue={editing?.name} required /></Field>
            <Field label="Утас"><Input name="phone" defaultValue={editing?.phone ?? ''} /></Field>
          </div>
          <div className="r-eq2">
            <Field label="Төрөл">
              <Select name="type" defaultValue={editing?.type ?? 'individual'}>
                <option value="individual">Хувь хүн</option>
                <option value="business">Бизнес эрхлэгч</option>
                <option value="company">Компани</option>
              </Select>
            </Field>
            <Field label="Зэрэг"><Select name="tier" defaultValue={editing?.tier ?? 'new'}><option value="new">Шинэ</option><option value="reg">Тогтмол</option><option value="vip">VIP</option></Select></Field>
          </div>
          <Field label="И-мэйл"><Input name="email" type="email" defaultValue={editing?.email ?? ''} /></Field>
          <Field label="Хаяг / байршлын тайлбар"><Input name="address" defaultValue={editing?.address ?? ''} placeholder="Ж: ХУД, 3-р хороо, Маршалын гүүрний баруун талд" /></Field>
          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#3f3f46', marginBottom: 7 }}>Байршил (газрын зураг дээр дарж тэмдэглэнэ)</span>
            <PinMap lat={pin.lat} lng={pin.lng} onChange={(lat, lng) => setPin({ lat, lng })} />
          </div>
          <Field label="Тэмдэглэл"><Textarea name="note" rows={2} defaultValue={editing?.note ?? ''} /></Field>
        </form>
      </Modal>

      {/* 상세 */}
      <Modal open={!!detailId} title={d ? d.customer.name : 'Харилцагч'} onClose={() => setDetailId(null)} width={620}
        footer={<><Button variant="secondary" onClick={() => setDetailId(null)}>Хаах</Button>{d && <Button onClick={() => { setDetailId(null); openEdit(d.customer) }}><Pencil size={14} />Засах</Button>}</>}>
        {!d ? <Spinner /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={d.customer.name} index={0} size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#18181b' }}>{d.customer.name}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
                  <TagPill tag={TYPE_TAG[d.customer.type] ?? TYPE_TAG.individual} />
                  <TagPill tag={TIER_TAG[d.customer.tier]} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11.5, color: '#a1a1aa' }}>Нийт худалдан авалт</div>
                <div style={{ fontWeight: 680, fontSize: 17, color: '#18181b' }} className="tnum">{fmtMNT(d.customer.totalSpent)}</div>
                <div style={{ fontSize: 11.5, color: '#a1a1aa', marginTop: 2 }} className="tnum">{d.customer.ordersCount ?? 0} захиалга</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5, color: '#3f3f46' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={14} color="#a1a1aa" /><span className="tnum">{d.customer.phone || '-'}</span></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={14} color="#a1a1aa" />{d.customer.email || '-'}</span>
              <span style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}><MapPin size={14} color="#a1a1aa" style={{ marginTop: 2, flexShrink: 0 }} />{d.customer.address || '-'}</span>
            </div>

            {d.customer.lat != null && d.customer.lng != null && (
              <PinMap lat={d.customer.lat} lng={d.customer.lng} height={200} />
            )}

            {d.customer.note && (
              <div style={{ padding: '11px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, fontSize: 13, color: '#92400e', lineHeight: 1.5 }}>{d.customer.note}</div>
            )}

            <div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: '#a1a1aa', letterSpacing: '.04em', marginBottom: 8 }}>СҮҮЛИЙН ЗАХИАЛГУУД</div>
              {d.recentOrders.length === 0 ? (
                <div style={{ fontSize: 13, color: '#a1a1aa' }}>Захиалга байхгүй.</div>
              ) : (
                <div style={{ border: '1px solid #f1f1f3', borderRadius: 11, overflow: 'hidden' }}>
                  {d.recentOrders.map((o, i) => (
                    <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 100px 110px', gap: 10, alignItems: 'center', padding: '10px 14px', borderBottom: i < d.recentOrders.length - 1 ? '1px solid #f6f6f7' : 'none', fontSize: 13 }}>
                      <span style={{ fontWeight: 600, color: '#18181b' }} className="tnum">{o.code}</span>
                      <span style={{ color: '#a1a1aa', fontSize: 12.5 }}>{fmtDate(o.orderedAt)}</span>
                      <span style={{ textAlign: 'right', fontWeight: 600, color: '#18181b' }} className="tnum">{fmtMNT(o.total)}</span>
                      <span style={{ textAlign: 'right' }}><StatusPill st={ORDER_ST[o.status]} /></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
