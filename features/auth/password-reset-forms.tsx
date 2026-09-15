"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { ApiError, apiErrorMessage } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";
import {
  AuthField,
  AuthMessage,
  AuthPasswordField,
  AuthSubmitButton,
} from "./ui";

type Schema = components["schemas"];
type PasswordForgotRequest = Schema["PasswordForgotRequest"];
type PasswordForgotResponse = Schema["PasswordForgotResponse"];
type PasswordResetRequest = Schema["PasswordResetRequest"];
type PasswordResetResponse = Schema["PasswordResetResponse"];

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

export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    const body: PasswordForgotRequest = { email: formEmail(form) };
    setPending(true);
    setNotice(null);
    setError(null);
    setFieldErrors({});
    try {
      const result = await api.post<
        PasswordForgotResponse,
        PasswordForgotRequest
      >("/auth/password/forgot", { body, retryAuth: false });
      setNotice(
        result.message ||
          "If an account exists for that email, a reset link has been sent.",
      );
    } catch (requestError) {
      const fields = fieldErrorsFrom(requestError);
      setFieldErrors(fields);
      setError(
        Object.keys(fields).length > 0
          ? null
          : apiErrorMessage(
              requestError,
              "We couldn’t send a reset link right now. Please try again.",
            ),
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {notice ? <AuthMessage tone="notice">{notice}</AuthMessage> : null}
      {error ? <AuthMessage tone="error">{error}</AuthMessage> : null}
      <AuthField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        autoFocus
        required
        error={fieldErrors.email}
      />
      <AuthSubmitButton busy={pending} pendingLabel="Sending reset link…">
        Send reset link
      </AuthSubmitButton>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirm") ?? "");
    if (password !== confirmation) {
      setFieldErrors({ confirm: "The two passwords do not match." });
      return;
    }
    const body: PasswordResetRequest = {
      token,
      new_password: password,
    };
    setPending(true);
    setError(null);
    setFieldErrors({});
    try {
      await api.post<PasswordResetResponse, PasswordResetRequest>(
        "/auth/password/reset",
        { body, retryAuth: false },
      );
      router.push("/login/?reset=1");
    } catch (requestError) {
      const fields = fieldErrorsFrom(requestError);
      setFieldErrors(fields);
      setError(
        Object.keys(fields).length > 0
          ? null
          : apiErrorMessage(
              requestError,
              "This reset link could not be used. Request a new one.",
            ),
      );
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {error ? <AuthMessage tone="error">{error}</AuthMessage> : null}
      <AuthPasswordField
        label="New password"
        autoComplete="new-password"
        minLength={8}
        maxLength={72}
        error={fieldErrors.new_password}
      />
      <AuthPasswordField
        label="Confirm new password"
        name="confirm"
        autoComplete="new-password"
        minLength={8}
        maxLength={72}
        error={fieldErrors.confirm}
      />
      <AuthSubmitButton busy={pending} pendingLabel="Updating password…">
        Update password
      </AuthSubmitButton>
    </form>
  );
}
