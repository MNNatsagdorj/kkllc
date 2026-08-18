-- 02-data-model.md — 초기 스키마
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
-- Supabase 대시보드 또는 CLI: supabase storage buckets create delivery-proofs
