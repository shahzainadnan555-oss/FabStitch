"use client";

import { useEffect } from "react";
import { trackGaEvent } from "@/lib/analytics/ga4";

/** Fires once per fabric detail mount. */
export function FabricViewTracker({
  fabricSlug,
  fabricName,
}: {
  fabricSlug: string;
  fabricName: string;
}) {
  useEffect(() => {
    trackGaEvent("view_fabric", {
      fabric_slug: fabricSlug,
      fabric_name: fabricName,
    });
  }, [fabricSlug, fabricName]);

  return null;
}
