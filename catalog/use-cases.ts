import { FABRICS_2027, type Fabric2027 } from "./fabrics-2027";
import type { BestForSlug } from "./best-for";

export type SeoUseCase = {
  slug: string;
  label: string;
  title: string;
  description: string;
  introduction: readonly string[];
  applicationSlugs: readonly BestForSlug[];
  related: readonly string[];
};

export const SEO_USE_CASES = [
  {
    slug: "shirts",
    label: "Shirts",
    title: "Fabrics for shirts",
    description:
      "Compare FabStitch fabrics documented for shirts, from breathable linen and crisp cotton to brushed flannel and fine corduroy.",
    introduction: [
      "Shirt fabric changes with season and purpose. The FabStitch 2027 collection includes lightweight linen and cotton for warm-weather shirting, fluid crepe de chine, and more substantial brushed flannel or fine-wale corduroy for cooler conditions.",
      "Use composition, construction and stated weight together. A fibre name alone does not explain whether a fabric is crisp, sheer, fluid or brushed, so each product page keeps those documented properties beside its intended applications.",
    ],
    applicationSlugs: ["shirting"],
    related: ["trousers", "womens-clothing", "tailoring"],
  },
  {
    slug: "womens-clothing",
    label: "Women's clothing",
    title: "Fabrics for women's clothing",
    description:
      "Explore FabStitch fabrics documented for dresses, blouses, skirts, occasionwear and fluid tailoring in the 2027 collection.",
    introduction: [
      "This edit brings together fabrics whose documented applications include dresses, blouses, skirts, occasionwear and close-to-body silhouettes. It ranges from breathable linen blends to chiffon, georgette, organza, taffeta and velvet.",
      "The materials are not interchangeable. Sheer chiffon is suited to layers, organza holds volume, georgette adds drape, taffeta keeps a crisp silhouette and crepe de chine hangs closer to the body. Follow the product specifications rather than choosing on fibre alone.",
    ],
    applicationSlugs: [
      "dresses",
      "blouses",
      "full-skirts",
      "slip-dresses",
      "occasionwear",
    ],
    related: ["dresses", "occasionwear", "resortwear"],
  },
  {
    slug: "dresses",
    label: "Dresses",
    title: "Fabrics for dresses",
    description:
      "Find linen, linen-silk, chiffon and georgette fabrics documented for dressmaking in the FabStitch 2027 collection.",
    introduction: [
      "The dress fabrics in this collection cover very different structures: breathable linen, fluid linen-silk, floating chiffon and crinkled georgette. Their product records show the stated composition, construction, weight and character where the reference provides them.",
      "For a dress that needs body, compare these materials with the related occasionwear edit. For a softer silhouette, start with the fabrics described as fluid or draped and account for lining where the cloth is sheer.",
    ],
    applicationSlugs: ["dresses"],
    related: ["womens-clothing", "occasionwear", "resortwear"],
  },
  {
    slug: "trousers",
    label: "Trousers",
    title: "Fabrics for trousers",
    description:
      "Compare linen, georgette, flannel and corduroy fabrics documented for trousers and bottoms.",
    introduction: [
      "Trouser fabrics need enough structure for the intended shape while remaining appropriate for the season. The documented 2027 options range from drapey linen-cellulosic blends and georgette to brushed flannel and corduroy.",
      "Check the stated weight and surface. A lighter fluid cloth answers a different design brief from dense moleskin or jumbo cord, even when both can be cut into trousers.",
    ],
    applicationSlugs: ["trousers", "bottoms", "workwear-trousers"],
    related: ["shirts", "tailoring", "outerwear"],
  },
  {
    slug: "tailoring",
    label: "Tailoring",
    title: "Fabrics for tailoring",
    description:
      "Explore lightweight wool blends, open weaves, flannel and soft tailoring fabrics selected for the FabStitch 2027 collection.",
    introduction: [
      "FabStitch's tailoring edit combines the light, breathable direction of SS 27 with brushed and softly structured AW 27/28 materials. It includes wool-silk bi-stretch, open wool-linen and wool-mohair weaves, tropical wool, flannel and boiled wool.",
      "The intended silhouette matters. Open weaves support unstructured jackets, stretch and recovery support summer suiting, while heavier brushed or boiled constructions belong to cooler-season tailoring.",
    ],
    applicationSlugs: ["suiting", "soft-tailoring", "unstructured-jackets"],
    related: ["shirts", "trousers", "outerwear"],
  },
  {
    slug: "activewear",
    label: "Activewear",
    title: "Fabrics for activewear",
    description:
      "Discover stretch, cooling, swim and retro-sport fabrics documented for performance apparel and next-to-skin uses.",
    introduction: [
      "The performance selection follows documented SS 27 directions rather than an invented popularity ranking. It includes stretch-woven compression, cooling constructions, crossover swim materials, ultra-light lounge knits and retro sportif structures.",
      "Choose from the intended use first: compression for next-to-skin baselayers, cooling construction for active apparel, crossover cloth for swim and city use, or piqué, mesh, tricot and ribs for a retro-sport direction.",
    ],
    applicationSlugs: [
      "performance-apparel",
      "baselayers",
      "swimwear",
      "loungewear",
      "citywear",
    ],
    related: ["knitwear", "outerwear", "resortwear"],
  },
  {
    slug: "knitwear",
    label: "Knitwear",
    title: "Fabrics for knitwear",
    description:
      "Explore open-stitch, pointelle, crochet-effect, bouclé and lightweight merino knitwear directions for 2027.",
    introduction: [
      "The 2027 knitwear direction is lighter and more open. Pointelle, crochet-effect and open-stitch structures bring visible air and texture, while fine gauges and lightweight merino extend knitwear beyond a winter-only category.",
      "Gauge, fibre and openness affect how each knit behaves. Product pages retain the documented gauge, micron, composition and application information where it is available.",
    ],
    applicationSlugs: ["knitwear", "statement-knits", "layering-pieces"],
    related: ["resortwear", "activewear", "womens-clothing"],
  },
  {
    slug: "resortwear",
    label: "Resortwear",
    title: "Fabrics for resortwear",
    description:
      "Find linen-silk and open knit constructions documented for breathable, textural resortwear.",
    introduction: [
      "FabStitch's resortwear selection pairs fluid linen-silk with open-stitch, pointelle and crochet-effect knits. The shared direction is lightness and visible structure rather than one prescribed fibre.",
      "Compare the drape of a woven linen-silk blend with the openness of a knit. Each creates a different silhouette and may require different layering or construction decisions.",
    ],
    applicationSlugs: ["resortwear"],
    related: ["dresses", "knitwear", "womens-clothing"],
  },
  {
    slug: "occasionwear",
    label: "Occasionwear",
    title: "Fabrics for occasionwear",
    description:
      "Compare taffeta, dupion and silk-viscose velvet documented for structured or fluid occasionwear.",
    introduction: [
      "The occasionwear edit moves between crisp and fluid surfaces. Taffeta holds shape with a papery rustle, dupion carries a slubby irregular surface, and silk-viscose velvet adds directional pile and lustre.",
      "Choose according to silhouette and surface rather than assuming all silk-led fabrics behave alike. Related product pages retain the specific construction and application notes supported by the 2027 reference.",
    ],
    applicationSlugs: ["occasionwear"],
    related: ["womens-clothing", "dresses", "outerwear"],
  },
  {
    slug: "outerwear",
    label: "Outerwear",
    title: "Fabrics for outerwear",
    description:
      "Explore coating, technical laminates, ripstop, corduroy and hybrid fabrics documented for outerwear.",
    introduction: [
      "The outerwear collection spans two distinct 2027 directions: tactile wool-led cloth and technical protection. Melton, double-face wool and Casentino emphasize weight and surface, while ripstop, laminates and wool-technical hybrids emphasize construction.",
      "The reference does not provide one universal outerwear specification. Use the stated weight, layers, fibre and application to decide whether a fabric belongs to coating, city outerwear, lightweight outerwear or technical protection.",
    ],
    applicationSlugs: [
      "outerwear",
      "coats",
      "unlined-coats",
      "lightweight-outerwear",
      "city-outerwear",
    ],
    related: ["tailoring", "trousers", "activewear"],
  },
  {
    slug: "home-textiles",
    label: "Home textiles",
    title: "Fabrics for home textiles",
    description:
      "Browse upholstery, curtains, sheers, bedding, rugs and contract textiles from the FabStitch 2027 home collection.",
    introduction: [
      "The Home & Contract collection is organized by what the textile needs to do: cover furniture, regulate light, support sleep, form a rug surface, absorb sound or withstand contract use.",
      "The product set includes bouclé, heavy linen, wool felt, performance weaves, open-weave curtains, technical voile, bedding constructions, rug fibres and contract materials. Where the source states a performance measure or construction, FabStitch preserves it on the product record.",
    ],
    applicationSlugs: [
      "home-decor",
      "interiors",
      "upholstery",
      "curtains",
      "sheers",
      "acoustic-drapes",
      "bedding",
      "rugs",
      "contract-textiles",
    ],
    related: ["upholstery", "bedding", "outerwear"],
  },
  {
    slug: "upholstery",
    label: "Upholstery",
    title: "Fabrics for upholstery",
    description:
      "Compare bouclé, heavy linen, wool felt and performance upholstery weaves in the FabStitch Home & Contract collection.",
    introduction: [
      "The upholstery edit follows four documented 2027 directions: tactile bouclé, heavy linen, wool felt and performance weave. They offer different surface, fibre and durability propositions rather than cosmetic variants of one fabric.",
      "Use the product record to distinguish construction and stated performance. Final suitability still depends on the commercial specification that accompanies the sellable fabric.",
    ],
    applicationSlugs: ["upholstery"],
    related: ["home-textiles", "bedding", "outerwear"],
  },
  {
    slug: "bedding",
    label: "Bedding",
    title: "Fabrics for bedding",
    description:
      "Explore cotton percale, cotton sateen, washed linen and lyocell-blend bedding fabrics selected for 2027.",
    introduction: [
      "FabStitch's bedding edit contains four constructions named by the home-textile reference: long-staple cotton percale, long-staple cotton sateen, washed linen and lyocell blends.",
      "These names identify different fibre and construction choices. Compare the product records directly instead of treating bedding as one generic cotton category, and leave unstated performance or care values open.",
    ],
    applicationSlugs: ["bedding"],
    related: ["home-textiles", "upholstery", "shirts"],
  },
] as const satisfies readonly SeoUseCase[];

export type SeoUseCaseSlug = (typeof SEO_USE_CASES)[number]["slug"];

export const SEO_USE_CASE_BY_SLUG = Object.fromEntries(
  SEO_USE_CASES.map((item) => [item.slug, item]),
) as Record<SeoUseCaseSlug, (typeof SEO_USE_CASES)[number]>;

export function fabricsForUseCase(useCase: SeoUseCase): Fabric2027[] {
  const allowed = new Set<BestForSlug>(useCase.applicationSlugs);
  return FABRICS_2027.filter((fabric) =>
    fabric.applications.some((application) => allowed.has(application)),
  );
}
