"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { IconCheck, IconMore } from "@/components/ui/icon";
import { Label } from "@/components/ui/typography";
import { CUSTOMER_CATALOG_SORT_OPTIONS } from "@/lib/customer-catalog-presentation";
import { useFilterParams } from "./filters";

/**
 * The marketplace options menu.
 *
 * Every entry here changes the request the server makes, which is the only
 * reason any of them are here: the sort values are the API's own list, and a
 * value it does not accept is refused with a 400 rather than ignored, so an
 * invented option would not degrade quietly - it would break the page.
 *
 * Built on `<details>` because the element already does the work a menu needs:
 * Enter and Space toggle it, focus moves through the items with Tab, and the
 * open state survives without a hook. Escape and outside-click are the two
 * behaviours it does not provide, so those are added rather than the whole
 * thing being rebuilt on a div.
 */
export function MarketplaceOptions({ className }: { className?: string }) {
  const { params, set, clearAll } = useFilterParams();
  const menu = useRef<HTMLDetailsElement>(null);

  const activeSort = params.get("sort") ?? "relevance";

  // Anything other than paging counts as a filter, so "Reset" can say whether
  // it would actually do something rather than sitting there always enabled.
  const hasFilters = Array.from(params.keys()).some((key) => key !== "page");

  useEffect(() => {
    const element = menu.current;
    if (!element) return;

    const close = () => element.removeAttribute("open");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && element.open) {
        close();
        element.querySelector("summary")?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (element.open && !element.contains(event.target as Node)) close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const choose = (value: string) => {
    set({ sort: value === "relevance" ? null : value });
    menu.current?.removeAttribute("open");
  };

  return (
    <details ref={menu} className={cn("relative", className)}>
      <summary
        aria-haspopup="menu"
        aria-label="Marketplace options"
        className={cn(
          "grid size-8 cursor-pointer place-items-center rounded-sm border border-border bg-paper-raised text-ink-2",
          "list-none transition-colors hover:border-indigo hover:text-indigo",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo",
          "[&::-webkit-details-marker]:hidden",
        )}
      >
        <IconMore width={15} height={15} />
      </summary>

      <div
        role="menu"
        className="absolute right-0 z-30 mt-1 w-56 rounded-sm border border-rule-2 bg-paper-raised p-1 shadow-md"
      >
        <p className="px-2 pt-1.5 pb-1">
          <Label>Sort</Label>
        </p>

        {CUSTOMER_CATALOG_SORT_OPTIONS.map((option) => {
          const selected = option.value === activeSort;
          return (
            <button
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={selected}
              onClick={() => choose(option.value)}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-xs px-2 py-1.5 text-left text-sm",
                "hover:bg-indigo-soft hover:text-indigo focus-visible:bg-indigo-soft focus-visible:text-indigo focus-visible:outline-none",
                selected ? "font-medium text-ink" : "text-ink-2",
              )}
            >
              {option.label}
              {selected ? (
                <IconCheck width={13} height={13} className="text-indigo" />
              ) : null}
            </button>
          );
        })}

        <div className="mt-1 border-t border-rule pt-1">
          <button
            type="button"
            role="menuitem"
            disabled={!hasFilters}
            onClick={() => {
              clearAll();
              menu.current?.removeAttribute("open");
            }}
            className={cn(
              "w-full rounded-xs px-2 py-1.5 text-left text-sm",
              hasFilters
                ? "text-ink-2 hover:bg-indigo-soft hover:text-indigo focus-visible:bg-indigo-soft focus-visible:text-indigo focus-visible:outline-none"
                : "cursor-not-allowed text-ink-4",
            )}
          >
            Reset filters
          </button>
        </div>
      </div>
    </details>
  );
}
