import type { Metadata } from "next";
import { Container } from "@/components/ui/layout";
import { PageHeader } from "@/components/marketplace/page-header";
import { AccountSummary } from "@/features/account/account-summary";
import { AccountMarketPreferences } from "@/features/preferences/account-market-preferences";
import { OnboardingExperience } from "@/features/onboarding/onboarding-experience";
import { SavedPreferences } from "@/features/onboarding/saved-preferences";
import { serverApi } from "@/lib/api/server";
import type { components } from "@/lib/api/schema";

export const metadata: Metadata = {
  title: "Fabric preferences",
  robots: { index: false, follow: false },
};

const single = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function PreferencesPage({
  searchParams,
}: PageProps<"/account/preferences">) {
  const query = await searchParams;
  const editing = single(query.edit) === "1";
  const [profile, initial, options] = await Promise.all([
    serverApi.get<components["schemas"]["UserPublic"]>("/account/profile"),
    serverApi.get<components["schemas"]["OnboardingStateResponse"]>(
      "/account/onboarding",
    ),
    serverApi.get<components["schemas"]["OnboardingOptionsResponse"]>(
      "/account/onboarding/options",
    ),
  ]);

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Account", href: "/account/" },
          { label: "Preferences" },
        ]}
        eyebrow="Account"
        title={editing ? "Edit your fabric preferences" : "Your preferences"}
        intro={
          editing
            ? "Update the starting points FabStitch uses for personalised discovery. The full catalogue remains available."
            : "Review the choices saved to your account and the market settings used across FabStitch."
        }
      />
      <Container className="py-8 sm:py-10">
        <AccountSummary profile={profile} />
        {single(query.saved) === "1" && !editing ? (
          <p
            role="status"
            className="mb-6 rounded-sm border border-verified/30 bg-verified-wash px-4 py-3 text-sm text-verified"
          >
            Preferences saved to your account.
          </p>
        ) : null}
        <div className="grid gap-9">
          {editing ? (
            <>
              <AccountMarketPreferences />
              <OnboardingExperience
                initial={initial}
                options={options}
                editing
              />
            </>
          ) : (
            <>
              <SavedPreferences preferences={initial} />
              <AccountMarketPreferences />
            </>
          )}
        </div>
      </Container>
    </>
  );
}
