import type { Metadata } from "next";
import Link from "next/link";
import { AuthPanel } from "@/features/auth/auth-panel";
import { ForgotPasswordForm } from "@/features/auth/password-reset-forms";

export const metadata: Metadata = {
  title: "Reset your password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthPanel
      title="Reset your password"
      intro="Enter the email on your FabStitch account and we will send a reset link."
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
    </AuthPanel>
  );
}
