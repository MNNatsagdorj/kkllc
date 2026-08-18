// 컨베이어 스텝 표시 — 고객 조회(5단계)·기사 상세(미니) 공용 (02/07 문서)
import { TRACK_STEPS_MN, trackStep } from '@/lib/status';
import type { OrderStatus } from '@/lib/types';

export function Conveyor({ status, compact = false }: { status: OrderStatus; compact?: boolean }) {
  const now = trackStep(status);
  const size = compact ? 22 : 30;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {TRACK_STEPS_MN.map((label, i) => {
        const done = now > i || status === 'delivered';
        const current = now === i && status !== 'delivered';
        const color = done ? 'var(--st-done)' : current ? 'var(--st-way)' : '#C9C2B0';
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < TRACK_STEPS_MN.length - 1 ? 1 : 'none', minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: size }}>
              <div className={current ? 'step-now' : undefined}
                style={{ width: size, height: size, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done || current ? color : 'transparent', border: `2px solid ${color}`, color: '#fff', fontSize: compact ? 10 : 12, fontWeight: 800 }}>
                {done ? '✓' : ''}
              </div>
              {!compact && (
                <span style={{ fontSize: 10, fontWeight: 600, color: done || current ? 'var(--site-text)' : '#A29A85', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              )}
            </div>
            {i < TRACK_STEPS_MN.length - 1 && (
              <div style={{ flex: 1, height: 2, margin: '0 4px', marginBottom: compact ? 0 : 16, background: done ? 'var(--st-done)' : '#D8D2C0' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
