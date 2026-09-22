# Mobile & Content Enhancement Report

**Project:** FabStitch frontend  
**Scope:** Frontend only (no FastAPI / Supabase / backend changes)  
**Canonical opaque topic URL:** `/discover/opaque-fabric/` (existing route; no new URL)

---

## MOBILE

### Hamburger / drawer issue

**Symptom:** Mobile menu opened, but bottom controls (especially Account / Join Free) were not reliably tappable. Drawer content taller than the viewport could not be scrolled to.

**Root cause (structural):**

1. Mobile navigation was an `absolute` dropdown anchored to the hamburger inside the sticky header.
2. The header uses `backdrop-blur` / `backdrop-filter`, which creates a containing block and stacking context — overlays were trapped in header chrome rather than a true viewport-level drawer.
3. The panel had **no max-height / overflow-y scroll**, and Account / Join Free sat at the bottom of a tall panel. With a sticky header, body scroll does not move the panel relative to the viewport, so the CTA could sit below the fold with no way to reach it.
4. Preference dropdowns opened downward and could cover the Account control.
5. Auth chrome showed a non-interactive **“Checking account”** placeholder while `/auth/me` was loading or retrying, so Join Free / Account were absent during the window users often open the menu.

### Account issue

**Root cause:** Combination of (3) unreachable bottom of absolute panel + (5) non-interactive loading state + nested menu opening downward inside a clipped/overflowing panel.

**Fix:**

- Portaled fixed right-hand drawer (`role="dialog"`, `aria-modal`) to `document.body`
- Scrim overlay with outside-click dismiss
- Flex column: fixed header (logo + close) · **scrollable middle** · **sticky footer** (country/currency + Account / Join Free)
- Safe-area padding on the footer
- Preference and Account menus open **upward** on mobile
- Account / Join Free / Sign In always use real `<a>` / `<button>` controls with ≥44×44px targets
- Optimistic Join Free + Sign In while session hydrates (no dead “Checking account” blocker)
- Body scroll lock while open; restore on close / Escape / route change

### Join Now / Join Free issue

**Implementation traced:** Storefront CTA is **Join Free** → `/signup/` (not an in-page anchor). Closing CTA on the homepage is marketplace/fabrics/guides, not Join Now.

**Root cause:** Same drawer reachability + loading-state problems as Account. After menu interaction, overlays could also linger across navigations.

**Fix:** Sticky footer Join Free link, `onNavigate` closes drawer, pathname change clears drawer, signup navigation leaves no overlay.

### Scroll behavior

- Drawer body: `overflow-y-auto` + `overscroll-contain`
- Document body: `overflow: hidden` while open; previous value restored on cleanup
- Escape and close button restore focus to the hamburger
- Horizontal overflow clipped at `html { overflow-x: clip }`

### Overflow findings

- Absolute menu could paint past the viewport without a reachable scroll region
- Preference error banner in the footer is contained in the sticky footer (does not cover the CTA hit target after layout fix)
- Narrow-phone type tokens slightly tightened below 360px width

### Responsive findings

Audited/tested viewports: 320, 360, 375, 390, 412, 430 (+ desktop 1440 regression in mobile-nav QA).  
Hamburger touch target raised to `size-11` (44px). Desktop primary nav unchanged (`xl:` breakpoint).

### Accessibility findings

- Hamburger: `aria-expanded`, `aria-controls`, `aria-haspopup="dialog"`, visible sr-only name
- Drawer: labelled dialog, Escape, focus to close control on open
- Search mobile trigger always has `aria-label="Search fabrics"`
- Account menu: `aria-expanded` / `aria-controls`; menuitem targets ≥44px on mobile

---

## OPAQUE FABRIC

### Content improvements

Hand-authored enrichment applied to the **existing** `/discover/opaque-fabric/` attribute hub via `domain/seo/semantic/curated-attributes.ts` (compose-time override). No duplicate URL.

Sibling page `/discover/fabric-opacity-for-garments/` rewritten to be garment-brief oriented and to link to the opaque hub (distinct intent).

Education attribute titles changed from “What Is … Fabric?” to “Understanding … Fabric” so they no longer collide with the curated opaque H1/title.

### H1

`What Is Opaque Fabric?`

### H2s

- What Does Opaque Mean in Fabric?
- What Makes a Fabric Opaque?
- How Fabric Weight and GSM Affect Opacity
- How Weave and Knit Construction Affect Coverage
- Color, Finish and Lighting: Why Opacity Can Vary
- Which Fabrics Tend to Offer More Coverage?
- Opaque vs Sheer vs Semi-Sheer Fabric
- How to Choose an Opaque Fabric for Different Garments
- What Buyers Should Check Before Ordering
- Frequently Asked Questions (via page FAQ block)

### FAQs

Ten topic-specific FAQs (opaque meaning, causes, thickness, GSM, sheer difference, naturally denser cloths, lightweight opacity, colour, lining, how to check). FAQ JSON-LD continues to use the site’s existing `FaqJsonLd` with visible FAQ content.

### Images / image SEO

- Path: `/media/fabrics/cotton-poplin-primary.webp` (existing approved asset)
- Alt: “Close-up texture of opaque woven cotton poplin with dense plain-weave construction”
- Responsive `SeoImage` rendering unchanged (no layout-shift regression intended)

### Metadata

- Title segment: `What Is Opaque Fabric?` (document title padded by storefront metadata to `What Is Opaque Fabric? Sourcing Notes | FabStitch`, within 45–61)
- Meta description summarizes coverage, GSM, weave/knit, colour/finish (147 chars; within 120–151)

### Schema

Existing semantic landing schemas retained: CollectionPage + FAQPage + breadcrumbs (Organization from root). No invented ratings/offers.

### Internal links

Related paths include fabric-opacity, sheer fabric, GSM guide, woven-vs-knit guide, Best For shirts/dresses/trousers/outerwear, cotton + silk-sheer collections, marketplace/fabrics/guides.

Keyword map row for `opaque fabric` updated to `/discover/opaque-fabric/`.

---

## SITE-WIDE CONTENT

### Pages audited / improved

| Area | Change |
| --- | --- |
| `/discover/opaque-fabric/` | Full curated educational upgrade |
| `/discover/fabric-opacity-for-garments/` | Distinct garment-judgement rewrite + hub link |
| Attribute education titles | “Understanding …” to avoid H1/title collision |
| Sheer attribute ontology | Clearer definition + opaque cross-link |
| Opaque attribute ontology | Stronger definition / judge / tradeoffs + guidePath |
| Keyword map | Opaque fabric → canonical discover URL |
| Mobile chrome | Global nav / account / preferences / search |

### Duplicate / repetitive content found

- Template attribute hubs remain thin by design for combinations; **opaque** is the curated exception
- Education “What Is …” titles previously duplicated the natural opaque query — fixed by retitling education pages

### Weak pages improved

Opaque hub + opacity glossary + sheer ontology notes. No mass template rewrite; no new discover URLs.

### Image / metadata issues fixed

Opaque hub image alt specificity; keyword map mapping; metadata uniqueness preserved (technical audit: 0 duplicate titles/descriptions among indexable set).

---

## TESTS

| Check | Result |
| --- | --- |
| `npm run qa:mobile-nav` (320–430 + desktop) | Passed |
| TypeScript (`tsc --noEmit`) | Passed |
| ESLint (changed files) | Passed |
| Prettier (changed files) | Passed |
| Production `next build` | Passed |
| `seo:technical-audit` | 0 findings; 2267 indexable |
| `seo:metadata-quality` | Titles/descriptions in range; 0 missing/duplicate |
| `seo:image-audit` | 0 missing alt; 0 broken |
| `seo:semantic` | Registry assertions OK; opaque curated page indexable |

### Mobile regression coverage added

`scripts/qa/mobile-nav.mjs` + `npm run qa:mobile-nav`

Covers: open/close, Escape, body scroll lock, drawer scroll, auth CTA in viewport + hit-testing, Join Free navigation without leftover overlay, desktop hamburger hidden.

`scripts/qa/seo-browser-performance.mjs` mobile preference checks updated for the dialog drawer + Join Free/Account CTA visibility.

---

## FILES TOUCHED (primary)

- `components/layout/global-nav.tsx`
- `components/layout/header-search.tsx`
- `components/layout/preference-controls.tsx`
- `features/account/account-menu.tsx`
- `app/globals.css`
- `domain/seo/semantic/curated-attributes.ts` (new)
- `domain/seo/semantic/compose.ts`
- `domain/seo/semantic/ontology.ts`
- `domain/seo/semantic/library.ts`
- `docs/seo/fabstitch-keyword-map.csv`
- `scripts/qa/mobile-nav.mjs` (new)
- `scripts/qa/seo-browser-performance.mjs`
- `package.json`

---

## SUCCESS CHECKLIST

- [x] Account / Join Free always visible and tappable in mobile drawer footer
- [x] Drawer scrolls; body locks; Escape / overlay / close restore cleanly
- [x] No new opaque URL; existing `/discover/opaque-fabric/` substantially upgraded
- [x] SEO architecture preserved (canonicals, sitemap count, registry)
- [x] Desktop primary nav not regressed
- [x] Automated mobile regression + build + SEO audits executed
