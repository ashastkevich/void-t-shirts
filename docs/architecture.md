# Architecture

## System Overview

```
Browser
  │
  ├── Static assets (CDN) ──────── Vercel Edge Network
  │
  └── HTTP requests
        │
        ├── GET /                    ISR page (revalidate: 1h)
        ├── GET /products/[slug]     SSG page (revalidate: 1h)
        ├── GET /sitemap.xml         Static
        ├── GET /robots.txt          Static
        │
        └── Supabase Auth API ────── Supabase (eu-central-1)
              │
              └── Supabase DB ─────── PostgreSQL (Prisma ORM)
```

## Rendering Strategy

| Route | Strategy | Reason |
|---|---|---|
| `/` | ISR (revalidate: 3600s) | Products can change; fresh enough hourly |
| `/products/[slug]` | SSG + ISR | All slugs known at build time; pre-rendered HTML for SEO |
| `/sitemap.xml` | Static | Generated at build from product list |
| `/robots.txt` | Static | Never changes |

**ISR flow:** On first request after expiry, Next.js serves the stale page instantly and regenerates in the background. The next request gets the fresh version.

## Server / Client Boundary

```
Server Components (RSC)                Client Components ("use client")
────────────────────────────           ─────────────────────────────────
app/layout.tsx                         App.tsx
app/page.tsx ──► getAllProducts()         ├── HeroCarousel.tsx
app/products/[slug]/page.tsx             ├── ProductDetailModal.tsx
  ├── generateStaticParams()             ├── Header.tsx (reads Zustand)
  ├── generateMetadata()                 ├── CartDrawer.tsx (reads Zustand)
  └── JSON-LD script tag                 ├── LoginModal.tsx
                                         ├── RegisterModal.tsx
middleware.ts                            ├── AnimatedBackground.tsx
  └── session refresh                    └── ProductPageClient.tsx
```

Server Components fetch data and render HTML. Client Components handle all interactivity, animations, and browser-only APIs (localStorage via Zustand).

## Data Flow

### Homepage

```
page.tsx (server)
  └── await getAllProducts()
        ├── try: db.product.findMany()  ← Prisma → Supabase DB
        └── catch: staticProducts[]     ← hardcoded fallback
  └── <App products={products} />
        └── <HeroCarousel products={products} />
```

### Cart

```
User clicks "Add to cart"
  └── App.tsx: addItem(cartItem)
        └── Zustand store (memory + localStorage "void-cart")
              └── Header reads items.length  →  badge count
              └── CartDrawer reads items[]   →  item list
```

### Auth

```
User submits login form
  └── LoginModal.tsx
        └── createClient().auth.signInWithPassword()
              └── Supabase Auth API
                    └── sets session cookies (via @supabase/ssr)
                          └── middleware.ts refreshes on every request
                                └── App.tsx onAuthStateChange → setUser()
                                      └── Header shows email + logout button
```

## File Structure

```
/
├── middleware.ts              Supabase session refresh
├── next.config.ts             next/image remote patterns
├── prisma/
│   ├── schema.prisma          DB schema (Product, User, Order, OrderItem)
│   └── seed.ts                Seeds 6 products via tsx
├── src/
│   ├── app/
│   │   ├── layout.tsx         Root layout, global metadata
│   │   ├── page.tsx           Homepage (ISR, RSC)
│   │   ├── App.tsx            Client orchestrator (state + wiring)
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── products/[slug]/
│   │       └── page.tsx       Product SSG page
│   ├── components/
│   │   ├── auth/              LoginModal, RegisterModal
│   │   ├── layout/            Header, CartDrawer
│   │   ├── product/           HeroCarousel, ProductDetailModal, ProductPageClient
│   │   └── ui/                AnimatedBackground + 49 shadcn/Radix components
│   ├── lib/
│   │   ├── db.ts              Prisma singleton
│   │   ├── products.ts        getAllProducts(), getProductBySlug()
│   │   ├── orders.ts          createOrder()
│   │   └── supabase/
│   │       ├── client.ts      Browser Supabase client
│   │       └── server.ts      Server Supabase client (cookie-aware)
│   └── store/
│       └── cart.ts            Zustand cart store with localStorage persist
└── docs/                      This documentation
```
