"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { FabStitchLoader } from "@/components/brand/fabstitch-loader";
import { cn } from "@/lib/cn";

type CatalogNavigationValue = {
  isPending: boolean;
  push: (href: string, options?: { scroll?: boolean }) => void;
};

const CatalogNavigationContext = createContext<CatalogNavigationValue | null>(
  null,
);

/**
 * Soft catalog navigation.
 *
 * Wraps router.push in startTransition so filter/sort changes keep the current
 * marketplace shell visible until the next RSC payload is ready, instead of
 * flashing a blank Suspense fallback for every query tweak.
 */
export function CatalogNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const push = useCallback(
    (href: string, options?: { scroll?: boolean }) => {
      startTransition(() => {
        router.push(href, { scroll: options?.scroll ?? false });
      });
    },
    [router],
  );

  const value = useMemo(
    () => ({
      isPending,
      push,
    }),
    [isPending, push],
  );

  return (
    <CatalogNavigationContext.Provider value={value}>
      {children}
    </CatalogNavigationContext.Provider>
  );
}

export function useCatalogNavigation(): CatalogNavigationValue {
  const value = useContext(CatalogNavigationContext);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const fallbackPush = useCallback(
    (href: string, options?: { scroll?: boolean }) => {
      startTransition(() => {
        router.push(href, { scroll: options?.scroll ?? false });
      });
    },
    [router],
  );

  if (value) return value;

  return {
    isPending,
    push: fallbackPush,
  };
}

/** Keeps layout; overlays a branded loader while a catalog transition is pending. */
export function CatalogPendingBoundary({
  children,
  className,
  label = "Updating fabrics",
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  const { isPending } = useCatalogNavigation();

  return (
    <div
      className={cn("relative", className)}
      aria-busy={isPending || undefined}
    >
      {children}
      {isPending ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center bg-paper/70 pt-16 backdrop-blur-[1px] sm:pt-20">
          <FabStitchLoader variant="content" label={label} />
        </div>
      ) : null}
    </div>
  );
}
