-- 인증서·시험성적서 (Гэрчилгээ) — 관리자가 업로드, 공개 사이트에 노출
create table certificates (
  id         uuid primary key default gen_random_uuid(),
  title_mn   text not null,                                        -- 'Чанарын гэрчилгээ MNS ...'
  type       text not null check (type in ('certificate', 'test_report')),
  issued_by  text,                                                 -- 발급기관
  issued_at  date,
  product_id uuid references products(id) on delete set null,      -- 회사 전체 서류면 null
  file_path  text not null,                                        -- storage 'certificates' 버킷 경로
  is_active  boolean not null default true,
  sort       int not null default 0,
  created_at timestamptz not null default now()
);

alter table certificates enable row level security;
create policy "certs public read" on certificates for select using (is_active);
create policy "certs manager all" on certificates for all
  using (is_manager()) with check (is_manager());

-- 공개 버킷 (홈페이지 노출용) — 쓰기/삭제는 관리자만
insert into storage.buckets (id, name, public) values ('certificates', 'certificates', true)
  on conflict (id) do nothing;
create policy "certs storage read" on storage.objects for select
  using (bucket_id = 'certificates');
create policy "certs storage manager write" on storage.objects for insert
  to authenticated with check (bucket_id = 'certificates' and is_manager());
create policy "certs storage manager delete" on storage.objects for delete
  to authenticated using (bucket_id = 'certificates' and is_manager());
