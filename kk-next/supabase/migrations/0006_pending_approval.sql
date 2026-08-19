-- 웹사이트 주문 승인 단계 — 웹 주문은 pending으로 들어와 관리자 승인(pending→new) 후 파이프라인 진입
alter type order_status add value if not exists 'pending' before 'new';
