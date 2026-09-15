"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";
import { EmailOtpForm } from "./email-otp-form";
import { finalizeAuthentication } from "./finalize-authentication";
import { loginErrorView } from "./messages";
import {
  clearPendingEmailOtp,
  isVerificationRequired,
  readPendingEmailOtp,
  savePendingEmailOtp,
  type VerificationRequiredResponse,
} from "./pending-otp";
import { useSession } from "./session";
import {
  AuthField,
  AuthMessage,
  AuthPasswordField,
  AuthSubmitButton,
} from "./ui";

type Schema = components["schemas"];
type LoginRequest = Schema["LoginRequest"];
type AuthSuccessResponse = Schema["AuthSuccessResponse"];

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

function restoredChallenge(
  purpose: "login" | "signup",
): VerificationRequiredResponse | null {
  const restored = readPendingEmailOtp(purpose);
  if (!restored) return null;
  return {
    authenticated: false,
    verification_required: true,
    email: restored.email,
    purpose,
    expires_in_seconds: Math.max(
      1,
      Math.ceil((restored.expiresAt - Date.now()) / 1000),
    ),
    message: "Enter the 6-digit verification code sent to your email.",
  };
}

export function SignInForm({
  next,
  justReset,
  onOtpActiveChange,
}: {
  next: string;
  justReset?: boolean;
  onOtpActiveChange?: (active: boolean) => void;
}) {
  const router = useRouter();
  const session = useSession();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingAccount, setMissingAccount] = useState(false);
  const [signupHref, setSignupHref] = useState<string | undefined>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [challenge, setChallenge] =
    useState<VerificationRequiredResponse | null>(() =>
      restoredChallenge("login"),
    );
  const [emailDraft, setEmailDraft] = useState(
    () => readPendingEmailOtp("login")?.email ?? "",
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

    if (!email.includes("@")) {
      setFieldErrors({ email: "Please enter a valid email address." });
      return;
    }
    if (!password) {
      setFieldErrors({ password: "Enter your password." });
      return;
    }

    const body: LoginRequest = { email, password };

    setPending(true);
    setError(null);
    setMissingAccount(false);
    setSignupHref(undefined);
    setFieldErrors({});
    setEmailDraft(email);

    try {
      const result = await api.post<
        VerificationRequiredResponse | AuthSuccessResponse,
        LoginRequest
      >("/auth/login", { body, retryAuth: false });

      if (isVerificationRequired(result)) {
        savePendingEmailOtp(result, next);
        setChallenge(result);
        setPending(false);
        return;
      }

      if ("user" in result && result.user && !result.verification_required) {
        await finalizeAuthentication(result.user, session, router, next);
        return;
      }

      setError("Enter the verification code we sent to your email.");
      setPending(false);
    } catch (requestError) {
      const view = loginErrorView(requestError, next);
      setFieldErrors(fieldErrorsFrom(requestError));
      setError(view.message);
      setMissingAccount(view.missingAccount);
      setSignupHref(view.signupHref);
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
      key={emailDraft || "sign-in"}
      onSubmit={submit}
      className="flex flex-col gap-5"
      noValidate
    >
      {justReset && !error ? (
        <AuthMessage tone="notice">
          Your password was updated. Sign in with your new password.
        </AuthMessage>
      ) : null}
      {error ? (
        <AuthMessage tone="error">
          {error}
          {missingAccount && signupHref ? (
            <>
              {" "}
              <Link
                href={signupHref}
                className="font-semibold text-indigo underline underline-offset-4"
              >
                Join Free
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

      <div className="flex flex-col gap-1.5">
        <AuthPasswordField minLength={1} error={fieldErrors.password} />
        <div className="text-right">
          <Link
            href="/forgot-password/"
            className="text-sm font-medium text-indigo hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <AuthSubmitButton busy={pending} pendingLabel="Signing in…">
        Sign in
      </AuthSubmitButton>
    </form>
  );
}
