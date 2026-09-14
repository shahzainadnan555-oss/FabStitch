import { getSeoPageByPath } from "@/repositories/seo";

export async function backendPageMeta(path: string) {
  const page = await getSeoPageByPath(path).catch(() => null);
  if (!page) return null;
  return {
    path: page.canonical_path,
    title: page.seo_title ?? page.title,
    metaDescription: page.meta_description,
    canonicalPath: page.canonical_url ?? page.canonical_path,
    isIndexable: page.is_indexable,
    isPublic: page.is_public,
    publicationStatus: page.publication_status,
  };
}
