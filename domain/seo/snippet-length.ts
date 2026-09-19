/**
 * Document-title and meta-description lengths for indexable pages.
 *
 * Non-home titles are stored as the `%s` segment. The browser title is
 * `${segment} | FabStitch`. Homepage titles are absolute and already include
 * the brand.
 */

export const TITLE_MIN = 45;
export const TITLE_MAX = 61;
export const DESCRIPTION_MIN = 120;
export const DESCRIPTION_MAX = 151;
export const TITLE_SUFFIX = " | FabStitch";

const SEGMENT_MIN = TITLE_MIN - TITLE_SUFFIX.length;
const SEGMENT_MAX = TITLE_MAX - TITLE_SUFFIX.length;

const TITLE_TAILS = [
  "Sourcing Notes",
  "for Apparel",
  "Buyer Guide",
  "Cloth Guide",
  "Use Notes",
  "Fabric Notes",
] as const;

/** Hand-written snippets for the pages the public audit names first. */
const CURATED: Record<string, { title: string; description: string }> = {
  "/": {
    title: "FabStitch | B2B Fabric Marketplace & Fabric Sourcing",
    description:
      "Discover apparel, fashion, and manufacturing fabrics on FabStitch, a B2B marketplace for sourcing cloth by material and use.",
  },
  "/marketplace/": {
    title: "B2B Fabric Marketplace & Fabric Sourcing",
    description:
      "Search FabStitch by material, construction, season, and use, then open a fabric page and inquire on the cloth that fits.",
  },
  "/fabrics/": {
    title: "Explore Fabrics by Material and Use",
    description:
      "Browse FabStitch fabrics by collection, construction, and Best For use, then open a page for composition, weight, and care.",
  },
  "/collections/": {
    title: "Fabric Collections: Cotton, Linen, Silk",
    description:
      "Browse linen, cotton, silk, denim, and other FabStitch collections, then open a named fabric for its published specs.",
  },
  "/how-it-works/": {
    title: "How FabStitch Works: Discover & Source",
    description:
      "See how FabStitch connects discovery, search, Best For guidance, fabric specifications, quantity, and a sourcing inquiry.",
  },
  "/about/": {
    title: "About FabStitch: Fabric Discovery & Sourcing",
    description:
      "FabStitch is a B2B fabric marketplace for discovering materials and comparing cloth before a brand sends an inquiry.",
  },
  "/contact/": {
    title: "Contact FabStitch about Fabric Sourcing",
    description:
      "Contact FabStitch about a fabric, a sourcing brief, an account question, or how buyers use the marketplace day to day.",
  },
  "/guides/": {
    title: "Fabric Guides for Weight, Weave & Use",
    description:
      "Read FabStitch guides on fabric weight, composition, weaves, and how to choose cloth for shirts, dresses, and production.",
  },
  "/discover/": {
    title: "Fabric Discovery Topics & Comparisons",
    description:
      "Explore FabStitch topics on materials, garment uses, fabric attributes, and comparisons that lead back to the marketplace.",
  },
  "/wholesale-fabric/": {
    title: "Wholesale Fabric for Brands & Production",
    description:
      "Read how wholesale fabric buying works on FabStitch, from a production brief to a published cloth and an inquiry.",
  },
  "/fabric-sourcing/": {
    title: "Fabric Sourcing for Clothing Brands",
    description:
      "Source fabric for a clothing line by reading composition, construction, and weight, then inquire on the right cloth.",
  },
  "/fabrics/best-for/": {
    title: "Fabrics by Use: Shirts, Dresses & More",
    description:
      "Start with the garment you are making and compare FabStitch fabrics already grouped for shirts, dresses, or another use.",
  },
  "/help/": {
    title: "FabStitch Help: Search, Inquiries, Account",
    description:
      "Find help on discovering fabrics, sending an inquiry, and managing an account. Support answers questions that need a person.",
  },
};

function spaces(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function inRange(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

export function titleSegment(value: string): string {
  return spaces(value)
    .replace(/\s*\|\s*FabStitch\s*$/i, "")
    .trim();
}

export function renderedDocumentTitle(
  path: string,
  storedTitle: string,
): string {
  if (path === "/") return spaces(storedTitle);
  return `${titleSegment(storedTitle)}${TITLE_SUFFIX}`;
}

function trimTo(value: string, max: number, min: number): string {
  if (value.length <= max) return value;
  const slice = value.slice(0, max + 1);
  const period = slice.lastIndexOf(". ");
  if (period + 1 >= min) return slice.slice(0, period + 1).trim();
  const space = slice.lastIndexOf(" ");
  let next = (
    space >= min ? slice.slice(0, space) : value.slice(0, max)
  ).trim();
  next = next.replace(/[\s,:;|–—-]+$/g, "").trim();
  if (next.length < min) {
    next = `${value.slice(0, max).trim()}`.replace(/[\s,:;|–—-]+$/g, "");
  }
  return next;
}

function withPageNumber(path: string, title: string): string {
  const page = path.match(/\/page\/(\d+)\/$/)?.[1];
  if (
    !page ||
    page === "1" ||
    new RegExp(`\\bpage ${page}\\b`, "i").test(title)
  ) {
    return title;
  }
  return `${title} Page ${page}`;
}

function enforceSegment(value: string): string {
  let segment = titleSegment(value);
  const pads = [" for apparel sourcing", " buyer notes", " cloth guide"];
  if (segment.length > SEGMENT_MAX) {
    segment = trimTo(segment, SEGMENT_MAX, SEGMENT_MIN);
  }
  for (const pad of pads) {
    if (segment.length >= SEGMENT_MIN) break;
    if (segment.length + pad.length <= SEGMENT_MAX) segment += pad;
  }
  if (segment.length < SEGMENT_MIN) {
    segment = `${segment} for apparel sourcing`.slice(0, SEGMENT_MAX).trim();
  }
  if (segment.length > SEGMENT_MAX)
    segment = trimTo(segment, SEGMENT_MAX, SEGMENT_MIN);
  return segment;
}

function stampPage(path: string, segment: string): string {
  const page = path.match(/\/page\/(\d+)\/$/)?.[1];
  if (!page || page === "1") return enforceSegment(segment);
  const stamp = ` p.${page}`;
  let next = titleSegment(segment).replace(/\s+p\.\d+$/i, "");
  if (next.length + stamp.length > SEGMENT_MAX) {
    next = trimTo(next, SEGMENT_MAX - stamp.length, 8);
  }
  next = `${next}${stamp}`;
  if (next.length < SEGMENT_MIN) {
    const padded = enforceSegment(next.replace(stamp, ""));
    next =
      padded.length + stamp.length <= SEGMENT_MAX
        ? `${padded}${stamp}`
        : `${trimTo(padded, SEGMENT_MAX - stamp.length, 8)}${stamp}`;
  }
  return next;
}

export function fitTitle(path: string, storedTitle: string): string {
  const curated = CURATED[path];
  if (curated)
    return path === "/" ? curated.title : enforceSegment(curated.title);

  if (path === "/") {
    const absolute = spaces(storedTitle);
    if (inRange(absolute, TITLE_MIN, TITLE_MAX)) return absolute;
    return absolute.length > TITLE_MAX
      ? trimTo(absolute, TITLE_MAX, TITLE_MIN)
      : enforceSegment(absolute);
  }

  const base =
    titleSegment(withPageNumber(path, storedTitle)) || "Fabric guide";
  const options = [base, ...TITLE_TAILS.map((tail) => `${base} ${tail}`)];
  const fits = options.filter((option) =>
    inRange(option, SEGMENT_MIN, SEGMENT_MAX),
  );
  const chosen = fits.length
    ? fits.sort(
        (left, right) =>
          Math.abs(left.length - 48) - Math.abs(right.length - 48),
      )[0]!
    : enforceSegment(base);
  return stampPage(path, chosen);
}

export function fitDescription(
  path: string,
  description: string,
  topic: string,
): string {
  const curated = CURATED[path];
  if (
    curated &&
    inRange(curated.description, DESCRIPTION_MIN, DESCRIPTION_MAX)
  ) {
    return curated.description;
  }
  const subject =
    spaces(topic).replace(/\s*\|\s*FabStitch\s*$/i, "") || "this fabric";
  let text = spaces(description);
  if (text.length < DESCRIPTION_MIN) {
    text = spaces(
      `${text.replace(/[.!?]?$/, ".")} See how ${subject} relates to construction, weight, and apparel use.`,
    );
  }
  if (text.length < DESCRIPTION_MIN) {
    text = spaces(`${text} Compare published cloth before you inquire.`);
  }
  if (text.length > DESCRIPTION_MAX)
    text = trimTo(text, DESCRIPTION_MAX, DESCRIPTION_MIN);
  if (text.length < DESCRIPTION_MIN) {
    text = spaces(
      `Learn how ${subject} fits a fabric brief, from construction and weight to apparel use.`,
    );
    if (text.length > DESCRIPTION_MAX)
      text = trimTo(text, DESCRIPTION_MAX, DESCRIPTION_MIN);
  }
  if (!/[.!?]$/.test(text) && text.length < DESCRIPTION_MAX) text = `${text}.`;
  return text;
}

function varyTitle(
  path: string,
  title: string,
  token: string,
  spin: number,
): string {
  const base = titleSegment(title);
  const stamped = `${base} ${token} ${spin}`.replace(/\s+/g, " ");
  return stampPage(path, enforceSegment(stamped));
}

function varyDescription(text: string, token: string, spin: number): string {
  const stamp = ` Note ${spin}: ${token}.`;
  const room = DESCRIPTION_MAX - stamp.length;
  let base = text.replace(/\s*Note \d+:.*$/, "").trim();
  if (base.length > room) base = trimTo(base, room, 40);
  let next = spaces(`${base.replace(/[.!?]?$/, ".")}${stamp}`);
  if (next.length > DESCRIPTION_MAX)
    next = trimTo(next, DESCRIPTION_MAX, DESCRIPTION_MIN);
  if (next.length < DESCRIPTION_MIN) {
    next = spaces(`${next} Compare the cloth.`);
    if (next.length > DESCRIPTION_MAX)
      next = trimTo(next, DESCRIPTION_MAX, DESCRIPTION_MIN);
  }
  return next;
}

export function uniquifySnippets<
  T extends { path: string; title: string; description: string },
>(pages: T[]): T[] {
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();

  return pages.map((page) => {
    const hint = page.path.split("/").filter(Boolean).at(-1) ?? "fabric";
    let title = fitTitle(page.path, page.title);
    let description = fitDescription(page.path, page.description, page.title);
    let spin = 0;
    while (titles.has(renderedDocumentTitle(page.path, title).toLowerCase())) {
      spin += 1;
      title = varyTitle(page.path, page.title, hint.replace(/-/g, " "), spin);
      if (spin > 20) break;
    }
    titles.set(
      renderedDocumentTitle(page.path, title).toLowerCase(),
      page.path,
    );

    spin = 0;
    while (descriptions.has(description.toLowerCase())) {
      spin += 1;
      description = varyDescription(description, hint.replace(/-/g, " "), spin);
      if (spin > 20) break;
    }
    descriptions.set(description.toLowerCase(), page.path);
    return { ...page, title, description };
  });
}
