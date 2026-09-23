/**
 * Inquiry contact and quantity validation.
 *
 * Quantity ceiling is inclusive: 500,000 meters is valid; 500,001 is not.
 */

import { isCountryCode, type CountryCode } from "@/features/preferences/market";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s().-]{7,22}$/;

/** Inclusive maximum metres per inquiry (frontend + product rule). */
export const INQUIRY_QUANTITY_MAX_METERS = 500_000;

export const INQUIRY_QUANTITY_MAX_HINT =
  "Maximum inquiry quantity: 500,000 meters.";

export const INQUIRY_QUANTITY_MAX_ERROR =
  "Maximum inquiry quantity is 500,000 meters.";

export function trimmed(value: string): string {
  return value.trim();
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(trimmed(value));
}

export function isValidPhone(value: string): boolean {
  const next = trimmed(value);
  if (!PHONE_PATTERN.test(next)) return false;
  const digits = next.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

/**
 * Parse a quantity string for inquiry submission.
 * Returns null when empty, non-numeric, ≤ 0, or above the inclusive maximum.
 */
export function parseQuantity(value: string): number | null {
  const next = trimmed(value);
  if (!next) return null;
  // Reject locale grouping characters so "500,000" is not silently misread.
  if (/[^\d.]/.test(next)) return null;
  const quantity = Number(next);
  if (!Number.isFinite(quantity) || quantity <= 0) return null;
  if (quantity > INQUIRY_QUANTITY_MAX_METERS) return null;
  return quantity;
}

export function quantityFieldError(value: string): string | undefined {
  const next = trimmed(value);
  if (!next) return "Enter a valid quantity.";
  if (/[^\d.]/.test(next)) return "Enter a valid quantity.";
  const quantity = Number(next);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return "Enter a valid quantity.";
  }
  if (quantity > INQUIRY_QUANTITY_MAX_METERS) {
    return INQUIRY_QUANTITY_MAX_ERROR;
  }
  return undefined;
}

export function isSupportedCountry(value: string): value is CountryCode {
  return isCountryCode(value);
}

export type InquiryFieldErrors = {
  quantity?: string;
  email?: string;
  country?: string;
  phone?: string;
  name?: string;
};

export function validateInquiryContact(input: {
  quantity: string;
  email: string;
  country: string;
  phone: string;
  name: string;
  nameRequired: boolean;
}): InquiryFieldErrors {
  const errors: InquiryFieldErrors = {};
  const quantityError = quantityFieldError(input.quantity);
  if (quantityError) errors.quantity = quantityError;
  if (!trimmed(input.email)) {
    errors.email = "Email address is required.";
  } else if (!isValidEmail(input.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!trimmed(input.country)) {
    errors.country = "Select your country.";
  } else if (!isSupportedCountry(input.country)) {
    errors.country = "Select your country.";
  }
  if (!trimmed(input.phone)) {
    errors.phone = "Phone number is required.";
  } else if (!isValidPhone(input.phone)) {
    errors.phone = "Enter a valid phone number.";
  }
  if (input.nameRequired && !trimmed(input.name)) {
    errors.name = "Full name is required.";
  }
  return errors;
}
