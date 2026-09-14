# FabStitch frontend — current state

Survey date: 2026-09-12.

## Runtime

FabStitch currently runs as one independent Next.js frontend. No backend,
database, authentication server, payment service, analytics tracker, WebSocket
or external catalogue service is required for normal browsing or builds.

## Data and state

- `catalog/` is the authoritative customer fabric catalogue.
- `repositories/customer-catalog.ts` provides local search, filter, sort,
  facets, pagination and detail reads.
- `features/local/local-account.tsx` stores versioned local demo profiles,
  onboarding, preferences and legal-consent versions in browser local storage.
- Market country/currency preferences use local storage.
- Fabric comparison uses session storage.
- Purchase and RFQ values stay in temporary component state and are not sent.
- Buyer, supplier and admin workspaces use deterministic empty preview models.

## Customer routes

Home, marketplace, fabrics, collections, Best For, details, search redirects,
comparison, onboarding, account preferences, sign-up, sign-in, Terms, Privacy,
contact, help, support, about and How It Works are retained.

Legacy supplier-directory, certificate, buyer-type and country URL families
redirect to the current customer fabric experience. Buyer, supplier and admin
workspace routes remain available as noindex previews.

## Removed old integration

The old API client, authenticated server client, access and refresh tokens,
session cookies, auth guards, backend preference route, external catalogue
adapters, OpenAPI files, API environment variables, backend QA scripts and
backend runtime artifacts have been removed.

## Future boundary

A new backend should replace provider/repository implementations without
changing UI components or creating a parallel account system. It must define
secure authentication, authorization, durable consent, catalogue ownership,
orders, payments, fulfilment and data-retention behavior before those features
are represented as live.
