-- KK Admin — core schema (기술설계.md §3)
-- 금액은 BIGINT(₮, 정수), 시간은 TIMESTAMPTZ(UTC 저장).

-- 3.1 category
CREATE TABLE category (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        VARCHAR(80)  NOT NULL UNIQUE,
  icon_key    VARCHAR(20)  NOT NULL DEFAULT 'box',   -- trowel|wall|box|doc|layers|drop|brush
  sort_order  INT          NOT NULL DEFAULT 0,
  active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 3.2 product
CREATE TABLE product (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku          VARCHAR(32)  NOT NULL UNIQUE,
  name         VARCHAR(160) NOT NULL,
  brand        VARCHAR(60),
  category_id  BIGINT       NOT NULL REFERENCES category(id),
  price        BIGINT       NOT NULL CHECK (price >= 0),
  pack         VARCHAR(40),
  stock        INT          NOT NULL DEFAULT 0,
  status       VARCHAR(10)  NOT NULL DEFAULT 'active'
               CHECK (status IN ('active','low','out')),
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_product_category ON product(category_id);
CREATE INDEX idx_product_status   ON product(status);

-- 3.3 customer
CREATE TABLE customer (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name         VARCHAR(120) NOT NULL,
  phone        VARCHAR(20),
  tier         VARCHAR(10)  NOT NULL DEFAULT 'new'
               CHECK (tier IN ('new','reg','vip')),
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_customer_phone ON customer(phone);

-- 3.4 sales_order / sales_order_item
-- 주문 코드 채번 시퀀스(프로토타입 '#3417' 기준 시작)
CREATE SEQUENCE order_code_seq START 3417;

CREATE TABLE sales_order (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code          VARCHAR(16)  NOT NULL UNIQUE,
  customer_id   BIGINT       REFERENCES customer(id),
  customer_name VARCHAR(120) NOT NULL,
  phone         VARCHAR(20),
  total         BIGINT       NOT NULL DEFAULT 0,
  status        VARCHAR(12)  NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','shipping','delivered','canceled')),
  ordered_at    DATE         NOT NULL DEFAULT CURRENT_DATE,
  note          TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_order_status ON sales_order(status);
CREATE INDEX idx_order_date   ON sales_order(ordered_at);

CREATE TABLE sales_order_item (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id     BIGINT NOT NULL REFERENCES sales_order(id) ON DELETE CASCADE,
  product_id   BIGINT REFERENCES product(id),
  product_name VARCHAR(160) NOT NULL,
  unit_price   BIGINT NOT NULL CHECK (unit_price >= 0),
  qty          INT    NOT NULL CHECK (qty > 0),
  line_total   BIGINT NOT NULL
);
CREATE INDEX idx_oi_order ON sales_order_item(order_id);

-- 3.5 production_log
CREATE TABLE production_log (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  prod_date    DATE         NOT NULL,
  product_id   BIGINT       REFERENCES product(id),
  product_name VARCHAR(160) NOT NULL,
  qty          INT          NOT NULL DEFAULT 44 CHECK (qty > 0),
  note         TEXT,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_prod_date ON production_log(prod_date);

-- 3.6 material
CREATE TABLE material (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          VARCHAR(120) NOT NULL UNIQUE,
  unit          VARCHAR(10)  NOT NULL DEFAULT 'кг',
  default_price BIGINT       NOT NULL DEFAULT 0,
  active        BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 3.7 supplier
CREATE TABLE supplier (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       VARCHAR(160) NOT NULL UNIQUE,
  phone      VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.8 purchase
CREATE TABLE purchase (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  purchase_date DATE         NOT NULL,
  material_id   BIGINT       REFERENCES material(id),
  material_name VARCHAR(120) NOT NULL,
  supplier_id   BIGINT       REFERENCES supplier(id),
  supplier_name VARCHAR(160),
  qty           NUMERIC(12,2) NOT NULL CHECK (qty > 0),
  unit          VARCHAR(10)  NOT NULL DEFAULT 'кг',
  unit_price    BIGINT       NOT NULL CHECK (unit_price >= 0),
  total         BIGINT       NOT NULL,
  pay_status    VARCHAR(10)  NOT NULL DEFAULT 'paid'
                CHECK (pay_status IN ('paid','pending')),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_purchase_date     ON purchase(purchase_date);
CREATE INDEX idx_purchase_material ON purchase(material_id);
CREATE INDEX idx_purchase_paystat  ON purchase(pay_status);

-- 3.9 quote
CREATE TABLE quote (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  phone         VARCHAR(20),
  product_text  VARCHAR(200),
  message       TEXT         NOT NULL,
  estimate      BIGINT,
  status        VARCHAR(12)  NOT NULL DEFAULT 'new'
                CHECK (status IN ('new','answered','closed')),
  is_read       BOOLEAN      NOT NULL DEFAULT FALSE,
  received_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_quote_status ON quote(status);

-- app_setting (key-value, §5.10)
CREATE TABLE app_setting (
  key        VARCHAR(60) PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- admin_user (인증, §9)
CREATE TABLE admin_user (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username      VARCHAR(60)  NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  display_name  VARCHAR(120),
  role          VARCHAR(20)  NOT NULL DEFAULT 'ADMIN',
  active        BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 3.10 재고/상태 동기화 트리거
CREATE OR REPLACE FUNCTION sync_product_status() RETURNS trigger AS $$
BEGIN
  NEW.status := CASE
    WHEN NEW.stock <= 0 THEN 'out'
    WHEN NEW.stock < 12 THEN 'low'
    ELSE 'active' END;
  NEW.updated_at := now();
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_product_status
BEFORE INSERT OR UPDATE OF stock ON product
FOR EACH ROW EXECUTE FUNCTION sync_product_status();
