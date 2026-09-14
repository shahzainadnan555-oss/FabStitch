# FabStitch frontend SEO and controlled-launch report

Generated from the frontend-owned catalogue, publication registry and repeatable
audits on 12 September 2026. This report does not claim rankings, traffic,
crawling or search-engine indexing.

## 1. SEO architecture

`domain/seo/storefront-registry.ts` is the inspected page inventory. Every
record carries its canonical URL, page type, title, description, expected H1,
primary and secondary topics, parent, launch phase, related paths, content
source, schema expectations and publication result.

`domain/seo/launch-manifest.ts` is the current publication source. It implements
a source-neutral contract with local data only. No API, publishing service,
database, scheduler or Page Studio is connected.

The registered inventory contains 270 records:

- 199 approved fabric products
- 12 material collections and 3 seasonal collections
- 13 Best For pages
- 9 guides and 3 populated guide hubs
- public hubs, help, brand, legal and utility records

## 2. Indexability system

The publication contract supports:

- `draft`
- `scheduled`
- `published_noindex`
- `published_indexable`
- `archived`

Public availability, crawlability, indexability, sitemap eligibility and
internal-link eligibility are derived independently. A public page is not
automatically indexable.

The current launch has 63 indexable pages and 207 public noindex records. Seven
products from the existing `CURATED_FABRIC_SLUGS` edit are indexable; the other
192 approved product pages remain browseable as `published_noindex`. Qualified
collections, Best For pages and guides retain their content-depth gates.

## 3. Scheduling behavior

A scheduled record includes an ISO publish time and its post-publication target:
`published_noindex` or `published_indexable`.

Before the publish time it is unavailable, absent from sitemaps and ineligible
for internal links. The route proxy blocks configured drafts and pre-publication
scheduled paths before page rendering. An archived path returns 410 unless it
has a recorded replacement, in which case it redirects permanently to that
final URL.

This is a static frontend. Scheduled activation requires a rebuild/deploy after
the publish time; there is deliberately no backend job or scheduler.

## 4. Canonical strategy

- Lowercase, hyphenated paths
- One trailing-slash convention
- One registered canonical per page
- Direct permanent redirects for known legacy routes
- Direct lowercase normalization without a redirect chain
- Production HTTP or alternate-host requests redirect directly to the HTTPS
  canonical origin when `NEXT_PUBLIC_SITE_URL` is an HTTPS URL
- Search, sort, filter, page-size and pagination query states canonicalize to
  their clean parent and emit `noindex,follow`
- Taxonomy aliases redirect to their resolved canonical path
- Missing fabric routes return a real 404

The deployed canonical origin remains the frontend setting
`NEXT_PUBLIC_SITE_URL`.

## 5. Metadata strategy

`lib/storefront-metadata.ts` builds canonical, robots, Open Graph and Twitter/X
metadata. Registered routes cannot override a noindex publication decision back
to indexable.

Indexable titles and descriptions are unique. Current indexable titles are at
most 53 characters and descriptions at most 140 characters. Product,
collection and Best For pages use approved product imagery where a final local
asset exists; other pages use the shared truthful site image.

The registry also records the expected H1. Rendered audits require exactly one
H1 on every sitemap URL and representative noindex page.

## 6. Structured data

Implemented schema is page-specific:

- `Organization` from the root site layout
- `WebSite` and working `SearchAction` on the homepage
- `CollectionPage` and optional `ItemList` for marketplace, collection, Best
  For and guide-hub pages
- `Product` for approved fabric products
- `Article` for genuine editorial guides
- `FAQPage` only for visible authored question-and-answer records
- `BreadcrumbList` wherever visible breadcrumbs are rendered

Product schema does not invent offers, stock, ratings, reviews, SKUs or
identifiers. Article schema omits author and dates when the source has no real
values.

## 7. Internal-linking architecture

Links are derived from catalogue applications, collections, product
relationships, guide clusters and help categories. Reusable eligibility helpers
remove drafts, pre-publication scheduled pages and archived destinations before
rendering.

Products link to their collection, related products and qualified Best For
pages. Best For pages link to products, adjacent applications and relevant
guides. Guides link to real products, applications, material collections,
seasonal edits and populated topic hubs. Help articles cross-link within their
real category.

The static audit found no orphan candidates, weakly linked indexable candidates
or broken registry links.

## 8. Sitemap integration

`/sitemap.xml` is an XML sitemap index generated only from canonical,
`published_indexable` records. Child sitemaps are capped at 45,000 URLs, below
the protocol limit of 50,000. The current 63 URLs occupy one child sitemap.

Drafts, scheduled-unavailable pages, noindex pages, archived pages, search
states, filters, account routes and admin routes cannot enter the sitemap.
`/sitemap-index.xml` permanently redirects to the authoritative index.

## 9. Robots strategy

`robots.txt` advertises `/sitemap.xml`, allows public content and crawl-blocks
admin, account, auth, buyer, supplier, RFQ and comparison route families.

Public query states are not blocked in robots because crawlers must be able to
read their page-level noindex and canonical directives.

## 10. Faceted navigation, search and pagination

Marketplace facets, internal search, sort, page size and pagination remain
query parameters. They are useful discovery states, not SEO landing pages.
They emit `noindex,follow` and canonicalize to `/marketplace/`.

Collection pagination and Help search use the same policy. Only curated,
substantive records in the registry can become clean indexable landing pages.

## 11. Redirect and 404 strategy

The frontend issues direct 308 redirects for legacy product, application,
search, supplier, certification and other retired storefront families.
Uppercase paths normalize directly to the final lowercase destination.

Unknown products return 404. Archived overrides return 410 when no meaningful
replacement exists. Missing pages are never redirected indiscriminately to
Home.

## 12. Audit checks

`npm run seo` writes the private development inventory to
`artifacts/seo-audit.json`. It checks publication transitions, duplicate paths,
canonicals, titles and descriptions, quality gates, parent topics, expected
schema, internal-link eligibility, orphans, weak links, broken links, sitemap
eligibility and launch batches.

`npm run qa:seo-runtime` checks rendered sitemap URLs, status, canonical,
robots, title, description, H1, heading order, Open Graph, Twitter/X, image alt
attributes, internal-link status, redirects, 404 behavior, query controls,
private-route controls and representative schema coverage.

The browser performance audit covers the major page families at widths from 375
to 1600 pixels and checks overflow, H1 count, broken images, LCP, INP, CLS,
request count and transfer budget.

Final production-lab results covered 16 routes and 144 responsive route/width
combinations with no failures. Observed LCP was at most 508 ms, observed INP was
at most 48 ms where Event Timing produced a value, CLS was 0, and route request
count was at most 41. Build budgets also passed: largest JavaScript chunk
234,172 bytes, CSS 108,206 bytes, largest image 496,578 bytes and video
2,095,134 bytes.

## 13. Remaining SEO issues

- Production must set `NEXT_PUBLIC_SITE_URL` to the single HTTPS canonical
  origin.
- Scheduled static launches require a rebuild/deploy until the future backend
  publication phase exists.
- Search Console submission, URL inspection, rich-results validation and actual
  indexing are external deployment tasks. `published`, `crawlable`,
  `indexable` and `actually indexed` remain distinct states.
- Field Core Web Vitals require real-user production data; local lab checks are
  not field evidence.
- Terms and Privacy remain noindex while legal entity, effective-date and other
  approval placeholders remain unresolved.
