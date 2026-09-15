"use client";

import { useState } from "react";
import { SocialAuthButton, type SocialProvider } from "./social-auth-button";
import { googleAuthErrorMessage } from "./messages";
import type { AuthProvider } from "./providers";

function AuthDivider() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-rule" />
      <span className="font-mono text-label text-ink-3 uppercase">or</span>
      <span className="h-px flex-1 bg-rule" />
    </div>
  );
}

/** OAuth choices returned by `GET /auth/oauth/providers`. */
export function ProviderOptions({
  providers,
  error,
  position = "after",
}: {
  providers: AuthProvider[];
  error?: string | null;
  position?: "before" | "after";
}) {
  const [chosen, setChosen] = useState<SocialProvider | null>(null);

  if (providers.length === 0 && !error) return null;

  const google = (
    <>
      {providers.length > 0 ? (
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
      ) : null}

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-sm border border-caution-soft bg-caution-soft px-3 py-2 text-sm text-ink-2"
        >
          {googleAuthErrorMessage(error)}
        </p>
      ) : null}

      {chosen ? (
        <p
          id={`${chosen}-provider-state`}
          role="status"
          className="mt-3 rounded-sm border border-caution-soft bg-caution-soft px-3 py-2 text-sm text-ink-2"
        >
          Google sign-in is not connected for this environment. Continue with
          your email address below.
        </p>
      ) : null}
    </>
  );

  return (
    <div className={position === "after" ? "mt-6" : "mb-6"}>
      {position === "after" ? (
        <div className="mb-6">{<AuthDivider />}</div>
      ) : null}
      {google}
      {position === "before" ? (
        <div className="mt-6">{<AuthDivider />}</div>
      ) : null}
    </div>
  );
}
