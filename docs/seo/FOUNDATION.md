# FabStitch SEO Foundation — Audit & Plan

**Site:** https://fabstitch.net  
**Scope:** Frontend SEO foundation only. No off-page SEO. No invented volume/difficulty numbers.  
**Date:** 2026-09-16

---

## A. Complete SEO audit (summary)

### Strengths
- HTTPS + trailing-slash canonical host (`https://fabstitch.net`)
- Layered robots: `app/robots.ts` + `X-Robots-Tag` proxy + page metadata
- Private/auth/account/inquiry routes correctly noindexed and robots-disallowed
- Faceted/filter query states intentionally noindex with canonical to clean parent
- Conservative JSON-LD (Organization, WebSite, CollectionPage, Product without fake offers, Article/FAQ)
- Local storefront SEO registry with publication gates

### Critical production findings
1. **Live SEO sitemap API returns 0 URLs** (`GET /seo/sitemap/index` → `total_urls: 0`) — production sitemap was empty/failing.
2. **Any query string previously forced `X-Robots-Tag: noindex`** — UTMs/gclid could noindex money pages.
3. **SEO API outages fail-closed to noindex** — risk of sitewide temporary deindexing.
4. **Metadata fallback always noindex** when backend SEO row missing — money pages dark until registry fallback.
5. **No GSC / GA4 / Clarity wired** in the frontend.
6. **Stale internal links** to redirected `/applications/` and `/for/` diluted crawl paths.
7. **Thin templated taxonomy intros** on some fabric category paths remain a content quality risk.

### Fixes implemented in this foundation pass
- Local registry **sitemap fallback** when API empty/unavailable
- **Tracking-safe** query noindex (`utm_*`, gclid, fbclid, etc.)
- Proxy **fail-open for known indexable registry paths** during SEO API errors
- Metadata **registry fallback** for indexable curated paths
- Best For detail uses `registeredStorefrontMetadata`
- Internal links retargeted to `/fabrics/best-for/` (and marketplace) instead of obsolete routes

---

## B. Primary money page

| Role | Page | Why |
|------|------|-----|
| **Primary money page** | `/marketplace/` | Highest commercial intent: search, filter, discover, then inquire |
| **Primary PDP money path** | `/fabrics/{slug}/` | Conversion happens on fabric detail → quantity → inquiry |
| **Primary discovery hubs** | `/collections/`, `/fabrics/best-for/`, `/fabrics/` | Feed traffic into marketplace and PDPs |

**Primary search intent:** Commercial investigation — “find the right fabric for what I am making / sourcing.”  
**Primary commercial keyword theme:** Fabric sourcing / fabric discovery / wholesale fabric by material & use.  
*(Volumes/difficulty: TBD from SEMrush + GSC — do not invent.)*

---

## C. Keyword map structure

See `docs/seo/keyword-map-template.csv`.

Columns: Keyword | Country | Search intent | Volume | Difficulty | Target page | Content type | Priority

Populate Volume/Difficulty only from verified SEMrush or GSC exports.

---

## D. Topical authority clusters

**Pillar:** Fabric sourcing / fabric discovery (`/marketplace/`, home)

| Cluster | Supporting pages | Content type |
|---------|------------------|--------------|
| Fabric types / materials | `/fabrics/`, collections, material taxonomy | Commercial + guides |
| Fabric by use (shirts, dresses, coats…) | `/fabrics/best-for/{slug}/` | Commercial |
| Fabric specs (weight/GSM, composition, hand) | Guides + PDP attributes | Informational → commercial |
| Wholesale / professional sourcing | Guides + help + inquiry UX | Commercial investigation |
| Comparison / quality | Planned guides (see content plan) | Informational |

---

## E–N. Issue checklist (post-fix status)

| Area | Status |
|------|--------|
| E. On-page | Strong on hubs/PDPs; taxonomy intros still template-heavy |
| F. Technical | Host/HTTPS/trailing slash OK; CWV TBD in field tools |
| G. Indexing | Private OK; UTM/API fail-closed fixed; backend sitemap still empty |
| H. Sitemap | Frontend fallback now serves registry URLs |
| I. Robots | Public allow; private disallow OK |
| J. Canonicals | Clean parent for filters; `fabstitch.net` host |
| K. Schema | Conservative & accurate; unused ListingProductJsonLd |
| L. Internal links | Stale /for/ & /applications/ retargeted |
| M. Thin/duplicate | Taxonomy GSM/property intros; similar PDP fallbacks |
| N. UX | Discovery path clear; inquiry private (correct) |

---

## O. Google Search Console requirements (manual)

1. Verify property `https://fabstitch.net` (DNS or HTML tag — add verification meta only when token available)
2. Submit `https://fabstitch.net/sitemap.xml`
3. Inspect sample money URLs: `/`, `/marketplace/`, `/fabrics/`, key PDPs, collections, best-for
4. Monitor Coverage / Page indexing for noindex & sitemap errors
5. Export Queries + Pages after 28 days to fill keyword map volumes

---

## P. GA4 requirements (manual)

1. Create GA4 property for FabStitch production
2. Add measurement ID via env (e.g. `NEXT_PUBLIC_GA_MEASUREMENT_ID`) — **do not commit secrets**
3. Recommended events (wire later): `view_fabric`, `search_fabrics`, `apply_filter`, `start_inquiry`, `submit_inquiry`, `sign_up`, `login`
4. Mark conversions: `submit_inquiry`, `sign_up`

---

## Q. Clarity requirements (manual)

1. Create Microsoft Clarity project for `fabstitch.net`
2. Install project ID via env — no secrets in git
3. Review heatmaps on: home, marketplace, fabric detail, signup, inquiry modal
4. Use session recordings only for UX friction (do not guess without data)

---

## R. Content plan (supporting blogs → money pages)

Priority articles (intent-led; 1,200–2,000 words when useful; no invented stats):

1. How to source fabric online for clothing brands → `/marketplace/`, `/inquiries` CTA path  
2. Fabric weight (GSM) explained for apparel → related fabric PDPs + guides  
3. Best fabrics for shirts / dresses / coats (cluster series) → `/fabrics/best-for/...`  
4. Cotton vs linen vs silk: choosing by use → collections + PDPs  
5. Wholesale fabric MOQs and how FabStitch inquiries work → help + marketplace  
6. How to read fabric composition and construction → PDPs  

Every article: primary keyword (verified later), unique angle, internal links to hub → PDP → inquire.

---

## S. Priority order

1. Confirm production sitemap serves fallback URLs after deploy  
2. Connect GSC + submit sitemap  
3. Connect GA4 + Clarity  
4. Backend: restore live SEO sitemap/index rows (API currently `total_urls: 0`)  
5. Enrich thin taxonomy intros with unique copy  
6. Fill keyword map from SEMrush/GSC  
7. Publish supporting guides in cluster order  
8. Only then consider off-page SEO  

**Do not start backlinks until foundation items 1–5 are stable.**
