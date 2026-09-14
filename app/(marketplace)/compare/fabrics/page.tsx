import { redirect } from "next/navigation";

export default async function CompareFabricsRedirect({
  searchParams,
}: PageProps<"/compare/fabrics">) {
  const query = await searchParams;
  const raw = Array.isArray(query.f) ? query.f[0] : query.f;
  const ids = (raw ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .join(",");
  redirect(ids ? `/compare/?ids=${encodeURIComponent(ids)}` : "/compare/");
}
