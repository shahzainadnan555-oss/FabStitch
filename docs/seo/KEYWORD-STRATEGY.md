# FabStitch keyword strategy (verified framework)

**Production:** https://fabstitch.net  
**Dataset:** [`docs/seo/fabstitch-keyword-map.csv`](./fabstitch-keyword-map.csv)  
**Generator:** `npm run seo:keywords` → `scripts/seo/generate-keyword-map.mts`

## Data integrity rules

| Field               | Policy                                                                      |
| ------------------- | --------------------------------------------------------------------------- |
| Volume              | **TBD** until SEMrush / Google Ads Keyword Planner / GSC export is imported |
| Difficulty          | **TBD** until verified research is imported                                 |
| Current Rank / SERP | **TBD** — never claim Top 10 without GSC or SEMrush evidence                |
| Keyword phrases     | Real fabric search intent derived from FabStitch catalog + strategy seeds   |
| Country rows        | Research segmentation only — **no country doorway pages**                   |

There is **no SEMrush, GSC, or Keyword Planner export** in this repository today.  
All numeric metrics are intentionally blank (`TBD`), not estimated.

## Universe snapshot

Regenerate before quoting counts:

```bash
npm run seo:keywords
```

Expected shape after generation:

- **1,000+ unique keywords** (typically 2,500+ with country research rows)
- **30+ clusters**
- Metrics columns always `TBD`
- Status values: `mapped`, `mapped_indexable`, `mapped_noindex_holdback`, `planned`, `hub_fallback`, `research_segment_no_localized_page`

## Rank buckets (evidence required)

| Bucket                                | Definition                         | Current state                                                       |
| ------------------------------------- | ---------------------------------- | ------------------------------------------------------------------- |
| A. Existing Top-10                    | Verified GSC/SEMrush position ≤ 10 | **DATA REQUIRED**                                                   |
| B. Top-20 / Top-50 opportunities      | Verified positions 11–50           | **DATA REQUIRED**                                                   |
| C. High-volume commercial not ranking | High volume + no ranking           | **DATA REQUIRED** (map ready: marketplace / collections / best-for) |
| D. Long-tail opportunities            | Specific fabric/use phrases        | Mapped from catalog names + Best For                                |
| E. Content-gap keywords               | Intent without adequate page       | Two guides created; remaining gaps listed below                     |

## Primary keyword → page map (one primary each)

| Page                                                | Primary keyword                          | Intent        | Secondaries (semantic, not stuffed)                  |
| --------------------------------------------------- | ---------------------------------------- | ------------- | ---------------------------------------------------- |
| `/`                                                 | fabstitch                                | Navigational  | fabric marketplace, fabric sourcing                  |
| `/marketplace/`                                     | fabric marketplace                       | Commercial    | fabric sourcing, buy fabric online, wholesale fabric |
| `/fabrics/`                                         | explore fabrics                          | Commercial    | fabric types, browse fabrics                         |
| `/collections/`                                     | fabric collections                       | Commercial    | material fabrics, textile collections                |
| `/collections/cotton/`                              | cotton fabric                            | Commercial    | cotton fabrics, cotton fabric online                 |
| `/collections/linen-lightweight/`                   | linen fabric                             | Commercial    | linen fabrics, lightweight linen                     |
| `/collections/silk-sheer/`                          | silk fabric                              | Commercial    | sheer silk, silk chiffon fabric                      |
| `/collections/denim/`                               | denim fabric                             | Commercial    | lightweight denim, denim fabrics                     |
| `/fabrics/best-for/`                                | fabrics by use                           | Commercial    | fabric for shirts/dresses/…                          |
| `/fabrics/best-for/shirts/`                         | fabric for shirts                        | Commercial    | shirt fabrics, best fabric for shirts                |
| `/fabrics/best-for/dresses/`                        | fabric for dresses                       | Commercial    | dress fabrics                                        |
| `/fabrics/best-for/activewear/`                     | fabric for activewear                    | Commercial    | performance fabric                                   |
| `/fabrics/{slug}/`                                  | `{fabric name}` / `{name} fabric`        | Commercial    | composition + documented uses                        |
| `/guides/fabric-weight-and-gsm/`                    | what is gsm in fabric                    | Informational | fabric weight gsm                                    |
| `/guides/cotton-vs-linen/`                          | cotton vs linen                          | Informational | linen vs cotton                                      |
| `/guides/how-to-buy-fabric-online/`                 | how to buy fabric online                 | Informational | buy fabric online (supports marketplace)             |
| `/guides/how-to-source-fabric-for-clothing-brands/` | how to source fabric for clothing brands | Informational | fabric sourcing for fashion brands                   |

## Cluster list

Fabric Marketplace · Fabric Discovery · Brand · Cotton Fabrics · Linen Fabrics · Silk Fabrics · Wool Fabrics · Denim Fabrics · Knit Fabrics · Woven Fabrics · Performance Fabrics · Velvet & Pile · Technical Outerwear · Home & Contract Textiles · Fabric Characteristics · Fabric for {Use} · Best For Applications · Use-Based Keywords · Fabric Comparisons · Fabric Education · Fabric Guides · Fabric Collections · Named Fabrics · Fabric Buying Guides · Fabric Sourcing Guides · Country Opportunity

## Cannibalization controls

1. **One primary keyword per URL** (enforced in this map).
2. Informational “what is / how to / vs” phrases map to **guides**, not money hubs.
3. Material generics (`cotton fabric`) map to **collections**, not every cotton PDP.
4. Named products (`european flax linen fabric`) map to **PDPs**.
5. Country variants share the same URL — no localized duplicates.
6. Holdback PDPs stay `mapped_noindex_holdback` until quality/publication gates pass.

## Content gaps

### Created in this pass

- `/guides/how-to-buy-fabric-online/`
- `/guides/how-to-source-fabric-for-clothing-brands/`

### Planned only if verified demand appears later

- Deeper buyer guides for boutiques vs manufacturers (only with unique briefs)
- Additional comparison guides where catalog support exists
- Do **not** auto-generate hundreds of thin articles from the CSV

## Import workflow (when real data arrives)

1. Export GSC Queries + Pages (28 days) and/or SEMrush position tracking.
2. Join on the `Keyword` column in `fabstitch-keyword-map.csv`.
3. Fill `Volume`, `Difficulty`, `Current Rank` **only** from the export.
4. Set `Status` for Top-10 rows to `verified_top10` with source + date in git commit message.
5. Re-prioritize P0/P1 using commercial intent × verified opportunity — never invent scores.

## Topical authority hierarchy

```
Fabric sourcing / marketplace
  → Fabrics hub + Collections
    → Best For (use)
      → Fabric PDP → Inquiry
  → Guides / comparisons (support upward links)
```
