"use client";

import type { CountryCode, CurrencyCode } from "./market";
import { useMarketPreferences } from "./market-preferences";

export function AccountMarketPreferences() {
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
  } = useMarketPreferences();

  return (
    <section
      aria-labelledby="market-preferences-heading"
      className="rounded-md border border-rule-2 bg-paper-raised p-5"
    >
      <h2
        id="market-preferences-heading"
        className="text-h3 font-semibold text-ink"
      >
        Country and currency
      </h2>
      <p className="mt-2 max-w-[66ch] text-sm leading-relaxed text-ink-3">
        These settings are saved to your account. Currency is display and
        transaction context only; prices are never converted using an invented
        exchange rate.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Country
          <select
            value={country}
            disabled={loadingOptions || pending}
            onChange={(event) => setCountry(event.target.value as CountryCode)}
            className="h-11 rounded-sm border border-border bg-paper px-3 font-normal text-ink"
          >
            {countries.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Currency
          <select
            value={currency}
            disabled={loadingOptions || pending}
            onChange={(event) =>
              setCurrency(event.target.value as CurrencyCode)
            }
            className="h-11 rounded-sm border border-border bg-paper px-3 font-normal text-ink"
          >
            {currencies.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name} ({item.code})
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <div
          role="status"
          className="mt-4 flex flex-wrap items-center gap-3 rounded-sm border border-caution-soft bg-caution-soft px-3 py-2 text-sm text-ink-2"
        >
          <span>{error.message}</span>
          {error.retryable ? (
            <button
              type="button"
              onClick={retry}
              className="font-semibold text-indigo hover:underline"
            >
              Retry
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
