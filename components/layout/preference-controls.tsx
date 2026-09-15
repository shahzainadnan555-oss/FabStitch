"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  type CountryCode,
  type CurrencyCode,
} from "@/features/preferences/market";
import { useMarketPreferences } from "@/features/preferences/market-preferences";
import { cn } from "@/lib/cn";

type Option<T extends string> = {
  value: T;
  label: string;
  shortLabel: string;
};

function PreferenceMenu<T extends string>({
  label,
  value,
  options,
  onChange,
  mobile,
  disabled = false,
}: {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  mobile?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    const selected = Math.max(
      options.findIndex((option) => option.value === value),
      0,
    );
    optionRefs.current[selected]?.focus();

    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open, options, value]);

  const moveFocus = (direction: 1 | -1) => {
    const current = optionRefs.current.findIndex(
      (option) => option === document.activeElement,
    );
    const next =
      (Math.max(current, 0) + direction + options.length) % options.length;
    optionRefs.current[next]?.focus();
  };

  return (
    <div ref={root} className={cn("relative", mobile && "min-w-0")}>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "inline-flex items-center justify-between gap-1.5 rounded-xs border border-transparent text-sm font-medium text-ink-2 transition-colors hover:border-rule-2 hover:bg-paper-sunk hover:text-indigo",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo",
          mobile ? "h-11 w-full px-3" : "h-9 px-2.5",
        )}
      >
        <span>{label}</span>
        <span className="font-mono text-[0.69rem] text-ink-4">{value}</span>
      </button>

      {open ? (
        <div
          id={`${id}-menu`}
          role="menu"
          aria-label={`${label} preference`}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
              trigger.current?.focus();
            } else if (event.key === "ArrowDown") {
              event.preventDefault();
              moveFocus(1);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              moveFocus(-1);
            } else if (event.key === "Home") {
              event.preventDefault();
              optionRefs.current[0]?.focus();
            } else if (event.key === "End") {
              event.preventDefault();
              optionRefs.current.at(-1)?.focus();
            }
          }}
          className={cn(
            "absolute z-50 mt-1 min-w-56 overflow-hidden rounded-sm border border-rule-2 bg-paper-raised p-1.5 shadow-card",
            mobile ? "right-0 left-0" : "right-0",
          )}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="menuitemradio"
              aria-checked={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
                trigger.current?.focus();
              }}
              className={cn(
                "flex min-h-10 w-full items-center justify-between gap-5 rounded-xs px-3 py-2 text-left text-sm text-ink hover:bg-indigo-wash hover:text-indigo",
                "focus-visible:bg-indigo-wash focus-visible:text-indigo focus-visible:outline-none",
                option.value === value && "bg-paper-sunk font-semibold",
              )}
            >
              <span>{option.label}</span>
              <span className="font-mono text-xs text-ink-4">
                {option.shortLabel}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PreferenceControls({ mobile = false }: { mobile?: boolean }) {
  const {
    country,
    currency,
    countries,
    currencies,
    loadingOptions,
    pending,
    setCountry,
    setCurrency,
    error,
    retry,
    clearError,
  } = useMarketPreferences();
  const countryOptions: Option<CountryCode>[] = countries.map((item) => ({
    value: item.code,
    label: item.name,
    shortLabel: item.code,
  }));
  const currencyOptions: Option<CurrencyCode>[] = currencies.map((item) => ({
    value: item.code,
    label: item.name,
    shortLabel: item.code,
  }));

  return (
    <div
      className={cn(
        "relative",
        mobile ? "grid grid-cols-2 gap-2" : "flex shrink-0 items-center",
      )}
    >
      <PreferenceMenu
        label="Country"
        value={country}
        options={countryOptions}
        onChange={setCountry}
        mobile={mobile}
        disabled={loadingOptions || pending}
      />
      <PreferenceMenu
        label="Currency"
        value={currency}
        options={currencyOptions}
        onChange={setCurrency}
        mobile={mobile}
        disabled={loadingOptions || pending}
      />

      {error ? (
        <div
          role="status"
          className={cn(
            "z-40 rounded-sm border border-caution-soft bg-paper-raised p-3 text-xs leading-relaxed text-ink-2 shadow-card",
            mobile ? "col-span-2" : "absolute top-11 right-0 w-72",
          )}
        >
          <p>{error.message}</p>
          <div className="mt-2 flex gap-3">
            {error.retryable ? (
              <button
                type="button"
                onClick={retry}
                className="font-semibold text-indigo hover:underline"
              >
                Retry
              </button>
            ) : null}
            <button
              type="button"
              onClick={clearError}
              className="text-ink-3 hover:text-ink"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
