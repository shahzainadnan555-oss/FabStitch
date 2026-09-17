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
import { FabStitchPageLoader } from "@/components/brand/fabstitch-loader";

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
 * route until the next RSC payload is ready, while showing one full-viewport
 * FabStitch loader for the pending request.
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

/** Full-viewport loader while a catalog filter/sort transition is pending. */
export function CatalogPendingBoundary({
  children,
  label = "Updating fabrics",
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  const { isPending } = useCatalogNavigation();

  return (
    <>
      {children}
      {isPending ? <FabStitchPageLoader label={label} /> : null}
    </>
  );
}
