# KK Admin Web (React + TypeScript)

KKLLC 관리자 SPA. **Vite + React 18 + TypeScript + TanStack Query + Zustand + Tailwind v4**. UI 언어 몽골어(키릴).

> 이 폴더는 독립 프로젝트입니다(추후 별도 레포로 분리 가능). 백엔드: `../kk-admin-api`.

## 빠른 시작

```bash
npm install
npm run dev      # http://localhost:5173 (·/api → localhost:8080 프록시)
```

백엔드(`kk-admin-api`)가 8080에서 실행 중이어야 합니다. 로그인: **admin / admin1234**.

```bash
npm run build    # tsc 타입체크 + 프로덕션 번들(dist/)
npm run preview  # 빌드 결과 미리보기
```

## 구조

```
src/
├─ lib/        api(axios+JWT 인터셉터)·format(₮)·queryClient·labels(몽골어 enum)
├─ store/      auth(zustand, localStorage)·ui(toast)
├─ components/ ui(Card/Badge/Table/Modal/...)·layout(AppLayout: Sidebar+Topbar)
├─ features/   dashboard orders products categories production
│              purchases quotes customers reports settings · auth(Login)
└─ types.ts    백엔드 DTO 대응 타입
```

## 화면 ↔ 라우트

`/`(대시보드) `/orders` `/products` `/categories` `/production` `/purchases`
`/quotes`(split-view 인박스) `/customers` `/reports` `/settings`(일반/알림/**Telegram** 탭) · `/login`

- 모든 서버 상태는 TanStack Query, mutation 성공 시 관련 쿼리 invalidate.
- 금액 표기 `fmtMNT` (`133,000 ₮`), 상태 배지는 부록 A enum 라벨 매핑.
- 설정의 **Telegram 탭**에서 연동 on/off·관리자 chat id 관리(봇 토큰은 백엔드 env).

## 프로덕션 배포 참고

개발은 Vite 프록시(`/api`)를 사용합니다. 프로덕션에서는 리버스 프록시(nginx 등)로 `/api`를 백엔드에 연결하거나 `lib/api.ts`의 `baseURL`을 절대 URL로 교체하세요.
