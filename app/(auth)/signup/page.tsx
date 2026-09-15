import type { Metadata } from "next";
import Link from "next/link";
import { AuthPanel } from "@/features/auth/auth-panel";
import { GoogleAuthSection } from "@/features/auth/google-auth-section";
import { SignUpForm } from "@/features/auth/sign-up-form";
import { authProviders } from "@/features/auth/providers";
import { RedirectIfAuthenticated } from "@/features/auth/redirect-if-authenticated";
import { describeReturn, safeReturnPath } from "@/features/auth/return-to";

export const metadata: Metadata = {
  title: "Join FabStitch",
  description:
    "Create a FabStitch account to discover fabrics, save preferences, and continue sourcing.",
  robots: { index: false, follow: false },
};

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignupPage({
  searchParams,
}: PageProps<"/signup">) {
  const query = await searchParams;
  const next = safeReturnPath(single(query.next));
  const providers = await authProviders(next);
  const loginHref =
    next === "/" ? "/login/" : `/login/?next=${encodeURIComponent(next)}`;

  return (
    <AuthPanel
      title="Create your FabStitch account"
      intro="Create an account to discover fabrics, save your preferences, and continue your sourcing journey."
      resuming={describeReturn(next)}
      counterpart={{
        prompt: "Already have an account?",
        label: "Sign in",
        href: loginHref,
      }}
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={loginHref}
            className="font-semibold text-indigo hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <RedirectIfAuthenticated next={next} />
      <div className="flex flex-col gap-6">
        <SignUpForm next={next} />
        <GoogleAuthSection providers={providers} error={single(query.error)} />
      </div>
    </AuthPanel>
  );
}
