import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/auth/auth-shell";
import { ResetPasswordForm } from "@/features/auth/forms";
import { AuthMessage } from "@/features/auth/controls";

export const metadata: Metadata = {
  title: "Set a new password",
  robots: { index: false, follow: false },
};

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Reset password.
 *
 * The token arrives in the link the API emailed. It is never displayed and
 * never put in a field the buyer edits - it is carried through as a hidden
 * value and validated server-side, which is where an expired or reused token
 * is actually detectable.
 */
export default async function ResetPasswordPage({
  searchParams,
}: PageProps<"/reset-password">) {
  const query = await searchParams;
  const token = single(query.token) ?? "";

  return (
    <AuthShell
      title="Set a new password"
      intro="Choose a password you do not use anywhere else."
      counterpart={{
        prompt: "Remembered it?",
        label: "Sign in",
        href: "/login/",
      }}
      footer={
        <>
          Back to{" "}
          <Link
            href="/login/"
            className="font-semibold text-indigo hover:underline"
          >
            sign in
          </Link>
        </>
      }
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="flex flex-col gap-5">
          <AuthMessage tone="error">
            This link is missing its reset token, so it cannot be used. Reset
            links expire, and only the most recent one works.
          </AuthMessage>
          <Link
            href="/forgot-password/"
            className="text-sm font-medium text-indigo hover:underline"
          >
            Request a new reset link
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
