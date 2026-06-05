# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm i              # install dependencies (also runs prisma generate via postinstall)
npm run dev        # start Next.js dev server
npm run build      # production build
npm run db:push    # push Prisma schema to Supabase (requires .env.local with DATABASE_URL)
npm run db:seed    # seed 6 products into the DB
npm run db:studio  # open Prisma Studio
npm test           # run all unit + component tests (Vitest, no server needed)
npm run test:watch # Vitest in watch mode
npm run test:coverage # coverage report (src/lib/ and src/store/ target ≥ 90%)
npm run test:e2e   # run Playwright E2E tests (auto-starts dev server)
npm run test:e2e:ui # Playwright with interactive UI
```

## Architecture

Next.js 15 App Router on Vercel. Premium t-shirt store for the Russian market (VOID brand).

**Rendering strategy:**
- `/` — ISR, revalidates every hour. Server Component fetches products via `getAllProducts()`, passes as props to `<App>` client component.
- `/products/[slug]` — SSG via `generateStaticParams`, also revalidates hourly. Includes JSON-LD Product schema.
- `/sitemap.xml`, `/robots.txt` — static, generated from `app/sitemap.ts` and `app/robots.ts`.

**Source layout:**
```
src/
  app/
    App.tsx               ← "use client" orchestrator — modal/carousel state, auth listener
    layout.tsx            ← root layout, global metadata, metadataBase
    page.tsx              ← async RSC, awaits getAllProducts(), renders <App products={…}>
    products/[slug]/      ← SSG product detail page + JSON-LD
    sitemap.ts / robots.ts
  components/
    layout/Header.tsx     ← reads cart count from Zustand, shows user email when logged in
    layout/CartDrawer.tsx ← reads cart items from Zustand, onCheckout prop
    auth/LoginModal.tsx   ← controlled form → supabase.auth.signInWithPassword()
    auth/RegisterModal.tsx← controlled form → supabase.auth.signUp(), success screen
    product/HeroCarousel.tsx        ← autoplay, slide variants, next/image
    product/ProductDetailModal.tsx  ← modal overlay with size/qty/add-to-cart
    product/ProductPageClient.tsx   ← standalone product page (SSG route)
    ui/AnimatedBackground.tsx       ← animated cyan grid
  lib/
    products.ts  ← getAllProducts() / getProductBySlug() — Prisma with static fallback
    db.ts        ← Prisma singleton (hot-reload safe)
    orders.ts    ← createOrder(userId, items) — writes Order + OrderItems to DB
    supabase/client.ts   ← browser Supabase client
    supabase/server.ts   ← server Supabase client (cookie-aware, for RSC/middleware)
  store/
    cart.ts      ← Zustand store, persisted to localStorage as "void-cart"
prisma/
  schema.prisma  ← Product, User, Order, OrderItem
  seed.ts        ← upserts 6 products (prices in kopecks: 12900 ₽ = 1290000)
middleware.ts    ← Supabase session refresh on every non-static request
```

**Tech stack:**
- Framework: Next.js 15, App Router
- Animations: `motion/react` — all animated components are `"use client"`
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss` — no `tailwind.config.js`
- Images: `next/image` with `fill` + `sizes` throughout; Unsplash configured in `next.config.ts`
- Icons: `lucide-react`
- Cart: Zustand + `persist` middleware (localStorage)
- Auth: Supabase Auth (email/password)
- DB: Supabase PostgreSQL + Prisma ORM (v6)
- Brand color: `#00d9ff` (cyan) on pure black `#000`

**Path alias:** `@` → `src/`

**Environment variables** (see `.env.local.example`):
- `DATABASE_URL` — Supabase PostgreSQL connection string (use Transaction pooler on port 6543 for Vercel)
- `DIRECT_URL` — direct (non-pooled) connection string, required by Prisma for migrations/`db push` (use Session pooler on port 5432, or the direct connection on port 5432)
- `NEXT_PUBLIC_SUPABASE_URL` — "Project URL" from Supabase project settings → API
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — "Publishable key" from Supabase project settings → API (previously labelled "anon public")

**Data layer:** `getAllProducts()` and `getProductBySlug()` try Prisma first and fall back to the hardcoded `staticProducts` array when `DATABASE_URL` is not reachable. This means the app builds and runs without a DB configured — the switch to live data is transparent once credentials are added.

**Prices** are stored in the DB as integers in kopecks (12900 ₽ → `1290000`). The `dbRowToProduct()` function in `lib/products.ts` converts back to the formatted string. The static fallback uses pre-formatted strings.

**Unused packages:** A large set of Radix UI and shadcn-style components is installed but not yet used in the current UI. They are available for future features (e.g., checkout form, order history).

## Testing

**Stack:** Vitest + React Testing Library (unit/component), Playwright (E2E).

**Test layout:**
```
src/
  store/cart.test.ts                        ← Zustand store logic
  lib/
    products.test.ts                        ← price conversion, DB fallback
    orders.test.ts                          ← total calculation, order structure
    admin.test.ts                           ← isAdmin() role check
    actions/products.test.ts                ← slug generation, price×100, auth guard
  components/
    layout/CartDrawer.test.tsx
    layout/Header.test.tsx
    auth/LoginModal.test.tsx
    auth/RegisterModal.test.tsx
    product/ProductDetailModal.test.tsx
    admin/ProductForm.test.tsx
    admin/AdminSidebar.test.tsx
  app/admin/DeleteButton.test.tsx
  app/api/admin/upload/route.test.ts        ← 401/400/500, filename, extension
middleware.test.ts                          ← /admin redirect for non-admin
tests/e2e/
  home.spec.ts, cart.spec.ts, auth.spec.ts
  product-page.spec.ts, checkout.spec.ts, admin.spec.ts
```

**Key mocking conventions:**
- Prisma (`./db`) is always mocked — tests never touch the DB.
- Supabase client (`@/lib/supabase/client`, `@/lib/supabase/server`) is mocked per test file.
- `motion/react` is globally mocked in `vitest.setup.ts` — `AnimatePresence` renders children directly, `motion.*` renders plain HTML tags (no animations in tests).
- `next/image` → plain `<img>`, `next/link` → plain `<a>`, `next/navigation` → `vi.fn()` stubs.
- E2E tests live in `tests/e2e/` and are excluded from the Vitest run (`vitest.config.ts` exclude list).

**E2E environment variables:**
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — required to run the authenticated admin tests; without them those tests are skipped automatically.
