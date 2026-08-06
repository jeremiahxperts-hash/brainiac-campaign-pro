# Brainiac Promotion Studio

Premium campaign management and reporting platform for Twitch promotion agencies. Log a
campaign once and Brainiac generates visibility/discovery/quality indicators, a timeline,
keyword coverage, and a polished, exportable client report — all client-side, persisted to
localStorage (no backend required to try it out).

> Campaign management & reporting only. This app does not integrate with Twitch Ads and does
> not claim verified Twitch advertising data — every metric is clearly labeled as a modeled
> campaign indicator.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Stack

Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · shadcn/ui-style primitives ·
Framer Motion · React Hook Form + Zod · TanStack Query · Recharts · Zustand (persisted store)
· html2canvas + jsPDF for export.

## Structure

- `app/` — landing page, `/dashboard`, `/campaign/[id]` (report + presentation mode),
  `/share/[id]` (read-only), `/settings`
- `components/` — UI primitives in `components/ui/`, feature components at the top level
- `lib/` — types, the campaign indicator generator (`campaign-utils.ts`), the Zustand
  store (`store.ts`), settings store, export helpers

## Notes

- Campaign data lives in the browser (`localStorage` via Zustand `persist`). Clearing site
  data clears campaigns.
- Search, status filters, dark/light mode, and shareable read-only links are all
  implemented.
- Export (PDF/PNG/JPEG) captures the report DOM with `html2canvas` and rasterizes it into a
  PDF with `jsPDF` when PDF is chosen.
