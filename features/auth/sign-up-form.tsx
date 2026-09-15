"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";
import { finalizeAuthentication } from "./finalize-authentication";
import { signupErrorMessage } from "./messages";
import { useSession } from "./session";
import {
  AuthField,
  AuthMessage,
  AuthPasswordField,
  AuthSubmitButton,
} from "./ui";

type Schema = components["schemas"];
type AuthSuccessResponse = Schema["AuthSuccessResponse"];
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

export function SignUpForm({ next }: { next: string }) {
  const router = useRouter();
  const session = useSession();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const form = new FormData(event.currentTarget);
    const email = formEmail(form);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirm") ?? "");

    if (!email.includes("@")) {
      setFieldErrors({ email: "Enter a valid email address." });
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

    try {
      const result = await api.post<AuthSuccessResponse, SignupRequest>(
        "/auth/signup",
        { body, retryAuth: false },
      );
      await finalizeAuthentication(result.user, session, router, next);
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

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
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
