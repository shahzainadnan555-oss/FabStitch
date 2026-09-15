# FabStitch frontend

FabStitch is a B2B fabric discovery and purchasing experience organised around
what customers are making and the material constraints they need to satisfy.

## Current phase

The live production backend is the single API:

- Origin: `https://api.fabstitch.net`
- API: `https://api.fabstitch.net/api/v1`
- Docs: `https://api.fabstitch.net/docs`
- Admin WebSocket: `wss://api.fabstitch.net/api/v1/realtime/ws/admin`

All real requests go through `lib/api` (`api` in the browser, `serverApi` on the
server). Do not add a second client, hardcode localhost APIs in components, or
fall back to mock catalog/auth data when the live backend fails.

Set these on the host for production builds. Next.js inlines `NEXT_PUBLIC_*`
into the browser bundle; `VITE_API_BASE_URL` is accepted as an alias.

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.fabstitch.net/api/v1
VITE_API_BASE_URL=https://api.fabstitch.net/api/v1
NEXT_PUBLIC_WS_BASE_URL=wss://api.fabstitch.net/api/v1
```

Local development can override those values in `.env.local`. Production must
keep the `api.fabstitch.net` URLs. See `.env.example` and `.env.production`.

## Deploy on Vercel

Import the GitHub repository as a Next.js project. Do not change the
framework, build command, or output directory.

Set these Production environment variables in the Vercel project (all public):

```bash
NEXT_PUBLIC_SITE_URL=https://fabstitch.net
NEXT_PUBLIC_API_BASE_URL=https://api.fabstitch.net/api/v1
VITE_API_BASE_URL=https://api.fabstitch.net/api/v1
NEXT_PUBLIC_WS_BASE_URL=wss://api.fabstitch.net/api/v1
```

Leave them blank only if you want the committed `.env.production` defaults.
Do not set `NEXT_PUBLIC_SITE_URL` to an empty string in the Vercel dashboard.

Then:

1. Add the domain `fabstitch.net` (and `www.fabstitch.net` if you use it).
2. Deploy from `main`.
3. Confirm the deployment URL loads before pointing DNS, if you want a preview.

Node 20+ is required. Playwright browsers are not downloaded during install.

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

The site runs at `http://localhost:3000` and talks to the live production
backend (`https://api.fabstitch.net/api/v1`) unless `.env.local` overrides the
API base URL.

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
remain browseable but stay out of sitemap batches. Live SEO APIs under
`/api/v1/seo` are used where the storefront already relies on backend-managed
SEO data.

`npm run seo` writes the private development inventory and audit findings to
`artifacts/seo-audit.json`. `/sitemap.xml` is the public sitemap index; query
states for search, filters, sorting and pagination are noindex and canonicalize
to their clean parent.

## Structure

```text
app/                 Next.js routes and route-group shells
lib/api/             single API client, config, errors and OpenAPI types
catalog/             local media/SEO helpers (not the production catalog API)
components/          design-system, layout and marketplace components
features/            auth, inquiries, admin, preferences and onboarding
repositories/        UI-facing reads over the live backend
domain/              normalized types, taxonomy and SEO rules
content/             local editorial content
docs/                architecture and recorded decisions
```

Read `CLAUDE.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md` and
`docs/DESIGN-SYSTEM.md` before architectural work.
