import Link from "next/link";
import { Container, Panel } from "@/components/ui/layout";
import { Label } from "@/components/ui/typography";
import { SpecGrid } from "@/components/ui/table";
import {
  formatCatalogMeasurement,
  type CustomerCatalogDetail,
} from "@/repositories/customer-catalog";
import {
  BestFor,
  FabricExperienceHero,
  RelatedFabricTiles,
} from "@/components/marketplace/fabric-experience";
import { CatalogProductJsonLd } from "@/components/seo/structured-data";
import {
  InquiryButton,
  InquiryEntryPanel,
  InquiryFlowProvider,
} from "@/features/inquiries/inquiry-flow";
import { FabricViewTracker } from "@/components/analytics/fabric-view-tracker";
import { fabricSeoDescription } from "@/lib/storefront-metadata";

/**
 * The FabStitch product page. It accepts the source-neutral customer catalogue
 * shape, so the 2027 frontend collection and the future API render identically.
 * Unknown fields stay absent and ordering appears only with real commercial
 * data.
 */

export async function CatalogFabricPage({
  detail,
}: {
  detail: CustomerCatalogDetail;
}) {
  const { fabric } = detail;

  const specRows = [
    fabric.composition.length
      ? { label: "Composition", value: fabric.composition.join(" / ") }
      : null,
    fabric.construction.length
      ? { label: "Construction", value: fabric.construction.join(", ") }
      : null,
    fabric.measurements.length
      ? {
          label: "Weight / measure",
          value: fabric.measurements.map(formatCatalogMeasurement).join(", "),
        }
      : null,
    fabric.characteristics.length
      ? {
          label: "Character",
          value: fabric.characteristics.join(", "),
        }
      : null,
    { label: "Season", value: fabric.seasons.join(" / ") || "Not stated" },
    { label: "Collection", value: fabric.collection.label },
    fabric.fabstitchVerified
      ? { label: "Verification", value: "FabStitch Verified" }
      : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Fabrics", href: "/fabrics/" },
    ...(fabric.collection.slug
      ? [
          {
            label: fabric.collection.label,
            href: `/collections/${fabric.collection.slug}/`,
          },
        ]
      : []),
    { label: fabric.name },
  ];
  const bestFor = fabric.bestFor.map((useCase) => ({
    label: useCase.label,
    href: `/fabrics/best-for/${useCase.slug}/`,
  }));
  const related = detail.related.map((item) => ({
    label: item.name,
    href: `/fabrics/${item.slug}/`,
    fabricSlug: item.slug,
    hint: item.summary ?? undefined,
  }));
  const heroAttributes = specRows.slice(0, 3);
  const description = fabricSeoDescription(fabric);
  const gsm = fabric.measurements.find((item) => item.unit === "gsm");
  const mediaSubject = {
    material: fabric.composition[0] ?? fabric.family.label,
    fabricType: fabric.name,
    construction: fabric.construction[0],
    gsm: gsm ? { value: gsm.exact ?? gsm.min ?? gsm.max } : undefined,
    slug: fabric.slug,
  };
  const inquiryFabric = {
    id: fabric.id,
    slug: fabric.slug,
    name: fabric.name,
    imageSrc: fabric.media.src,
    imageAlt: fabric.media.alt ?? `${fabric.name} fabric`,
    mediaSubject,
  };

  return (
    <InquiryFlowProvider fabric={inquiryFabric}>
      <FabricViewTracker fabricSlug={fabric.slug} fabricName={fabric.name} />
      <CatalogProductJsonLd fabric={fabric} description={description} />
      <div data-fabric-detail-slug={fabric.slug}>
        <FabricExperienceHero
          crumbs={crumbs}
          eyebrow={fabric.collection.label}
          title={fabric.name}
          description={description}
          image={fabric.media.src}
          imageAlt={fabric.media.alt ?? `${fabric.name} fabric`}
          mediaSubject={mediaSubject}
          attributes={heroAttributes}
          action={<InquiryButton />}
        />

        <Container className="py-8">
          <BestFor items={bestFor} className="mb-10" />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0">
              <section className="max-w-[68ch]">
                <h2 className="text-h2 font-semibold text-ink">
                  What is {fabric.name}?
                </h2>
                <p className="mt-3 text-body leading-relaxed text-ink-2 text-pretty">
                  {fabric.description ??
                    fabric.summary ??
                    `${fabric.name} is a published FabStitch fabric.`}{" "}
                  {fabric.collection.slug ? (
                    <>
                      It belongs to the{" "}
                      <Link
                        href={`/collections/${fabric.collection.slug}/`}
                        className="font-medium text-indigo underline-offset-4 hover:underline"
                      >
                        {fabric.collection.label} collection
                      </Link>
                    </>
                  ) : null}
                  {fabric.characteristics.length
                    ? ` and is described as ${fabric.characteristics.join(", ")}.`
                    : "."}
                </p>
              </section>

              <section className="mt-8 max-w-[68ch]">
                <h2 className="text-h3 font-semibold text-ink">
                  What is {fabric.name} made from?
                </h2>
                <p className="mt-3 text-body leading-relaxed text-ink-2 text-pretty">
                  {fabric.composition.length
                    ? `The published specification gives ${fabric.composition.join(" or ")} as the composition${fabric.composition.length > 1 ? " alternatives" : ""}.`
                    : "The published specification does not state a composition for this fabric, so FabStitch does not infer one."}{" "}
                  {fabric.construction.length
                    ? `Its documented construction is ${fabric.construction.join(", ")}.`
                    : "No additional construction has been added beyond the named fabric type."}
                </p>
              </section>

              <section className="mt-8 max-w-[68ch]">
                <h2 className="text-h3 font-semibold text-ink">
                  What is {fabric.name} used for?
                </h2>
                <p className="mt-3 text-body leading-relaxed text-ink-2 text-pretty">
                  {fabric.applications.length
                    ? `The sourcing reference documents ${fabric.applications
                        .map((application) => application.label.toLowerCase())
                        .join(", ")} as relevant uses.`
                    : "The source does not assign a specific end use, so this page does not invent one."}{" "}
                  Compare the stated weight or measurement, surface and
                  construction before treating a general fabric direction as a
                  final production specification.
                </p>
              </section>

              <p className="mt-8 max-w-[65ch] border-l-2 border-gold pl-4 text-sm leading-relaxed text-ink-3 text-pretty">
                This page includes only details returned by the FabStitch
                catalog. Missing commercial, testing or care values have not
                been estimated.
              </p>

              <RelatedFabricTiles items={related} className="mt-10" />
            </div>

            <aside className="flex flex-col gap-5 lg:sticky lg:top-20 lg:self-start">
              <InquiryEntryPanel />
              {specRows.length ? (
                <div id="specification" className="scroll-mt-24">
                  <Panel className="p-4">
                    <Label>Specification</Label>
                    <SpecGrid className="mt-3" rows={specRows} />
                  </Panel>
                </div>
              ) : null}
            </aside>
          </div>
        </Container>
      </div>
    </InquiryFlowProvider>
  );
}
