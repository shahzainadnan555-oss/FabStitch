# FabStitch sitemap architecture

## Public entry

- `https://fabstitch.net/sitemap.xml` — **sitemap index**
- `https://fabstitch.net/robots.txt` — references the index
- `https://fabstitch.net/sitemap-index.xml` — 308 → `/sitemap.xml`

## Child sitemaps

Generated only when non-empty:

| Child                               | Contents                                                  |
| ----------------------------------- | --------------------------------------------------------- |
| `/sitemaps/sitemap-core/`           | Home, marketplace, brand, help, commercial landings       |
| `/sitemaps/sitemap-fabrics/`        | Fabric hubs and intent hubs                               |
| `/sitemaps/sitemap-collections/`    | Collection hub + collections                              |
| `/sitemaps/sitemap-best-for/`       | Best For hub + use cases                                  |
| `/sitemaps/sitemap-guides/`         | Guide hub + guides                                        |
| `/sitemaps/sitemap-products/`       | Curated fabric PDPs                                       |
| `/sitemaps/sitemap-discover-001/` … | Discover hub, topic directories, semantic pages (chunked) |

## Eligibility gate

A URL enters a sitemap only when it is:

- public, indexable, self-canonical
- quality-gate passed
- absolute `https://fabstitch.net/…`
- free of query parameters
- not private/auth/admin
- not a soft/thin placeholder below the content threshold

`lastmod` is emitted only when accurate modification metadata exists.
Fake build/deploy timestamps are never used.

## Image data

Where a page has a real `/media/…` fabric/hero image on disk, the child
urlset includes Google image sitemap `image:loc` entries.

## Discovery (not sitemap-only)

`/discover/` is a crawl hub with topic-group directories under
`/discover/topics/{cluster}/` (paginated). Semantic pages link back to their
cluster directory and related topics via normal `<a href>` anchors.

## Validation

```bash
npm run seo:sitemap
```

Writes `docs/seo/SITEMAP-VALIDATION.json` and fails the process on errors.
