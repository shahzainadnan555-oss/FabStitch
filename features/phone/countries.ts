/**
 * Twilio Verify SMS destination countries for FabStitch phone verification.
 *
 * Source model (per Twilio Verify docs and this product brief):
 * - Verify SMS destinations follow Twilio SMS-supported countries, plus China
 * - Israel (IL / +972) is explicitly excluded from FabStitch phone verification
 *
 * Country ISO codes and calling codes come from `libphonenumber-js` metadata.
 * Display names come from `Intl.DisplayNames`.
 *
 * Actual delivery still depends on Twilio Verify Geo Permissions on the
 * account. The UI may list a destination that the backend later rejects.
 */
import {
  getCountries,
  getCountryCallingCode,
  type CountryCode as PhoneIso,
} from "libphonenumber-js";

export type PhoneCountry = {
  iso: string;
  name: string;
  dialCode: string;
  callingCode: string;
  flag: string;
  /** True when Twilio Verify SMS is modeled as available for this ISO. */
  smsVerifySupported: true;
  /** Estimated cost label — never invents FX-converted PKR amounts. */
  pricingLabel: string;
};

/** FabStitch business markets — surfaced first in the phone selector only. */
export const PHONE_POPULAR_ISOS = [
  "US",
  "GB",
  "TR",
  "PK",
  "IN",
  "BD",
  "SG",
] as const;

/** Explicitly excluded from phone verification. */
export const PHONE_EXCLUDED_ISOS = new Set(["IL"]);

function flagEmoji(iso: string): string {
  const code = iso.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "🏳️";
  const points = [...code].map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...points);
}

function buildPhoneCountries(): readonly PhoneCountry[] {
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  const rows: PhoneCountry[] = [];

  for (const iso of getCountries()) {
    if (PHONE_EXCLUDED_ISOS.has(iso)) continue;
    // Skip short / invalid region labels that are not useful in a phone picker.
    const name = names.of(iso);
    if (!name || name === iso) continue;
    let callingCode: string;
    try {
      callingCode = getCountryCallingCode(iso as PhoneIso);
    } catch {
      continue;
    }
    if (!callingCode) continue;
    rows.push({
      iso,
      name,
      dialCode: `+${callingCode}`,
      callingCode,
      flag: flagEmoji(iso),
      smsVerifySupported: true,
      pricingLabel: "Pricing varies by destination",
    });
  }

  rows.sort((left, right) => left.name.localeCompare(right.name, "en"));
  return Object.freeze(rows);
}

export const PHONE_COUNTRIES: readonly PhoneCountry[] = buildPhoneCountries();

const BY_ISO = new Map(PHONE_COUNTRIES.map((row) => [row.iso, row]));

export function phoneCountryByIso(iso: string | null | undefined): PhoneCountry | undefined {
  if (!iso) return undefined;
  return BY_ISO.get(iso.toUpperCase());
}

export function isPhoneCountryIso(value: unknown): value is string {
  return typeof value === "string" && BY_ISO.has(value.toUpperCase());
}

export function defaultPhoneCountryIso(
  preferred?: string | null,
): string {
  const fromPreferred = preferred
    ? phoneCountryByIso(preferred)?.iso
    : undefined;
  if (fromPreferred) return fromPreferred;
  return phoneCountryByIso("PK")?.iso ?? PHONE_COUNTRIES[0]?.iso ?? "US";
}

export function searchPhoneCountries(query: string): readonly PhoneCountry[] {
  const q = query.trim().toLowerCase();
  if (!q) return PHONE_COUNTRIES;
  const digits = q.replace(/[^\d+]/g, "");
  return PHONE_COUNTRIES.filter((country) => {
    if (country.name.toLowerCase().includes(q)) return true;
    if (country.iso.toLowerCase().includes(q)) return true;
    if (digits && country.dialCode.includes(digits.replace(/^\+/, ""))) {
      return true;
    }
    if (digits && country.dialCode.replace("+", "").startsWith(digits.replace(/^\+/, ""))) {
      return true;
    }
    if (q.startsWith("+") && country.dialCode.startsWith(q)) return true;
    return false;
  });
}

export function orderedPhoneCountriesForPicker(): readonly PhoneCountry[] {
  const popular = PHONE_POPULAR_ISOS.map((iso) => phoneCountryByIso(iso)).filter(
    (row): row is PhoneCountry => Boolean(row),
  );
  const popularSet = new Set(popular.map((row) => row.iso));
  const rest = PHONE_COUNTRIES.filter((row) => !popularSet.has(row.iso));
  return [...popular, ...rest];
}

export function assertNoIsraelInPhoneCountries(): void {
  if (PHONE_COUNTRIES.some((row) => row.iso === "IL" || row.dialCode === "+972")) {
    throw new Error("Israel must never appear in phone verification countries");
  }
}
