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
        ├── GET /admin/**            Server-rendered, admin-only (force-dynamic)
        ├── GET /sitemap.xml         Static
        ├── GET /robots.txt          Static
        ├── POST /api/admin/upload   Image upload → Supabase Storage
        ├── GET /auth/callback       Supabase OAuth/email-link code exchange
        │
        └── Supabase Auth API ────── Supabase (eu-central-1)
              │
              └── Supabase DB ─────── PostgreSQL (Prisma ORM)
              └── Supabase Storage ── "products" bucket (product images)
```

## Rendering Strategy

| Route | Strategy | Reason |
|---|---|---|
| `/` | ISR (revalidate: 3600s) | Products can change; fresh enough hourly |
| `/products/[slug]` | SSG + ISR | All slugs known at build time; pre-rendered HTML for SEO |
| `/admin/**` | `force-dynamic` | Always-fresh product list; gated behind `isAdmin()` |
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
app/admin/layout.tsx ── isAdmin()        ├── RegisterModal.tsx
app/admin/page.tsx ── getAllProducts()   ├── AnimatedBackground.tsx
app/admin/products/new/page.tsx          ├── ProductPageClient.tsx
app/admin/products/[id]/edit/page.tsx    ├── AdminSidebar.tsx
app/auth/callback/route.ts               ├── ProductForm.tsx (create/edit)
                                         ├── DeleteButton.tsx
middleware.ts                            └── ResetPasswordClient.tsx
  └── session refresh
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

### Password Reset

```
User clicks "Forgot password" in LoginModal
  └── supabase.auth.resetPasswordForEmail(email, { redirectTo: /auth/callback?next=/auth/reset-password })
        └── Supabase sends email link
              └── User clicks link → GET /auth/callback?code=…
                    └── route.ts: exchangeCodeForSession(code) → sets recovery session
                          └── redirect → /auth/reset-password
                                └── ResetPasswordClient: supabase.auth.updateUser({ password })
                                      └── signs out recovery session, redirects to /
```

### Admin Panel

```
Request to /admin/**
  └── AdminLayout: isAdmin() checks supabase.auth.getUser().app_metadata.role === 'admin'
        ├── not admin → redirect('/')
        └── admin → render AdminSidebar + page content

Admin creates/edits a product
  └── ProductForm (client)
        ├── file upload → POST /api/admin/upload
        │     └── getSupabaseAdmin().storage.from('products').upload(...)
        │           └── returns public URL array
        └── form submit → Server Action (createProduct / updateProduct)
              └── requireAdmin() + db.product.create/update()
                    └── revalidatePath('/'), revalidatePath('/admin')
                          └── redirect('/admin')

Admin deletes a product
  └── DeleteButton (client, two-step confirm)
        └── deleteProduct(id) Server Action
              └── db.product.delete() → revalidatePath
```

## File Structure

```
/
├── middleware.ts              Supabase session refresh
├── next.config.ts             next/image remote patterns
├── vitest.config.ts           Vitest unit/component test config
├── vitest.setup.ts            Global mocks (motion/react, next/*, supabase)
├── playwright.config.ts       Playwright E2E config
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
│   │   ├── admin/
│   │   │   ├── layout.tsx     isAdmin() guard + AdminSidebar wrapper
│   │   │   ├── page.tsx       Product list table (force-dynamic)
│   │   │   ├── DeleteButton.tsx  Two-step delete with Server Action
│   │   │   └── products/
│   │   │       ├── new/page.tsx       New product form
│   │   │       └── [id]/edit/page.tsx Edit product form
│   │   ├── api/admin/upload/
│   │   │   └── route.ts       POST — uploads files to Supabase Storage "products" bucket
│   │   ├── auth/
│   │   │   ├── callback/route.ts       Code exchange → session → redirect
│   │   │   └── reset-password/
│   │   │       ├── page.tsx
│   │   │       └── ResetPasswordClient.tsx
│   │   └── products/[slug]/
│   │       └── page.tsx       Product SSG page
│   ├── components/
│   │   ├── admin/             AdminSidebar, ProductForm
│   │   ├── auth/              LoginModal, RegisterModal
│   │   ├── layout/            Header, CartDrawer
│   │   ├── product/           HeroCarousel, ProductDetailModal, ProductPageClient
│   │   └── ui/                AnimatedBackground + 49 shadcn/Radix components
│   ├── lib/
│   │   ├── db.ts              Prisma singleton
│   │   ├── admin.ts           isAdmin() — checks app_metadata.role via server Supabase client
│   │   ├── products.ts        getAllProducts(), getProductBySlug()
│   │   ├── orders.ts          createOrder()
│   │   ├── actions/
│   │   │   ├── products.ts    Server Actions: createProduct, updateProduct, deleteProduct
│   │   │   └── orders.ts      Server Actions: order-related mutations
│   │   └── supabase/
│   │       ├── client.ts      Browser Supabase client
│   │       ├── server.ts      Server Supabase client (cookie-aware, for RSC/middleware)
│   │       └── admin.ts       Service-role Supabase client (for Storage uploads)
│   └── store/
│       └── cart.ts            Zustand cart store with localStorage persist
├── tests/
│   └── e2e/                   Playwright specs (home, cart, auth, product, checkout, admin)
└── docs/                      This documentation
```
