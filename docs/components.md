# Components

All interactive components are marked `"use client"` since they use animations (`motion/react`), browser APIs, or React hooks. Server Components are limited to data-fetching page shells.

---

## App.tsx — Central Orchestrator

`src/app/App.tsx`

The single client-side state owner. Holds all shared UI state and passes it down via props. Does not contain any rendering logic of its own.

**State managed:**
| State | Type | Purpose |
|---|---|---|
| `currentIndex` | `number` | Active carousel slide |
| `showModal` | `boolean` | Product detail modal visibility |
| `selectedSize` | `string` | Selected size (shared between carousel and modal) |
| `showLogin/Register/Cart` | `boolean` | Modal visibility flags |
| `user` | `User \| null` | Supabase Auth session user |

**Auth lifecycle:** On mount, calls `supabase.auth.getUser()` for the initial session, then subscribes to `onAuthStateChange` for real-time updates. Wrapped in `try/catch` — if Supabase is not configured, auth is silently disabled.

---

## Layout Components

### Header — `src/components/layout/Header.tsx`

Fixed top bar. Reads cart count directly from Zustand (no prop needed from App).

| Prop | Type | Purpose |
|---|---|---|
| `currentIndex` | `number` | Highlights the active slide dot |
| `total` | `number` | Number of dots to render |
| `onGoToSlide` | `(i) => void` | Dot click handler |
| `onCartOpen` | `() => void` | Opens CartDrawer |
| `onLoginOpen` | `() => void` | Opens LoginModal |
| `onRegisterOpen` | `() => void` | Opens RegisterModal |
| `user` | `string \| null` | If set, shows email + logout button instead of Login/Register |
| `onLogout` | `() => void` | Signs out via Supabase |

**Auth-aware rendering:** When `user` is non-null, the Login and Register buttons are replaced with the user's email (truncated) and a logout button.

### CartDrawer — `src/components/layout/CartDrawer.tsx`

Slide-in panel from the right. Reads items and `removeItem` directly from Zustand.

| Prop | Type | Purpose |
|---|---|---|
| `show` | `boolean` | Visibility |
| `onClose` | `() => void` | Close handler |
| `onCheckout` | `() => void` | Called when "ОФОРМИТЬ ЗАКАЗ" is clicked. App.tsx redirects to login if user is not authenticated |

---

## Auth Components

### LoginModal — `src/components/auth/LoginModal.tsx`

| Prop | Type |
|---|---|
| `show` | `boolean` |
| `onClose` | `() => void` |
| `onSwitchToRegister` | `() => void` |

Controlled form with `email` + `password` state. Calls `supabase.auth.signInWithPassword()`. Shows inline error on failure, calls `onClose()` on success.

### RegisterModal — `src/components/auth/RegisterModal.tsx`

| Prop | Type |
|---|---|
| `show` | `boolean` |
| `onClose` | `() => void` |
| `onSwitchToLogin` | `() => void` |

Controlled form with `name`, `email`, `password`, `confirm` state. Validates password match client-side. Calls `supabase.auth.signUp()`. On success, switches to a "check your email" confirmation screen instead of closing.

---

## Product Components

### HeroCarousel — `src/components/product/HeroCarousel.tsx`

The main viewport component. Fills the entire screen.

| Prop | Type | Purpose |
|---|---|---|
| `products` | `Product[]` | Full product list |
| `currentIndex` | `number` | Active slide (controlled externally) |
| `onSlideChange` | `(i) => void` | Notifies App of new index |
| `selectedSize` | `string` | Currently selected size |
| `onSizeChange` | `(s) => void` | Size pill click handler |
| `onViewDetails` | `() => void` | "VIEW DETAILS" button handler |

**Internal state:** `direction` (slide animation direction), `isAutoplay` (paused on user interaction), `isImageHovered` (glow effect).

**Autoplay:** Advances every 5 seconds via `setInterval`. Pauses permanently once the user interacts with any nav element.

### ProductDetailModal — `src/components/product/ProductDetailModal.tsx`

Full-screen overlay with 3D spring entrance animation (`rotateX`, `scale`).

| Prop | Type | Purpose |
|---|---|---|
| `show` | `boolean` | Visibility |
| `onClose` | `() => void` | Close handler |
| `product` | `Product` | Product to display |
| `selectedSize` | `string` | Controlled size |
| `onSizeChange` | `(s) => void` | Size selection |
| `onAddToCart` | `() => void` | Adds item to Zustand cart, closes modal |

### ProductPageClient — `src/components/product/ProductPageClient.tsx`

Standalone product detail as a full page (used by the `/products/[slug]` SSG route). Same design as `ProductDetailModal` but without the overlay wrapper. Includes a back link to `/` and a `priority` `next/image` for LCP optimisation. Has its own local `selectedSize` state (not shared with the carousel).

---

## UI Components

### AnimatedBackground — `src/components/ui/AnimatedBackground.tsx`

Fixed full-viewport cyan grid animation. Uses `motion.div` with infinite pulsing opacity and scale. Rendered behind all content via `z-index`.

### shadcn / Radix UI components

49 pre-installed components in `src/app/components/ui/` (legacy path from the original Figma scaffold). Not currently used in the main UI but available for building future features such as:
- Order confirmation dialogs (`AlertDialog`)
- Date pickers for delivery (`Calendar`)
- Toast notifications (`Sonner`)
- Form fields with validation (`react-hook-form` + `Input`, `Label`)

---

## Component Tree (simplified)

```
page.tsx (RSC)
  └── App (client)
        ├── AnimatedBackground
        ├── Header
        │     └── [reads Zustand: items.length]
        ├── HeroCarousel
        │     └── next/image (product photo)
        ├── ProductDetailModal
        │     └── next/image (product photo)
        ├── CartDrawer
        │     ├── [reads Zustand: items[]]
        │     └── next/image (thumbnails)
        ├── LoginModal
        └── RegisterModal
```
