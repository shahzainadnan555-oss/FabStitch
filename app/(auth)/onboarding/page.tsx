import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { safeReturnPath } from "@/features/auth/return-to";
import { requireCustomer } from "@/features/auth/server-session";
import { OnboardingExperience } from "@/features/onboarding/onboarding-experience";
import { Container } from "@/components/ui/layout";
import { Wordmark } from "@/components/layout/logo";
import { serverApi } from "@/lib/api/server";
import type { components } from "@/lib/api/schema";

export const metadata: Metadata = {
  title: "Personalise FabStitch",
  description:
    "Choose the materials and product uses that should shape your FabStitch starting points.",
  robots: { index: false, follow: false },
};

const single = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function OnboardingPage({
  searchParams,
}: PageProps<"/onboarding">) {
  const query = await searchParams;
  const next = safeReturnPath(single(query.next));
  await requireCustomer(
    next === "/"
      ? "/onboarding/"
      : `/onboarding/?next=${encodeURIComponent(next)}`,
  );
  const [initial, options] = await Promise.all([
    serverApi.get<components["schemas"]["OnboardingStateResponse"]>(
      "/account/onboarding",
    ),
    serverApi.get<components["schemas"]["OnboardingOptionsResponse"]>(
      "/account/onboarding/options",
    ),
  ]);
  if (initial.onboarding_completed) {
    redirect(next === "/" ? "/marketplace/" : next);
  }

  return (
    <main className="min-h-dvh bg-chrome">
      <div className="border-b border-rule-2 bg-paper-raised">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="FabStitch home">
            <Wordmark />
          </Link>
          <span className="font-mono text-label tracking-[0.09em] text-ink-4 uppercase">
            Personal setup
          </span>
        </Container>
      </div>
      <Container className="py-6 sm:py-9">
        <OnboardingExperience initial={initial} options={options} next={next} />
      </Container>
    </main>
  );
}
