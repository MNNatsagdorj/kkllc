import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

const base: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
  borderRadius: 9, padding: '9px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
  border: '1px solid transparent', transition: 'background .12s, opacity .12s', whiteSpace: 'nowrap',
}

const variants: Record<Variant, React.CSSProperties> = {
  primary: { background: '#18181b', color: '#fff' },
  secondary: { background: '#fff', color: '#3f3f46', borderColor: '#ececef' },
  ghost: { background: '#fff', color: '#71717a', borderColor: '#ececef' },
  danger: { background: '#fff', color: '#ef4444', borderColor: '#ececef' },
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

export function Button({ variant = 'primary', style, children, disabled, ...rest }: Props) {
  return (
    <button
      className="kk-navbtn"
      style={{ ...base, ...variants[variant], opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto', ...style }}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

/** 정사각 아이콘 버튼. */
export function IconButton({ children, danger = false, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  return (
    <button
      className="kk-navbtn"
      style={{ border: '1px solid #ececef', background: '#fff', width: 30, height: 30, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: danger ? '#ef4444' : '#71717a', cursor: 'pointer' }}
      {...rest}
    >
      {children}
    </button>
  )
}
