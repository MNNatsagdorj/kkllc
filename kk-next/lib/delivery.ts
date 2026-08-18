// 03-business-rules.md BR-1(100ш 무료배송) · BR-5(차량 용량 경고).
// 모든 규칙은 서버에서 계산하고 화면은 결과만 표시한다.
// 임계값·배송비는 상수 분리 — 추후 "총액 기준" 전환 대비 (BR-1).

export const FREE_DELIVERY_THRESHOLD = 100;   // ш
export const DELIVERY_FEE_MNT = 30_000;

export interface DeliveryCalc {
  isFree: boolean;
  fee: number;        // 0 또는 30,000
  maxQty: number;     // 품목별 최대 수량 (판정 기준)
  remaining: number;  // 100ш 미터 문구용
}

/** BR-1: 한 품목이라도 100ш 이상이면 UB 시내 무료배송. 판정은 합계가 아니라 max(line.qty). */
export function calcDelivery(items: { qty: number }[], withinUB = true): DeliveryCalc {
  const maxQty = items.length ? Math.max(...items.map((i) => i.qty)) : 0;
  const isFree = withinUB && maxQty >= FREE_DELIVERY_THRESHOLD;
  return {
    isFree,
    fee: isFree ? 0 : DELIVERY_FEE_MNT,
    maxQty,
    remaining: Math.max(0, FREE_DELIVERY_THRESHOLD - maxQty),
  };
}

/** 100ш 미터 문구 (미달 시) — 웹/관리자 공통 */
export function meterMessage(calc: DeliveryCalc): string {
  return calc.isFree
    ? 'ҮНЭГҮЙ ХҮРГЭЛТ — 100ш давсан ✓'
    : `Дахин ${calc.remaining} ширхэг нэмбэл хүргэлт ҮНЭГҮЙ болно — одоогоор хүргэлт ${DELIVERY_FEE_MNT.toLocaleString('en-US')}₮.`;
}

/** 주문 총중량 (kg) = Σ(qty × weight_kg). 기본 25kg/포대. */
export function calcTotalWeight(items: { qty: number; weight_kg?: number }[]): number {
  return items.reduce((sum, i) => sum + i.qty * (i.weight_kg ?? 25), 0);
}

export interface CapacityCheck {
  overloaded: boolean;
  trips: number;      // рейс 수 = ceil(weight / capacity)
  message?: string;   // 경고 문구 (차단 아님 — 관리자 판단으로 진행 가능)
}

/** BR-5: 차량 용량 초과 시 경고 + 회차(рейс) 제안. */
export function checkCapacity(totalWeightKg: number, capacityKg: number, vehicleModel?: string): CapacityCheck {
  if (totalWeightKg <= capacityKg) return { overloaded: false, trips: 1 };
  const trips = Math.ceil(totalWeightKg / capacityKg);
  const t = (kg: number) => `${(kg / 1000).toFixed(1)}т`;
  return {
    overloaded: true,
    trips,
    message: `${vehicleModel ?? 'Машин'} ${t(capacityKg)} — энэ ачаа ${t(totalWeightKg)} → ${trips} рейс шаардлагатай`,
  };
}
