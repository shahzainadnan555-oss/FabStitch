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

export type LoginErrorView = {
  message: string;
  missingAccount: boolean;
  signupHref?: string;
};

export function loginErrorView(
  error: unknown,
  returnTo: string,
): LoginErrorView {
  if (error instanceof ApiError && MISSING_ACCOUNT_CODES.has(error.code)) {
    return {
      message: "This account doesn't exist.",
      missingAccount: true,
      signupHref: signupHref(returnTo),
    };
  }
  if (error instanceof ApiError && error.code === "invalid_credentials") {
    return {
      message: error.message || "Email or password is incorrect.",
      missingAccount: false,
    };
  }
  return {
    message:
      error instanceof ApiError
        ? error.message
        : "FabStitch could not complete this request. Try again.",
    missingAccount: false,
  };
}

export function signupErrorMessage(error: unknown): string {
  if (error instanceof ApiError && EXISTING_ACCOUNT_CODES.has(error.code)) {
    return "An account with this email already exists. Sign in to continue.";
  }
  return error instanceof ApiError
    ? error.message
    : "FabStitch could not complete this request. Try again.";
}

export function googleAuthErrorMessage(code?: string | null): string {
  if (!code) return "Google sign-in couldn't be completed. Please try again.";
  const normalized = code.toLowerCase();
  if (normalized === "access_denied") {
    return "Google sign-in was cancelled. You can try again or continue with email.";
  }
  return "Google sign-in couldn't be completed. Please try again.";
}
