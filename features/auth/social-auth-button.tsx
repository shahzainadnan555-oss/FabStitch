"use client";

/** Redirects configured providers to the backend-owned OAuth flow. */

export type SocialProvider = "google" | "apple";

export function SocialAuthButton({
  provider,
  onSelect,
  href,
}: {
  provider: SocialProvider;
  onSelect: (provider: SocialProvider) => void;
  href?: string | null;
}) {
  const label = provider === "google" ? "Google" : "Apple";
  const className =
    "flex h-11 w-full items-center justify-center gap-2.5 rounded-sm border border-border bg-paper-raised text-body font-medium text-ink transition-colors duration-150 hover:border-ink-2 hover:bg-paper-sunk";

  if (href) {
    return (
      <a href={href} className={className}>
        {provider === "google" ? <GoogleMark /> : <AppleMark />}
        Continue with {label}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(provider)}
      aria-describedby={`${provider}-provider-state`}
      className={className}
    >
      {provider === "google" ? <GoogleMark /> : <AppleMark />}
      Continue with {label}
    </button>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 18 18" width="17" height="17" aria-hidden="true">
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

function AppleMark() {
  return (
    <svg viewBox="0 0 18 18" width="17" height="17" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.4 9.5c0-1.7 1.4-2.5 1.45-2.55-.8-1.15-2-1.3-2.45-1.32-1.05-.1-2.05.6-2.58.6-.53 0-1.35-.59-2.22-.57-1.14.02-2.19.66-2.78 1.68-1.18 2.05-.3 5.08.85 6.74.57.81 1.24 1.72 2.12 1.69.85-.04 1.17-.55 2.2-.55s1.32.55 2.22.53c.92-.02 1.5-.83 2.06-1.64.65-.94.92-1.85.93-1.9-.02-.01-1.79-.69-1.8-2.71ZM11.7 4.5c.47-.57.79-1.36.7-2.15-.68.03-1.5.45-1.99 1.02-.43.5-.81 1.31-.71 2.08.76.06 1.53-.38 2-.95Z"
      />
    </svg>
  );
}
