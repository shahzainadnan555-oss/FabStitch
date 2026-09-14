import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/auth/auth-shell";
import { ForgotPasswordForm } from "@/features/auth/forms";

export const metadata: Metadata = {
  title: "Reset your password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      intro="Enter the address on your FabStitch account and we will send a reset link."
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
      <ForgotPasswordForm />
    </AuthShell>
  );
}
