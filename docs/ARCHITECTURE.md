# FabStitch — architecture summary

Distilled from `B2B_Wholesale_Fabric_Marketplace_Blueprint.pdf` (30 pp) and
`FabStitch-Buyer-Keyword-Category-Programmatic-SEO-Strategy (2).pdf` (59 pp).

Where the two documents disagree, this file records which one FabStitch follows and
why. Planning figures (page counts, keyword counts, GSM bands) are sizing targets for
architecture, **not** claims about live search volume, and not build orders.

## Current runtime boundary

The present repository is frontend-only. The approved local catalogue under
`catalog/` is the only current product source. Local demo profiles, onboarding,
preferences and legal-consent versions use browser storage. Purchase, RFQ,
buyer, supplier and admin interfaces are non-submitting previews.

There is no current API, database, production authentication, payment service,
supplier verification service or WebSocket. Database entities, joins, gates and
service behavior described later in this document are target product
architecture for a future backend, not claims about the current runtime.

---

## 1. The core chain

```
Buyer → Application → Fabric → Specification → Country → Supplier → Listing
```

Every page family is this chain entered at a different point:

| Page             | What it is                             |
| ---------------- | -------------------------------------- |
| Fabric page      | chain entered at _fabric_              |
| Buyer page       | chain entered at _buyer_               |
| Country × fabric | two points held fixed, the rest varies |
| Listing page     | one complete traversal                 |

This is why the page architecture is not designed page by page. It also means the
navigation, the URL scheme, the filter set and the database must all express the same
chain — that agreement is the single biggest predictor of whether the site stays
coherent at scale.

**Buyers never link directly to fabrics.** The join is the application. Without it,
connecting "hoodie manufacturers" to "320 GSM brushed French terry" requires
hand-maintained rules; with it, both sides grow independently.

---

## 2. Entities

### Taxonomy layer

| Entity                                                           | Shape                                                                                       | Scale                              |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------- |
| `buyer_categories`                                               | 12 categories, ~120–140 subcategories, `parent_id`, slug, tier                              | subcategory is the commercial unit |
| `applications`                                                   | ~90 end products in 10 groups                                                               | the bridge                         |
| `fabric_categories` / `fabrics`                                  | one canonical parent hierarchy (cotton → jersey → single jersey) **plus** many-to-many tags | ~40 families, ~350 nodes           |
| `constructions`, `specifications`, `certifications`, `countries` | controlled vocabularies                                                                     | fixed before first listing         |

**One fabric, many labels.** Model as _primary hierarchy + tags_, never a single tree.
A 95/5 organic cotton-elastane single jersey is simultaneously a natural-fibre blend,
a knit, a stretch performance fabric and a sustainable fabric. Tag hubs
(`/fabrics/knitted/`, `/fabrics/sustainable/`) canonicalise to themselves; the fabric
itself always lives at exactly one canonical URL.

**The 12 buyer categories:** clothing & fashion brands · garment manufacturers ·
fashion designers · private label brands · sportswear & activewear brands · uniform &
workwear manufacturers · home textile manufacturers · furniture & upholstery
manufacturers · bags & accessories manufacturers · textile wholesalers & distributors ·
buying houses & sourcing companies · industrial / technical textile companies.

**The 10 application groups:** tops & casualwear · bottoms & outerwear · dresses &
occasion · performance apparel · intimates & sleep · uniform & workwear · home
textiles · furniture & interiors · bags, footwear & accessories · technical & industrial.

**Fabric families:** cotton & cotton-based · knits · wovens & suiting · fine & drapey ·
bast, wool & protein · synthetics & regenerated. Cross-cut by fibre origin (natural /
regenerated / synthetic / blended) and by construction & purpose (knits / wovens /
non-wovens / performance / sustainable).

### Marketplace layer

`suppliers`, `supplier_locations`, `supplier_certifications`, `listings`, plus joins
`listing_application` and `listing_certification`.

The three joins that carry the domain expertise:

| Join                  | Key fields                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `buyer_application`   | `relevance` — hoodie makers map strongly to hoodies, weakly to sweatshirts                                          |
| `application_fabric`  | `suitability_score`, `recommended_gsm_min/max`, `notes` — **this is where FabStitch's expertise is stored as data** |
| `listing_application` | supplier-declared and system-inferred                                                                               |

### SEO layer — deliberately separate

`keywords` (50,000+ rows, mostly passive), `seo_pages` (one row per generated or
planned page, carrying its own indexation state), `url_history` (every retired slug
301s forever).

**Why the SEO layer must be its own table:** if indexation logic lives in template
code, changing it needs a release. In `seo_pages`, a nightly job recomputes
`listing_count`, `data_completeness` and `indexable` for every row, regenerates the
sitemap from `indexable = true`, and the site self-corrects as supply moves. This one
decision separates a programmatic SEO system that stays healthy at 40,000 pages from
one that quietly rots.

---

## 3. Specifications

Twenty-five filterable fields. The critical column is **SEO role** — only some fields
may ever generate a page.

**Page-generating:** composition · construction · GSM · stretch · moisture wicking ·
water resistance · UV resistance · certification · MOQ · country of origin.

**Facet only (never a page):** width · yarn count · stretch direction · dyeing ·
printing · pattern · breathability. Colour is display + variant.

**Trust signals:** shrinkage · pilling grade (ISO 12945) · colour fastness (ISO 105).

Filter presentation:

| Tier                | Fields                                                                      | Behaviour                                              |
| ------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------ |
| 1 — always open     | material, construction, GSM, MOQ, country, certification, price             | the seven a sourcing manager reaches for first         |
| 2 — collapsed       | width, yarn count, stretch, finish, dyeing, colour, pattern, printing       | narrows an already-relevant set                        |
| 3 — technical panel | shrinkage, pilling, colour fastness, breathability, MVTR, water column, UPF | decisive for technical buyers, noise for everyone else |

Three rules that keep specifications usable:

1. **Structured, never free text.** Free-text specs destroy filtering, comparison and
   page generation simultaneously.
2. **Units explicit and convertible.** Store canonical SI _plus_ the supplier's entered
   unit. Show GSM and oz/yd², inches and cm, price per kg and per metre.
3. **Only some fields generate pages.** `navy 180 GSM cotton jersey` is a variant, not
   a page.

---

## 4. Navigation

The two documents disagree. The Blueprint proposes eight sections (Shop Fabrics,
Industries, Applications, Suppliers, Services, Stock & Deals, Resources, RFQ). The
FabStitch-specific strategy proposes six.

**FabStitch follows the six-section model**, because each section maps to a real entity,
which keeps navigation, URLs and the database in agreement:

| Section        | Answers                      | Contains                                                                               |
| -------------- | ---------------------------- | -------------------------------------------------------------------------------------- |
| Fabrics        | "I know the material I need" | fibre families, construction classes, cross-cutting hubs, A–Z index                    |
| Applications   | "I know what I'm making"     | 10 groups × their 4–8 highest-demand applications                                      |
| Buyers         | "I am a…"                    | 12 categories → highest-value subcategories; doubles as onboarding self-identification |
| Suppliers      | "Who can make this?"         | by country, capability, certification, MOQ band, verification; plus join-as-supplier   |
| Certifications | "Can this pass compliance?"  | OEKO-TEX 100, GOTS, GRS, RCS, BCI, RWS, REACH, ISO 9001                                |
| Resources      | "Help me decide"             | GSM guides, comparisons, sourcing and MOQ guides, glossary, converters, incoterms      |

Blueprint concepts not lost: _Industries_ folds into **Buyers**; _Stock & Deals_ and
_Services_ become **filters and capability facets** (ready stock, low MOQ, deadstock;
custom dyeing/printing/finishing/lab dips) rather than permanent nav items; **RFQ** is
a persistent primary action, not a nav tab.

**Mega-menu rule:** every category expected to drive traffic or revenue must be a real
crawlable `<a href>` in the rendered menu — not injected on click. "View all" is for
the long tail, never for the head. Rank category links by `listing count × commercial
intent`, never alphabetically.

**Categories shown per page:** homepage 18–24 · main hub 25–30 · fabric category 10–20 ·
buyer category 10–15 (a buyer page linking to 40 fabrics has given no advice) ·
application 12–18 · supplier category 15–25 · listing 6–12.

---

## 5. URLs

Six top-level directories. Maximum four segments; anything deeper is a filter.

```
/fabrics/                                     hub
/fabrics/cotton/                              category
/fabrics/cotton/jersey/                       sub-type
/fabrics/cotton/jersey/single-jersey/         construction variant
/fabrics/cotton/jersey/180-gsm/               specification
/fabrics/cotton/jersey/180-gsm/pakistan/      specification × country
/applications/t-shirts/
/buyers/t-shirt-manufacturers/                subcategory sits flat — it owns the demand
/buyers/t-shirt-manufacturers/cotton-jersey/  buyer × fabric
/suppliers/pakistan/knitted-fabric/           country × capability
/suppliers/al-noor-textiles-fs1042/           slug + stable id
/listings/180-gsm-cotton-jersey-combed-fs-24817/
/certifications/oeko-tex-standard-100/
/resources/gsm-guide-for-t-shirts/
```

Rules: lowercase and hyphenated, no stop words · one trailing-slash convention
enforced at the edge with a 301 from the other · filter states are query parameters,
`noindex, follow`, canonical to the clean parent · pagination is `?page=2`,
`noindex, follow` and canonical to the clean parent in the current catalogue · one
canonical home per entity · never encode sort
order, currency, unit preference or session in a path · slug changes 301 via
`url_history`, never break.

GSM is a _directory_ (`/180-gsm/`) because it has real demand; `?gsm=180` signals a
filter state. Country appends **last** because it narrows an existing page rather than
reclassifying it.

---

## 6. Page families and the indexability gate

| Family                                       | Generated from                        | Ceiling | What makes each unique                                                 |
| -------------------------------------------- | ------------------------------------- | ------- | ---------------------------------------------------------------------- |
| Listings                                     | `listing`                             | ~15,000 | real transactable product: specs, MOQ, price, lead time, photography   |
| Fabric specification                         | fabric × gsm/composition/construction | ~5,000  | a technical variant with its own weight, hand-feel, yield, price       |
| Buyer × fabric                               | buyer × fabric                        | ~5,000  | the specific fit: recommended specs, common mistakes, matched listings |
| Country × fabric                             | country × fabric                      | ~3,000  | mills, MOQ norms, lead times, price bands, ports                       |
| Fabric                                       | fabric                                | ~2,000  | material, construction, properties, use cases, supplier set            |
| Application                                  | application                           | ~2,000  | fabric shortlist, GSM guidance, construction advice                    |
| Supplier                                     | supplier                              | ~2,000  | a real company: capability, capacity, certifications, catalogue        |
| Buyer                                        | buyer category/subcategory            | ~1,000  | volumes, MOQ tolerance, certifications, priorities                     |
| Guides, certifications, comparisons, indexes | editorial                             | ~5,000  | genuine reference value                                                |

**~40,000 is an architecture ceiling, not a build order.** A FabStitch with 800
listings should have ~1,500–2,500 indexable pages. Indexable count trails listing
count, always.

### The seven-condition gate (evaluated nightly, per `seo_pages` row)

1. **Search intent** — ≥1 mapped keyword at `commercial_intent ≥ medium`, or measured
   volume, or on-site search demand.
2. **Listings** — ≥3 live for fabric/application/buyer pages; ≥5 for specification,
   buyer×fabric, country×fabric.
3. **Useful information** — ≥150 words of specific, non-templated content plus a
   populated specification or guidance block.
4. **Unique value** — `uniqueness_score ≥ 0.7` against parent and nearest siblings.
   (Stops 180 GSM and 185 GSM existing as two near-identical pages.)
5. **Not a duplicate variant** — no sibling shares its primary keyword; colour, pattern
   and minor width variants excluded by rule.
6. **Marketplace depth** — ≥2 distinct suppliers (≥3 for country pages), average listing
   completeness ≥70%. One supplier behind a page makes it a supplier ad.
7. **Commercially meaningful combination** — on the whitelist below.

Any failure → `noindex`. **`noindex` is not deletion:** the page still renders, stays
reachable through filters and internal search, and remains `noindex, follow` so link
equity flows. In the current frontend-only phase, the local publication manifest and
repeatable audit apply this decision and a status change requires a rebuild/deploy.
Automatic reevaluation belongs to the future backend publication phase.

**Allowed-combination whitelist:** fabric · fabric×construction · fabric×GSM ·
fabric×composition · fabric×certification · fabric×country · application ·
application×fabric · buyer · buyer×fabric · supplier · supplier×capability · listing.
**Everything else is a filter.**

Thresholds live in **configuration, not code** — they get tuned repeatedly in year one
and tuning must not require a deployment.

### Six mechanical safeguards in the generator

Uniqueness scoring (>30% similarity to parent/siblings blocks publication) · data-driven
content blocks (GSM range present, price band, MOQ range, supplier count, countries,
certifications — differs automatically because the data differs) · hand-written intros
for the top ~200 pages, stricter listing thresholds for the tail · variant consolidation
rules (GSM within 10 merges to the nearest standard band; colour/pattern/print never
generate pages; width only when it gates a use case, e.g. 240 cm+ for bedding) ·
allowed-combination whitelist · weekly audit of indexable pages with zero clicks and
zero impressions over 90 days.

---

## 7. Keywords — a separate system from pages

Four distinct layers that are routinely confused:

| Layer            | Scale                 | What it is                                                                                        |
| ---------------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| Keyword database | 50,000+ rows          | internal planning table; invisible to users; most rows never get a page, they get _mapped_ to one |
| Website pages    | all rendered URLs     | including filter states, pagination, internal search, account pages                               |
| Indexable pages  | 30,000–40,000 ceiling | the subset passing the gate, in sitemaps, self-canonical                                          |
| Listings         | grows with supply     | the raw material for everything above                                                             |

Initial active targets: **5,000–15,000**, phased 300–600 (months 0–3) → 2,000–4,000
(3–9) → 5,000–15,000 (9–24).

**Priority score:** `(commercial_intent × 3) + (supply_match × 2) + volume_band −
(difficulty ÷ 20)`. Weighting commercial intent triple and supply match double encodes
the core insight: FabStitch wins where it has inventory _and_ the searcher has a
purchase order. A high-value keyword with no supply behind it is a **supplier-acquisition
target, not an SEO target**.

Value is close to inversely related to volume. `cotton fabric` = very high volume, low
value (hobbyists). `180 GSM cotton jersey supplier` = low volume, exceptional value (a
sourcing manager who has finalised the spec). Build priority runs tier 3 → 5 → 4 → 6 →
7 → 8 → 2 → 1.

Keep a **deliberate rejection list** (`fabric by the yard`, `quilting cotton`, `fabric
shop near me`, `cheap fabric online`, `how to sew a t-shirt`) marked `status = rejected`
with a reason — not deleted, or they get rediscovered and rebuilt by the next person.

On-page: exactly **1** primary keyword (title, H1, slug, meta, opening sentence, lead
image alt) · 3–8 secondaries in H2s and filter labels · 10–25 related professional terms
· semantic entities · and intent satisfied **by layout, not by words** — a buyer
searching a specification wants listings, MOQ and price immediately, not four
paragraphs of prose.

---

## 8. Key page templates

**Listing page** — the only page representing something transactable, and the largest
family. Structure it as a technical data sheet with a commercial CTA, not a product
description. Header (name as a buyer would search it, reference, supplier + verification
badge, country, price band and MOQ above the fold) · media (flat, draped, macro
weave/knit detail, colour swatch grid) · core specification in a **fixed field order so
listings compare side by side** · test & performance data with the standard named ·
commercial terms (price band, MOQ per colour and per order, capacity, lead time,
incoterms, payment terms, sample policy and cost) · supplier information · "commonly
used for" (applications) · "well suited to" (buyer types) · related fabrics (alternative
GSMs, constructions, compositions) · persistent actions · Product + Offer + Organization

- BreadcrumbList structured data.

Guardrail: a minimum completeness score before a listing is indexable (material,
construction, GSM, width, MOQ, country, ≥1 image). Below it, the listing stays live for
logged-in buyers with `noindex` and the supplier sees a completeness prompt. Sold-out
listings are kept, marked unavailable and linked to live alternatives — never deleted
into 404s.

**Fabric category page** — must serve two buyers at once. Compact filter bar and listing
grid **above** the long-form explanation, intro reduced to 2–3 sentences at the top and
expanded lower down. A buyer with commercial intent must not scroll past 800 words of
education to reach inventory. `CollectionPage` + `ItemList`; FAQs use `FAQPage`.

**Buyer category page** — answers "I make this: what fabric should I buy and who can
supply it?" Introduction for a production manager · common fabric requirements as a
scannable block · **recommended fabrics ranked, not listed**, with why and when to
choose each · recommended GSM with the trade-off explained · constructions ·
certifications · live pre-filtered listings · related fabrics/applications/adjacent
buyer types. **Uniqueness test:** put two buyer pages side by side; if the recommended
fabrics, GSM guidance, certifications and warnings are substantially the same, they are
one page with two entry keywords.

---

## 9. Homepage

One message: **"Find the right fabric for what you're making."** Immediately under it:
_and the verified suppliers who can produce it at your quantity._

Above the fold must answer four things at once: **What is this?** (stated plainly) ·
**Is it for me?** (wholesale quantities, MOQs open, buyer types named) · **Is there
anything here?** (live counts from the database) · **How do I start?** (the three-step
selector, working immediately).

Twelve blocks: hero + discovery selector · live marketplace proof · start with what you
make (10–14 application tiles) · browse by fabric (12–16 families with counts) · built
for buyers like you (6–8 types) · how sourcing works · why buyers trust FabStitch ·
certifications · sourcing by country · for suppliers (clearly separated band) ·
resources · footer category map.

The homepage's SEO job is **link distribution**, not ranking for fabric terms — trying
to rank it for `cotton fabric` would compete with the cotton hub, which can actually
satisfy the query.

Avoid: "wide range of quality fabrics at competitive prices", "one-stop textile
solution", hiding MOQ behind signup, a bare search box with no idea what to type,
lifestyle photography with no specifications visible.

---

## 10. Discovery

The three-step selector: **I make** → **I need** → **quantity/constraints**. The first
question is deliberately "what are you making?", not "what fabric do you want?" — that
single choice is the product thesis. A buyer who already knows they want 180 GSM combed
cotton jersey skips to step two; the selector must never force them through step one.

Every result card carries: material and construction · GSM with tolerance · width and
width type · composition · finish · MOQ with unit · price band per unit · lead time ·
certifications · country and supplier with verification state · sample availability ·
and two actions (request sample, add to inquiry). **Multi-select across results into a
single RFQ** is what turns discovery into a sourcing workflow rather than a search box.

Search intelligence that must exist for this to feel good:

- **Query parsing** — `180 gsm combed cotton jersey 72 inch` decomposes into GSM,
  quality tier, composition, construction and width, shown as **removable chips** so the
  buyer sees what was understood.
- **Alias handling** — lycra/spandex → elastane; loopback/loop knit/French terry → one
  construction. Aliases live in the taxonomy tables, not the search index.
- **Unit conversion** — GSM ↔ oz/yd², inches ↔ cm, kg ↔ linear metres derived from GSM
  and width.
- **Tolerance-aware matching** — a search for 180 GSM returns 175–185 clearly labelled,
  because mills work to tolerance and exact-match looks empty when it isn't.
- **Never dead-end** — zero results relaxes the least critical constraint and says so,
  and always offers to post the requirement to suppliers.

**The loop that matters:** every search on FabStitch is keyword research no competitor
has. Frequent filter combinations become page candidates (400 buyers filtering cotton
jersey + 180 GSM + Pakistan in a quarter is stronger evidence than any keyword tool).
Zero-result searches become the **supplier recruitment roadmap**. Unmatched terms reveal
taxonomy gaps. Inquiry-to-view ratio per page is the only signal that should drive
further page generation.

**Implementation warning:** faceted search and indexable pages stay structurally
separate. Filter interactions live in query parameters and out of the index; proven
combinations get promoted into clean canonical paths by the page-generation job.

---

## 11. What the current frontend provides

The approved local catalogue supports product discovery, aliases, collections,
Best For relationships, structured measurements, search, filtering, sorting,
pagination, details and comparison without a network dependency.

The frontend-owned SEO registry records canonical path, title, description, H1,
topic parent, related paths, schema expectations, launch phase and publication
state. It derives public availability, indexability, sitemap eligibility and
internal-link eligibility from one contract. The complete catalogue can remain
public while only the approved launch edit is indexable.

Publication states are `draft`, `scheduled`, `published_noindex`,
`published_indexable` and `archived`. Scheduled static publication requires a
rebuild/deploy because no scheduler or publishing service exists in this phase.
The sitemap is an index over batches capped below the 50,000-URL protocol limit.
Search, facets, sorting, help search and pagination remain query states and never
mint indexable landing pages.

Browser-local providers support demo profiles, onboarding, preferences,
personalized ranking, market display settings and legal document versions.
Workspace, RFQ and purchase interfaces are retained as honest frontend
previews; they create no supplier, quote, order, payment or verification
record.

Authentication, authorization, durable consent, operational supplier
verification, inventory, orders, payments, fulfilment, messaging and private
media remain requirements for a new backend phase.

---

## 12. Build sequence

| Phase        | Focus                                                                                           | Indexable | Gate to move on                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------- |
| 0 Foundation | taxonomy, schema, URL rules, slug registry, listing template, indexability job, design system   | ~50       | taxonomy signed off; listing form captures every filterable field; nightly stats job running |
| 1 Hubs       | fabric families and constructions, top applications, primary buyer subcategories — hand-written | ~400      | every hub ≥5 listings from ≥3 suppliers; internal linking complete; no orphan hubs           |
| 2 Depth      | specification pages, buyer×fabric, application×fabric, supplier profiles                        | ~3,000    | near-duplicate detection live; first rankings and inquiries measurable                       |
| 3 Breadth    | country×fabric, certification hubs, performance pages, remaining buyer subcategories            | ~8,000    | genuine supplier depth per country; certification claims verified                            |
| 4 Scale      | listings at volume, long-tail specification bands, guides                                       | ~30,000+  | continuous; page count follows listing count under the same thresholds                       |

### Six checks before engineering time is committed

1. Keyword research against the tier model (200–300 keywords across all eight tiers) —
   confirming the _shape_, not the absolute numbers.
2. Audit supply against the taxonomy for every proposed Phase 1 hub. This is the
   difference between a launch plan and a wishlist.
3. Confirm the listing form captures every filterable field. **The single most expensive
   thing to get wrong** — a field missing at listing time can never be filtered, faceted
   or used for page generation without re-contacting every supplier.
4. Agree the standard bands (GSM, widths, MOQ units, price units) before the first
   listing is created.
5. Put the gate thresholds in configuration, not code.
6. Instrument from day one — internal search queries, zero-result searches, filter
   combinations, inquiries per page. Retrofitting means losing the first year of evidence.

### Health metrics (page count is the wrong measure)

| Measure                                              | Unhealthy pattern                                                 |
| ---------------------------------------------------- | ----------------------------------------------------------------- |
| Share of indexable pages with ≥1 inquiry per quarter | large indexed footprint, a small minority producing every inquiry |
| Indexed ÷ submitted in sitemaps                      | a widening gap — generation has outrun genuine supply             |
| Zero-result searches as a share of all searches      | stable or rising — supplier recruitment is not following demand   |
| Listings per taxonomy node in Phase 1 hubs           | page count growing faster than listing count                      |

**Growth driver: supplier onboarding.** Supply depth is what unlocks new indexable
pages. Build the marketplace properly and the SEO is a consequence of it.
