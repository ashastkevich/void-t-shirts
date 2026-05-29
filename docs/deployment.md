# Deployment

## Infrastructure

| Service | Purpose | URL |
|---|---|---|
| **Vercel** | Hosting, CDN, CI/CD | vercel.com |
| **Supabase** | PostgreSQL database + Auth | supabase.com |
| **GitHub** | Source control, deploy trigger | github.com/ashastkevich/void-t-shirts |

Every push to `main` triggers an automatic Vercel build and deployment.

---

## Environment Variables

### Required (all environments)

| Variable | Where to find | Used by |
|---|---|---|
| `DATABASE_URL` | Supabase → Connect → **Transaction pooler** (port 6543) | Prisma (runtime queries) |
| `DIRECT_URL` | Supabase → Connect → **Session pooler** (port 5432) | Prisma (migrations / `db:push`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | Supabase client |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API → Publishable key | Supabase client |

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
# → fill in the four variables

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
3. In **Environment Variables**, add all four variables from the table above
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

## Supabase Auth Configuration

After deploying to Vercel, configure allowed URLs in Supabase:

1. Supabase dashboard → **Authentication** → **URL Configuration**
2. **Site URL**: `https://your-project.vercel.app`
3. **Redirect URLs**: `https://your-project.vercel.app/**`

Without this, email confirmation links will not redirect back to the site correctly.

---

## Useful Commands

```bash
npm run dev          # local dev server
npm run build        # production build (also verifies types)
npm run db:push      # sync Prisma schema → Supabase (uses DIRECT_URL)
npm run db:seed      # insert/update 6 products
npm run db:studio    # open Prisma Studio (visual DB browser) at localhost:5555
```
