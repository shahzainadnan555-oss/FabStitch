# FabStitch robots.txt policy

## Root cause (GSC: Crawl allowed NO / Blocked by robots.txt)

`app/robots.ts` previously called the backend SEO `route-classes` API and
merged `Disallow` prefixes at request time (`force-dynamic`).

That design could emit a sitewide or section crawl block for Googlebot when
the API returned a root/private classification — Search Console then reports:

> Crawl allowed: NO  
> Blocked by robots.txt

The backend still mis-labels `/marketplace` as `filter` / `allow_index: false`.
Robots.txt must not trust that feed for crawl policy.

## Current behavior

- **Static** frontend robots.txt (no backend dependency)
- Explicit `Allow` for public SEO trees including `/discover/`
- Explicit groups for `*`, `Googlebot`, `Googlebot-Image`, `Google-InspectionTool`, etc.
- `Disallow` only for private/auth/transactional prefixes
- **Never** `Disallow: /`
- Sitemap line: `https://fabstitch.net/sitemap.xml`
- Filter/query deindexation stays on meta robots + `X-Robots-Tag`, not robots.txt

## Validate

```bash
npm run seo:robots
```
