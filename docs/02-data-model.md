# 02 · 데이터 모델 (Supabase / Postgres)

한 개의 DB를 세 화면이 공유합니다. 아래 SQL을 `supabase/migrations/0001_init.sql`로 저장해 적용하세요.

## ERD 요약

```
customers 1 ──< orders >── 1 drivers ── 1 vehicles
                 │
                 └──< order_items >── 1 products
                 └──< order_status_history
```

## 마이그레이션 SQL

```sql
-- ===== ENUMS =====
create type order_status as enum
  ('new','assigned','loading','en_route','delivered','cancelled');
create type payment_method as enum ('cash','transfer','credit');  -- Бэлэн·Данс·Зээл
create type customer_type as enum ('individual','shop');          -- 개인·대리점
create type order_source as enum ('manager','website','voice');

-- ===== 제품 · 재고 =====
create table products (
  id          uuid primary key default gen_random_uuid(),
  sku         text unique not null,          -- 'WHITE_PUTTY' 등
  name_mn     text not null,                 -- 'Цагаан замаск'
  use_mn      text,                          -- 'Гүйцээх өнгөлгөө · дотор хана'
  weight_kg   numeric not null default 25,
  price_mnt   integer not null,              -- 개당(포대) 가격
  stock_qty   integer not null default 0,
  band_color  text,                          -- 포대 라벨 색 (07-design-system 참조)
  is_active   boolean not null default true
);

-- ===== 고객 =====
create table customers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,                 -- 'Мөнх трейд ХХК' / 'Болд'
  phone       text not null,                 -- '9911-2233' (검색 키)
  type        customer_type not null default 'individual',
  district    text,                          -- БЗД·СХД·ХУД·БГД·ЧД·СБД ...
  address     text,
  lat double precision, lng double precision,
  credit_balance integer not null default 0, -- Зээл 장부 (Phase 2)
  note        text,
  created_at  timestamptz not null default now()
);
create index customers_phone_idx on customers (phone);

-- ===== 차량 · 기사 =====
create table vehicles (
  id          uuid primary key default gen_random_uuid(),
  model       text not null,                 -- 'Майти', 'Портер'
  plate       text not null,                 -- '01-23 УБА'
  capacity_kg integer not null               -- 3500 등
);

create table drivers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users,    -- Supabase Auth 연결
  name        text not null,                 -- 'Ганбаа'
  phone       text not null,
  vehicle_id  uuid references vehicles(id),
  fcm_token   text,                          -- 푸시용
  is_active   boolean not null default true
);

-- ===== 주문 =====
create table orders (
  id            bigint generated always as identity (start with 1024) primary key,
  customer_id   uuid references customers(id),
  status        order_status not null default 'new',
  district      text,
  address       text not null,
  lat double precision, lng double precision,
  total_qty     integer not null default 0,        -- 서버에서 items 합계로 계산
  total_weight_kg numeric not null default 0,
  subtotal_mnt  integer not null default 0,
  delivery_fee_mnt integer not null default 0,     -- 0 또는 30000
  is_free_delivery boolean not null default false,
  payment_method payment_method,
  cash_amount_mnt integer,                         -- 기사 현금 수금액 표시용
  driver_id     uuid references drivers(id),
  scheduled_date date,
  source        order_source not null default 'manager',
  note          text,
  proof_photo_url text,                            -- delivered 필수 조건
  created_by    uuid,
  created_at    timestamptz not null default now(),
  delivered_at  timestamptz
);
create index orders_status_idx  on orders (status);
create index orders_driver_idx  on orders (driver_id, scheduled_date);

-- ===== 주문 품목 =====
create table order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    bigint not null references orders(id) on delete cascade,
  product_id  uuid not null references products(id),
  qty         integer not null check (qty > 0),
  unit_price_mnt integer not null,                 -- 주문 시점 가격 스냅샷
  batch_no    text,                                -- 'Б-2608-14' (적재 체크리스트 표기)
  loaded      boolean not null default false       -- 기사 체크 여부
);

-- ===== 상태 이력 (누가 언제 바꿨나 자동 기록) =====
create table order_status_history (
  id          uuid primary key default gen_random_uuid(),
  order_id    bigint not null references orders(id) on delete cascade,
  status      order_status not null,
  changed_by  uuid,
  changed_at  timestamptz not null default now()
);

-- ===== Storage =====
-- 버킷 'delivery-proofs' 생성 (비공개). 경로: {order_id}/{timestamp}.jpg
```

## 상태 enum ↔ 몽골어 라벨 매핑

세 화면 전부 이 매핑 하나만 사용합니다(`lib/status.ts`).

| DB 값 | UI 라벨(MN) | 색상 토큰 | 변경 주체 |
|---|---|---|---|
| `new` | Шинэ | `--st-new` #5CA8FF | 시스템/관리자 |
| `assigned` | Хуваарилсан | `--st-asg` #E3A63B | 관리자 |
| `loading` | Ачиж байна | `--st-load` #C89B5E | 기사 |
| `en_route` | Замд | `--st-way` #F07135 | 기사 |
| `delivered` | Хүргэгдсэн | `--st-done` #4CAF7D | 기사 |
| `cancelled` | Цуцлагдсан | `--st-cancel` #E05252 | 관리자 |

고객 조회 페이지 컨베이어 표기(5단계): Бүртгэсэн → Жолоочид өгсөн → Ачсан → Замд явж байна → Хүргэгдсэн.

## TypeScript 타입 (`lib/types.ts`)

```ts
export type OrderStatus =
  | 'new' | 'assigned' | 'loading' | 'en_route' | 'delivered' | 'cancelled';

export const STATUS_LABEL_MN: Record<OrderStatus, string> = {
  new: 'Шинэ', assigned: 'Хуваарилсан', loading: 'Ачиж байна',
  en_route: 'Замд', delivered: 'Хүргэгдсэн', cancelled: 'Цуцлагдсан',
};

export interface OrderItem {
  product_id: string; qty: number; unit_price_mnt: number;
  batch_no?: string; loaded: boolean;
}

export interface Order {
  id: number;                       // #1024 형식으로 표시
  customer_id: string;
  status: OrderStatus;
  district?: string; address: string;
  total_qty: number; total_weight_kg: number;
  subtotal_mnt: number; delivery_fee_mnt: number; is_free_delivery: boolean;
  payment_method?: 'cash' | 'transfer' | 'credit';
  driver_id?: string;
  proof_photo_url?: string;
  items: OrderItem[];
}
```

## 시드 데이터

```sql
insert into products (sku, name_mn, use_mn, price_mnt, band_color) values
 ('WHITE_PUTTY','Цагаан замаск','Гүйцээх өнгөлгөө · дотор хана',13500,'#F4F1E8'),
 ('BLACK_PUTTY','Хар замаск','Суурь тэгшилгээ · түрхэц',9500,'#2A2A2E'),
 ('BLOCK_GLUE','Блокны цавуу','Блок, хөнгөн бетон өрлөг',8900,'#3E9B6B'),
 ('TILE_GLUE','Плитаны цавуу','Плита, керамик наалт',14500,'#3D7DD8'),
 ('KNAUF_GYPSUM','Knauf гипс','Албан ёсны борлуулалт',28000,'#0A9BDC');

insert into vehicles (model, plate, capacity_kg) values
 ('Майти','01-23 УБА',3500),
 ('Портер','45-67 УНА',1500);

-- drivers: Ганбаа(Майти), Дорж(Портер) — user_id는 Auth 계정 생성 후 연결
```

UB 지역구 상수: `['БЗД','СХД','ХУД','БГД','ЧД','СБД','БНД','НД']` — select 옵션으로 사용, 자유 입력도 허용.
