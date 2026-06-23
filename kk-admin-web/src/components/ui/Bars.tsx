/** 단일 막대 차트 (마지막 막대 강조). */
export function BarChart({ data, height = 200, unit = '' }: { data: { label: string; value: number; display?: string }[]; height?: number; unit?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height, paddingTop: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: '#52525b' }}>{d.display ?? d.value}</div>
          <div style={{ width: '100%', maxWidth: 48, height: `${(d.value / max) * (height - 40) + 8}px`, background: i === data.length - 1 ? '#15396B' : '#dbe3ef', borderRadius: '7px 7px 4px 4px', transition: 'height .3s' }} />
          <div style={{ fontSize: 11.5, color: '#a1a1aa' }}>{d.label}</div>
        </div>
      ))}
      {unit && null}
    </div>
  )
}

/** 이중 막대 (수익 vs 비용). */
export function TwinBars({ data, height = 200 }: { data: { label: string; a: number; b: number }[]; height?: number }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.a, d.b]))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, width: '100%', height: '100%', justifyContent: 'center' }}>
            <div style={{ width: 18, height: `${(d.a / max) * (height - 24)}px`, background: '#15396B', borderRadius: '5px 5px 3px 3px' }} />
            <div style={{ width: 18, height: `${(d.b / max) * (height - 24)}px`, background: '#F26C1B', borderRadius: '5px 5px 3px 3px' }} />
          </div>
          <div style={{ fontSize: 11.5, color: '#a1a1aa' }}>{d.label}</div>
        </div>
      ))}
    </div>
  )
}

/** 가로 진행바 리스트 항목. */
export function HBar({ name, valueLabel, pct, fill = '#15396B', max = 150 }: { name: string; valueLabel: string; pct: number; fill?: string; max?: number }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
        <span style={{ fontSize: 13, color: '#3f3f46', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth }}>{name}</span>
        <span style={{ fontSize: 12.5, color: '#18181b', fontWeight: 600 }} className="tnum">{valueLabel}</span>
      </div>
      <div style={{ height: 8, background: '#f4f4f5', borderRadius: 5, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: fill, borderRadius: 5 }} />
      </div>
    </div>
  )
}
const maxWidth = 160
