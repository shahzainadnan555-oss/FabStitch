import type { Metadata } from "next";
import Link from "next/link";
import { AuthPanel } from "@/features/auth/auth-panel";
import { SignInExperience } from "@/features/auth/email-auth-experience";
import { authProviders } from "@/features/auth/providers";
import { describeReturn, safeReturnPath } from "@/features/auth/return-to";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your FabStitch account.",
  robots: { index: false, follow: false },
};

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const query = await searchParams;
  const next = safeReturnPath(single(query.next));
  const providers = await authProviders(next);
  const signupHref =
    next === "/" ? "/signup/" : `/signup/?next=${encodeURIComponent(next)}`;

  return (
    <AuthPanel
      title="Welcome back"
      intro="Sign in to continue your FabStitch sourcing journey."
      resuming={describeReturn(next)}
      counterpart={{
        prompt: "New here?",
        label: "Join Free",
        href: signupHref,
      }}
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <Link
            href={signupHref}
            className="font-semibold text-indigo hover:underline"
          >
            Join Free
          </Link>
        </>
      }
    >
      <SignInExperience
        next={next}
        providers={providers}
        googleError={single(query.error)}
        justReset={single(query.reset) === "1"}
      />
    </AuthPanel>
  );
}
