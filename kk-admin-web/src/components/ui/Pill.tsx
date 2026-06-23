import type { St, Tag } from '../../lib/theme'

/** 컬러 점이 있는 상태칩 (디자인의 status pill). */
export function StatusPill({ st }: { st?: St }) {
  if (!st) return null
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 11.5, fontWeight: 500, color: st.c, background: st.bg,
        padding: '3px 9px', borderRadius: 20, whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.dot }} />
      {st.label}
    </span>
  )
}

/** 점 없는 태그(등급 등). */
export function TagPill({ tag }: { tag?: Tag }) {
  if (!tag) return null
  return (
    <span style={{ fontSize: 11.5, fontWeight: 500, color: tag.c, background: tag.bg, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
      {tag.label}
    </span>
  )
}
