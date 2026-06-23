import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil } from 'lucide-react'
import { api, getData, type PageResult } from '../../lib/api'
import { fmtMNT } from '../../lib/format'
import { PRODUCT_ST } from '../../lib/theme'
import { useSearch } from '../../store/search'
import { toast } from '../../store/ui'
import { Button, IconButton } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Field, Input, Select } from '../../components/ui/Input'
import { StatusPill } from '../../components/ui/Pill'
import { CatIcon } from '../../components/ui/CatIcon'
import { Spinner } from '../../components/ui/Spinner'
import type { Category, Product } from '../../types'

export default function ProductsPage() {
  const qc = useQueryClient()
  const query = useSearch((s) => s.query).trim().toLowerCase()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const cats = useQuery({ queryKey: ['categories'], queryFn: () => getData<Category[]>('/categories') })
  const products = useQuery({ queryKey: ['products', 'list'], queryFn: () => getData<PageResult<Product>>('/products', { size: 200 }) })
  const catOf = (id: number) => cats.data?.find((c) => c.id === id)

  let rows = products.data?.items ?? []
  if (query) rows = rows.filter((p) => (p.name + p.sku + (p.categoryName ?? '') + (p.brand ?? '')).toLowerCase().includes(query))

  const save = useMutation({
    mutationFn: async (body: { product: Record<string, unknown>; stock?: number; id?: number }) => {
      if (body.id) {
        await api.put(`/products/${body.id}`, body.product)
        if (body.stock != null) await api.patch(`/products/${body.id}/stock`, { setTo: body.stock })
      } else {
        await api.post('/products', body.product)
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); toast('Хадгалагдлаа'); setOpen(false) },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const stock = Number(f.get('stock') || 0)
    const product = {
      name: String(f.get('name')),
      brand: String(f.get('brand') || '') || null,
      categoryId: Number(f.get('categoryId')),
      price: Number(f.get('price')),
      stock,
    }
    save.mutate({ product, id: editing?.id, stock: editing ? stock : undefined })
  }

  const GRID = '2.2fr 1.1fr 110px 100px 110px 70px'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: '#71717a' }}>{rows.length} бараа · {cats.data?.length ?? 0} ангилал</div>
        <Button style={{ marginLeft: 'auto' }} onClick={() => { setEditing(null); setOpen(true) }}><Plus size={15} />Бараа нэмэх</Button>
      </div>

      <div className="table-wrap">
      <div className="card table-min" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: GRID, fontSize: 11.5, fontWeight: 600, color: '#a1a1aa', padding: '13px 20px', borderBottom: '1px solid #f1f1f3', background: '#fcfcfd' }}>
          <span>Бараа</span><span>Ангилал</span><span style={{ textAlign: 'right' }}>Үнэ</span><span style={{ textAlign: 'right' }}>Нөөц</span><span style={{ textAlign: 'center' }}>Төлөв</span><span></span>
        </div>
        {products.isLoading ? <Spinner /> : rows.map((p) => {
          const c = catOf(p.categoryId)
          const stockColor = p.stock === 0 ? '#b91c1c' : p.stock < 12 ? '#b45309' : '#3f3f46'
          return (
            <div key={p.id} className="kk-row" style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', fontSize: 13, padding: '13px 20px', borderBottom: '1px solid #f6f6f7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <span style={{ width: 40, height: 40, borderRadius: 9, background: '#f4f4f5', color: '#71717a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CatIcon iconKey={c?.iconKey} /></span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, color: '#18181b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: '#a1a1aa' }}>{p.sku}{p.brand ? ` · ${p.brand}` : ''}</div>
                </div>
              </div>
              <span style={{ color: '#71717a' }}>{p.categoryName}</span>
              <span style={{ textAlign: 'right', fontWeight: 600, color: '#18181b' }} className="tnum">{fmtMNT(p.price)}</span>
              <span style={{ textAlign: 'right', color: stockColor, fontWeight: p.stock < 12 ? 600 : 450 }} className="tnum">{p.stock} ш</span>
              <span style={{ textAlign: 'center' }}><StatusPill st={PRODUCT_ST[p.status]} /></span>
              <span style={{ display: 'flex', justifyContent: 'flex-end' }}><IconButton onClick={() => { setEditing(p); setOpen(true) }}><Pencil size={15} /></IconButton></span>
            </div>
          )
        })}
        {!products.isLoading && rows.length === 0 && <div style={{ padding: '48px 20px', textAlign: 'center', color: '#a1a1aa', fontSize: 13.5 }}>Үр дүн олдсонгүй.</div>}
      </div>
      </div>

      <Modal open={open} title={editing ? 'Бараа засах' : 'Бараа нэмэх'} onClose={() => setOpen(false)}
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Цуцлах</Button><Button form="prod-form" type="submit" disabled={save.isPending}>Хадгалах</Button></>}>
        <form id="prod-form" onSubmit={submit} className="r-eq2">
          <Field label="Барааны нэр" span2><Input name="name" defaultValue={editing?.name} placeholder="Ж: Цагаан финиш замаск 25кг" required /></Field>
          <Field label="Ангилал">
            <Select name="categoryId" defaultValue={editing?.categoryId} required>
              {(cats.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
          <Field label="Үнэ (₮)"><Input name="price" type="number" defaultValue={editing?.price} placeholder="38000" required /></Field>
          <Field label="Нөөц (ширхэг)"><Input name="stock" type="number" defaultValue={editing?.stock ?? 0} placeholder="100" /></Field>
          <Field label="Брэнд (заавал биш)"><Input name="brand" defaultValue={editing?.brand ?? ''} placeholder="Ж: Knauf" /></Field>
        </form>
      </Modal>
    </div>
  )
}
