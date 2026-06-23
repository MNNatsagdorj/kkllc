import axios from 'axios'
import { useAuth, getAccessToken } from '../store/auth'

export interface ApiResponse<T> {
  success: boolean
  data: T
  error: { code: string; message: string } | null
}

export interface PageResult<T> {
  items: T[]
  total: number
  page: number
  size: number
}

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// 요청 인터셉터: JWT 부착
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 응답 인터셉터: 401 → 로그아웃, 에러 메시지 정규화
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuth.getState().logout()
    }
    const apiErr = err.response?.data?.error
    const message = apiErr?.message || err.message || 'Алдаа гарлаа'
    return Promise.reject(new Error(message))
  },
)

// 헬퍼: ApiResponse<T> 의 data 만 추출
export async function getData<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await api.get<ApiResponse<T>>(url, { params })
  return res.data.data
}
