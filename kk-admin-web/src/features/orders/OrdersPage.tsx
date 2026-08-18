import { useEffect, useState } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, MapPin, Phone, Plus, Trash2, X } from 'lucide-react'
import { api, getData, type PageResult } from '../../lib/api'
import { fmtMNT, fmtDate } from '../../lib/format'
import { ORDER_ST, SOURCE_LABEL, TIER_TAG, TYPE_TAG } from '../../lib/theme'
import { useSearch } from '../../store/search'
import { toast } from '../../store/ui'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Field, Input, Select, Textarea } from '../../components/ui/Input'
import { StatusPill, TagPill } from '../../components/ui/Pill'
import { Avatar } from '../../components/ui/Avatar'
import { Spinner } from '../../components/ui/Spinner'
import { PinMap } from '../../components/map/PinMap'
import type { Customer, CustomerDetail, Product, SalesOrder } from '../../types'

const TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'Бүгд' },
  { key: 'pending', label: 'Хүлээгдэж буй' },
  { key: 'shipping', label: 'Хүргэгдэж буй' },
  { key: 'delivered', label: 'Хүргэгдсэн' },
]
interface Line { productId: number; qty: number }

const PAGE_SIZE = 20
const MAX_PRODUCTS = 1000

/** 상품 셀렉트용 — 서버 페이지(최대 200)를 순회해 전체 목록 확보. */
async function fetchAllProducts(): Promise<Product[]> {
  const items: Product[] = []
  for (let page = 0; items.length < MAX_PRODUCTS; page++) {
    const r = await getData<PageResult<Product>>('/products', { page, size: 200 })
    items.push(...r.items)
    if (r.items.length === 0 || items.length >= r.total) break
  }
  return items
}

/** 고객 자동완성용 전체 목록. */
async function fetchAllCustomers(): Promise<Customer[]> {
  const items: Customer[] = []
  for (let page = 0; items.length < MAX_PRODUCTS; page++) {
    const r = await getData<PageResult<Customer>>('/customers', { page, size: 200 })
    items.push(...r.items)
    if (r.items.length === 0 || items.length >= r.total) break
  }
  return items
}

interface Delivery { address: string; lat: number | null; lng: number | null }
const EMPTY_DELIVERY: Delivery = { address: '', lat: null, lng: null }

export default function OrdersPage() {
  const qc = useQueryClient()
  const rawQuery = useSearch((s) => s.query).trim()
  const [query, setQuery] = useState(rawQuery)
  const [tab, setTab] = useState('all')
  const [page, setPage] = useState(0)
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<SalesOrder | null>(null)
  const [lines, setLines] = useState<Line[]>([{ productId: 0, qty: 1 }])
  // 신규 주문 — 고객 연동 + 배달 위치
  const [custName, setCustName] = useState('')
  const [custPhone, setCustPhone] = useState('')
  const [custId, setCustId] = useState<number | null>(null)
  const [sugOpen, setSugOpen] = useState(false)
  const [delivery, setDelivery] = useState<Delivery>(EMPTY_DELIVERY)

  // 검색어 디바운스(300ms) → 서버 검색
  useEffect(() => {
    const t = setTimeout(() => setQuery(rawQuery), 300)
    return () => clearTimeout(t)
  }, [rawQuery])
  // 탭/검색 변경 시 첫 페이지로
  useEffect(() => { setPage(0) }, [tab, query])

  const orders = useQuery({
    queryKey: ['orders', 'list', tab, query, page],
    queryFn: () => getData<PageResult<SalesOrder>>('/orders', {
      status: tab === 'all' ? undefined : tab,
      q: query || undefined,
      page,
      size: PAGE_SIZE,
    }),
    placeholderData: keepPreviousData,
  })
  const statusCounts = useQuery({
    queryKey: ['orders', 'counts'],
    queryFn: () => getData<Record<string, number>>('/orders/status-counts'),
  })
  const products = useQuery({ queryKey: ['products', 'all'], queryFn: fetchAllProducts })
  const customers = useQuery({ queryKey: ['customers', 'all'], queryFn: fetchAllCustomers })
  const detailQ = useQuery({
    queryKey: ['orders', 'detail', detail?.id],
    queryFn: () => getData<SalesOrder>(`/orders/${detail!.id}`),
    enabled: !!detail,
  })
  // 주문 상세 → 주문자(고객) 상세 정보
  const custDetailQ = useQuery({
    queryKey: ['customers', 'detail', detail?.customerId],
    queryFn: () => getData<CustomerDetail>(`/customers/${detail!.customerId}`),
    enabled: !!detail?.customerId,
  })

  const prodList = products.data ?? []
  const rows = orders.data?.items ?? []
  const totalCount = orders.data?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const counts = (k: string) => statusCounts.data?.[k] ?? 0
  // 상세는 목록 행으로 즉시 열고, 품목 등은 서버 상세로 보강
  const d: SalesOrder | null = detail ? { ...detail, ...(detailQ.data ?? {}) } : null

  const resetOrderForm = () => {
    setLines([{ productId: 0, qty: 1 }])
    setCustName(''); setCustPhone(''); setCustId(null); setSugOpen(false)
    setDelivery(EMPTY_DELIVERY)
  }
  const pickCustomer = (c: Customer) => {
    setCustId(c.id); setCustName(c.name); setCustPhone(c.phone ?? ''); setSugOpen(false)
    setDelivery({ address: c.address ?? '', lat: c.lat ?? null, lng: c.lng ?? null })
  }
  const sugName = custName.trim().toLowerCase()
  // 입력 전엔 상위 고객(구매액순) 노출, 입력 중엔 이름/전화 매칭
  const suggestions = sugOpen && !custId
    ? (customers.data ?? [])
        .filter((c) => !sugName || (c.name + (c.phone ?? '')).toLowerCase().includes(sugName))
        .slice(0, 6)
    : []
  const linked = custId != null ? (customers.data ?? []).find((c) => c.id === custId) : null

  const create = useMutation({
    mutationFn: (body: Record<string, unknown>) => api.post('/orders', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }); qc.invalidateQueries({ queryKey: ['customers'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); toast('Захиалга үүсгэгдлээ'); setOpen(false); resetOrderForm() },
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
    create.mutate({
      customerName: custName.trim(),
      phone: custPhone.trim() || null,
      customerId: custId,
      note: String(f.get('note') || '') || null,
      items,
      deliveryAddress: delivery.address.trim() || null,
      deliveryLat: delivery.lat,
      deliveryLng: delivery.lng,
    })
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
        <Button style={{ marginLeft: 'auto' }} onClick={() => { resetOrderForm(); setOpen(true) }}><Plus size={15} />Шинэ захиалга</Button>
      </div>

      <div className="table-wrap">
      <div className="card table-min" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: 12, fontSize: 11.5, fontWeight: 600, color: '#a1a1aa', padding: '13px 20px', borderBottom: '1px solid #f1f1f3', background: '#fcfcfd' }}>
          <span>Код</span><span>Харилцагч</span><span>Бараа</span><span style={{ textAlign: 'right' }}>Дүн</span><span style={{ textAlign: 'center' }}>Огноо</span><span style={{ textAlign: 'right' }}>Төлөв</span>
        </div>
        {orders.isLoading ? <Spinner /> : rows.map((o, i) => (
          <div key={o.id} className="kk-row" onClick={() => setDetail(o)} style={{ display: 'grid', gridTemplateColumns: GRID, gap: 12, alignItems: 'center', fontSize: 13, padding: '14px 20px', borderBottom: '1px solid #f6f6f7', cursor: 'pointer', opacity: orders.isPlaceholderData ? 0.55 : 1 }}>
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
          <span>Нийт {totalCount} захиалга</span>
          {pageCount > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <PagerBtn disabled={page === 0} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={15} /></PagerBtn>
              <span className="tnum" style={{ color: '#71717a' }}>{page + 1} / {pageCount}</span>
              <PagerBtn disabled={page + 1 >= pageCount} onClick={() => setPage((p) => p + 1)}><ChevronRight size={15} /></PagerBtn>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* 신규 주문 */}
      <Modal open={open} title="Шинэ захиалга" onClose={() => setOpen(false)} width={620}
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Цуцлах</Button><Button form="ord-form" type="submit" disabled={create.isPending}>Захиалга үүсгэх</Button></>}>
        <form id="ord-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="r-eq2">
            <div style={{ position: 'relative' }}>
              <Field label="Харилцагчийн нэр">
                <Input
                  value={custName}
                  onChange={(e) => { setCustName(e.target.value); setCustId(null); setSugOpen(true) }}
                  onFocus={() => setSugOpen(true)}
                  onBlur={() => setTimeout(() => setSugOpen(false), 150)}
                  placeholder="Ж: Б. Болдбаатар" required autoComplete="off"
                />
              </Field>
              {suggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 30, background: '#fff', border: '1px solid #ececef', borderRadius: 10, marginTop: 4, boxShadow: '0 8px 24px rgba(0,0,0,.08)', overflow: 'hidden' }}>
                  {suggestions.map((c) => (
                    <button key={c.id} type="button" onMouseDown={(e) => { e.preventDefault(); pickCustomer(c) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', border: 0, background: 'none', padding: '9px 12px', fontSize: 13, cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid #f6f6f7' }}>
                      <span style={{ fontWeight: 500, color: '#18181b', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                      <span className="tnum" style={{ color: '#a1a1aa', fontSize: 12 }}>{c.phone ?? ''}</span>
                      <TagPill tag={TYPE_TAG[c.type] ?? TYPE_TAG.individual} />
                    </button>
                  ))}
                </div>
              )}
              {!linked && custName.trim() !== '' && (
                <div style={{ fontSize: 11.5, color: '#a1a1aa', marginTop: 5 }}>Шинэ нэр — захиалга үүсгэхэд харилцагчаар автоматаар бүртгэгдэнэ.</div>
              )}
            </div>
            <Field label="Утас"><Input value={custPhone} onChange={(e) => setCustPhone(e.target.value)} placeholder="9900-0000" /></Field>
          </div>

          {/* 연결된 고객 데이터 카드 */}
          {linked && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#f8f9fb', border: '1px solid #ececef', borderRadius: 11, padding: '12px 14px' }}>
              <Avatar name={linked.name} index={0} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 13.5, color: '#18181b' }}>{linked.name}</span>
                  <TagPill tag={TYPE_TAG[linked.type] ?? TYPE_TAG.individual} />
                  <TagPill tag={TIER_TAG[linked.tier]} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, fontSize: 12.5, color: '#71717a', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={12} color="#a1a1aa" /><span className="tnum">{linked.phone || '-'}</span></span>
                  <span className="tnum">{linked.ordersCount ?? 0} захиалга · {fmtMNT(linked.totalSpent)}</span>
                </div>
                {linked.address && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginTop: 5, fontSize: 12.5, color: '#71717a', lineHeight: 1.45 }}>
                    <MapPin size={12} color="#a1a1aa" style={{ marginTop: 2, flexShrink: 0 }} />{linked.address}
                  </div>
                )}
              </div>
              <button type="button" title="Холболт салгах" onClick={() => setCustId(null)}
                style={{ border: 0, background: 'none', color: '#c4c4cc', cursor: 'pointer', padding: 2, display: 'flex' }}>
                <X size={15} />
              </button>
            </div>
          )}

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
          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#3f3f46', marginBottom: 7 }}>Хүргэлтийн байршил</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Input value={delivery.address} onChange={(e) => setDelivery((d) => ({ ...d, address: e.target.value }))} placeholder="Хаяг / ямар газар болохыг тайлбарлана уу" />
              <PinMap lat={delivery.lat} lng={delivery.lng} height={200} onChange={(lat, lng) => setDelivery((d) => ({ ...d, lat, lng }))} />
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
      <Modal open={!!d} title={d ? `Захиалга ${d.code}` : ''} onClose={() => setDetail(null)}
        footer={<Button variant="secondary" onClick={() => setDetail(null)}>Хаах</Button>}>
        {d && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 18, borderBottom: '1px solid #f1f1f3', marginBottom: 18 }}>
              <Avatar name={d.customerName} index={0} size={42} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#18181b' }}>{d.customerName}</div>
                <div style={{ fontSize: 12.5, color: '#a1a1aa', marginTop: 2 }}>{d.phone || '-'} · {fmtDate(d.orderedAt)} · {SOURCE_LABEL[d.source]}</div>
                {custDetailQ.data && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    <TagPill tag={TYPE_TAG[custDetailQ.data.customer.type] ?? TYPE_TAG.individual} />
                    <TagPill tag={TIER_TAG[custDetailQ.data.customer.tier]} />
                    <span className="tnum" style={{ fontSize: 11.5, color: '#a1a1aa' }}>{custDetailQ.data.customer.ordersCount ?? 0} захиалга · {fmtMNT(custDetailQ.data.customer.totalSpent)}</span>
                  </div>
                )}
              </div>
              <StatusPill st={ORDER_ST[d.status]} />
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: '#a1a1aa', letterSpacing: '.04em', marginBottom: 10 }}>БАРАА</div>
            <div style={{ background: '#f8f9fb', border: '1px solid #f1f1f3', borderRadius: 11, overflow: 'hidden' }}>
              {d.items && d.items.length > 0 ? (
                d.items.map((it, i) => (
                  <div key={it.id ?? i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12, alignItems: 'center', padding: '11px 16px', borderBottom: i < d.items!.length - 1 ? '1px solid #f1f1f3' : 'none', fontSize: 13.5, color: '#3f3f46' }}>
                    <span style={{ fontWeight: 500, color: '#18181b', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.productName}</span>
                    <span className="tnum" style={{ color: '#71717a', fontSize: 12.5 }}>{fmtMNT(it.unitPrice)} × {it.qty}</span>
                    <span className="tnum" style={{ fontWeight: 600, color: '#18181b', textAlign: 'right', minWidth: 84 }}>{fmtMNT(it.lineTotal)}</span>
                  </div>
                ))
              ) : detailQ.isLoading ? (
                <Spinner />
              ) : (
                <div style={{ padding: '14px 16px', fontSize: 14, color: '#3f3f46', lineHeight: 1.55 }}>{d.itemsSummary || '-'}</div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, padding: '14px 16px', background: '#18181b', borderRadius: 11 }}>
              <span style={{ fontSize: 13, color: '#a1a1aa' }}>Нийт дүн</span>
              <span style={{ fontSize: 20, fontWeight: 680, color: '#fff' }}>{fmtMNT(d.total)}</span>
            </div>
            {(d.deliveryAddress || d.deliveryLat != null) && (
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: '#a1a1aa', letterSpacing: '.04em', margin: '20px 0 10px' }}>ХҮРГЭЛТИЙН БАЙРШИЛ</div>
                {d.deliveryAddress && (
                  <div style={{ fontSize: 13.5, color: '#3f3f46', lineHeight: 1.5, marginBottom: d.deliveryLat != null ? 10 : 0 }}>{d.deliveryAddress}</div>
                )}
                {d.deliveryLat != null && d.deliveryLng != null && (
                  <PinMap lat={d.deliveryLat} lng={d.deliveryLng} height={190} />
                )}
              </div>
            )}
            {d.note && (
              <div style={{ marginTop: 14, padding: '11px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, fontSize: 13, color: '#92400e', lineHeight: 1.5 }}>{d.note}</div>
            )}
            <div style={{ fontSize: 11.5, fontWeight: 600, color: '#a1a1aa', letterSpacing: '.04em', margin: '20px 0 10px' }}>ТӨЛӨВ ШИНЭЧЛЭХ</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {d.status === 'pending' && <StatusBtn st="shipping" onClick={() => changeStatus.mutate({ id: d.id, status: 'shipping' })} />}
              {(d.status === 'pending' || d.status === 'shipping') && <StatusBtn st="delivered" onClick={() => changeStatus.mutate({ id: d.id, status: 'delivered' })} />}
              {d.status !== 'canceled' && <StatusBtn st="canceled" onClick={() => changeStatus.mutate({ id: d.id, status: 'canceled' })} />}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function PagerBtn({ disabled, onClick, children }: { disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ border: '1px solid #ececef', background: '#fff', color: disabled ? '#d4d4d8' : '#3f3f46', width: 28, height: 28, borderRadius: 7, cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </button>
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
