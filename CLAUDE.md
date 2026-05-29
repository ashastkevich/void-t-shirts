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
- `NEXT_PUBLIC_SUPABASE_URL` — "Project URL" from Supabase project settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — "Publishable key" from Supabase project settings → API (previously labelled "anon public")

**Data layer:** `getAllProducts()` and `getProductBySlug()` try Prisma first and fall back to the hardcoded `staticProducts` array when `DATABASE_URL` is not reachable. This means the app builds and runs without a DB configured — the switch to live data is transparent once credentials are added.

**Prices** are stored in the DB as integers in kopecks (12900 ₽ → `1290000`). The `dbRowToProduct()` function in `lib/products.ts` converts back to the formatted string. The static fallback uses pre-formatted strings.

**Unused packages:** A large set of Radix UI and shadcn-style components is installed but not yet used in the current UI. They are available for future features (e.g., checkout form, order history).
