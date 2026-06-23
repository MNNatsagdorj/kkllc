// 통화 포맷 (기술설계 §7.2) — 숫자와 ₮ 사이 narrow no-break space
export const fmtMNT = (n: number | null | undefined): string =>
  (n ?? 0).toLocaleString('en-US') + ' ₮'

export const fmtM = (n: number | null | undefined): string =>
  ((n ?? 0) / 1e6).toFixed(1) + ' сая ₮'

export const fmtDate = (s: string | null | undefined): string => {
  if (!s) return '-'
  return s.length >= 10 ? s.slice(0, 10) : s
}

export const fmtNum = (n: number | null | undefined): string =>
  (n ?? 0).toLocaleString('en-US')
