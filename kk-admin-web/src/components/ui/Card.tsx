import type { ReactNode } from 'react'

export function Card({ children, className = '', style, pad = 20 }: { children: ReactNode; className?: string; style?: React.CSSProperties; pad?: number }) {
  return <div className={`card ${className}`} style={{ padding: pad, ...style }}>{children}</div>
}

/** 카드 헤더(제목 + 부제 + 우측 액션). */
export function CardHead({ title, sub, action }: { title: ReactNode; sub?: ReactNode; action?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 15, color: '#18181b' }}>{title}</div>
        {sub != null && <div style={{ fontSize: 12.5, color: '#a1a1aa', marginTop: 2 }}>{sub}</div>}
      </div>
      {action}
    </div>
  )
}
