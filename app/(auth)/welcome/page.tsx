import { redirect } from "next/navigation";

/** Compatibility route for accounts created before customer onboarding. */
export default async function WelcomePage({
  searchParams,
}: PageProps<"/welcome">) {
  const query = await searchParams;
  const params = new URLSearchParams();
  const next = Array.isArray(query.next) ? query.next[0] : query.next;
  if (next) params.set("next", next);
  redirect(params.size ? `/onboarding/?${params}` : "/onboarding/");
}
