/**
 * The H1 for every indexable page type, in one place.
 *
 * An H1 is the page's answer to "what is this?", and a bare entity name does
 * not answer it. "Cotton" is a material; "Wholesale cotton fabric" is a page
 * about buying it. The pages here previously rendered the entity name alone,
 * which read identically to a filter chip and told a crawler nothing about
 * intent that the breadcrumb had not already said.
 *
 * ## Why a module rather than a string per page
 *
 * Six page types across six route files drift. Centralising them makes two
 * properties checkable instead of hoped for: that the pattern per type is
 * deterministic, and that no two page types produce the same sentence. The
 * second is what stops "Wholesale fabric" appearing as the H1 of a hundred
 * pages, which is the failure mode the brief calls out.
 *
 * ## What this does not do
 *
 * It does not restyle anything. `PageHeader` renders the H1 exactly as it did
 * - same element, same size, same weight, same spacing. Only the words change.
 *
 * It also does not keyword-stuff. Each pattern is the shortest phrase that
 * names the entity and the commercial context, in sentence case, the way the
 * rest of the marketplace copy is written. No "best", no "top", no "leading" -
 * there is no evidence for any of them.
 */

/** Sentence case, so "Cotton single jersey" not "Cotton Single Jersey". */
function sentence(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed[0].toUpperCase() + trimmed.slice(1);
}

/**
 * Lowercase an entity name for use mid-sentence, unless it is an acronym or a
 * proper noun that must keep its capitals.
 *
 * "T-shirts" stays "t-shirts" but "OEKO-TEX" and "Türkiye" must not be
 * mangled, so anything with an interior capital or a non-initial uppercase run
 * is left exactly as the record spells it.
 */
function midSentence(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  // Any uppercase after the first character means the record is deliberate
  // about its casing - a brand, an acronym, a place name.
  if (/[A-Z]/.test(trimmed.slice(1))) return trimmed;
  return trimmed[0].toLowerCase() + trimmed.slice(1);
}

/**
 * A fabric family: the top of the material tree.
 *
 * "Wholesale cotton fabric" - the word buyers actually search alongside the
 * material, and the thing the page lists.
 */
export function fabricFamilyH1(familyName: string): string {
  return sentence(`Wholesale ${midSentence(familyName)} fabric`);
}

/**
 * One cloth. "Cotton single jersey fabric".
 *
 * The trailing noun is dropped when the name already ends in it, so a record
 * called "Denim fabric" does not become "Denim fabric fabric".
 */
export function fabricH1(fabricName: string): string {
  const name = fabricName.trim();
  if (/\bfabrics?$/i.test(name)) return sentence(name);
  return sentence(`${name} fabric`);
}

/** What the buyer is making. "Wholesale fabric for t-shirts". */
export function applicationH1(applicationName: string): string {
  return sentence(`Wholesale fabric for ${midSentence(applicationName)}`);
}

/** The kind of business buying. "Wholesale fabric for boutiques". */
export function buyerCategoryH1(buyerName: string): string {
  return sentence(`Wholesale fabric for ${midSentence(buyerName)}`);
}

/**
 * Origin. "Wholesale fabric from Türkiye".
 *
 * Deliberately about the cloth rather than the companies: the page lists both,
 * but the fabric is what a sourcing manager is looking for, and "suppliers in
 * X" duplicated the supplier directory's own heading.
 */
export function countryH1(countryName: string): string {
  return sentence(`Wholesale fabric from ${countryName.trim()}`);
}

/** A standard. "OEKO-TEX 100 certified fabric". */
export function certificationH1(abbreviationOrName: string): string {
  return sentence(`${abbreviationOrName.trim()} certified fabric`);
}

/**
 * One company. "Ahmedabad Denim House - wholesale fabric supplier".
 *
 * The company name leads because that is the phrase people search, and the
 * qualifier follows so the H1 is not identical to the navbar's own rendering
 * of the same name.
 */
export function supplierH1(companyName: string): string {
  return `${companyName.trim()} - wholesale fabric supplier`;
}
