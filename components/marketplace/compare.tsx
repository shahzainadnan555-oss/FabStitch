"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/button";
import { Label } from "@/components/ui/typography";
import { IconArrowRight, IconClose } from "@/components/ui/icon";

/**
 * Comparison selection.
 *
 * Comparability *is* the product - the whole reason a buyer uses a marketplace
 * instead of emailing twenty mills is that listings line up in columns. So
 * selection is global, survives navigation, and is always visible once
 * something is selected.
 *
 * Persisted to sessionStorage rather than a URL: a comparison set is a working
 * state, not a shareable page, and it must not leak into crawlable URLs.
 */

const MAX_COMPARE = 4;
const STORAGE_KEY = "fabstitch.compare";

type CompareContextValue = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  full: boolean;
};

const CompareContext = createContext<CompareContextValue | null>(null);

/* --------------------------------------------------------------------------
 sessionStorage as an external store.
 `useSyncExternalStore` is the correct primitive here: reading storage in an
 effect and calling setState would cascade an extra render on every mount and
 risks a hydration mismatch. This also keeps two tabs in step for free.
 -------------------------------------------------------------------------- */

const EMPTY: string[] = [];
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedIds: string[] = EMPTY;

function readIds(): string[] {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  // Return a stable reference unless the stored value actually changed -
  // getSnapshot must not allocate, or React loops.
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedIds = raw ? (JSON.parse(raw) as string[]) : EMPTY;
    } catch {
      cachedIds = EMPTY;
    }
  }
  return cachedIds;
}

function writeIds(next: string[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable - selection simply does not persist */
  }
  cachedRaw = JSON.stringify(next);
  cachedIds = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const ids = useSyncExternalStore(subscribe, readIds, () => EMPTY);

  const toggle = useCallback((id: string) => {
    const current = readIds();
    if (current.includes(id)) {
      writeIds(current.filter((x) => x !== id));
    } else if (current.length < MAX_COMPARE) {
      writeIds([...current, id]);
    }
  }, []);

  const value = useMemo<CompareContextValue>(
    () => ({
      ids,
      has: (id) => ids.includes(id),
      toggle,
      remove: (id) => writeIds(readIds().filter((x) => x !== id)),
      clear: () => writeIds([]),
      full: ids.length >= MAX_COMPARE,
    }),
    [ids, toggle],
  );

  return (
    <CompareContext.Provider value={value}>
      {children}
      <CompareTray />
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used inside CompareProvider");
  }
  return context;
}

/** Checkbox-style toggle placed on every listing card and row. */
export function CompareToggle({
  id,
  label,
  className,
}: {
  id: string;
  label: string;
  className?: string;
}) {
  const { has, toggle, full } = useCompare();
  const selected = has(id);
  const disabled = !selected && full;

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={(event) => {
        // Cards use a stretched link; this control must not follow it.
        event.preventDefault();
        event.stopPropagation();
        toggle(id);
      }}
      title={disabled ? `Comparison holds ${MAX_COMPARE} items` : undefined}
      className={cn(
        "relative z-10 inline-flex items-center gap-1.5 rounded-xs border px-2 py-1",
        "font-mono text-label uppercase tracking-[0.09em] transition-colors",
        // Unselected was a beige chip in the quiet ink tier, which read as a
        // caption rather than a control. It now sits on the card's own surface
        // with a real boundary, and hovers *towards* the navy it becomes when
        // selected - so the state it is heading for is the state it shows.
        selected
          ? "border-indigo bg-indigo text-white hover:bg-indigo-hover"
          : "border-border bg-paper-raised text-ink-2 hover:border-indigo hover:bg-indigo-soft hover:text-indigo",
        disabled && "cursor-not-allowed opacity-45",
        className,
      )}
    >
      <span className="sr-only">
        {selected
          ? `Remove ${label} from comparison`
          : `Add ${label} to comparison`}
      </span>
      <span aria-hidden="true">{selected ? "In compare" : "Compare"}</span>
    </button>
  );
}

/** Persistent selection bar. Appears only once something is selected. */
function CompareTray() {
  const { ids, remove, clear } = useCompare();
  if (!ids.length) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-rule-2 bg-paper-raised shadow-[0_-12px_28px_-24px_rgba(20,22,26,0.5)]">
      <div className="fs-gutter mx-auto flex max-w-[1280px] flex-wrap items-center gap-3 py-3">
        <Label tone="ink">
          Comparing {ids.length}/{MAX_COMPARE}
        </Label>

        <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {ids.map((id) => (
            <li key={id}>
              <span className="inline-flex items-center gap-1 rounded-xs border border-rule-2 bg-paper px-2 py-1 text-xs text-ink-2">
                <span className="max-w-[14rem] truncate">{prettyId(id)}</span>
                <button
                  type="button"
                  onClick={() => remove(id)}
                  className="text-ink-3 hover:text-ink"
                >
                  <span className="sr-only">Remove {prettyId(id)}</span>
                  <IconClose width={11} height={11} />
                </button>
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clear}>
            Clear
          </Button>
          <ButtonLink
            href={`/compare/?ids=${ids.join(",")}`}
            variant="primary"
            size="sm"
            trailing={<IconArrowRight width={13} height={13} />}
          >
            Compare
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

/** Turns a listing slug back into something readable for the tray. */
function prettyId(id: string): string {
  return id
    .replace(/-fs\d+$/, "")
    .replace(/-/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

/** Empty-state helper used by /compare when nothing is selected. */
export function CompareEmptyLink() {
  return (
    <Link href="/fabrics/" className="font-medium text-indigo hover:underline">
      Browse fabrics
    </Link>
  );
}
