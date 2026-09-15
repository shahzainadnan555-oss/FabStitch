import type { Metadata } from "next";
import { AuthPanel } from "@/features/auth/auth-panel";
import { OAuthCallback } from "@/features/auth/oauth-callback";
import { safeReturnPath } from "@/features/auth/return-to";

export const metadata: Metadata = {
  title: "Signing in",
  description: "Completing your FabStitch sign-in.",
  robots: { index: false, follow: false },
};

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const next = safeReturnPath(single(query.next));
  const error = single(query.error);

  return (
    <AuthPanel
      title="Continue with Google"
      intro="Finishing your FabStitch session."
    >
      <OAuthCallback next={next} error={error} />
    </AuthPanel>
  );
}
