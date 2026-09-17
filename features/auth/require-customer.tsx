"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FabStitchPageLoader } from "@/components/brand/fabstitch-loader";
import { useSession } from "./session";
import { loginHref } from "./return-to";

/** Client guard. Never treats a loading session as logged out. */
export function RequireCustomer({
  returnTo,
  children,
  pendingLabel = "Preparing your account",
}: {
  returnTo: string;
  children: React.ReactNode;
  pendingLabel?: string;
}) {
  const router = useRouter();
  const { hydrated, authenticated } = useSession();

  useEffect(() => {
    if (!hydrated) return;
    if (!authenticated) {
      router.replace(loginHref(returnTo));
    }
  }, [authenticated, hydrated, returnTo, router]);

  if (!hydrated) {
    return <FabStitchPageLoader label={pendingLabel} />;
  }

  if (!authenticated) return null;

  return children;
}
