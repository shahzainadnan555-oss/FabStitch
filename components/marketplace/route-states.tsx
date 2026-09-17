"use client";

import Link from "next/link";
import { FabStitchPageLoader } from "@/components/brand/fabstitch-loader";
import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icon";

/**
 * Route-level states.
 *
 * Primary loading always uses the full-viewport FabStitch overlay so major
 * navigations share one branded experience instead of scattered section spinners.
 */

/** Full-route branded loader for loading.tsx / Suspense boundaries. */
export function PageLoadingState({
  label = "Loading FabStitch",
}: {
  label?: string;
}) {
  return <FabStitchPageLoader label={label} />;
}

/** Catalog / results loading — same global overlay (no section spinner). */
export function ResultsSkeleton({
  label = "Loading fabrics",
}: {
  cards?: number;
  label?: string;
}) {
  return <FabStitchPageLoader label={label} />;
}

/** Detail page loading — same global overlay. */
export function DetailSkeleton() {
  return <FabStitchPageLoader label="Loading fabric" />;
}

/** Account / workspace loading — same global overlay. */
export function WorkspaceSkeleton({
  label = "Loading account",
}: {
  label?: string;
}) {
  return <FabStitchPageLoader label={label} />;
}

/**
 * Error boundary body.
 *
 * States what failed and offers the two things that actually help: try again,
 * or go somewhere that works. The digest is shown because it is the only
 * handle a buyer can quote when reporting a problem - the message itself is
 * withheld by Next in production, and inventing a friendlier one would be
 * guessing at a cause.
 */
export function RouteError({
  reset,
  digest,
  scope = "page",
}: {
  reset: () => void;
  digest?: string;
  scope?: string;
}) {
  return (
    <Container className="py-16">
      <div className="max-w-[52ch]">
        <p className="font-mono text-label uppercase text-alert">Error</p>
        <h1 className="mt-3 text-h1 font-semibold text-ink text-balance">
          {scope === "fabric"
            ? "Unable to load this fabric right now."
            : scope === "sign-in"
              ? "We couldn't complete this sign-in screen."
              : "We're having trouble loading this page."}
        </h1>
        <p className="mt-3 text-body text-ink-3 text-pretty">
          The rest of FabStitch is still available. Try again, or continue
          browsing fabrics.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
          <Link
            href="/marketplace/"
            className="inline-flex h-10 items-center gap-2 rounded-sm border border-border bg-paper-raised px-4 text-sm font-medium text-ink transition-colors hover:border-ink-2 hover:bg-paper-sunk"
          >
            Browse fabrics
            <IconArrowRight width={14} height={14} />
          </Link>
        </div>
        {digest ? (
          <p className="mt-6 font-mono text-xs text-ink-4">
            Reference {digest}
          </p>
        ) : null}
      </div>
    </Container>
  );
}
