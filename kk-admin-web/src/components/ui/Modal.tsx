import type { ReactNode } from 'react'
import { X } from 'lucide-react'

export function Modal({
  open, title, onClose, children, footer, width = 560,
}: {
  open: boolean
  title: ReactNode
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  width?: number
}) {
  if (!open) return null
  return (
    <div
      className="kk-fade"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(9,9,11,.45)', zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '56px 20px', overflowY: 'auto' }}
    >
      <div
        className="kk-pop"
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 16, boxShadow: '0 24px 70px rgba(0,0,0,.28)', width: '100%', maxWidth: width }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f1f1f3' }}>
          <div style={{ fontWeight: 680, fontSize: 18, color: '#18181b', letterSpacing: '-.01em' }}>{title}</div>
          <button onClick={onClose} className="kk-navbtn" style={{ border: 0, background: '#f4f4f5', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: '22px 24px' }}>{children}</div>
        {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '18px 24px', borderTop: '1px solid #f1f1f3' }}>{footer}</div>}
      </div>
    </div>
  )
}
