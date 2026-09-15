import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/marketplace/page-header";
import { FabricMedia } from "@/components/marketplace/fabric-media";
import { Container } from "@/components/ui/layout";
import { IconArrowRight } from "@/components/ui/icon";
import { registeredStorefrontMetadata } from "@/lib/storefront-metadata";
import { CollectionPageJsonLd } from "@/components/seo/structured-data";
import { getCustomerCollections } from "@/repositories/customer-catalog";

export async function generateMetadata(): Promise<Metadata> {
  return registeredStorefrontMetadata("/collections/", {
    title: "Collections",
  });
}

export default async function CollectionsPage() {
  const collections = await getCustomerCollections();

  return (
    <>
      <CollectionPageJsonLd
        name="Fabric collections"
        description="Explore published FabStitch fabric collections."
        path="/collections/"
        items={collections.map((collection) => ({
          name: collection.name,
          path: `/collections/${collection.slug}/`,
          image: collection.imageUrl,
        }))}
      />
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Collections" }]}
        eyebrow="Material edit"
        title="Start with the material."
        intro="Explore focused fabric collections, then use search and filters to narrow construction, weight and the quantity you need."
      />
      <Container className="py-10 sm:py-14">
        {collections.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
            {collections.map((collection, index) => (
              <li
                key={collection.slug}
                className={index < 2 ? "lg:col-span-6" : "lg:col-span-4"}
              >
                <Link
                  href={`/collections/${collection.slug}/`}
                  prefetch={false}
                  className="group block h-full overflow-hidden rounded-md border border-rule-2 bg-paper-raised focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo"
                >
                  <div
                    className={
                      index < 2
                        ? "relative aspect-[16/10] overflow-hidden"
                        : "relative aspect-[4/3] overflow-hidden"
                    }
                  >
                    <FabricMedia
                      listing={{
                        material: collection.name,
                        fabricType: collection.name,
                        slug: collection.slug,
                      }}
                      asset={
                        collection.imageUrl
                          ? {
                              src: collection.imageUrl,
                              alt: `${collection.name} fabric collection`,
                            }
                          : undefined
                      }
                      showLabel={false}
                      aspect={index < 2 ? "16/7" : "4/3"}
                      sizes={
                        index < 2
                          ? "(min-width: 1024px) 40vw, 100vw"
                          : "(min-width: 1024px) 27vw, 100vw"
                      }
                      className="absolute inset-0 transition-transform duration-700 motion-safe:group-hover:scale-[1.025]"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-linear-to-t from-navy-surface/45 via-transparent to-transparent"
                    />
                  </div>
                  <div className="flex items-end justify-between gap-5 p-5 sm:p-6">
                    <div>
                      <h2 className="text-h3 font-semibold text-ink">
                        {collection.name}
                      </h2>
                      <p className="mt-1.5 text-sm text-ink-3">
                        {collection.description ??
                          `${collection.fabricCount} published fabrics`}
                      </p>
                    </div>
                    <IconArrowRight
                      width={18}
                      height={18}
                      aria-hidden
                      className="mb-1 shrink-0 text-gold-ink transition-transform motion-safe:group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-sm border border-rule-2 bg-paper-raised p-5 text-sm text-ink-3">
            No published collections are available yet.
          </p>
        )}
      </Container>
    </>
  );
}
