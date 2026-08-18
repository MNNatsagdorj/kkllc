// 02-data-model.md 상태 매핑 + 03-business-rules.md BR-3 전이 테이블.
// 세 화면(웹·관리자·기사) 전부 이 파일 하나만 참조한다.

import type { Order, OrderStatus } from './types';

export const STATUS_LABEL_MN: Record<OrderStatus, string> = {
  new: 'Шинэ',
  assigned: 'Хуваарилсан',
  loading: 'Ачиж байна',
  en_route: 'Замд',
  delivered: 'Хүргэгдсэн',
  cancelled: 'Цуцлагдсан',
};

// 07-design-system.md 상태 색 토큰
export const STATUS_COLOR: Record<OrderStatus, string> = {
  new: '#5CA8FF',
  assigned: '#E3A63B',
  loading: '#C89B5E',
  en_route: '#F07135',
  delivered: '#4CAF7D',
  cancelled: '#E05252',
};

export type Role = 'manager' | 'driver';

interface Transition {
  to: OrderStatus;
  roles: Role[];
  /** 전이 조건 — 실패 시 몽골어 사유 반환, 통과 시 null (BR-3) */
  guard?: (order: Order) => string | null;
}

export const TRANSITIONS: Record<OrderStatus, Transition[]> = {
  new: [
    {
      to: 'assigned', roles: ['manager'],
      guard: (o) => (o.driver_id ? null : 'Жолооч сонгогдоогүй байна'),
    },
    { to: 'cancelled', roles: ['manager'] },
  ],
  assigned: [
    { to: 'loading', roles: ['driver'] },
    { to: 'cancelled', roles: ['manager'] },
  ],
  loading: [
    {
      to: 'en_route', roles: ['driver'],
      // BR-4: 전 품목 적재 체크 완료 전 출발 불가
      guard: (o) => (o.items.every((i) => i.loaded) ? null : 'Бүх барааг ачиж дуусаагүй байна'),
    },
  ],
  en_route: [
    {
      to: 'delivered', roles: ['driver'],
      // BR-6: 사진 증빙 없이 완료 불가
      guard: (o) => (o.proof_photo_url ? null : 'Хүргэлтийн зураг оруулаагүй байна'),
    },
  ],
  delivered: [],
  cancelled: [],
};

/** 전이 가능 여부 검사 — 통과 시 {ok:true}, 실패 시 몽골어 사유. 역방향 전이는 관리자만(오조작 복구). */
export function canTransition(order: Order, to: OrderStatus, role: Role):
  { ok: true } | { ok: false; reason: string } {
  const t = TRANSITIONS[order.status]?.find((x) => x.to === to);
  if (!t) {
    // 역방향/임의 전이: 관리자에게만 허용, 이력 기록은 호출부 책임 (BR-3)
    if (role === 'manager') return { ok: true };
    return { ok: false, reason: `Шилжилт боломжгүй: ${order.status} → ${to}` };
  }
  if (!t.roles.includes(role)) return { ok: false, reason: 'Эрх хүрэлцэхгүй байна' };
  const err = t.guard?.(order) ?? null;
  return err ? { ok: false, reason: err } : { ok: true };
}

// 고객 조회 페이지 컨베이어 5단계 (02 문서)
export const TRACK_STEPS_MN = [
  'Бүртгэсэн', 'Жолоочид өгсөн', 'Ачсан', 'Замд явж байна', 'Хүргэгдсэн',
] as const;

/** 주문 상태 → 컨베이어 현재 스텝 인덱스 (cancelled는 -1) */
export function trackStep(status: OrderStatus): number {
  switch (status) {
    case 'new': return 0;
    case 'assigned': return 1;
    case 'loading': return 2;
    case 'en_route': return 3;
    case 'delivered': return 4;
    case 'cancelled': return -1;
  }
}
