"use client";

import { useState } from "react";
import { markOauthPending } from "./oauth-return";

function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.35 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.96 10.71a5.4 5.4 0 0 1 0-3.42V4.96H.96a9 9 0 0 0 0 8.08l3-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}

/**
 * Backend-owned Google OAuth entry.
 * Navigates to GET /api/v1/auth/google via the authorize URL from /auth/oauth/providers.
 */
export function GoogleContinueButton({
  href,
  unavailableLabel = "Google sign-in is unavailable right now. Continue with email.",
}: {
  href: string | null;
  unavailableLabel?: string;
}) {
  const [leaving, setLeaving] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  if (!href) {
    return (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setUnavailable(true)}
          className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-md border border-border bg-paper text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink-2 hover:bg-paper-sunk"
        >
          <GoogleMark />
          Continue with Google
        </button>
        {unavailable ? (
          <p role="status" className="text-sm text-ink-3">
            {unavailableLabel}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <a
      href={href}
      aria-busy={leaving || undefined}
      onClick={(event) => {
        if (leaving) {
          event.preventDefault();
          return;
        }
        setLeaving(true);
        markOauthPending();
      }}
      className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-md border border-border bg-paper text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink-2 hover:bg-paper-sunk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
    >
      <GoogleMark />
      {leaving ? "Connecting to Google…" : "Continue with Google"}
    </a>
  );
}
