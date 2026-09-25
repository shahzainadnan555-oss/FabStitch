# Ryze SEO Remediation Report

**Project:** FabStitch frontend  
**Source:** `fabstitch-seo-baseline-audit-september-2026.pdf`  
**Repo:** https://github.com/shahzainadnan555-oss/FabStitch.git  
**Scope:** Frontend only

## Verification of Ryze headline numbers

| Ryze claim                     | Verified current state                                                                                                                                                    | Verdict                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 4,475 URLs submitted           | Production `sitemap.xml` = **sitemapindex**, **19** child sitemaps, **2,267** unique page URLs before this pass; local eligible inventory after consolidation = **2,265** | **Rejected as current frontend count** — likely older Search Console / prior deploy inventory |
| Indexing 85 / no crawl errors  | Robots allows public sections; sitemap HTTP **200**                                                                                                                       | Technical indexing machinery OK                                                               |
| Query capture 30 / 72% branded | Cannot fabricate Search Console; content work targets non-brand fabric queries on ranking pages                                                                           | Off-page + content depth                                                                      |
| On-page 55 / thin body         | Confirmed: many semantic pages still template-thin; ranking pages were thin                                                                                               | Frontend fixable                                                                              |
| Authority 25 / 1 RD            | Off-page — **not** frontend-fixable                                                                                                                                       | External                                                                                      |
| US = 0 in top countries        | Do not invent US location pages                                                                                                                                           | Strengthen B2B specs on existing pages                                                        |

## URL inventory snapshot (this pass)

| Metric                             | Count                                                 |
| ---------------------------------- | ----------------------------------------------------- |
| Registry pages                     | 2,469                                                 |
| Indexable                          | 2,265                                                 |
| Noindex / non-indexable registry   | 204                                                   |
| Sitemap eligible                   | 2,265                                                 |
| Production sitemap (live check)    | 2,267 (pre-deploy; minus 2 consolidations after ship) |
| Guide alias duplicates in sitemap  | 0 (already redirected)                                |
| Parameter / filter public SEO URLs | 0 in eligible inventory                               |

See `docs/seo/RYZE-CURRENT-INVENTORY.csv`.

## P0 fixes delivered

### 1. Production sitemap + robots

- Live `https://fabstitch.net/sitemap.xml` → **200**, `application/xml`, valid sitemapindex
- Live `https://fabstitch.net/robots.txt` → Allow for `/discover/`, `/marketplace/`, `/fabrics/`, etc.; private areas Disallow
- No `Disallow: /`

### 2. Duplicate discover consolidation

**Already fixed (verified):**

- `/discover/{material}-fabric-guide/` → canonical material/collection page (**308**, not in sitemap)
- Examples: crepe, jersey, poplin, georgette guide twins

**New this pass (cannibalization Ryze did not name but code verified):**

| Weaker                     | Stronger                                 | Action                                  |
| -------------------------- | ---------------------------------------- | --------------------------------------- |
| `/discover/opaque-fabric/` | `/discover/understanding-opaque-fabric/` | **301** + removed from registry/sitemap |
| `/discover/flowy-fabric/`  | `/discover/understanding-flowy-fabric/`  | **301** + removed from registry/sitemap |

No redirect chains (source → final → null).

### 3. Opaque fabric (ranking case study)

| Field    | Before (production)                                           | After (frontend)                                      |
| -------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| Title    | Understanding Opaque Fabric **Sourcing Notes**                | **What Is Opaque Fabric? How to Check Before Buying** |
| H1       | Understanding Opaque Fabric                                   | **What Is Opaque Fabric?**                            |
| Body     | ~thin education template; repeated colourway sentence         | **~1,400 words** curated education                    |
| FAQ      | Included “Where does a what is opaque fabric search go next?” | Page-specific opacity FAQs                            |
| Twin URL | Competing `/discover/opaque-fabric/`                          | Redirected to understanding URL                       |

### 4. Other ranking / click-opportunity pages

| URL                                     | Change                                                                      |
| --------------------------------------- | --------------------------------------------------------------------------- |
| `/discover/twill-vs-wool/`              | Curated comparison: structure vs fibre, GSM limits, when to start with each |
| `/discover/understanding-flowy-fabric/` | Curated drape/weight/construction/applications + FAQ                        |
| `/discover/lightweight-cotton-fabric/`  | Curated buyer-intent cotton + lightweight checks                            |

Details: `docs/seo/RYZE-CLICK-OPPORTUNITIES.csv`.

### 5. Global on-page defects

- Removed malformed FAQ template `Where does a {keyword} search go next?` from `composeFaqs`
- Removed **Sourcing Notes** from automatic title padding tails

## Thin content policy (no mass keyword-swap)

- **Do not** inject a 1,000-word universal template across thousands of URLs
- **Do** deepen pages with Search Console / ranking evidence first
- Combination / marketplace template pages remain supporting; grades in inventory CSV

Content grades (meaningful-body heuristic on registry):

| Grade | Meaning          | Approx count |
| ----- | ---------------- | ------------ |
| A     | Strong           | 46           |
| B     | Needs enrichment | 288          |
| C     | Thin             | 1,560        |
| D     | Extremely thin   | 575          |

## What frontend cannot fix

- Referring domains / Domain Rank / US keyword database footprint
- Guest posts and apparel-sourcing mentions (Ryze P1 off-page)
- Fabricating Search Console impressions, CTR, or US demand

## Remaining frontend opportunities (P1/P2)

- Continue curated enrichment for other understanding-* vs attribute pairs only when intent truly duplicates
- Metadata uniqueness pass on remaining short titles (no Sourcing Notes pad)
- Image SEO + mobile performance monitored via existing `seo:image-audit` / `qa:seo-browser`
- Orphan / crawl-depth improvements via contextual links on hubs (no footer spam)

## Validation

Executed in this remediation (see commit notes for exact command results):

- TypeScript / ESLint / Prettier / production build
- `seo:semantic`, `seo:sitemap`, `seo:robots`, `seo:technical-audit`, `seo:metadata-quality`, `seo:full-audit` (and related SEO scripts as run)
- Production representative fetches for sitemap, robots, and ranking URLs

## Files of record

- `docs/seo/RYZE-CURRENT-INVENTORY.csv`
- `docs/seo/RYZE-CLICK-OPPORTUNITIES.csv`
- `docs/seo/RYZE-ISSUE-REGISTER.csv`
- `docs/seo/RYZE-SEO-REMEDIATION-REPORT.md` (this file)
- `domain/seo/semantic/curated-attributes.ts`
- `lib/storefront-redirects.ts`
- `domain/seo/snippet-length.ts`
- `domain/seo/semantic/compose.ts`
