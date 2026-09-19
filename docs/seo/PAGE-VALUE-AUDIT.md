# FabStitch page-value audit

Read-only inventory of the current storefront SEO registry. No routes, canonicals, sitemap files, robots rules, or page copy were changed. Recommendations are not applied.

Generated from the live registry at audit time: 2471 public pages, 2266 indexable, 205 noindex.

The per-page inventory is [`PAGE-VALUE-INVENTORY.csv`](PAGE-VALUE-INVENTORY.csv). This note is the interpretation.

## How the score works

Comparison uses page-specific body text only: intros, sections, answers, FAQs, tables, and the rendered fabric, collection, Best For, and seasonal notes. Header, footer, navigation, cookie UI, and the repeated call-to-action block on discover pages are not part of the comparison.

Within each topical cluster, every page is compared with its siblings. Entity names (materials, uses, attributes, constructions, fabric names) are replaced before the comparison, so two pages that only swap "cotton" for "linen" are not treated as unique. The CSV `unique_content_score` is that internal score, 0–100. Directory pages are the exception: their content is the link list, so they are scored before entity names are removed. Stripping those names would make every page of a directory look identical.

- Above 60: STRONG DIFFERENTIATION
- 40–60: REVIEW
- Below 40: HIGH OVERLAP

This is not a Google threshold. A high template overlap with a different query is class C (improve), not class D (duplicate). Class D is reserved for high overlap plus a close primary keyword and the same intent. Distinct fabric, collection, and Best For URLs are never recommended for merge.

Crawl depth uses the same link graph as `scripts/seo/technical-audit.mts`, including header and footer, measured from `/`. Incoming and outgoing counts exclude that sitewide chrome, so a footer link is not counted as an editorial link. Word count is the registry count where the page already stores one, otherwise the meaningful body. It is not the quality score.

Image quality was not judged by looking at the files. Alt and title come from the image catalog. One registry image is counted per page. The homepage and marketplace also render extra images in their templates; those extras are not a second registry row.

## 1. Total pages

| Set | Count |
| --- | ---: |
| Public registry | 2471 |
| Indexable | 2266 |
| Noindex | 205 |
| Sitemap-eligible among indexable | 2266 |
| Self-canonical indexable | 2266 |

## 2. Total indexable

2266

## 3. Total noindex

205

Noindex by type:

- support: 1
- fabric: 187
- guide: 9
- private: 8

These pages are already out of the indexable set. The 187 withheld fabric pages stay noindex under the catalog holdback. This audit does not recommend forcing them indexable.

## 4. Category counts

Marketplace topic pages whose family is buying, sourcing, or B2B stay in Marketplace, because that is their URL. The two commercial landings (`/wholesale-fabric/`, `/fabric-sourcing/`) are the B2B/Sourcing category. They are not counted twice.

| Category | Total | A | B | C | D |
| --- | ---: | ---: | ---: | ---: | ---: |
| Marketplace | 1023 | 57 | 575 | 391 | 0 |
| Discover | 1085 | 50 | 153 | 880 | 2 |
| Fabric | 19 | 7 | 12 | 0 | 0 |
| Collections | 16 | 4 | 12 | 0 | 0 |
| Guides | 14 | 14 | 0 | 0 | 0 |
| Best For | 14 | 1 | 13 | 0 | 0 |
| Questions | 72 | 67 | 5 | 0 | 0 |
| B2B/Sourcing | 2 | 2 | 0 | 0 | 0 |
| Help | 17 | 1 | 16 | 0 | 0 |
| Brand | 3 | 0 | 3 | 0 | 0 |
| Other | 1 | 1 | 0 | 0 | 0 |
| **All indexable** | **2266** | **204** | **789** | **1271** | **2** |

## 5. A/B/C/D counts

| Class | Meaning | Count |
| --- | --- | ---: |
| A | Strong | 204 |
| B | Useful, needs improvement | 789 |
| C | Weak or overlapping template | 1271 |
| D | Duplicate or redundant | 2 |

Recommended action, not applied:

- KEEP INDEXABLE: 241
- IMPROVE: 2022
- MERGE: 1
- REDIRECT: 2

## 6. Highest-overlap clusters

Average unique score is after entity names are removed. Lower means the cluster is one template with swapped nouns.

| Cluster | Pages | Avg unique | High overlap | Review | Strong |
| --- | ---: | ---: | ---: | ---: | ---: |
| fabric | 12 | 22 | 11 | 1 | 0 |
| discover:material_use | 506 | 26 | 497 | 9 | 0 |
| discover:material_attribute | 232 | 31 | 227 | 5 | 0 |
| marketplace:attributes | 241 | 31 | 200 | 40 | 1 |
| discover:construction | 35 | 37 | 26 | 8 | 1 |
| discover:use_attribute | 174 | 37 | 128 | 46 | 0 |
| marketplace:buying | 181 | 39 | 95 | 85 | 1 |
| marketplace:education | 88 | 41 | 31 | 56 | 1 |
| marketplace:sourcing | 92 | 42 | 22 | 69 | 1 |
| marketplace:b2b | 77 | 43 | 20 | 56 | 1 |
| marketplace:weight | 91 | 45 | 4 | 86 | 1 |
| marketplace:buyers | 111 | 45 | 7 | 103 | 1 |
| discover:attribute | 11 | 48 | 0 | 11 | 0 |
| marketplace:materials | 41 | 49 | 8 | 32 | 1 |
| marketplace:use-cases | 31 | 49 | 4 | 26 | 1 |
| discover:use_case | 15 | 53 | 0 | 14 | 1 |
| best_for | 13 | 58 | 0 | 6 | 7 |
| discover:comparison | 34 | 59 | 0 | 27 | 7 |
| marketplace:comparisons | 47 | 61 | 0 | 22 | 25 |
| collection | 12 | 62 | 0 | 6 | 6 |
| discover:material | 15 | 63 | 0 | 2 | 13 |
| question:comparisons | 9 | 73 | 0 | 0 | 9 |
| discover:education | 33 | 75 | 2 | 9 | 22 |
| question:materials | 9 | 78 | 0 | 0 | 9 |
| question:care | 9 | 78 | 0 | 0 | 9 |
| question:quality | 12 | 80 | 0 | 0 | 12 |
| seasonal_collection | 3 | 81 | 0 | 0 | 3 |
| question:identification | 5 | 81 | 0 | 0 | 5 |
| question:use-cases | 10 | 81 | 0 | 0 | 10 |
| question:marketplace | 6 | 82 | 0 | 0 | 6 |
| question:definitions | 5 | 83 | 0 | 0 | 5 |
| marketplace-support:buying | 9 | 85 | 0 | 0 | 9 |
| question:sustainability | 6 | 86 | 0 | 0 | 6 |
| marketplace-support:sourcing | 3 | 88 | 0 | 0 | 3 |
| marketplace-support:b2b | 3 | 88 | 0 | 0 | 3 |
| marketplace-support:journey | 3 | 88 | 0 | 0 | 3 |
| marketplace-support:brand | 2 | 88 | 0 | 0 | 2 |
| discover:commercial | 11 | 90 | 0 | 0 | 11 |
| marketplace-support:education | 2 | 90 | 0 | 0 | 2 |
| intent_hub | 6 | 96 | 0 | 0 | 6 |
| brand | 3 | 99 | 0 | 0 | 3 |
| help | 16 | 99 | 0 | 0 | 16 |
| directory:use_attribute | 2 | 99 | 0 | 0 | 2 |
| home | 1 | 100 | 0 | 0 | 1 |
| marketplace | 1 | 100 | 0 | 0 | 1 |
| fabric_hub | 1 | 100 | 0 | 0 | 1 |
| commercial_landing | 2 | 100 | 0 | 0 | 2 |
| collection_hub | 1 | 100 | 0 | 0 | 1 |
| best_for_hub | 1 | 100 | 0 | 0 | 1 |
| guide_hub | 1 | 100 | 0 | 0 | 1 |
| help_hub | 1 | 100 | 0 | 0 | 1 |
| guide | 13 | 100 | 0 | 0 | 13 |
| semantic_landing | 1 | 100 | 0 | 0 | 1 |
| directory:material | 1 | 100 | 0 | 0 | 1 |
| directory:use_case | 1 | 100 | 0 | 0 | 1 |
| directory:attribute | 1 | 100 | 0 | 0 | 1 |
| directory:material_use | 6 | 100 | 0 | 0 | 6 |
| directory:material_attribute | 3 | 100 | 0 | 0 | 3 |
| directory:construction | 1 | 100 | 0 | 0 | 1 |
| directory:education | 1 | 100 | 0 | 0 | 1 |
| directory:comparison | 1 | 100 | 0 | 0 | 1 |
| directory:commercial | 1 | 100 | 0 | 0 | 1 |
| question:index | 1 | 100 | 0 | 0 | 1 |

## 7. Lowest-value page groups

Class C and D are concentrated in the large composed clusters: discover `material_use`, `material_attribute`, and `use_attribute`, and the marketplace topic families that explain a search with the same section pattern.

Those pages are not empty. They name a real fibre, use, or attribute, and the raw text often looks more unique than the entity-normalized score. The weakness is that a buyer who already read one page learns little from the next page in the family.

Directory pagination (`/discover/topics/.../page/N/`) is a list, not a second essay. Where the link list is distinct, the recommendation is to keep it indexable.

## 8. Strongest page groups

Treat these as the pages to protect:

- Home, `/marketplace/`, `/fabrics/`, `/collections/`, `/discover/`
- `/wholesale-fabric/` and `/fabric-sourcing/`
- The 12 indexable fabric pages
- Collection and seasonal collection pages
- Best For pages
- The 13 indexable guides and the fabric-question answers that are not template siblings
- Help and brand pages, as task pages rather than as ranking essays

Class A rows in the CSV are the current strong set. Class B rows in Help and Brand are still worth keeping.

## 9. Keyword conflicts

Exact primary-keyword collisions among indexable pages: 9.

- "fabric materials": /fabrics/, /guides/fabric-questions/materials/
- "fabric for dresses": /fabrics/dress-fabric/, /discover/fabric-for-dresses/
- "lightweight denim fabric": /fabrics/lightweight-denim/, /discover/lightweight-denim-fabric/
- "shirt, dress & garment fabrics": /discover/topics/material-use/, /discover/topics/material-use/page/2/, /discover/topics/material-use/page/3/, /discover/topics/material-use/page/4/, /discover/topics/material-use/page/5/, /discover/topics/material-use/page/6/
- "material characteristics": /discover/topics/material-attribute/, /discover/topics/material-attribute/page/2/, /discover/topics/material-attribute/page/3/
- "use-case characteristics": /discover/topics/use-attribute/, /discover/topics/use-attribute/page/2/
- "knit fabric": /discover/knit-fabric/, /discover/how-knit-fabric-is-built/
- "denim vs twill": /discover/denim-vs-twill/, /discover/denim-versus-twill/
- "fabric quality": /discover/how-to-evaluate-fabric-quality/, /guides/fabric-questions/quality/

Near conflicts are pages whose nearest sibling shares the intent label and at least 60% of the keyword tokens, or whose body is high-overlap. The first 40 are below. Same-intent template pages with different keywords are listed as overlap, not as the same keyword.

- Primary `/discover/topics/material-use/` vs `/discover/topics/material-use/page/2/`. Keyword "shirt, dress & garment fabrics". Intent commercial_investigation. Similarity 100% entity-normalized, keyword similarity 100%. KEEP INDEXABLE.
- Primary `/discover/topics/material-use/page/2/` vs `/discover/topics/material-use/`. Keyword "shirt, dress & garment fabrics". Intent commercial_investigation. Similarity 100% entity-normalized, keyword similarity 100%. KEEP INDEXABLE.
- Primary `/discover/topics/material-use/page/3/` vs `/discover/topics/material-use/`. Keyword "shirt, dress & garment fabrics". Intent commercial_investigation. Similarity 100% entity-normalized, keyword similarity 100%. KEEP INDEXABLE.
- Primary `/discover/topics/material-use/page/4/` vs `/discover/topics/material-use/`. Keyword "shirt, dress & garment fabrics". Intent commercial_investigation. Similarity 100% entity-normalized, keyword similarity 100%. KEEP INDEXABLE.
- Primary `/discover/topics/material-use/page/5/` vs `/discover/topics/material-use/`. Keyword "shirt, dress & garment fabrics". Intent commercial_investigation. Similarity 100% entity-normalized, keyword similarity 100%. KEEP INDEXABLE.
- Primary `/discover/topics/material-use/page/6/` vs `/discover/topics/material-use/`. Keyword "shirt, dress & garment fabrics". Intent commercial_investigation. Similarity 100% entity-normalized, keyword similarity 100%. KEEP INDEXABLE.
- Primary `/discover/topics/material-attribute/` vs `/discover/topics/material-attribute/page/2/`. Keyword "material characteristics". Intent commercial_investigation. Similarity 100% entity-normalized, keyword similarity 100%. KEEP INDEXABLE.
- Primary `/discover/topics/material-attribute/page/2/` vs `/discover/topics/material-attribute/`. Keyword "material characteristics". Intent commercial_investigation. Similarity 100% entity-normalized, keyword similarity 100%. KEEP INDEXABLE.
- Primary `/discover/topics/material-attribute/page/3/` vs `/discover/topics/material-attribute/`. Keyword "material characteristics". Intent commercial_investigation. Similarity 100% entity-normalized, keyword similarity 100%. KEEP INDEXABLE.
- Primary `/discover/topics/use-attribute/` vs `/discover/topics/use-attribute/page/2/`. Keyword "use-case characteristics". Intent commercial_investigation. Similarity 100% entity-normalized, keyword similarity 100%. KEEP INDEXABLE.
- Primary `/discover/topics/use-attribute/page/2/` vs `/discover/topics/use-attribute/`. Keyword "use-case characteristics". Intent commercial_investigation. Similarity 100% entity-normalized, keyword similarity 100%. KEEP INDEXABLE.
- Primary `/discover/durable-linen-shirts/` vs `/discover/structured-linen-shirts/`. Keyword "durable linen fabric for shirts". Intent commercial_investigation. Similarity 80% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/structured-linen-shirts/` vs `/discover/durable-linen-shirts/`. Keyword "structured linen fabric for shirts". Intent commercial_investigation. Similarity 80% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/soft-cotton-shirts/` vs `/discover/structured-cotton-shirts/`. Keyword "soft cotton fabric for shirts". Intent commercial_investigation. Similarity 80% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/structured-cotton-shirts/` vs `/discover/soft-cotton-shirts/`. Keyword "structured cotton fabric for shirts". Intent commercial_investigation. Similarity 80% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/durable-silk-dresses/` vs `/discover/structured-silk-dresses/`. Keyword "durable silk fabric for dresses". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/structured-silk-dresses/` vs `/discover/durable-silk-dresses/`. Keyword "structured silk fabric for dresses". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/durable-viscose-shirts/` vs `/discover/structured-viscose-shirts/`. Keyword "durable viscose fabric for shirts". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/structured-viscose-shirts/` vs `/discover/durable-viscose-shirts/`. Keyword "structured viscose fabric for shirts". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/durable-cotton-trousers/` vs `/discover/structured-cotton-trousers/`. Keyword "durable cotton fabric for trousers". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/structured-cotton-trousers/` vs `/discover/durable-cotton-trousers/`. Keyword "structured cotton fabric for trousers". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/durable-cotton-blouses/` vs `/discover/structured-cotton-blouses/`. Keyword "durable cotton fabric for blouses". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/structured-cotton-blouses/` vs `/discover/durable-cotton-blouses/`. Keyword "structured cotton fabric for blouses". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/structured-jersey-shirts/` vs `/discover/premium-jersey-shirts/`. Keyword "structured jersey fabric for shirts". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/premium-jersey-shirts/` vs `/discover/structured-jersey-shirts/`. Keyword "premium jersey fabric for shirts". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/soft-cotton-trousers/` vs `/discover/structured-cotton-trousers/`. Keyword "soft cotton fabric for trousers". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/structured-denim-jackets/` vs `/discover/premium-denim-jackets/`. Keyword "structured denim fabric for jackets". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/premium-denim-jackets/` vs `/discover/structured-denim-jackets/`. Keyword "premium denim fabric for jackets". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/structured-linen-trousers/` vs `/discover/premium-linen-trousers/`. Keyword "structured linen fabric for trousers". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/premium-linen-trousers/` vs `/discover/structured-linen-trousers/`. Keyword "premium linen fabric for trousers". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/soft-viscose-shirts/` vs `/discover/structured-viscose-shirts/`. Keyword "soft viscose fabric for shirts". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/durable-cotton-shirts/` vs `/discover/premium-cotton-shirts/`. Keyword "durable cotton fabric for shirts". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/premium-cotton-shirts/` vs `/discover/durable-cotton-shirts/`. Keyword "premium cotton fabric for shirts". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/premium-viscose-shirts/` vs `/discover/structured-viscose-shirts/`. Keyword "premium viscose fabric for shirts". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/structured-denim-trousers/` vs `/discover/premium-denim-trousers/`. Keyword "structured denim fabric for trousers". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/premium-denim-trousers/` vs `/discover/structured-denim-trousers/`. Keyword "premium denim fabric for trousers". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/durable-wool-suits/` vs `/discover/structured-wool-suits/`. Keyword "durable wool fabric for suits". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/structured-wool-suits/` vs `/discover/durable-wool-suits/`. Keyword "structured wool fabric for suits". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/premium-cotton-blouses/` vs `/discover/structured-cotton-blouses/`. Keyword "premium cotton fabric for blouses". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.
- Primary `/discover/soft-denim-trousers/` vs `/discover/structured-denim-trousers/`. Keyword "soft denim fabric for trousers". Intent commercial_investigation. Similarity 79% entity-normalized, keyword similarity 50%. IMPROVE.

Do not add keywords to titles to "win" these conflicts. If two URLs answer the same question, one of them should be the page that ranks.

## 10. URL and slug issues

3 indexable pages have a slug note (length over 90, a double hyphen, or almost no token overlap with the primary keyword).

- `/discover/estimating-fabric-for-a-make/` — Body stays distinct from the nearest discover:education sibling /discover/how-to-evaluate-fabric-quality/ (10% entity-normalized overlap). Primary keyword is not reflected in the H1. Slug: slug does not align with the primary keyword.
- `/discover/what-fabstitch-helps-you-discover/` — Body stays distinct from the nearest discover:commercial sibling /discover/preparing-a-fabric-inquiry/ (9% entity-normalized overlap). Primary keyword is not reflected in the H1. Slug: slug does not align with the primary keyword.
- `/guides/fabric-questions/fabrics-for-fasteners/` — Body stays distinct from the nearest question:quality sibling /guides/fabric-questions/sewing-pucker/ (27% entity-normalized overlap). Slug: slug does not align with the primary keyword.

Pagination URLs under `/discover/topics/` are descriptive. They are not listed as broken slugs. Established collection and fabric slugs that already match the catalog should stay. This audit does not propose a rename program.

## 11. H1 / H2 issues

Registry records store one H1 per page. This pass did not re-render the DOM, so a second visible H1 in a template would not show up here. Duplicate registry H1s: 0.

No shared H1 string.

Pages whose H1 does not contain the primary keyword: 20.

Pages with no page-specific H2 in the content source: 37. Fabric, collection, and Best For notes are paragraphs, so they are in this count even when the page is useful. That is a structure gap, not a reason to noindex them.

Pages whose every H2 is a heading reused on 20 or more pages: 944.

Headings reused on 20 or more pages:

- "A practical discovery path" on 339 pages
- "From brief to inquiry" on 335 pages
- "How to shortlist on FabStitch" on 325 pages
- "Search" on 254 pages
- "Read the cloth" on 254 pages
- "Inquire" on 254 pages
- "Marketplace check" on 240 pages
- "What not to assume" on 240 pages
- "The garment test" on 180 pages
- "Keep the comparison fair" on 180 pages
- "What to bring back" on 110 pages
- "What this role should not assume" on 110 pages
- "How to use the band" on 90 pages
- "What still matters more" on 90 pages
- "How to use this answer" on 62 pages

## 12. Internal-link issues

Editorial orphans (no incoming link once header and footer are ignored): 2.

- `/help/` — No sibling in the same topical cluster. Useful task or brand page. Length is matched to the task, not padded. Canonical hub. Keep indexable even where the H1 is a brand line rather than the keyword.
- `/contact/` — Body stays distinct from the nearest brand sibling /how-it-works/ (1% entity-normalized overlap). Useful task or brand page. Length is matched to the task, not padded.

Pages with only one editorial incoming link: 1073.

Crawl depth over 4, or unreachable in the technical-audit graph: 0.

None.

The technical audit previously reported 0 orphans and 0 deep pages because header and footer edges are included. That result still holds for crawl depth. The orphan count above is the stricter editorial count.

Outgoing links follow `relatedPaths`, hub directories, and the same catalog edges as the technical audit. They stay inside FabStitch. This pass did not find a class of irrelevant off-topic destinations. The weak pattern is the opposite: many discover and marketplace pages link back to `/marketplace/` and `/discover/` and sideways to a sibling in the same template, which does not add a new reason to click.

## 13. Image issues

Pages with no registry image: 22.

Alt or title problems: 0.

None.

Files used on 25 or more indexable pages:

- `/media/fabrics/cotton-poplin-primary.webp` on 354 pages
- `/media/fabrics/tropical-wool-super-110s-130s-primary.webp` on 250 pages
- `/media/fabrics/european-flax-linen-primary.webp` on 201 pages
- `/media/fabrics/silk-chiffon-primary.webp` on 188 pages
- `/media/fabrics/mercerized-cotton-jersey-primary.webp` on 170 pages
- `/media/fabrics/lightweight-denim-primary.webp` on 126 pages
- `/media/fabrics/stretch-woven-compression-primary.webp` on 121 pages
- `/media/fabrics/crepe-de-chine-primary.webp` on 90 pages
- `/media/fabrics/wool-hemp-canvas-primary.webp` on 82 pages
- `/media/fabrics/linen-viscose-primary.webp` on 79 pages
- `/media/fabrics/soft-oxford-cotton-primary.webp` on 77 pages
- `/media/fabrics/tencel-plain-weave-primary.webp` on 74 pages

Alt text describes the photograph, and the same file correctly shares one alt. Reuse is a relevance limit, not a missing-alt defect: a cotton poplin photograph on a wool page does not illustrate that page. Title attributes are present when the catalog asset has one. Visual quality and compression were not re-measured in this pass.

## 14. Canonical issues

Indexable pages whose canonical is not their own URL: 0.

None.

Filtered marketplace query states stay noindex and point at `/marketplace/`. They are in the noindex set, not in this indexable list.

## 15. Sitemap issues

Indexable pages missing from the sitemap eligibility gate: 0.

None.

Indexable count and sitemap-eligible count match at 2266. Noindex pages are not sitemap-eligible. This audit did not refetch the live sitemap. A production `sitemap.xml` check is outside this registry pass.

## 16. Recommended consolidation plan

Do not apply this in the current step. The next implementation pass should be small and reversible.

1. Leave class A pages, the marketplace hub, the two B2B landings, the 12 fabric pages, collections, Best For, guides, questions, help, and brand pages indexable.
2. Do not merge two fabric URLs, two collection URLs, or two Best For URLs because their notes share a template. Improve those notes only if a buyer cannot tell the cloths apart. The recommendation on those rows is IMPROVE, not MERGE.
3. For discover clusters with a low average unique score, pick one indexable hub per family (`/discover/topics/{cluster}/`) and stop publishing near-duplicate combinations that repeat the same paragraphs. Combinations that answer a different job (a comparison, a construction, a care question) stay. Combinations that only swap a fibre into the same outline should be merged into the hub or the closest specific page, then redirected in a later change.
4. Apply the same rule inside each marketplace topic family. The family hub stays. Child pages that repeat the hub with a new noun should be merged. Child pages that answer a different buyer question stay and should be rewritten so the first screen is not the same outline.
5. Exact keyword collisions, if any are listed in section 9, are the first redirects. One URL keeps the keyword. The other redirects to it. Do not point those redirects at `/marketplace/` unless the surviving page is the marketplace hub.
6. Keep directory page 2 and later indexable when their link lists differ. Noindex them only where the CSV action is already NOINDEX.
7. Do not noindex help. Do not add the 187 held-back fabric pages to the index to "add content."
8. Do not stuff the surviving pages with the keywords of the pages you merge. One clear H1, headings that are not copied from the sibling, and a link to the marketplace or the fabric page that the reader should open next are enough.
9. Internal links: after any merge, point the family hub at the surviving URLs only. Remove links to URLs that will redirect.
10. Images: when a page stays indexable, prefer an image of that material. Shared decorative files can stay, but they should not be the only illustration on a page about a different fibre.

Class key used in the CSV:

- A — keep indexable
- B — keep, and improve headings, links, or specificity
- C — overlapping template or weak keyword fit; improve before adding more pages in that cluster
- D — redundant with a closer page; merge or redirect later, not now
