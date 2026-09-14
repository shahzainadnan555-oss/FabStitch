"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import type { Facets } from "@/repositories/fabrics";
import { CUSTOMER_CATALOG_SORT_OPTIONS } from "@/lib/customer-catalog-presentation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/typography";
import { Chip } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import {
  IconChevronDown,
  IconClose,
  IconFilter,
  IconGrid,
  IconRows,
} from "@/components/ui/icon";

/**
 * The sourcing filter system.
 *
 * State lives entirely in the URL, which is what makes a filtered view
 * shareable, back-button-correct, and - critically - *separable from the
 * index*: filter states stay in query parameters and never mint crawlable
 * paths. Only combinations promoted by the indexability gate get a clean
 * directory (docs/ARCHITECTURE.md §6).
 *
 * Three tiers of progressive disclosure, per the research:
 * 1 always open - the seven a sourcing manager reaches for first
 * 2 collapsed - narrows an already-relevant set
 * 3 technical - decisive for technical buyers, noise for everyone else
 */

export function useFilterParams() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const set = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(updates)) {
        next.delete(key);
        if (value === null || value === "") continue;
        if (Array.isArray(value)) value.forEach((v) => next.append(key, v));
        else next.set(key, value);
      }
      // Any filter change returns to page one; staying on page 4 of a
      // now-shorter result set is a dead end.
      next.delete("page");
      const query = next.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const clearAll = useCallback(() => {
    const next = new URLSearchParams();
    for (const key of ["q", "sort", "view"]) {
      const value = params.get(key);
      if (value) next.set(key, value);
    }
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [params, pathname, router]);

  return { params, set, clearAll };
}

/* ==========================================================================
 Active filters - removable chips
 ========================================================================== */

const FACET_LABEL: Record<string, string> = {
  material: "Fabric",
  node: "Fabric",
  family: "Collection",
  construction: "Construction",
  country: "Origin",
  fabric_type: "Type",
  gsm_min: "GSM from",
  gsm_max: "GSM to",
  moq_max: "Max MOQ",
  country_code: "Origin",
  stock_status: "Stock",
  stretch: "Stretch",
  sample_available: "Sample",
  use_case: "For",
};

const VALUE_LABEL: Record<string, string> = {
  true: "Required",
  in_stock: "In stock",
  low_stock: "Low stock",
  made_to_order: "Made to order",
};

export function ActiveFilters({ className }: { className?: string }) {
  const { params, set, clearAll } = useFilterParams();

  const active = useMemo(() => {
    const out: {
      key: string;
      value: string;
      label: string;
      display: string;
    }[] = [];
    for (const [key, value] of params.entries()) {
      if (
        key === "page" ||
        key === "sort" ||
        key === "view" ||
        key === "q" ||
        key === "certification" ||
        key === "verified_supplier" ||
        !value
      )
        continue;
      out.push({
        key,
        value,
        label: FACET_LABEL[key] ?? key,
        display: VALUE_LABEL[value] ?? humanise(value),
      });
    }
    return out;
  }, [params]);

  if (!active.length) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Label>Filtered by</Label>
      {active.map((entry) => (
        <Chip
          key={`${entry.key}-${entry.value}`}
          facet={entry.label}
          value={entry.display}
          removeLabel={`Remove ${entry.label} ${entry.display}`}
          onRemove={() => set({ [entry.key]: null })}
        />
      ))}
      <button
        type="button"
        onClick={clearAll}
        className="text-xs font-medium text-indigo underline-offset-4 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}

function humanise(value: string): string {
  return value.replace(/[-_]/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

/* ==========================================================================
 Facet panel
 ========================================================================== */

function FacetGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-rule py-3.5">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <Label tone="ink">{title}</Label>
        <IconChevronDown
          width={13}
          height={13}
          className={cn(
            "text-ink-3 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 accent-[var(--color-indigo)]"
      />
      <span className="min-w-0 flex-1 truncate text-sm text-ink-2">
        {label}
      </span>
      {count !== undefined ? (
        <span className="font-mono text-label tabular-nums text-ink-4">
          {count}
        </span>
      ) : null}
    </label>
  );
}

export function FacetPanel({
  facets,
  className,
}: {
  facets: Facets;
  className?: string;
}) {
  const { params, set } = useFilterParams();

  const gsmMin = params.get("gsm_min") ?? "";
  const gsmMax = params.get("gsm_max") ?? "";

  return (
    <div className={cn("text-sm", className)}>
      {/* Tier 1 - always open */}
      {facets.material.length ? (
        <FacetGroup title="Fabric">
          {facets.material.map((bucket) => (
            <CheckRow
              key={bucket.value}
              label={bucket.label}
              count={bucket.count}
              checked={params.get("material") === bucket.value}
              onChange={() =>
                set({
                  material:
                    params.get("material") === bucket.value
                      ? null
                      : bucket.value,
                })
              }
            />
          ))}
        </FacetGroup>
      ) : null}

      {facets.construction.length ? (
        <FacetGroup title="Construction">
          {facets.construction.map((bucket) => (
            <CheckRow
              key={bucket.value}
              label={bucket.label}
              count={bucket.count}
              checked={params.get("construction") === bucket.value}
              onChange={() =>
                set({
                  construction:
                    params.get("construction") === bucket.value
                      ? null
                      : bucket.value,
                })
              }
            />
          ))}
        </FacetGroup>
      ) : null}

      <FacetGroup title="Weight (GSM)">
        {facets.gsmRange ? (
          <p className="mb-2 font-mono text-label uppercase tracking-[0.09em] text-ink-4">
            Available {facets.gsmRange[0]}-{facets.gsmRange[1]}
          </p>
        ) : null}
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            aria-label="Minimum GSM"
            placeholder={facets.gsmRange ? String(facets.gsmRange[0]) : "From"}
            defaultValue={gsmMin}
            onBlur={(e) => set({ gsm_min: e.target.value || null })}
            className="h-9 w-full rounded-sm border border-border bg-paper-raised px-2 font-mono text-sm tabular-nums"
          />
          <span aria-hidden="true" className="text-ink-4">
            -
          </span>
          <input
            type="number"
            inputMode="numeric"
            aria-label="Maximum GSM"
            placeholder={facets.gsmRange ? String(facets.gsmRange[1]) : "To"}
            defaultValue={gsmMax}
            onBlur={(e) => set({ gsm_max: e.target.value || null })}
            className="h-9 w-full rounded-sm border border-border bg-paper-raised px-2 font-mono text-sm tabular-nums"
          />
        </div>
      </FacetGroup>

      <FacetGroup title="Minimum order">
        <p className="mb-2 text-xs text-ink-3">
          Show only listings you could actually order at your quantity.
        </p>
        <input
          type="number"
          inputMode="numeric"
          aria-label="Maximum MOQ"
          placeholder="Your quantity"
          defaultValue={params.get("moq_max") ?? ""}
          onBlur={(e) => set({ moq_max: e.target.value || null })}
          className="h-9 w-full rounded-sm border border-border bg-paper-raised px-2 font-mono text-sm tabular-nums"
        />
      </FacetGroup>

      {facets.country.length ? (
        <FacetGroup title="Origin">
          {facets.country.map((bucket) => (
            <CheckRow
              key={bucket.value}
              label={bucket.label}
              count={bucket.count}
              checked={params.get("country_code") === bucket.value}
              onChange={() =>
                set({
                  country_code:
                    params.get("country_code") === bucket.value
                      ? null
                      : bucket.value,
                })
              }
            />
          ))}
        </FacetGroup>
      ) : null}

      {/* Tier 2 - collapsed by default */}
      <FacetGroup title="Availability" defaultOpen={false}>
        {facets.stock.map((bucket) => (
          <CheckRow
            key={bucket.value}
            label={bucket.label}
            count={bucket.count}
            checked={params.get("stock_status") === bucket.value}
            onChange={() =>
              set({
                stock_status:
                  params.get("stock_status") === bucket.value
                    ? null
                    : bucket.value,
              })
            }
          />
        ))}
      </FacetGroup>

      <FacetGroup title="Availability & samples" defaultOpen={false}>
        <CheckRow
          label="Sample available"
          checked={params.get("sample_available") === "true"}
          onChange={() =>
            set({
              sample_available:
                params.get("sample_available") === "true" ? null : "true",
            })
          }
        />
        <CheckRow
          label="Stretch"
          checked={params.get("stretch") === "true"}
          onChange={() =>
            set({ stretch: params.get("stretch") === "true" ? null : "true" })
          }
        />
      </FacetGroup>
    </div>
  );
}

/* ==========================================================================
 Toolbar + mobile drawer
 ========================================================================== */

const MARKETPLACE_FILTER_KEYS = [
  "material",
  "node",
  "family",
  "construction",
  "fabric_type",
  "gsm_min",
  "gsm_max",
  "moq_max",
  "country",
  "country_code",
  "stock_status",
  "sample_available",
  "stretch",
] as const;

function MarketplaceFilterDrawer({
  open,
  onClose,
  facets,
  total,
  noun,
}: {
  open: boolean;
  onClose: () => void;
  facets: Facets;
  total: number;
  noun: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const current = useSearchParams();
  const [draft, setDraft] = useState(
    () => new URLSearchParams(current.toString()),
  );

  const setOne = (key: string, value: string | null) => {
    setDraft((previous) => {
      const next = new URLSearchParams(previous);
      next.delete(key);
      if (value) next.set(key, value);
      next.delete("page");
      return next;
    });
  };

  const clearFilters = () => {
    setDraft((previous) => {
      const next = new URLSearchParams(previous);
      MARKETPLACE_FILTER_KEYS.forEach((key) => next.delete(key));
      next.delete("page");
      return next;
    });
  };

  const apply = () => {
    const query = draft.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    onClose();
  };

  const stockOptions = facets.stock.length
    ? facets.stock
    : [
        { value: "in_stock", label: "In stock", count: undefined },
        { value: "made_to_order", label: "Made to order", count: undefined },
      ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      label="Filter fabrics"
      className="mr-0 h-[100dvh] max-h-[100dvh] max-w-[27rem] rounded-none border-y-0 border-r-0 sm:h-[min(48rem,92dvh)] sm:max-h-[92dvh] sm:rounded-l-lg"
    >
      <div className="flex min-h-0 w-full flex-col">
        <div className="flex items-center justify-between border-b border-rule px-5 py-4">
          <div>
            <Label tone="ink">Filter fabrics</Label>
            <p className="mt-1 text-xs text-ink-3">
              Refine the catalogue, then apply once.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-sm text-ink-3 transition-colors hover:bg-paper-sunk hover:text-ink"
          >
            <span className="sr-only">Close filters</span>
            <IconClose width={17} height={17} aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5">
          {facets.material.length ? (
            <FacetGroup title="Material">
              {facets.material.map((bucket) => (
                <CheckRow
                  key={bucket.value}
                  label={bucket.label}
                  count={bucket.count}
                  checked={draft.get("material") === bucket.value}
                  onChange={() =>
                    setOne(
                      "material",
                      draft.get("material") === bucket.value
                        ? null
                        : bucket.value,
                    )
                  }
                />
              ))}
            </FacetGroup>
          ) : null}

          <FacetGroup title="Fabric type">
            {[
              ["knitted", "Knitted"],
              ["woven", "Woven"],
              ["non_woven", "Non-woven"],
            ].map(([value, label]) => (
              <CheckRow
                key={value}
                label={label}
                checked={draft.get("fabric_type") === value}
                onChange={() =>
                  setOne(
                    "fabric_type",
                    draft.get("fabric_type") === value ? null : value,
                  )
                }
              />
            ))}
          </FacetGroup>

          {facets.construction.length ? (
            <FacetGroup title="Construction">
              {facets.construction.map((bucket) => (
                <CheckRow
                  key={bucket.value}
                  label={bucket.label}
                  count={bucket.count}
                  checked={draft.get("construction") === bucket.value}
                  onChange={() =>
                    setOne(
                      "construction",
                      draft.get("construction") === bucket.value
                        ? null
                        : bucket.value,
                    )
                  }
                />
              ))}
            </FacetGroup>
          ) : null}

          <FacetGroup title="Weight (GSM)">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                aria-label="Minimum GSM"
                placeholder={
                  facets.gsmRange ? String(facets.gsmRange[0]) : "From"
                }
                value={draft.get("gsm_min") ?? ""}
                onChange={(event) =>
                  setOne("gsm_min", event.target.value || null)
                }
                className="h-10 min-w-0 rounded-sm border border-border bg-paper-raised px-2 font-mono text-sm tabular-nums"
              />
              <span aria-hidden className="text-ink-4">
                –
              </span>
              <input
                type="number"
                inputMode="numeric"
                aria-label="Maximum GSM"
                placeholder={
                  facets.gsmRange ? String(facets.gsmRange[1]) : "To"
                }
                value={draft.get("gsm_max") ?? ""}
                onChange={(event) =>
                  setOne("gsm_max", event.target.value || null)
                }
                className="h-10 min-w-0 rounded-sm border border-border bg-paper-raised px-2 font-mono text-sm tabular-nums"
              />
            </div>
          </FacetGroup>

          <FacetGroup title="Maximum minimum order">
            <input
              type="number"
              inputMode="numeric"
              aria-label="Maximum minimum order quantity"
              placeholder="Your quantity"
              value={draft.get("moq_max") ?? ""}
              onChange={(event) =>
                setOne("moq_max", event.target.value || null)
              }
              className="h-10 w-full rounded-sm border border-border bg-paper-raised px-3 font-mono text-sm tabular-nums"
            />
          </FacetGroup>

          {facets.country.length ? (
            <FacetGroup title="Origin" defaultOpen={false}>
              {facets.country.map((bucket) => (
                <CheckRow
                  key={bucket.value}
                  label={bucket.label}
                  count={bucket.count}
                  checked={
                    (draft.get("country") ?? draft.get("country_code")) ===
                    bucket.value
                  }
                  onChange={() =>
                    setOne(
                      "country",
                      (draft.get("country") ?? draft.get("country_code")) ===
                        bucket.value
                        ? null
                        : bucket.value,
                    )
                  }
                />
              ))}
            </FacetGroup>
          ) : null}

          <FacetGroup title="Availability" defaultOpen={false}>
            {stockOptions.map((bucket) => (
              <CheckRow
                key={bucket.value}
                label={bucket.label}
                count={bucket.count}
                checked={draft.get("stock_status") === bucket.value}
                onChange={() =>
                  setOne(
                    "stock_status",
                    draft.get("stock_status") === bucket.value
                      ? null
                      : bucket.value,
                  )
                }
              />
            ))}
            <CheckRow
              label="Sample available"
              checked={draft.get("sample_available") === "true"}
              onChange={() =>
                setOne(
                  "sample_available",
                  draft.get("sample_available") === "true" ? null : "true",
                )
              }
            />
            <CheckRow
              label="Stretch"
              checked={draft.get("stretch") === "true"}
              onChange={() =>
                setOne(
                  "stretch",
                  draft.get("stretch") === "true" ? null : "true",
                )
              }
            />
          </FacetGroup>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-rule bg-paper-raised p-4">
          <Button variant="secondary" size="lg" onClick={clearFilters}>
            Clear all
          </Button>
          <Button variant="primary" size="lg" onClick={apply}>
            Show {total.toLocaleString("en")} {noun}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export function ResultsToolbar({
  total,
  facets,
  noun = "listings",
  showView = true,
}: {
  total: number;
  facets: Facets;
  noun?: string;
  showView?: boolean;
}) {
  const { params, set } = useFilterParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const sort = params.get("sort") ?? "relevance";
  const view = params.get("view") === "table" ? "table" : "grid";
  const activeFilterCount = MARKETPLACE_FILTER_KEYS.filter((key) =>
    params.has(key),
  ).length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3">
        <p className="font-mono text-sm tabular-nums text-ink">
          {total.toLocaleString("en")}{" "}
          <span className="text-ink-3">{noun}</span>
        </p>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <span className="sr-only">Sort results</span>
            <select
              value={sort}
              onChange={(e) => set({ sort: e.target.value })}
              className="h-8 cursor-pointer rounded-sm border border-border bg-paper-raised pl-2.5 pr-7 text-xs text-ink"
            >
              {CUSTOMER_CATALOG_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <Button
            variant="secondary"
            size="sm"
            leading={<IconFilter width={14} height={14} />}
            onClick={() => setDrawerOpen(true)}
            aria-label={
              activeFilterCount
                ? `Filter fabrics, ${activeFilterCount} active`
                : "Filter fabrics"
            }
          >
            Filter{activeFilterCount ? ` ${activeFilterCount}` : ""}
          </Button>

          {/* Grid or table. A sourcing manager comparing twenty listings on
              MOQ wants rows; someone judging hand-feel wants the swatch. */}
          {showView ? (
            <div
              role="group"
              aria-label="Result layout"
              className="flex items-center rounded-sm border border-border bg-paper-raised p-0.5"
            >
              {(
                [
                  { id: "grid", label: "Grid", Icon: IconGrid },
                  { id: "table", label: "Table", Icon: IconRows },
                ] as const
              ).map((option) => {
                const active = view === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      set({ view: option.id === "grid" ? null : option.id })
                    }
                    className={cn(
                      "grid size-7 place-items-center rounded-xs transition-colors",
                      active
                        ? "bg-indigo text-white"
                        : "text-ink-3 hover:bg-paper-sunk hover:text-ink",
                    )}
                  >
                    <span className="sr-only">{option.label} view</span>
                    <option.Icon width={14} height={14} />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {drawerOpen ? (
        <MarketplaceFilterDrawer
          open
          onClose={() => setDrawerOpen(false)}
          facets={facets}
          total={total}
          noun={noun}
        />
      ) : null}
    </>
  );
}

/**
 * Catalogue filter bar.
 *
 * The reference mockups put refinement in a row of dropdown pills above the
 * grid rather than in a left rail, because in the workspace the left rail is
 * already navigation. Each pill is a native `<select>` under a custom frame:
 * it is keyboard operable and announces as a listbox for free, and on a phone
 * it opens the platform picker, which is better than anything reimplemented.
 */
function FilterPill({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string; count?: number }[];
  onChange: (value: string) => void;
}) {
  const active = value !== "";
  return (
    <div className="relative">
      <label className="sr-only" htmlFor={`pill-${label}`}>
        {label}
      </label>
      <select
        id={`pill-${label}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-9 cursor-pointer appearance-none rounded-lg border pr-8 pl-3 text-sm transition-colors",
          // A control is not a card. The grid below is white on warm paper, so
          // a white filter reads as one more tile in it and the toolbar
          // dissolves into the results. Chrome sits *flush* with the canvas;
          // only content is raised. Two planes instead of one.
          //
          // `border` rather than `rule-2`: rule-2 is #cfc9be, which is 1.46:1
          // on paper. Fine for a divider, not fine as the only thing defining
          // a control - WCAG 1.4.11 wants 3:1. `--color-border` is 3.31:1 and
          // exists for exactly this.
          active
            ? "border-indigo bg-indigo-soft font-medium text-indigo"
            : "border-border bg-transparent text-ink-2 hover:border-ink-3 hover:bg-paper-raised",
        )}
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
            {option.count === undefined ? "" : ` (${option.count})`}
          </option>
        ))}
      </select>
      <IconChevronDown
        width={13}
        height={13}
        className={cn(
          "pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2",
          active ? "text-indigo" : "text-ink-3",
        )}
      />
    </div>
  );
}

const GSM_BANDS = [
  { value: "0-140", label: "Under 140 GSM" },
  { value: "140-200", label: "140-200 GSM" },
  { value: "200-300", label: "200-300 GSM" },
  { value: "300-9999", label: "Over 300 GSM" },
];

export function CatalogToolbar({
  facets,
  className,
}: {
  facets: Facets;
  className?: string;
}) {
  const { params, set } = useFilterParams();
  const view = params.get("view") === "table" ? "table" : "grid";

  const gsmValue =
    params.get("gsm_min") && params.get("gsm_max")
      ? `${params.get("gsm_min")}-${params.get("gsm_max")}`
      : "";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 xl:flex-nowrap",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <FilterPill
          label="Fabric type"
          value={params.get("fabric_type") ?? ""}
          options={[
            { value: "knitted", label: "Knitted" },
            { value: "woven", label: "Woven" },
            { value: "non_woven", label: "Non-woven" },
          ]}
          onChange={(value) => set({ fabric_type: value || null, page: null })}
        />
        <FilterPill
          label="Material"
          value={params.get("material") ?? ""}
          options={facets.material.map((bucket) => ({
            value: bucket.value,
            label: bucket.label,
            count: bucket.count,
          }))}
          onChange={(value) => set({ material: value || null, page: null })}
        />
        <FilterPill
          label="Construction"
          value={params.get("construction") ?? ""}
          options={facets.construction.map((bucket) => ({
            value: bucket.value,
            label: bucket.label,
            count: bucket.count,
          }))}
          onChange={(value) => set({ construction: value || null, page: null })}
        />
        <FilterPill
          label="GSM"
          value={gsmValue}
          options={GSM_BANDS}
          onChange={(value) => {
            const [min, max] = value ? value.split("-") : [null, null];
            set({ gsm_min: min, gsm_max: max, page: null });
          }}
        />
        <FilterPill
          label="Origin"
          value={params.get("country_code") ?? ""}
          options={facets.country.map((bucket) => ({
            value: bucket.value,
            label: bucket.label,
            count: bucket.count,
          }))}
          onChange={(value) => set({ country_code: value || null, page: null })}
        />
      </div>

      <div className="flex items-center gap-2 xl:ml-auto">
        <div className="relative">
          <label className="sr-only" htmlFor="catalog-sort">
            Sort by
          </label>
          <select
            id="catalog-sort"
            value={params.get("sort") ?? "relevance"}
            onChange={(event) =>
              set({
                sort:
                  event.target.value === "relevance"
                    ? null
                    : event.target.value,
                page: null,
              })
            }
            className="h-9 cursor-pointer appearance-none rounded-lg border border-border bg-transparent pr-8 pl-3 text-sm text-ink-2 transition-colors hover:border-ink-3 hover:bg-paper-raised"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="price_asc">Sort: Price, low to high</option>
            <option value="price_desc">Sort: Price, high to low</option>
            <option value="moq_asc">Sort: MOQ, low to high</option>
            <option value="lead_time_asc">Sort: Lead time</option>
          </select>
          <IconChevronDown
            width={13}
            height={13}
            className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-ink-3"
          />
        </div>

        <div
          role="group"
          aria-label="Result layout"
          className="flex overflow-hidden rounded-lg border border-border"
        >
          {(
            [
              { id: "grid", label: "Grid", Icon: IconGrid },
              { id: "table", label: "Table", Icon: IconRows },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={view === option.id}
              onClick={() =>
                set({ view: option.id === "grid" ? null : "table" })
              }
              className={cn(
                "grid size-9 place-items-center transition-colors",
                view === option.id
                  ? "bg-indigo text-white"
                  : "bg-transparent text-ink-3 hover:bg-paper-raised hover:text-ink",
              )}
            >
              <span className="sr-only">{option.label}</span>
              <option.Icon width={15} height={15} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
