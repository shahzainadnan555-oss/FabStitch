import { ApiError } from "@/lib/api/errors";
import { signupHref } from "./return-to";

const MISSING_ACCOUNT_CODES = new Set([
  "account_not_found",
  "user_not_found",
  "email_not_found",
]);

const EXISTING_ACCOUNT_CODES = new Set([
  "email_taken",
  "email_already_registered",
  "user_exists",
  "already_registered",
]);

const RATE_LIMIT_CODES = new Set([
  "rate_limited",
  "too_many_requests",
  "rate_limit_exceeded",
]);

export type LoginErrorView = {
  message: string;
  missingAccount: boolean;
  signupHref?: string;
};

function logAuthError(error: unknown): void {
  if (process.env.NODE_ENV === "production") return;
  if (!(error instanceof ApiError)) return;
  console.info("[fabstitch:auth]", error.code, error.requestId ?? "");
}

function fallbackAuthMessage(error: unknown, fallback: string): string {
  if (error instanceof TypeError) {
    return "We couldn’t complete sign-in right now. Please try again.";
  }
  if (!(error instanceof ApiError)) {
    return fallback;
  }
  if (error.status === 429 || RATE_LIMIT_CODES.has(error.code)) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (error.code === "validation_error") {
    return error.message || "Please check the highlighted fields.";
  }
  return error.message || "Something went wrong. Please try again.";
}

export function loginErrorView(
  error: unknown,
  returnTo: string,
): LoginErrorView {
  logAuthError(error);
  if (error instanceof ApiError && MISSING_ACCOUNT_CODES.has(error.code)) {
    return {
      message: "This account doesn’t exist. Please create an account first.",
      missingAccount: true,
      signupHref: signupHref(returnTo),
    };
  }
  if (error instanceof ApiError && error.code === "invalid_credentials") {
    return {
      message: "Incorrect email or password.",
      missingAccount: false,
    };
  }
  return {
    message: fallbackAuthMessage(
      error,
      "We couldn’t complete sign-in right now. Please try again.",
    ),
    missingAccount: false,
  };
}

export function signupErrorMessage(error: unknown): string {
  logAuthError(error);
  if (error instanceof ApiError && EXISTING_ACCOUNT_CODES.has(error.code)) {
    return "An account with this email already exists. Sign in to continue.";
  }
  return fallbackAuthMessage(
    error,
    "We couldn’t complete sign-in right now. Please try again.",
  );
}

export function googleAuthErrorMessage(code?: string | null): string {
  if (!code) {
    return "Google sign-in was not completed. Please try again.";
  }
  const normalized = code.toLowerCase();
  if (normalized === "access_denied") {
    return "Google sign-in was cancelled. You can try again or continue with email.";
  }
  if (
    normalized.includes("unverified") ||
    normalized.includes("email_not_verified")
  ) {
    return "This Google account’s email is not verified, so it cannot be used to sign in to FabStitch.";
  }
  return "Google sign-in was not completed. Please try again.";
}
