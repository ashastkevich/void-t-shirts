# Deployment

## Infrastructure

| Service | Purpose | URL |
|---|---|---|
| **Vercel** | Hosting, CDN, CI/CD | vercel.com |
| **Supabase** | PostgreSQL database + Auth + Storage | supabase.com |
| **GitHub** | Source control, deploy trigger | github.com/ashastkevich/void-t-shirts |

Every push to `main` triggers an automatic Vercel build and deployment.

---

## Environment Variables

### Required (all environments)

| Variable | Where to find | Used by |
|---|---|---|
| `DATABASE_URL` | Supabase → Connect → **Transaction pooler** (port 6543) | Prisma (runtime queries) |
| `DIRECT_URL` | Supabase → Connect → **Session pooler** (port 5432) | Prisma (migrations / `db:push`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | Supabase client (browser + server) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API → Publishable key | Supabase client (browser + server) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → **service_role** key | Admin image upload to Storage |

> **`SUPABASE_SERVICE_ROLE_KEY` is secret.** It bypasses Row Level Security. Never expose it to the browser — it is only used in server-side code (`src/lib/supabase/admin.ts`) and the `/api/admin/upload` route handler.

### Connection string formats

**`DATABASE_URL`** — Transaction pooler, for runtime:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**`DIRECT_URL`** — Session pooler, for migrations. Same host, port **5432**:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

> **Why two URLs?** Serverless functions (Vercel) can't hold long-lived DB connections, so runtime queries go through the Transaction pooler (PgBouncer). But Prisma migrations (`db push`) need a session-mode connection — the Session pooler provides that without requiring a direct connection (which is IPv6-only without a paid add-on).

---

## Local Setup

```bash
# 1. Clone
git clone git@github.com:ashastkevich/void-t-shirts.git
cd void-t-shirts

# 2. Install dependencies (also runs prisma generate via postinstall)
npm install

# 3. Create .env.local from the example
cp .env.local.example .env.local
# → fill in all five variables

# 4. Create DB tables
npm run db:push

# 5. Seed product data
npm run db:seed

# 6. Start dev server
npm run dev
# → http://localhost:3000
```

---

## Vercel Deployment

### First deploy

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. In **Environment Variables**, add all five variables from the table above
4. Click **Deploy**

Vercel automatically runs:
```
npm install          # triggers postinstall: prisma generate
next build           # SSG + ISR pre-rendering
```

### Subsequent deploys

```bash
git add .
git commit -m "your message"
git push             # Vercel picks this up automatically
```

### Re-running the seed on production

The seed script runs against whichever `DATABASE_URL` is in your local `.env`. To seed production:

```bash
# Make sure .env has the production DATABASE_URL and DIRECT_URL
npm run db:seed
```

---

## Supabase Configuration

### Auth — URL Configuration

After deploying to Vercel, configure allowed URLs in Supabase:

1. Supabase dashboard → **Authentication** → **URL Configuration**
2. **Site URL**: `https://your-project.vercel.app`
3. **Redirect URLs**: `https://your-project.vercel.app/**`

Without this, email confirmation and password-reset links will not redirect back to the site correctly.

### Storage — "products" Bucket

The admin image upload feature requires a public bucket named `products`:

1. Supabase dashboard → **Storage** → **New bucket**
2. Name: `products`, toggle **Public bucket** ON
3. Click **Save**

Uploaded images are stored with random filenames (`{timestamp}-{random}.{ext}`) and served from the bucket's public URL.

### Admin Role — Granting Access

The admin panel (`/admin`) checks `app_metadata.role === 'admin'` on the Supabase Auth user. This must be set manually in the Supabase SQL editor (one-time per admin):

```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';
```

After running this query, the user must sign out and sign back in for the new metadata to be reflected in their session token.

---

## Useful Commands

```bash
npm run dev              # local dev server
npm run build            # production build (also verifies types)
npm run db:push          # sync Prisma schema → Supabase (uses DIRECT_URL)
npm run db:seed          # insert/update 6 products
npm run db:studio        # open Prisma Studio (visual DB browser) at localhost:5555
npm test                 # run all unit + component tests (Vitest)
npm run test:coverage    # coverage report
npm run test:e2e         # run Playwright E2E tests (auto-starts dev server)
```
