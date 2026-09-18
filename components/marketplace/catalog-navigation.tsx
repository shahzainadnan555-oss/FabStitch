"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type MouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FabStitchPageLoader } from "@/components/brand/fabstitch-loader";
import { cn } from "@/lib/cn";

type CatalogNavigationValue = {
  /** True while a catalog dataset replacement is in flight. */
  isPending: boolean;
  push: (href: string, options?: { scroll?: boolean }) => void;
  /** Called once the server result for `key` has rendered. */
  commitDataset: (key: string) => void;
};

const CatalogNavigationContext = createContext<CatalogNavigationValue | null>(
  null,
);

function isMarketplaceCatalogPath(pathname: string): boolean {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return normalized === "/marketplace";
}

/**
 * Soft catalog navigation.
 *
 * One transition owns marketplace dataset changes: filters, sort, next,
 * previous, and page size. router.push runs inside startTransition so the
 * previous grid stays until the next payload is ready. A newer navigation
 * discards the older one in the App Router queue. The full-viewport loader
 * stays up for that real pending period — no minimum delay.
 */
export function CatalogNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitionPending, startTransition] = useTransition();
  const [historyPending, setHistoryPending] = useState(false);
  const lastCommitted = useRef<string | null>(null);
  const commitVersion = useRef(0);
  const pendingSince = useRef(0);
  const historyPendingRef = useRef(false);
  const seenHistoryUrl = useRef<string | null>(null);
  const onMarketplace = isMarketplaceCatalogPath(pathname);

  if (!onMarketplace && historyPending) {
    setHistoryPending(false);
  }

  const endHistory = useCallback(() => {
    historyPendingRef.current = false;
    setHistoryPending(false);
  }, []);

  const push = useCallback(
    (href: string, options?: { scroll?: boolean }) => {
      const next = new URL(href, window.location.href);
      seenHistoryUrl.current = `${next.pathname}${next.search}`;
      startTransition(() => {
        router.push(href, { scroll: options?.scroll ?? false });
      });
    },
    [router],
  );

  const commitDataset = useCallback(
    (key: string) => {
      const changed = lastCommitted.current !== key;
      lastCommitted.current = key;
      commitVersion.current += 1;
      if (
        historyPendingRef.current &&
        changed &&
        commitVersion.current > pendingSince.current
      ) {
        endHistory();
      }
    },
    [endHistory],
  );

  useEffect(() => {
    seenHistoryUrl.current = `${window.location.pathname}${window.location.search}`;
    const onPopState = () => {
      const nextUrl = `${window.location.pathname}${window.location.search}`;
      if (!isMarketplaceCatalogPath(window.location.pathname)) {
        historyPendingRef.current = false;
        setHistoryPending(false);
        seenHistoryUrl.current = nextUrl;
        return;
      }
      if (nextUrl === seenHistoryUrl.current) return;
      seenHistoryUrl.current = nextUrl;
      pendingSince.current = commitVersion.current;
      historyPendingRef.current = true;
      setHistoryPending(true);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const isPending = isTransitionPending || (historyPending && onMarketplace);

  const value = useMemo(
    () => ({
      isPending,
      push,
      commitDataset,
    }),
    [commitDataset, isPending, push],
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
  const commitDataset = useCallback(() => {}, []);

  if (value) return value;

  return {
    isPending,
    push: fallbackPush,
    commitDataset,
  };
}

/** Full-viewport loader while any marketplace dataset transition is pending. */
export function CatalogPendingBoundary({
  children,
  label = "Updating fabrics",
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  const { isPending } = useCatalogNavigation();

  useEffect(() => {
    if (!isPending) return;
    const root = document.documentElement;
    const previousBody = document.body.style.overflow;
    const previousRoot = root.style.overflow;
    document.body.style.overflow = "hidden";
    root.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBody;
      root.style.overflow = previousRoot;
    };
  }, [isPending]);

  return (
    <div aria-busy={isPending || undefined}>
      <div inert={isPending || undefined} aria-hidden={isPending || undefined}>
        {children}
      </div>
      {isPending ? <FabStitchPageLoader label={label} /> : null}
    </div>
  );
}

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  );
}

/**
 * Catalog pagination anchor.
 *
 * Keeps a real href for sharing and the back button, but primary clicks go
 * through the shared catalog transition so Next, Previous, and page size
 * show the same loader as filters.
 */
export function CatalogTransitionLink({
  href,
  className,
  children,
  rel,
  ariaCurrent,
  ariaLabel,
  scroll = true,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  rel?: string;
  ariaCurrent?: "page" | "true" | "false" | boolean;
  ariaLabel?: string;
  scroll?: boolean;
}) {
  const { isPending, push } = useCatalogNavigation();

  return (
    <Link
      href={href}
      rel={rel}
      scroll={scroll}
      aria-current={ariaCurrent}
      aria-label={ariaLabel}
      aria-disabled={isPending || undefined}
      className={cn(className, isPending && "pointer-events-none")}
      onClick={(event) => {
        if (isModifiedClick(event)) return;
        event.preventDefault();
        if (isPending) return;
        const next = new URL(href, window.location.href);
        if (
          next.pathname === window.location.pathname &&
          next.search === window.location.search
        ) {
          return;
        }
        push(href, { scroll });
      }}
    >
      {children}
    </Link>
  );
}

/** Marks a marketplace result set as committed so history loading can end. */
export function CatalogDatasetCommit({ datasetKey }: { datasetKey: string }) {
  const { commitDataset } = useCatalogNavigation();

  useEffect(() => {
    commitDataset(datasetKey);
  }, [commitDataset, datasetKey]);

  return null;
}
