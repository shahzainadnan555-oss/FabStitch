# FabStitch local profile flow

Status: frontend demo only.

FabStitch has no current authentication backend. The Sign Up and Sign In pages
are retained to validate the customer journey and interface, but they do not
create or authenticate a production account.

## Storage

`features/local/local-account.tsx` owns one versioned browser record:

- local profiles keyed by normalized email
- active local profile identifier
- name, company and country
- onboarding choices and completion
- Terms and Privacy versions acknowledged
- local acceptance timestamp

The store never contains a password. The password field is validated for form
completeness and discarded.

## Sign up

1. Customer completes required fields.
2. Customer actively checks the Terms and Privacy consent checkbox.
3. The frontend creates a local profile in `localStorage`.
4. The customer completes onboarding.
5. Preferences are saved locally and discovery opens.

The checkbox is unchecked on every fresh render. Consent version and time are
local demo evidence only, not durable server-side proof.

## Sign in

Entering an email reopens a matching local profile on the same device. No
password, email ownership or identity verification occurs. If no profile is
found, the page directs the customer to create one.

## Route access

There are no security guards. Browser-local state cannot authorize a route.
Buyer, supplier and admin routes are retained as clearly labelled frontend
previews and contain no connected private records.

## Sign out

Closing the local session clears only the active profile identifier. Saved
profiles remain in browser storage so they can be reopened. Clearing browser
site data deletes the local records.

## Future backend boundary

A new backend will need explicit contracts for secure authentication, account
ownership, session management, profile persistence, authorization and durable
legal-consent records. It must replace the local provider rather than creating
a second account system.
