"use client";

import { useState } from "react";
import { SocialAuthButton, type SocialProvider } from "./social-auth-button";
import type { AuthProvider } from "./providers";

/** OAuth choices returned by `GET /auth/oauth/providers`. */
export function ProviderOptions({ providers }: { providers: AuthProvider[] }) {
  const [chosen, setChosen] = useState<SocialProvider | null>(null);

  if (providers.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-2.5">
        {providers.map((provider) => (
          <SocialAuthButton
            key={provider.provider}
            provider={provider.provider}
            href={provider.authorizeHref}
            onSelect={setChosen}
          />
        ))}
      </div>

      {chosen ? (
        <p
          id={`${chosen}-provider-state`}
          role="status"
          className="mt-3 rounded-sm border border-caution-soft bg-caution-soft px-3 py-2 text-sm text-ink-2"
        >
          {chosen === "google" ? "Google" : "Apple"} sign-in is not connected
          for this environment. Continue with your email address below.
        </p>
      ) : null}

      <div className="mt-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-rule" />
        <span className="font-mono text-label text-ink-3 uppercase">or</span>
        <span className="h-px flex-1 bg-rule" />
      </div>
    </div>
  );
}
