-- Phase 2: 재고 수불 원장 + Зээл(외상) 장부 (08-roadmap)

-- ===== 재고 수불 =====
create table stock_moves (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id),
  delta       integer not null,                 -- +입고 / -판매·조정
  reason      text not null check (reason in ('in','sale','adjust')),
  order_id    bigint references orders(id) on delete set null,
  note        text,
  created_by  uuid,
  created_at  timestamptz not null default now()
);
create index stock_moves_product_idx on stock_moves (product_id, created_at desc);

alter table stock_moves enable row level security;
create policy "stock_moves manager read" on stock_moves for select using (is_manager());

-- 입고/조정 등록 (관리자 전용, 원자적)
create or replace function stock_in(p_product_id uuid, p_qty integer, p_note text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_manager() then raise exception 'manager only'; end if;
  if p_qty = 0 then raise exception 'qty must not be zero'; end if;
  update products set stock_qty = stock_qty + p_qty where id = p_product_id;
  insert into stock_moves (product_id, delta, reason, note, created_by)
  values (p_product_id, p_qty, case when p_qty > 0 then 'in' else 'adjust' end, p_note, auth.uid());
end $$;

-- ===== Зээл 상환 기록 =====
create table credit_payments (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id),
  amount_mnt  integer not null check (amount_mnt > 0),
  note        text,
  created_by  uuid,
  created_at  timestamptz not null default now()
);
alter table credit_payments enable row level security;
create policy "credit manager read" on credit_payments for select using (is_manager());

create or replace function credit_repay(p_customer_id uuid, p_amount integer, p_note text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_manager() then raise exception 'manager only'; end if;
  update customers set credit_balance = credit_balance - p_amount where id = p_customer_id;
  insert into credit_payments (customer_id, amount_mnt, note, created_by)
  values (p_customer_id, p_amount, p_note, auth.uid());
end $$;

-- ===== delivered 효과 통합: 재고 차감 + 수불 기록 + Зээл 누적 =====
-- (0003의 decrement_stock_for_order를 대체 — 서비스 롤 API에서 호출)
create or replace function apply_delivered_effects(p_order_id bigint) returns void
language plpgsql security definer set search_path = public as $$
declare o record;
begin
  select * into o from orders where id = p_order_id;
  if o is null then raise exception 'order not found'; end if;

  update products p
  set stock_qty = p.stock_qty - i.qty
  from order_items i
  where i.order_id = p_order_id and i.product_id = p.id;

  insert into stock_moves (product_id, delta, reason, order_id)
  select i.product_id, -i.qty, 'sale', p_order_id
  from order_items i where i.order_id = p_order_id;

  if o.payment_method = 'credit' and o.customer_id is not null then
    update customers
    set credit_balance = credit_balance + o.subtotal_mnt + o.delivery_fee_mnt
    where id = o.customer_id;
  end if;
end $$;
