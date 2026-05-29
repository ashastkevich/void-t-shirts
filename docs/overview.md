# VOID Store — Project Overview

## What is this?

VOID Store is a premium t-shirt e-commerce platform targeting the Russian market. It features a cinematic full-screen carousel UI, per-product SEO pages, persistent cart, and Supabase-powered authentication.

The visual identity is built around a pure black (`#000`) canvas with a single accent color — electric cyan (`#00d9ff`) — applied to borders, highlights, prices, and interactive elements.

## Features

| Feature | Status |
|---|---|
| Full-screen animated product carousel | ✅ |
| Per-product SSG pages with SEO metadata | ✅ |
| JSON-LD Product schema (Google rich results) | ✅ |
| Auto-generated sitemap + robots.txt | ✅ |
| Persistent cart (survives page refresh) | ✅ |
| User registration + email confirmation | ✅ |
| User login / logout | ✅ |
| Product detail modal + standalone page | ✅ |
| Size selection | ✅ |
| Order placement | 🔜 (Phase 9) |
| Order history | 🔜 |
| Admin panel | 🔜 |

## Product Catalogue

6 hardcoded products are seeded into the database on first deploy. All are black t-shirts from fictional premium collections.

| Slug | Name | Series | Price |
|---|---|---|---|
| `ultra-black` | ULTRA BLACK | SIGNATURE | 12 900 ₽ |
| `void-essential` | VOID ESSENTIAL | CORE | 11 500 ₽ |
| `minimal-black` | MINIMAL BLACK | CLASSIC | 10 900 ₽ |
| `dark-matter` | DARK MATTER | LIMITED | 13 500 ₽ |
| `shadow-form` | SHADOW FORM | PREMIUM | 12 200 ₽ |
| `obsidian-core` | OBSIDIAN CORE | EXCLUSIVE | 14 900 ₽ |

## Local Development

```bash
cp .env.local.example .env.local   # fill in Supabase credentials
npm install
npm run db:push                     # create tables in Supabase
npm run db:seed                     # seed 6 products
npm run dev                         # http://localhost:3000
```
