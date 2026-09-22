# Google indexing forensic audit

**Production:** https://fabstitch.net  
**Repository:** https://github.com/shahzainadnan555-oss/FabStitch.git  
**GSC screenshot (user-reported):** Indexed ~8 · Not indexed ~2.27K (Discovered 2,247 · Crawled 17 · noindex 2 · 404 1)

This audit does **not** claim Google will index every sitemap URL. It identifies barriers FabStitch controls.

## 1. GSC screenshot findings

| Status                             | Count (approx.) | Interpretation                                                         |
| ---------------------------------- | --------------: | ---------------------------------------------------------------------- |
| Indexed                            |               8 | A tiny share of the published indexable corpus is indexed              |
| Discovered – currently not indexed |           2,247 | Google knows the URLs (sitemap/links) but has not crawled most of them |
| Crawled – currently not indexed    |              17 | Crawled and not selected for the index (quality/dupe/intent/unknown)   |
| Excluded by noindex                |               2 | Intentional or residual noindex                                        |
| Not found (404)                    |               1 | One dead URL still referenced somewhere                                |

The dominant bucket is **Discovered, not crawled**. That matches a large recent publication of ~2,267 sitemap URLs, not a root robots block.

## 2. Production sitemap status (verified this pass)

| Check                               | Result                          |
| ----------------------------------- | ------------------------------- |
| `https://fabstitch.net/sitemap.xml` | **HTTP 200**, `application/xml` |
| Sitemap type                        | sitemapindex                    |
| Child sitemaps                      | **19**                          |
| Total page `<loc>` URLs             | **2,267** unique                |
| Duplicate page locs                 | **0**                           |
| Query-string locs                   | **0**                           |
| `sitemap-index.xml`                 | **308 → /sitemap.xml** then 200 |
| Local inventory                     | **2267** (matches production)   |

**Previous audit claimed production sitemap HTTP 500.** That failure **does not reproduce** on the live host now.

## 3. Production robots

`https://fabstitch.net/robots.txt` returns **200**. Public SEO trees are Allow. Private trees are Disallow. Sitemap points at `/sitemap.xml`. No root `Disallow: /`.

## 4. Discovered – currently not indexed

Discovery surfaces: sitemap index + children, internal links, robots sitemap line.

Amplifiers with evidence:

1. Large recent URL set (~2,267) vs ~8 indexed
2. Combination corpus (discover + marketplace topics)
3. Near-duplicate section shapes in combination clusters
4. **Broken Best For money pages** (SEO slug ≠ API slug) serving noindex + empty main to Googlebot

Not the primary cause today: root robots block, production sitemap 500, query URLs in sitemap.

## 5. Crawled – currently not indexed (17)

Exact GSC URL list was not exported. Per-URL reasons stay **UNKNOWN** without that export.

## 6. Critical defect fixed: Best For crawlability

| SEO slug        | API candidates                     | Production before fix                 |
| --------------- | ---------------------------------- | ------------------------------------- |
| shirts          | shirts, shirting                   | noindex “not found”, loader-only HTML |
| activewear      | activewear, performance-apparel, … | same                                  |
| tailoring       | soft-tailoring / suiting           | same                                  |
| home-textiles   | home-decor                         | same                                  |
| womens-clothing | dresses, blouses, …                | same                                  |

Fix: registry metadata + API candidate resolution + local `FABRICS_2027` fallback. Canonical SEO URLs unchanged.

Local fabric counts after fallback: shirts=47, womens-clothing=71, dresses=51, trousers=27, tailoring=17, activewear=32, knitwear=36, resortwear=8, occasionwear=7, outerwear=17, home-textiles=22, upholstery=4, bedding=7.

## 7. Indexability decisions

Do **not** mass-noindex combination pages solely to shrink GSC “Discovered”. Keep them as supporting notes. Do not add more. Parent hubs own head terms.

See `INDEXABILITY-AUDIT.csv` and `INDEXING-DUPLICATION-AUDIT.csv`.

## 8. Root causes (ordered)

1. Large indexable publication discovered before crawl catch-up
2. Broken production Best For SEO pages (API slug mismatch)
3. Large combination clusters increasing crawl demand
4. Historical robots/sitemap failures — **resolved** on production

## 9. Registry snapshot

| Metric                   | Count |
| ------------------------ | ----: |
| Public                   |  2471 |
| Indexable                |  2267 |
| Noindex                  |   204 |
| Sitemap eligible         |  2267 |
| Child sitemaps           |    19 |
| Duplication sample pairs |   454 |
