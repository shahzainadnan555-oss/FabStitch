# FabStitch frontend

FabStitch is a B2B fabric discovery and purchasing experience organised around
what customers are making and the material constraints they need to satisfy.

## Current phase

This repository is frontend-only. It does not connect to a backend, database,
authentication service, payment processor, analytics service or WebSocket.

- Product discovery uses the approved local catalogue under `catalog/`.
- Search, filters, sorting, collections, Best For pages and fabric details run
  entirely from local data.
- Sign-up and sign-in are explicitly labelled browser-local demos. Passwords
  are never stored or verified.
- Onboarding, account preferences and legal-consent versions are stored in
  versioned `localStorage`.
- Comparison uses `sessionStorage`.
- Purchase, RFQ and role workspace interfaces are non-submitting previews.
- SEO publication uses a frontend-owned launch manifest; public and indexable
  are separate states, and no publication API is connected.

A future backend should implement the existing UI-facing provider and
repository boundaries. Do not add an API URL or reconnect the removed service
until that backend phase is explicitly started.

## Stack

Next.js 16.3 · React 19.2 · TypeScript strict · Tailwind CSS v4 · IBM Plex Sans
and Mono.

This is Next.js 16. Read the relevant guide in
`node_modules/next/dist/docs/` before changing framework behavior.

## Run

```bash
npm install
npm run dev
npm run lint
npx tsc --noEmit
npm run seo
npm run build
```

The site runs at `http://localhost:3000` with no other service running.

For the complete pre-publish pipeline, install Chrome for Playwright once and
run the unified QA command:

```bash
npx playwright install chrome
npm run qa
```

The QA runner performs lint, registry and catalogue audits, a production build,
asset-budget checks, then starts an isolated production server on port 3013 for
runtime SEO and browser/performance audits. Set `SITE` to use another origin,
or set `QA_EXTERNAL_SERVER=1` when that origin is already running.

## SEO publication

`domain/seo/storefront-registry.ts` is the page inventory.
`domain/seo/launch-manifest.ts` controls launch phase and publication state.
Draft and pre-publication scheduled pages are unavailable; public noindex pages
remain browseable but stay out of sitemap batches. Because the project is
frontend-only, scheduled static changes become live through a rebuild/deploy.

`npm run seo` writes the private development inventory and audit findings to
`artifacts/seo-audit.json`. `/sitemap.xml` is the public sitemap index; query
states for search, filters, sorting and pagination are noindex and canonicalize
to their clean parent.

## Structure

```text
app/                 Next.js routes and route-group shells
catalog/             authoritative local fabric catalogue
components/          design-system, layout and marketplace components
features/local/      versioned local demo profile provider
features/onboarding/ local onboarding and preference experience
features/purchase/   non-submitting order preview
repositories/        UI-facing local read models
domain/              normalized types, taxonomy and SEO rules
content/             local editorial content
config/              centralized legal and frontend configuration
docs/                architecture and recorded decisions
```

Read `CLAUDE.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md` and
`docs/DESIGN-SYSTEM.md` before architectural work.
