import { permanentRedirect } from "next/navigation";

export default async function ApplicationRedirect({
  params,
}: PageProps<"/applications/[slug]">) {
  const { slug } = await params;
  permanentRedirect(`/fabrics/best-for/${encodeURIComponent(slug)}/`);
}
