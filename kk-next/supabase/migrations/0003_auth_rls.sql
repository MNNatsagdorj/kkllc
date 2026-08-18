-- 01-architecture.md — 인증(profiles) + RLS + Realtime + Storage
-- 원칙: 쓰기는 대부분 서비스 롤 Route Handler 경유(규칙은 서버에서 계산).
--       클라이언트 직접 쓰기는 기사 적재 체크(order_items.loaded)와 FCM 토큰만.

-- ===== 프로필 (역할) =====
create table profiles (
  id    uuid primary key references auth.users on delete cascade,
  role  text not null check (role in ('manager','driver')),
  name  text
);

alter table profiles enable row level security;
create policy "own profile read" on profiles for select
  using (auth.uid() = id);

-- 역할 판별 헬퍼 (RLS 안에서 사용)
create or replace function is_manager() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from profiles where id = auth.uid() and role = 'manager') $$;

create or replace function my_driver_id() returns uuid
language sql stable security definer set search_path = public as
$$ select id from drivers where user_id = auth.uid() limit 1 $$;

-- ===== RLS =====
alter table products             enable row level security;
alter table customers            enable row level security;
alter table vehicles             enable row level security;
alter table drivers              enable row level security;
alter table orders               enable row level security;
alter table order_items          enable row level security;
alter table order_status_history enable row level security;

-- 제품: 공개 읽기(웹사이트 카탈로그), 관리자 쓰기
create policy "products public read" on products for select using (true);
create policy "products manager write" on products for all
  using (is_manager()) with check (is_manager());

-- 고객: 관리자 전체, 기사는 본인 주문의 고객만 읽기
create policy "customers manager all" on customers for all
  using (is_manager()) with check (is_manager());
create policy "customers driver read" on customers for select
  using (exists (select 1 from orders o
                 where o.customer_id = customers.id and o.driver_id = my_driver_id()));

-- 차량·기사: 로그인 사용자 읽기, 관리자 쓰기, 기사는 본인 fcm_token 갱신
create policy "vehicles auth read" on vehicles for select using (auth.uid() is not null);
create policy "vehicles manager write" on vehicles for all
  using (is_manager()) with check (is_manager());
create policy "drivers auth read" on drivers for select using (auth.uid() is not null);
create policy "drivers manager write" on drivers for all
  using (is_manager()) with check (is_manager());
create policy "drivers self token" on drivers for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 주문: 관리자 전체, 기사는 본인 배정분 읽기.
-- 상태 전이·배정 등 쓰기는 서비스 롤 API만 수행(BR-3 검증을 우회 못 하게).
create policy "orders manager all" on orders for all
  using (is_manager()) with check (is_manager());
create policy "orders driver read" on orders for select
  using (driver_id = my_driver_id());

-- 주문 품목: 관리자 전체, 기사는 본인 주문분 읽기 + loaded 체크 갱신(BR-4)
create policy "items manager all" on order_items for all
  using (is_manager()) with check (is_manager());
create policy "items driver read" on order_items for select
  using (exists (select 1 from orders o
                 where o.id = order_items.order_id and o.driver_id = my_driver_id()));
create policy "items driver load" on order_items for update
  using (exists (select 1 from orders o
                 where o.id = order_items.order_id and o.driver_id = my_driver_id()))
  with check (exists (select 1 from orders o
                 where o.id = order_items.order_id and o.driver_id = my_driver_id()));
-- 기사에게는 loaded 컬럼만 허용 (컬럼 단위 권한)
revoke update on order_items from authenticated;
grant  update (loaded) on order_items to authenticated;

-- 상태 이력: 관리자 읽기 (기록은 서비스 롤 API가 삽입)
create policy "history manager read" on order_status_history for select
  using (is_manager());

-- ===== delivered 시 재고 차감 (BR-3) — 서비스 롤 API에서 호출 =====
create or replace function decrement_stock_for_order(p_order_id bigint) returns void
language plpgsql security definer set search_path = public as $$
begin
  update products p
  set stock_qty = p.stock_qty - i.qty
  from order_items i
  where i.order_id = p_order_id and i.product_id = p.id;
end $$;

-- ===== Realtime (칸반·기사 리스트 실시간 갱신) =====
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table order_items;

-- ===== Storage: 배송 증빙 사진 (BR-6) =====
insert into storage.buckets (id, name, public) values ('delivery-proofs','delivery-proofs', false)
  on conflict (id) do nothing;
create policy "proofs auth upload" on storage.objects for insert
  to authenticated with check (bucket_id = 'delivery-proofs');
create policy "proofs auth read" on storage.objects for select
  to authenticated using (bucket_id = 'delivery-proofs');
