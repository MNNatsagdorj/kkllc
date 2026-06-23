export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{ border: 0, background: checked ? '#18181b' : '#e4e4e7', width: 44, height: 25, borderRadius: 13, cursor: 'pointer', padding: 0, position: 'relative', transition: 'background .18s', flexShrink: 0 }}
    >
      <span style={{ position: 'absolute', top: 2.5, left: checked ? 21.5 : 2.5, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)', transition: 'left .18s' }} />
    </button>
  )
}
