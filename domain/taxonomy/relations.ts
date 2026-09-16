import type { Slug } from "@/domain/types";
import { APPLICATIONS, getApplication } from "./applications";
import {
  BUYER_SUBCATEGORIES,
  CERTIFICATIONS,
  COUNTRIES,
  countrySlug,
} from "./buyers";
// `family` is a *classification* ("knits"); the URL is the *ancestry*
// ("cotton/jersey"). 44 of 52 nodes differ, so building a fabric href from
// `family/slug` produced an alias on nearly every internal link on the site.
import { buildCanonical } from "./resolve";
import {
  FABRIC_FAMILIES,
  FABRIC_NODES,
  fabricsInFamily,
  getFabric,
} from "./fabrics";
import { bestForPathForApplication } from "@/lib/storefront-redirects";

/**
 * The relation graph.
 *
 * FabStitch is one chain read from different starting points:
 *
 *   Buyer -> Application -> Fabric -> Specification -> Country -> Supplier
 *
 * The taxonomy already stores the forward edges - an application names the
 * fabrics it needs, a buyer subcategory names the applications it makes. What
 * was missing is the ability to walk them *backwards*, which is what every
 * "related" block on every page actually needs: a fabric page has to know
 * which applications want it, and nothing in the data said so.
 *
 * So the reverse index is built once here, at module load, and every template
 * asks this module rather than hand-writing links. Adding one application that
 * names `french-terry` now improves the French terry page, the hoodie page and
 * the sportswear buyer page without anyone editing a component - which is the
 * whole point of keeping relationships in data (CLAUDE.md, "the core chain").
 */

export type RelatedLink = {
  label: string;
  href: string;
  /** One clause of context. Omitted when the label speaks for itself. */
  hint?: string;
  /** Present only when this link represents a canonical customer product. */
  fabricSlug?: string;
};

/* ==========================================================================
   Reverse indexes, built once
   ========================================================================== */

/** fabric slug -> applications that name it in `typicalFabrics`. */
const APPLICATIONS_BY_FABRIC = new Map<Slug, Slug[]>();
for (const application of APPLICATIONS) {
  for (const fabric of application.typicalFabrics) {
    const list = APPLICATIONS_BY_FABRIC.get(fabric) ?? [];
    list.push(application.slug);
    APPLICATIONS_BY_FABRIC.set(fabric, list);
  }
}

/** application slug -> buyer subcategories that manufacture it. */
const BUYERS_BY_APPLICATION = new Map<Slug, Slug[]>();
for (const subcategory of BUYER_SUBCATEGORIES) {
  for (const application of subcategory.applications) {
    const list = BUYERS_BY_APPLICATION.get(application) ?? [];
    list.push(subcategory.slug);
    BUYERS_BY_APPLICATION.set(application, list);
  }
}

const BUYER_BY_SLUG = new Map(BUYER_SUBCATEGORIES.map((b) => [b.slug, b]));
const COUNTRY_BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));

/* ==========================================================================
   Fabric
   ========================================================================== */

/** Applications that typically use this fabric, best-first. */
export function applicationsForFabric(slug: Slug, limit = 6): RelatedLink[] {
  return (APPLICATIONS_BY_FABRIC.get(slug) ?? [])
    .map(getApplication)
    .filter((a) => a !== undefined)
    .slice(0, limit)
    .map((a) => ({
      label: a.name,
      href: bestForPathForApplication(a.slug),
      hint: a.summary,
    }));
}

/**
 * Applications for this fabric and every child beneath it.
 *
 * A parent material such as jersey is a discovery page for its constructions,
 * so its product-fit section must include uses attached to single jersey and
 * the other descendants. Direct relationships remain first and every
 * application is de-duplicated.
 */
export function applicationsForFabricTree(
  slug: Slug,
  limit = 8,
): RelatedLink[] {
  const descendants: Slug[] = [];
  const visit = (parent: Slug) => {
    for (const node of FABRIC_NODES) {
      if (node.parentSlug !== parent) continue;
      descendants.push(node.slug);
      visit(node.slug);
    }
  };
  visit(slug);

  const seen = new Set<Slug>();
  const ordered = [slug, ...descendants].flatMap(
    (fabricSlug) => APPLICATIONS_BY_FABRIC.get(fabricSlug) ?? [],
  );

  return ordered
    .filter((applicationSlug) => {
      if (seen.has(applicationSlug)) return false;
      seen.add(applicationSlug);
      return true;
    })
    .map(getApplication)
    .filter((application) => application !== undefined)
    .slice(0, limit)
    .map((application) => ({
      label: application.name,
      href: `/marketplace/?application=${encodeURIComponent(application.slug)}`,
      hint: application.summary,
    }));
}

/** Other fabrics in the same family - the buyer's natural next comparison. */
export function siblingFabrics(slug: Slug, limit = 6): RelatedLink[] {
  const node = getFabric(slug);
  if (!node) return [];
  return fabricsInFamily(node.family)
    .filter((sibling) => sibling.slug !== slug)
    .slice(0, limit)
    .map((sibling) => ({
      label: sibling.name,
      href: buildCanonical(sibling),
      hint: sibling.summary,
    }));
}

/**
 * Buyer types that reach this fabric, through the applications that use it.
 *
 * Two hops, never a direct edge: buyers connect to fabric *through what they
 * manufacture*, and short-circuiting that is how a marketplace ends up
 * claiming a hotel-linen buyer wants denim.
 */
export function buyersForFabric(slug: Slug, limit = 5): RelatedLink[] {
  const seen = new Set<Slug>();
  const out: RelatedLink[] = [];

  for (const applicationSlug of APPLICATIONS_BY_FABRIC.get(slug) ?? []) {
    for (const buyerSlug of BUYERS_BY_APPLICATION.get(applicationSlug) ?? []) {
      if (seen.has(buyerSlug)) continue;
      seen.add(buyerSlug);
      const buyer = BUYER_BY_SLUG.get(buyerSlug);
      if (!buyer) continue;
      out.push({
        label: buyer.name,
        href: "/fabrics/best-for/",
        hint: "Browse fabrics by what you are making",
      });
      if (out.length >= limit) return out;
    }
  }
  return out;
}

/* ==========================================================================
   Application
   ========================================================================== */

/** Fabrics this application typically needs, in the order the taxonomy states. */
export function fabricsForApplication(slug: Slug, limit = 8): RelatedLink[] {
  const application = getApplication(slug);
  if (!application) return [];
  return application.typicalFabrics
    .map(getFabric)
    .filter((f) => f !== undefined)
    .slice(0, limit)
    .map((f) => ({
      label: f.name,
      href: buildCanonical(f),
      hint: f.summary,
    }));
}

/** Buyer types that manufacture this application. */
export function buyersForApplication(slug: Slug, limit = 6): RelatedLink[] {
  return (BUYERS_BY_APPLICATION.get(slug) ?? [])
    .map((s) => BUYER_BY_SLUG.get(s))
    .filter((b) => b !== undefined)
    .slice(0, limit)
    .map((b) => ({
      label: b.name,
      href: "/fabrics/best-for/",
      hint: "Browse fabrics by what you are making",
    }));
}

/** Other applications in the same group. */
export function siblingApplications(slug: Slug, limit = 6): RelatedLink[] {
  const application = getApplication(slug);
  if (!application) return [];
  return APPLICATIONS.filter(
    (other) => other.group === application.group && other.slug !== slug,
  )
    .slice(0, limit)
    .map((other) => ({
      label: other.name,
      href: bestForPathForApplication(other.slug),
    }));
}

/* ==========================================================================
   Buyer
   ========================================================================== */

/** Applications a buyer type manufactures. */
export function applicationsForBuyer(slug: Slug, limit = 8): RelatedLink[] {
  const buyer = BUYER_BY_SLUG.get(slug);
  if (!buyer) return [];
  return buyer.applications
    .map(getApplication)
    .filter((a) => a !== undefined)
    .slice(0, limit)
    .map((a) => ({
      label: a.name,
      href: bestForPathForApplication(a.slug),
      hint: a.summary,
    }));
}

/** Fabrics a buyer type reaches, through what it manufactures. */
export function fabricsForBuyer(slug: Slug, limit = 8): RelatedLink[] {
  const buyer = BUYER_BY_SLUG.get(slug);
  if (!buyer) return [];

  const seen = new Set<Slug>();
  const out: RelatedLink[] = [];
  for (const applicationSlug of buyer.applications) {
    const application = getApplication(applicationSlug);
    if (!application) continue;
    for (const fabricSlug of application.typicalFabrics) {
      if (seen.has(fabricSlug)) continue;
      seen.add(fabricSlug);
      const fabric = getFabric(fabricSlug);
      if (!fabric) continue;
      out.push({
        label: fabric.name,
        href: buildCanonical(fabric),
      });
      if (out.length >= limit) return out;
    }
  }
  return out;
}

/* ==========================================================================
   Observed relations
   ========================================================================== */

export function originsInResults(
  listings: { countryOfOrigin: string }[],
  limit = 6,
): RelatedLink[] {
  const counts = new Map<string, number>();
  for (const listing of listings) {
    counts.set(
      listing.countryOfOrigin,
      (counts.get(listing.countryOfOrigin) ?? 0) + 1,
    );
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([code, count]) => {
      const country = COUNTRY_BY_CODE.get(code);
      return {
        label: country?.name ?? code,
        // The country page, not `/suppliers/?country_code=PK`.
        //
        // A query string is a filter *state* and is never indexable (R4 and
        // lib/seo.ts), so the previous href spent a contextual internal link on
        // a URL that can never rank and passes nothing on. `/suppliers/{name}/`
        // is a real page with its own supply, and this was the only contextual
        // link into it - country pages were reachable from the masthead alone.
        href: country
          ? `/countries/${countrySlug(country.name)}/`
          : `/suppliers/`,
        hint: `${count} ${count === 1 ? "listing" : "listings"}`,
      };
    });
}

/** Every family, for footer-level and hub-level distribution. */
export function familyLinks(): RelatedLink[] {
  return FABRIC_FAMILIES.map((family) => ({
    label: family.name,
    href: `/fabrics/${family.slug}/`,
    hint: family.summary,
  }));
}

/** Total nodes in the graph, for sitemap sizing and diagnostics. */
export const GRAPH_SIZE = {
  fabrics: FABRIC_NODES.length,
  applications: APPLICATIONS.length,
  buyerTypes: BUYER_SUBCATEGORIES.length,
  certifications: CERTIFICATIONS.length,
  countries: COUNTRIES.length,
};
