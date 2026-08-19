-- 고객 상세 필드 — 구 관리자(kk-admin-web)에서 이식: 이메일 + 등급(Шинэ/Тогтмол/VIP)
alter table customers
  add column if not exists email text,
  add column if not exists tier  text not null default 'new' check (tier in ('new', 'reg', 'vip'));
