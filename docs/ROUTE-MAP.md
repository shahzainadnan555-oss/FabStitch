# FabStitch — route map, page inventory and shell plan

The frontend is **templates × data**, never a page per URL. Thirteen templates
carry the entire public marketplace; the ~40,000-page ceiling in
`docs/ARCHITECTURE.md` is reached by feeding those templates more rows, gated by
the seven-condition indexability check — never by adding components.

Current runtime note: all retained routes render from local frontend data or
honest empty preview models. There is no session guard or API read. Legacy
public URL families may redirect to the active customer catalogue; buyer,
supplier and admin route groups remain noindex frontend previews.

---

## 1. Route groups

Next.js route groups separate the three shells without adding URL segments.

```
app/
  (marketplace)/     public. SiteHeader + SiteFooter. Indexable.
  (auth)/            sign-in, sign-up, verify, reset. Minimal centred shell.
  (buyer)/           /buyer/*    WorkspaceShell, buyer nav.    noindex.
  (supplier)/        /supplier/* WorkspaceShell, supplier nav. noindex.
  (admin)/           /admin/*    WorkspaceShell, admin nav.    noindex.
```

Three shells only:

| Shell              | Used by                  | Chrome                                                              |
| ------------------ | ------------------------ | ------------------------------------------------------------------- |
| `MarketplaceShell` | `(marketplace)`          | sticky header with 3 doors + search + RFQ, footer category map      |
| `AuthShell`        | `(auth)`                 | wordmark, single column, no nav — nothing to distract from the task |
| `WorkspaceShell`   | buyer / supplier / admin | collapsible left rail, context switcher, workspace topbar           |

`WorkspaceShell` is **one component** parameterised by a nav model, exactly as
`SiteHeader` already is. Buyer, supplier and admin differ by data, not code.

---

## 2. Public route inventory

| Route                                         | Template          | Data                             | Notes                                                                                                                            |
| --------------------------------------------- | ----------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                           | Home              | taxonomy                         | marketplace entrance                                                                                                             |
| `/fabrics/`                                   | FabricHub         | fabric families + tags           | complete children, densest linking page                                                                                          |
| `/fabrics/[...path]/`                         | FabricCategory    | fabric node                      | catch-all covers `/cotton/`, `/cotton/jersey/`, `/cotton/jersey/180-gsm/`, `/…/pakistan/` — **one template, four page families** |
| `/applications/`                              | ApplicationHub    | 10 groups                        |                                                                                                                                  |
| `/applications/[slug]/`                       | ApplicationPage   | application + application_fabric | "I make this — what fabric?"                                                                                                     |
| `/buyers/`                                    | BuyerHub          | 12 categories                    |                                                                                                                                  |
| `/buyers/[slug]/`                             | BuyerPage         | buyer + joins                    | subcategories sit flat                                                                                                           |
| `/suppliers/`                                 | SupplierDirectory | suppliers + facets               |                                                                                                                                  |
| `/suppliers/[slug]/`                          | SupplierProfile   | supplier                         | slug carries a stable id suffix                                                                                                  |
| `/listings/[slug]/`                           | ListingPage       | listing                          | the only transactable record                                                                                                     |
| `/search/`                                    | SearchResults     | parsed intent → filters          | chips are removable here                                                                                                         |
| `/compare/`                                   | Compare           | selected ids                     | fabrics and suppliers                                                                                                            |
| `/certifications/`, `/certifications/[slug]/` | CertificationHub  | certifications                   |                                                                                                                                  |
| `/rfq/`                                       | RfqBuilder        | —                                | stepped, progressive                                                                                                             |
| `/guides/`, `/guides/[slug]/`                 | Guide             | editorial                        |                                                                                                                                  |
| `/about/`, `/verification/`                   | Static            | —                                | trust surfaces                                                                                                                   |

**Deferred but planned** (same templates, different data — no new components):
`/fabric-for/[application]/`, `/materials/[material]/`, `/industries/[industry]/`,
`/performance/[property]/`, `/certified/[cert]/[material]/`,
`/suppliers/[country]/[capability]/`.

The catch-all at `/fabrics/[...path]/` is the load-bearing decision: fabric,
fabric×construction, fabric×GSM and fabric×country are **one template resolving a
path against the taxonomy**, which is what makes the SEO ceiling reachable
without new code.

---

## 3. Workspace route inventory

### Buyer — `/buyer/*`

`dashboard` · `rfqs` (+`[id]`, `new`) · `quotes` (+`[id]`) · `samples` (+`[id]`) ·
`orders` (+`[id]`) · `boards` (+`[id]`) · `saved` · `messages` (+`[id]`) ·
`company` · `team` · `settings`

Dashboard leads with **current sourcing work** — active RFQs, quotes awaiting
response, samples in transit — not a grid of equal-weight cards.

### Supplier — `/supplier/*`

`dashboard` · `listings` (+`[id]`, `new`) · `rfqs` (+`[id]`) · `quotes` ·
`samples` · `orders` (+`[id]`) · `messages` · `company` · `certifications` ·
`analytics` · `team` · `settings`

`listings/new` is a **stepped flow**, not one form: basics → composition →
construction → specifications → appearance & finish → performance →
certifications → commercial terms → applications → media → preview → publish.

### Admin — `/admin/*`

`dashboard` · `suppliers` · `verifications` · `listings` · `taxonomy` · `rfqs` ·
`orders` · `disputes` · `reviews` · `seo` · `users`

Admin is IA and reusable patterns at this stage, not deep feature work.

---

## 4. Shared component plan

Built once, used everywhere. Pages become thin compositions.

| Component                      | Purpose                                                      |
| ------------------------------ | ------------------------------------------------------------ |
| `Breadcrumbs`                  | position + `BreadcrumbList` schema. Answers "where am I?"    |
| `PageHeader`                   | eyebrow, h1, intro, primary action. Answers "what can I do?" |
| `FacetPanel`                   | tier-1 open, tier-2 collapsed, tier-3 technical panel        |
| `ActiveFilters`                | removable chips, shared by `/search` and every category page |
| `ResultsToolbar`               | count, sort, view toggle, filter trigger (drawer on mobile)  |
| `ListingGrid` / `ListingRow`   | card and dense row forms of one record                       |
| `CompareTray`                  | persistent selection bar; feeds `/compare`                   |
| `CompareTable`                 | attribute rows × entity columns, difference highlighting     |
| `SpecSheet`                    | the fixed-order specification block                          |
| `StatusPill` + `WorkflowTrail` | the shared state vocabulary (§30)                            |
| `Stepper`                      | RFQ builder and listing creation                             |
| `WorkspaceShell`               | rail + topbar, parameterised by nav model                    |
| `DataTable`                    | workspace lists — sortable, empty/loading/error states       |
| `MetricRow`                    | workspace summary figures, from data only                    |

---

## 5. Data layer

```
lib/api/
  client.ts       fetch wrapper: base URL, auth header, timeout, typed errors
  types.ts        re-exports domain types; API shapes mirror the OpenAPI
repositories/
  fabrics.ts      listFabrics, getFabric, compareFabrics
  customer-catalog.ts    local search, filters, facets and detail
  buyer-workspace.ts     honest empty preview records
  supplier-workspace.ts  honest empty preview records
```

The customer catalogue repository reads only approved local data. There is no
runtime data-source switch or API fallback. Query parameters are interpreted
locally before pagination.

---

## 6. Honesty rules for fixtures

Governed by R7 and §39 of the brief.

- Fixture records render with an **Illustrative** badge, always.
- Every results surface backed by fixtures states it in the header.
- Supplier names are constructed and non-referential; no real company is named.
- **No** invented aggregate statistics, review counts, response rates, GMV or
  "trusted by" logos anywhere.
- Certification entries describe what the standard covers, never that a specific
  supplier holds it.

---

## 7. Build order — status

| #   | Stage                     | Status                                                             |
| --- | ------------------------- | ------------------------------------------------------------------ |
| 1   | Route map (this document) | done                                                               |
| 2   | Data layer + fixtures     | done — `repositories/`, `lib/api/`, `fixtures/catalogue.ts`        |
| 3   | Shared components         | done                                                               |
| 4   | Public marketplace        | done — all routes in §2 except `/guides/[slug]`                    |
| 5   | Auth                      | done — sign-in, sign-up (role-first), reset. Not wired to the API. |
| 6   | Buyer workspace           | done — shell + 9 routes, honest empty states                       |
| 7   | Supplier workspace        | done — shell + 7 routes, 12-stage listing field model              |
| 8   | Admin shell               | done — IA and patterns only, as planned                            |
| 9   | Verification sweep        | done — 42 routes × 3 viewports, all clean                          |

**174 pages prerendered** at build time. Dynamic only where the URL carries
buyer state: `/search`, `/compare`, `/suppliers`, `/rfq`, `/fabrics/[...path]`.

### Not built, deliberately

- Guide detail pages. The research forbids bulk-generated editorial; each one
  gets written by someone who knows the answer.
- The `/fabric-for/`, `/materials/`, `/industries/`, `/performance/` families.
  They need no new components — same templates, different resolver entries —
  and publishing them before there is supply behind them would breach the
  indexability gate.
- Populated workspace queues. A signed-out preview genuinely has no RFQs, and
  inventing some would fabricate marketplace activity (R7).
- Payments. Frontend state model exists (`components/marketplace/status.tsx`);
  no payment logic.

---

## 8. The two journeys this must serve

**"I manufacture 5,000 T-shirts."**
`/` → T-shirts tile → `/applications/t-shirts/` (recommended fabrics + GSM band)
→ `/fabrics/cotton/jersey/180-gsm/` → filter → compare → sample or RFQ.

**"I need 180 GSM cotton jersey."**
`/` → search → `/search/?material=cotton-jersey&gsm_min=180…` with removable
chips → listing → supplier → sample or RFQ.

Both must work without explanation. They are the acceptance test.
