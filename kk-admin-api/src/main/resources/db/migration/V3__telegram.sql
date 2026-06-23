-- Telegram 연동 (신규 요구사항)

-- 출처/연결 추적
ALTER TABLE quote        ADD COLUMN source VARCHAR(10) NOT NULL DEFAULT 'web';   -- web|telegram|admin
ALTER TABLE quote        ADD COLUMN tg_chat_id BIGINT;
ALTER TABLE sales_order  ADD COLUMN source VARCHAR(10) NOT NULL DEFAULT 'admin'; -- admin|web|telegram
ALTER TABLE sales_order  ADD COLUMN tg_chat_id BIGINT;

-- 봇 사용자(채팅) ↔ 고객 매핑 + 대화 상태머신
CREATE TABLE telegram_user (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  chat_id     BIGINT      NOT NULL UNIQUE,
  username    VARCHAR(64),
  first_name  VARCHAR(120),
  phone       VARCHAR(20),
  customer_id BIGINT REFERENCES customer(id),
  lang        VARCHAR(5)  NOT NULL DEFAULT 'mn',
  state       VARCHAR(40),
  state_data  JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 송수신 감사 로그 (디버깅·재발송용)
CREATE TABLE telegram_outbox (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  chat_id    BIGINT      NOT NULL,
  kind       VARCHAR(20) NOT NULL,
  payload    TEXT,
  sent_ok    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
