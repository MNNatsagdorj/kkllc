// 제품 포대 SVG — 밴드 색만 제품별로 교체 (07 문서)
export function Sack({ band, size = 74 }: { band?: string | null; size?: number }) {
  const b = band ?? '#C89B5E';
  return (
    <svg width={size} height={size * 1.18} viewBox="0 0 100 118" aria-hidden>
      <path d="M18 18 Q14 10 22 8 L78 8 Q86 10 82 18 L84 100 Q84 112 72 112 L28 112 Q16 112 16 100 Z"
        fill="#E7DFCE" stroke="#C9BFA6" strokeWidth="2" />
      <path d="M22 8 L78 8 Q82 9 81 14 L19 14 Q18 9 22 8 Z" fill="#C9BFA6" />
      <rect x="17" y="48" width="66" height="26" fill={b} stroke="rgba(0,0,0,.08)" />
      <text x="50" y="66" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="15" fontWeight="900"
        fill={isDark(b) ? '#EFECE3' : '#1c2a40'}>KK</text>
      <path d="M16 100 Q50 106 84 100 L84 104 Q50 110 16 104 Z" fill="#C9BFA6" opacity=".6" />
    </svg>
  );
}

function isDark(hex: string): boolean {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return false;
  const n = parseInt(m[1], 16);
  const lum = 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum < 140;
}
