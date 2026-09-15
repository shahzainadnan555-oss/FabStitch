"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";
import { finalizeAuthentication } from "./finalize-authentication";
import { loginErrorView } from "./messages";
import { useSession } from "./session";
import {
  AuthField,
  AuthMessage,
  AuthPasswordField,
  AuthSubmitButton,
} from "./ui";

type Schema = components["schemas"];
type AuthSuccessResponse = Schema["AuthSuccessResponse"];
type LoginRequest = Schema["LoginRequest"];

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

export function SignInForm({
  next,
  justReset,
}: {
  next: string;
  justReset?: boolean;
}) {
  const router = useRouter();
  const session = useSession();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingAccount, setMissingAccount] = useState(false);
  const [signupHref, setSignupHref] = useState<string | undefined>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const form = new FormData(event.currentTarget);
    const body: LoginRequest = {
      email: formEmail(form),
      password: String(form.get("password") ?? ""),
    };

    setPending(true);
    setError(null);
    setMissingAccount(false);
    setSignupHref(undefined);
    setFieldErrors({});

    try {
      const result = await api.post<AuthSuccessResponse, LoginRequest>(
        "/auth/login",
        { body, retryAuth: false },
      );
      await finalizeAuthentication(result.user, session, router, next);
    } catch (requestError) {
      const view = loginErrorView(requestError, next);
      setFieldErrors(fieldErrorsFrom(requestError));
      setError(view.message);
      setMissingAccount(view.missingAccount);
      setSignupHref(view.signupHref);
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
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
        placeholder="you@company.com"
        error={fieldErrors.email}
      />

      <div className="flex flex-col gap-1.5">
        <AuthPasswordField minLength={8} error={fieldErrors.password} />
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
