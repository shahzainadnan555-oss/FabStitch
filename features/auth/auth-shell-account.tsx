"use client";

import Link from "next/link";
import { AccountMenu } from "@/features/account/account-menu";
import { useSession } from "./session";

export function AuthShellAccount({
  counterpart,
}: {
  counterpart?: { prompt: string; label: string; href: string };
}) {
  const { hydrated, authenticated } = useSession();

  if (hydrated && authenticated) {
    return <AccountMenu />;
  }

  if (!counterpart) return null;

  return (
    <p className="text-sm text-ink-3">
      <span className="hidden sm:inline">{counterpart.prompt} </span>
      <Link
        href={counterpart.href}
        className="font-semibold text-indigo hover:underline"
      >
        {counterpart.label}
      </Link>
    </p>
  );
}
