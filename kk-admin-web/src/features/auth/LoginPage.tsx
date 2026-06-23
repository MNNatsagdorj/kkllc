import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, type ApiResponse } from '../../lib/api'
import { useAuth } from '../../store/auth'
import { Button } from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Input'

interface TokenRes {
  accessToken: string
  refreshToken: string
  username: string
  displayName?: string | null
}

export default function LoginPage() {
  const nav = useNavigate()
  const setTokens = useAuth((s) => s.setTokens)
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      const res = await api.post<ApiResponse<TokenRes>>('/auth/login', { username, password })
      setTokens(res.data.data)
      nav('/')
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4">
      <form onSubmit={submit} className="card w-full max-w-sm p-7">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-sm font-bold text-white">KK</div>
          <div>
            <div className="text-base font-semibold text-ink">KK Admin</div>
            <div className="text-xs text-faint">Нэвтрэх</div>
          </div>
        </div>
        <div className="space-y-3">
          <Field label="Нэвтрэх нэр">
            <Input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
          </Field>
          <Field label="Нууц үг">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          {err && <div className="rounded-lg bg-danger-bg px-3 py-2 text-xs text-danger">{err}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх'}
          </Button>
          <p className="text-center text-[11px] text-faint">Анхны нэвтрэлт: admin / admin1234</p>
        </div>
      </form>
    </div>
  )
}
