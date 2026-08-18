# KKLLC — Project Summary

> Snapshot of the full development process as of 2026-08-18.
> Company: **Kokorozashi Kibou LLC** (Ulaanbaatar, Mongolia) — manufacturing / e-commerce.

---

## 1. What's in this repo

The repo contains **three applications** plus design assets:

| Part | Path | Stack | Status |
|------|------|-------|--------|
| Customer storefront | `src/` (repo root) | React 19, Vite 7, Tailwind CSS 4, framer-motion, react-i18next | Live design done; no backend (static + WhatsApp checkout) |
| Admin backend API | `kk-admin-api/` | Spring Boot 3, Java, PostgreSQL, MyBatis, Flyway, JWT, Telegram bot | Deployed to Render (free tier) |
| Admin web console | `kk-admin-web/` | React 18, TypeScript, Vite 5, TanStack Query, Zustand, Tailwind 4 | Deployed to Vercel |
| Design canvases & docs | `newdesign/`, `admin/` (untracked) | Claude Design `.dc.html` artboards + Korean design docs | Reference material |

---

## 2. Development timeline (from git history)

| Date | Commit | What happened |
|------|--------|---------------|
| 2026-01-09 | `b049e8f`, `c7211f5` | Initial commit, first files uploaded |
| 2026-01-14 | `d0f478c` | Early updates |
| 2026-04-17 | `525a7cb` | **"update all design"** — full design overhaul |
| 2026-06-16 | `fa0ed61` | **"new design"** — navy + orange reskin of the storefront |
| 2026-06-23 | `136bf32` | **Admin system added** — full `kk-admin-api` + `kk-admin-web` + Render/Vercel deploy config (`render.yaml`, `DEPLOY.md`) |
| 2026-06-23 | `f7cab90` | JVM tuned for Render free tier (512MB, slow CPU): `TieredStopAtLevel=1`, `ExitOnOutOfMemoryError`, SerialGC |
| 2026-06-23 | `837ae30` | Vercel rewrite pointed at the live Render backend |

Uncommitted right now: `kkllc_newdesign.zip` deleted, `admin/` folder (design docs/canvases) untracked.

---

## 3. Customer storefront (repo root)

Bilingual (Mongolian / English via i18next) e-commerce site. **No backend** — product data is hardcoded in `src/data/products.js` with sample prices (to be replaced later), and checkout works by composing a **WhatsApp message** to `+976 8820 4057` (`wa.me/97688204057`).

- **Pages** (`src/pages/`): Home, Products, ProductDetail, Cart, Checkout, About, Contact, Delivery.
- **Cart**: client-side only — `src/context/CartContext.jsx` + `cartStore.js`.
- **Home sections** (`src/components/home/`): Hero, CategorySection, FeaturedProducts, ValueProps, Stats, Reviews, CompanyBand, CTASection.
- **Map**: currently a **Google Maps embed iframe** in [`src/components/contact/MapSection.jsx`](src/components/contact/MapSection.jsx#L64-L74) (company pin at ~47.9236, 106.8159). ← *this is the piece to swap for an open-source map.*
- Design: navy + orange palette, rounded-2xl cards, framer-motion scroll animations.
- `dist/` contains a previous build output.

## 4. Admin backend — `kk-admin-api`

Spring Boot + PostgreSQL + MyBatis (XML mappers), Flyway migrations `V1__init` → `V4__seed`. Domain-per-package architecture under `com.kkllc.admin.domain`:

- **Domains**: category, product, customer, order (sales_order + items), production (production_log), material, supplier, purchase, quote (incl. a **public quote endpoint** — `PublicQuoteController`), stock (stock_movement ledger — the core inventory mechanism), dashboard, report, setting.
- **Security**: JWT auth (`JwtService`, `JwtAuthFilter`), seeded default admin `admin / admin1234` (`DataInitializer`).
- **Telegram bot integration** (`telegram/` package): notifications + a conversational admin bot (`KkBot`, `TelegramConversationService`, `TelegramNotifier`); toggled with `TELEGRAM_ENABLED`.
- **Common layer**: `ApiResponse`/`ApiError` envelope, `BizException` + `GlobalExceptionHandler`, `PageResult` pagination.
- Docker: `Dockerfile` + `docker-compose.yml` for local Postgres.

Design intent is documented (in Korean) in `admin/KK Admin 기술설계.md` (full technical design: DDL, REST API spec, MyBatis guide, phasing — Phase 1 MVP is what's built; Phase 2 adds BOM / raw-material inventory) and `admin/KK Admin 재고-매출 상세설계.md` (inventory/revenue detail design).

## 5. Admin web — `kk-admin-web`

TypeScript React SPA: login + feature pages (dashboard, orders, products, categories, customers, purchases, production, quotes, reports, settings). API access via axios to `/api/*`, proxied by **Vercel rewrites** to the Render backend (no CORS handling needed). State: Zustand (`auth`, `search`, `ui`); data: TanStack Query.

## 6. Deployment

Described in [`DEPLOY.md`](DEPLOY.md) (Korean):

- **Backend → Render** (free): `render.yaml` Blueprint provisions Postgres (`kkllc-db`) + web service (Docker). Secrets (`APP_JWT_SECRET`) live only in the Render dashboard. Free-tier caveats: ~50s cold start after 15 min idle; free Postgres expires after ~90 days (test-grade).
- **Frontend → Vercel**: root dir `kk-admin-web`, `/api/*` rewritten to `https://<service>.onrender.com/api/*`.
- Health check: `/actuator/health`.
- ⚠️ Repo is public — never commit secrets.

## 7. Design assets

- `newdesign/` (tracked) and `admin/` (untracked) hold Claude Design canvases: `KK Site.dc.html`, `KK Mobile.dc.html`, `Home Concepts.dc.html`, `KK Admin.dc.html`, `KK Admin standalone.dc.html`, plus **`ios-frame.jsx`** — an iOS device-frame mockup component (useful reference for the planned iOS app).

---

## 8. Planned next steps

### a) Open-source map (replace Google embed)
Current implementation is a Google Maps iframe in `MapSection.jsx`. Recommended swap: **Leaflet + OpenStreetMap tiles** (`leaflet` + `react-leaflet`) or **MapLibre GL** for vector styling. Single insertion point — only `MapSection.jsx` renders a map, so the change is isolated. Keep the `maps.app.goo.gl` deep link or replace with an OSM/geo: link.

### b) Client iOS app
- The backend already exposes everything an app needs behind JWT (`/api/*`), plus a public quote endpoint (`PublicQuoteController`) usable without auth.
- Gaps to close first: there is **no public product/catalog API** (the storefront uses hardcoded `products.js`) — either expose read-only public product endpoints from `kk-admin-api` or add a small BFF.
- CORS won't apply to a native app, but the Render free-tier cold start (~50s) will hurt mobile UX — consider a paid instance or keep-alive before launch.
- `newdesign/KK Mobile.dc.html` and `ios-frame.jsx` are existing mobile design references.

### c) Housekeeping
- Root `README.md` is still the stock Vite template — replace with a real project readme.
- Decide whether to commit or ignore the `admin/` design folder; commit the `kkllc_newdesign.zip` deletion.
- Change the default admin password on the deployed backend; storefront sample prices still need real data.
