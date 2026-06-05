# Testing

## Stack

| Tool | Purpose |
|---|---|
| [Vitest](https://vitest.dev) | Unit and component tests (no server needed) |
| [React Testing Library](https://testing-library.com/react) | Component rendering and interaction |
| [Playwright](https://playwright.dev) | End-to-end browser tests |

---

## Commands

```bash
npm test                  # run all unit + component tests once
npm run test:watch        # Vitest in watch mode
npm run test:coverage     # coverage report (src/lib/ and src/store/ target ≥ 90%)
npm run test:e2e          # Playwright E2E (auto-starts dev server on port 3000)
npm run test:e2e:ui       # Playwright with interactive UI
```

---

## Test Layout

```
src/
  store/cart.test.ts                        Zustand store logic
  lib/
    products.test.ts                        price conversion, DB fallback
    orders.test.ts                          total calculation, order structure
    admin.test.ts                           isAdmin() role check
    actions/products.test.ts                slug generation, price×100, auth guard
  components/
    layout/CartDrawer.test.tsx
    layout/Header.test.tsx
    auth/LoginModal.test.tsx
    auth/RegisterModal.test.tsx
    product/ProductDetailModal.test.tsx
    admin/ProductForm.test.tsx
    admin/AdminSidebar.test.tsx
  app/
    admin/DeleteButton.test.tsx
    api/admin/upload/route.test.ts          401/400/500 cases, filename, extension
middleware.test.ts                          /admin redirect for non-admin users
tests/e2e/
  home.spec.ts
  cart.spec.ts
  auth.spec.ts
  product-page.spec.ts
  checkout.spec.ts
  admin.spec.ts
```

---

## Global Mocks (`vitest.setup.ts`)

Applied to every test file automatically:

| Mock target | What it does |
|---|---|
| `motion/react` | `AnimatePresence` renders children directly; `motion.*` renders plain HTML tags — no animations in tests |
| `next/image` | Rendered as a plain `<img>` |
| `next/link` | Rendered as a plain `<a>` |
| `next/navigation` | `useRouter`, `usePathname`, `useSearchParams` → `vi.fn()` stubs |

---

## Per-file Mocking Conventions

- **Prisma (`./db`)** is always mocked — tests never touch the database.
- **Supabase client** (`@/lib/supabase/client`, `@/lib/supabase/server`) is mocked per test file with `vi.mock(...)`.
- **Server Actions** (`@/lib/actions/products`) are mocked in component tests that use `ProductForm`.

---

## E2E Environment Variables

The authenticated admin E2E tests require real credentials. Without them, those tests are automatically skipped:

| Variable | Purpose |
|---|---|
| `ADMIN_EMAIL` | Email of an account with `app_metadata.role = 'admin'` |
| `ADMIN_PASSWORD` | Password for that account |

Set these in `.env.local` for local E2E runs. On CI, add them as repository secrets.

---

## Coverage Targets

Coverage is collected only from `src/lib/` and `src/store/`. Target: **≥ 90%** line coverage.

Run `npm run test:coverage` and open `coverage/index.html` to inspect per-file results.
