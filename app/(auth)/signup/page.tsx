import type { Metadata } from "next";
import Link from "next/link";
import { AuthPanel } from "@/features/auth/auth-panel";
import { SignUpExperience } from "@/features/auth/email-auth-experience";
import { authProviders } from "@/features/auth/providers";
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
      <SignUpExperience
        next={next}
        providers={providers}
        googleError={single(query.error)}
      />
    </AuthPanel>
  );
}
