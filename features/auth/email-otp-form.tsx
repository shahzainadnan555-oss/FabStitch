"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { finalizeAuthentication } from "./finalize-authentication";
import { otpErrorMessage, otpResendMessage } from "./messages";
import { OtpInput } from "./otp-input";
import {
  clearPendingEmailOtp,
  savePendingEmailOtp,
  type AuthSuccessResponse,
  type EmailOtpResendRequest,
  type EmailOtpVerifyRequest,
  type VerificationRequiredResponse,
} from "./pending-otp";
import { useSession } from "./session";
import { AuthMessage, AuthSubmitButton } from "./ui";

function formatCountdown(totalSeconds: number): string {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (minutes <= 0) return `${remainder}s`;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export function EmailOtpForm({
  challenge,
  next,
  onChangeEmail,
  onChallengeUpdate,
}: {
  challenge: VerificationRequiredResponse;
  next: string;
  onChangeEmail: () => void;
  onChallengeUpdate: (nextChallenge: VerificationRequiredResponse) => void;
}) {
  const router = useRouter();
  const session = useSession();
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [welcome, setWelcome] = useState<AuthSuccessResponse | null>(null);
  const [expiresAt] = useState(
    () => Date.now() + Math.max(0, challenge.expires_in_seconds) * 1000,
  );
  const [now, setNow] = useState(() => Date.now());
  const [resendAvailableAt, setResendAvailableAt] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const expiresIn = Math.max(0, Math.ceil((expiresAt - now) / 1000));
  const resendIn = Math.max(0, Math.ceil((resendAvailableAt - now) / 1000));

  const verify = async (rawCode: string) => {
    const trimmed = rawCode.replace(/\D/g, "");
    if (pending || trimmed.length !== 6) return;

    setPending(true);
    setError(null);
    setNotice(null);

    const body: EmailOtpVerifyRequest = {
      email: challenge.email,
      code: trimmed,
      purpose: challenge.purpose,
    };

    try {
      const result = await api.post<AuthSuccessResponse, EmailOtpVerifyRequest>(
        "/auth/email/verify-otp",
        { body, retryAuth: false },
      );
      clearPendingEmailOtp();

      if (challenge.purpose === "signup") {
        setWelcome(result);
        setPending(false);
        return;
      }

      await finalizeAuthentication(result.user, session, router, next);
    } catch (requestError) {
      setError(otpErrorMessage(requestError));
      if (requestError instanceof ApiError && requestError.retryAfterSeconds) {
        setResendAvailableAt(
          Date.now() + requestError.retryAfterSeconds * 1000,
        );
      }
      setCode("");
      setPending(false);
    }
  };

  const resend = async () => {
    if (resending || pending || resendIn > 0) return;
    setResending(true);
    setError(null);
    setNotice(null);

    const body: EmailOtpResendRequest = {
      email: challenge.email,
      purpose: challenge.purpose,
    };

    try {
      const result = await api.post<
        VerificationRequiredResponse,
        EmailOtpResendRequest
      >("/auth/email/resend-otp", { body, retryAuth: false });
      savePendingEmailOtp(result, next);
      onChallengeUpdate(result);
      setCode("");
      setNotice("A new verification code has been sent.");
    } catch (requestError) {
      setError(otpResendMessage(requestError));
      if (requestError instanceof ApiError && requestError.retryAfterSeconds) {
        setResendAvailableAt(
          Date.now() + requestError.retryAfterSeconds * 1000,
        );
      }
    } finally {
      setResending(false);
    }
  };

  if (welcome) {
    return (
      <div className="flex flex-col gap-5" role="status" aria-live="polite">
        <div>
          <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-verified uppercase">
            Email verified
          </p>
          <h2 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">
            Welcome to FabStitch
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-3 text-pretty">
            Your account is ready
            {welcome.user.email ? (
              <>
                {" "}
                for{" "}
                <span className="font-medium text-ink">
                  {welcome.user.email}
                </span>
              </>
            ) : null}
            . We&apos;ve also sent a welcome email to your registered email
            address.
          </p>
        </div>
        <AuthSubmitButton
          type="button"
          busy={false}
          onClick={() => {
            void finalizeAuthentication(welcome.user, session, router, next);
          }}
        >
          Continue
        </AuthSubmitButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-mono text-[0.6875rem] tracking-[0.14em] text-ink-4 uppercase">
          Check your inbox
        </p>
        <h2 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.02em] text-ink">
          Verify your email
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-3 text-pretty">
          We&apos;ve sent a 6-digit verification code to
        </p>
        <p className="mt-1 break-all text-sm font-semibold text-ink">
          {challenge.email}
        </p>
        {expiresIn > 0 ? (
          <p className="mt-2 text-xs text-ink-4">
            Code expires in {formatCountdown(expiresIn)}
          </p>
        ) : (
          <p className="mt-2 text-xs font-medium text-alert">
            This code has expired. Request a new code.
          </p>
        )}
      </div>

      {notice ? <AuthMessage tone="notice">{notice}</AuthMessage> : null}
      {error ? <AuthMessage tone="error">{error}</AuthMessage> : null}

      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          void verify(code);
        }}
        noValidate
      >
        <OtpInput
          value={code}
          onChange={setCode}
          disabled={pending}
          invalid={Boolean(error)}
          onComplete={(nextCode) => {
            void verify(nextCode);
          }}
        />

        <AuthSubmitButton
          busy={pending}
          disabled={code.replace(/\D/g, "").length !== 6}
          pendingLabel="Verifying your code…"
        >
          Verify email
        </AuthSubmitButton>
      </form>

      <div className="flex flex-col gap-3 border-t border-rule pt-4 text-sm">
        <button
          type="button"
          onClick={() => void resend()}
          disabled={resending || pending || resendIn > 0}
          className="text-left font-semibold text-indigo hover:underline disabled:cursor-not-allowed disabled:text-ink-4 disabled:no-underline"
        >
          {resending
            ? "Sending a new code…"
            : resendIn > 0
              ? `Resend code in ${formatCountdown(resendIn)}`
              : "Resend code"}
        </button>
        <button
          type="button"
          onClick={onChangeEmail}
          disabled={pending || resending}
          className="text-left font-medium text-ink-3 hover:text-ink hover:underline disabled:cursor-not-allowed"
        >
          Change email
        </button>
        <button
          type="button"
          onClick={onChangeEmail}
          disabled={pending || resending}
          className="text-left font-medium text-ink-3 hover:text-ink hover:underline disabled:cursor-not-allowed"
        >
          Back
        </button>
      </div>
    </div>
  );
}
