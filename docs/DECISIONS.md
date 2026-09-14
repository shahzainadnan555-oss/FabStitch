# FabStitch — architecture decisions

Decisions that shape the whole system. Anything marked **OPEN** needs an explicit call
before code depends on it. Anything marked **RECORDED** is settled and takes precedence
over the research PDFs.

---

## RECORDED

### R38 — The current product is frontend-only

As of 2026-09-12, this repository has no current backend. The previous API
client, token authentication, route guards, backend repositories, OpenAPI
artifacts and backend QA scripts are removed.

The approved catalogue under `catalog/` is authoritative for customer product
discovery. Demo profiles, legal-consent versions, onboarding and preferences
use versioned browser local storage; comparison uses session storage. Password
values are never stored or verified. Purchase, RFQ, buyer, supplier and admin
interfaces are honest non-submitting previews.

No API URL, data-source mode or old service adapter is retained. A future
FabStitch backend must implement the UI-facing provider/repository boundary and
durable consent records without reviving or depending on the removed account
system. This decision supersedes earlier implementation decisions that describe
the removed FastAPI, JWT, database or live supplier/listing integration. Those
sections remain historical context only.

### R39 — SEO publication is locally controlled during the frontend-only phase

`domain/seo/storefront-registry.ts` is the inspected page inventory and
`domain/seo/launch-manifest.ts` is the current publication source. The shared
contract supports `draft`, `scheduled`, `published_noindex`,
`published_indexable` and `archived`. Public availability, indexability,
sitemap eligibility and internal-link eligibility are separate derived states.

The complete approved catalogue remains browseable, but only the existing
`CURATED_FABRIC_SLUGS` edit is indexable at the fabric-product layer. Remaining
fabric pages are `published_noindex`; collection, Best For and guide pages must
still pass their content/depth gates. Search, sort, filter and pagination query
states are `noindex,follow` and canonicalize to their clean curated parent.

Scheduled publication is evaluated from the local manifest at build time.
Because there is deliberately no publishing backend, scheduler or database, a
static scheduled launch requires a rebuild/deploy after its publish time. Draft
and pre-publication scheduled overrides are blocked before route rendering;
archived overrides return unavailable behavior or a direct permanent redirect
when a replacement is recorded.

`/sitemap.xml` is an index over bounded sitemap batches and contains only
canonical `published_indexable` pages. Internal launch inventory is generated
by `npm run seo` into a local artifact and is not rendered on the public admin
preview. A future backend may replace the local publication source through the
same contract; this decision does not authorize a backend connection or a Page
Studio.

### R1 — Navigation is six sections, not eight

The Blueprint proposes Shop Fabrics · Industries · Applications · Suppliers · Services ·
Stock & Deals · Resources · RFQ. The FabStitch strategy document proposes Fabrics ·
Applications · Buyers · Suppliers · Certifications · Resources.

**FabStitch follows the six-section model.** Each section maps to a real entity, so
navigation, URL structure and the database agree with each other. Industries folds into
Buyers. Services and Stock & Deals become capability facets and filters (custom
dyeing/printing/finishing/lab dips; ready stock, low MOQ, deadstock) rather than
permanent nav items. RFQ is a persistent primary action, not a tab.

_Rationale: the master brief requires deliberately simple navigation, and eight
top-level sections with two of them ("Services", "Stock & Deals") that are really
filters would make the buyer decide between overlapping doors._

### R2 — `DESIGN.md` is not FabStitch's design system

`DESIGN.md` is a brand analysis of **Anthropic's claude.com** (cream `#faf9f5`, coral
`#cc785c`, Copernicus/StyreneB, the Anthropic spike mark). It is kept as a _reference
for how to structure a token system_, and for nothing else. Its colour values,
typefaces, component definitions and brand language are not adopted.

_Rationale: adopting it would make FabStitch look like Anthropic's marketing site, and
it documents none of the components a sourcing marketplace needs._

### R3 — The keyword system is separate from the page system

Keywords live in a planning database and are _mapped_ onto pages that already deserve to
exist. There is never a page per keyword, and page creation is never triggered by
keyword existence.

### R4 — Trailing slash on

`trailingSlash: true`. Every URL in the research documents and in
`docs/ARCHITECTURE.md` carries one; Next.js issues the 301 from the non-slash form
automatically. One line now, a site-wide migration later. Internal `href`s are written
with the trailing slash so no redirect hop occurs on internal navigation.

### R5 — Top bar shows three doors; the six-section IA is unchanged

R1's six sections remain the information architecture (URLs, footer map, hub pages).
The **top bar** exposes three:

| Door         | Buyer's words            |
| ------------ | ------------------------ |
| Fabrics      | "I know the material"    |
| Applications | "I know what I'm making" |
| Suppliers    | "Who can make this?"     |

**Buyers was removed from the top bar** (it was a door in the first revision). On a
two-sided marketplace the word reads as _"browse buyers"_, which is what a **supplier**
wants — and a buyer does not navigate to a page about themselves, they land on one from
search. Buyer types now sit inside the **Applications** panel under "Or by who you are",
which is also their real relationship in the data model (buyer → application → fabric),
plus the footer map. The buyer page family is unchanged; only its front-door claim is.

**Certifications** and **Resources** are reachable from the Fabrics panel and the footer;
they are compliance filters and support content, not entry vocabularies. **Post an RFQ**
is a persistent action in the right cluster, never a nav tab, and is hidden on mobile
where it lives in the sheet instead.

_Rationale: the objective is to minimise confusion, not to maximise visible navigation.
Every remaining word is unambiguous on first read._

### R8 — One input, not a mode switch

The homepage has **one** sourcing field. The first revision led with a tab pair — "I
know what I'm making" / "I know the specification" — plus a product select, a quantity
and a unit. That asked the buyer to classify themselves and fill a procurement form
before they had started, and the two tabs were a description of the _parser's_ two code
paths rather than anything in the buyer's head.

The single field accepts every vocabulary a buyer arrives with — product, fabric,
specification, outcome, company type — and routes to a real destination via
`features/search/suggest.ts`. Verified against all of them, plus the brief's own
success case ("fabric for 5000 t-shirts" → **Product · T-shirts**).

The parser is unchanged and stays behind the field: when a query carries structured
criteria they surface as the **top suggestion in plain language** ("Cotton jersey ·
180 ±5% · Pakistan"), not as a panel of chips the buyer has to interpret. Chip-level
refinement belongs on the results page, where refining is the task.

**No quantity, GSM, certification or country input on the homepage.** Those are
refinements and appear after discovery.

Consequences for the first viewport, in priority order: what this is · one input ·
where to start · how to escalate. All four are above the fold at 390, 768 and 1280.
The trust panel that previously sat beside the input is now a compact strip _below_
it — the buyer does not need to read about verification before searching.

### R6 — Visual language: technical instrument, not marketing page

One design language, two densities. **Discovery/hub surfaces** get editorial restraint;
**sourcing surfaces** (results, spec sheets, comparison, RFQ, dashboards) get high
information density. Same tokens, same components, different density scale.

The concrete commitments that make it _not_ look AI-generated:

- **Hairline rules, not cards with shadows.** Structure comes from the grid, the way a
  technical drawing or a mill spec sheet does. Radius tops out at 4px.
- **IBM Plex Sans + IBM Plex Mono.** Engineering-documentation heritage, matches the
  domain, and is not the Inter/Geist default. Every numeric — GSM, width, MOQ, price,
  yarn count, lead time — is set in mono. Numbers in mono is the strongest available
  signal that this is an instrument rather than a brochure.
- **Ink and paper carry ~95% of the surface.** A single brand colour, **indigo**
  (`#1e3563`) — the dye that made the textile trade, and deliberately not SaaS blue.
  Semantic colour appears only in status contexts.
- **Mono micro-labels in uppercase with wide tracking** for field names, the vernacular
  of a specification sheet.
- **Hand-authored 1.25px-stroke icon set.** No icon library: the banned-by-every-skill
  Lucide/Feather look is avoided, and the dependency is avoided with it.
- No dark mode in this milestone; tokens are structured to accept one.

### R7 — Fixtures may not assert marketplace facts

Fixture data carries **taxonomy** (fabric families, applications, buyer categories,
certifications, countries) — that is real domain knowledge from the research documents,
not invention. Fixtures never carry supplier counts, listing counts, transaction values,
reviews, response rates or marketplace statistics, and the homepage displays no
aggregate metric in this milestone. Where a specimen record is needed to show buyers
what a listing gives them, it is labelled **ILLUSTRATIVE RECORD** in the UI and carries
no company name. Everything lives under `fixtures/` behind `domain/` types so real data
substitutes without touching a component.

### R9 — Photography is wired but not fabricated

`components/marketplace/fabric-media.tsx` is one slot with two sources: a
supplier image when one exists, the construction diagram when it does not. Both
render at the same aspect, so a results grid never goes ragged as inventory
fills in.

Generated photography was approved and attempted. It is **blocked**: the
connected image account is on a free plan with zero credits, so no model tier
will accept a submission. Random stock (picsum and similar) was rejected rather
than used, because a photograph of a landscape on a "cotton jersey" card is
worse than no photograph and is the decorative-filler pattern the brief bans.

The diagrams are therefore the current default. They are informative rather
than decorative: a buyer scanning a grid can tell a jersey from a twill.

**Where real photography goes, when it exists.** No code changes needed, only
data on the listing:

| Placement                   | Ratio | Content                                          |
| --------------------------- | ----- | ------------------------------------------------ |
| Listing gallery, main frame | 16:7  | Flat swatch, full bleed                          |
| Listing gallery, thumbnails | 1:1   | Draped, macro weave detail                       |
| Result and hub cards        | 4:3   | Flat swatch                                      |
| Fabric category header      | 16:7  | Representative texture for the family            |
| Application cards           | 4:3   | The finished product, not the cloth              |
| Supplier profile            | 3:2   | Real factory or warehouse only. Never generated. |

Supplier imagery stays a special case: a generated "factory photo" would be a
fabricated capability claim, which R7 forbids regardless of credit balance.

### R10 — Auth route names follow the brief

`/login`, `/signup`, `/verify`, `/forgot-password`, `/reset-password`. Renamed
from the earlier `/sign-in` and `/sign-up`.

Gated actions carry a validated `?next=` path, so a buyer interrupted part-way
through a sample request returns to that request rather than to a dashboard.
`features/auth/return-to.ts` rejects absolute URLs, protocol-relative URLs and
encoded traversal before the value reaches the router, because an unvalidated
`next` is an open redirect.

### R11 — Blend: R6 palette, warmer surface treatment

Reference mockups were supplied for the homepage, sign-in, buyer browse and
supplier dashboard. They are a competent modern SaaS look: saturated violet,
12px cards, soft shadows, pastel icon circles, pill tags, an emoji greeting,
social sign-in. R6 was built deliberately against that register.

**Resolution: blend, not replace.** Keep what makes FabStitch look like an
instrument; take the warmth and the structure.

| Kept from R6                              | Taken from the mockups         |
| ----------------------------------------- | ------------------------------ |
| Indigo `#1e3563` as the only brand colour | Colour on every media slot     |
| Hairline rules as structure               | Soft tinted elevation on cards |
| Mono tabular numerics                     | Supplier dashboard IA          |
| Uppercase mono field labels               | Grid / table view toggle       |
| Hand-authored icons                       | Metric tile row                |

Concrete token moves: radius `4px → 6px` (one scale, applied everywhere), a
`--shadow-card` tinted to the paper hue rather than black, and `.fs-card` /
`.fs-card-interactive` so every raised surface lifts by the same amount.

**Not taken:** pastel icon circles, pill tags, emoji in product copy, and the
saturated violet. Each would move the product toward the generic register the
brief has consistently ruled out.

### R12 — Rendered swatches, and what they are not

Media slots render a swatch built from the listing's own declared data: its
colour, its construction geometry, and a drape whose fold period scales with
weight. Fold phase varies per listing so a grid does not read as one repeated
tile.

This is **a rendering of declared data, not a photograph**, and it is not
trying to be one. CSS cannot convincingly fake cloth; pushing the texture
harder produced wallpaper, so the texture was dialled back to a hint and the
colour and drape carry the recognition.

Photography remains blocked (R9: free plan, zero credits). The moment a
supplier uploads a real image, `FabricMedia` shows it instead and the swatch
disappears. No component changes.

### R13 — Dashboards show absence, not invented activity

The mockups populate dashboards with order counts, revenue figures and
percentage trends. Those are the most persuasive part of the design and the
part that cannot ship: a product asserting "Total Revenue PKR 1,245,000
↑22%" to a signed-out visitor is fabricating marketplace activity.

Workspace surfaces therefore carry the mockups' **layout** with honest empty
states. Metric tiles read "No data" against a labelled period. Every queue
names the next action instead.

Two of the mockups' supplier names appear to belong to real companies.
Attaching invented order values and verification badges to a real business is
impersonation, so fixture suppliers use constructed names throughout.

### R14 — Sign-in modal follows the mockup, minus three claims

`features/auth/auth-modal.tsx` reproduces the mockup's auth screen as a modal
over the marketplace: chrome bar with the opposite-mode link, split body with
the form beside a dark assurance panel, legal footer. It is one component for
both modes, because the mockup's header link moves between them and a full
page navigation at that point would drop whatever the buyer was doing.

Three things in the mockup are deliberately not reproduced:

| Mockup                                  | Shipped                                                                | Why                                                                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| "Secure login protected by reCAPTCHA"   | Note that SSO is not connected                                         | No bot protection is integrated. A false security claim is the worst kind.                                           |
| "Only verified manufacturers and mills" | "Identity, address and certificates are checked before a mark appears" | Unverified suppliers are listed too, deliberately, with the tier shown. The mockup line contradicts `/verification`. |
| Live Google / Microsoft buttons         | Rendered, disabled, with the reason stated                             | The API exposes `/auth/login` and `/auth/register/{buyer,supplier}` only. There is no OAuth callback to call.        |

The mockup's photograph of folded cloth is a rendered stack of `Swatch`
components, for the reason in R9 and R12.

Type tokens stay on R6 (mono uppercase field labels) rather than the mockup's
sentence-case labels, so the modal matches `/login` and `/signup`, which are one
click away.

**Return path.** `openAuth` captures `window.location.pathname + search` at
click time, not `usePathname()`, which drops the query string. Losing
`?q=180+gsm+cotton+jersey` across a sign-in is precisely what this flow exists
to prevent. Reading `location` directly also avoids `useSearchParams()`, which
would put every statically rendered page carrying the header behind a Suspense
boundary. The static `href` fallback is pathname-only, which is the degraded
path for middle-click and no-JS.

`/legal/terms`, `/legal/privacy` and `/help` were dead links in the global
footer before this change and now resolve. The legal routes state that the
document is unpublished and list what it will cover, rather than presenting
drafted text a buyer might rely on.

### R17 - First real photograph: the hero

Supplied on 2026-08-19 and wired into the homepage hero
(`public/media/hero-navy-jersey.jpg`, 1536x1024, re-encoded from a 1.9 MB PNG to
a 264 KB JPEG). It is **illustrative category photography**, not any mill's
stock, and is labelled as such in the code. R9 is unchanged for listing media: a
listing still only ever shows what its own supplier uploaded, and the `Swatch`
renderer remains the fallback everywhere else.

Three things the wiring has to get right, each verified rather than assumed:

- **The gap.** The photograph's own left third is white, and `object-cover`
  cannot crop horizontally at this aspect - the panel is wider than the frame is
  tall, so cover scales by width and every pixel of that white band survives.
  It landed exactly between the search field and the cloth, which is the dead
  space the mockup does not have. The frame is therefore rendered at 142% of a
  58%-wide window and anchored right, so the white is clipped away and the mask
  does the entire blend over one long fall.
- **The seam.** A left-edge gradient mask dissolves the cloth into the paper, so
  it never butts against the text column on a hard line. Written with the
  `-webkit-` prefix as well - on older WebKit an unprefixed mask silently does
  nothing, and the failure mode is a seam down the middle of the hero.
- **Mobile waste.** The panel is hidden below `lg`. `priority` emits a preload
  link that does not know that, so a 390px phone was downloading a 640px copy of
  an image it never paints. Tuning `sizes` only moved the number around; the
  actual fix is `loading="lazy"`, which _does_ respect `display: none`. Phones
  and tablets now fetch nothing at all, and desktop still starts the fetch
  immediately because the panel is in the viewport at load.
- **Resolution.** `sizes` is measured against the rendered frame rather than
  guessed. The frame is 79.5vw at every desktop width, so `80vw`: 1080 into 1018
  at 1280, 1200 into 1145 at 1440. An earlier `84vw` tipped 1440 past Next's
  1200 bucket and fetched 1920 for an 1145px slot.

### R18 - Authentication is page-based, and gated at the destination

Instructed on 2026-08-20: authentication must never be a modal, drawer or
overlay. `features/auth/auth-modal.tsx` and `components/ui/dialog.tsx` are
deleted - the dialog primitive had no other consumer - and R14's modal is
superseded. `/login`, `/signup`, `/forgot-password`, `/reset-password` and
`/verify` are real routes sharing one `AuthShell`.

**Gating is at the destination, not the button.** A per-button check is a list
that goes stale the first time someone adds a link, and it does nothing when a
URL is typed or shared. `/rfq/` calls `requireSession()` in the page;
`/buyer/*`, `/supplier/*` and `/admin/*` are matched in `proxy.ts` (Next 16's
`middleware.ts`). Browsing stays open: fabrics, suppliers, applications,
specifications, search and comparison need no account.

The proxy is an **optimistic cookie-presence check and nothing more** - the
Next docs are explicit that proxy is not a session or authorisation layer, and
it is not one here. Authorisation happens on the API, per request, against the
bearer token. A forged cookie buys a workspace shell whose every data call
returns 401.

**Tokens live in httpOnly cookies set by a server action.** A token readable by
JavaScript is a token an injected script can exfiltrate, and these accounts
carry a company's commercial terms. Verified: `document.cookie` cannot see the
session.

**`?next` is validated before use.** Six open-redirect payloads - absolute,
protocol-relative, backslash, scheme-prefixed, percent-encoded and
`javascript:` - all collapse to `/`.

**Fields match the live schema exactly** (`email`, `password` 8-72,
`full_name`, `company_name`, `country_code` as ISO-2). No endpoint and no
validation rule was invented. The email field is labelled "work email" because
this is a B2B marketplace, but no free-provider blocklist is applied: the API
does not implement one, and a mill on a consumer domain is still a real
supplier.

**Historical backend defect found while testing.** The removed role-registration
endpoint returned **500 `FileNotFoundError`** for both roles - and the account
is created anyway, with login succeeding immediately and the correct role in
the JWT. The failure is after user creation, most likely a missing email
template, consistent with the backend running from `~/.Trash` (open decision
D1). The frontend neither claims success nor claims failure on a 500: it says
the account may still have been created and points at sign-in, because a plain
retry hits 409. Fixing this is a backend change and was not made.

### R19 - Authentication is a modal over the marketplace

Instructed on 2026-08-20, reversing R18's page-only rule: an account-required
action opens a modal on top of the page the buyer is already on. The page-based
routes stay, because they are still needed for direct URLs, emailed reset and
verification links, and as the no-JavaScript path - but the modal is the way a
click gets there.

**One provider, one component, one instance.** `AuthModalProvider` is mounted
once in the marketplace layout; any control anywhere calls
`useAuthModal().open({ intent, returnTo })`. `GatedAction` / `GatedButton` wrap
that, and they render real `<a href>`s - middle-click, "open in new tab" and a
JS failure all reach the destination, where the server guard takes over.

**The modal knows why it opened.** `features/auth/intents.ts` maps an intent to
its heading and its consequence, so "Request a sample" produces _"Sign in to
request a sample"_, not "Please sign in". Verified per intent.

**Progressive sign-up against a non-progressive API.** The brief asks for
email+password first, then role, then profile. `/auth/register/{role}` requires
all of it in one call, so the modal collects across three steps and posts once
at the end. No two-phase endpoint was invented.

**Business types come from the schema.** The brief proposed Apparel / Home
textiles / Hospitality / Uniforms / Accessories. The API's `BuyerType` and
`SupplierType` enums are different, so the real values ship - inventing
categories the API rejects would fail on submit.

**Google and Apple are built but honest.** The API has no OAuth route at all.
The buttons exist with real state, and pressing one says single sign-on is not
connected rather than faking a session (brief §20).

**Accessibility is the native dialog's**, verified on the open modal: labelled,
focus trapped, body scroll locked, Escape closes, focus returns to the control
that opened it, zero unlabelled inputs, zero unnamed buttons.

**One instruction not followed, deliberately.** §1 lists "View fabric details"
as account-required, but §15 says not to block normal browsing, and the project
constitution requires MOQ and price bands to be visible without a signup wall.
The `view_fabric` intent exists and is ready to wire, but listing pages are not
gated. Say the word and it is a one-line change per link.

### R20 - Modal refinements, and the field that was going to be thrown away

Refinement pass on R19 against the final modal spec. Composition confirmed at
**45% fabric / 55% authentication**; the brand panel is extracted to
`brand-panel.tsx` and the provider buttons to `social-auth-button.tsx`.

**Google and Apple stay UI-only, by instruction and by fact.** No client ID, no
secret, no Supabase, no callback, no fabricated success - the API has no OAuth
route to call. Pressing one says so. The component takes an `onSelect` handler,
so connecting a real provider later is a one-line change.

**Mobile now shows the fabric.** It was hidden below `sm`; the spec allows a
smaller top section, so it is a 112px band. A full-height image on a phone
would push the primary action below the fold.

**A role branch that cannot fire yet, deliberately.** Email registration always
carries a role because `/register/{role}` demands one, so an authenticated
account with no role is currently impossible. The branch exists anyway
(`state.ok && !state.role` goes to role selection) because that is exactly what
a future Google or Apple sign-in lands in. Structure now, provider later.

**Historical note:** the removed registration endpoint had no field for “What
do you manufacture?” The old implementation temporarily held that answer for a
later profile update. R38 supersedes that flow: onboarding now saves the answer
in the single browser-local demo profile.

Buyer and supplier onboarding differ, as specified: both take name, company,
country and business type (the real `BuyerType` / `SupplierType` enums); only
the buyer is asked what they manufacture.

### R21 - The masthead opens the modal, and the panel carries the brand

Two changes on 2026-08-20, from a supplied reference of the modal.

**Sign in and Join now open the modal.** They were still plain links to
`/login` and `/signup` - left over from R18's page-only turn and not reverted
when R19 brought the modal back. A buyer who clicks Join while reading a
listing now stays on that listing. Both remain real `<a href>`s so middle-click
and the no-JavaScript path still reach the routes, and `Join` opens on sign-up
while `Sign in` opens on sign-in.

**The fabric panel now carries the brand.** Reference composition reproduced:
50/50 split, wordmark and headline over the cloth, three assurances in bordered
icon tiles, a closing line at the foot. The wordmark moved off the form side,
where it was duplicating what the panel already says. "Continue with email"
became a text action with an envelope rather than a filled button, and the
terms line closes the panel.

**Two claims in the reference artwork were not reproduced.** "Every supplier is
verified for trust and reliability" is false - unverified suppliers are listed
too, deliberately, with the tier shown. "Trusted by garment manufacturers and
brands worldwide" is fabricated social proof; there are no customers yet. The
composition is identical, the copy states what is true: what verification
actually checks, and who the product is _built for_ rather than who uses it.

**Scrim calibration.** The first pass at the overlay was opaque enough to turn
the photograph into a flat indigo block, which loses the only thing the panel
exists for. Pulled back to 78/45/72 - the folds read clearly and white type
still clears contrast, because the photograph is already a dark navy.

### R22 - Phase 1: relations as data, and what an audit found

Phase 1 was mostly an audit. 56 routes and 21k lines already covered the
deliverable list, so the work was the four things that were genuinely missing
plus the defects a real crawl exposed.

**Relations moved into the taxonomy.** `domain/taxonomy/relations.ts` builds
the reverse indexes the forward edges never had: an application names its
fabrics, but no fabric knew which applications wanted it. Templates now ask the
graph instead of hand-writing links, so adding one application improves the
fabric page, the buyer page and the sibling pages with no component edit.
Certifications and origins are counted from the result set the page already
loaded - observed, never assumed from the taxonomy.

**Route states.** `loading`, `error` and `not-found` per group, with skeletons
that mirror the real layout rather than a generic spinner.

**A loading boundary changes the status code.** Adding `loading.tsx` to the
record segments made every missing listing answer **200** instead of 404: a
loading boundary makes the segment stream, and a streamed response has already
sent its headers by the time `notFound()` runs. The Next docs are explicit
about this. The boundary now exists only on `/search`, which is the slowest
public route and can never 404 a record; every record page answers a real 404.

**SEO computed, not declared.** `lib/seo.ts` derives the sitemap from the same
taxonomy the pages resolve against, so it cannot list a URL that 404s, and
excludes query strings by construction - filter states are never canonical.
299 URLs, every one verified 200.

**What crawling found.** A link crawl over 320 internal links exposed 15 dead
ends that no amount of reading would have shown:

- the entire Suppliers dropdown - six country links, the country index and five
  capability links - pointed at routes that did not exist;
- ten application _group_ pages were linked from the main navigation with no
  template behind them;
- `/fabrics/index/`, `/resources/*` and `/rfq/samples/` were linked and absent.

Countries and groups now resolve on their existing `[slug]` routes, because
both are legitimately the same kind of page at a different resolution.
Capability links point at the directory filter that already worked. `/rfq/` was
also in the sitemap while being auth-gated, which would have sent a crawler to
a login wall.

**A gated control could crash a route.** `CatalogCard` calls `useAuthModal()`
for its save button, and only the marketplace layout mounted the provider - so
the buyer dashboard threw as soon as it rendered a card. Fixed twice over: the
buyer workspace mounts the provider, and `GatedAction` now uses an optional
accessor that degrades to plain navigation. A save button should never be able
to take down a page.

### R23 - Phase 2: the gate decides which pages exist

Phase 2 built the layer that decides _whether a page deserves to be indexed_,
and connected it to the sitemap so the decision has teeth.

**Keyword intelligence, with no invented numbers.** `domain/seo/keywords.ts`
carries the record shape, a deterministic intent classifier and the mapping
from intent plus entities to a page type and route. **No search volumes,
difficulties or rankings exist anywhere** - every metric is optional and
absent, because no keyword research has been imported. `targetPath` is
nullable on purpose: an unmapped keyword is a normal state, and forcing every
keyword to a URL is how thin pages get made.

**The gate.** `opportunities.ts` scores candidates on evidence counted from
real records - listings that would appear, suppliers behind them, related
entities that would link, content blocks not shared with the parent - and
returns indexability _with the specific conditions that failed_. Supply floors
differ by page type, because a specification page with nothing to show is a
dead end while a category page can stand on explanation.

**Effect on the sitemap: 299 URLs became 86.** 198 pages the taxonomy can
express have nothing behind them yet. They still render for anyone who lands
on them; they simply do not ask to be indexed. That number is the honest state
of the catalogue, not a bug.

**Priority weights exclude demand, deliberately.** `demand` is weighted zero.
Weighting a field that is always undefined would produce an ordering that looks
data-driven and is not. Importing real research changes the order with no other
edit.

**Fabric comparison separates declared from observed.** Taxonomy facts and
counted marketplace facts sit in different blocks because they carry different
authority, and anything neither states renders "Not specified". Verified: cotton
jersey against organza shows 18 such cells rather than 18 guesses.

**Three defects the verification found:**

- Opportunity paths were built as `/fabrics/{family}/{slug}/` while pages
  publish `buildCanonical()`, which follows ancestry. The gate was governing a
  different URL than the site serves, so 18 passing fabric pages never reached
  the sitemap. Both now use the same builder.
- `/fabrics/cotton/` appeared twice: a family slug and a node slug resolve to
  the same canonical. The sitemap now deduplicates by path.
- Checking H2 counts with `grep -c` counts _lines_, and built HTML is one line.
  The real counts are 6-8 per page; the first measurement of "1" was wrong.

**The gate now reaches the page head.** Held-back pages were excluded from the
sitemap but emitted no `robots` meta, so a crawler following an internal link
indexed them anyway and the whole evaluation was decoration. `gate-lookup.ts`
resolves a decision per canonical path, `cache()`d so building 214 pages reads
the catalogue once, and `generateMetadata` on fabric, specification,
application, buyer and country routes now goes through the templates. The
lookup **defaults to false**: un-evaluated is not the same as approved, and
opting in by silence is how thin pages escape.

**Curated hubs are not gated.** A fabric family, a property hub, an
application group and a certification page are navigation and explanation, not
generated combinations. Gating them on listing count would have dropped the
site's primary entry points out of the sitemap, and would hide an explanation
of GOTS because no supplier has uploaded a GOTS certificate yet. They are
listed always; everything below hub level faces the gate.

**Four more defects, all found by one consistency check** comparing sitemap
membership against each page's own `robots` meta, at canonical URLs only:

- Country pages passed the gate but were never added to the sitemap generator -
  an earlier patch had silently failed to apply against reformatted source.
- Certification pages were gated but had no opportunity records, so all seven
  were excluded while still declaring themselves indexable.
- `/suppliers/join/` was indexable and unlisted.
- `/fabrics/knits/` and `/fabrics/knitted/` produced an identical title: the
  knits _family_ and the "knitted" _property hub_ were both named "Knits". Its
  sibling hubs are all "<property> fabrics", so the hub was the outlier. Renamed
  in the taxonomy, which is where the collision was - not in the template.

Result: **120 indexable pages, zero duplicate titles, zero duplicate
descriptions, and sitemap membership agreeing with `robots` meta on all 146
canonical pages.**

**Not built, and why.** Country x fabric and certification x fabric pages have
relationship data but no template, so they are not opportunities - a page type
with no way to render is a plan, not a candidate. Comparison URLs are
`noindex`: a query-string comparison is a state, and indexing arbitrary
combinations is the unbounded URL space the gate exists to prevent.

### R24 - Phase 3: the gate comes from the research, not from me

The keyword and programmatic-SEO strategy PDF has been in the repository root
the whole time. Phase 2's gate used thresholds I chose; Q20 of that document
specifies a **seven-condition gate with measurable thresholds**, and calls it
"the single most important control in the entire architecture: it is what
allows FabStitch to plan for 40,000 pages without ever publishing a thin one."
The invented gate is replaced by the documented one in `domain/seo/gate.ts`.

**What changed against Phase 2.** Listing floors are now 3 for fabric,
application and buyer pages and 5 for specification, buyer x fabric and
country x fabric. Supplier depth is >= 2, and >= 3 for country pages, with
listing completeness >= 70%. Content must reach 150 unique words, uniqueness
0.7 against parent and siblings, and the combination must be on the allow-list.
Every refusal now names its condition number, so a decision traces to a page of
the document rather than to an argument.

**Q21 also settles what a refusal means:** "NOINDEX IS NOT DELETION.
Non-indexable pages still work for users... they remain crawlable via noindex,
follow so link equity flows through them." Held-back pages render normally,
keep their internal links, and qualify themselves when supply crosses the
threshold.

**No keyword volumes were imported.** The document is architecture, not a
dataset - there is no volume, difficulty or CPC figure in 59 pages. `demand`
stays weighted zero, and build order follows Q22's stated tier sequence
(3 -> 5 -> 4 -> 6 -> 7 -> 8 -> 2 -> 1) rather than volume, because Q23 is
explicit that in B2B sourcing volume and value are close to inverted.

**Clustering prevents the failure mode that grows with scale.** "cotton jersey
fabric", "cotton jersey material" and "cotton jersey cloth" cluster to one page
with the rest as secondary terms. Intent markers are deliberately excluded from
the signature so "cotton jersey" and "cotton jersey supplier" stay apart -
same subject, different job.

**One of my own signals was invented and is now measured.** `uniqueWordCount`
was `listings x 12` - a guess wearing a measurement's clothes. It now sums the
actual strings a page renders. The correction moved approvals from 1 to 7,
which is the point: a fabricated input produces a fabricated verdict.

**The honest result on today's catalogue: 353 candidates, 7 pass.** Refusals
are 344 on content, 472 on supplier depth, 309 on listings, 205 on uniqueness,
78 on duplicate keywords. That is not a bug - it is the gate correctly saying a
24-listing fixture catalogue cannot support a large indexed surface. The
architecture is ready; the supply is not. Scaling before D1 is resolved would
mean publishing exactly the thin pages the document forbids.

**Composite routes exist even when the gate refuses to index them.** I had
argued the opposite - that building a route for a page the gate rejects is
building for nothing - and that was wrong. Q21 draws the distinction I had
collapsed: "NOINDEX IS NOT DELETION. Non-indexable pages still work for users:
they are reachable through filters and internal search, they render normally."
The gate governs whether FabStitch _asks to be indexed_, not whether a page
exists. A buyer searching for cotton jersey in Pakistan meeting a 404 is the
wrong answer to a real intent.

`/suppliers/[country]/[fabric]/` is the first composite and the pattern for the
other two. It carries a block neither parent can: which mills in this country
hold this cloth, at what weight, MOQ and price band. Real combinations answer
200 with `noindex, follow` so link equity still flows; an unknown country or
fabric still 404s. The country page links only to combinations with real
supply, so no composite is an orphan.

**Sitemaps are grouped**, one file per entity family via `generateSitemaps`,
with `robots.txt` listing all seven. At scale a grouped sitemap says which part
of the site a crawler is struggling with, and Google's 50,000-URL ceiling is
reached by a fabric x country matrix long before anything else.

### R15 - The mockups are the visual specification

Instructed on 2026-08-19: the supplied reference images are the design source
of truth for the homepage, authentication, buyer dashboard, supplier dashboard
and fabric discovery. Layout, hierarchy, spacing, proportion, density and
component relationships follow them. Deviations are limited to accessibility,
responsive adaptation, real data requirements and honesty.

**Adopted from the references.** A 72px top bar with command search and account
cluster over a 240px grouped rail (`components/layout/app-shell.tsx`), one shell
for every workspace. The buyer dashboard is now a **fabric discovery
workspace**, not a queue console: filter pills, sort, view toggle, a four-across
`CatalogCard` grid and numbered pagination. The supplier dashboard keeps its
greeting, metric row with icon medallions, catalogue beside recent orders, and
the RFQ queue full width. The homepage gains a split hero with a floating
verification card, nine product tiles, six category cards, a live listing row, a
supplier row, a numbered process band and a dark RFQ band.

**Superseded.** R5 removed "Buyers" from the top bar on the reasoning that a
buyer does not navigate to a page about themselves. The references show five
sections, so the header is now Fabrics · Applications · Buyers · Suppliers ·
Resources. R5's reasoning still holds as a usability argument and is worth
re-testing with real buyers, but the specification wins.

**Not adopted, and why.** Numbers. The mockups carry `2,456 fabrics found`,
`Alex Johnson / Buyer Account`, `Total Revenue PKR 1,245,000 ↑22%`, order rows,
and count chips reading 3 and 4. Every one of those is invented marketplace
activity. Counts on shipped pages are computed at render time from the same
catalogue every other page reads: category counts come from
`familiesOfListing()` in the taxonomy, supplier listing counts are counted per
slug, and workspace figures read "No data" against a labelled period until an
account is connected. The account cluster says "Not signed in" rather than
naming a person who does not exist.

The mockup's "Trusted by global buyers" row shows _suppliers_, and FabStitch has
no customer logos. The row ships as "Suppliers on FabStitch" with real fixture
suppliers, their country and their counted listings.

**Photography remains the one visible gap.** The references are carried by
fabric photography. The image account is on a free plan with zero credits, so
every media slot renders `Swatch` instead. Unrelated stock imagery was not
substituted (R9). Fixture swatch colours were diversified so a browse grid reads
as dyed cloth rather than one beige field.

### R16 - A closed `<dialog>` needs `open:flex`, never a bare `flex`

Making the auth modal scroll internally added `flex` to the `<dialog>` element.
That silently outranks the UA rule `dialog:not([open]) { display: none }`, so the
sign-in modal painted over **every** marketplace page while `dialog.open`
correctly reported `false`.

Two lessons, both recorded because they will recur:

- Any unconditional `display` utility on `<dialog>` breaks it. Use the `open:`
  variant.
- Asserting on `dialog.open` is not a visibility check. The QA sweep now
  compares `getComputedStyle(dialog).display` against `dialog.open` on every
  route and fails on a mismatch.

---

### R25 - Phase 4: population could not come from data, so it came from correctness

Phase 4 asked for large-scale marketplace population and page expansion. The
first measurement made the plan impossible as written: the live backend holds
**1 fabric and 2 suppliers**, against 24 listings and 8 suppliers in fixtures.
Switching to API mode would have _shrunk_ the marketplace. Populating from
anywhere else means inventing suppliers, listings, certifications and prices,
which §2, §31 and §43 of the Phase 4 brief forbid outright.

**Decision: do not fabricate supply.** Page count is a function of supply, and
supply is a sourcing problem, not an engineering one. What engineering can do is
make sure that every page the marketplace _does_ earn actually appears, is
correct, and is discoverable - which is where the phase went instead.

#### Taxonomy expansion proves the point

Eight documented fabric categories from Q7 were added (muslin, lawn, voile,
jute, ramie, acrylic, cupro, acetate), taking the taxonomy from 38 to 46 nodes.
Candidates rose 353 → 369. **Approvals stayed at 7.** Expanding the taxonomy
grows what the site _could_ say and changes nothing about what it has earned.
Supply is the only lever.

#### Two composites completed the matrix

`buyer × fabric` (Tier 6) and `fabric × certification` (Tier 8) were the two
page types the strategy names that had no route. Certification narrows a fabric
page the same way a country does, so it is a trailing qualifier on
`/fabrics/[...path]` rather than a fourth template - the resolver now strips
qualifiers in a loop instead of a fixed sequence, because hard-coding one order
silently 404s the others.

#### What the batch QA harness found

`npm run qa` runs the seven pre-publish checks against the **real** domain
modules - importing them rather than reimplementing them, because a harness that
duplicates the logic it checks proves only that the duplicate agrees with
itself. It immediately failed on a defect that had been invisible:

`keywordRecord` infers a page type and a route from the keyword string. That is
right for research, where a keyword has no page yet, and wrong inside the
generator, where the page already exists and knows its own canonical. Left
inferred, _"single jersey for clothing brands"_ was classified as a fabric
keyword pointing at the fabric page, so eight distinct buyer subjects appeared
to contest one URL and **the gate failed all of them on condition 5**.
Condition-5 refusals went 186 → 0 and approvals 5 → 8 once the opportunity was
made authoritative for its own keyword. Two of those eight had been suppressed
by the false cannibalisation before this phase started.

#### Three defects the crawl found, none of them cosmetic

- **Zero-listing pages were indexable.** `/certifications/reach/`, `/rcs/` and
  `/bluesign/` sat in the sitemap with no supply, because certification pages
  were exempted from the gate as "curated hubs" while `gate.ts` assigned them a
  floor of three listings. Two systems disagreeing about one URL. The exemption's
  reasoning was right - an explanation of GOTS should not vanish because nobody
  uploaded a certificate - but Q21 already answers it: `noindex, follow`. The
  page renders, stays crawlable, and flips itself when supply arrives.
- **The sitemap hand-listed which path families to include.** Intersecting the
  gate's approved set with a hand-written list can only ever _remove_ approved
  pages, and it did - certifications vanished entirely the moment they stopped
  being curated. Every new page type carried the same trap. The gate is now the
  sole authority: a new page type appears in the sitemap with no edit to
  `lib/seo.ts`.
- **`fabric_certification` was gated on a URL its page never claims.** The
  generator built `/fabrics/{family}/{slug}/{cert}/`, but a node's canonical is
  its _ancestry_: jersey's family is `knits` while its URL is
  `/fabrics/cotton/jersey/`. Every such page would have been noindex regardless
  of supply.

#### Aliases are noindex, not merely canonicalised

55 URLs (`/fabrics/knits/pakistan/`, `/fabrics/cotton/cotton/`) returned 200 and
declared themselves indexable while pointing `rel=canonical` elsewhere. A
canonical is a hint a crawler may ignore. Any URL whose resolved canonical is
not itself now says `noindex, follow` outright.

#### Zero-result searches

A search returning nothing is the clearest demand signal a young marketplace
gets. It now offers the nearest fabrics that **actually have listings** - never
routing a buyer from one empty page to another - and falls back to supply order
when the query shares nothing with the taxonomy, rather than inventing a match.
Recording the signal needs a backend endpoint that does not exist; the adapter
defines the contract and does nothing, rather than pretending the data is kept.

#### Corrections to earlier work

Both the buyer × fabric and country × fabric pages labelled `items[0].moq` as
"lowest MOQ", which is only true if the results happen to be sorted by MOQ; and
the fabric template printed `moqRange[0]` as a bare number - "MOQ from 150" does
not say 150 of what. Both now use `lowestMoq()`, which carries the unit.

`/`, `/about/` and every buyer page rendered the brand twice
("... | FabStitch | FabStitch") because `buyerCategorySeo` hardcoded the suffix
the root layout template already appends.

---

### R26 - Phase 5: the switch to real data did not work, and three link systems disagreed

Phase 5 asked for growth, optimisation and marketplace intelligence. The audit
in §1 found that the foundation those systems would sit on had defects large
enough to invalidate them, so the phase went to correctness first (§40 puts
"fix broken foundations" second for exactly this reason).

#### The API mode was never going to work

`repositories/fabrics.ts` did `apiRequest<Page<FabricListing>>(...)` and
returned `response.items` unchanged. That is a **cast, not a conversion**, and
the two shapes share almost nothing: the API nests `specifications.gsm`,
`pricing.moq`, `availability.stock_status`, and spells fields in snake_case.
TypeScript was satisfied because the cast asserted the shape; at runtime every
card in API mode would have rendered no weight, no MOQ, no price and no
applications.

A legacy environment-controlled API switch was documented as one flag. It would have
produced an empty-looking marketplace, and nothing caught it because the
backend holds one fabric and nobody had switched. Two further blockers sat
behind it: `next.config.ts` had no `remotePatterns`, so every supplier image
from Cloudinary would have thrown, and `RequestOptions` had no `cache` field,
so writes had no way to opt out of caching.

`repositories/adapters/fabric.ts` now maps the response field by field, under
two rules: **absent stays absent** (a null GSM is `undefined`, never `0`,
because the gate measures completeness and a defaulted field would publish thin
pages on invented data), and **unknown enum values fall back to the safest
member** (an unrecognised stock status is `out_of_stock`; guessing `in_stock`
advertises inventory nobody has). Verified against the live API.

#### 44 of 52 fabric links pointed at an alias

`relations.ts` built every fabric href as `/fabrics/{family}/{slug}/`. A node's
`family` is a _classification_ (`knits`); its URL is its _ancestry_
(`/fabrics/cotton/jersey/`). The two differ for **44 of 52 nodes**, so nearly
every internal fabric link on the site - from applications, siblings, buyers,
comparison and the A-Z index - pointed at a non-canonical alias. Phase 4 had
just made aliases `noindex`, so the site was routing its own link equity into
pages it had asked search engines to ignore.

This is the third time the same confusion has caused a defect (the
`fabric_certification` gate path, the opportunity generator, now this), so the
fix is a comment at the import in `relations.ts` as well as the six call sites.
Contextual internal edges went 340 → 1,068.

#### The origins panel linked to a filter state

`originsInResults` pointed at `/suppliers/?country_code=PK`. A query string is
a filter state and is never indexable, so the only contextual link into the
country pages was being spent on a URL that can never rank. It now points at
`/suppliers/{country}/`, which is a real page with its own supply.

#### Non-wovens were missing from the taxonomy

Three technical applications (medical textiles, automotive textiles,
filtration) referenced a fabric slug `non-woven` that did not exist. The
strategy names Non-wovens as a construction class alongside Knits and Wovens
and lists its members under Q7; the family and six nodes were simply never
added. Adding them took blocking health issues 3 → 0.

#### What the intelligence layer can and cannot know

§4, §5 and §6 ask pages to be judged on traffic, impressions, CTR and
conversion. **None of that data exists** - no analytics backend, no Search
Console, no traffic history. Scoring pages on invented numbers would produce a
maintenance system that confidently prunes the wrong pages.

So the evaluation is split explicitly. `PageEvidence` is what is measurable
today from catalogue and taxonomy; `TrafficEvidence` is optional on every
function and, when absent, the verdict says `structure_only` in its own output.
`analyseGaps` carries a `DemandBasis` of `structural` on every gap, so nobody
can mistake "five applications need this cloth" for a search volume.

Two structural guarantees: `lifecycle.ts` **cannot return `remove`** - removal
is a human decision about a URL with possible inbound links - and
`analytics/events.ts` defines the full event contract while `track()` validates
and drops, with `EVENT_STATUS` recording which events correspond to
functionality that actually exists.

#### The RFQ was collecting requirements and discarding them

The builder ran four steps and then showed a success screen admitting nothing
was sent, noting the endpoint would be wired "when authentication lands".
Authentication landed in Phase 1. The removed RFQ endpoint required `title`,
`quantity` and `destination_country_code` - all three
already collected. It is now a server action (the access token is an httpOnly
cookie, so a client fetch could not attach it), and a failure keeps four steps
of specification on screen rather than discarding the buyer's work.

#### Smaller corrections

Heading order: listing and supplier cards title themselves with `h3`, so the
outline jumped `h1` → `h3` and a screen-reader user lost the level that says
"these are the listings". Both grids now carry a visually hidden region
heading. Zero heading skips across nine audited pages.

Both admin consoles - page opportunities and the new marketplace health view -
existed and were absent from the admin rail, reachable only by knowing the URL.

#### Internationalisation: not started, deliberately

§20 gates international expansion on the English marketplace having enough
quality and supply. It has 24 fixture listings and one real fabric. Units are
already dual (GSM ↔ oz/yd², cm ↔ inch, price per kg and per metre) and currency
is displayed as the supplier states it, which is the part that matters for a
buyer reading a spec. No locale routing, no translated pages: translating
thousands of pages the gate has already refused to index would multiply the
thin-page problem by the number of languages.

---

### R27 - The URL migration, and one slug function that existed seven times

`docs/IA.md` is now the frontend information architecture: 34 templates, the
URL scheme, both taxonomy axes, the allow-list and the deny-list. Two decisions
were taken against it and are implemented.

**Buyer pages moved `/buyers/*` → `/for/*`.** `/for/hotels/` is the buyer's own
framing; "buyers" reads as _browse buyers_, which is what a supplier wants -
the same reasoning that removed Buyers from the top bar in R5.

**Country pages moved `/suppliers/{country}/*` → `/countries/{country}/*`.**
The old route resolved two entity types from one segment and told them apart by
lookup order, which meant no supplier could ever be slugged `pakistan`, and the
two page types could not carry different gate thresholds - a country page needs
three suppliers to index, a company profile needs one listing. `/countries/`
also gains an index, which it never had: countries were previously reachable
only from the masthead, which is exactly why the health console kept reporting
them as orphans.

Redirects live in `proxy.ts` and read `COUNTRY_SLUGS` from the taxonomy. A
static redirect pattern cannot distinguish `/suppliers/pakistan/` from
`/suppliers/indus-knit-works-fs1042/`, and a hard-coded list would drift the
first time a country was added.

#### The slug function that existed seven times

`name.toLowerCase().replace(/\W+/g, "-")` was written out by hand in the route,
the sitemap, the gate, the opportunity generator, the nav model, the link graph
and the health report. Seven copies is seven chances for the sitemap and the
page to disagree about a country's URL - a defect this project has already
shipped once. There is now one `countrySlug`, one `countryPath` and one
`findCountryBySlug` in the taxonomy, and `COUNTRY_SLUGS` for the redirect.

#### Silk band on the homepage

A continuous-take video of navy silk, placed between the supplier row and "How
FabStitch works". Two decisions worth recording:

The copy is **real HTML beside the video, not burned into it** - selectable,
translatable, responsive, and crisp at any density. The layout is a two-column
grid at `lg` and a stack below it, so text sitting over the cloth is
structurally impossible rather than dependent on where the silk happens to fall
after `object-cover` crops a 16:9 source.

The video runs continuously, as intended - except under
`prefers-reduced-motion`, where it holds on its first frame. That preference is
set deliberately by people who need it, and a 2 MB looping background is
exactly the content it exists for. The composition survives; only the motion
stops.

### R28 - Category photography belongs to the taxonomy node

Nine fabric photographs supplied on 2026-08-29 for the homepage's "Browse
fabrics" cards: cotton, jersey, denim, twill, linen, polyester, canvas, fleece
and poplin. They are **illustrative category photography** on exactly R17's
footing - representative of the material, not of any mill's stock. R9 is
unchanged for listing media, which still shows only what a supplier uploaded.

**Where the image lives, and why it is not in the component.** On the taxonomy
node, as `FabricNode.imageUrl`. Three reasons, in order of weight:

- The removed backend **already had this field**. `FabricNodeResponse.image_url`
  appeared on every taxonomy node (null for all of them at the time).
  Naming ours identically means an API-backed taxonomy is a mapping, not a
  reconciliation between two different concepts.
- The homepage already resolves each card through `getFabric(slug)` to count
  its listings. Reading the photograph from the same node keeps **one** lookup
  and one source. A parallel table in `page.tsx` would be a second thing to
  keep true, and the fabric pages read the node too - a card could then show a
  photograph its own destination disagreed with.
- Presence is data. `CategoryCard` is handed `image` and renders R9's existing
  two-source slot (`FabricMedia`); nodes without one still render the diagram.
  A node gaining or losing a photograph is a data change with no component to
  follow it, and there is no path that yields an empty frame.

**Why the file was not written to the backend.** The old taxonomy endpoints
were read-only, so `image_url` had no write path to
populate. The frontend also never fetches taxonomy over HTTP; `domain/taxonomy/
fabrics.ts` is the authoritative source in this repo. The assets are therefore
served from `public/media/fabrics/<slug>.jpg` alongside the R17 hero, which is
the deployable path. **If the backend later populates `image_url`, that value
should win** - the field name is already aligned for it.

Filenames are normalised to the node slug. The supplied set contained two
byte-identical cotton files (same md5); one asset is stored.

The photographs are square-ish and the card frame is 3:2, so `object-cover`
with centre positioning does the crop - every image in the set is composed
around a centred swirl, so the subject survives it at all three breakpoints.
`sizes` is measured against the rendered card rather than guessed: 395px in the
three-column desktop grid, ~31vw for the same three columns below 1280, ~46vw
for the two-column phone layout.

`alt` is empty on purpose. The card is a link whose text already gives the
fabric name and its listing count; describing the photograph too would make
every card announce itself twice.

### R29 - The backend integration, and the contract that was never ours

Connected on 2026-08-30 against `docs/api/openapi.json` and
`docs/api/BACKEND-API.md`, both published by the backend and both verified
against a live `/openapi.json` probe before anything was written: 129 paths,
152 operations, zero drift.

**The old snapshot was not stale, it was a different API.**
`docs/api/openapi.snapshot.json` held 202 paths. 182 of them no longer exist;
the current backend has 109 the snapshot never had. About twenty overlapped. It
is deleted rather than marked, because a second spec in the same directory is
read eventually no matter what the header says.

Six of the fourteen endpoints the frontend called were gone:

| Called                      | Actual                                           |
| --------------------------- | ------------------------------------------------ |
| `/auth/register/{role}`     | `/auth/signup` → `/users/me/role` → `/buyers me` |
| `/auth/forgot-password`     | `/auth/password-reset/request`                   |
| `/auth/reset-password`      | `/auth/password-reset/confirm`                   |
| `/buyer/profile`            | `/buyers/me`                                     |
| `/buyer/rfqs`               | `/rfqs` then `/rfqs/{id}/submit`                 |
| `/suppliers/{slug}/fabrics` | `/listings?supplier={slug}`                      |

Four findings worth keeping, because each was invisible from the code:

- **The frontend's "fabric listing" is the backend's _listing_.** `/fabrics`
  returns a catalogue entry - a kind of cloth, its image, and how many listings
  sit behind it. `/listings` returns the sellable record with a supplier, an
  MOQ and a price band. `domain/types.ts#FabricListing` has all three, so it
  maps to a listing. Discovery now reads `/listings`, which is also the only
  endpoint returning server-computed facets; the browse cards read `/fabrics`,
  which is exactly what they need and nothing more.
- **Query keys were silently ignored.** `page_size`, `fabric_type`, `use_case`
  and `country_code` are not parameters of this API. Unknown parameters are
  dropped rather than rejected, so every one of those filters appeared to apply
  and changed nothing. They are `limit`, `type`, `application`, `country`.
- **`limit` caps at 100.** Six callers asked for 500 and got a 422 that took
  the whole route down. Clamping alone would have been worse - an SEO gate
  counting the first hundred of a corpus is confidently wrong - so
  `listAllFabrics()` pages, and logs when it hits its ceiling.
- **Refresh tokens are single use and rotate.** Verified: presenting a spent
  one returns `TOKEN_INVALID`. Two concurrent refreshes therefore end every
  session on the account. The client serialises them **keyed by token** rather
  than through one module-level promise as the reference client in §12 does -
  correct in a browser, unsafe on a server where one module instance serves
  every visitor and a shared promise would hand one user's rotated tokens to
  another's render.

Session storage stays as R18 left it: httpOnly cookies, server-only. The
reference client's `localStorage` is explicitly swappable and a token readable
by script is a token an injected script can take.

**What this cost the homepage, and why that is right.** The browse section
showed nine hard-coded fabrics with counts computed in the render - 17 cotton,
4 jersey, 2 denim. It now shows the four fabrics the backend actually has, with
counts of 2, 1, 1 and 1, and says "All 4 fabrics". That is the whole point of
R7: an unimpressive honest number beats a rounded claim. The card component,
the grid and the photographs are untouched.

### R-low-moq-threshold — "Low MOQ" has a comparison, not a number

`BuyerRequirement.low-moq` defines the _shape_ of the condition — `satisfied_by:
moq.value`, `comparison: max` — and deliberately not a value. Nothing in the data
model, the research documents or the taxonomy says where "low" begins.

**Decision: the threshold is editorial, and it lives in the URL, not the model.**
The filter is numeric and general (`moq_max=N` on both `/listings` and
`/suppliers`); navigation picks a value and the page states it as an active
filter. Nothing is hidden behind a word.

The menu uses **200**, which is also the lowest MOQ in the catalogue today (485
published listings run 200–1000 in both kilograms and metres, median 500). So
`moq_max=200` currently means "the lowest tier the marketplace actually offers"
— 89 of 484 listings, 36 of 41 suppliers. It narrows honestly rather than
approximating a band.

Rejected: adding a `moq_band` enum with hard-coded cut-offs. That would have
written a business rule nobody has made into the data model, and it is the exact
shape of invention R7 forbids.

**Known limit, inherited on purpose.** `/listings?moq_max=` compares the MOQ
number without converting kilograms to metres, so the supplier aggregation does
the same. Diverging would make one parameter mean two things. A real fix is a
comparable-quantity model, not a filter change.

### R-deadstock-not-implemented — no trustworthy evidence exists

"Deadstock & surplus" was a supplier-menu destination (`/suppliers/?stock=deadstock`)
that returned the entire unfiltered directory. It has been **removed rather than
repointed**, because the marketplace cannot currently answer it.

What was searched, and found empty:

- No `Listing` field for deadstock, surplus, overstock, clearance, excess or
  discontinued stock. A full text scan of every listing and supplier document
  returns zero matches for all eight terms.
- No `BuyerRequirement` for it. The taxonomy defines twelve; none covers it.
- `SupplierCapability.stock-supply` exists ("holds inventory for immediate
  despatch") but no supplier declares it, and it is not the same commercial
  proposition — holding stock is not selling deadstock.
- `SupplierType.DEADSTOCK_SELLER` **does** exist in the enum and is supplier-
  declared, which is exactly the right kind of evidence. No supplier has chosen
  it.

Explicitly rejected as inference rather than evidence: low stock level, high
available quantity, an old or discontinued fabric, a discounted price, a small
catalogue, a low MOQ. None of these is deadstock, and deriving the status from
any of them would violate "membership is evidence, never inference".

**Restore condition.** `/suppliers/?supplier_type=deadstock_seller` already works
and returns nothing today. The menu entry goes back the day a supplier declares
that type — or sooner, if a listing-level inventory status is added, which would
be the better model because deadstock is a property of a _lot_, not of a company.

### R-a-malformed-key-is-not-found-not-a-crash

**Decided.** `SqlRepository.get` and `one_by` screen lookup keys through
`unusable_key` and return `None` for anything that could never have been
stored - today, a NUL byte.

`%00` in a path segment travelled intact into asyncpg, which refuses a NUL in a
text parameter, which surfaced as a 500 on roughly twenty endpoints. Two things
were wrong: a caller could provoke a stack trace by editing a URL, and the
honest answer to an identifier that cannot exist is that nothing matches it.

Screened at the repository because that is the single door to the database -
the alternative was twenty endpoint-level guards and a twenty-first that
somebody forgets. The screen is deliberately narrow: `../../etc/passwd`, a bare
`""` and an ordinary slug all pass through it untouched and are answered by the
normal lookup.

The unit test pins the screen itself. The end-to-end behaviour is proved
against live Postgres by `scripts/qa/authz-fuzz.mjs`, because the test backend
tolerates a NUL and cannot reproduce the original failure.

### R-path-normalisation-is-not-an-authorization-finding

**Recorded so it is not re-investigated.** `GET /rfqs/.` and
`GET /suppliers/me/listings/..` answer 307 to the normalised path, and a client
that follows redirects lands on the caller's **own** collection with a 200.

That looks like "a mangled id returned 200" and is not: no other tenant's data
is reachable, and the caller only ever sees what they were already entitled to.
`scripts/qa/authz-fuzz.mjs` sends `redirect: "manual"` so the assertion measures
the response to the attack rather than the response to the redirect.

### R-forwarded-address-is-only-believed-from-a-proxy

**Decided.** `client_address` reads `X-Forwarded-For` only when the immediate
TCP peer is in `trusted_proxy_hosts` (loopback by default, because the
server-rendering frontend calls the API from the same host).

It was read from whoever sent it. Only the peer is authenticated by the
connection, so a caller reaching the API directly could put a new value in the
header on every request and mint a fresh rate-limit bucket each time. Measured
before the fix: **forty credential-stuffing attempts across forty accounts,
forty forged addresses, zero refusals.** The per-account budget was never
affected — it keys on the submitted email — and refused a targeted attack
throughout.

### R-revocation-must-reach-access-tokens

**Decided.** Access tokens carry a `sid` claim naming the refresh session they
were issued with, and `User.sessions_revoked_at` records account-wide
revocations. The legacy access-token resolver refused a token whose session was signed
out, or that was issued at or before the watermark.

Access tokens are stateless JWTs, so nothing that happened to a refresh session
reached them: signing out, changing a password, and _replay detection itself_
all left the token they were reacting to answering normally for up to thirty
minutes. Detecting a stolen token did not cut off the thief.

The two mechanisms are deliberately different. A session revoked **with** a
successor is an ordinary rotation and its token stays valid until expiry —
otherwise requests already in flight would start failing mid-navigation. A
session revoked **without** one is a sign-out, and its token dies with it. The
watermark covers what neither can see: a token bound to a session that was
rotated before the account was revoked wholesale.

### R-replay-recovery-is-single-use

**Decided.** Recovering a spent refresh token no longer re-points
`replaced_by_id` at the pair it just minted. Doing so left the spent token
pointing at a fresh unused successor, so it looked recoverable again — and a
thief holding one stolen token could renew the grace window indefinitely.

This only became safe once the rotated pair actually reached the browser; see
below.

### R-session-renewal-happens-in-proxy

**Decided.** When the access cookie has expired and the refresh cookie has not,
`proxy.ts` performs the rotation and sets the new pair on the response.

Next forbids `cookies().set()` during a plain server render, so the refresh
`serverFetch` performed could never hand the rotated pair back. The browser kept
presenting the **same** spent token on every page load, which is
indistinguishable from a replay — and forced a choice between logging real
people out and leaving replay unbounded. Proxy runs before the render and can
write cookies, so the rotation completes and the render sees a fresh access
cookie. Verified: repeated loads with only a refresh cookie now succeed
indefinitely, where the second load previously ended the session.

Failure is never fatal. A 401/403 clears the jar and redirects to sign-in; a
429, a 5xx or a timeout changes nothing and the request proceeds.

### R-return-path-rejects-whitespace-and-controls

**Decided.** `safeReturnPath` refuses any value containing whitespace or a
C0/C7F control character, before and after decoding.

Browsers _remove_ tab, newline and carriage return while parsing a URL, so
`/\t/evil.example` passed a "starts with a single slash" check and then loaded
as `//evil.example` — protocol-relative, and an open redirect on a page the
victim reached by successfully signing in. Forty-four vectors are pinned in
`scripts/qa/redirect-safety.mts`.

### R-reissuing-verification-retires-the-previous-link

**Decided.** `resend_verification` uses the default `retire_previous=True`.

It carried `retire_previous=False` together with signup's comment — "the account
was created on the line above; it cannot have an earlier verification token" —
which is true at signup and false on a resend, the one call where an
outstanding token certainly exists. A forwarded copy of the older email kept
working for its full 24-hour life.

### R-refresh-replay-grace — a client that missed the response is not a thief

**Decided.** `AuthService.refresh` treats a rotated-away token presented again
as a **retry** when its replacement is still unused and the rotation was within
`REFRESH_REPLAY_GRACE_SECONDS` (60). It rotates again and retires the pair
nobody received. Outside that window, or once the replacement has been spent,
the presentation is a replay and every session on the account still ends.

This was the reported "pressed Join/Sign In, unexpected error, dashboard does
not load". Next forbids `cookies().set()` during a plain server render, so
`tryPersist` fails there and the browser keeps the old refresh token while the
server holds the new one. The next request presented the old token, the backend
read it as theft, and revoked every session — including the replacement it had
just issued. Reproduced end to end against the live database; the code comment
claiming the old behaviour was safe was simply wrong.

The security property is preserved by the unused-replacement condition: if the
real client did receive and spend the new pair, an older token surfacing
afterwards is still treated as compromise.

### R-only-a-verdict-ends-a-session

**Decided.** `RefreshResult` distinguishes `rejected` (401/403 — the token is
dead) from `unavailable` (429, 5xx, network — no verdict was reached). Only
`rejected` clears the session cookies. Collapsing both into one falsy value
meant a momentary rate limit signed the user out of a working dashboard.

### R-auth-limits-are-per-account-not-per-socket

**Decided.** The anti-guessing budget is keyed on the **email address** being
acted on, with a much looser per-address backstop (`auth_ip_rate_limit_per_minute`, 120) to catch one source working through many accounts. `/auth/refresh` leaves
the anonymous budget entirely: it presents a 256-bit secret, so guessing is not
the threat, and rotation plus reuse detection is its control.

Before this, every visitor of a server-rendered frontend reached the API from one
socket and shared ten authentication attempts a minute — refresh included. A
46-step E2E tripped it; so would eleven colleagues signing in together.
Measured live afterwards: 25 distinct accounts sign in with no refusal, 30
refreshes with no refusal, and 14 guesses against one account are still refused.

### R-dual-mode — entitlement is a set, the active mode is one of it

**Decided, superseding `R-no-role-switcher`.** One account can both buy and
sell. Two fields carry it:

- **`User.roles`** is _entitlement_: the modes the account may use. Append-only
  through `POST /users/me/roles`, never reduced by self-service.
- **`User.role`** is the _active mode_: which entitlement is in force. Storage
  unchanged; the meaning narrows from "the role" to "the role right now".

`require_role` is untouched and still reads `user.role`, which is the whole
point: **entitlement is not permission.** A dual-mode session working in buying
mode is refused by every supplier endpoint, including the one serving its own
listings, so a stolen session can only act in one context and switching is a
deliberate, server-side act.

The earlier refusal — "a supplier who flipped to buyer would leave listings
owned by an account that is no longer a supplier" — was right about
_replacement_ and does not apply here. Nothing is replaced: `supplier` stays in
`roles`, `supplier_profiles.user_id` never moves, and ownership was never
derived from `role` in the first place. Proved live: a published listing stays
owned and stays public across an enrolment and a switch in both directions.

`PATCH /users/me/role` keeps its old contract exactly, 409 included, so nothing
that onboarded a single-role account changes behaviour.

**Migration: none required.** `entitled_roles` returns `roles` when set and
`[role]` otherwise, so a row written before the field behaves as the single-role
account it is. `enrol_in_role` appends over the _derived_ list, not the stored
one — the version that appends over `roles` silently drops the mode an account
has been trading in, and there is a test that fails when it does.
`scripts/backfill_user_roles.py` writes the stored shape to match the declared
one; it is optional, idempotent, and cannot widen entitlement because it writes
exactly `[role]`.

### R-account-menu-opens-without-javascript

**Decided.** The workspace account menu is a native `<details>`, not a
`useState` toggle. Appearance is unchanged — the `<summary>` carries the classes
the button had.

Sign-out and the mode switch live inside it, and while it was a client
component both were absent from the DOM until JavaScript mounted and set
`open`. A JS failure therefore left an account unable to sign out — on a shared
machine that is the serious one — and a dual-mode account unable to change mode.
The header's Sign in and Join are already real `<a href>`s for exactly this
reason; these are the same class of control. Verified in a real browser: the
menu opens, the switch posts, and the mode change is visible to a clean browser
with no client state.

### R-risk-screen-matches-punctuation — a hyphen must not defeat a rejection

**Decided.** `_risk_hits` matches risk terms against both the token set and the
string with all punctuation removed, for terms of six characters or more.

`_tokens` splits on every non-alphanumeric, so the hyphenated entries in
`RISK_TERMS` — `guest-post` and `crypto-signals` — were dead from the day they
were written, and `guest-post-marketplace.com` scored as an ordinary prospect.
Substring matching is capped at six characters so short terms like `pbn` and
`cbd` stay whole-token: a three-letter substring would fire on innocent domains.
Both directions are tested, with five ordinary trade domains asserting the
screen does not over-fire.

Found while writing a Step 3 test that expected a rejection and did not get one.

### R-campaign-type-mirrors-opportunity-kind

**Decided.** `CampaignType` and `OpportunityKind` are member-for-member identical
and a test enforces it. They stay separate enums because a campaign has a type
and a prospect has a kind, but any drift means a campaign type whose prospects
have no pitch template — a campaign nobody can run. Found exactly that way:
`SUPPLIER_PARTNERSHIP` vs `SUPPLIER_PARTNER`, and two campaign types with no
template. Adding a member to one now means adding it to the other and writing
its template.

---

## OPEN — needs your decision

### R-keyword-locale — a keyword is unique per phrase, language and market

`keywords.normalised` carried a **global** unique index while `Keyword` documented
itself as unique per (language, market). The two disagreed, and the disagreement only
appears on the second market: importing "cotton fabric" for GB after US found the US
row and appended the GB measurement to it, so one keyword held two countries' volumes
and its `market` field named one of them. Inserting a genuine second-market row was not
possible either — the index refused it.

**The uniqueness key is now `locale_key` = `language|market|normalised`**, with `*`
standing in for "no market stated" because SQL unique indexes treat NULLs as distinct.
`ix_keywords_normalised` survives as a plain index. `scripts/migrate_keyword_locale.py`
performs the change: it backfills, refuses to guess if two rows would collide, and is
idempotent.

Eight markets are supported — worldwide, US, GB, IN, PK, TR, AE, BD — and a code outside
that set is **refused at import** rather than filed under "worldwide", because a typo'd
market silently partitions a phrase into a locale nothing else reads.

_This is the one keyword-architecture change `create_schema` cannot make. Its reconciler
is additive by design; dropping a unique index is not additive, so it lives in a script
that is run deliberately and reports exactly what it did._

### R-content-review — copy is published, not merely written

`SeoMetadata.is_populated` meant "somebody typed something". For catalogue copy written
by the project that was close enough. For supplier pages it is not: a supplier profile
is a set of claims about a company, and an unreviewed draft must not put a page into the
index by existing.

Copy now carries a `ContentStatus` — `draft → reviewed → published` — and only
`published` counts for the gate. Publishing straight from draft is refused; the review
step is the only check there is. Publishing an entity with no copy is refused; a title
alone is not content.

**The default is `published`**, so every entity authored before this field existed keeps
its page. Adding a workflow must not demote 132 live pages overnight.

Publishing copy makes a page _eligible_. The gate still counts real listings and real
suppliers, and there is no route from an editor's approval to a crawlable URL that supply
does not support.

### R-supplier-copy-held-at-draft — authored, deliberately unpublished

All 41 supplier profiles with real declared data now carry authored copy, assembled by
`scripts/author_supplier_content.py` from fields each supplier already declared —
country, city, company type, year established, headcount, capabilities, certifications,
export markets, MOQ note — joined to facts computed from that supplier's own published
listings. Nothing is inferred, and "verified" appears only where `verification_status`
is `verified`. Two suppliers were **refused** for having too little declared data, which
is the correct outcome rather than a failure.

**It is held at `draft`.** These supplier records are `is_demo: true` — illustrative
inventory for a marketplace that has not onboarded real mills — and R7 already forbids
fixtures from asserting marketplace facts. Publishing would add 41 supplier pages to the
index (132 → 173) describing companies that do not trade.

Publishing is one command once real suppliers exist:
`scripts/author_supplier_content.py --apply --publish`, or per supplier through
`PATCH /admin/content/supplier/{slug}`.

### R-external-metrics — a competitor number is a dated observation

Authority score, organic traffic, referring domains and backlink counts are not measured
by this codebase and never will be. They are stored as `ExternalObservation` rows
carrying `source` and `observed_at`, the same shape `KeywordMetric` uses, and the
benchmark endpoint reports FabStitch's own column as `null` rather than zero because
nobody has measured it.

The Fibre2Fashion and Fabriclore figures in `scripts/seed_growth.py` are recorded as
`source="owner"`, observed 2026-09-07, method "SEMrush dashboard screenshot supplied by
the project owner". They are not rewritten as live API measurements, because nothing here
queried SEMrush.

A `BacklinkOpportunity` is a note about somebody worth talking to. It is not a link, it
does not create one, and nothing in the codebase renders an anchor because a row exists.

### R-asset-figures-are-computed — a statistic states how it was made

`AuthorityAsset.figures` are computed from live marketplace rows by a named builder, and
`derived_from` records the query that produced them. There is no endpoint that accepts a
figure. `is_citable` is false until an asset has a methodology, a derivation and an
as-of date, because a number without those three is not something another site can
responsibly cite.

The MOQ benchmark reports per unit and never averages kilograms with metres: 300 kg and
300 m are not comparable, and a single "average MOQ" across them would be a fabricated
statistic.

### D1 — The backend in the Trash · **urgent, only you can act**

The running FabStitch API (202 endpoints, FastAPI + Postgres) executes from
`~/.Trash/fabstitch_backend`. It survives only on open file handles and dies on reboot,
logout or Empty Trash. macOS blocks this shell from reading `~/.Trash`, so I cannot copy
it out.

The empty `Desktop/FabStitch/fabstitch backend/` stub (created the same night as the
frontend reset) suggests the backend may have been trashed deliberately as part of a
clean restart.

- **(a) Restore it** — Finder → `~/.Trash` → right-click `fabstitch_backend` → _Put Back_,
  then `git init` and commit. Recommended regardless of intent: restoring costs nothing
  and is irreversible the other way.
- **(b) Confirm it is abandoned** — then the frontend targets a backend that does not yet
  exist, and Phase 1 must run entirely on fixtures. The snapshotted
  `openapi.json` becomes the spec for the rebuild.

Either way the OpenAPI spec should live in this repo so the contract survives
the process.

> **Resolved 2026-08-30.** The backend was not abandoned; it was rebuilt. It
> now publishes `docs/api/openapi.json` and `docs/api/BACKEND-API.md` itself.
> `openapi.snapshot.json` has been deleted — see R29.

### D2 — Where the taxonomy and SEO layers live

The research model needs `buyer_categories`, `applications`, three join tables carrying
`suitability_score` and `recommended_gsm_min/max`, plus `seo_pages`, `keywords` and
`url_history`. None exist in the backend, whose fabric model is a flat 18-value material
enum, a 3-value type enum, a flat category and a flat `use_cases` list.

- **(a) Extend the backend** — correct long-term; the nightly indexability job needs to
  live next to the data anyway. Blocks frontend work until it lands.
- **(b) Frontend-owned versioned taxonomy data** — taxonomy as typed data files in this
  repo, joined to backend listings by material/category/use-case. Unblocks Phase 1 now,
  but the taxonomy has to migrate later.
- **(c) Hybrid (recommended)** — taxonomy ships as versioned data in the frontend for
  Phase 0/1 behind a single `taxonomy/` module boundary, with the explicit intent to move
  it server-side in Phase 2. The SEO layer (`seo_pages`, the gate, sitemaps) is
  backend-only from the start, because it must recompute nightly without a deploy.

### D3 — Rendering and caching model · _deferred, not decided_

**Status after the foundation milestone: still open, deliberately.** The foundation
fetches nothing, so `cacheComponents` would have no route to prove itself on and would
only add a model the team has not met yet. Recommendation unchanged — adopt
`cacheComponents: true` when the **first real data fetch lands** (the fabric results
page), so it is learned against a concrete case where the 6.5 s backend makes its value
obvious. Nothing in the foundation blocks it: no route reads `cookies()`/`headers()`,
and every data-shaped component already takes its data as props.

### D3b — Rendering and caching model (original framing)

Next.js 16 offers `cacheComponents: true` (Cache Components / PPR, `use cache` +
`cacheLife`) or the previous model. Against a backend at 4–6 s per request and an
eventual tens-of-thousands-of-pages footprint, this is the highest-leverage
infrastructure choice in the project.

- **(a) `cacheComponents: true` (recommended)** — every route ships a static shell,
  slow API reads sit behind `<Suspense>` or `use cache`, ISR fills concrete pages after
  first visit. Directly solves the slow-backend problem and matches the SEO shape. Cost:
  the whole team must learn the model, and it surfaces build errors for uncached data
  outside `<Suspense>`.
- **(b) Previous caching model** — familiar, less strict, but leaves the slow backend on
  the critical path for first paint.

Related and cheap: cap build concurrency so `next build` cannot overwhelm the single
uvicorn worker.

### D4 — Design direction

Four installed aesthetic skills contradict each other by design, and the one meant as
the default (`design-taste-frontend`) explicitly excludes dashboards, data tables and
multi-step product UI — which is most of FabStitch.

- **(a) Two-register system (recommended)** — one design language, two densities.
  _Discovery/hub/marketing_ surfaces get editorial restraint; _sourcing_ surfaces
  (results, spec sheets, comparison, RFQ, dashboards) get high-density industrial
  precision. Same tokens, same components, different density scale. Nearest skill
  reference: `industrial-brutalist-ui` de-escalated (rigid grid, monospace for telemetry
  and specs, no CRT/scanline theatrics), with `minimalist-ui` informing the editorial
  register.
- **(b) Pick one installed skill and commit to it wholesale.**
- **(c) Commission a FabStitch identity first** (`brandkit` is an image-generation skill
  and could produce the board), then derive the system from it.

I need your call on this before I build tokens, because it determines the typeface
strategy, the density scale and the whole component inventory.

### D5 — Trailing slash

The research document mandates trailing slashes consistently, with a 301 from the
non-slash form. Next.js defaults to **no** trailing slash. Setting
`trailingSlash: true` is a one-line config change now and a site-wide migration later.

- **(a) `trailingSlash: true`** — matches every URL example in the research documents.
- **(b) No trailing slash** — Next.js default, equally valid for SEO, but then every URL
  in `docs/ARCHITECTURE.md` needs rewriting so the documents and the code agree.

### D6 — Market and currency

The removed backend had a multi-market system the research documents never mention,
with PK/TR/BD and more, each
carrying a currency code and symbol, currently `market_enabled: false`. This interacts
with the country-page strategy and with price display on every listing card.

Needs a call on whether market selection is a Phase 1 concern or deferred — and if
Phase 1, whether it is geo-detected, user-selected, or both.

### D7 — Repository layout

Frontend and backend are currently two sibling directories with separate git repos (one
of which has no commits). The taxonomy and generated API types want to be shared.

- **(a) Keep separate repos** — simplest; share types by generating from the live
  OpenAPI into the frontend.
- **(b) Monorepo** — better for a shared taxonomy package, but a migration cost now.

### R30 - Media is classified by what the asset is, not by where it hangs

Found by probing rather than reading: `GET /suppliers/{slug}` was publishing
every certificate and document a supplier had ever uploaded, to anyone, with no
authentication. Reproduced by planting a marked certificate and reading it back
from an anonymous request. `GET /listings/{id}/media` did the same on published
listings.

**The mechanism is worth recording because it will recur.** `response_model`
governs the `data` block, and `PublicSupplierResponse` correctly strips address,
email and phone - the route's own description says so and is right about them.
But `meta` is a free-form dict handed to `envelope(...)`, and nothing validates
it. Every schema guarantee stops at `data`. Any private field routed through
`meta` is published, and no response model will ever catch it.

The rule now lives in `app/domain/catalogue.py`:

| Type                       | Visibility           |
| -------------------------- | -------------------- |
| `image`, `video`, `swatch` | `PUBLIC`             |
| `certificate`, `document`  | `PRIVATE_OWNER_ONLY` |
| anything added later       | `PRIVATE_OWNER_ONLY` |

Derived from the type rather than stored per row, for two reasons: a stored flag
can be set wrongly once and stay wrong, and a rule applies retroactively to
records that predate it - which these all did.

**Certificates are private even though certification is public.** The claim is
already on the storefront through `certification_slugs` and `is_verified`. The
scan behind it is a different object: letterhead, registered address, signature,
licence number. Publishing the claim is the product; publishing the evidence is
a leak. A supplier who wants the scan public is a product decision that has not
been made, and the safe default until it is made is private.

**The UI had already promised this; the API was contradicting it.** The
listing page carries a DOCUMENTS panel reading "Technical data sheet,
certificates and test reports are released with the quote", and the supplier
storefront one reading "Business registration, certificates with numbers and
expiry dates, and test reports are released to verified buyers on enquiry."
Both were true of the interface and false of the API, which served the same
documents to anonymous callers. The classification is not a new policy - it is
the API being made to keep a promise the product was already making.

**`is_logo` deliberately does not affect visibility.** It is client-settable, and
anything a client can set must not widen access - otherwise
`{"media_type": "certificate", "is_logo": true}` is a one-field opt-out of the
whole table. A logo is an image; images are already public.

Unknown types fall private so a type added later has to be classified
deliberately rather than published by omission - `test_every_media_type_is_classified_deliberately`
fails the build if `MediaType` grows without a decision.

**What this does not cover.** No storage provider is configured, so there is no
bucket policy, no signed URL and no expiry to verify. The API refuses to hand
out private locations; whether the objects themselves are protected is untested
and remains an external dependency. See the report's separation of CODE SECURITY
from PRODUCTION STORAGE CONFIGURATION.

### R31 - The active buyer experience is fabric-first

The approved public navigation is **Fabrics · Collections · How It Works ·
About**, with Search and account actions on the right. The buyer journey is
FabStitch-owned and product-led: landing → marketplace → fabric → application
fit → quantity → purchase or request.

Supplier records, capabilities and commercial relationships remain available to
the backend and the supplier/admin workspaces, but the active buyer interface
does not expose supplier names, profiles, logos, IDs, ratings, URLs or
directories. This supersedes the older three-door public navigation in R5; it
does not delete supplier data or weaken supplier-side workflows.

Certification records likewise remain intact for internal verification and
compliance, but certificates and certification facets are no longer a
buyer-facing discovery surface. Public navigation, result filters, cards,
related-link panels, help content and sitemaps must not promote them. This
supersedes the public certification-hub portion of R1/R5 while preserving R30:
certificate evidence remains private regardless of what the buyer UI exposes.

Filter states stay as non-indexable query parameters. Collection and Best For
links use the existing material/application taxonomy, never UI-authored
associations.

### R32 - One customer account, with backend roles kept internal

The customer-facing product has one account model and one authenticated home:
`/marketplace/`. Buyer/supplier role selection, mode switching, workspaces and
verification are not customer navigation or onboarding concepts. Existing
role-scoped backend records and internal workspace routes remain intact because
this decision is a frontend product boundary, not a database migration.

The current backend still requires a role before it will create and expose a
customer profile. Until a role-neutral profile contract exists, new customer
signup assigns the backend `buyer` role silently as an implementation detail.
The role is never presented as a customer choice or identity. Existing
supplier/admin accounts are not rewritten.

One-time personalization is persisted on the existing buyer profile:
`buyer_category_slug`, `industry`, `application_slugs` and a versioned payload
inside `sourcing_requirements`. That version marker is the frontend's
authoritative completion state until the backend exposes a dedicated
`onboarding_completed` field. No local browser store is authoritative.

OAuth controls reflect `GET /auth/oauth/providers`. A provider without a real
authorize URL stays unavailable; the frontend does not simulate OAuth or a
callback contract the backend does not publish.

### R33 - The 2027 reference is the interim customer catalogue

Until the backend phase imports the approved product collection, the
customer-facing marketplace reads a typed frontend catalogue derived from
`fabrics-2027.md`. This catalogue is product content, not live inventory and
does not reuse the fictional supplier/listing fixtures. `catalog` is the
default frontend data source. The later R35 records why the customer product
facade no longer follows the legacy `api` or `fixture` switch until backend
identities have been explicitly reconciled.

The reference defines material direction, composition, weight, construction,
finish, season and applications unevenly. Missing fields remain missing.
Specifically, the frontend does not infer MOQ, price, width, origin,
availability, certification, supplier, lead time or sample policy. Quantity
and Buy Now remain visibly unavailable on a catalogue product until an actual
backend commercial record supplies those values and a sellable identifier.

Search, filtering and pagination run on the server-side repository boundary,
even while its source is the local catalogue. The UI therefore does not create
a second client-side search architecture: a later approved backend import can
replace the repository implementation rather than the page contract.

### R34 - Storefront SEO follows products, collections and customer uses

The canonical public architecture is now one storefront:

`/` → `/fabrics/` or `/marketplace/` → `/collections/{slug}/` or
`/fabrics/best-for/{slug}/` → `/fabrics/{slug}/`.

`/marketplace/` is the searchable catalog. Its clean root is indexable; every
query, filter, sort and pagination state is `noindex, follow` and canonicalizes
to `/marketplace/`. Durable search intent is promoted only through a written
collection or Best For page with real catalog depth. `/fabrics/{slug}/` is the
only product canonical; the former `/marketplace/fabrics/{slug}/` permanently
redirects.

`domain/seo/storefront-registry.ts` is the frontend authority for public SEO
inventory, metadata ownership, content source, search intent, indexability and
internal relationships. The sitemap is a projection of its indexable records,
not a backend page-opportunity sweep. This supersedes the supplier/listing,
buyer, country, certification and RFQ page families in the former public SEO
topology. Their data and internal/admin implementations are not deleted, but
their public routes are either private/noindex or permanently redirected to the
final customer storefront without a chain.

Generated pages face a frontend quality gate grounded in the approved 2027
catalog: collections and Best For pages need at least three matching products
and original explanatory content; guides need at least three substantive
sections and 300 computed words. Country, currency, supplier, certificate and
unsupported use-case pages are not created merely because the old taxonomy or a
keyword can express them. Forecast content uses directional language and all
unknown commercial, technical, author and date fields remain absent.

### R35 - The approved 2027 identities are a customer presentation boundary

The source-backed catalog in `catalog/fabrics-2027.ts` is the complete
customer-facing product allowlist until a later recorded reconciliation
replaces it. A backend, fixture or route record whose canonical slug is absent
from that allowlist is not a FabStitch customer product. Semantic similarity is
not enough: an API record does not inherit approval from a differently named
frontend product.

The customer catalog facade therefore reads the approved frontend collection
in every environment, including when legacy repositories are configured for
API or fixture data. This fails closed against the current unreconciled backend
and makes marketplace search, filters, collections, Best For, home curation,
related products and product routes projections of one product set. API and
fixture modes remain available to internal and legacy repository tests; they
cannot substitute records into the public product layer and are never an error
fallback.

Backend migration requires a separate catalog-import decision and an explicit
identity reconciliation. It must preserve the same allowlist guarantee before
the customer facade is switched to API records. Missing API data produces an
honest unavailable or empty state, never demo products.

### R36 - Distinct hide materials in the source are separate catalog identities

The Part 2 §2.2 source bullet “Real suede and leather — plus opulent calf-hair
finishes” names three materially distinct customer selections. They are
represented separately as Real Suede, Real Leather and Calf-Hair Finish rather
than silently merged into one product. Their source does not provide weight,
construction or application specifications, so those fields remain absent.

Narrative-only mentions of delicate lace, beeswax-treated fabrics and generic
elastane/Roica suiting are sourcing context rather than approved catalog
identities. They remain outside the customer allowlist until product-grade
specifications or a later explicit catalog decision exists.

### R37 - Direct-order UI is a fail-closed frontend draft until the API changes

The approved customer flow may collect a selected fabric, quantity, email,
phone and structured order-specific shipping address in a compact modal. The
frontend model keeps address lines, city, region, postal code and country
separate and carries nullable backend-owned fields for order ID, customer ID,
amount, order status, payment status and creation time.

This model is not the current `POST /orders` request. The live API creates an
order only from an accepted `quote_id`, does not accept email or phone, flattens
the shipping address and has no payment contract. Until a later backend
decision supplies a compatible endpoint, the submission adapter performs no
network request, returns an unavailable result and keeps the modal values
intact. It must not create a local order, send order email, redirect to a fake
checkout, synthesize an order/payment status or claim success.

The order quantity unit and minimum come only from commercial product data.
Where they are absent, the frontend keeps the unit `null` and labels it pending
instead of defaulting to metres, kilograms or another unit. Country, dialing
code and address labels are projections of the seven approved customer markets.

---

## Deferred until data exists

Country page rollout · certification hubs · the buyer × fabric matrix · the keyword
database build-out · programmatic page generation beyond Phase 1 hubs. All of these are
gated on supplier onboarding and real demand signal, per `docs/ARCHITECTURE.md` §6.
