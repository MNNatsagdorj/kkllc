import { create } from 'zustand'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface UiState {
  toasts: Toast[]
  toast: (message: string, type?: Toast['type']) => void
  dismiss: (id: number) => void
}

let seq = 1

export const useUi = create<UiState>((set) => ({
  toasts: [],
  toast: (message, type = 'success') => {
    const id = seq++
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3000)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = (message: string, type?: Toast['type']) => useUi.getState().toast(message, type)
