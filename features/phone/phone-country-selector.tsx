"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/cn";
import {
  orderedPhoneCountriesForPicker,
  phoneCountryByIso,
  searchPhoneCountries,
  type PhoneCountry,
} from "./countries";

export function PhoneCountrySelector({
  value,
  onChange,
  disabled = false,
  id,
  label = "Country code",
}: {
  value: string;
  onChange: (iso: string) => void;
  disabled?: boolean;
  id?: string;
  label?: string;
}) {
  const autoId = useId();
  const triggerId = id ?? autoId;
  const listId = `${triggerId}-listbox`;
  const searchId = `${triggerId}-search`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = phoneCountryByIso(value);
  const options = useMemo(() => {
    const base = query.trim()
      ? searchPhoneCountries(query)
      : orderedPhoneCountriesForPicker();
    return base;
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => searchRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(
      `[data-phone-option-index="${activeIndex}"]`,
    );
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open, options]);

  function openPicker() {
    if (disabled) return;
    setActiveIndex(0);
    setOpen(true);
  }

  function choose(country: PhoneCountry) {
    onChange(country.iso);
    setOpen(false);
    setQuery("");
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      openPicker();
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!options.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + options.length) % options.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const next = options[activeIndex];
      if (next) choose(next);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    }
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        id={triggerId}
        disabled={disabled}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? setOpen(false) : openPicker())}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "inline-flex h-11 min-w-[7.25rem] items-center gap-1.5 rounded-sm border border-border bg-paper-raised px-2.5 text-sm text-ink",
          "hover:border-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo/40",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span aria-hidden className="text-base leading-none">
          {selected?.flag ?? "🏳️"}
        </span>
        <span className="font-medium tabular-nums">
          {selected?.dialCode ?? "+"}
        </span>
        <span aria-hidden className="text-ink-4">
          ▾
        </span>
      </button>

      {open ? (
        <div
          className="absolute left-0 z-40 mt-1 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-md border border-rule-2 bg-paper-raised shadow-lg"
          onKeyDown={onListKeyDown}
        >
          <div className="border-b border-rule-2 p-2">
            <label className="sr-only" htmlFor={searchId}>
              Search countries
            </label>
            <input
              ref={searchRef}
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search country or +code"
              className="h-10 w-full rounded-sm border border-border bg-paper px-3 text-sm text-ink focus:border-indigo focus:outline-none"
              autoComplete="off"
            />
          </div>
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="Country calling codes"
            className="max-h-64 overflow-y-auto overscroll-contain py-1"
          >
            {options.length === 0 ? (
              <li className="px-3 py-3 text-sm text-ink-3">
                No countries found.
              </li>
            ) : (
              options.map((country, index) => {
                const active = index === activeIndex;
                const selectedRow = country.iso === value;
                return (
                  <li key={country.iso} role="presentation">
                    <button
                      type="button"
                      role="option"
                      data-phone-option-index={index}
                      aria-selected={selectedRow}
                      className={cn(
                        "flex w-full items-start gap-2 px-3 py-2 text-left text-sm",
                        active ? "bg-indigo/10" : "hover:bg-paper-sunk",
                      )}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => choose(country)}
                    >
                      <span
                        aria-hidden
                        className="mt-0.5 text-base leading-none"
                      >
                        {country.flag}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-ink">
                          {country.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-ink-3">
                          {country.iso} · SMS Verify supported ·{" "}
                          {country.pricingLabel}
                        </span>
                      </span>
                      <span className="shrink-0 font-medium tabular-nums text-ink">
                        {country.dialCode}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
