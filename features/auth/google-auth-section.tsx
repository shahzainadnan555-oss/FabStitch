"use client";

import { GoogleContinueButton } from "./google-continue-button";
import { googleAuthErrorMessage } from "./messages";
import { AuthDivider } from "./ui";
import type { AuthProvider } from "./providers";

export function GoogleAuthSection({
  providers,
  error,
}: {
  providers: AuthProvider[];
  error?: string | null;
}) {
  const google = providers.find((provider) => provider.provider === "google");

  return (
    <div className="flex flex-col gap-4">
      <AuthDivider />
      <GoogleContinueButton href={google?.authorizeHref ?? null} />
      {error ? (
        <p
          role="alert"
          className="rounded-md border border-caution-soft bg-caution-soft px-3.5 py-3 text-sm text-ink-2"
        >
          {googleAuthErrorMessage(error)}
        </p>
      ) : null}
    </div>
  );
}
