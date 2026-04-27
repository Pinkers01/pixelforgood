@AGENTS.md

# PixelForGood — Codebase Guide

## What This Project Is

PixelForGood is a pixel-advertising canvas in the spirit of the Million Dollar Homepage. Users buy pixel blocks on a 1000×1000 grid, place ads, and 50% of every sale goes to charity. Stripe handles payments (live); Supabase is installed but not yet integrated (all data is mocked).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16.2.1** — App Router. Read `node_modules/next/dist/docs/` before touching routing or server components. APIs differ from Next.js 13–15. |
| React | **19.2.4** — Server Components are the default; add `"use client"` only when you need interactivity or browser APIs. |
| Language | **TypeScript 5** — strict mode on. No `any`, no `@ts-ignore`. |
| Styling | **Tailwind CSS 4** — config-less, PostCSS-based. No `tailwind.config.*` file; use standard utility classes. |
| Icons | **lucide-react ^1.7.0** |
| Payments | **Stripe 20.x** — Checkout Sessions API with automatic tax. |
| Database | **@supabase/supabase-js ^2.100.0** — installed, not yet integrated. |

---

## Directory Structure

```
src/
  app/
    layout.tsx           # Root server layout — metadata, fonts, body wrapper
    page.tsx             # Home page (client) — mounts PixelCanvas + BuyModal
    about/page.tsx       # Static about/FAQ page
    success/page.tsx     # Stripe success callback
    cancel/page.tsx      # Stripe cancel callback
    api/
      checkout/route.ts  # POST — creates Stripe Checkout Session
    globals.css          # Tailwind import, Google Fonts, custom scrollbar
  components/
    PixelCanvas.tsx      # Core interactive HTML5 canvas (zoom/pan/select)
    BuyModal.tsx         # Multi-step purchase modal
    Navbar.tsx           # Category tabs, search, 18+ gate
    Sidebar.tsx          # Recent purchases, charity tracker, leaderboard
    StatsBar.tsx         # Bottom bar with live counters
    Logo.tsx             # Pixel-art heart mascot
  lib/
    constants.ts         # Canvas dimensions, pricing, categories, VFX prices
    mock-data.ts         # Placeholder pixels and stats — replace with Supabase
  types/
    index.ts             # Pixel, PurchaseSession, Stats, VFX, Category interfaces
```

---

## Key Constants (`src/lib/constants.ts`)

```ts
CANVAS_WIDTH / CANVAS_HEIGHT = 1000        // 1,000,000 total pixels
PRICE_PER_PIXEL   = 1.00                   // $1/px outside golden zone
PRICE_GOLDEN_PIXEL = 10.00                 // $10/px inside golden zone
GOLDEN_ZONE = { x: 375, y: 450, w: 250, h: 100 }
CHARITY_SPLIT = 0.50                       // 50% of revenue → charity
IMPACT_FEE = 0.20                          // 20% resale fee (not yet implemented)
VFX_PRICES = { neon_pulse: 15, diamond_shine: 20, cyber_glitch: 25, rainbow_wave: 35, fire: 50 }
```

Do not inline these values in components — always import from `constants.ts`.

---

## TypeScript Interfaces (`src/types/index.ts`)

```ts
Pixel            // A sold or available pixel block on the canvas
PurchaseSession  // Data sent to /api/checkout
Stats            // pixels_sold, revenue, charity_pool, advertisers
VFX              // union type of VFX names
Category         // union type of category ids
```

---

## API Routes

### `POST /api/checkout`

- **Runtime**: Node.js (`export const runtime = 'nodejs'`)
- **Input body** (JSON):
  ```ts
  { pixels: number, totalPrice: number, category: string, title: string, url: string, vfx: string | null }
  ```
- **What it does**: Creates a Stripe Checkout Session with automatic tax, metadata, and VFX line item if selected.
- **Returns**: `{ url: string }` — redirect to Stripe Checkout.
- **Error**: Returns `{ error: string }` with status 500.
- **Required env**: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_URL`
- **Stripe API version**: `2026-02-25.clover` — do not change without testing.

---

## Environment Variables

The project requires a `.env.local` file (never committed). Required keys:

```
STRIPE_SECRET_KEY=sk_live_...          # or sk_test_... for dev
NEXT_PUBLIC_URL=https://pixelforgood.com  # fallback: http://localhost:3000
```

Planned (for Supabase integration):
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Development Workflow

```bash
npm run dev      # start dev server on :3000
npm run build    # production build (runs type-check + lint)
npm run lint     # ESLint 9 (flat config)
npm run start    # serve production build
```

There are no tests. There are no pre-commit hooks. `npm run build` is the primary correctness gate.

---

## Coding Conventions

### Client vs Server Components
- All interactive components (canvas, modals, sidebars) are `"use client"`.
- `layout.tsx` and static pages are server components by default — keep them that way unless you need browser APIs.
- Do not add `"use client"` to API routes or pure utility files.

### Styling
- Primary font: `Space Grotesk` (weights 300–900, from Google Fonts in `globals.css`).
- Display/heading font: `Press Start 2P` (retro pixel aesthetic).
- Design tokens (use these consistently, do not introduce new accent colours):
  - Pink: `#ff3366`
  - Black background: `#050505`
  - Cyan accent: `#00d4ff`
  - Purple accent: `#a855f7`
- Mix of Tailwind utility classes and inline `style` objects is accepted. Prefer Tailwind where practical.

### State Management
- Local React state only (`useState`, `useRef`, `useEffect`). No Redux, Zustand, or context providers are in use.
- If cross-component state grows complex, discuss before adding a context.

### Data (Current State)
- **All pixel/stats data is mocked** in `src/lib/mock-data.ts`. The canvas renders from this mock.
- When integrating Supabase, replace mock imports at the component level — do not refactor the entire app at once.

### Stripe
- The Stripe client is instantiated inside the request handler (not at module scope) to avoid build-time errors.
- `Stripe.createFetchHttpClient()` is required for Edge/Node compatibility.
- VFX pricing is duplicated in both `constants.ts` and the `vfxPrice()` helper in the API route. Keep them in sync.

---

## Planned Work (Not Yet Implemented)

- **Supabase integration**: Replace `mock-data.ts` with real DB reads/writes. The `Pixel` and `Stats` interfaces in `types/index.ts` reflect the intended schema.
- **Stripe webhook**: Handle `checkout.session.completed` to persist purchases to Supabase.
- **Charity voting**: Let pixel owners vote on which charity receives the pool.
- **Resale / 20% impact fee**: `IMPACT_FEE` constant is defined but not used.
- **Tests**: No test infrastructure exists.

---

## Common Pitfalls

- **Next.js 16 is not like 13/14/15.** Before touching routing, layouts, or server actions, read `node_modules/next/dist/docs/`.
- **Tailwind 4 has no config file.** Do not create `tailwind.config.ts` — it is not used.
- **Stripe API version is pinned.** `2026-02-25.clover` is a beta version required for current Stripe features. Do not "upgrade" it without explicit instruction.
- **`mock-data.ts` is intentionally temporary.** Do not extend it with new features; route new data through Supabase when integrating.
- **VFX prices exist in two places** (`constants.ts` + API route helper). If you change pricing, update both.
