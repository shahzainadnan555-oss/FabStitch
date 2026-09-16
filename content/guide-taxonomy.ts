export const GUIDE_CATEGORIES = [
  { slug: "fabric-basics", label: "Fabric Basics" },
  { slug: "fiber-material", label: "Fiber & Material" },
  { slug: "fabric-construction", label: "Fabric Construction" },
  { slug: "weight-performance", label: "Weight & Performance" },
  { slug: "fabric-applications", label: "Fabric Applications" },
  { slug: "sourcing-buying", label: "Sourcing & Buying" },
] as const;

export type GuideCategorySlug = (typeof GUIDE_CATEGORIES)[number]["slug"];

export const GUIDE_CATEGORY_BY_SLUG: Record<string, GuideCategorySlug> = {
  "fabrics-2027": "sourcing-buying",
  "spring-summer-2027-fabrics": "sourcing-buying",
  "autumn-winter-2027-28-fabrics": "sourcing-buying",
  "fabric-weight-and-gsm": "weight-performance",
  "woven-vs-knit-fabrics": "fabric-construction",
  "how-to-choose-fabric-for-shirts": "fabric-applications",
  "chiffon-vs-georgette": "fiber-material",
  "denim-2027": "fiber-material",
  "linen-fabrics-2027": "fiber-material",
  "what-is-cotton-fabric": "fabric-basics",
  "understanding-fabric-width": "fabric-basics",
  "cotton-vs-linen": "fiber-material",
  "silk-vs-satin": "fiber-material",
  "what-is-a-fabric-weave": "fabric-construction",
  "how-to-choose-the-right-fabric-weight": "weight-performance",
  "understanding-stretch-in-fabric": "weight-performance",
  "how-fabric-composition-affects-performance": "weight-performance",
  "how-to-choose-fabric-for-dresses": "fabric-applications",
  "choosing-fabric-for-activewear": "fabric-applications",
  "how-to-buy-fabric-online": "sourcing-buying",
  "how-to-source-fabric-for-clothing-brands": "sourcing-buying",
};

export const GUIDE_RELATED_BY_SLUG: Record<string, readonly string[]> = {
  "fabrics-2027": [
    "spring-summer-2027-fabrics",
    "autumn-winter-2027-28-fabrics",
    "linen-fabrics-2027",
  ],
  "spring-summer-2027-fabrics": ["fabrics-2027", "linen-fabrics-2027"],
  "autumn-winter-2027-28-fabrics": ["fabrics-2027", "denim-2027"],
  "fabric-weight-and-gsm": [
    "how-to-choose-the-right-fabric-weight",
    "understanding-fabric-width",
  ],
  "woven-vs-knit-fabrics": [
    "what-is-a-fabric-weave",
    "understanding-stretch-in-fabric",
  ],
  "how-to-choose-fabric-for-shirts": [
    "what-is-cotton-fabric",
    "how-to-choose-the-right-fabric-weight",
  ],
  "chiffon-vs-georgette": ["silk-vs-satin", "how-to-choose-fabric-for-dresses"],
  "denim-2027": [
    "woven-vs-knit-fabrics",
    "how-to-choose-the-right-fabric-weight",
  ],
  "linen-fabrics-2027": ["cotton-vs-linen", "what-is-cotton-fabric"],
  "what-is-cotton-fabric": [
    "cotton-vs-linen",
    "how-to-choose-fabric-for-shirts",
  ],
  "understanding-fabric-width": [
    "fabric-weight-and-gsm",
    "how-to-choose-the-right-fabric-weight",
  ],
  "cotton-vs-linen": ["what-is-cotton-fabric", "linen-fabrics-2027"],
  "silk-vs-satin": ["chiffon-vs-georgette", "how-to-choose-fabric-for-dresses"],
  "what-is-a-fabric-weave": [
    "woven-vs-knit-fabrics",
    "how-fabric-composition-affects-performance",
  ],
  "how-to-choose-the-right-fabric-weight": [
    "fabric-weight-and-gsm",
    "how-to-choose-fabric-for-shirts",
  ],
  "understanding-stretch-in-fabric": [
    "choosing-fabric-for-activewear",
    "woven-vs-knit-fabrics",
  ],
  "how-fabric-composition-affects-performance": [
    "what-is-cotton-fabric",
    "choosing-fabric-for-activewear",
  ],
  "how-to-choose-fabric-for-dresses": ["silk-vs-satin", "chiffon-vs-georgette"],
  "choosing-fabric-for-activewear": [
    "understanding-stretch-in-fabric",
    "how-fabric-composition-affects-performance",
    "how-to-buy-fabric-online",
  ],
  "how-to-buy-fabric-online": [
    "how-to-source-fabric-for-clothing-brands",
    "how-to-choose-fabric-for-shirts",
    "fabric-weight-and-gsm",
  ],
  "how-to-source-fabric-for-clothing-brands": [
    "how-to-buy-fabric-online",
    "fabrics-2027",
    "how-to-choose-fabric-for-dresses",
  ],
};

export function categoryLabel(slug: string): string {
  return (
    GUIDE_CATEGORIES.find((category) => category.slug === slug)?.label ??
    "Guides"
  );
}
