"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SectionError } from "@/components/ui/section-error";

export function CatalogLoadError({
  title = "Unable to load fabrics right now.",
  description = "We're having trouble connecting. Your session is still available — try again in a moment.",
}: {
  title?: string;
  description?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <div className="px-5 py-10 sm:px-8">
      <SectionError
        title={title}
        description={description}
        onRetry={async () => {
          if (pending) return;
          setPending(true);
          router.refresh();
          await new Promise((resolve) => setTimeout(resolve, 400));
          setPending(false);
        }}
      />
    </div>
  );
}
