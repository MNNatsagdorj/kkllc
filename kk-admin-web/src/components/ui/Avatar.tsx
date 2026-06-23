import { avatar, initial } from '../../lib/theme'

export function Avatar({ name, index = 0, size = 34 }: { name: string; index?: number; size?: number }) {
  const a = avatar(index)
  return (
    <span
      style={{
        width: size, height: size, borderRadius: '50%', background: a.bg, color: a.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 600, fontSize: size * 0.37, flexShrink: 0,
      }}
    >
      {initial(name)}
    </span>
  )
}
