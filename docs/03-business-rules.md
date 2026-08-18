# 03 · 비즈니스 규칙

모든 규칙은 **서버에서 계산**합니다. 화면은 결과를 보여줄 뿐, 수기로 판단하지 않습니다.

## BR-1 · 100ш 무료배송 규칙 (핵심)

- **한 종류의 제품**을 100개(ш) 이상 주문하면 울란바토르 시내 배송 무료.
- 판정 기준은 주문 전체 수량이 아니라 **품목별 최대 수량**: `max(line.qty) >= 100`.
  - 예: Цагаан ×120 + Плитаны ×15 → 무료 (120 ≥ 100)
  - 예: Цагаан ×20 + Блокны ×44 = 64ш → 유료 (어느 품목도 100 미만)
- 임계값(100)과 배송비(30,000₮)는 하드코딩하지 말고 상수/설정 테이블로 — 나중에 "총액 기준"으로 바뀔 수 있음.

### 구현 (`lib/delivery.ts`)

```ts
export const FREE_DELIVERY_THRESHOLD = 100;   // ш
export const DELIVERY_FEE_MNT = 30_000;

export function calcDelivery(items: { qty: number }[], withinUB = true) {
  const maxQty = items.length ? Math.max(...items.map(i => i.qty)) : 0;
  const isFree = withinUB && maxQty >= FREE_DELIVERY_THRESHOLD;
  return {
    isFree,
    fee: isFree ? 0 : DELIVERY_FEE_MNT,
    maxQty,
    remaining: Math.max(0, FREE_DELIVERY_THRESHOLD - maxQty), // 미터 문구용
  };
}
```

### UI 규칙 — "100ш 미터"

웹사이트 장바구니와 관리자 주문 폼에 공통으로 표시하는 시그니처 컴포넌트.

- 진행바: `maxQty / 100`, 목표선에 `100ш` 라벨.
- 미달 시 문구: `Дахин {remaining} ширхэг нэмбэл хүргэлт ҮНЭГҮЙ болно — одоогоор хүргэлт 30,000₮.`
- 달성 시: 바가 초록으로 채워지고 `ҮНЭГҮЙ ХҮРГЭЛТ` 배지 표시.

## BR-2 · 배송비와 픽업

- 100ш 미만 → 배송비 **30,000₮** 또는 공장(СХД) 직접 픽업 선택.
- 배송비는 `orders.delivery_fee_mnt`에 저장(0 또는 30000), 합계와 분리 표기.

## BR-3 · 상태 전이 규칙

허용 전이만 API에서 통과시킵니다. 전이마다 `order_status_history`에 자동 기록.

| 현재 → 다음 | 조건 | 주체 |
|---|---|---|
| new → assigned | `driver_id` 지정됨 | 관리자 |
| assigned → loading | — | 기사 |
| loading → en_route | **모든 `order_items.loaded = true`** | 기사 |
| en_route → delivered | **`proof_photo_url` 존재** | 기사 |
| new/assigned → cancelled | 사유 note 기록 | 관리자 |

- `delivered` 진입 시: `delivered_at` 기록, 재고 차감(`products.stock_qty -= qty`), 일일 리포트 집계 대상.
- 역방향 전이는 관리자만(오조작 복구용), 이력 남김.

## BR-4 · 적재 체크리스트

- 기사는 포대(품목)별로 체크(`order_items.loaded`). 배치번호(`batch_no`, 예: Б-2608-14) 표기.
- **전부 체크되기 전에는 "Замд гарах" 버튼 비활성** — 공장에서 빠뜨리는 사고 방지. (BR-3의 loading→en_route 조건과 동일)

## BR-5 · 차량 용량 경고

- `total_weight_kg = Σ(qty × weight_kg)`. 기본 25kg/포대.
- 배정 시 `total_weight_kg > vehicle.capacity_kg`이면 경고 + 회차 제안:
  `рейс 수 = ceil(total_weight_kg / capacity_kg)` → 예: Блокны ×200 = 5,000кг, Майти 3.5т → "2 рейс".
- 차단이 아니라 **경고**(관리자가 판단해 진행 가능).

## BR-6 · 배송 사진 증빙 (필수)

- 배송 완료마다 하차 사진 최소 1장 → Supabase Storage `delivery-proofs/{order_id}/…`.
- 사진 없이는 delivered 전이 불가(BR-3). 분쟁 예방 목적.

## BR-7 · 결제

- 유형: **Бэлэн(현금) · Данс(계좌이체) · Зээл(외상)**.
- 현금이면 기사 화면에 수금액 크게 표시(`cash_amount_mnt`). 영수증(падаан)은 관리자 측에서 자동 생성(P2).
- Зээл은 Phase 2: `customers.credit_balance` 장부에 누적, 상환 기록.

## BR-8 · 음성 입력 (Phase 3)

- 파이프라인: 🎙 녹음 → Chimege STT(몽골어) → 필드 파싱(이름·전화·지역구·품목×수량) → 폼 자동 채움(파란 하이라이트) → **관리자가 확인 후 저장**.
- **절대 자동 저장하지 않음** — 음성은 폼을 채울 뿐, 최종 결정은 항상 사람.
- 파싱된 품목에도 BR-1을 즉시 적용해 미터 표시.
- 폴백: Google STT `mn-MN`. 실패 시 그냥 수기 입력.

## BR-9 · 공통 원칙

- 세 화면은 같은 상태 이름·같은 색을 사용(02 문서의 매핑 테이블만 참조).
- 금액은 정수 MNT, 표기는 `1,837,500₮` 천단위 콤마.
- 주문번호는 `#1024` 형식(orders.id, 1024부터 시작).
