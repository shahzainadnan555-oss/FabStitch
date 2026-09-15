"use client";

import { useCallback, useState } from "react";
import { GoogleAuthSection } from "./google-auth-section";
import type { AuthProvider } from "./providers";
import { RedirectIfAuthenticated } from "./redirect-if-authenticated";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";

/** Keeps Google OAuth off the OTP step — Google never uses FabStitch email OTP. */
export function SignInExperience({
  next,
  providers,
  googleError,
  justReset,
}: {
  next: string;
  providers: AuthProvider[];
  googleError?: string | null;
  justReset?: boolean;
}) {
  const [otpActive, setOtpActive] = useState(false);
  const onOtpActiveChange = useCallback((active: boolean) => {
    setOtpActive(active);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <RedirectIfAuthenticated next={next} disabled={otpActive} />
      <SignInForm
        next={next}
        justReset={justReset}
        onOtpActiveChange={onOtpActiveChange}
      />
      {!otpActive ? (
        <GoogleAuthSection providers={providers} error={googleError} />
      ) : null}
    </div>
  );
}

export function SignUpExperience({
  next,
  providers,
  googleError,
}: {
  next: string;
  providers: AuthProvider[];
  googleError?: string | null;
}) {
  const [otpActive, setOtpActive] = useState(false);
  const onOtpActiveChange = useCallback((active: boolean) => {
    setOtpActive(active);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <RedirectIfAuthenticated next={next} disabled={otpActive} />
      <SignUpForm next={next} onOtpActiveChange={onOtpActiveChange} />
      {!otpActive ? (
        <GoogleAuthSection providers={providers} error={googleError} />
      ) : null}
    </div>
  );
}
