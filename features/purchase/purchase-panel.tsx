"use client";

import { useMemo, useState } from "react";
import { Field, Input, Select } from "@/components/ui/field";
import { IconArrowRight } from "@/components/ui/icon";
import {
  DISPLAY_CURRENCIES,
  purchaseIntentHref,
  type DisplayCurrency,
} from "./purchase-intent";

function uiUnit(unit: string): string {
  const normalized = unit.toLowerCase();
  if (normalized === "kilogram") return "kg";
  if (normalized === "meter" || normalized === "metre") return "m";
  return ["kg", "m", "yard", "piece", "roll"].includes(normalized)
    ? normalized
    : "m";
}

export function PurchasePanel({
  listingSlug,
  application,
  minimum,
  minimumUnit,
  currency,
}: {
  listingSlug: string;
  application?: string;
  minimum: number;
  minimumUnit: string;
  currency?: string;
}) {
  const initialCurrency = DISPLAY_CURRENCIES.includes(
    currency as DisplayCurrency,
  )
    ? (currency as DisplayCurrency)
    : "USD";
  const [quantity, setQuantity] = useState(String(Math.max(1, minimum)));
  const unit = uiUnit(minimumUnit);
  const [displayCurrency, setDisplayCurrency] =
    useState<DisplayCurrency>(initialCurrency);
  const numericQuantity = Number(quantity);
  const valid =
    Number.isFinite(numericQuantity) &&
    numericQuantity > 0 &&
    numericQuantity >= minimum;

  const href = useMemo(
    () =>
      valid
        ? purchaseIntentHref({
            listingSlug,
            application,
            quantity,
            unit,
            currency: displayCurrency,
          })
        : null,
    [application, displayCurrency, listingSlug, quantity, unit, valid],
  );

  return (
    <div className="rounded-md border border-rule-on-navy bg-navy-surface p-5 text-on-ink shadow-[0_24px_65px_-42px_rgba(20,31,56,0.9)]">
      <h2 className="text-h2 font-semibold tracking-[-0.02em]">
        Choose your quantity
      </h2>
      <p className="mt-2 text-sm text-on-navy-2">
        Choose how much you need, then continue with FabStitch.
      </p>

      <div className="mt-5 grid gap-4">
        <Field
          label="Quantity"
          className="[&_label]:text-on-navy-2 [&_p]:text-on-navy-2"
          hint={
            minimum > 0
              ? `Published minimum: ${minimum.toLocaleString("en")} ${minimumUnit}`
              : undefined
          }
        >
          {({ id, describedBy }) => (
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Input
                id={id}
                aria-describedby={describedBy}
                type="number"
                inputMode="decimal"
                min={Math.max(1, minimum)}
                step="any"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                className="border-navy-track bg-navy-surface-2 text-on-ink placeholder:text-on-navy-2"
              />
              <span className="grid min-w-20 place-items-center rounded-sm border border-navy-track bg-navy-surface-2 px-3 text-sm text-on-ink">
                {minimumUnit}
              </span>
            </div>
          )}
        </Field>

        <Field
          label="Select your currency"
          hint="A quote preference only. No exchange rate is applied."
          className="[&_label]:text-on-navy-2 [&_p]:text-on-navy-2"
        >
          {({ id, describedBy }) => (
            <Select
              id={id}
              aria-describedby={describedBy}
              value={displayCurrency}
              onChange={(event) =>
                setDisplayCurrency(event.target.value as DisplayCurrency)
              }
              className="border-navy-track bg-navy-surface-2 text-on-ink"
            >
              {DISPLAY_CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      {href ? (
        <a
          href={href}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-on-ink px-4 text-sm font-semibold text-navy-surface transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Buy now
          <IconArrowRight width={14} height={14} aria-hidden />
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="mt-5 inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-sm bg-navy-track px-4 text-sm font-semibold text-on-navy-2"
        >
          Enter a quantity
        </button>
      )}

      <p className="mt-3 text-xs leading-relaxed text-on-navy-2">
        No payment is taken at this step. FabStitch confirms availability and
        commercial terms before an order is created.
      </p>
    </div>
  );
}
