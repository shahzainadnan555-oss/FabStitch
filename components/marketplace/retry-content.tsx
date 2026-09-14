"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

export function RetryContent({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
      className={cn(
        "inline-flex h-10 items-center rounded-sm bg-indigo px-4 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-70",
        className,
      )}
    >
      {pending ? "Trying again…" : "Try again"}
    </button>
  );
}
