# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm i          # install dependencies
npm run dev    # start dev server (Vite)
npm run build  # production build
```

## Architecture

This is a single-page React + Vite + TypeScript app exported from Figma Make. The entire UI lives in one file: [src/app/App.tsx](src/app/App.tsx). There are no routes, no separate component files, and no backend — all state (cart, modals, carousel index) is local React state in `App`.

**UI structure inside `App.tsx`:**
- Fullscreen carousel of 6 hardcoded products (auto-advances every 5s, pauses on interaction)
- Header with navigation dots, cart badge, login/register buttons
- Left/right arrow nav + sidebar product list (both fixed-position overlays)
- Four modals managed by boolean state flags: product detail, login, register, cart (slide-in panel)

**Tech stack:**
- Animations: `motion/react` (`AnimatePresence` + `motion.*` wrappers throughout)
- Styling: Tailwind CSS v4 via `@tailwindcss/vite` — configured as a Vite plugin, no `tailwind.config.js`
- Icons: `lucide-react`
- Brand color: `#00d9ff` (cyan) on pure black `#000`

**Path aliases:**
- `@` → `src/`
- `figma:asset/<filename>` → `src/assets/<filename>` (custom Vite plugin in `vite.config.ts`)

**Dependency note:** The project ships a large set of Radix UI and shadcn-style packages that are not currently used in `App.tsx`. They are available if new components are needed.
