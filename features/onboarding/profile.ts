import { safeReturnPath } from "@/features/auth/return-to";

export function onboardingHref(next?: string | null): string {
  const requested = safeReturnPath(next);
  return requested === "/"
    ? "/onboarding/"
    : `/onboarding/?next=${encodeURIComponent(requested)}`;
}
