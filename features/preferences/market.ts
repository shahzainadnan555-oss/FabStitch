import type { components } from "@/lib/api/schema";

/**
 * Customer-facing market preferences.
 *
 * These are product-approved display options, not the marketplace's supply
 * countries and not an exchange-rate table. Keep them separate from the
 * taxonomy: changing where FabStitch has inventory must never silently add an
 * account preference.
 */
export const SUPPORTED_MARKETS = [
  {
    countryCode: "US",
    countryName: "United States",
    defaultCurrency: "USD",
    dialCode: "+1",
    address: {
      cityLabel: "City",
      regionLabel: "State",
      regionRequired: true,
      postalLabel: "ZIP Code",
    },
  },
  {
    countryCode: "GB",
    countryName: "United Kingdom",
    defaultCurrency: "GBP",
    dialCode: "+44",
    address: {
      cityLabel: "Town / City",
      regionLabel: null,
      regionRequired: false,
      postalLabel: "Postcode",
    },
  },
  {
    countryCode: "TR",
    countryName: "Turkey",
    defaultCurrency: "TRY",
    dialCode: "+90",
    address: {
      cityLabel: "City",
      regionLabel: "Province",
      regionRequired: false,
      postalLabel: "Postal Code",
    },
  },
  {
    countryCode: "PK",
    countryName: "Pakistan",
    defaultCurrency: "PKR",
    dialCode: "+92",
    address: {
      cityLabel: "City",
      regionLabel: "Province / Region",
      regionRequired: false,
      postalLabel: "Postal Code",
    },
  },
  {
    countryCode: "IN",
    countryName: "India",
    defaultCurrency: "INR",
    dialCode: "+91",
    address: {
      cityLabel: "City",
      regionLabel: "State / Union Territory",
      regionRequired: true,
      postalLabel: "PIN Code",
    },
  },
  {
    countryCode: "BD",
    countryName: "Bangladesh",
    defaultCurrency: "BDT",
    dialCode: "+880",
    address: {
      cityLabel: "City",
      regionLabel: "Division / Region",
      regionRequired: false,
      postalLabel: "Postal Code",
    },
  },
  {
    countryCode: "SG",
    countryName: "Singapore",
    defaultCurrency: "SGD",
    dialCode: "+65",
    address: {
      cityLabel: "City",
      regionLabel: null,
      regionRequired: false,
      postalLabel: "Postal Code",
    },
  },
] as const;

export type CountryCode = components["schemas"]["CountryCode"];
export type CurrencyCode = components["schemas"]["CurrencyCode"];

export const SUPPORTED_CURRENCIES = [
  "USD",
  "GBP",
  "TRY",
  "PKR",
  "INR",
  "BDT",
  "SGD",
] as const satisfies readonly CurrencyCode[];

export const DEFAULT_COUNTRY: CountryCode = "US";
export const DEFAULT_CURRENCY: CurrencyCode = "USD";

const COUNTRY_CODES = new Set<string>(
  SUPPORTED_MARKETS.map((market) => market.countryCode),
);
const CURRENCY_CODES = new Set<string>(SUPPORTED_CURRENCIES);

export function isCountryCode(value: unknown): value is CountryCode {
  return typeof value === "string" && COUNTRY_CODES.has(value);
}

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === "string" && CURRENCY_CODES.has(value);
}

export function defaultCurrencyForCountry(country: CountryCode): CurrencyCode {
  return (
    SUPPORTED_MARKETS.find((market) => market.countryCode === country)
      ?.defaultCurrency ?? DEFAULT_CURRENCY
  );
}

export function marketForCountry(country: CountryCode) {
  return (
    SUPPORTED_MARKETS.find((market) => market.countryCode === country) ??
    SUPPORTED_MARKETS[0]
  );
}

/**
 * Format an amount only in the currency the source record actually states.
 *
 * The selected customer currency is deliberately not accepted here. Until an
 * approved rate source exists, converting an amount would fabricate a price.
 */
export function formatSourceCurrency(
  amount: number,
  sourceCurrency: CurrencyCode,
  locale = "en",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: sourceCurrency,
    currencyDisplay: "code",
    maximumFractionDigits: 2,
  }).format(amount);
}
