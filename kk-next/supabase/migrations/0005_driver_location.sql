-- 기사 실시간 위치 — 배송 중(en_route) 기사 앱이 주기적으로 보고,
-- 고객 /track 지도에 "지금 어디쯤 오는지" 표시용. 이력은 남기지 않고 최신값만.
alter table drivers
  add column last_lat    double precision,
  add column last_lng    double precision,
  add column last_loc_at timestamptz;
