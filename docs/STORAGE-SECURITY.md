# Frontend storage and media boundary

Status: frontend-only.

## Browser state

FabStitch stores local demo profiles, onboarding preferences, legal document
versions, acceptance time, country and display currency in browser
`localStorage`. Comparison identifiers use `sessionStorage`.

This storage is not secure authentication storage:

- it is accessible to scripts running for the site;
- anyone using the same browser profile may reopen a local profile;
- it can be edited or deleted with browser tools;
- it is not durable server-side evidence;
- passwords, payment data and sensitive commercial documents must never be
  stored there.

Purchase and RFQ preview values remain in component memory and are not
intentionally persisted.

## Media

Current customer catalogue media is served from project-owned assets under
`public/media` through centralized local mappings. No upload endpoint, object
store, signed URL service, remote image host or supplier-document storage is
configured.

Do not place certificates, identity documents or other private material under
`public/`; everything there is publicly retrievable.

## Future requirement

A future backend must define authenticated storage, object ownership, public
and private media classes, upload validation, deletion, retention and audit
behavior before private or user-uploaded media is accepted. That work must not
reuse browser local storage as a security boundary.
