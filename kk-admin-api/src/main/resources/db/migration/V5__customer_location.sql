-- V5: 고객 상세정보(유형/주소/좌표/이메일/메모) + 주문 배달 위치(핀)

ALTER TABLE customer
  ADD COLUMN type    VARCHAR(12) NOT NULL DEFAULT 'individual'
                     CHECK (type IN ('company','business','individual')),
  ADD COLUMN address TEXT,
  ADD COLUMN lat     DOUBLE PRECISION,
  ADD COLUMN lng     DOUBLE PRECISION,
  ADD COLUMN email   VARCHAR(120),
  ADD COLUMN note    TEXT;

ALTER TABLE sales_order
  ADD COLUMN delivery_address TEXT,
  ADD COLUMN delivery_lat     DOUBLE PRECISION,
  ADD COLUMN delivery_lng     DOUBLE PRECISION;
