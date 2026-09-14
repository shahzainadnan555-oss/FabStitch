import { LANDING_MEDIA } from "@/components/landing/media";
import {
  APPLICATION_GROUPS,
  FEATURED_APPLICATIONS,
} from "@/domain/taxonomy/applications";
import { BUYER_CATEGORIES } from "@/domain/taxonomy/buyers";

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

export const FABRIC_OPTIONS = [
  {
    value: "cotton",
    label: "Cotton",
    image: LANDING_MEDIA.cotton,
  },
  { value: "silk", label: "Silk", image: LANDING_MEDIA.silk },
  { value: "linen", label: "Linen", image: LANDING_MEDIA.linen },
  { value: "denim", label: "Denim", image: LANDING_MEDIA.denim },
  { value: "knitwear", label: "Knitwear", image: LANDING_MEDIA.knit },
  { value: "tailoring", label: "Tailoring", image: LANDING_MEDIA.twill },
  {
    value: "performance",
    label: "Performance",
    image: LANDING_MEDIA.performance,
  },
  {
    value: "home-contract",
    label: "Home & Contract",
    image: LANDING_MEDIA.linen,
  },
] as const;

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
