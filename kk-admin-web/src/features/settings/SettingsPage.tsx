import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, getData } from '../../lib/api'
import { toast } from '../../store/ui'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Input'
import { Toggle } from '../../components/ui/Toggle'
import { Spinner } from '../../components/ui/Spinner'

type Settings = Record<string, string>
const TABS = [{ key: 'general', label: 'Ерөнхий' }, { key: 'notify', label: 'Мэдэгдэл' }, { key: 'telegram', label: 'Telegram' }]

export default function SettingsPage() {
  const qc = useQueryClient()
  const [tab, setTab] = useState('general')
  const [form, setForm] = useState<Settings>({})
  const { data, isLoading } = useQuery({ queryKey: ['settings'], queryFn: () => getData<Settings>('/settings') })
  useEffect(() => { if (data) setForm(data) }, [data])

  const save = useMutation({
    mutationFn: (body: Settings) => api.put('/settings', body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['settings'] }); toast('Тохиргоо хадгалагдлаа') },
    onError: (e) => toast((e as Error).message, 'error'),
  })
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))
  const bool = (k: string) => form[k] === 'true'

  if (isLoading) return <Spinner />

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 4, background: '#f4f4f5', borderRadius: 9, padding: 3, marginBottom: 18, width: 'fit-content' }}>
        {TABS.map((t) => {
          const active = tab === t.key
          return (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ border: 0, background: active ? '#fff' : 'transparent', color: active ? '#18181b' : '#71717a', fontWeight: 500, fontSize: 13, padding: '7px 16px', borderRadius: 7, cursor: 'pointer', boxShadow: active ? '0 1px 2px rgba(16,24,40,.06)' : 'none' }}>{t.label}</button>
          )
        })}
      </div>

      {tab === 'general' && (
        <Card pad={24}>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#18181b', marginBottom: 4 }}>Байгууллагын мэдээлэл</div>
          <div style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 20 }}>Сайт болон баримтад харагдах мэдээлэл</div>
          <div className="r-eq2">
            <Field label="Нэр"><Input value={form.company_name ?? ''} onChange={(e) => set('company_name', e.target.value)} /></Field>
            <Field label="Утас"><Input value={form.company_phone ?? ''} onChange={(e) => set('company_phone', e.target.value)} /></Field>
            <Field label="Үнэгүй хүргэлтийн босго (₮)" span2><Input type="number" value={form.free_delivery_threshold ?? ''} onChange={(e) => set('free_delivery_threshold', e.target.value)} /></Field>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22, paddingTop: 20, borderTop: '1px solid #f1f1f3' }}>
            <Button onClick={() => save.mutate(form)} disabled={save.isPending}>Хадгалах</Button>
          </div>
        </Card>
      )}

      {tab === 'notify' && (
        <Card pad={0} style={{ padding: '8px 24px' }}>
          <ToggleRow label="Шинэ захиалгын мэдэгдэл" desc="Telegram-аар админд илгээх" checked={bool('notify_new_order')} onChange={(v) => set('notify_new_order', String(v))} />
          <ToggleRow label="Шинэ үнийн хүсэлтийн мэдэгдэл" desc="Telegram-аар админд илгээх" checked={bool('notify_new_quote')} onChange={(v) => set('notify_new_quote', String(v))} last />
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 0' }}><Button onClick={() => save.mutate(form)} disabled={save.isPending}>Хадгалах</Button></div>
        </Card>
      )}

      {tab === 'telegram' && (
        <Card pad={24}>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#18181b', marginBottom: 20 }}>Telegram холболт</div>
          <ToggleRow label="Telegram бот идэвхтэй" desc="Ботыг асаах (серверийг дахин эхлүүлнэ)" checked={bool('telegram_enabled')} onChange={(v) => set('telegram_enabled', String(v))} />
          <div style={{ marginTop: 16 }}>
            <Field label="Админ Chat ID (мэдэгдэл хүлээн авах)"><Input value={form.telegram_admin_chat_id ?? ''} onChange={(e) => set('telegram_admin_chat_id', e.target.value)} placeholder="123456789" /></Field>
          </div>
          <div style={{ marginTop: 16, background: '#f8f9fb', border: '1px solid #f1f1f3', borderRadius: 11, padding: 14, fontSize: 12.5, color: '#71717a', lineHeight: 1.6 }}>
            Бот токеныг серверийн орчны хувьсагч <code style={{ color: '#18181b' }}>TELEGRAM_BOT_TOKEN</code> ба
            <code style={{ color: '#18181b' }}> TELEGRAM_ENABLED=true</code>-ээр тохируулна. Энд зөвхөн Chat ID болон мэдэгдлийг хадгална.
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22, paddingTop: 20, borderTop: '1px solid #f1f1f3' }}>
            <Button onClick={() => save.mutate(form)} disabled={save.isPending}>Хадгалах</Button>
          </div>
        </Card>
      )}
    </div>
  )
}

function ToggleRow({ label, desc, checked, onChange, last }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void; last?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 0', borderBottom: last ? 'none' : '1px solid #f1f1f3' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#18181b' }}>{label}</div>
        <div style={{ fontSize: 12.5, color: '#a1a1aa', marginTop: 3 }}>{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}
