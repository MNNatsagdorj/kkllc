# KK LLC — 주문·배송 파이프라인 (Next.js + Supabase)

`../docs/` 스펙 기반. 세 화면이 같은 DB·같은 상태 언어를 공유한다:

| 경로 | 화면 | 스펙 |
|---|---|---|
| `/` | 공개 웹사이트 (Phase 2에서 개편) | docs/04 |
| `/admin` | 관리자 칸반·주문등록·기사배정 | docs/05 |
| `/driver` | 기사 PWA — 체크리스트·사진증빙·완료 | docs/06 |

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # Supabase 값 입력
npm run dev
```

## Supabase 셋업 (최초 1회)

1. [supabase.com](https://supabase.com) 프로젝트 생성 → `.env.local`에 URL / anon key / service role key 입력.
2. SQL Editor에서 `supabase/migrations/` 의 0001 → 0002 → 0003 순서로 실행.
3. **계정 생성** (Auth → Add user):
   - 관리자: 이메일+비밀번호 생성 후 `profiles`에 `(id, 'manager', '이름')` insert.
   - 기사: 이메일 `driver-{전화숫자}@kkllc.mn`, 비밀번호 = PIN 으로 생성 후
     `profiles`에 `(id, 'driver', '이름')` insert + `drivers.user_id` 연결.
4. (푸시) Firebase 프로젝트 → 웹앱 설정 JSON을 `NEXT_PUBLIC_FIREBASE_CONFIG`에,
   Cloud Messaging 서버 키를 `FIREBASE_SERVER_KEY`에. vapidKey는 설정 JSON에 `vapidKey` 필드로 포함.

## 테스트

```bash
npm test        # vitest — BR-1/BR-3/BR-5 규칙 단위 테스트
```

## 구조

- `lib/delivery.ts` — BR-1 100ш 무료배송 + BR-5 차량 용량 (규칙은 전부 서버 계산)
- `lib/status.ts` — 상태 enum·몽골어 라벨·전이 테이블 (세 화면 공통의 단일 소스)
- `app/api/` — 주문 생성 / 상태 전이 / 기사 배정(+FCM 푸시) / 푸시 토큰 등록
- `proxy.ts` — /admin·/driver 세션 가드 (Next 16: middleware → proxy)
- `public/sw.js` — 오프라인 캐시 + FCM 백그라운드 푸시
