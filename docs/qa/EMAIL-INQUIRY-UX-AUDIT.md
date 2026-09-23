# Email & Inquiry UX Audit

**Scope:** Frontend only (`FabStitch.git`)  
**Date:** 2026-09-23

---

## Ownership boundary (critical)

| Concern                                                      | Owner           | Notes                                                                                       |
| ------------------------------------------------------------ | --------------- | ------------------------------------------------------------------------------------------- |
| OTP / welcome / inquiry **email HTML delivery**              | **Backend**     | `fabstitch_backend/src/fabstitch/email/templates.py` via EmailDeliveryPort / inquiry outbox |
| Admin recipient (`ADMIN_EMAIL`)                              | **Backend env** | Never exposed in frontend / `NEXT_PUBLIC_*`                                                 |
| OTP TTL, attempts, generation                                | **Backend**     | Frontend only verifies via `/auth/email/verify-otp`                                         |
| Inquiry persistence + email enqueue                          | **Backend**     | `POST /api/v1/inquiries` → `inquiry_email_outbox`                                           |
| Inquiry form UI, quantity validation, success screen, OTP UI | **Frontend**    | This repo                                                                                   |

The frontend **does not send email** and must not claim “email sent” beyond the inquiry API success state. Email delivery is asynchronous on the server; inquiry rows are kept even if email later fails.

Design specs for premium email HTML live in `docs/email/*.spec.html` for backend porting. They are **not** wired to delivery from this repository.

---

## OTP experience (frontend)

### Changes

- Premium verification copy (“FabStitch verification”, clearer expiry / security guidance)
- Larger, higher-contrast OTP digit inputs with paste support retained
- Welcome state no longer implies email delivery is guaranteed; clarifies discovery path
- Secondary **Explore fabrics** CTA → `/marketplace/` after verification

### Not changed

- OTP API contract, TTL, resend cooldown, attempt limits

---

## Welcome email

### Frontend

- In-app welcome success screen improved (above)

### Backend (unchanged in this task)

- `render_welcome_email` still owns the actual email
- Spec: `docs/email/welcome-email.spec.html` (CTA to `https://fabstitch.net/marketplace/`)

---

## Customer inquiry confirmation

### Frontend success dialog

After successful `POST /inquiries`:

- Message: inquiry received successfully
- Prominent: **Our team will contact you within 24 hours.**
- Structured summary: reference, ID, date, time, fabric, quantity, status, name, email, phone, country, note (when present)
- CTA: **View your inquiry** → `/inquiries/{id}/` (existing route)
- Does **not** claim the confirmation email itself was delivered

### Backend email (unchanged here)

- Spec: `docs/email/inquiry-customer-email.spec.html`
- Current backend template is thinner (reference + fabric + quantity) — phone/note/24h block require backend template update

---

## Internal inquiry notification

### Frontend responsibility

- Persist profile **name / phone / country** via `/account/profile` before inquiry
- Send `CreateInquiryRequest`: `fabricId`, `quantity`, `quantityUnit`, optional `customerNote`, optional `variantId`
- Session supplies customer email on the server

### Backend

- Recipient: `ADMIN_EMAIL` (fallback `ADMIN_GOOGLE_EMAIL`)
- Current `render_inquiry_admin_email` omits phone and note — frontend cannot fix that without backend changes
- Spec: `docs/email/inquiry-admin-email.spec.html`

**Shahzainadnan555@gmail.com was not hardcoded in client JavaScript.** Configure via backend env only.

---

## Quantity limit

| Rule                | Value                                                                       |
| ------------------- | --------------------------------------------------------------------------- |
| Maximum (inclusive) | **500,000 meters**                                                          |
| Valid               | `1` … `500000` (and positive decimals supported by existing number parsing) |
| Invalid             | `500001`, `1000000`, `0`, negatives, non-numeric, grouped `500,000`         |

### UI

- Helper: **Maximum inquiry quantity: 500,000 meters.**
- Error: **Maximum inquiry quantity is 500,000 meters.**
- Input `max={500000}`
- Footer reminder of the maximum

### Code

- `features/inquiries/contact.ts` — `INQUIRY_QUANTITY_MAX_METERS`, `quantityFieldError`, `parseQuantity`
- `features/inquiries/inquiry-form.tsx` — hints + `max` attribute

### Test

- `npm run qa:inquiry-quantity` — accepts 500000, rejects 500001 with exact error copy

---

## Inquiry payload audit

```json
{
  "fabricId": "<uuid>",
  "quantity": "<string|number>",
  "quantityUnit": "meters",
  "customerNote": "<optional>",
  "variantId": "<optional>"
}
```

Contact fields are **not** in the inquiry body; they are updated on the profile first so backend-derived customer email/phone/name stay consistent for outbox emails.

---

## Accessibility

- OTP digits labelled (`Digit n of 6`), `aria-invalid` on error
- Quantity errors announced via Field `role="alert"`
- Inquiry success uses `role="status"` / `aria-live="polite"`
- Close / submit controls remain keyboard reachable

---

## Tests executed

| Check                         | Result                                                                   |
| ----------------------------- | ------------------------------------------------------------------------ |
| `npm run qa:inquiry-quantity` | Passed (500000 accepted; 500001 rejected with exact error)               |
| `npm run typecheck`           | Passed                                                                   |
| ESLint (changed files)        | Passed                                                                   |
| Prettier                      | Passed                                                                   |
| `npm run build`               | Passed                                                                   |

---

## Backend-owned limitations (cannot change from frontend)

1. Production OTP / welcome / inquiry email HTML and subjects
2. Admin inbox address routing
3. Including phone + note in admin/customer email bodies (template gaps)
4. Email provider credentials and delivery status
5. Quantity ceiling enforcement on the API (frontend is now 500k; align backend helpers separately if still 1M)

---

## Files touched (frontend)

- `features/inquiries/contact.ts`
- `features/inquiries/inquiry-form.tsx`
- `features/inquiries/presentation.ts`
- `features/auth/email-otp-form.tsx`
- `features/auth/otp-input.tsx`
- `scripts/qa/inquiry-quantity.mts`
- `docs/email/*`
- `docs/qa/EMAIL-INQUIRY-UX-AUDIT.md`
- `package.json`
