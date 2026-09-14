import { isCountryCode, type CountryCode } from "@/features/preferences/market";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s().-]{7,22}$/;
const QUANTITY_MAX = 1_000_000;

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

export function parseQuantity(value: string): number | null {
  const next = trimmed(value);
  if (!next) return null;
  const quantity = Number(next);
  if (!Number.isFinite(quantity) || quantity <= 0 || quantity > QUANTITY_MAX) {
    return null;
  }
  return quantity;
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
  if (parseQuantity(input.quantity) === null) {
    errors.quantity = "Enter a valid quantity.";
  }
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
