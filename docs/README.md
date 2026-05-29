# VOID Store — Documentation

Premium t-shirt e-commerce platform. Black + cyan. Russian market.

## Contents

| Document | Description |
|---|---|
| [overview.md](overview.md) | Project description, feature list, product catalogue |
| [architecture.md](architecture.md) | System design, rendering strategy, server/client boundary, data flow |
| [tech-stack.md](tech-stack.md) | All technologies with versions and rationale |
| [data-models.md](data-models.md) | Prisma schema, field descriptions, price encoding, seed data |
| [components.md](components.md) | Component tree, props, responsibilities |
| [deployment.md](deployment.md) | Local setup, env vars, Vercel deploy, Supabase Auth config |

## Quick Reference

```bash
npm run dev          # start local server
npm run build        # production build
npm run db:push      # sync schema to Supabase
npm run db:seed      # insert 6 products
npm run db:studio    # visual DB browser
```

**Stack:** Next.js 15 · React 18 · TypeScript · Tailwind v4 · Prisma 6 · Supabase · Zustand · motion/react · Vercel
