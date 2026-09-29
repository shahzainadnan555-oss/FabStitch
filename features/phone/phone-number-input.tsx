"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import { phoneCountryByIso } from "./countries";
import { formatNationalInput, toE164 } from "./format";
import { PhoneCountrySelector } from "./phone-country-selector";

export function PhoneNumberInput({
  iso,
  national,
  onIsoChange,
  onNationalChange,
  disabled = false,
  invalid = false,
  required = false,
  name = "phone",
  label = "Phone number",
  hint,
  error,
  id,
  showLabel = true,
}: {
  iso: string;
  national: string;
  onIsoChange: (iso: string) => void;
  onNationalChange: (national: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  name?: string;
  label?: string;
  hint?: string;
  error?: string;
  id?: string;
  showLabel?: boolean;
}) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const country = phoneCountryByIso(iso);
  const e164 = toE164(national, iso);

  return (
    <div className="grid gap-1.5">
      {showLabel ? (
        <span className="font-mono text-label font-medium uppercase text-ink-3">
          {label}
          {required ? <span className="sr-only"> (required)</span> : null}
        </span>
      ) : null}
      <div className="flex gap-2">
        <PhoneCountrySelector
          value={iso}
          onChange={onIsoChange}
          disabled={disabled}
        />
        <input
          id={inputId}
          name={name}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required={required}
          disabled={disabled}
          value={national}
          placeholder={country ? `e.g. local number for ${country.name}` : "Phone number"}
          aria-invalid={invalid || Boolean(error) || undefined}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          onChange={(event) =>
            onNationalChange(formatNationalInput(event.target.value, iso))
          }
          className={cn(
            "h-11 min-w-0 flex-1 rounded-sm border bg-paper-raised px-3.5 text-body text-ink",
            "focus:border-indigo focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo/30",
            invalid || error ? "border-alert" : "border-border",
            disabled && "cursor-not-allowed opacity-60",
          )}
        />
      </div>
      <input type="hidden" name={`${name}_e164`} value={e164 ?? ""} readOnly />
      {hint ? (
        <span id={hintId} className="text-xs text-ink-3">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} role="alert" className="text-xs font-medium text-alert">
          {error}
        </span>
      ) : null}
      {country ? (
        <p className="text-xs text-ink-3">
          Estimated SMS verification cost: {country.pricingLabel}
        </p>
      ) : null}
    </div>
  );
}
