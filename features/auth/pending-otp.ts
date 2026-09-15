import type { components } from "@/lib/api/schema";

export type OtpPurpose =
  components["schemas"]["EmailOtpVerifyRequest"]["purpose"];
export type VerificationRequiredResponse =
  components["schemas"]["VerificationRequiredResponse"];
export type AuthSuccessResponse = components["schemas"]["AuthSuccessResponse"];
export type EmailOtpVerifyRequest =
  components["schemas"]["EmailOtpVerifyRequest"];
export type EmailOtpResendRequest =
  components["schemas"]["EmailOtpResendRequest"];

const STORAGE_KEY = "fabstitch:pending-email-otp";

export type PendingEmailOtp = {
  email: string;
  purpose: OtpPurpose;
  expiresAt: number;
  next: string;
};

export function isVerificationRequired(
  value: unknown,
): value is VerificationRequiredResponse {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    record.verification_required === true &&
    typeof record.email === "string" &&
    (record.purpose === "signup" || record.purpose === "login") &&
    typeof record.expires_in_seconds === "number"
  );
}

export function savePendingEmailOtp(
  challenge: VerificationRequiredResponse,
  next: string,
): PendingEmailOtp {
  const pending: PendingEmailOtp = {
    email: challenge.email.trim().toLowerCase(),
    purpose: challenge.purpose,
    expiresAt: Date.now() + Math.max(0, challenge.expires_in_seconds) * 1000,
    next,
  };
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
    } catch {
      // Private browsing / quota — OTP still works for this page session.
    }
  }
  return pending;
}

export function readPendingEmailOtp(
  purpose?: OtpPurpose,
): PendingEmailOtp | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingEmailOtp;
    if (
      !parsed?.email ||
      (parsed.purpose !== "signup" && parsed.purpose !== "login")
    ) {
      clearPendingEmailOtp();
      return null;
    }
    if (purpose && parsed.purpose !== purpose) return null;
    if (parsed.expiresAt <= Date.now()) {
      clearPendingEmailOtp();
      return null;
    }
    return parsed;
  } catch {
    clearPendingEmailOtp();
    return null;
  }
}

export function clearPendingEmailOtp(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
