import type { Metadata } from "next";
import Link from "next/link";
import { AuthPanel } from "@/features/auth/auth-panel";
import { GoogleAuthSection } from "@/features/auth/google-auth-section";
import { SignInForm } from "@/features/auth/sign-in-form";
import { authProviders } from "@/features/auth/providers";
import { RedirectIfAuthenticated } from "@/features/auth/redirect-if-authenticated";
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
      <RedirectIfAuthenticated next={next} />
      <div className="flex flex-col gap-6">
        <SignInForm next={next} justReset={single(query.reset) === "1"} />
        <GoogleAuthSection providers={providers} error={single(query.error)} />
      </div>
    </AuthPanel>
  );
}
