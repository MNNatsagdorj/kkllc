# KK Admin API (Spring Boot)

KKLLC(замаск 제조·판매 공장) 관리자 백엔드. **Spring Boot 3 + Java 21 + MyBatis + PostgreSQL + Flyway**, JWT 인증, Telegram 봇 연동.

> 설계 출처: `../admin/KK Admin 기술설계.md`, `../admin/KK Admin 재고-매출 상세설계.md`
> 이 폴더는 독립 프로젝트입니다(추후 별도 레포로 분리 가능).

## 빠른 시작

```bash
# 1) DB 기동 (Postgres 16, 호스트 포트 5440 → 컨테이너 5432)
docker compose up -d

# 2) 앱 실행 (Flyway 마이그레이션 자동 적용 + 시드)
DB_URL=jdbc:postgresql://localhost:5440/kkllc DB_USERNAME=kkllc DB_PASSWORD=kkllc \
  mvn spring-boot:run
```

- API base: `http://localhost:8080/api`
- 기본 관리자: **admin / admin1234** (최초 기동 시 자동 생성 — 운영 시 변경)
- 로그인: `POST /api/auth/login {username,password}` → `accessToken`(15분) + `refreshToken`

## 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `DB_URL` | `jdbc:postgresql://localhost:5432/kkllc` | JDBC URL (compose는 5440) |
| `DB_USERNAME`/`DB_PASSWORD` | `kkllc`/`kkllc` | DB 계정 |
| `CORS_ORIGINS` | `http://localhost:5173` | 허용 오리진(관리자 웹) |
| `APP_JWT_SECRET` | (dev 기본값) | Base64 256-bit. **운영 필수 변경** |
| `TELEGRAM_ENABLED` | `false` | 봇 long-polling 활성화 |
| `TELEGRAM_BOT_TOKEN` | - | @BotFather 토큰 |
| `TELEGRAM_ADMIN_CHAT_ID` | - | 관리자 알림 chat id (DB 설정으로도 가능) |

## 구조

```
com.kkllc.admin
├─ common/        ApiResponse·PageResult·BizException·예외핸들러·이벤트
├─ config/        WebConfig(CORS)·DataInitializer(기본 관리자)
├─ security/      JWT(발급/필터)·SecurityConfig·AuthController
├─ domain/
│  ├─ category product order(+item) stock(원장) production
│  ├─ purchase material supplier customer quote
│  └─ report dashboard setting
└─ telegram/      KkBot(long-polling)·대화FSM·관리자회신·이벤트알림
```

## 핵심 정책 (재고-매출 상세설계 채택)

- **재고 원장**(`stock_movement`) + `product.stock` 캐시. 모든 증감은 원장 1건 + 캐시 갱신을 한 트랜잭션으로.
- **출고 = 배송완료(delivered) 시점**(정책 A). 조건부 UPDATE(`stock >= qty`)로 과판매 차단(409).
- **매출 = delivered + delivered_at 기준**(`v_revenue_monthly`). 수익성 = 매출 − 월 매입(`v_profit_monthly`).
- 주문 취소(delivered→canceled): 출고 되돌림(reversal, 멱등) + 상태변경 한 트랜잭션.

## Telegram 연동 (3방향)

1. **고객 → 봇**: `/start` → 메뉴(가격문의/주문) → `quote`/`sales_order`(source=telegram) 적재.
2. **관리자 ← 알림**: 신규 주문/문의 발생 시(웹·봇 무관) 도메인 이벤트 → 관리자 chat로 인라인 버튼 푸시.
3. **관리자 → 봇 회신**: 버튼으로 견적금액 회신/주문 상태변경 → 고객에게 자동 DM.

`telegram.enabled=true` + 토큰 설정 시에만 봇/송신 빈이 등록됩니다(미설정 시 앱은 정상 구동, Telegram만 비활성).

## DB 정합성 점검

```sql
-- 원장 합계 vs 캐시 불일치 제품 (0행이면 정합)
SELECT p.id, p.stock, COALESCE(SUM(m.qty),0) ledger
FROM product p LEFT JOIN stock_movement m ON m.product_id=p.id
GROUP BY p.id HAVING p.stock <> COALESCE(SUM(m.qty),0);
```
