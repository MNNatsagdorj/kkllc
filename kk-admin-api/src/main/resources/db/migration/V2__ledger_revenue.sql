-- 재고 원장 + 매출/수익성 뷰 (재고-매출 상세설계.md)

-- 1.2 stock_movement (불변 원장)
CREATE TABLE stock_movement (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id    BIGINT       NOT NULL REFERENCES product(id),
  qty           INT          NOT NULL,
  reason        VARCHAR(20)  NOT NULL
                CHECK (reason IN ('production','sale','purchase_in',
                                  'adjust','reversal','initial')),
  ref_type      VARCHAR(20),
  ref_id        BIGINT,
  reversal_of   BIGINT REFERENCES stock_movement(id),
  balance_after INT,
  note          TEXT,
  created_by    BIGINT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT chk_qty_nonzero CHECK (qty <> 0)
);
CREATE INDEX idx_sm_product ON stock_movement(product_id, created_at);
CREATE INDEX idx_sm_ref     ON stock_movement(ref_type, ref_id);

-- 2.3 매출 인식용 컬럼 (배송완료일 기준)
ALTER TABLE sales_order ADD COLUMN delivered_at DATE;

-- §4 집계 뷰
CREATE VIEW v_customer_stats AS
SELECT c.id, c.name, c.phone, c.tier,
       COUNT(o.id)              AS orders_count,
       COALESCE(SUM(o.total),0) AS total_spent
FROM customer c
LEFT JOIN sales_order o ON o.customer_id = c.id AND o.status <> 'canceled'
GROUP BY c.id;

CREATE VIEW v_sales_monthly AS
SELECT date_trunc('month', ordered_at)::date AS month, SUM(total) AS revenue
FROM sales_order WHERE status <> 'canceled'
GROUP BY 1 ORDER BY 1;

CREATE VIEW v_purchase_monthly AS
SELECT date_trunc('month', purchase_date)::date AS month, SUM(total) AS cost
FROM purchase GROUP BY 1 ORDER BY 1;

CREATE VIEW v_purchase_by_material AS
SELECT date_trunc('month', purchase_date)::date AS month,
       material_name, SUM(total) AS amount
FROM purchase GROUP BY 1,2;

-- 2.4 매출(배송완료 기준)
CREATE VIEW v_revenue_monthly AS
SELECT date_trunc('month', delivered_at)::date AS month,
       SUM(total) AS revenue
FROM sales_order
WHERE status = 'delivered' AND delivered_at IS NOT NULL
GROUP BY 1;

-- 2.5 수익성 = 매출 ⋈ 매입
CREATE VIEW v_profit_monthly AS
SELECT m.month,
       COALESCE(r.revenue,0) AS revenue,
       COALESCE(c.cost,0)    AS cost,
       COALESCE(r.revenue,0) - COALESCE(c.cost,0) AS gross_profit,
       CASE WHEN COALESCE(r.revenue,0) > 0
            THEN ROUND((COALESCE(r.revenue,0)-COALESCE(c.cost,0))::numeric
                       / r.revenue * 100)
            ELSE 0 END AS margin_pct
FROM (
  SELECT month FROM v_revenue_monthly
  UNION SELECT month FROM v_purchase_monthly
) m
LEFT JOIN v_revenue_monthly  r ON r.month = m.month
LEFT JOIN v_purchase_monthly c ON c.month = m.month
ORDER BY m.month;
