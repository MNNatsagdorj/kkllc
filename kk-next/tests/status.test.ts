// BR-3 상태 전이 규칙 단위 테스트
import { describe, it, expect } from 'vitest';
import { canTransition, trackStep } from '../lib/status';
import type { Order } from '../lib/types';

const base = (over: Partial<Order>): Order => ({
  id: 1027,
  status: 'new',
  address: 'Да хүрээ зах',
  total_qty: 135,
  total_weight_kg: 3375,
  subtotal_mnt: 1_837_500,
  delivery_fee_mnt: 0,
  is_free_delivery: true,
  source: 'manager',
  items: [
    { product_id: 'a', qty: 120, unit_price_mnt: 13500, loaded: false },
    { product_id: 'b', qty: 15, unit_price_mnt: 14500, loaded: false },
  ],
  ...over,
});

describe('canTransition (BR-3)', () => {
  it('new → assigned: 기사 미지정이면 거부', () => {
    const r = canTransition(base({}), 'assigned', 'manager');
    expect(r.ok).toBe(false);
  });

  it('new → assigned: 기사 지정 시 관리자 허용', () => {
    const r = canTransition(base({ driver_id: 'd1' }), 'assigned', 'manager');
    expect(r.ok).toBe(true);
  });

  it('assigned → loading: 기사 허용', () => {
    expect(canTransition(base({ status: 'assigned' }), 'loading', 'driver').ok).toBe(true);
  });

  it('loading → en_route: 전 품목 loaded 전에는 거부 (BR-4)', () => {
    const r = canTransition(base({ status: 'loading' }), 'en_route', 'driver');
    expect(r.ok).toBe(false);
  });

  it('loading → en_route: 전부 체크되면 허용', () => {
    const o = base({ status: 'loading' });
    o.items = o.items.map((i) => ({ ...i, loaded: true }));
    expect(canTransition(o, 'en_route', 'driver').ok).toBe(true);
  });

  it('en_route → delivered: 사진 없으면 거부 (BR-6)', () => {
    expect(canTransition(base({ status: 'en_route' }), 'delivered', 'driver').ok).toBe(false);
  });

  it('en_route → delivered: 사진 있으면 허용', () => {
    const o = base({ status: 'en_route', proof_photo_url: '1027/1.jpg' });
    expect(canTransition(o, 'delivered', 'driver').ok).toBe(true);
  });

  it('기사는 임의 전이(역방향) 불가, 관리자는 복구용으로 가능', () => {
    const o = base({ status: 'delivered' });
    expect(canTransition(o, 'en_route', 'driver').ok).toBe(false);
    expect(canTransition(o, 'en_route', 'manager').ok).toBe(true);
  });

  it('new/assigned → cancelled: 관리자만', () => {
    expect(canTransition(base({}), 'cancelled', 'manager').ok).toBe(true);
    expect(canTransition(base({}), 'cancelled', 'driver').ok).toBe(false);
  });
});

describe('trackStep — 컨베이어 매핑', () => {
  it('상태별 스텝 인덱스', () => {
    expect(trackStep('new')).toBe(0);
    expect(trackStep('assigned')).toBe(1);
    expect(trackStep('loading')).toBe(2);
    expect(trackStep('en_route')).toBe(3);
    expect(trackStep('delivered')).toBe(4);
    expect(trackStep('cancelled')).toBe(-1);
  });
});
