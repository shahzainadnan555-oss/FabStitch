# FabStitch transactional email design package

**Live delivery is backend-owned.**  
Production OTP / welcome / inquiry emails are rendered by
`fabstitch_backend/src/fabstitch/email/templates.py` and sent through the
server email factory / inquiry outbox.

This frontend package is the **premium design source of truth**:

- TypeScript renderers: `lib/transactional-email/`
- Generated samples: `docs/email/generated/` (from `npm run qa:transactional-emails`)
- Older static specs: `*.spec.html` (kept for reference)

## Renderers

| Function                     | Subject (example)                                   |
| ---------------------------- | --------------------------------------------------- |
| `renderOtpEmail`             | Verify your FabStitch email                         |
| `renderWelcomeEmail`         | Welcome to FabStitch                                |
| `renderInquiryCustomerEmail` | Your FabStitch inquiry has been received            |
| `renderInquiryAdminEmail`    | New Fabric Inquiry — Egyptian Cotton Poplin — INQ-… |

## Backend adoption (required for live mail)

Port the generated HTML/text into the backend template module. Keep recipient
routing on server env (`ADMIN_EMAIL`). Do **not** hardcode the admin address in
the frontend bundle.

## Assets

Logo (production HTTPS):

`https://fabstitch.net/media/fabstitch-mark.png`
