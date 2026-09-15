import type { Metadata } from "next";
import { safeReturnPath } from "@/features/auth/return-to";
import { OnboardingGate } from "@/features/onboarding/onboarding-gate";

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
  return <OnboardingGate next={next} />;
}
