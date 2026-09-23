# FabStitch transactional email design specs

**Status:** Design reference for backend email templates  
**Not live delivery.** The FabStitch frontend repository does **not** render or send OTP, welcome, or inquiry emails. Production HTML is owned by:

`fabstitch_backend/src/fabstitch/email/templates.py`

Admin notification recipient is controlled by backend env (`ADMIN_EMAIL` / `ADMIN_GOOGLE_EMAIL`).  
**Never** put that address in `NEXT_PUBLIC_*` or browser JavaScript.

These HTML files are visual/copy specs for backend engineers to port into `templates.py` (or an equivalent email-safe renderer) without inventing a second frontend email system.

## Specs in this folder

| File                               | Purpose                                 |
| ---------------------------------- | --------------------------------------- |
| `otp-email.spec.html`              | Premium OTP / verify-email layout       |
| `welcome-email.spec.html`          | Welcome after signup verification       |
| `inquiry-customer-email.spec.html` | Customer inquiry confirmation           |
| `inquiry-admin-email.spec.html`    | Internal FabStitch inquiry notification |

## Required data (backend already has most)

Customer inquiry confirmation should include only fields that exist on the inquiry + session:

- Inquiry reference / number
- Inquiry ID
- Created date + time (server timestamp)
- Customer name, email, phone (from account profile)
- Fabric name
- Quantity + unit
- Customer note when present

Admin notification should also include phone and note (current backend template omits them — frontend already persists phone/name to profile before `POST /inquiries` and sends `customerNote` in the payload).
