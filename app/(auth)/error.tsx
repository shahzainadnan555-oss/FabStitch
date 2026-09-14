"use client";

import { RouteError } from "@/components/marketplace/route-states";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError reset={reset} digest={error.digest} scope="sign-in" />;
}
