import type { Metadata } from "next";
import { Container } from "@/components/ui/layout";
import { PageHeader } from "@/components/marketplace/page-header";
import { ProfileForm } from "@/features/account/profile-form";
import { serverApi } from "@/lib/api/server";
import type { components } from "@/lib/api/schema";

export const metadata: Metadata = {
  title: "Account profile",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const profile =
    await serverApi.get<components["schemas"]["UserPublic"]>(
      "/account/profile",
    );

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Account" }]}
        eyebrow="Account"
        title="Your account"
        intro="Manage the contact details and sourcing preferences attached to your FabStitch session."
      />
      <Container className="py-8 sm:py-10">
        <ProfileForm initial={profile} />
      </Container>
    </>
  );
}
