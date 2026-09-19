# SEO master audit

Registry audit of the frontend. Not a live HTTP crawl and not a Core Web Vitals measurement. Production responses were not fetched in this pass. Do not read this as a Google indexing report.

| Check                                                          |              Result |
| -------------------------------------------------------------- | ------------------: |
| Total public pages                                             |                2471 |
| Indexable                                                      |                2266 |
| Noindex                                                        |                 205 |
| Sitemap-eligible indexable                                     |                2266 |
| Self-canonical indexable                                       |                2266 |
| Duplicate stored titles                                        |                   0 |
| Duplicate stored descriptions                                  |                   0 |
| Missing titles / descriptions / canonicals                     |                   0 |
| Duplicate H1 strings                                           |                   0 |
| Class A / B / C / D                                            | 89 / 751 / 1424 / 2 |
| Exact primary-topic collisions, excluding directory pagination |                   6 |
| Unreachable indexable URLs                                     |                   0 |
| Deep pages                                                     |                   0 |
| Broken internal links in the technical audit                   |                   0 |
| Redirect chains / loops                                        |                   0 |
| Image alt / title missing on meaningful images                 |                   0 |
| Structured data errors in the technical audit                  |                   0 |
| Meta keywords                                                  |                   0 |

## Noindex, intentional

- support: 1
- fabric: 187
- guide: 9
- private: 8

187 fabric pages stay noindex under the catalog holdback. Private, support, and held-back guides stay noindex. Filtered marketplace query states stay noindex and canonical to `/marketplace/`.

## Near duplicates

Class C pages (1424) are combination topics. They no longer paste both full parent essays, but a sibling can still share one rotated ontology paragraph. Treat them as improve/reposition, not as pages to delete. Class D is only:

- `/discover/denim-versus-twill/` — redirect review to `/discover/denim-vs-twill/`
- `/discover/lightweight-denim-fabric/` — redirect review to `/fabrics/lightweight-denim/`

`/discover/fabric-for-dresses/` shares a keyword with `/fabrics/dress-fabric/`. Consolidate later. Do not apply that redirect in this pass.

## Keyword collisions worth a human review

- "fabric materials": /fabrics/, /guides/fabric-questions/materials/
- "fabric for dresses": /fabrics/dress-fabric/, /discover/fabric-for-dresses/
- "lightweight denim fabric": /fabrics/lightweight-denim/, /discover/lightweight-denim-fabric/
- "knit fabric": /discover/knit-fabric/, /discover/how-knit-fabric-is-built/
- "denim vs twill": /discover/denim-vs-twill/, /discover/denim-versus-twill/
- "fabric quality": /discover/how-to-evaluate-fabric-quality/, /guides/fabric-questions/quality/

Directory pagination shares a label with page 1. That is a list, not a second article. Keep it indexable.

## Not measured here

- Live 4xx/5xx on https://fabstitch.net
- Core Web Vitals
- Keyword volume, difficulty, CPC, or rank
- A rendered-browser Screaming Frog crawl

The in-repo technical, metadata, image, and full SEO audits check the registry and the generated HTML metadata. Run those commands after content changes. A production Screaming Frog crawl is still a separate step.
