# FabStitch API Documentation

## Base URL

- Production: `https://fabstitch-backend.fastapicloud.dev`
- Versioned API prefix: `/api/v1`
- Frontend production API base: `https://fabstitch-backend.fastapicloud.dev/api/v1`

## Authentication model

Server-side sessions with:

- HttpOnly session cookie (`fabstitch_session`) — idle TTL (default 7 days), renewed on activity
- HttpOnly refresh cookie (`fabstitch_refresh`) — rotated on refresh; replay revokes user sessions
- Absolute session cap (default 30 days)

### Email / password

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/v1/auth/signup` | Creates customer (`onboarding_completed=false`), sets session |
| POST | `/api/v1/auth/login` | Generic errors; lockout after repeated failures |
| POST | `/api/v1/auth/logout` | Revokes session |
| POST | `/api/v1/auth/session/refresh` | Refresh-token rotation |
| POST | `/api/v1/auth/password/forgot` | Creates reset token; delivery via EmailDeliveryPort (not configured until Resend) |
| POST | `/api/v1/auth/password/reset` | Consumes token, rotates password, revokes sessions |

### Google OAuth

| Method | Path |
|--------|------|
| GET | `/api/v1/auth/oauth/providers` |
| GET | `/api/v1/auth/google` |
| GET | `/api/v1/auth/google/callback` |

Verified Google emails can link to an existing FabStitch account with the same email (email provider identity or already-verified email). Unverified Google emails never create or link accounts.

### Session / identity

| Method | Path |
|--------|------|
| GET | `/api/v1/auth/me` |
| GET | `/api/v1/account/profile` |
| PATCH | `/api/v1/account/profile` |

Guards: optional user, authenticated customer (`CurrentUserDep`), admin (`CurrentAdminDep`).

## Error format

```json
{
  "error": {
    "code": "validation_error",
    "message": "Request validation failed",
    "details": [],
    "request_id": "uuid"
  }
}
```

## Country / currency (Prompt #10)

Supported countries: **US, GB, TR, PK, IN, BD, SG**  
Supported currencies: **USD, GBP, TRY, PKR, INR, BDT, SGD**  
Defaults: US→USD, GB→GBP, TR→TRY, PK→PKR, IN→INR, BD→BDT, SG→SGD

Centralized in `fabstitch.common.geo` + DB reference tables (`countries`, `currencies`). **No exchange rates** — preferences are display/transaction-context only.

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/countries` | Active countries (`Cache-Control: public, max-age=3600`) |
| GET | `/api/v1/countries/{code}` | Single active country |
| GET | `/api/v1/currencies` | Active currencies (cacheable) |
| GET | `/api/v1/me/preferences` | Country, currency, onboarding flags (auth) |
| PUT | `/api/v1/me/preferences` | Update country and/or currency |
| PUT | `/api/v1/me/preferences/country` | Country preference; optional `apply_currency_default` |
| PUT | `/api/v1/me/preferences/currency` | Currency preference |

**Currency when country changes:** explicit currency in the same request wins; `apply_currency_default=true` forces the default map; otherwise the default applies only when the customer has no saved currency yet (does not silently overwrite a deliberate currency).

Order `currency` is snapshotted at create and does not change when preferences change. Migration: `008_country_currency`.

## Personalization / discovery

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/me/recommendations` | Ranked fabrics; guests OK |
| GET | `/api/v1/fabrics/recommended` | Alias |
| GET | `/api/v1/me/discovery` | Homepage sections |

Query params: `limit`, `offset`, `q`, `sort` (`relevance`\|`newest`\|`popular`\|`name`), `fabric_family`, `use_case`, `work_area`.

Personalization boosts ranking from onboarding preferences. Explicit search/filters/sorts remain authoritative. Do not pass `user_id` — session identity only.

Until Prompt #5, `PERSONALIZATION_CATALOG_ADAPTER=seed` serves an in-memory attribute-tagged catalog for ranking.

## Catalog (Prompts #5–#7)

Authoritative fabric catalog — public **read-only** discovery APIs. Mutations forbidden.

### Discovery endpoints

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/fabrics` | Cards: search `q`, multi-value filters, sort, cursor pagination (`limit`≤48) |
| GET | `/api/v1/fabrics/search` | Same engine as `/fabrics` with `q` (canonical search path) |
| GET | `/api/v1/fabrics/filters` | Filter metadata + contextual facet counts |
| GET | `/api/v1/fabrics/{slug}` | Detail projection |
| GET | `/api/v1/fabrics/{slug}/related` | Editorial / family / shared Best For |
| GET | `/api/v1/collections` | Published collections |
| GET | `/api/v1/collections/{slug}` | Collection + paginated fabrics (default `sort=editorial`) |
| GET | `/api/v1/best-for` | Best For taxonomy |
| GET | `/api/v1/best-for/{slug}` | Best For + paginated fabrics (default `sort=editorial`) |

### Filter semantics

- **Within a dimension** (e.g. `fiber=cotton&fiber=linen`): **OR**
- **Across dimensions** (fiber AND `best_for` AND season): **AND**
- `fiber` = contains material (**blends allowed**)
- `fiber_pure` = ~100% single fiber (`percentage >= 99.5`, no other fibers)
- Ranges: `weight_min`/`weight_max` (gsm), `width_min`/`width_max` (cm)
- Multi-value via repeated params or comma-separated values

### Sort

`relevance` (default when `q` set) · `featured` (default otherwise) · `popular` · `newest` · `name` / `name_asc` · `name_desc` · `editorial` (collection/Best For membership order)

**Price sorts are not exposed** (no authoritative price data).

**Precedence:** explicit search → filters → user sort → personalization (soft boost only on featured/editorial/popular) → defaults. Explicit `name`/`newest` never overridden by personalization.

### Pagination

Opaque `cursor` + `limit` (max 48). Optional `page`/`page_size` for admin/compat (returns `total`).

Seed: `uv run python scripts/seed_catalog.py`. Scale migration: `005_catalog_scale`.

## Orders (Prompt #8–#9)

Authenticated customer purchase + order-management / fulfillment foundation. **Not** RFQ. **Not** Stripe — `payment_status` stays `unpaid` on Place Order.

### Customer endpoints

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/v1/orders` | Create order (single item or `items[]`); optional `Idempotency-Key` |
| GET | `/api/v1/orders` | Paginated own orders (`limit`/`offset`) — summary projection |
| GET | `/api/v1/orders/{order_number}` | Own order detail + timeline/tracking (customer-safe) |
| POST | `/api/v1/orders/{order_number}/cancel` | Cancel when status is `draft` or `pending` |

### Admin lifecycle APIs (backend only — not Admin UI)

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/admin/orders/{order_number}` | Admin order detail |
| POST | `/api/v1/admin/orders/{order_number}/transition` | Controlled order status transition |
| POST | `/api/v1/admin/orders/{order_number}/fulfillment` | Controlled fulfillment transition |
| PUT | `/api/v1/admin/orders/{order_number}/tracking` | Real tracking fields only |
| POST | `/api/v1/admin/orders/{order_number}/notes` | `customer` or `internal` notes |

### Create body

Preferred multi-item:

```json
{
  "items": [
    {"listing_id": "...", "quantity": "20", "quantity_unit": "meters"},
    {"listing_id": "...", "quantity": "50", "quantity_unit": "meters"}
  ],
  "currency": "USD",
  "shipping_address": { "...": "..." },
  "customer_note": "optional"
}
```

Legacy single-item fields (`listing_id` / `fabric_slug` + `quantity` + `quantity_unit`) still accepted.

Server derives: authenticated `user_id`, order number, fabric snapshots, timestamps, `status=pending`, `fulfillment_status=unfulfilled`, `payment_status=unpaid`. Rejects client status/payment/prices (`extra=forbid`). Shipping/tax/duty amounts stay `null` until authoritative systems exist.

### Lifecycles

**Order status:** `draft → pending → confirmed → processing → ready_to_ship → shipped → delivered` (+ `cancelled` / `failed`). Customer cancel only from `draft`/`pending`.

**Fulfillment status (separate):** `unfulfilled → allocated → processing → ready_to_ship → shipped → delivered` (+ `exception` / `cancelled`).

**Payment status (separate):** unchanged by Place Order; future Prompt #11 only marks `paid`.

### Shipping

Order-owned immutable address snapshot (US/GB/TR/PK/IN/BD/SG). Optional `shipping_methods` catalog — do not invent carriers/costs. Tracking table populated only via authorized admin APIs.

### Errors (examples)

`fabric_not_found` · `fabric_unavailable` · `invalid_quantity` · `invalid_unit` · `invalid_address` · `unsupported_country` · `unsupported_currency` · `invalid_shipping_method` · `order_not_found` · `order_cannot_be_cancelled` · `invalid_status_transition` · `invalid_fulfillment_transition` · `duplicate_request` · `unauthorized` · `admin_required`

## Payments (Prompt #11)

Stripe PaymentIntents + verified webhooks. **Never** trust the frontend to set `payment_status=paid`.

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/v1/orders/{orderNumber}/payment` | Create/reuse PaymentIntent; returns `client_secret` |
| POST | `/api/v1/webhooks/stripe` | Raw-body webhook; `Stripe-Signature` required |
| POST | `/webhooks/stripe` | Same webhook at root |
| POST | `/api/v1/admin/orders/{orderNumber}/refunds` | Admin-only full/partial refund |

Env (names only in `.env.example`): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_USE_FAKE_GATEWAY`, `PAYMENT_UNPAID_ORDER_TTL_HOURS`.

Authoritative amount = order line price snapshots (+ shipping/tax/duty − discount). If catalog `unit_price` is missing → `payment_unavailable` (no PaymentIntent). Success webhook → `payment_status=paid` and order `pending→confirmed`.

### Stripe Checkout Session (hosted Checkout)

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/v1/checkout` | BUY NOW: fabric + quantity + shipping → order + Checkout Session URL |
| POST | `/api/v1/orders/{orderNumber}/checkout` | Checkout for existing unpaid order |

Request must **not** include `unit_price` / `total_amount` (rejected). Server loads published listing price, computes `unit_price × quantity` with Decimal money helpers, creates/reuses order, creates Stripe Checkout Session, returns `{ checkout_url, order_number, amount, … }` only (no secrets).

Initial `payment_status` stays `pending`. Only verified Stripe webhooks (`checkout.session.completed` / `payment_intent.succeeded`) set `paid` and confirm the order.

Success/cancel URLs use `APP_URL` + `STRIPE_CHECKOUT_SUCCESS_PATH` / `STRIPE_CHECKOUT_CANCEL_PATH` (keep `{CHECKOUT_SESSION_ID}` for Stripe). Frontend success page must re-query order/payment state — redirect alone is not proof of payment.

Migration: `013_stripe_checkout`.

## Suppliers / FabStitch Verified (Prompt #12)

Private supply-partner system. Customers never see supplier marketplace, IDs, contacts, documents, notes, or scores. Catalog may expose only `fabstitch_verified: true|false`.

**FabStitch Verified ≠ third-party certification.**

### Admin APIs (admin role required)

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/admin/suppliers` | Paginated list; filter `status`, `verification_status`, `country_code`, `q` |
| POST | `/api/v1/admin/suppliers` | Create prospect (unverified) |
| GET | `/api/v1/admin/suppliers/{id}` | Detail + private contacts |
| PATCH | `/api/v1/admin/suppliers/{id}` | Update; controlled status transitions |
| POST | `/api/v1/admin/suppliers/{id}/suspend` | Suspend; blocks new fulfillment |
| POST | `/api/v1/admin/suppliers/{id}/reactivate` | Reactivate from suspended |
| GET/POST/PATCH | `/api/v1/admin/suppliers/{id}/verification` | Submit / review verification |
| POST | `/api/v1/admin/suppliers/{id}/verify` | Alias for verification review |
| GET/POST | `/api/v1/admin/suppliers/{id}/documents` | Private document metadata (`storage_ref`) |
| PATCH | `/api/v1/admin/suppliers/{id}/documents/{document_id}` | Document review |
| PUT | `/api/v1/admin/suppliers/{id}/capabilities` | Capability upsert |
| GET/POST | `/api/v1/admin/suppliers/{id}/fabric-links` | Multi-supplier ↔ listing links |
| POST | `/api/v1/admin/suppliers/{id}/certifications` | Third-party certs (separate from Verified) |

### Lifecycle

Supplier status: `prospect → pending_review → under_review → approved → verified` (+ `suspended` / `rejected` / `archived`).

Verification status: `not_started → pending → verified` (+ `rejected` / `expired` / `suspended`). Admin approval required; rejected packets need a new submission.

New fulfillment eligibility: supplier `status=verified` **and** `verification_status=verified` **and** not past `verification_expires_at`. Suspended suppliers are excluded. `SupplierSelectionService` assigns internal `fulfillment_partner_ref` on fulfillment `allocated` (never returned on customer `OrderOut`).

Env: `SUPPLIER_VERIFICATION_DEFAULT_TTL_DAYS` (optional; empty/0 = no automatic expiry).

Migration: `010_suppliers_verification`.

## Admin Dashboard (Prompt #13)

Exactly **one** designated administrator: env `ADMIN_GOOGLE_EMAIL` (exact Google email match). Never hardcoded; never returned by public APIs.

Admin access requires: active user + verified Google identity + email exactly equals `ADMIN_GOOGLE_EMAIL` + `role=admin` (synced on Google login). All other accounts remain customers.

### Core endpoints (`CurrentAdminDep`)

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/admin/me` | Admin session probe |
| GET | `/api/v1/admin/dashboard` | Overview metrics (real aggregates; unavailable → explicit) |
| GET | `/api/v1/admin/orders` | Paginated/filtered order list |
| GET | `/api/v1/admin/orders/{orderNumber}` | Detail alias |
| GET | `/api/v1/admin/customers` | Search/filter customers |
| GET | `/api/v1/admin/customers/{id}` | Customer detail (no secrets) |
| POST | `/api/v1/admin/customers/{id}/suspend\|disable\|reactivate` | Audited account actions |
| GET/POST/PATCH | `/api/v1/admin/fabrics...` | Catalog management + publish/unpublish/archive |
| GET | `/api/v1/admin/analytics/{orders\|customers\|fabrics\|countries\|payments}` | Aggregations |
| GET | `/api/v1/admin/search?q=` | Cross-entity admin search |
| GET | `/api/v1/admin/audit` | Admin audit log |
| POST | `/api/v1/admin/exports/{type}` | Export foundation (accepted, not generated) |

Existing: `/api/v1/admin/orders/*` lifecycle (Prompt #9), `/api/v1/admin/suppliers/*` (Prompt #12), refunds.

Migration: `011_admin_dashboard` (`admin_audit_events`).

## Admin Realtime WebSocket (Prompt #14)

Architecture: **Admin API snapshot + WebSocket push**. Database / Admin APIs remain authoritative. WebSocket is not a durable event log.

### Transport

| Method | Path | Notes |
|--------|------|-------|
| WS | `/api/v1/realtime/ws/admin` | Admin-only channel `admin.dashboard`; session cookie auth |
| GET | `/api/v1/admin/realtime/events` | Missed-event catch-up (`after_seq` or `after_event_id`) |
| GET | `/api/v1/admin/realtime/metrics` | Connection / outbox counters |
| GET | `/api/v1/realtime/_ready` | Module probe (no connection counts) |

Query: `?reconnect=1` marks reconnect for metrics (auth is always revalidated).

### Auth

Same gate as Prompt #13 (`ADMIN_GOOGLE_EMAIL` + active + verified Google identity + `role=admin`). Customers and unauthenticated clients are closed (`4401` / `4403`). Authorization is enforced on the backend before the channel is accepted.

### Events (server → admin)

Envelope: `{ event_id, seq, type, channel, priority, timestamp, version, payload }`.

Orders: `order.created`, `order.confirmed`, `order.processing`, `order.ready_to_ship`, `order.shipped`, `order.delivered`, `order.cancelled` (+ `order.status_changed`).

Payments: `payment.created`, `payment.processing`, `payment.succeeded`, `payment.failed`, `payment.refunded`.

Inquiries: `inquiry.created`, `inquiry.status_changed`.

Suppliers: `supplier.created`, `supplier.verification_*`, `supplier.suspended`, `supplier.reactivated`.

Customers / catalog (compact): `customer.*`, `fabric.*`.

Client may send only `ping` or `subscribe` to `admin.dashboard`. Arbitrary event types / other channels are rejected.

### Reliability

Transactional outbox table `realtime_outbox_events` (migration `012_realtime_outbox`): domain write + outbox row commit together; post-commit drain broadcasts to connected admins. Idempotency via `idempotency_key`. After reconnect: re-fetch Admin dashboard APIs and optionally `GET /admin/realtime/events?after_seq=…`.

Heartbeat: server `heartbeat` every ~25s; stale connections dropped after ~90s without client activity. In-process hub (single instance); broker-ready abstraction for multi-instance later.

## Production hardening

See `docs/PRODUCTION.md` for deployment checklist, CSRF decision, backup expectations, and email future boundary.

Health: `GET /health/live` (liveness), `GET /health` / `GET /ready` (DB readiness), `GET /health/metrics` (admin-only).

Production fail-fast: fake Stripe gateway banned; distinct `SESSION_SECRET`; required Google OAuth, Stripe secrets, `ADMIN_GOOGLE_EMAIL`, HTTPS URLs, secure cookies, explicit CORS.

## SEO publication + indexability

Backend-authoritative SEO lifecycle (not Page Studio / page builder). New pages default to `draft` + `noindex`. Do not claim Google “indexed” without Search Console integration — use `indexable` / `sitemap_eligible`.

### Public

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/seo/pages/by-path?path=` | Published pages only (draft/scheduled → 404). Canonical, meta, OG, robots, topic/cluster breadcrumb. No internal quality flags. |
| GET | `/api/v1/seo/sitemap/index` | Sitemap index for large catalogs (`page_size` 5000). |
| GET | `/api/v1/seo/sitemap?page=` | Eligible URLs only: `published_indexable` + `index` + canonical. Meaningful `lastmod` from `updated_at`. |
| GET | `/api/v1/seo/route-classes` | Robots/crawl route classification catalog. |
| GET | `/api/v1/seo/classify?path=` | Classify a path; search/filter query URLs are never auto-indexable SEO pages. |

### Admin (designated Google admin only)

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/v1/admin/seo/topics` | Topic taxonomy |
| POST | `/api/v1/admin/seo/clusters` | Topical clusters |
| POST | `/api/v1/admin/seo/clusters/{id}/members/{pageId}` | Attach page to cluster |
| POST | `/api/v1/admin/seo/pages` | Create SEO page (defaults draft/noindex) |
| GET/PATCH | `/api/v1/admin/seo/pages/{id}` | Admin detail / metadata update |
| POST | `/api/v1/admin/seo/pages/{id}/schedule` | `publish_now` or `schedule_publish_at` |
| POST | `/api/v1/admin/seo/pages/{id}/indexability` | `index` / `noindex` (quality gates may block) |
| POST | `/api/v1/admin/seo/links` | Internal-link relationships |
| POST | `/api/v1/admin/seo/publishing-batches` | Launch batches |
| POST | `/api/v1/admin/seo/publishing-batches/{id}/schedule` | Schedule all batch pages |
| GET | `/api/v1/admin/seo/publishing-calendar` | Scheduled rollout calendar |
| POST | `/api/v1/admin/seo/apply-due` | Apply due scheduled publishes (server time) |
| GET | `/api/v1/admin/seo/audit` | Aggregate SEO audit + findings |
| GET | `/api/v1/admin/seo/clusters/authority` | Per-cluster topical authority report |

Publication states: `draft`, `scheduled`, `published_noindex`, `published_indexable`, `archived`. Indexability is separate from publication (`index` / `noindex`). Incomplete pages scheduled for index are published as `published_noindex` with `publication_issue` — never silently indexable.

Migration: `014_seo_publication`.

## Inquiries (fabric → quantity → inquiry — no Stripe)

Primary commercial path: authenticated customer submits an inquiry for a published fabric listing. **No payment, Checkout, or Stripe** in this flow.

### Customer

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/v1/inquiries` | Auth required. Body: `fabricId` (listing UUID), optional `variantId`, `quantity`, optional `quantityUnit`. Optional `Idempotency-Key`. Status always starts `NEW`. |
| GET | `/api/v1/me/inquiries` | Own history only (`limit`/`offset`). |
| GET | `/api/v1/me/inquiries/{id}` | Own inquiry only (404 if another customer). |

Response shape: `{ "inquiry": { id, inquiry_number, fabric, quantity, quantity_unit, status, created_at } }`.

Server derives `customer_id` / `customer_email` from the session. Loads published listing from DB. Validates quantity via shared quantity helpers. Enqueues customer + admin emails in `inquiry_email_outbox` (PENDING→SENT/FAILED after commit). Publishes realtime `inquiry.created`. Email failure never rolls back the inquiry.

### Admin

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/admin/inquiries` | Paginated; filters: `status`, `q`, `created_from`, `created_to`. Newest first. |
| GET | `/api/v1/admin/inquiries/{id}` | Detail |
| PATCH | `/api/v1/admin/inquiries/{id}/status` | Transitions: NEW→CONTACTED/IN_PROGRESS/CANCELLED; … → COMPLETED/CANCELLED. |

Env: `ADMIN_EMAIL` (notify inbox; falls back to `ADMIN_GOOGLE_EMAIL`), `EMAIL_FROM`, `EMAIL_PROVIDER=none|log`, `EMAIL_USE_FAKE` (tests only).

Migration: `015_inquiries`.
