// 상태 색상 맵 + 아바타 팔레트 (KK Admin standalone 디자인 기준)

export interface St { label: string; c: string; bg: string; dot: string }

export const ORDER_ST: Record<string, St> = {
  pending: { label: 'Хүлээгдэж буй', c: '#b45309', bg: '#fef3c7', dot: '#f59e0b' },
  shipping: { label: 'Хүргэгдэж буй', c: '#1d4ed8', bg: '#dbeafe', dot: '#3b82f6' },
  delivered: { label: 'Хүргэгдсэн', c: '#15803d', bg: '#dcfce7', dot: '#22c55e' },
  canceled: { label: 'Цуцлагдсан', c: '#b91c1c', bg: '#fee2e2', dot: '#ef4444' },
}

export const PRODUCT_ST: Record<string, St> = {
  active: { label: 'Идэвхтэй', c: '#15803d', bg: '#dcfce7', dot: '#22c55e' },
  low: { label: 'Бага', c: '#b45309', bg: '#fef3c7', dot: '#f59e0b' },
  out: { label: 'Дууссан', c: '#b91c1c', bg: '#fee2e2', dot: '#ef4444' },
}

export const PAY_ST: Record<string, St> = {
  paid: { label: 'Төлсөн', c: '#15803d', bg: '#dcfce7', dot: '#22c55e' },
  pending: { label: 'Төлөгдөөгүй', c: '#b45309', bg: '#fef3c7', dot: '#f59e0b' },
}

export const QUOTE_ST: Record<string, St> = {
  new: { label: 'Шинэ', c: '#b45309', bg: '#fef3c7', dot: '#f59e0b' },
  answered: { label: 'Үнэ илгээсэн', c: '#15803d', bg: '#dcfce7', dot: '#22c55e' },
  closed: { label: 'Хаасан', c: '#52525b', bg: '#f4f4f5', dot: '#a1a1aa' },
}

export interface Tag { label: string; c: string; bg: string }
export const TIER_TAG: Record<string, Tag> = {
  vip: { label: 'VIP', c: '#92400e', bg: '#fef3c7' },
  reg: { label: 'Тогтмол', c: '#3f3f46', bg: '#f4f4f5' },
  new: { label: 'Шинэ', c: '#15803d', bg: '#dcfce7' },
}

export const SOURCE_LABEL: Record<string, string> = {
  admin: 'Админ', web: 'Вэб', telegram: 'Telegram',
}

// 아바타 팔레트 (배경/글자색)
const AV: [string, string][] = [
  ['#eef3fa', '#15396B'],
  ['#fef3c7', '#b45309'],
  ['#dcfce7', '#15803d'],
  ['#fae8ff', '#a21caf'],
  ['#dbeafe', '#1d4ed8'],
]
export const avatar = (i: number) => ({ bg: AV[i % AV.length][0], color: AV[i % AV.length][1] })

// "Б. Болдбаатар" → "Б" (성 약자 뒤 이름 첫 글자)
export const initial = (name: string) =>
  ((name.split('.').pop() || name).trim().charAt(0) || '?').toUpperCase()

// 차트 막대 색상 팔레트
export const BAR_COLORS = ['#15396B', '#F26C1B', '#3b82f6', '#8b5cf6', '#14b8a6', '#a1a1aa', '#ec4899']

// 카테고리 비중/색상 (대시보드 도넛 대용 막대)
export const CAT_FILL = ['#15396B', '#F26C1B', '#3b82f6', '#a1a1aa', '#8b5cf6', '#14b8a6']
