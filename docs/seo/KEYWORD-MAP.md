# Keyword map

Search volume, difficulty, CPC, and current rank are **UNKNOWN**.

The project file `docs/seo/fabstitch-keyword-map.csv` already maps researched phrases to target URLs with those metrics marked TBD. Do not fill them without a Search Console, Keyword Planner, or SEMrush export.

This map is the live registry, not a second keyword list.

| Rule                                | Application                                                              |
| ----------------------------------- | ------------------------------------------------------------------------ |
| One primary topic per indexable URL | Stored as `primaryTopic`                                                 |
| Secondary terms                     | Stored as `secondaryTopics`. Not stuffed into titles.                    |
| Demand                              | UNKNOWN until an export is imported                                      |
| Cannibalisation                     | Same primary topic on two indexable URLs, excluding directory pagination |

## Pages that share a primary topic

- **fabric materials** — `/fabrics/`, `/guides/fabric-questions/materials/`
- **fabric for dresses** — `/fabrics/dress-fabric/`, `/discover/fabric-for-dresses/`
- **lightweight denim fabric** — `/fabrics/lightweight-denim/`, `/discover/lightweight-denim-fabric/`
- **knit fabric** — `/discover/knit-fabric/`, `/discover/how-knit-fabric-is-built/`
- **denim vs twill** — `/discover/denim-vs-twill/`, `/discover/denim-versus-twill/`
- **fabric quality** — `/discover/how-to-evaluate-fabric-quality/`, `/guides/fabric-questions/quality/`

## How to read the master inventory

`docs/seo/MASTER-PAGE-INVENTORY.csv` has one row per indexable URL: primary topic, intent, cluster, H1, title, description, canonical, and whether the keyword is owned by one URL.

Class C means the page is a supporting combination. It should not be the ranking URL for the parent fibre, garment, or attribute. The parent hub in the topical map should be.
