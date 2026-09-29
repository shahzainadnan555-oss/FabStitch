import { ApiError, apiErrorMessage } from "@/lib/api/errors";

const COOLDOWN = new Set([
  "otp_resend_cooldown",
  "rate_limited",
  "too_many_requests",
  "rate_limit_exceeded",
]);

const INVALID = new Set([
  "otp_invalid",
  "invalid_otp",
  "invalid_code",
  "code_invalid",
  "otp_mismatch",
]);

const EXPIRED = new Set(["otp_expired", "code_expired", "expired_otp"]);

const UNSUPPORTED = new Set([
  "unsupported_phone_region",
  "unsupported_destination",
  "destination_not_supported",
  "60605",
]);

const TAKEN = new Set(["phone_taken", "phone_conflict"]);

export function phoneSendErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (COOLDOWN.has(error.code) || error.status === 429) {
      return "Please wait before requesting another code.";
    }
    if (UNSUPPORTED.has(error.code)) {
      return "Phone verification is currently unavailable for this destination. Please try another supported number.";
    }
    if (error.code === "invalid_phone" || error.status === 422) {
      return "Enter a valid phone number.";
    }
    if (TAKEN.has(error.code)) {
      return "This phone number is already verified on another account.";
    }
    if (
      error.code === "twilio_delivery_failed" ||
      error.code === "twilio_timeout" ||
      error.code === "twilio_not_configured" ||
      error.status >= 500
    ) {
      return "We couldn't send a verification code to this number. Please check the number and try again.";
    }
    if (error.status === 401) {
      return "Your session has expired. Please sign in again.";
    }
  }
  return apiErrorMessage(
    error,
    "We couldn't send a verification code right now. Please try again.",
  );
}

export function phoneVerifyErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (INVALID.has(error.code)) {
      return "That code is not correct. Please try again.";
    }
    if (EXPIRED.has(error.code)) {
      return "That code has expired. Request a new one.";
    }
    if (error.code === "otp_attempts_exceeded") {
      return "Too many attempts. Please request a new code.";
    }
    if (TAKEN.has(error.code)) {
      return "This phone number is already verified on another account.";
    }
    if (COOLDOWN.has(error.code) || error.status === 429) {
      return "Please wait before trying again.";
    }
    if (error.status === 401 && !INVALID.has(error.code)) {
      // Backend uses 401 for invalid OTP as well as session expiry.
      if (error.code === "unauthorized") {
        return "Your session has expired. Please sign in again.";
      }
      return "That code is not correct. Please try again.";
    }
  }
  return apiErrorMessage(
    error,
    "We couldn't verify that code. Please try again.",
  );
}
