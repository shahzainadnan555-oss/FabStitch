"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/errors";
import { api } from "@/lib/api/client";
import { OtpInput } from "@/features/auth/otp-input";
import { useSession } from "@/features/auth/session";
import {
  isPhoneVerified,
  sendPhoneOtp,
  verifyPhoneOtp,
  type UserPublic,
} from "./api";
import {
  defaultPhoneCountryIso,
  phoneCountryByIso,
} from "./countries";
import { maskPhoneDisplay, splitE164, toE164 } from "./format";
import { phoneSendErrorMessage, phoneVerifyErrorMessage } from "./messages";
import { PhoneNumberInput } from "./phone-number-input";
import { PhoneVerificationStatus } from "./phone-verification-status";

export type PhoneVerificationPhase =
  | "idle"
  | "sending"
  | "otp-sent"
  | "verifying"
  | "verified"
  | "error"
  | "cooldown";

type Props = {
  initialPhone?: string | null;
  preferredCountry?: string | null;
  title?: string;
  description?: string;
  onVerified?: (user: UserPublic) => void;
  /** When true, hide the already-verified success chrome and only call onVerified. */
  compact?: boolean;
};

export function PhoneVerificationForm({
  initialPhone = null,
  preferredCountry = null,
  title = "Verify your phone number",
  description = "We will send a one-time SMS code to confirm you own this number.",
  onVerified,
  compact = false,
}: Props) {
  const session = useSession();
  const profile = session.profile ?? session.user;
  const split = splitE164(
    initialPhone ?? profile?.phone ?? null,
    preferredCountry ?? profile?.country ?? null,
  );

  const [iso, setIso] = useState(
    () => split.iso || defaultPhoneCountryIso(preferredCountry ?? profile?.country),
  );
  const [national, setNational] = useState(() => split.national);
  const [phase, setPhase] = useState<PhoneVerificationPhase>("idle");
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [resendAvailableAt, setResendAvailableAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const resendIn = Math.max(0, Math.ceil((resendAvailableAt - now) / 1000));
  const alreadyVerified =
    isPhoneVerified(profile) &&
    profile?.phone &&
    toE164(national, iso) === profile.phone;

  if (alreadyVerified && phase !== "verified") {
    return (
      <div className="grid gap-4">
        <div>
          <h2 className="text-h3 font-semibold text-ink">{title}</h2>
          <p className="mt-2 text-sm text-ink-3">
            This phone number is already verified.
          </p>
        </div>
        <PhoneVerificationStatus
          phone={profile?.phone}
          verified
          masked={maskPhoneDisplay(profile?.phone)}
        />
        {onVerified && profile ? (
          <button
            type="button"
            className="h-11 rounded-sm border border-indigo bg-indigo px-5 text-sm font-semibold text-white hover:bg-indigo-hover"
            onClick={() => onVerified(profile)}
          >
            Continue
          </button>
        ) : null}
      </div>
    );
  }

  async function sendCode() {
    if (phase === "sending" || phase === "verifying") return;
    setError(null);
    setNotice(null);
    setFieldError(null);

    if (!phoneCountryByIso(iso)) {
      setFieldError("Please select your country code.");
      setPhase("error");
      return;
    }
    const e164 = toE164(national, iso);
    if (!e164) {
      setFieldError("Enter a valid phone number.");
      setPhase("error");
      return;
    }

    setPhase("sending");
    try {
      const result = await sendPhoneOtp(e164);
      setPendingPhone(result.phone);
      if (result.already_verified && !result.verification_required) {
        const latest =
          (await api
            .get<UserPublic>("/account/profile", { cache: "no-store" })
            .catch(() => null)) ?? profile;
        if (latest) {
          session.setProfile(latest);
          onVerified?.(latest);
        }
        setPhase("verified");
        setNotice("Phone number verified successfully.");
        return;
      }
      setPhase("otp-sent");
      setCode("");
      setNotice(
        result.message ||
          `We sent a 6-digit verification code to ${maskPhoneDisplay(result.phone)}.`,
      );
      setResendAvailableAt(Date.now() + 30_000);
    } catch (caught) {
      setPhase(
        caught instanceof ApiError &&
          (caught.code === "otp_resend_cooldown" || caught.status === 429)
          ? "cooldown"
          : "error",
      );
      setError(phoneSendErrorMessage(caught));
      if (caught instanceof ApiError && caught.retryAfterSeconds) {
        setResendAvailableAt(Date.now() + caught.retryAfterSeconds * 1000);
      }
    }
  }

  async function verifyCode(raw: string) {
    const trimmed = raw.replace(/\D/g, "");
    if (phase === "verifying" || trimmed.length !== 6) return;
    const phone = pendingPhone ?? toE164(national, iso);
    if (!phone) {
      setError("Enter a valid phone number.");
      return;
    }

    setPhase("verifying");
    setError(null);
    try {
      const result = await verifyPhoneOtp(phone, trimmed);
      session.setProfile(result.user);
      setPhase("verified");
      setNotice("Phone number verified successfully.");
      onVerified?.(result.user);
    } catch (caught) {
      setPhase("error");
      setError(phoneVerifyErrorMessage(caught));
      setCode("");
      if (caught instanceof ApiError && caught.retryAfterSeconds) {
        setResendAvailableAt(Date.now() + caught.retryAfterSeconds * 1000);
      }
    }
  }

  if (phase === "verified" && !compact) {
    return (
      <div className="grid gap-4" role="status" aria-live="polite">
        <div>
          <p className="font-mono text-label uppercase text-verified">
            Phone verified
          </p>
          <h2 className="mt-2 text-h3 font-semibold text-ink">
            Phone number verified successfully.
          </h2>
        </div>
        <PhoneVerificationStatus
          phone={pendingPhone ?? profile?.phone}
          verified
          masked={maskPhoneDisplay(pendingPhone ?? profile?.phone)}
        />
      </div>
    );
  }

  if (phase === "otp-sent" || phase === "verifying" || (phase === "error" && pendingPhone)) {
    return (
      <div className="grid gap-5">
        <div>
          <h2 className="text-h3 font-semibold text-ink">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-3">
            We sent a 6-digit verification code to{" "}
            <span className="font-medium text-ink">
              {maskPhoneDisplay(pendingPhone)}
            </span>
          </p>
        </div>

        <OtpInput
          value={code}
          onChange={setCode}
          disabled={phase === "verifying"}
          invalid={Boolean(error)}
          onComplete={verifyCode}
        />

        {error ? (
          <p role="alert" className="rounded-sm border border-alert/35 bg-alert-soft px-3.5 py-3 text-sm text-ink">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p role="status" className="text-sm text-ink-3">
            {notice}
          </p>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={phase === "verifying" || code.replace(/\D/g, "").length !== 6}
            onClick={() => void verifyCode(code)}
            className="h-11 rounded-sm border border-indigo bg-indigo px-5 text-sm font-semibold text-white hover:bg-indigo-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {phase === "verifying" ? "Verifying…" : "Verify phone"}
          </button>
          <button
            type="button"
            disabled={phase === "verifying" || resendIn > 0}
            onClick={() => void sendCode()}
            className="h-11 rounded-sm border border-border bg-paper px-5 text-sm font-semibold text-ink hover:border-indigo hover:text-indigo disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
          </button>
          <button
            type="button"
            disabled={phase === "verifying"}
            onClick={() => {
              setPendingPhone(null);
              setCode("");
              setError(null);
              setNotice(null);
              setPhase("idle");
            }}
            className="h-11 rounded-sm border border-transparent px-5 text-sm font-semibold text-ink-3 hover:text-ink"
          >
            Change number
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-h3 font-semibold text-ink">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-3">{description}</p>
      </div>

      <PhoneNumberInput
        iso={iso}
        national={national}
        onIsoChange={(next) => {
          setIso(next);
          setNational("");
          setFieldError(null);
        }}
        onNationalChange={(next) => {
          setNational(next);
          setFieldError(null);
        }}
        required
        error={fieldError ?? undefined}
        hint="Select your country, then enter the local number without the leading zero if your country uses one."
        disabled={phase === "sending"}
      />

      {error ? (
        <p role="alert" className="rounded-sm border border-alert/35 bg-alert-soft px-3.5 py-3 text-sm text-ink">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        disabled={phase === "sending" || resendIn > 0}
        onClick={() => void sendCode()}
        className="h-11 w-full rounded-sm border border-indigo bg-indigo px-5 text-sm font-semibold text-white hover:bg-indigo-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {phase === "sending"
          ? "Sending…"
          : resendIn > 0
            ? `Wait ${resendIn}s`
            : "Send OTP"}
      </button>
    </div>
  );
}
