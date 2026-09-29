import {
  AsYouType,
  parsePhoneNumberFromString,
  type CountryCode as PhoneIso,
} from "libphonenumber-js";
import { phoneCountryByIso } from "./countries";

export function nationalDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatNationalInput(
  value: string,
  iso: string,
): string {
  const formatter = new AsYouType(iso.toUpperCase() as PhoneIso);
  return formatter.input(nationalDigits(value));
}

export function toE164(
  nationalOrFull: string,
  iso: string,
): string | null {
  const country = phoneCountryByIso(iso);
  if (!country) return null;
  const trimmed = nationalOrFull.trim();
  if (!trimmed) return null;

  const parsed =
    parsePhoneNumberFromString(trimmed, iso.toUpperCase() as PhoneIso) ??
    parsePhoneNumberFromString(
      trimmed.startsWith("+") ? trimmed : `${country.dialCode}${nationalDigits(trimmed)}`,
    );

  if (!parsed || !parsed.isValid()) return null;
  if (parsed.country === "IL") return null;
  return parsed.format("E.164");
}

export function splitE164(
  e164: string | null | undefined,
  fallbackIso?: string | null,
): { iso: string; national: string; e164: string | null } {
  const fallback = (fallbackIso && phoneCountryByIso(fallbackIso)?.iso) || "PK";
  if (!e164?.trim()) {
    return { iso: fallback, national: "", e164: null };
  }
  const parsed = parsePhoneNumberFromString(e164.trim());
  if (!parsed || !parsed.isValid() || parsed.country === "IL") {
    return { iso: fallback, national: nationalDigits(e164), e164: null };
  }
  const iso = parsed.country && phoneCountryByIso(parsed.country)
    ? parsed.country
    : fallback;
  return {
    iso,
    national: parsed.nationalNumber,
    e164: parsed.format("E.164"),
  };
}

export function maskPhoneDisplay(e164: string | null | undefined): string {
  if (!e164) return "";
  const parsed = parsePhoneNumberFromString(e164);
  if (!parsed) {
    const digits = nationalDigits(e164);
    if (digits.length < 6) return e164;
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} *** **${digits.slice(-2)}`;
  }
  const national = parsed.nationalNumber;
  if (national.length < 4) return parsed.formatInternational();
  const visibleStart = national.slice(0, Math.min(3, national.length - 2));
  const visibleEnd = national.slice(-2);
  return `${parsed.countryCallingCode ? `+${parsed.countryCallingCode}` : ""} ${visibleStart} *** **${visibleEnd}`.trim();
}

export function isValidPhoneForCountry(
  nationalOrFull: string,
  iso: string,
): boolean {
  return Boolean(toE164(nationalOrFull, iso));
}
