# 01 · 아키텍처 & 기술 스택

## 전체 구조

```
┌─────────────────────────── Vercel (기존 kkllc 프로젝트 확장) ───────────────────────────┐
│                                                                                        │
│  공개 웹사이트 (/)          관리자 앱 (/admin)           기사 PWA (/driver)              │
│  Next.js App Router        Next.js App Router           Next.js + PWA(manifest/SW)    │
│  고객: 카탈로그·장바구니     디스패처: 칸반·주문등록·배정    기사: 배송리스트·체크리스트     │
│  ·주문조회(전화번호)         ·통계·재고                    ·사진증빙·상태변경             │
└───────────────┬──────────────────────┬──────────────────────────┬─────────────────────┘
                │                      │ Realtime 구독              │ FCM 푸시 수신
                ▼                      ▼                          ▼
         ┌────────────────────────────────────────────────┐   ┌──────────────────┐
         │            Supabase (Postgres)                 │   │ Firebase Cloud    │
         │  · DB: orders / order_items / customers /      │   │ Messaging (푸시)  │
         │        products / drivers / vehicles / history │   └──────────────────┘
         │  · Auth: 관리자·기사 로그인                       │
         │  · Realtime: 칸반·기사 리스트 실시간 갱신          │   ┌──────────────────┐
         │  · Storage: delivery-proofs (배송 증빙 사진)      │   │ Google Maps       │
         └────────────────────────────────────────────────┘   │ (deep link 내비)   │
                                                              └──────────────────┘
         Phase 3: Chimege STT (몽골어 음성→텍스트, 폴백 Google STT mn-MN)
```

## 기술 선택 이유

| 영역 | 선택 | 이유 |
|---|---|---|
| 웹사이트 + 관리자 | Next.js (App Router) | 이미 Vercel에 배포 중 — 같은 리포에서 확장, 별도 인프라 불필요 |
| DB / Auth / Realtime / Storage | Supabase | Postgres + 실시간 구독 + 인증 + 파일 저장을 한 서비스로. 무료 티어로 시작 가능 |
| 푸시 알림 | Firebase Cloud Messaging | 웹 푸시(PWA) 표준. 기사에게 배정 알림 |
| 기사 앱 | PWA 먼저 | App Store 심사 불필요, 링크로 바로 설치. 필요 시 나중에 native 전환 |
| 지도 | Google Maps deep link | 앱 내 지도 SDK 없이 `열기` 버튼으로 구글맵 내비 실행 — 개발비용 0 |
| 음성 인식 (P3) | Chimege STT | 몽골어 전문 현지 업체. 폴백: Google STT `mn-MN` |

## 리포 구조 제안

```
kkllc/
├── app/
│   ├── (site)/                 # 공개 웹사이트 → 04-website-spec.md
│   │   ├── page.tsx            # 홈: 히어로 + 제품 + 무료배송 배너
│   │   ├── cart/page.tsx       # 장바구니 + 100ш 미터
│   │   └── track/page.tsx      # 전화번호 주문조회
│   ├── admin/                  # 관리자 앱 → 05-manager-app-spec.md
│   │   ├── layout.tsx          # 사이드바 + 인증 가드
│   │   ├── page.tsx            # 칸반 보드 (Самбар)
│   │   ├── orders/             # 주문 목록·상세
│   │   ├── drivers/            # 기사 관리
│   │   ├── inventory/          # 재고 (P2)
│   │   ├── customers/          # 고객 (P2)
│   │   └── reports/            # 리포트 (P2)
│   ├── driver/                 # 기사 PWA → 06-driver-app-spec.md
│   │   ├── page.tsx            # 오늘의 배송 리스트
│   │   └── orders/[id]/page.tsx# 상세 + 체크리스트 + 완료
│   └── api/                    # Route Handlers
│       ├── orders/route.ts             # POST 주문 생성
│       ├── orders/[id]/status/route.ts # PATCH 상태 전이 (03 문서의 규칙 적용)
│       ├── orders/[id]/assign/route.ts # POST 기사 배정 → FCM 발송
│       ├── track/route.ts              # GET ?phone= 주문조회 (공개)
│       └── push/register/route.ts      # POST 기사 FCM 토큰 등록
├── lib/
│   ├── supabase/ (client.ts, server.ts, admin.ts)
│   ├── delivery.ts             # calcDelivery() — 03 문서의 규칙 구현
│   ├── status.ts               # 상태 enum·라벨·전이 테이블
│   └── fcm.ts                  # 푸시 발송
├── supabase/migrations/        # 02-data-model.md의 SQL
├── public/ (manifest.json, sw.js, icons/)
└── docs/                       # ← 이 문서들
```

## 인증 (Supabase Auth)

- **관리자**: 이메일 + 비밀번호. `profiles.role = 'manager'`.
- **기사**: 전화번호 기반 간편 로그인(전화 + PIN) 또는 관리자가 발급한 매직링크. `profiles.role = 'driver'`, `drivers.user_id`로 연결.
- **고객**: 로그인 없음. 주문조회는 전화번호만으로(공개 API, 민감정보는 상태·품목·금액만 노출).

### RLS(Row Level Security) 원칙

- `orders`: 관리자는 전체 읽기/쓰기. 기사는 `driver_id = 본인`인 행만 읽기 + 상태·사진 필드만 갱신.
- `products`, `customers`: 관리자 전용 쓰기. 제품은 공개 읽기(웹사이트 카탈로그).
- 공개 조회(track)는 서비스 키를 쓰는 Route Handler에서 전화번호로 필터해 최소 필드만 반환.

## 환경변수

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # 서버 전용 (track API, 상태 전이)
NEXT_PUBLIC_FIREBASE_CONFIG=      # FCM 웹 설정 JSON
FIREBASE_SERVER_KEY=              # 서버에서 푸시 발송
CHIMEGE_API_KEY=                  # Phase 3
```

## 도메인 구성

- `kkllc.mn` (또는 현 vercel 도메인) — 공개 사이트
- `/admin` — 관리자 (별도 서브도메인 `admin.kkllc.mn`로 분리해도 무방, 미들웨어로 role 가드)
- `/driver` — 기사 PWA (기사 폰 홈화면에 설치)
