# 배포 가이드 — 관리자(Admin) 테스트 배포

- **백엔드** `kk-admin-api` (Spring Boot + PostgreSQL) → **Render** (무료)
- **프론트엔드** `kk-admin-web` (Vite + React) → **Vercel**
- 프론트는 Vercel `rewrites` 로 `/api/*` 를 Render 백엔드로 프록시 → **코드 수정·CORS 설정 불필요**.

> ⚠️ 이 레포는 **public** 입니다. 시크릿(JWT 등)은 절대 커밋하지 말고 각 플랫폼 대시보드에만 입력하세요.
> ⚠️ Render 무료 서비스는 15분 미사용 시 잠들어 **첫 요청에 ~50초 콜드스타트**가 있고, 무료 Postgres 는 약 90일 후 만료됩니다(테스트용으로 적합).

---

## 0. 사전 준비 — GitHub 에 푸시

`kk-admin-api`, `kk-admin-web` 는 아직 커밋되지 않았습니다. Render/Vercel 은 Git 레포에서 배포하므로 먼저 푸시합니다.

```bash
git add kk-admin-api kk-admin-web render.yaml DEPLOY.md
git commit -m "chore: add Render/Vercel deploy config for admin"
git push origin main
```

---

## 1. 백엔드 → Render

### 방법 A) Blueprint (한 번에, 추천)
1. Render 대시보드 → **New → Blueprint** → 이 레포(`MNNatsagdorj/kkllc`) 선택 → **Apply**.
   - `render.yaml` 이 자동으로 **Postgres(kkllc-db)** + **웹서비스(kk-admin-api)** 를 생성하고 DB 환경변수를 연결합니다.
2. 생성 후 `kk-admin-api` 서비스 → **Environment** 에서 `sync:false` 항목 입력:
   - `APP_JWT_SECRET` = (아래 명령으로 생성한 Base64 256-bit 값)
     ```bash
     openssl rand -base64 32
     ```
   - `CORS_ORIGINS` = (rewrites 방식이면 비워두거나 `*`. baseURL 직접호출 방식만 Vercel 도메인 입력)
3. **Manual Deploy → Deploy latest commit** (또는 자동 배포 대기).

### 방법 B) 대시보드 수동 (Blueprint 이 안 먹힐 때)
1. **New → PostgreSQL** → plan `Free`, region `Singapore` → 생성 → **Internal Database URL** 메모.
2. **New → Web Service** → 레포 선택 → **Root Directory = `kk-admin-api`** → Render 가 Dockerfile 자동 감지.
3. **Environment** 에 변수 추가:
   | Key | Value |
   |-----|-------|
   | `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USERNAME` / `DB_PASSWORD` | 1번 Postgres 의 내부 접속 정보 |
   | `APP_JWT_SECRET` | `openssl rand -base64 32` 결과 |
   | `TELEGRAM_ENABLED` | `false` |
   | `JAVA_TOOL_OPTIONS` | `-XX:MaxRAMPercentage=70 -XX:+UseSerialGC -Xss512k` |
4. Health Check Path = `/actuator/health` → 생성.

### 확인
- 배포 로그에 `Default admin created: admin / admin1234` 와 Flyway `V1~V4` 적용 로그가 보이면 성공.
- `https://<서비스>.onrender.com/actuator/health` → `{"status":"UP"}`
- 백엔드 도메인(예: `kk-admin-api.onrender.com`)을 메모 → 다음 단계에서 사용.

---

## 2. 프론트엔드 → Vercel

1. `kk-admin-web/vercel.json` 의 `<YOUR-RENDER-URL>` 을 **1단계 백엔드 도메인**으로 교체(끝 슬래시 없음):
   ```json
   "destination": "https://kk-admin-api.onrender.com/api/:path*"
   ```
   커밋·푸시.
2. Vercel → **Add New → Project** → 레포 선택 → **Root Directory = `kk-admin-web`**.
   - Framework: Vite (자동 감지), Build: `npm run build`, Output: `dist` (기본값 그대로).
3. **Deploy**.

### 확인
- Vercel 도메인 접속 → 로그인 화면 → **admin / admin1234** 로 로그인.
- (첫 로그인은 Render 콜드스타트로 ~50초 걸릴 수 있음. 잠시 후 재시도)

---

## 3. 배포 후 권장

- 관리자 비밀번호 `admin1234` 즉시 변경.
- `APP_JWT_SECRET` 는 운영용으로 새로 생성한 값 유지(공유/커밋 금지).

---

## 트러블슈팅

| 증상 | 원인/해결 |
|------|-----------|
| 로그인 시 네트워크 에러 | `vercel.json` 의 백엔드 URL 오타/슬래시 확인. Render 서비스가 깨어났는지(health 200) 확인 |
| 백엔드 부팅 실패 `IllegalArgumentException: Base64` | `APP_JWT_SECRET` 이 유효한 Base64 가 아님 → `openssl rand -base64 32` 값으로 교체 |
| DB 연결 실패 | DB 와 웹서비스가 **같은 region** 인지, `DB_*` 변수가 내부 접속정보인지 확인. 안 되면 `DB_URL` 에 `?sslmode=require` 추가 |
| 메모리 부족(OOM) | `JAVA_TOOL_OPTIONS` 의 `MaxRAMPercentage` 를 60 으로 낮춤 |
| Blueprint 가 Dockerfile 못 찾음 | 방법 B(수동)로 전환, Root Directory = `kk-admin-api` |

---

## 대안: rewrites 대신 baseURL 직접 호출
CORS 를 직접 다루고 싶다면 `kk-admin-web/src/lib/api.ts` 의 `baseURL` 을 환경변수로 바꾸고
(`baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api'`), Vercel 에 `VITE_API_BASE_URL=https://<백엔드>/api` 설정,
Render 에 `CORS_ORIGINS=https://<vercel-도메인>` 설정. 단계가 늘어나므로 기본은 rewrites 권장.
