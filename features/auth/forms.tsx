"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AuthField,
  AuthMessage,
  CountryField,
  PasswordField,
  SubmitButton,
} from "./controls";
import { useSession } from "@/features/auth/session";
import { onboardingHref } from "@/features/onboarding/profile";
import { safeReturnPath } from "./return-to";
import { api } from "@/lib/api/client";
import { ApiError, apiErrorMessage } from "@/lib/api/errors";
import type { components } from "@/lib/api/schema";
import { isCountryCode } from "@/features/preferences/market";

type Schema = components["schemas"];
type AuthSuccessResponse = Schema["AuthSuccessResponse"];
type LoginRequest = Schema["LoginRequest"];
type SignupRequest = Schema["SignupRequest"];
type CountryOut = Schema["CountryOut"];
type PasswordForgotRequest = Schema["PasswordForgotRequest"];
type PasswordForgotResponse = Schema["PasswordForgotResponse"];
type PasswordResetRequest = Schema["PasswordResetRequest"];
type PasswordResetResponse = Schema["PasswordResetResponse"];

type FormState = {
  error?: string;
  notice?: string;
  fieldErrors?: Record<string, string>;
};

function destination(completed: boolean, next: string) {
  const requested = safeReturnPath(next);
  if (!completed) return onboardingHref(requested);
  return requested === "/" ? "/marketplace/" : requested;
}

function formEmail(form: FormData) {
  return String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
}

function requestErrors(error: unknown): FormState {
  if (!(error instanceof ApiError)) {
    return { error: "FabStitch could not complete this request. Try again." };
  }
  const fieldErrors: Record<string, string> = {};
  for (const detail of error.details) {
    const field = detail.loc?.at(-1);
    if (typeof field === "string" && detail.msg) {
      fieldErrors[field] = detail.msg;
    }
  }
  return {
    error:
      Object.keys(fieldErrors).length > 0
        ? undefined
        : apiErrorMessage(error, "FabStitch could not complete this request."),
    fieldErrors,
  };
}

export function LoginForm({
  next,
  justReset,
}: {
  next: string;
  justReset?: boolean;
}) {
  const router = useRouter();
  const { adoptUser } = useSession();
  const [state, setState] = useState<FormState>({});
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body: LoginRequest = {
      email: formEmail(form),
      password: String(form.get("password") ?? ""),
    };
    setPending(true);
    setState({});
    try {
      const result = await api.post<AuthSuccessResponse, LoginRequest>(
        "/auth/login",
        { body, retryAuth: false },
      );
      adoptUser(result.user);
      router.push(destination(result.user.onboarding_completed, next));
      router.refresh();
    } catch (error) {
      setState(requestErrors(error));
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {justReset && !state.error ? (
        <AuthMessage tone="notice">
          Your password was updated. Sign in with your new password.
        </AuthMessage>
      ) : null}
      {state.error ? (
        <AuthMessage tone="error">{state.error}</AuthMessage>
      ) : null}
      <AuthField
        label="Work email"
        name="email"
        type="email"
        autoComplete="email"
        autoFocus
        required
        error={state.fieldErrors?.email}
      />
      <div className="flex flex-col gap-1.5">
        <PasswordField minLength={8} error={state.fieldErrors?.password} />
        <div className="text-right">
          <Link
            href="/forgot-password/"
            className="text-sm font-medium text-indigo hover:underline"
          >
            Forgotten your password?
          </Link>
        </div>
      </div>
      <SubmitButton busy={pending} pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}

export function RegisterForm({
  next,
  countries,
}: {
  next: string;
  countries: CountryOut[];
}) {
  const router = useRouter();
  const { adoptUser } = useSession();
  const [state, setState] = useState<FormState>({});
  const [formValid, setFormValid] = useState(false);
  const [pending, setPending] = useState(false);

  const updateValidity = (event: FormEvent<HTMLFormElement>) => {
    setFormValid(event.currentTarget.checkValidity());
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const country = String(form.get("country_code") ?? "");
    if (!isCountryCode(country)) {
      setState({ fieldErrors: { country_code: "Choose a valid country." } });
      return;
    }
    const body: SignupRequest = {
      email: formEmail(form),
      password: String(form.get("password") ?? ""),
      full_name: String(form.get("full_name") ?? "").trim() || null,
      country,
    };
    setPending(true);
    setState({});
    try {
      const result = await api.post<AuthSuccessResponse, SignupRequest>(
        "/auth/signup",
        { body, retryAuth: false },
      );
      adoptUser(result.user);
      router.push(onboardingHref(next));
      router.refresh();
    } catch (error) {
      setState(requestErrors(error));
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      onInput={updateValidity}
      onChange={updateValidity}
      className="flex flex-col gap-5"
    >
      {state.error ? (
        <AuthMessage tone="error">{state.error}</AuthMessage>
      ) : null}
      <AuthField
        label="Work email"
        name="email"
        type="email"
        autoComplete="email"
        autoFocus
        required
        error={state.fieldErrors?.email}
      />
      <PasswordField
        autoComplete="new-password"
        minLength={8}
        maxLength={72}
        error={state.fieldErrors?.password}
      />
      <AuthField
        label="Your name"
        name="full_name"
        autoComplete="name"
        required
        error={state.fieldErrors?.full_name}
      />
      <CountryField
        countries={countries}
        error={state.fieldErrors?.country_code}
      />
      <SubmitButton
        disabled={!formValid}
        busy={pending}
        pendingLabel="Creating account…"
      >
        Create account
      </SubmitButton>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, setState] = useState<FormState>({});
  const [pending, setPending] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body: PasswordForgotRequest = { email: formEmail(form) };
    setPending(true);
    setState({});
    try {
      const result = await api.post<
        PasswordForgotResponse,
        PasswordForgotRequest
      >("/auth/password/forgot", { body, retryAuth: false });
      setState({ notice: result.message });
    } catch (error) {
      setState(requestErrors(error));
    } finally {
      setPending(false);
    }
  };
  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {state.notice ? (
        <AuthMessage tone="notice">{state.notice}</AuthMessage>
      ) : null}
      {state.error ? (
        <AuthMessage tone="error">{state.error}</AuthMessage>
      ) : null}
      <AuthField
        label="Work email"
        name="email"
        type="email"
        autoComplete="email"
        autoFocus
        required
        error={state.fieldErrors?.email}
      />
      <SubmitButton busy={pending} pendingLabel="Sending reset link…">
        Send reset link
      </SubmitButton>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [state, setState] = useState<FormState>({});
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirm") ?? "");
    if (password !== confirmation) {
      setState({
        fieldErrors: { confirm: "The two passwords do not match." },
      });
      return;
    }
    const body: PasswordResetRequest = {
      token,
      new_password: password,
    };
    setPending(true);
    setState({});
    try {
      await api.post<PasswordResetResponse, PasswordResetRequest>(
        "/auth/password/reset",
        { body, retryAuth: false },
      );
      router.push("/login/?reset=1");
    } catch (error) {
      setState(requestErrors(error));
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {state.error ? (
        <AuthMessage tone="error">{state.error}</AuthMessage>
      ) : null}
      <PasswordField
        label="New password"
        autoComplete="new-password"
        minLength={8}
        maxLength={72}
        error={state.fieldErrors?.new_password}
      />
      <PasswordField
        label="Confirm new password"
        name="confirm"
        autoComplete="new-password"
        minLength={8}
        maxLength={72}
        error={state.fieldErrors?.confirm}
      />
      <SubmitButton busy={pending} pendingLabel="Updating password…">
        Update password
      </SubmitButton>
    </form>
  );
}
