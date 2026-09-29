# Seed-keyword 1,000-page expansion

Frontend-only discover corpus built from 100 seed keywords.

- Registry: `domain/seo/seed-expansion/`
- CSV: `docs/seo/SEED-KEYWORD-1000-REGISTRY.csv`
- Routes: `/discover/hub-*/` via existing `discover/[slug]`
- Wired in `domain/seo/semantic/build.ts` after the library slot
- Sitemap: existing storefront registry + discover shards

Existing canonicals for the same seed intent are not duplicated. Each seed gets supporting pages with a different intent (brief, meaning, application, spec, sourcing, comparison, question).

Run `npm run seo:seed-expansion` to confirm **1,000** indexable hub URLs.
