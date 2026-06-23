import { create } from 'zustand'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  username: string | null
  displayName: string | null
  setTokens: (t: { accessToken: string; refreshToken: string; username: string; displayName?: string | null }) => void
  logout: () => void
}

const LS_KEY = 'kk_admin_auth'

function load(): Partial<AuthState> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const initial = load()

export const useAuth = create<AuthState>((set) => ({
  accessToken: initial.accessToken ?? null,
  refreshToken: initial.refreshToken ?? null,
  username: initial.username ?? null,
  displayName: initial.displayName ?? null,
  setTokens: (t) => {
    const next = {
      accessToken: t.accessToken,
      refreshToken: t.refreshToken,
      username: t.username,
      displayName: t.displayName ?? null,
    }
    localStorage.setItem(LS_KEY, JSON.stringify(next))
    set(next)
  },
  logout: () => {
    localStorage.removeItem(LS_KEY)
    set({ accessToken: null, refreshToken: null, username: null, displayName: null })
  },
}))

export const getAccessToken = () => useAuth.getState().accessToken
