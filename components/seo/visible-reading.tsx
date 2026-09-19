import type { PillarReading } from "@/domain/seo/visible-reading";

export function VisibleReading({
  heading,
  paragraphs,
  id = "page-reading",
  level = 2,
}: {
  heading: string;
  paragraphs: readonly string[];
  id?: string;
  level?: 2 | 3;
}) {
  const HeadingTag = level === 2 ? "h2" : "h3";
  return (
    <section className="max-w-[70ch]" aria-labelledby={id}>
      <HeadingTag id={id} className="text-h2 font-semibold text-ink">
        {heading}
      </HeadingTag>
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph.slice(0, 80)}
          className="mt-4 text-body leading-relaxed text-ink-2 text-pretty"
        >
          {paragraph}
        </p>
      ))}
    </section>
  );
}

export function PillarReadingBlock({
  reading,
  id,
}: {
  reading: PillarReading;
  id?: string;
}) {
  return (
    <VisibleReading
      id={id}
      heading={reading.heading}
      paragraphs={reading.paragraphs}
    />
  );
}
