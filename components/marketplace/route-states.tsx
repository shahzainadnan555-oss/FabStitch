"use client";

import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { LoadingRegion, Skeleton } from "@/components/ui/state";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icon";

/**
 * Route-level states.
 *
 * Three things Next needs per segment and the marketplace never had: what to
 * paint while a page streams, what to paint when it throws, and what to paint
 * when the record does not exist.
 *
 * The skeletons deliberately mirror the *real* layout of the page they cover.
 * A generic spinner tells a buyer nothing; a results skeleton that matches the
 * grid means the page does not jump when data lands, which is the difference
 * between a loading state and a flash of the wrong thing.
 */

/** Results grid: header, toolbar, then cards at the real aspect. */
export function ResultsSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <LoadingRegion label="Loading listings">
      <Container className="py-8">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-lg" />
          ))}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: cards }, (_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-rule-2 bg-paper-raised"
            >
              <Skeleton className="aspect-2/1 rounded-none" />
              <div className="p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/2" />
                <div className="mt-3 flex gap-1.5">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="mt-4 h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </LoadingRegion>
  );
}

/** Detail page: title block beside a commercial rail. */
export function DetailSkeleton() {
  return (
    <LoadingRegion label="Loading record">
      <Container className="py-8">
        <Skeleton className="h-3 w-72 max-w-full" />
        <Skeleton className="mt-4 h-8 w-2/3" />
        <Skeleton className="mt-3 h-4 w-1/3" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <Skeleton className="aspect-3/2 rounded-md" />
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i}>
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-2 h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="h-72 rounded-md" />
        </div>
      </Container>
    </LoadingRegion>
  );
}

/** Workspace surface: header, then panels. */
export function WorkspaceSkeleton() {
  return (
    <LoadingRegion label="Loading workspace">
      <div className="px-4 py-7 sm:px-8">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="mt-4 h-64 rounded-lg" />
      </div>
    </LoadingRegion>
  );
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
            ? "We couldn’t load this fabric right now"
            : `We couldn’t load this ${scope} right now`}
        </h1>
        <p className="mt-3 text-body text-ink-3 text-pretty">
          The application shell and your session are still available. Try this
          content again or continue browsing fabrics.
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
