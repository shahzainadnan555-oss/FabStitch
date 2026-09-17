"use client";

import { FabStitchMark } from "@/components/layout/logo";
import { cn } from "@/lib/cn";

export type FabStitchLoaderVariant = "page" | "content" | "inline";

const SIZE: Record<FabStitchLoaderVariant, number> = {
  page: 56,
  content: 40,
  inline: 22,
};

/**
 * FabStitch-branded loading indicator.
 *
 * Tied only to real async work (route transitions, Suspense, fetches).
 * Animation is CSS-only and respects prefers-reduced-motion.
 */
export function FabStitchLoader({
  variant = "content",
  label = "Loading",
  className,
  overlay = false,
}: {
  variant?: FabStitchLoaderVariant;
  label?: string;
  className?: string;
  /** Soft cover over existing content without unmounting the shell. */
  overlay?: boolean;
}) {
  const size = SIZE[variant];

  const body = (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "fs-loader",
        `fs-loader--${variant}`,
        overlay && "fs-loader--overlay",
        className,
      )}
    >
      <span className="sr-only">{label}</span>
      <span className="fs-loader__ring" aria-hidden="true" />
      <span className="fs-loader__mark" aria-hidden="true">
        <FabStitchMark size={size} className="fs-loader__image" />
      </span>
    </div>
  );

  if (variant === "page") {
    return (
      <div className="flex min-h-[min(28rem,70dvh)] flex-1 items-center justify-center bg-paper px-6 py-16">
        {body}
      </div>
    );
  }

  return body;
}
