import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Send } from 'lucide-react'
import { api, getData, type PageResult } from '../../lib/api'
import { fmtMNT, fmtDate } from '../../lib/format'
import { QUOTE_ST, SOURCE_LABEL } from '../../lib/theme'
import { toast } from '../../store/ui'
import { Avatar } from '../../components/ui/Avatar'
import { StatusPill } from '../../components/ui/Pill'
import { Input } from '../../components/ui/Input'
import { Spinner } from '../../components/ui/Spinner'
import type { Quote } from '../../types'

export default function QuotesPage() {
  const qc = useQueryClient()
  const [selId, setSelId] = useState<number | null>(null)
  const [estimate, setEstimate] = useState('')

  const list = useQuery({ queryKey: ['quotes', 'all'], queryFn: () => getData<PageResult<Quote>>('/quotes', { size: 100 }) })
  const items = list.data?.items ?? []
  const activeId = selId ?? items[0]?.id ?? null
  const detail = useQuery({ queryKey: ['quote', activeId], queryFn: () => getData<Quote>(`/quotes/${activeId}`), enabled: activeId != null })
  const newCount = items.filter((q) => q.status === 'new').length

  const answer = useMutation({
    mutationFn: (body: { estimate: number }) => api.post(`/quotes/${activeId}/answer`, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['quotes'] }); qc.invalidateQueries({ queryKey: ['quote', activeId] }); toast('Үнэ илгээгдлээ'); setEstimate('') },
    onError: (e) => toast((e as Error).message, 'error'),
  })

  const q = detail.data

  return (
    <div className="r-split-quotes">
      {/* list */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f1f3', fontWeight: 600, fontSize: 14, color: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Ирсэн хүсэлт
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#15396B', background: '#eef3fa', padding: '2px 8px', borderRadius: 10 }}>{newCount} шинэ</span>
        </div>
        {list.isLoading ? <Spinner /> : items.map((item, i) => {
          const active = item.id === activeId
          return (
            <button key={item.id} onClick={() => setSelId(item.id)} className="kk-row" style={{ width: '100%', textAlign: 'left', border: 0, borderBottom: '1px solid #f6f6f7', borderLeft: `3px solid ${active ? '#15396B' : 'transparent'}`, background: active ? '#f8f9fb' : '#fff', padding: '14px 16px', cursor: 'pointer', display: 'block' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Avatar name={item.customerName} index={i} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#18181b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.customerName}</div>
                  <div style={{ fontSize: 11.5, color: '#a1a1aa' }}>{item.phone || SOURCE_LABEL[item.source]}</div>
                </div>
                {item.status === 'new' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#15396B', flexShrink: 0 }} />}
                {item.status === 'answered' && <Check size={15} style={{ color: '#22c55e', flexShrink: 0 }} />}
              </div>
              <div style={{ fontSize: 12.5, color: '#71717a', marginTop: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.message}</div>
              <div style={{ fontSize: 11, color: '#a1a1aa', marginTop: 6 }}>{fmtDate(item.receivedAt)}</div>
            </button>
          )
        })}
        {!list.isLoading && items.length === 0 && <div style={{ padding: '40px 20px', textAlign: 'center', color: '#a1a1aa', fontSize: 13 }}>Хүсэлт алга</div>}
      </div>

      {/* detail */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {!activeId || !q ? <div style={{ padding: '64px 20px', textAlign: 'center', color: '#a1a1aa', fontSize: 13.5 }}>Хүсэлт сонгоно уу</div> : (
          <>
            <div style={{ padding: '20px 22px', borderBottom: '1px solid #f1f1f3', display: 'flex', alignItems: 'center', gap: 13 }}>
              <Avatar name={q.customerName} index={0} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: '#18181b' }}>{q.customerName}</div>
                <div style={{ fontSize: 12.5, color: '#a1a1aa', marginTop: 2 }}>{q.phone || '-'} · {fmtDate(q.receivedAt)} · {SOURCE_LABEL[q.source]}</div>
              </div>
              <StatusPill st={QUOTE_ST[q.status]} />
            </div>
            <div style={{ padding: 22 }}>
              {q.productText && <>
                <div style={labelStyle}>СОНИРХОЖ БУЙ БАРАА</div>
                <div style={{ fontSize: 14, color: '#18181b', fontWeight: 500, marginBottom: 18 }}>{q.productText}</div>
              </>}
              <div style={labelStyle}>ХҮСЭЛТ</div>
              <div style={{ background: '#f8f9fb', border: '1px solid #f1f1f3', borderRadius: 11, padding: 16, fontSize: 14, color: '#3f3f46', lineHeight: 1.6 }}>{q.message}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <div style={{ flex: 1, border: '1px solid #ececef', borderRadius: 10, padding: '13px 15px' }}>
                  <div style={{ fontSize: 11.5, color: '#a1a1aa' }}>Тооцоолсон дүн</div>
                  <div style={{ fontSize: 18, fontWeight: 680, color: '#18181b', marginTop: 3 }}>{q.estimate != null ? fmtMNT(q.estimate) : '—'}</div>
                </div>
                <div style={{ flex: 1, border: '1px solid #ececef', borderRadius: 10, padding: '13px 15px' }}>
                  <div style={{ fontSize: 11.5, color: '#a1a1aa' }}>Төлөв</div>
                  <div style={{ marginTop: 5 }}><StatusPill st={QUOTE_ST[q.status]} /></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 18, alignItems: 'center' }}>
                <Input type="number" value={estimate} onChange={(e) => setEstimate(e.target.value)} placeholder="Үнийн санал (₮)" style={{ flex: 1 }} />
                <button onClick={() => estimate && answer.mutate({ estimate: Number(estimate) })} disabled={answer.isPending} style={{ border: 0, background: '#15396B', color: '#fff', fontWeight: 500, fontSize: 13, padding: '0 16px', height: 42, borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                  <Send size={14} />Үнэ илгээх
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { fontSize: 11.5, fontWeight: 600, color: '#a1a1aa', letterSpacing: '.04em', marginBottom: 8 }
