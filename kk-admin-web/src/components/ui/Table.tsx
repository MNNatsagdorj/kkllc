import type { ReactNode } from 'react'

export function Table({ head, children }: { head: ReactNode; children: ReactNode }) {
  return (
    <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead style={{ background: '#fcfcfd', textAlign: 'left' }}>
          <tr>{head}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Th({ children, align = 'left' }: { children?: ReactNode; align?: 'left' | 'right' | 'center' }) {
  return (
    <th style={{ padding: '13px 20px', fontSize: 11.5, fontWeight: 600, color: '#a1a1aa', textAlign: align, borderBottom: '1px solid #f1f1f3', whiteSpace: 'nowrap' }}>
      {children}
    </th>
  )
}

export function Tr({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <tr className="kk-row" onClick={onClick} style={{ borderBottom: '1px solid #f6f6f7', cursor: onClick ? 'pointer' : 'default', transition: 'background .1s' }}>
      {children}
    </tr>
  )
}

export function Td({ children, align = 'left', strong = false, muted = false }: { children?: ReactNode; align?: 'left' | 'right' | 'center'; strong?: boolean; muted?: boolean }) {
  return (
    <td style={{ padding: '13px 20px', textAlign: align, color: strong ? '#18181b' : muted ? '#a1a1aa' : '#3f3f46', fontWeight: strong ? 600 : 400 }}>
      {children}
    </td>
  )
}

export function EmptyRow({ colSpan, text = 'Үр дүн олдсонгүй.' }: { colSpan: number; text?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} style={{ padding: '48px 20px', textAlign: 'center', color: '#a1a1aa', fontSize: 13.5 }}>{text}</td>
    </tr>
  )
}
