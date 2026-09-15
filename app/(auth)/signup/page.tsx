import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/auth/auth-shell";
import { ProviderOptions } from "@/features/auth/provider-options";
import { authProviders } from "@/features/auth/providers";
import { RegisterForm } from "@/features/auth/forms";
import { RedirectIfAuthenticated } from "@/features/auth/redirect-if-authenticated";
import { describeReturn, safeReturnPath } from "@/features/auth/return-to";
import { serverApi } from "@/lib/api/server";
import type { components } from "@/lib/api/schema";

export const metadata: Metadata = {
  title: "Join FabStitch",
  description:
    "Create one FabStitch account, personalise fabric discovery, and enter the marketplace.",
  robots: { index: false, follow: false },
};

const single = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function SignupPage({
  searchParams,
}: PageProps<"/signup">) {
  const query = await searchParams;
  const next = safeReturnPath(single(query.next));
  const [providers, countries] = await Promise.all([
    authProviders(next),
    serverApi.get<components["schemas"]["CountryListResponse"]>("/countries"),
  ]);

  const loginHref =
    next === "/" ? "/login/" : `/login/?next=${encodeURIComponent(next)}`;

  return (
    <AuthShell
      title="Create your FabStitch account"
      intro="Set up your account, answer four quick preference questions once, then enter the fabric marketplace."
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
      <ProviderOptions providers={providers} error={single(query.error)} />
      <RegisterForm next={next} countries={countries.items} />
    </AuthShell>
  );
}
