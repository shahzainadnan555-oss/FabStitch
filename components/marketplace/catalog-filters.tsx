"use client";

import { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type {
  CatalogFacetBucket,
  CustomerCatalogFacets,
  CustomerCatalogSort,
} from "@/repositories/customer-catalog";
import { CUSTOMER_CATALOG_SORT_LABELS } from "@/lib/customer-catalog-presentation";
import { useCatalogNavigation } from "@/components/marketplace/catalog-navigation";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { IconClose, IconFilter } from "@/components/ui/icon";
import { Label } from "@/components/ui/typography";
import { trackGaEvent } from "@/lib/analytics/ga4";

const FACET_KEYS = [
  "family",
  "fiber",
  "collection",
  "season",
  "application",
  "best_for",
  "construction",
  "color",
  "pattern",
  "finish",
  "texture",
  "stretch",
  "weight_class",
] as const;

const RANGE_KEYS = [
  "weight_min",
  "weight_max",
  "width_min",
  "width_max",
] as const;

const FILTER_KEYS = [...FACET_KEYS, ...RANGE_KEYS] as const;

const FILTER_LABELS: Record<(typeof FILTER_KEYS)[number], string> = {
  family: "Family",
  fiber: "Fiber",
  collection: "Collection",
  season: "Season",
  application: "Application",
  best_for: "Best for",
  construction: "Construction",
  color: "Color",
  pattern: "Pattern",
  finish: "Finish",
  texture: "Texture",
  stretch: "Stretch",
  weight_class: "Weight class",
  weight_min: "GSM from",
  weight_max: "GSM to",
  width_min: "Width from",
  width_max: "Width to",
};

function title(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function FilterGroup({
  label,
  filterKey,
  options,
  draft,
  onToggle,
}: {
  label: string;
  filterKey: string;
  options: CatalogFacetBucket[];
  draft: URLSearchParams;
  onToggle: (key: string, value: string) => void;
}) {
  if (!options.length) return null;
  const selected = new Set(draft.getAll(filterKey));
  return (
    <fieldset className="min-w-0">
      <legend>
        <Label tone="ink">{label}</Label>
      </legend>
      <div className="mt-2 max-h-40 space-y-1 overflow-y-auto pr-1">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-ink-2"
          >
            <input
              type="checkbox"
              checked={selected.has(option.value)}
              onChange={() => onToggle(filterKey, option.value)}
              className="size-4 shrink-0 accent-[var(--color-indigo)]"
            />
            <span className="min-w-0 flex-1 truncate">{option.label}</span>
            {option.count !== undefined ? (
              <span className="font-mono text-label tabular-nums text-ink-4">
                {option.count}
              </span>
            ) : null}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RangeField({
  label,
  name,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (key: string, value: string | null) => void;
}) {
  return (
    <label className="grid gap-2">
      <Label tone="ink">{label}</Label>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(name, event.target.value || null)}
        className="h-11 rounded-sm border border-border bg-paper-raised px-3 font-mono text-sm text-ink"
      />
    </label>
  );
}

export function CatalogResultsToolbar({
  total,
  visible,
  facets,
  defaultSort,
}: {
  total: number | null;
  visible: number;
  facets: CustomerCatalogFacets;
  defaultSort: CustomerCatalogSort;
}) {
  const { push: navigate } = useCatalogNavigation();
  const pathname = usePathname();
  const current = useSearchParams();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => new URLSearchParams(current));

  const active = useMemo(
    () =>
      FILTER_KEYS.flatMap((key) =>
        current.getAll(key).map((value) => ({ key, value })),
      ),
    [current],
  );

  const push = (params: URLSearchParams) => {
    params.delete("cursor");
    params.delete("page");
    const query = params.toString();
    navigate(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const setCurrent = (key: string, value: string | null) => {
    const next = new URLSearchParams(current);
    next.delete(key);
    if (value) next.set(key, value);
    push(next);
  };

  const removeCurrent = (key: string, value: string) => {
    const next = new URLSearchParams(current);
    const remaining = next.getAll(key).filter((item) => item !== value);
    next.delete(key);
    remaining.forEach((item) => next.append(key, item));
    push(next);
  };

  const setDraftValue = (key: string, value: string | null) => {
    setDraft((previous) => {
      const next = new URLSearchParams(previous);
      next.delete(key);
      if (value) next.set(key, value);
      return next;
    });
  };

  const toggleDraftValue = (key: string, value: string) => {
    setDraft((previous) => {
      const next = new URLSearchParams(previous);
      const values = next.getAll(key);
      next.delete(key);
      (values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value]
      ).forEach((item) => next.append(key, item));
      return next;
    });
  };

  const openFilters = () => {
    setDraft(new URLSearchParams(current));
    setOpen(true);
  };

  const clearFilters = () => {
    setDraft((previous) => {
      const next = new URLSearchParams(previous);
      FILTER_KEYS.forEach((key) => next.delete(key));
      return next;
    });
  };

  const availableSorts = facets.sorts.length
    ? facets.sorts
    : ([defaultSort] as CustomerCatalogSort[]);
  const selectedSort = current.get("sort") ?? defaultSort;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3">
        <p className="font-mono text-sm tabular-nums text-ink">
          {(total ?? visible).toLocaleString("en")}{" "}
          <span className="text-ink-3">
            {total === null ? "shown" : total === 1 ? "fabric" : "fabrics"}
          </span>
        </p>
        <div className="flex items-center gap-2">
          <label>
            <span className="sr-only">Sort fabrics</span>
            <select
              value={selectedSort}
              onChange={(event) =>
                setCurrent(
                  "sort",
                  event.target.value === defaultSort
                    ? null
                    : event.target.value,
                )
              }
              className="h-9 rounded-sm border border-border bg-paper-raised px-3 text-xs text-ink"
            >
              {availableSorts.map((sort) => (
                <option key={sort} value={sort}>
                  {CUSTOMER_CATALOG_SORT_LABELS[sort]}
                </option>
              ))}
            </select>
          </label>
          <Button
            variant="secondary"
            size="sm"
            leading={<IconFilter width={14} height={14} aria-hidden />}
            onClick={openFilters}
            aria-label={
              active.length
                ? `Filter fabrics, ${active.length} active`
                : "Filter fabrics"
            }
          >
            Filter{active.length ? ` ${active.length}` : ""}
          </Button>
        </div>
      </div>

      {active.length ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Label>Filtered by</Label>
          {active.map(({ key, value }) => (
            <Chip
              key={`${key}-${value}`}
              facet={FILTER_LABELS[key]}
              value={title(value)}
              removeLabel={`Remove ${FILTER_LABELS[key]} ${title(value)} filter`}
              onRemove={() => removeCurrent(key, value)}
            />
          ))}
          <button
            type="button"
            onClick={() => {
              const next = new URLSearchParams(current);
              FILTER_KEYS.forEach((key) => next.delete(key));
              push(next);
            }}
            className="text-xs font-semibold text-indigo hover:underline"
          >
            Clear all
          </button>
        </div>
      ) : null}

      {open ? (
        <Dialog
          open
          onClose={() => setOpen(false)}
          label="Filter the fabric catalog"
          className="mr-0 h-[100dvh] max-h-[100dvh] max-w-[34rem] rounded-none border-y-0 border-r-0 sm:h-[min(48rem,92dvh)] sm:max-h-[92dvh] sm:rounded-l-lg"
        >
          <div className="flex min-h-0 w-full flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-rule px-5 py-4">
              <div>
                <Label tone="ink">Filter fabrics</Label>
                <p className="mt-1 text-xs text-ink-3">
                  Options and counts come from the current catalog.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-sm text-ink-3 hover:bg-paper-sunk hover:text-ink"
              >
                <span className="sr-only">Close filters</span>
                <IconClose width={17} height={17} aria-hidden />
              </button>
            </div>

            <div className="grid min-h-0 flex-1 gap-6 overflow-y-auto px-5 py-5 sm:grid-cols-2">
              <FilterGroup
                label="Collection"
                filterKey="collection"
                options={facets.collection}
                draft={draft}
                onToggle={toggleDraftValue}
              />
              <FilterGroup
                label="Fiber"
                filterKey="fiber"
                options={facets.fiber}
                draft={draft}
                onToggle={toggleDraftValue}
              />
              <FilterGroup
                label="Family"
                filterKey="family"
                options={facets.family}
                draft={draft}
                onToggle={toggleDraftValue}
              />
              <FilterGroup
                label="Best for"
                filterKey="best_for"
                options={facets.bestFor}
                draft={draft}
                onToggle={toggleDraftValue}
              />
              <FilterGroup
                label="Application"
                filterKey="application"
                options={facets.application}
                draft={draft}
                onToggle={toggleDraftValue}
              />
              <FilterGroup
                label="Construction"
                filterKey="construction"
                options={facets.construction}
                draft={draft}
                onToggle={toggleDraftValue}
              />
              <FilterGroup
                label="Season"
                filterKey="season"
                options={facets.season}
                draft={draft}
                onToggle={toggleDraftValue}
              />
              <FilterGroup
                label="Stretch"
                filterKey="stretch"
                options={facets.stretch}
                draft={draft}
                onToggle={toggleDraftValue}
              />
              <FilterGroup
                label="Finish"
                filterKey="finish"
                options={facets.finish}
                draft={draft}
                onToggle={toggleDraftValue}
              />
              <FilterGroup
                label="Texture"
                filterKey="texture"
                options={facets.texture}
                draft={draft}
                onToggle={toggleDraftValue}
              />
              <FilterGroup
                label="Color"
                filterKey="color"
                options={facets.color}
                draft={draft}
                onToggle={toggleDraftValue}
              />
              <FilterGroup
                label="Pattern"
                filterKey="pattern"
                options={facets.pattern}
                draft={draft}
                onToggle={toggleDraftValue}
              />
              <FilterGroup
                label="Weight class"
                filterKey="weight_class"
                options={facets.weightClass}
                draft={draft}
                onToggle={toggleDraftValue}
              />
              <RangeField
                label="Minimum GSM"
                name="weight_min"
                value={draft.get("weight_min") ?? ""}
                placeholder={facets.gsmRange?.[0].toString() ?? "From"}
                onChange={setDraftValue}
              />
              <RangeField
                label="Maximum GSM"
                name="weight_max"
                value={draft.get("weight_max") ?? ""}
                placeholder={facets.gsmRange?.[1].toString() ?? "To"}
                onChange={setDraftValue}
              />
              <RangeField
                label="Minimum width (cm)"
                name="width_min"
                value={draft.get("width_min") ?? ""}
                placeholder={facets.widthRange?.[0].toString() ?? "From"}
                onChange={setDraftValue}
              />
              <RangeField
                label="Maximum width (cm)"
                name="width_max"
                value={draft.get("width_max") ?? ""}
                placeholder={facets.widthRange?.[1].toString() ?? "To"}
                onChange={setDraftValue}
              />
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-rule bg-paper-raised p-4">
              <Button variant="secondary" size="lg" onClick={clearFilters}>
                Clear
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  const next = new URLSearchParams(draft);
                  const used = FILTER_KEYS.filter((key) => next.has(key));
                  if (used.length) {
                    trackGaEvent("filter_used", {
                      filter_count: used.length,
                      filter_keys: used.join(","),
                      page_path: pathname,
                    });
                  }
                  push(next);
                  setOpen(false);
                }}
              >
                Apply filters
              </Button>
            </div>
          </div>
        </Dialog>
      ) : null}
    </>
  );
}
