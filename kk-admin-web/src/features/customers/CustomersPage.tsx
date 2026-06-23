import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil } from 'lucide-react'
import { api, getData, type PageResult } from '../../lib/api'
import { fmtMNT, fmtNum } from '../../lib/format'
import { TIER_TAG } from '../../lib/theme'
import { useSearch } from '../../store/search'
import { toast } from '../../store/ui'
import { KpiSimple } from '../../components/ui/Kpi'
import { Button, IconButton } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Field, Input, Select } from '../../components/ui/Input'
import { TagPill } from '../../components/ui/Pill'
import { Avatar } from '../../components/ui/Avatar'
import { Spinner } from '../../components/ui/Spinner'
import type { Customer } from '../../types'

export default function CustomersPage() {
  const qc = useQueryClient()
  const query = useSearch((s) => s.query).trim().toLowerCase()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)

  const list = useQuery({ queryKey: ['customers'], queryFn: () => getData<PageResult<Customer>>('/customers', { size: 200 }) })
  let rows = list.data?.items ?? []
  const total = list.data?.total ?? rows.length
  const vip = rows.filter((c) => c.tier === 'vip').length
  const fresh = rows.filter((c) => c.tier === 'new').length
  if (query) rows = rows.filter((c) => (c.name + (c.phone ?? '')).toLowerCase().includes(query))

  const save = useMutation({
    mutationFn: (body: Record<string, unknown>) => editing ? api.put(`/customers/${editing.id}`, body) : api.post('/customers', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); toast('Хадгалагдлаа'); setOpen(false) },
    onError: (e) => toast((e as Error).message, 'error'),
  })
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const f = new FormData(e.currentTarget)
    save.mutate({ name: String(f.get('name')), phone: String(f.get('phone') || '') || null, tier: String(f.get('tier')) })
  }

  const GRID = '1.6fr 1.1fr 90px 130px 110px 60px'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="r-kpi3">
        <KpiSimple label="Нийт харилцагч" value={fmtNum(total)} />
        <KpiSimple label="VIP харилцагч" value={fmtNum(vip)} />
        <KpiSimple label="Шинэ харилцагч" value={fmtNum(fresh)} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => { setEditing(null); setOpen(true) }}><Plus size={15} />Харилцагч нэмэх</Button>
      </div>

      <div className="table-wrap">
      <div className="card table-min" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: GRID, fontSize: 11.5, fontWeight: 600, color: '#a1a1aa', padding: '13px 20px', borderBottom: '1px solid #f1f1f3', background: '#fcfcfd' }}>
          <span>Харилцагч</span><span>Утас</span><span style={{ textAlign: 'center' }}>Захиалга</span><span style={{ textAlign: 'right' }}>Нийт дүн</span><span style={{ textAlign: 'center' }}>Төрөл</span><span></span>
        </div>
        {list.isLoading ? <Spinner /> : rows.map((c, i) => (
          <div key={c.id} className="kk-row" style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', fontSize: 13, padding: '14px 20px', borderBottom: '1px solid #f6f6f7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
              <Avatar name={c.name} index={i} />
              <span style={{ color: '#18181b', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
            </div>
            <span style={{ color: '#71717a' }} className="tnum">{c.phone ?? '-'}</span>
            <span style={{ textAlign: 'center', color: '#3f3f46' }} className="tnum">{c.ordersCount ?? 0}</span>
            <span style={{ textAlign: 'right', fontWeight: 600, color: '#18181b' }} className="tnum">{fmtMNT(c.totalSpent)}</span>
            <span style={{ textAlign: 'center' }}><TagPill tag={TIER_TAG[c.tier]} /></span>
            <span style={{ display: 'flex', justifyContent: 'flex-end' }}><IconButton onClick={() => { setEditing(c); setOpen(true) }}><Pencil size={15} /></IconButton></span>
          </div>
        ))}
        {!list.isLoading && rows.length === 0 && <div style={{ padding: '48px 20px', textAlign: 'center', color: '#a1a1aa', fontSize: 13.5 }}>Үр дүн олдсонгүй.</div>}
      </div>
      </div>

      <Modal open={open} title={editing ? 'Харилцагч засах' : 'Харилцагч нэмэх'} onClose={() => setOpen(false)}
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Цуцлах</Button><Button form="cust-form" type="submit" disabled={save.isPending}>Хадгалах</Button></>}>
        <form id="cust-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Нэр"><Input name="name" defaultValue={editing?.name} required /></Field>
          <Field label="Утас"><Input name="phone" defaultValue={editing?.phone ?? ''} /></Field>
          <Field label="Зэрэг"><Select name="tier" defaultValue={editing?.tier ?? 'new'}><option value="new">Шинэ</option><option value="reg">Тогтмол</option><option value="vip">VIP</option></Select></Field>
        </form>
      </Modal>
    </div>
  )
}
