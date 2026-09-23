# Transactional Email UX Audit

**Project:** FabStitch frontend  
**Repository:** https://github.com/shahzainadnan555-oss/FabStitch.git  
**Scope:** Frontend only

---

## Architecture finding

| Concern                                          | Location                            | Frontend can change live send?  |
| ------------------------------------------------ | ----------------------------------- | ------------------------------- |
| OTP / welcome / inquiry email HTML               | Backend `email/templates.py`        | **No**                          |
| Admin recipient                                  | Backend `ADMIN_EMAIL` env           | **No**                          |
| OTP TTL / attempts                               | Backend auth OTP service            | **No**                          |
| Inquiry outbox enqueue                           | Backend inquiries service           | **No**                          |
| Inquiry form, quantity rules, success UI, OTP UI | Frontend                            | **Yes**                         |
| Premium email design package                     | Frontend `lib/transactional-email/` | Design only until backend ports |

Frontend **does not fake email delivery**. Successful inquiry UI reflects API persistence success; email send is asynchronous on the server.

---

## What this pass delivered

### 1. Unified email design system (frontend)

Package: `lib/transactional-email/`

Shared primitives:

- brand tokens (navy / chrome / gold / indigo)
- HTML escaping
- table-based email shell + logo
- cards, field rows, CTAs, highlight band
- HTML + plain-text output for each template

Templates:

1. **OTP** — digit cells + mono fallback, expiry, security line
2. **Welcome** — Explore fabrics CTA → `https://fabstitch.net/marketplace/`
3. **Customer inquiry** — full summary, note when present, 24-hour highlight, View inquiry CTA
4. **Admin inquiry** — reference-first hierarchy, customer card (incl. phone), fabric card (optional specs), note, request summary

QA samples written to `docs/email/generated/` by `npm run qa:transactional-emails`.

### 2. In-app OTP / welcome UX (already shipped + retained)

- Premium OTP digit inputs
- Clear verification copy
- Welcome screen with Explore fabrics action
- Honest wording about welcome email delivery

### 3. Inquiry success UI (already shipped + retained)

- “Our team will contact you within 24 hours.”
- Reference, ID, date, time, name, email, phone, fabric, quantity, note
- View your inquiry → `/inquiries/{id}/`

### 4. Quantity limit (already shipped + retained)

| Rule                | Value                                       |
| ------------------- | ------------------------------------------- |
| Maximum (inclusive) | **500,000 meters**                          |
| Helper              | Maximum inquiry quantity: 500,000 meters.   |
| Error               | Maximum inquiry quantity is 500,000 meters. |
| 500000              | VALID                                       |
| 500001+             | INVALID                                     |

### 5. Inquiry payload consistency

`CreateInquiryRequest` (unchanged contract):

- `fabricId`
- `quantity`
- `quantityUnit` (meters)
- optional `customerNote`
- optional `variantId`

Name / phone / country are persisted to `/account/profile` before submit so the backend can derive customer contact for emails. Frontend success state mirrors submitted contact + note.

---

## Backend gaps (cannot fix under FRONTEND ONLY)

Current production templates remain plain and incomplete until backend adopts the new design package:

1. OTP still generic paragraph code (no premium digit block)
2. Welcome CTA still home URL, not marketplace
3. Customer inquiry email lacks phone, note, ID, date/time split, 24-hour band
4. Admin inquiry email lacks phone, note, fabric specs, richer subject

Recipient for internal mail must stay on **server env**, not client JS.

---

## Security

- `escapeHtml` / `escapeHtmlMultiline` on all customer-controlled fields in the design package
- QA asserts HTML-like note characters are escaped
- No admin inbox address in frontend code
- No email credentials in `NEXT_PUBLIC_*`

---

## Accessibility

Email design:

- logo alt text
- logical headings
- high-contrast navy/gold/ink palette
- large OTP digits

Form / OTP UI:

- labelled controls
- `aria-invalid` on errors
- focus/scroll to invalid quantity
- inquiry success `aria-live`

---

## Tests executed

| Check                             | Result                                            |
| --------------------------------- | ------------------------------------------------- |
| `npm run qa:transactional-emails` | Passed (`docs/email/generated` samples written)   |
| `npm run qa:inquiry-quantity`     | Passed (500000 accepted; 500001 rejected)         |
| `npm run typecheck`               | Passed                                            |
| ESLint (changed files)            | Passed                                            |
| Prettier                          | Passed                                            |
| `npm run build`                   | Passed                                            |

---

## Files added / updated

- `lib/transactional-email/**`
- `scripts/qa/transactional-emails.mts`
- `docs/email/README.md`
- `docs/email/generated/**` (generated by QA)
- `docs/qa/TRANSACTIONAL-EMAIL-UX-AUDIT.md`
- `package.json` (`qa:transactional-emails`)

---

## Final principle

Premium FabStitch email **design** now lives in the frontend as a tested, email-safe package.  
Premium FabStitch email **delivery** still requires a backend template port — intentionally out of scope for FRONTEND ONLY.
