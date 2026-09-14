import { permanentRedirect } from "next/navigation";

export default async function CountryFabricRedirect({
  params,
}: PageProps<"/countries/[slug]/[fabric]">) {
  const { fabric } = await params;
  permanentRedirect(`/fabrics/${encodeURIComponent(fabric)}/`);
}
