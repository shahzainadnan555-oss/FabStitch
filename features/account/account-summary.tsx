"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/features/auth/session";
import type { components } from "@/lib/api/schema";

type UserPublic = components["schemas"]["UserPublic"];

export function AccountSummary({ profile }: { profile: UserPublic }) {
  const router = useRouter();
  const { signOut } = useSession();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <section
      aria-label="Account details"
      className="mb-9 grid overflow-hidden rounded-md border border-rule-2 bg-rule-2 sm:grid-cols-3 sm:gap-px"
    >
      <div className="bg-paper-raised p-4">
        <p className="font-mono text-label text-ink-4 uppercase">Account</p>
        <p className="mt-2 font-semibold text-ink">
          {profile.full_name || "Name not set"}
        </p>
        <p className="mt-1 truncate text-sm text-ink-3">{profile.email}</p>
      </div>
      <div className="border-t border-rule-2 bg-paper-raised p-4 sm:border-t-0">
        <p className="font-mono text-label text-ink-4 uppercase">Profile</p>
        <p className="mt-2 text-sm text-ink-2">
          Your contact details and sourcing preferences are attached to this
          secure cookie session.
        </p>
      </div>
      <div className="flex flex-col justify-center border-t border-rule-2 bg-paper-raised p-4 sm:border-t-0">
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setPending(true);
            setError(null);
            void signOut()
              .then(() => {
                router.push("/marketplace/");
                router.refresh();
              })
              .catch(() => {
                setError("Sign out failed. Try again.");
                setPending(false);
              });
          }}
          className="h-11 w-full rounded-sm border border-border bg-paper px-4 text-sm font-semibold text-ink hover:border-ink disabled:opacity-60"
        >
          {pending ? "Signing out…" : "Sign out"}
        </button>
        {error ? (
          <p role="alert" className="mt-2 text-xs text-alert">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
