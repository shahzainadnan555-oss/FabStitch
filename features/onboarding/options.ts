import {
  APPLICATION_GROUPS,
  FEATURED_APPLICATIONS,
} from "@/domain/taxonomy/applications";
import { BUYER_CATEGORIES } from "@/domain/taxonomy/buyers";
import { FABRIC_OPTIONS } from "./fabric-images";

export { FABRIC_OPTIONS };

const BUSINESS_SLUGS = [
  "clothing-fashion-brands",
  "garment-manufacturers",
  "fashion-designers",
  "sportswear-activewear-brands",
  "uniform-workwear-manufacturers",
  "home-textile-manufacturers",
  "textile-wholesalers-distributors",
] as const;

export const BUSINESS_OPTIONS = BUSINESS_SLUGS.map((slug) => {
  const category = BUYER_CATEGORIES.find((item) => item.slug === slug);
  if (!category) throw new Error(`Missing buyer category ${slug}`);
  return { value: category.slug, label: category.name, hint: category.summary };
});

export const WORK_OPTIONS = APPLICATION_GROUPS.map((group) => ({
  value: group.slug,
  label: group.name,
  hint: `${group.applications.length} supported uses`,
}));

export const USE_CASE_OPTIONS = FEATURED_APPLICATIONS.map((application) => ({
  value: application.slug,
  label: application.name,
  hint: application.summary,
}));

export const BUSINESS_VALUES: Set<string> = new Set(
  BUSINESS_OPTIONS.map((option) => option.value),
);
export const WORK_VALUES: Set<string> = new Set(
  WORK_OPTIONS.map((option) => option.value),
);
export const FABRIC_VALUES: Set<string> = new Set(
  FABRIC_OPTIONS.map((option) => option.value),
);
export const USE_CASE_VALUES: Set<string> = new Set(
  USE_CASE_OPTIONS.map((option) => option.value),
);
