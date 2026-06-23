import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

const field: React.CSSProperties = {
  width: '100%', height: 42, border: '1px solid #e4e4e7', borderRadius: 9,
  padding: '0 13px', fontSize: 13.5, color: '#18181b', outline: 'none', background: '#fff',
}

export function Field({ label, children, span2 = false }: { label: string; children: ReactNode; span2?: boolean }) {
  return (
    <label style={{ display: 'block', gridColumn: span2 ? 'span 2' : undefined }}>
      <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#3f3f46', marginBottom: 7 }}>{label}</span>
      {children}
    </label>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { style, ...rest } = props
  return <input {...rest} style={{ ...field, ...style }} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { style, ...rest } = props
  return <select {...rest} style={{ ...field, padding: '0 11px', ...style }} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { style, ...rest } = props
  return <textarea {...rest} style={{ ...field, height: 'auto', padding: '10px 13px', ...style }} />
}
