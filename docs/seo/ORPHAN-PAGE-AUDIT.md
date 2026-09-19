# Orphan page audit

This is the registry crawl graph used by `npm run seo:technical-audit`. It is not a live Screaming Frog crawl of https://fabstitch.net.

The graph starts at `/` and follows:

- header and footer
- homepage and catalog cards (fabrics, collections, Best For)
- marketplace support pages, topic hubs, and topic children
- guide lists and guide body links
- fabric-question related paths
- discover directories, including pagination
- collection related links
- semantic page related paths

A `relatedPaths`-only graph would miss directory listing edges and would look like thousands of orphans. That incomplete graph is not the audit.

| Check | Result |
| --- | ---: |
| Indexable pages | 2266 |
| Orphans in the technical crawl graph | 0 |
| Crawl depth over 4 | 0 |

`npm run seo:technical-audit` reported orphans 0 and deep crawl 0 on this registry. The 16 thin pages in that audit are help and utility pages, which stay indexable as support content and are excluded from the 80-word content gate.

Discovery paths that must stay intact:

- Home → `/marketplace/` → topic hub → topic page
- Home → `/discover/` → cluster directory → topic page
- Home → `/fabrics/` → fabric, collection, or Best For page
- Home → `/guides/` → guide or `/guides/fabric-questions/` → question
- Footer → `/help/` → help article

No indexable page should be left off those paths. Do not noindex a page only because its editorial incoming links are few. Chrome and directory links are valid discovery paths.
