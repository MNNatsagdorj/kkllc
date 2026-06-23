import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { api, getData } from '../../lib/api'
import { toast } from '../../store/ui'
import { Button, IconButton } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Field, Input } from '../../components/ui/Input'
import { CatIcon, ICON_KEYS } from '../../components/ui/CatIcon'
import { Spinner } from '../../components/ui/Spinner'
import type { Category } from '../../types'

export default function CategoriesPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['categories'], queryFn: () => getData<Category[]>('/categories') })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [iconKey, setIconKey] = useState('box')

  const save = useMutation({
    mutationFn: (body: Partial<Category>) => editing ? api.put(`/categories/${editing.id}`, body) : api.post('/categories', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); toast('Хадгалагдлаа'); setOpen(false) },
    onError: (e) => toast((e as Error).message, 'error'),
  })
  const del = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); toast('Устгагдлаа') },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  const openNew = () => { setEditing(null); setName(''); setIconKey('box'); setOpen(true) }
  const openEdit = (c: Category) => { setEditing(c); setName(c.name); setIconKey(c.iconKey); setOpen(true) }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: '#71717a' }}>{data?.length ?? 0} ангилал</div>
        <Button style={{ marginLeft: 'auto' }} onClick={openNew}><Plus size={15} />Ангилал нэмэх</Button>
      </div>

      {isLoading ? <Spinner /> : (
        <div className="r-cats">
          {(data ?? []).map((c) => (
            <div key={c.id} className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 48, height: 48, borderRadius: 11, background: '#f4f4f5', color: '#15396B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CatIcon iconKey={c.iconKey} size={24} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#18181b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                <div style={{ fontSize: 12.5, color: '#a1a1aa', marginTop: 2 }}>{c.productCount ?? 0} бараа</div>
              </div>
              <IconButton onClick={() => openEdit(c)}><Pencil size={16} /></IconButton>
              <IconButton danger onClick={() => { if (confirm('Устгах уу?')) del.mutate(c.id) }}><Trash2 size={16} /></IconButton>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} title={editing ? 'Ангилал засах' : 'Ангилал нэмэх'} onClose={() => setOpen(false)}
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Цуцлах</Button><Button disabled={save.isPending} onClick={() => save.mutate({ name, iconKey })}>Хадгалах</Button></>}>
        <Field label="Ангиллын нэр"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ж: Дотор замаск" /></Field>
        <div style={{ marginTop: 18 }}>
          <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#3f3f46', marginBottom: 9 }}>Дүрс</span>
          <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
            {ICON_KEYS.map((k) => {
              const sel = k === iconKey
              return (
                <button key={k} onClick={() => setIconKey(k)} style={{ width: 46, height: 46, borderRadius: 11, border: `1px solid ${sel ? '#18181b' : '#ececef'}`, background: sel ? '#18181b' : '#fff', color: sel ? '#fff' : '#71717a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <CatIcon iconKey={k} size={23} />
                </button>
              )
            })}
          </div>
        </div>
      </Modal>
    </div>
  )
}
