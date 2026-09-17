"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Full-viewport FabStitch loading overlay.
 *
 * One global experience for major route, filter, auth, and onboarding loads.
 * Uses the real transparent mark (`/media/fabstitch-mark.png`) with no card,
 * border, or white plaque behind the logo.
 */
export function FabStitchPageLoader({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn("fs-page-loader", className)}
    >
      <span className="sr-only">{label}</span>
      <div className="fs-page-loader__stage" aria-hidden="true">
        <svg
          className="fs-page-loader__orbit"
          viewBox="0 0 120 120"
          width="120"
          height="120"
          focusable="false"
        >
          <circle
            className="fs-page-loader__thread fs-page-loader__thread--navy"
            cx="60"
            cy="60"
            r="52"
            fill="none"
            strokeWidth="1"
          />
          <circle
            className="fs-page-loader__thread fs-page-loader__thread--gold"
            cx="60"
            cy="60"
            r="46"
            fill="none"
            strokeWidth="1.35"
          />
        </svg>
        <Image
          src="/media/fabstitch-mark.png"
          alt=""
          width={72}
          height={72}
          priority
          className="fs-page-loader__logo"
        />
      </div>
    </div>
  );
}

/** @deprecated Prefer FabStitchPageLoader — kept as a thin alias for call sites. */
export function FabStitchLoader({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
  /** Ignored — primary loading is always full-viewport. */
  variant?: "page" | "content" | "inline";
  /** Ignored — primary loading is always full-viewport. */
  overlay?: boolean;
}) {
  return <FabStitchPageLoader label={label} className={className} />;
}
