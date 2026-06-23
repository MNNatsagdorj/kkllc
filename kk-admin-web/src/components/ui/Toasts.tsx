import { useUi } from '../../store/ui'
import { Check, AlertCircle, Info } from 'lucide-react'

const cfg = {
  success: { color: '#5BD6A0', Icon: Check },
  error: { color: '#fb7185', Icon: AlertCircle },
  info: { color: '#93c5fd', Icon: Info },
}

export function Toasts() {
  const toasts = useUi((s) => s.toasts)
  if (toasts.length === 0) return null
  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 60, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
      {toasts.map((t) => {
        const { color, Icon } = cfg[t.type]
        return (
          <div key={t.id} className="kk-pop" style={{ background: '#18181b', color: '#fff', fontSize: 13.5, fontWeight: 500, padding: '12px 20px', borderRadius: 11, boxShadow: '0 12px 32px rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', gap: 9 }}>
            <Icon size={16} style={{ color }} />
            {t.message}
          </div>
        )
      })}
    </div>
  )
}
