"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { RouteError } from "@/components/marketplace/route-states";

export default function MarketplaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const scope = pathname.startsWith("/fabrics/") ? "fabric" : "page";

  useEffect(() => {
    console.error("[route-render]", {
      route: pathname,
      operation: "render",
      status: 500,
      errorType: error.name,
      digest: error.digest,
    });
  }, [error.digest, error.name, pathname]);

  return <RouteError reset={reset} digest={error.digest} scope={scope} />;
}
