# Semantic SEO corpus audit

Generated from `scripts/seo/semantic-audit.mts`.

## Summary

| Metric                                            |                                                           Count |
| ------------------------------------------------- | --------------------------------------------------------------: |
| Candidates                                        |                                                            1189 |
| Accepted (quality gate)                           |                                                           ~1097 |
| Rejected                                          |                                                             ~92 |
| Indexable semantic pages                          |                                                           ~1097 |
| Existing storefront pages reused (not duplicated) | collections, Best For, guides, commercial hubs, intent landings |

## Cluster mix (indexable)

- material
- use_case
- attribute
- material_use
- material_attribute
- use_attribute
- education
- comparison
- commercial
- construction

## Architecture

- Ontology: `domain/seo/semantic/ontology.ts`
- Candidates + reserved/doorway filters: `candidates.ts`, `reserved.ts`
- Content composer: `compose.ts`
- Build + uniqueness demotion: `build.ts`
- Routes: `/discover/` hub + `/discover/[slug]/`
- Registry: `semantic_landing` in `domain/seo/storefront-registry.ts`
- Sitemap: eligible via `SITEMAP_ELIGIBLE_SEO_PAGES`

## Quality rules

- No reserved canonical hubs (cotton/linen/silk/denim collections, sourcing, wholesale, existing landings)
- No doorway patterns (near me, geo spam, jobs)
- Unique title / H1 / meta description within the corpus
- Minimum useful section depth and word count
- Real catalog links via collections + Best For where mapped

## Validation command

```bash
node --import=./scripts/register-loader.mjs scripts/seo/semantic-audit.mts
```
