// 100ш 무료배송 미터 — 웹 장바구니·관리자 드로어 공통 시그니처 컴포넌트 (BR-1)
import { FREE_DELIVERY_THRESHOLD, meterMessage, type DeliveryCalc } from '@/lib/delivery';

export function Meter({ calc, dark = false }: { calc: DeliveryCalc; dark?: boolean }) {
  const pct = Math.min(100, (calc.maxQty / FREE_DELIVERY_THRESHOLD) * 100);
  const track = dark ? 'rgba(239,236,227,.12)' : '#E3DECF';
  const fill = calc.isFree
    ? 'linear-gradient(90deg, #3E9B6B, #4CAF7D)'
    : 'linear-gradient(90deg, var(--kraft-deep), var(--kraft))';
  return (
    <div>
      <div style={{ position: 'relative', height: 13, borderRadius: 999, background: track, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: fill, transition: 'width .25s ease' }} />
        <span className="mono" style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', fontSize: 9, fontWeight: 700, color: dark ? 'var(--mut)' : '#8A8062' }}>
          100ш
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
        {calc.isFree && (
          <span className="st-chip" style={{ '--st': 'var(--st-done)' } as React.CSSProperties}>ҮНЭГҮЙ ХҮРГЭЛТ</span>
        )}
        <span style={{ fontSize: 12, lineHeight: 1.45, color: calc.isFree ? 'var(--st-done)' : (dark ? 'var(--mut)' : '#7A7258') }}>
          {meterMessage(calc)}
        </span>
      </div>
    </div>
  );
}
