"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";
import { EmailOtpForm } from "./email-otp-form";
import { signupErrorMessage } from "./messages";
import {
  clearPendingEmailOtp,
  isVerificationRequired,
  readPendingEmailOtp,
  savePendingEmailOtp,
  type VerificationRequiredResponse,
} from "./pending-otp";
import {
  AuthField,
  AuthMessage,
  AuthPasswordField,
  AuthSubmitButton,
} from "./ui";

type Schema = components["schemas"];
type SignupRequest = Schema["SignupRequest"];

function formEmail(form: FormData) {
  return String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
}

function fieldErrorsFrom(error: unknown): Record<string, string> {
  if (!(error instanceof ApiError)) return {};
  const fieldErrors: Record<string, string> = {};
  for (const detail of error.details) {
    const field = detail.loc?.at(-1);
    if (typeof field === "string" && detail.msg) {
      fieldErrors[field] = detail.msg;
    }
  }
  return fieldErrors;
}

function restoredChallenge(): VerificationRequiredResponse | null {
  const restored = readPendingEmailOtp("signup");
  if (!restored) return null;
  return {
    authenticated: false,
    verification_required: true,
    email: restored.email,
    purpose: "signup",
    expires_in_seconds: Math.max(
      1,
      Math.ceil((restored.expiresAt - Date.now()) / 1000),
    ),
    message: "Enter the 6-digit verification code sent to your email.",
  };
}

export function SignUpForm({
  next,
  onOtpActiveChange,
}: {
  next: string;
  onOtpActiveChange?: (active: boolean) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [challenge, setChallenge] =
    useState<VerificationRequiredResponse | null>(() => restoredChallenge());
  const [emailDraft, setEmailDraft] = useState(
    () => readPendingEmailOtp("signup")?.email ?? "",
  );
  useEffect(() => {
    onOtpActiveChange?.(Boolean(challenge));
  }, [challenge, onOtpActiveChange]);

  const backToCredentials = () => {
    clearPendingEmailOtp();
    setChallenge(null);
    setError(null);
    setFieldErrors({});
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const form = new FormData(event.currentTarget);
    const email = formEmail(form);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirm") ?? "");

    if (!email.includes("@")) {
      setFieldErrors({ email: "Please enter a valid email address." });
      return;
    }
    if (password.length < 8) {
      setFieldErrors({ password: "Use at least 8 characters." });
      return;
    }
    if (password !== confirmation) {
      setFieldErrors({ confirm: "The two passwords do not match." });
      return;
    }

    const body: SignupRequest = {
      email,
      password,
    };

    setPending(true);
    setError(null);
    setFieldErrors({});
    setEmailDraft(email);

    try {
      const result = await api.post<
        VerificationRequiredResponse,
        SignupRequest
      >("/auth/signup", { body, retryAuth: false });

      if (!isVerificationRequired(result)) {
        setError("Check your email for a verification code to continue.");
        setPending(false);
        return;
      }

      savePendingEmailOtp(result, next);
      setChallenge(result);
      setPending(false);
    } catch (requestError) {
      const fields = fieldErrorsFrom(requestError);
      setFieldErrors(fields);
      setError(
        Object.keys(fields).length > 0
          ? null
          : signupErrorMessage(requestError),
      );
      setPending(false);
    }
  };

  if (challenge) {
    return (
      <EmailOtpForm
        key={`${challenge.email}-${challenge.purpose}-${challenge.expires_in_seconds}`}
        challenge={challenge}
        next={next}
        onChallengeUpdate={(nextChallenge) => {
          savePendingEmailOtp(nextChallenge, next);
          setChallenge(nextChallenge);
        }}
        onChangeEmail={backToCredentials}
      />
    );
  }

  return (
    <form
      key={emailDraft || "sign-up"}
      onSubmit={submit}
      className="flex flex-col gap-5"
      noValidate
    >
      {error ? (
        <AuthMessage tone="error">
          {error}
          {error.includes("already exists") ? (
            <>
              {" "}
              <Link
                href={
                  next === "/"
                    ? "/login/"
                    : `/login/?next=${encodeURIComponent(next)}`
                }
                className="font-semibold text-indigo underline underline-offset-4"
              >
                Sign in
              </Link>
            </>
          ) : null}
        </AuthMessage>
      ) : null}

      <AuthField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        autoFocus
        required
        defaultValue={emailDraft}
        placeholder="you@company.com"
        error={fieldErrors.email}
      />

      <AuthPasswordField
        label="Password"
        autoComplete="new-password"
        minLength={8}
        maxLength={72}
        hint="At least 8 characters."
        error={fieldErrors.password}
      />

      <AuthPasswordField
        label="Confirm password"
        name="confirm"
        autoComplete="new-password"
        minLength={8}
        maxLength={72}
        error={fieldErrors.confirm}
      />

      <AuthSubmitButton busy={pending} pendingLabel="Creating account…">
        Create account
      </AuthSubmitButton>
    </form>
  );
}
