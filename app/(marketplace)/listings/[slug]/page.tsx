import { permanentRedirect } from "next/navigation";

export default async function ListingPage({
  params,
}: PageProps<"/listings/[slug]">) {
  const { slug } = await params;
  permanentRedirect(`/fabrics/${encodeURIComponent(slug)}/`);
}
