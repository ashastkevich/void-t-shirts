# Data Models

## Database: Supabase PostgreSQL

Managed via **Prisma ORM v6**. Schema lives in `prisma/schema.prisma`.

---

## Product

Represents a t-shirt for sale.

```prisma
model Product {
  id          String      @id @default(uuid())
  slug        String      @unique
  name        String
  series      String
  price       Int                   // stored in kopecks: 12 900 ₽ = 1 290 000
  description String
  imageUrl    String
  weight      Int?                  // fabric weight in g/m²
  createdAt   DateTime    @default(now())
  orderItems  OrderItem[]
}
```

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key, auto-generated |
| `slug` | String | URL-safe identifier, e.g. `ultra-black`. Used in `/products/[slug]` |
| `name` | String | Display name in UPPERCASE, e.g. `ULTRA BLACK` |
| `series` | String | Collection name shown as badge, e.g. `SIGNATURE` |
| `price` | Int | **Stored in kopecks** to avoid float precision issues. Divide by 100 for rubles |
| `description` | String | Short spec string, e.g. `100% органический хлопок • 220 г/м²` |
| `imageUrl` | String | Full URL (currently Unsplash) |
| `weight` | Int? | Fabric weight in g/m², optional |

**Price encoding example:**
```
12 900 ₽  →  stored as  1_290_000  (kopecks)
```

The `dbRowToProduct()` function in `src/lib/products.ts` converts to the formatted display string:
```ts
const rubles = Math.floor(row.price / 100)
// 1_290_000 / 100 = 12_900 → "12 900 ₽"
```

---

## User

Mirrors a Supabase Auth user. The `id` matches the Supabase Auth UUID.

```prisma
model User {
  id        String   @id          // matches Supabase Auth UUID
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  orders    Order[]
}
```

Auth is handled entirely by Supabase Auth. This table stores additional profile data and is the foreign key target for orders.

---

## Order

Represents a placed order.

```prisma
model Order {
  id        String      @id @default(uuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  status    String      @default("pending")
  total     Int                   // in kopecks, sum of all OrderItems
  createdAt DateTime    @default(now())
  items     OrderItem[]
}
```

**Status values:** `pending` → `paid` → `shipped` → `delivered`

---

## OrderItem

A single product line within an order. Stores a price snapshot so historical orders are not affected by future price changes.

```prisma
model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  size      String              // "XS" | "S" | "M" | "L" | "XL"
  quantity  Int
  price     Int                 // snapshot of product.price at time of order
}
```

---

## CartItem (Frontend Only)

Not stored in the database. Lives in the Zustand store (`src/store/cart.ts`), persisted to `localStorage` under the key `void-cart`.

```ts
type CartItem = {
  id: string       // product id
  name: string
  size: string     // "XS" | "S" | "M" | "L" | "XL"
  price: string    // formatted display string: "12 900 ₽"
  image: string    // imageUrl
}
```

When the user places an order, `CartItem[]` from the Zustand store is passed to `createOrder()` in `src/lib/orders.ts`, which writes to the `Order` and `OrderItem` tables.

---

## Entity Relationships

```
User (Supabase Auth UUID)
  └── Order (1:many)
        └── OrderItem (1:many)
              └── Product (many:1)
```

---

## Seed Data

`prisma/seed.ts` — run with `npm run db:seed`. Uses `upsert` so it is safe to run multiple times.

```ts
// Prices in kopecks
{ slug: 'ultra-black',   price: 1_290_000 }   // 12 900 ₽
{ slug: 'void-essential', price: 1_150_000 }  // 11 500 ₽
{ slug: 'minimal-black', price: 1_090_000 }   // 10 900 ₽
{ slug: 'dark-matter',   price: 1_350_000 }   // 13 500 ₽
{ slug: 'shadow-form',   price: 1_220_000 }   // 12 200 ₽
{ slug: 'obsidian-core', price: 1_490_000 }   // 14 900 ₽
```

---

## Graceful Fallback

`getAllProducts()` and `getProductBySlug()` in `src/lib/products.ts` wrap Prisma queries in a `try/catch`. If the database is unreachable (e.g. local dev without credentials), they fall back to the `staticProducts` array hardcoded in the same file. This means the app builds and runs without a database configured.
