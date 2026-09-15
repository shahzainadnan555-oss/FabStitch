import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/auth/auth-shell";
import { LoginForm } from "@/features/auth/forms";
import { ProviderOptions } from "@/features/auth/provider-options";
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
    <AuthShell
      title="Welcome back"
      intro="Sign in to your FabStitch account."
      resuming={describeReturn(next)}
      counterpart={{
        prompt: "New to FabStitch?",
        label: "Join",
        href: signupHref,
      }}
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <Link
            href={signupHref}
            className="font-semibold text-indigo hover:underline"
          >
            Join FabStitch
          </Link>
        </>
      }
    >
      <RedirectIfAuthenticated next={next} />
      <ProviderOptions providers={providers} error={single(query.error)} />
      <LoginForm next={next} justReset={single(query.reset) === "1"} />
    </AuthShell>
  );
}
