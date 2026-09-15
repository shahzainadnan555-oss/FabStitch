"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { readPendingEmailOtp } from "@/features/auth/pending-otp";

/**
 * Restores an in-progress email OTP challenge after a refresh or shared link.
 * Authentication itself still requires backend OTP verification.
 */
export default function VerifyEmailCompatibilityPage() {
  const router = useRouter();

  useEffect(() => {
    const pending = readPendingEmailOtp();
    if (!pending) {
      router.replace("/login/");
      return;
    }
    const path = pending.purpose === "signup" ? "/signup/" : "/login/";
    const href =
      pending.next && pending.next !== "/"
        ? `${path}?next=${encodeURIComponent(pending.next)}`
        : path;
    router.replace(href);
  }, [router]);

  return (
    <main className="grid min-h-dvh place-items-center bg-[#f7f6f3] px-6">
      <p className="text-sm text-ink-3" aria-live="polite">
        Returning you to email verification…
      </p>
    </main>
  );
}
