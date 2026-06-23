import type { ReactNode } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'

/** 아이콘 배지 + 증감 칩이 있는 KPI 카드. */
export function Kpi({
  label, value, icon, iconBg = '#f4f4f5', iconColor = '#3f3f46', delta, deltaUp = true, deltaNote = 'өмнөх сараас',
}: {
  label: string
  value: ReactNode
  icon?: ReactNode
  iconBg?: string
  iconColor?: string
  delta?: string | null
  deltaUp?: boolean
  deltaNote?: string
}) {
  return (
    <div className="card" style={{ padding: '18px 18px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: '#71717a', fontWeight: 450 }}>{label}</span>
        {icon && (
          <span style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </span>
        )}
      </div>
      <div style={{ fontSize: 26, fontWeight: 680, color: '#18181b', marginTop: 12, letterSpacing: '-.02em' }} className="tnum">{value}</div>
      {delta != null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600, color: deltaUp ? '#15803d' : '#b91c1c', background: deltaUp ? '#dcfce7' : '#fee2e2', padding: '2px 7px', borderRadius: 6 }}>
            {deltaUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}{delta}
          </span>
          <span style={{ fontSize: 12, color: '#a1a1aa' }}>{deltaNote}</span>
        </div>
      )}
    </div>
  )
}

/** 간단 KPI (아이콘 없음, 보조 텍스트). */
export function KpiSimple({ label, value, sub, subColor = '#71717a' }: { label: string; value: ReactNode; sub?: ReactNode; subColor?: string }) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <span style={{ fontSize: 13, color: '#71717a' }}>{label}</span>
      <div style={{ fontSize: 24, fontWeight: 680, color: '#18181b', marginTop: 10, letterSpacing: '-.02em' }} className="tnum">{value}</div>
      {sub != null && <div style={{ fontSize: 12, color: subColor, fontWeight: 500, marginTop: 6 }}>{sub}</div>}
    </div>
  )
}
