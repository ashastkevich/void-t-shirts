# Technology Stack

## Core

| Technology | Version | Role |
|---|---|---|
| [Next.js](https://nextjs.org) | 15.x | Framework — App Router, SSG, ISR, middleware |
| [React](https://react.dev) | 18.x | UI library |
| [TypeScript](https://typescriptlang.org) | 5.x | Type safety across the entire codebase |

## Styling & UI

| Technology | Version | Role |
|---|---|---|
| [Tailwind CSS v4](https://tailwindcss.com) | 4.x | Utility-first CSS — no config file, uses `@tailwindcss/postcss` |
| [motion/react](https://motion.dev) | 12.x | Animations — `AnimatePresence`, spring transitions, gesture variants |
| [lucide-react](https://lucide.dev) | 0.487 | Icon set |
| [Radix UI](https://radix-ui.com) | various | Accessible headless components (49 installed, available for future use) |

**Tailwind v4 note:** There is no `tailwind.config.js`. Configuration is done entirely in CSS via `@source` and `@theme` directives in `src/styles/index.css`. The PostCSS plugin is configured in `postcss.config.mjs`.

## Data & Backend

| Technology | Version | Role |
|---|---|---|
| [Supabase](https://supabase.com) | — | Hosted PostgreSQL database + Auth service |
| [Prisma](https://prisma.io) | 6.x | ORM — type-safe DB queries, schema migrations |
| [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side) | — | Cookie-based session management for Next.js SSR/middleware |

**Prisma connection setup:**
- `DATABASE_URL` → Transaction pooler (port **6543**) — used at runtime by the app
- `DIRECT_URL` → Session pooler (port **5432**) — used by `prisma db push` / migrations

This two-URL pattern is required because serverless environments (Vercel) cannot use persistent DB connections, so runtime queries go through the transaction pooler, while migrations need a session-mode connection.

## State Management

| Technology | Version | Role |
|---|---|---|
| [Zustand](https://zustand-demo.pmnd.rs) | 5.x | Cart state — persisted to `localStorage` via `persist` middleware |
| React `useState` / `useEffect` | — | Local UI state (modals, carousel index, auth user) |

Cart state is intentionally kept in Zustand (not in the DB) for performance — no round-trip needed to add/remove items. The cart is only written to the DB when an order is placed.

## Images

| Technology | Role |
|---|---|
| `next/image` | Automatic WebP conversion, lazy loading, prevents CLS |
| Unsplash | Source for product images (configured in `next.config.ts` remotePatterns) |

All product images use `fill` layout with appropriate `sizes` hints:
- Carousel / product pages: `sizes="(max-width: 768px) 100vw, 50vw"`
- Cart thumbnails: `sizes="80px"`
- Product detail page hero: additionally has `priority` (LCP element, preloaded)

## SEO

| Feature | Implementation |
|---|---|
| Per-product `<title>` | `generateMetadata()` in `app/products/[slug]/page.tsx` |
| Open Graph tags | `openGraph` in metadata exports |
| JSON-LD Product schema | Inline `<script type="application/ld+json">` in product page |
| Sitemap | `app/sitemap.ts` → `/sitemap.xml` |
| Robots | `app/robots.ts` → `/robots.txt` |
| `metadataBase` | Set in `app/layout.tsx` for absolute OG image URL resolution |

## Testing

| Technology | Version | Role |
|---|---|---|
| [Vitest](https://vitest.dev) | 3.x | Unit and component test runner |
| [React Testing Library](https://testing-library.com/react) | — | Component rendering and user-event simulation |
| [Playwright](https://playwright.dev) | — | End-to-end browser automation |

## Deployment

| Service | Role |
|---|---|
| [Vercel](https://vercel.com) | Hosting — automatic deploys from GitHub, edge CDN |
| [Supabase Storage](https://supabase.com/storage) | Product image hosting (public bucket `products`) |
| [GitHub](https://github.com) | Source control, CI trigger |

Vercel runs `npm install` (which triggers `postinstall: prisma generate`) followed by `next build` on every push to `main`.
