// 상태 태그 — 세 화면 공통 (02 매핑 + 07 스타일)
import { STATUS_COLOR, STATUS_LABEL_MN } from '@/lib/status';
import type { OrderStatus } from '@/lib/types';

export function StatusChip({ status }: { status: OrderStatus }) {
  return (
    <span className="st-chip" style={{ '--st': STATUS_COLOR[status] } as React.CSSProperties}>
      {STATUS_LABEL_MN[status]}
    </span>
  );
}
