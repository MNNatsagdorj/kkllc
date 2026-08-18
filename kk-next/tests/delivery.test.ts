// BR-1 (100ш 무료배송) · BR-5 (차량 용량) 단위 테스트 — 03 문서의 예시 그대로
import { describe, it, expect } from 'vitest';
import { calcDelivery, calcTotalWeight, checkCapacity, DELIVERY_FEE_MNT } from '../lib/delivery';

describe('calcDelivery (BR-1)', () => {
  it('한 품목 100ш 이상이면 무료 — Цагаан ×120 + Плитаны ×15', () => {
    const r = calcDelivery([{ qty: 120 }, { qty: 15 }]);
    expect(r.isFree).toBe(true);
    expect(r.fee).toBe(0);
    expect(r.maxQty).toBe(120);
  });

  it('합계 100ш여도 품목별 최대가 100 미만이면 유료 — ×20 + ×44', () => {
    const r = calcDelivery([{ qty: 20 }, { qty: 44 }]);
    expect(r.isFree).toBe(false);
    expect(r.fee).toBe(DELIVERY_FEE_MNT);
    expect(r.remaining).toBe(56); // 100 - 44
  });

  it('정확히 100ш는 무료', () => {
    expect(calcDelivery([{ qty: 100 }]).isFree).toBe(true);
  });

  it('UB 외 지역은 100ш여도 무료 아님', () => {
    expect(calcDelivery([{ qty: 150 }], false).isFree).toBe(false);
  });

  it('빈 주문은 유료 + remaining 100', () => {
    const r = calcDelivery([]);
    expect(r.isFree).toBe(false);
    expect(r.remaining).toBe(100);
  });
});

describe('calcTotalWeight', () => {
  it('기본 25kg/포대', () => {
    expect(calcTotalWeight([{ qty: 200 }])).toBe(5000);
  });
  it('제품별 중량 반영', () => {
    expect(calcTotalWeight([{ qty: 10, weight_kg: 20 }, { qty: 2 }])).toBe(250);
  });
});

describe('checkCapacity (BR-5)', () => {
  it('용량 내면 경고 없음', () => {
    const r = checkCapacity(3000, 3500);
    expect(r.overloaded).toBe(false);
    expect(r.trips).toBe(1);
  });

  it('Блокны ×200 = 5,000кг, Майти 3.5т → 2 рейс 경고', () => {
    const r = checkCapacity(5000, 3500, 'Майти');
    expect(r.overloaded).toBe(true);
    expect(r.trips).toBe(2);
    expect(r.message).toContain('Майти 3.5т');
    expect(r.message).toContain('2 рейс');
  });
});
