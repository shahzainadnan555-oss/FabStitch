import { onboardingHref } from "@/features/onboarding/profile";
import { safeReturnPath } from "./return-to";

/** One post-auth destination. Onboarding is required only when the account says so. */
export function postAuthDestination(
  onboardingCompleted: boolean,
  next?: string | null,
): string {
  const requested = safeReturnPath(next);
  if (!onboardingCompleted) {
    return requested.startsWith("/onboarding")
      ? requested
      : onboardingHref(requested);
  }
  if (
    requested === "/" ||
    requested.startsWith("/login") ||
    requested.startsWith("/signin")
  ) {
    return "/marketplace/";
  }
  if (
    requested.startsWith("/signup") ||
    requested.startsWith("/onboarding") ||
    requested.startsWith("/auth") ||
    requested.startsWith("/forgot-password") ||
    requested.startsWith("/reset-password")
  ) {
    return "/marketplace/";
  }
  return requested;
}
