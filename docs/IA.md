# FabStitch — frontend information architecture

The system, before the screens. This document is the contract every template,
URL and taxonomy entry answers to. It supersedes nothing in
`docs/DECISIONS.md`; where the two disagree, a recorded decision wins and this
document is wrong and must be updated.

## How to read this

Every item carries a status, because a large part of this architecture already
exists and pretending otherwise would produce a second, parallel system.

| Mark        | Meaning                                            |
| ----------- | -------------------------------------------------- |
| **BUILT**   | Exists and is verified working today               |
| **EXTEND**  | Exists; this brief widens it                       |
| **NEW**     | Does not exist                                     |
| **BLOCKED** | Cannot be built honestly yet; the blocker is named |

Current runtime note: FabStitch is frontend-only. The approved local catalogue
is the sole current product source; no supplier, listing, order or backend
record is implied. Sections that describe database-backed scale are future
information architecture and are superseded for current implementation by
R38 in `docs/DECISIONS.md`.

---

## 1. Core page types

Thirty-four templates. Each row is one component tree; the "generates" column is
what it produces as data grows.

### Discovery and entry

| #   | Template           | Route                                                                                       | Generates                       | Status |
| --- | ------------------ | ------------------------------------------------------------------------------------------- | ------------------------------- | ------ |
| 1   | Homepage           | `/`                                                                                         | 1                               | BUILT  |
| 2   | Guided sourcing    | `/start/`                                                                                   | 1 (multi-step)                  | NEW    |
| 3   | Search results     | `/search/`                                                                                  | 1 (query states, never indexed) | BUILT  |
| 4   | Fabric index (A–Z) | `/fabrics/index/`                                                                           | 1                               | BUILT  |
| 5   | Directory hub      | `/fabrics/`, `/applications/`, `/buyers/`, `/countries/`, `/suppliers/`, `/certifications/` | 6                               | BUILT  |

### Taxonomy templates — the volume

| #   | Template             | Route                     | Generates       | Status |
| --- | -------------------- | ------------------------- | --------------- | ------ |
| 6   | Fabric family hub    | `/fabrics/{family}/`      | 7               | BUILT  |
| 7   | Fabric property hub  | `/fabrics/{property}/`    | 4 → ~10         | EXTEND |
| 8   | Fabric category      | `/fabrics/{…ancestry}/`   | 52 → 300+       | BUILT  |
| 9   | Fabric specification | `/fabrics/{…}/{n}-gsm/`   | 206 → thousands | BUILT  |
| 10  | Application group    | `/applications/{group}/`  | 10              | BUILT  |
| 11  | Application          | `/applications/{slug}/`   | 49 → 120+       | BUILT  |
| 12  | Buyer category       | `/for/{category}/`        | 12 → 20         | EXTEND |
| 13  | Buyer subcategory    | `/for/{subcategory}/`     | 32 → 60+        | EXTEND |
| 14  | Country              | `/countries/{country}/`   | 12 → 30         | EXTEND |
| 15  | Certification        | `/certifications/{slug}/` | 7               | BUILT  |

### Composite templates — qualified combinations only

| #   | Template                         | Route                             | Generates      | Status |
| --- | -------------------------------- | --------------------------------- | -------------- | ------ |
| 16  | Fabric × country                 | `/fabrics/{…}/{country}/`         | 35 qualified   | BUILT  |
| 17  | Fabric × certification           | `/fabrics/{…}/{cert}/`            | 27 qualified   | BUILT  |
| 18  | Fabric × specification × country | `/fabrics/{…}/{n}-gsm/{country}/` | qualified only | BUILT  |
| 19  | Buyer × fabric                   | `/for/{buyer}/{fabric}/`          | 86 qualified   | BUILT  |
| 20  | Country × fabric (supplier view) | `/countries/{country}/{fabric}/`  | 35 qualified   | BUILT  |
| 21  | Application × fabric             | `/applications/{app}/{fabric}/`   | qualified only | NEW    |
| 22  | Supplier × fabric                | `/suppliers/{supplier}/{fabric}/` | qualified only | NEW    |

### Records

| #   | Template         | Route                | Generates                   | Status |
| --- | ---------------- | -------------------- | --------------------------- | ------ |
| 23  | Listing detail   | `/listings/{slug}/`  | 1 per listing               | BUILT  |
| 24  | Supplier profile | `/suppliers/{slug}/` | 1 per supplier              | BUILT  |
| 25  | Comparison       | `/compare/fabrics/`  | query states, never indexed | BUILT  |

### Transaction

| #   | Template             | Route                  | Generates      | Status |
| --- | -------------------- | ---------------------- | -------------- | ------ |
| 26  | RFQ / quote builder  | `/rfq/`                | 1 (multi-step) | BUILT  |
| 27  | Inquiry from listing | `/rfq/?listing={slug}` | seeded state   | BUILT  |

### Content

| #   | Template          | Route                           | Generates     | Status |
| --- | ----------------- | ------------------------------- | ------------- | ------ |
| 28  | Resource hub      | `/resources/`                   | 1             | EXTEND |
| 29  | Resource category | `/resources/{category}/`        | 7             | NEW    |
| 30  | Article           | `/resources/{category}/{slug}/` | 1 per article | NEW    |
| 31  | Glossary term     | `/resources/glossary/{term}/`   | 1 per term    | NEW    |

### Account and system

| #   | Template                                   | Route                                                         | Generates             | Status |
| --- | ------------------------------------------ | ------------------------------------------------------------- | --------------------- | ------ |
| 32  | Workspace shell (buyer / supplier / admin) | `/buyer/*`, `/supplier/*`, `/admin/*`                         | 3 shells × N sections | BUILT  |
| 33  | Auth                                       | modal + `/login/`, `/signup/`, `/verify/`, `/reset-password/` | 5                     | BUILT  |
| 34  | Legal / static                             | `/legal/{document}/`, `/about/`, `/help/`, `/verification/`   | ~8                    | BUILT  |

**34 templates. 3 of them (8, 9, 19) account for the large majority of page
volume.** That ratio is the architecture working.

---

## 2. URL structure

Rules that hold everywhere:

- Trailing slash on every path (`docs/DECISIONS.md` R4).
- A fabric's URL is its **ancestry**, never its family classification.
  `jersey` has `family: knits` and lives at `/fabrics/cotton/jersey/`. This has
  caused three separate defects; it is the single most error-prone rule here.
- Query strings are **filter states** and are never indexable, never canonical,
  never linked contextually.
- Any URL whose resolved canonical is not itself is an **alias**: it renders,
  it is crawlable, and it declares `noindex, follow`.

```
/                                            homepage
/start/                                      guided sourcing            NEW
/search/?…                                   search (noindex)

/fabrics/                                    directory
/fabrics/index/                              A–Z
/fabrics/{family}/                           family hub
/fabrics/{property}/                         property hub  (knitted, stretch,
                                             performance, sustainable, printed,
                                             embroidered, dyed, blended)
/fabrics/{…ancestry}/                        fabric category
/fabrics/{…}/{n}-gsm/                        specification
/fabrics/{…}/{cert}/                         fabric × certification
/fabrics/{…}/{country}/                      fabric × country
/fabrics/{…}/{n}-gsm/{country}/              spec × country

/applications/                               directory
/applications/{group}/                       application group
/applications/{slug}/                        application
/applications/{slug}/{fabric}/               application × fabric        NEW

/for/{buyer}/                                buyer landing               CHANGED
/for/{buyer}/{fabric}/                       buyer × fabric              CHANGED

/countries/{country}/                        country                     CHANGED
/countries/{country}/{fabric}/               country × fabric            CHANGED

/suppliers/                                  supplier directory
/suppliers/{supplier}/                       supplier profile
/suppliers/{supplier}/{fabric}/              supplier × fabric           NEW
/suppliers/join/                             supplier acquisition

/certifications/                             directory
/certifications/{slug}/                      certification

/listings/{slug}/                            listing detail
/compare/fabrics/?f=…                        comparison (noindex)
/rfq/                                        quote builder

/resources/                                  resource hub
/resources/{category}/                       resource category           NEW
/resources/{category}/{slug}/                article                     NEW
/resources/glossary/{term}/                  glossary term               NEW

/buyer/*  /supplier/*  /admin/*              workspaces (noindex)
```

### The three URL changes — **DONE** for the two adopted

| Today                   | Brief                   | Recommendation                                                                                                                                                                                                                                                                   |
| ----------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/buyers/{slug}/`       | `/for/{slug}/`          | **Adopt.** `/for/hotels/` states the buyer's own framing; `/buyers/` reads as "browse buyers", which is what a _supplier_ wants. R5 already removed Buyers from the top bar for this exact reason.                                                                               |
| `/suppliers/{country}/` | `/countries/{country}/` | **Adopt.** The current path conflates a supplier directory with a country page and blocks the natural `/suppliers/{supplier}/` namespace — `/suppliers/pakistan/` and `/suppliers/indus-knit-works-fs1042/` currently live in one segment and are disambiguated by lookup order. |
| `/buyer/saved/`         | `/saved/fabrics/`       | **Keep `/buyer/saved/`.** Saved items are per-account and belong inside the authenticated workspace. A top-level `/saved/` implies a public surface it can never be.                                                                                                             |

Both adopted changes shipped. `/buyers/*` → `/for/*` and
`/suppliers/{country}/*` → `/countries/{country}/*` now answer **308** from
`proxy.ts`, which reads `COUNTRY_SLUGS` from the taxonomy rather than a
hard-coded list — a static pattern could not tell `/suppliers/pakistan/` from
`/suppliers/indus-knit-works-fs1042/`. Verified: 901 pages crawled, 0 broken
links, no internal link left pointing at an old path.

---

## 3. Navigation hierarchy

Five sections in the mega menu. **BUILT**, extended with Countries.

```
Fabrics ▾        Applications ▾    Buyers ▾          Suppliers ▾       Resources ▾
  By fibre         By product        By what you        By country       Fabric guides
   7 families       10 groups         make               12 countries     Buying guides
  By property      Popular            12 categories     By capability     Sourcing guides
   8 hubs           products          32 subcategories   5 capabilities   Terminology
  By certification Guided start      By constraint      Verified only     Industry
   7 standards      /start/           MOQ · stock ·     Join as supplier  Supplier guides
  A–Z index                           sample · certs                      Glossary
```

Right cluster: **Search · Saved · Account** (`Sign in` / `Join` when signed
out). Post an RFQ is a persistent primary action, never a nav tab (R1, R5).

Mobile: sections become an accordion sheet; search is a persistent field, not
an icon that opens one.

---

## 4. Buyer taxonomy — **EXTEND**

Today: 12 categories, 32 subcategories. All of them are **trade** buyers —
manufacturers, converters, wholesalers, buying houses.

The brief names a second tier the taxonomy does not have: **end-user
businesses** that buy fabric for their own operation rather than to manufacture
for others.

```
TIER 1 — Trade buyers                      BUILT (12 categories, 32 subcategories)
  Clothing & fashion brands · Garment manufacturers · Fashion designers ·
  Private-label brands · Sportswear & activewear · Uniform & workwear ·
  Home textile manufacturers · Furniture & upholstery · Bags & accessories ·
  Textile wholesalers · Buying houses · Industrial & technical textiles

TIER 2 — End-user businesses               NEW
  Hospitality       Hotels · Restaurants · Cafés · Spas & wellness
  Retail & studio   Boutiques · Retail fabric stores · Tailors ·
                    Independent designers · Small businesses
  Property & space  Interior designers · Architects & fit-out ·
                    Event & production businesses
  Institutional     Schools · Healthcare facilities · Corporate uniform buyers
```

Why the tier matters architecturally: a Tier 2 buyer arrives with a _problem_
("our hotel needs new curtains") and no textile vocabulary at all. Tier 1
arrives with a specification. The same template serves both, but the Tier 2
page leads with applications and the Tier 1 page leads with fabrics — a
`buyerTier` field on the taxonomy, not two templates.

Also **missing from Tier 1 and worth adding**: Textile factories (as a buyer of
greige and yarn), Garment factories as distinct from garment manufacturers.

---

## 5. Fabric taxonomy — **EXTEND**

Today: 7 families, 52 nodes, 4 property hubs.

The brief's fabric list mixes **three different axes**. Filing them all as
fabric nodes would be the single fastest way to destroy this taxonomy, because
"printed cotton" is not a sibling of "cotton" — it is cotton with a treatment.

```
AXIS 1 — Fibre and construction (nodes; define the URL)          BUILT
  7 families → 52 nodes → children
  Cotton · Knits · Wovens · Fine & drapey · Bast/wool/protein ·
  Synthetics · Non-wovens
  MISSING: Lace                                                  NEW

AXIS 2 — Cross-cutting properties (hubs; tag membership)         EXTEND
  BUILT:   knitted · stretch · performance · sustainable
  NEW:     blended (composition class) · technical ·
           printed · embroidered · dyed        ← treatments
  These are `tags` on a node or a facet on a listing, never a node.

AXIS 3 — Listing attributes (facets only; never a page)          BUILT
  colour · pattern · finish · dye method · yarn count · width type
```

`organic` is not a new hub: it is the `sustainable` hub plus the GOTS
certification, and inventing a parallel term would split one intent across two
pages.

---

## 6. Application taxonomy — **BUILT**, extended

10 groups, 49 applications. Independently searchable and filterable, and
already the primary entry route (R5: Applications is a top-bar door, Buyers is
not).

```
Tops & casualwear · Bottoms & outerwear · Dresses & occasion ·
Performance apparel · Intimates & sleep · Uniform & workwear ·
Home textiles · Furniture & interiors · Bags, footwear & accessories ·
Technical & industrial
```

**Missing, from the brief:** Suits · Children's clothing · Cushion covers ·
Kitchen textiles · Restaurant textiles · Packaging & FIBC.

The brief's "Hospitality" grouping (hotel bedding, hotel curtains, hotel
upholstery, hotel uniforms) is **not a new application group** — those are
existing applications (bedding, curtains, upholstery, uniforms) seen through a
Tier 2 buyer. They are served by `/for/hotels/` and by buyer × application
composites, not by duplicating the application taxonomy per venue type. This is
the difference between a marketplace and a page farm.

---

## 7. Supplier architecture — **BUILT**

```
Supplier
  identity      company name · slug · country · city · verification state
  capability    knitting · weaving · dyeing · finishing · printing ·
                coating & lamination
  commercial    MOQ range · lead times · export markets · sample policy
  compliance    certifications (number, scope, validity — verified before shown)
  catalogue     listings → fabrics → applications
  Reviews       BLOCKED — no review data exists. The template reserves the
                slot and renders nothing. Never a placeholder rating.
```

Verification is a claim about a real company. A badge appears only after
certificate number, scope and validity are checked (R7).

---

## 8. Listing architecture — **BUILT**

The atomic unit. The only record a buyer can transact on.

```
identity      id · slug · name (written as a buyer would search it)
origin        supplier · country of origin
material      material · composition · fabric type · construction
spec          GSM (+ tolerance) · width (+ unit, type) · yarn count ·
              finish[] · stretch (direction, %)
commercial    MOQ (value, unit, per-colour) · price band · lead-time band ·
              stock status · sample policy
compliance    certifications[]
relations     applications[] · related fabrics · similar listings
media         images[] · swatch colour (fallback render)
provenance    updatedAt · isSpecimen
```

`isSpecimen` marks illustrative records; they render an **ILLUSTRATIVE** badge
and never claim to be live inventory. Absent stays absent — a missing GSM is
`undefined`, never `0`, because the gate measures completeness and a defaulted
field would publish a thin page on invented data.

---

## 9. Search architecture — **BUILT**

One field. It accepts every vocabulary a buyer arrives with (R8):

| Query                   | Resolves to                |
| ----------------------- | -------------------------- |
| `cotton fabric`         | fabric node                |
| `black cotton fabric`   | fabric + colour facet      |
| `fabric for shirts`     | application                |
| `hotel curtain fabric`  | Tier 2 buyer + application |
| `denim supplier`        | fabric + sourcing intent   |
| `300 GSM cotton`        | fabric + specification     |
| `linen fabric Pakistan` | fabric + origin            |

Deterministic parsing, no model. Structured criteria surface as the top
suggestion in plain language ("Cotton jersey · 180 ±5% · Pakistan"), never as a
panel of chips the buyer must interpret.

**Zero results** classify the query rather than acting on it: existing-page
improvement · new page · new taxonomy · supplier · listing · RFQ · irrelevant.
A query resolving to nothing returns low confidence, because an unmodelled
fabric name and a genuinely irrelevant search look identical to a taxonomy
containing neither.

---

## 10. Filter architecture — **BUILT**

Progressive, not exhaustive. A facet appears when the current result set
contains more than one value for it.

```
Always        fabric · application · GSM range · MOQ ceiling · country
On demand     construction · composition · width · certification · stock ·
              sample availability · verified supplier · colour · pattern ·
              finish · stretch · lead time · price band
Never a page  every one of these. Filters are query parameters.
```

Desktop: sticky left rail. Mobile: bottom sheet, with applied filters as
removable chips above the results.

---

## 11. Homepage structure — **BUILT**, extended

Five doors, one field. The ordering is fixed by what a buyer needs first.

```
1  Hero + single sourcing field                        BUILT
2  "What are you sourcing for?" — application entry    BUILT
3  Browse fabric categories                            BUILT
4  Browse by what you make (application groups)        BUILT
5  I represent a business — buyer types                EXTEND (Tier 2)
6  Guided discovery entry → /start/                    NEW
7  Featured listings                                   BUILT
8  Suppliers by country                                EXTEND
9  Certifications                                      BUILT
10 How FabStitch works                                 BUILT
11 Resources                                           EXTEND
12 Final CTA + footer                                  BUILT
```

**Deliberately absent:** marketplace statistics, trending searches, popular
searches. All three require data that does not exist. An unimpressive honest
number beats a rounded claim; a fabricated one is worse than both.

---

## 12. Account structure — **BUILT**

```
Buyer                          Supplier                    Admin
  Dashboard                      Dashboard                   Overview
  Saved fabrics                  Company profile             Verifications
  Saved suppliers                Listings (+ new / edit)     Listings
  Saved searches      NEW        RFQs received               Taxonomy
  Recently viewed     NEW        Quotes sent                 Marketplace health
  RFQs                           Samples                     Page opportunities
  Quotes                         Orders
  Samples                        Messages
  Orders / shipments             Team
  Messages                       Verification
  Company / team                 Settings
  Settings
```

Simple by rule. The buyer dashboard's job is _find fabric_, not analytics.

---

## 13. Inquiry / quote flow — **FRONTEND PREVIEW**

Four steps, only the first mandatory to advance.

```
Listing or fabric page
  → Request quote            (seeds the builder with the listing)
  → 1 Requirement            what are you making · quantity        REQUIRED
  → 2 Specification          fabric · composition · GSM · width · colour
  → 3 Commercial             destination · required by · target price · certs
  → 4 Review                 exactly what the preview contains
  → Validate                 local fields only; nothing is submitted
  → Buyer and supplier workspaces remain empty previews
```

The preview keeps all four steps on screen and states that no RFQ, quote,
conversation or order was created.

**BLOCKED downstream:** quote receipt, order creation and messaging have no
backend contract yet. Those workspace sections render structure and state that
plainly rather than simulating a conversation.

---

## 14. Resource architecture — **NEW**

```
/resources/
  fabric-guides/        What is GSM? · Woven vs knitted · Composition
  buying-guides/        Choosing fabric for shirts · for hotel curtains
  sourcing-guides/      How to source wholesale · Reading a spec sheet
  terminology/          → glossary
  industry-guides/      Country sourcing profiles · Certification explained
  supplier-guides/      Listing well · Responding to RFQs
  glossary/{term}/      one page per term, linked from every spec table
```

The glossary is the highest-leverage piece: every specification table on every
listing links its field labels into it, which serves a real buyer question and
builds internal linking density as a side effect rather than as the goal.

---

## 15. SEO page architecture — **BUILT**

Indexability is **computed, never hand-set**. A page is submitted only when it
passes all seven conditions:

1. Relevant search intent exists
2. Real listings exist — ≥3 (fabric/application/buyer/country/certification),
   ≥5 (specification, buyer × fabric, country × fabric, fabric × certification)
3. ≥150 words of page-specific, non-templated content
4. Uniqueness ≥0.7 against parent and siblings (Jaccard over the fact set)
5. Not a duplicate variant — no sibling shares its primary keyword
6. ≥2 distinct suppliers (≥3 for country pages); listing completeness ≥70%
7. The combination is on the allow-list

**Failing is not deletion.** A failing page renders, stays crawlable via
`noindex, follow`, keeps passing link equity, and flips itself to indexable the
moment supply crosses the threshold. Nothing is hidden and nothing is removed.

Build order follows keyword tier, not volume: **T3 → T5 → T4 → T6 → T7 → T8 →
T2 → T1**. Specificity converts; head terms take years.

---

## 16. Internal linking architecture — **BUILT**

Every edge is derived from the taxonomy, so adding an application improves
dozens of pages with no template edit. Current graph: **145 nodes, 1,068
contextual edges, 6 orphans** (exactly the 6 countries with no supply).

```
Fabric      → applications · siblings · buyers · certifications · origins ·
              comparison targets · specifications · guides
Application → recommended fabrics · buyers · listings · related applications ·
              buying guide
Buyer       → applications made · fabrics sourced · related buyer types ·
              buyer × fabric composites
Country     → fabrics listed from here · suppliers · country × fabric ·
              related origins
Supplier    → catalogue · country · capabilities · applications served ·
              related suppliers
Listing     → fabric · supplier · country · applications · similar listings ·
              glossary terms
```

Rules: never link to a query-string filter state; never link to an alias;
orphans and weakly-linked pages are reported in `/admin/health/` with the
specific pages that _should_ link to them.

---

## 17. Reusable component architecture — mostly **BUILT**

```
Layout        AppShell · SiteHeader · MegaNav · SiteFooter · WorkspaceShell
Navigation    Breadcrumbs · StepRail · Pagination · Tabs
Entry         SearchField · SuggestPanel · GuidedStart              NEW
Cards         FabricCard · ListingCard · SupplierCard · BuyerCard ·
              ApplicationCard · CountryCard NEW · CategoryCard · ResourceCard NEW
Page parts    PageHeader (hero + crumbs + meta + action) · SectionHeading ·
              RelatedPanel · FaqBlock NEW · SeoContentBlock NEW · CtaBand
Data display  SpecGrid · ListingTable · CompareTable · FacetPanel ·
              ActiveFilters · ResultsToolbar · Swatch · WeaveMark ·
              FabricMedia · Badge
Interaction   Dialog · FilterSheet NEW · GatedAction · CompareToggle ·
              SaveToggle NEW · AuthModal · RfqBuilder
State         EmptyState · NoResults · Alert · Skeleton · ErrorBoundary ·
              FixtureNotice
```

One rule: components are **data-driven**. There is never a `CottonCategoryPage`
— there is a category template and a taxonomy row.

---

## 18. Static pages

Prerendered, no per-request data: `/`, `/about/`, `/help/`, `/verification/`,
`/suppliers/join/`, `/legal/*`, `/fabrics/`, `/fabrics/index/`,
`/applications/`, `/buyers/`→`/for/`, `/certifications/`, `/resources/*`,
all workspace shells, all auth routes.

## 19. Dynamically generated pages

`generateStaticParams` at build for bounded taxonomies (families, hubs,
applications, buyer types, countries, certifications, supplier profiles).
On-demand render for anything whose count grows with supply: fabric categories,
specifications, every composite, listing details, search, comparison.

## 20. Combinations allowed to generate pages

`fabric_category` · `fabric_specification` · `application` · `buyer_category` ·
`buyer_fabric` · `country_fabric` · `supplier_country` · `certification` ·
`fabric_certification` · `application_fabric` NEW · `supplier_fabric` NEW

Each still faces all seven conditions. Being on the allow-list earns a
candidate, not a page.

## 21. Combinations that must NOT generate pages

- **fabric × colour** — colour is a listing attribute; this alone would mint
  tens of thousands of near-identical pages
- **fabric × city** — supply is organised by country; cities have no data
- **spec × spec × spec** — 180 GSM × 150 cm × combed is a filter, not a page
- **any trivial specification increment** — 180 and 185 GSM are one page
- **buyer × application × fabric × country** — four-way combinations have no
  buyer who searches that way
- **anything reachable only by query string** — filter states, sort orders,
  pagination beyond page 1, comparison sets

## 22. Data required per page type

| Page type        | Minimum to render                 | Minimum to index                                                 |
| ---------------- | --------------------------------- | ---------------------------------------------------------------- |
| Fabric category  | taxonomy node                     | 3 listings · 2 suppliers · 150 words · uniq ≥0.7 · complete ≥70% |
| Specification    | node + GSM in commercial range    | 5 listings · 2 suppliers · + above                               |
| Application      | application row                   | 3 listings · 2 suppliers · + above                               |
| Buyer            | buyer row + applications          | 3 listings · 2 suppliers · + above                               |
| Country          | country row                       | 3 listings · **3** suppliers · + above                           |
| Certification    | certification row + `covers`      | 3 listings · 2 suppliers · + above                               |
| Fabric × cert    | both entities                     | 5 listings · 2 suppliers · + above                               |
| Buyer × fabric   | both + shared application         | 5 listings · 2 suppliers · + above                               |
| Country × fabric | both entities                     | 5 listings · **3** suppliers · + above                           |
| Listing          | supplier · material · MOQ · stock | never indexed while fixtures                                     |
| Supplier         | company · country                 | ≥1 live listing                                                  |
| Article          | title · body · author-reviewed    | 400+ words · unique topic                                        |

---

## Decisions required before implementation

1. **URL migration** — adopt `/for/{buyer}/` and `/countries/{country}/`?
   Recommended yes; breaking; cheap now, expensive later.
2. **Tier 2 buyers** — add the end-user business tier (hotels, boutiques,
   tailors, interior designers, event businesses, retail fabric stores)?
   The brief names them explicitly; recommended yes.
3. **"Popular" and "Trending" discovery pages** — §14 asks for them. There is
   no engagement data. Recommended: derive from **supply depth** and label them
   honestly ("Most listings", "Recently added"), never "Trending".

## Gaps this brief opens, in build order

1. URL migration + redirects
2. Tier 2 buyer taxonomy · 7 missing applications · Lace · 5 treatment hubs
3. Guided sourcing `/start/`
4. Country template moved and expanded (industry overview, export capability)
5. Application × fabric and supplier × fabric composites
6. Resource system + glossary
7. Saved searches · recently viewed
8. FaqBlock · SeoContentBlock · FilterSheet · CountryCard · SaveToggle
