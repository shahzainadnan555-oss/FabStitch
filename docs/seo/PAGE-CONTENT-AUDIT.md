# Page content audit

Frontend content pass after the page-value inventory. Routes, canonicals, robots, and the sitemap URL set were not redesigned. Indexable count remains 2266. Noindex remains 205. Public registry remains 2471.

The per-page sheet is [PAGE-CONTENT-INVENTORY.csv](PAGE-CONTENT-INVENTORY.csv).

## Totals

| Set       | Count |
| --------- | ----: |
| Public    |  2471 |
| Indexable |  2266 |
| Noindex   |   205 |

Noindex is still the catalog holdback (187 fabrics), 9 guides, 8 private routes, and 1 support page. Those were not forced indexable.

## Pages by intent

- brand: 2
- commercial: 27
- commercial_investigation: 2033
- informational: 185
- support: 17
- navigational: 2

## Pages by cluster

Average unique score compares page body text inside the cluster after fibre, garment, and attribute names are replaced. A page that only swaps "cotton" for "linen" is not treated as unique. This is an internal editorial score, not a Google threshold. Clusters larger than 600 pages were not pair-scored.

| Cluster             | Pages | Avg unique | High overlap |
| ------------------- | ----: | ---------: | -----------: |
| attributes          |   241 |         34 |          240 |
| material_use        |   506 |         37 |          422 |
| materials           |    41 |         44 |            9 |
| weight              |    91 |         47 |            2 |
| buyers              |   111 |         47 |            2 |
| material_attribute  |   232 |         50 |            0 |
| use_attribute       |   174 |         52 |            0 |
| buying              |   181 |         53 |            0 |
| sourcing            |    92 |         53 |            2 |
| use-cases           |    31 |         54 |            5 |
| semantic_landing    |    19 |         56 |            7 |
| b2b                 |    77 |         56 |            2 |
| comparisons         |    47 |         56 |            0 |
| construction        |    35 |         59 |            0 |
| comparison          |    34 |         60 |            0 |
| education           |   121 |         64 |            8 |
| home                |     1 |         70 |            0 |
| marketplace         |     1 |         70 |            0 |
| fabric_hub          |     1 |         70 |            0 |
| collection_hub      |     1 |         70 |            0 |
| best_for_hub        |     1 |         70 |            0 |
| guide_hub           |     1 |         70 |            0 |
| help_hub            |     1 |         70 |            0 |
| collection          |    12 |         81 |            0 |
| use_case            |    15 |         81 |            0 |
| fabric              |    12 |         82 |            0 |
| material            |    15 |         84 |            0 |
| attribute           |    11 |         92 |            0 |
| intent_hub          |     6 |         97 |            0 |
| seasonal_collection |     3 |         97 |            0 |
| best_for            |    13 |         97 |            0 |
| guide               |    13 |         97 |            0 |
| marketplace_support |    22 |         99 |            0 |
| fabric_question     |    72 |         99 |            0 |
| commercial_landing  |     2 |        100 |            0 |
| brand               |     3 |        100 |            0 |
| help                |    16 |        100 |            0 |
| commercial          |    11 |        100 |            0 |

## Value classes

| Class | Count | Meaning                                                 |
| ----- | ----: | ------------------------------------------------------- |
| A     |   394 | Distinct job and distinct body                          |
| B     |  1171 | Useful; still shares a frame or a catalog note          |
| C     |   699 | Same cluster still overlaps; restructure, do not delete |
| D     |     2 | Alias or same-keyword duplicate; review only            |

Risk counts: strong 363, review 1204, high overlap 699.

## What changed in the pages

Discover composition no longer appends the same closer ("A practical discovery path", "From brief to inquiry", "How to use the note") to every URL. Each page type now uses its own section job:

- material: fibre behaviour, construction, watchouts
- use: garment constraints, weight, brief
- attribute: definition, how to judge, trade-off
- material + use: what the garment asks of that fibre
- material + attribute: how to judge the attribute on that fibre
- use + attribute: where the attribute helps or fights the garment
- comparison: overlap, each side, when to start with either
- construction: the build, not the fibre name

Marketplace topic headings are no longer the copied set "Search / Read the cloth / Inquire / Marketplace check / The garment test". The word-count floor that forced those cloned closers is gone. A page stays in the registry when it has a real body. Help pages stay excluded from that floor.

Library education pages no longer repeat their own paragraphs under "What this means / Why it matters when sourcing".

## Duplicate-risk pages

These are review items. Nothing was redirected or noindexed.

- `/discover/denim-versus-twill/` still aliases `/discover/denim-vs-twill/`.
- `/discover/lightweight-denim-fabric/` still uses the same head term as `/fabrics/lightweight-denim/`.
- `/discover/fabric-for-dresses/` still shares "fabric for dresses" with `/fabrics/dress-fabric/`.
- `/discover/how-knit-fabric-is-built/` should keep its URL and stop using the head term "knit fabric".
- Question indexes for materials and quality should narrow their labels. Do not merge them into the hubs.

## Highly similar groups

Combination pages in `material_use`, `material_attribute`, and `use_attribute` still quote the same ontology paragraphs (a cotton hand note appears on every cotton combination). The section job is now different. The paragraphs are not yet pair-specific essays. That is the remaining overlap, and it is listed in [PAGE-DIFFERENTIATION-REPORT.md](PAGE-DIFFERENTIATION-REPORT.md).

## Weak images

Photographs are real catalog files. The same cotton poplin file still illustrates many cotton topics, which is honest for the fibre and weak when the page is about a different construction. Knit construction topics now prefer the jersey photograph instead of the material's woven file. See [IMAGE-QUALITY-AUDIT.md](IMAGE-QUALITY-AUDIT.md).

## Weak metadata

Titles and descriptions still come from the existing snippet fitter. This pass did not invent a second title system and did not add meta keywords. Descriptions that shared a first sentence because they shared an intro template are reduced where the intro now starts from the page's own entities.

## Weak internal links

Related links still go to the marketplace, the collection, the Best For edit, and the matching guide when those URLs exist. They were not replaced with a new link graph.

## Strong pages

Guides, fabric-question answers, the two sourcing landings, the marketplace hub, and the hand-written library notes remain the pages to protect. They were not rewritten into the combination template.

## Consolidation

Do not delete combination URLs in this pass. Give each remaining high-overlap pair a different job, or fold only the three review URLs above after a separate redirect change.
