/**
 * Long-form SEO enrichment for existing collection routes.
 * Keeps /collections/{slug}/ as the canonical fibre destination.
 */

export type CollectionSeoSection = {
  heading: string;
  body: string;
};

export type CollectionSeoEnrichment = {
  seoTitle: string;
  seoDescription: string;
  primaryKeyword: string;
  sections: readonly CollectionSeoSection[];
  relatedPaths: readonly { href: string; label: string }[];
  faqs?: readonly { question: string; answer: string }[];
};

export const COLLECTION_SEO_BY_SLUG: Partial<
  Record<string, CollectionSeoEnrichment>
> = {
  cotton: {
    seoTitle: "Cotton Fabric for Clothing & Apparel",
    seoDescription:
      "Explore cotton fabric for shirts, dresses and apparel. Compare woven cotton constructions, composition and documented uses, then inquire on FabStitch.",
    primaryKeyword: "cotton fabric",
    sections: [
      {
        heading: "What cotton fabric means for buyers",
        body: "Cotton fabric is cloth made from cotton fibre — woven as poplin, voile, seersucker and other constructions, or knitted when the product record says so. Softness, thickness and drape come from yarn and structure, not from the fibre name alone.",
      },
      {
        heading: "Cotton for shirts, dresses and apparel",
        body: "Cotton shirt fabric and cotton dress fabric briefs need different hands. Crisp plains suit structured shirts; softer or more open cottons may suit dresses. Browse shirts and dresses Best For edits when the garment is fixed, and use this collection when cotton is the starting point.",
      },
      {
        heading: "Woven cotton, prints and by-the-yard inquiry",
        body: "FabStitch cotton entries keep published composition and construction visible. Inquire with metres (by the yard equivalent in your note) and garment context. Patterned or printed directions only apply when the named fabric documents them — photos alone are not a print claim.",
      },
    ],
    relatedPaths: [
      { href: "/fabrics/shirt-fabric/", label: "Shirt fabric guide" },
      { href: "/fabrics/dress-fabric/", label: "Dress fabric guide" },
      {
        href: "/guides/what-is-cotton-fabric/",
        label: "What is cotton fabric?",
      },
      { href: "/guides/fabric-weight-and-gsm/", label: "Fabric weight & GSM" },
      { href: "/wholesale-fabric/", label: "Wholesale fabric" },
      { href: "/marketplace/", label: "Fabric marketplace" },
    ],
    faqs: [
      {
        question: "Where can I buy cotton fabric on FabStitch?",
        answer:
          "Browse this cotton collection, open a named fabric page for specs, then inquire with quantity. You can also search the marketplace filtered toward cotton constructions.",
      },
    ],
  },
  "linen-lightweight": {
    seoTitle: "Linen Fabric for Clothing & Apparel",
    seoDescription:
      "Explore linen fabric and linen blends for clothing and dresses. Compare composition, weight and character, then inquire on FabStitch.",
    primaryKeyword: "linen fabric",
    sections: [
      {
        heading: "Linen fabric for apparel",
        body: "Linen fabric is valued for breathability and a distinctive hand in warm-weather clothing. Pure linen and linen blends (cotton, silk, viscose, lyocell) behave differently — read the published composition on each FabStitch record.",
      },
      {
        heading: "Lightweight linen and dress or shirt programmes",
        body: "Lightweight linen fabric suits shirts, dresses and relaxed apparel when crease behaviour fits the brief. Linen dress fabric and linen shirt directions should still be confirmed against Best For documentation on product pages.",
      },
      {
        heading: "Natural linen and blends by the metre",
        body: "Inquire with fabric name and quantity. Do not invent “100% linen” claims when the page lists a blend. Pair with the linen 2027 guide for seasonal context.",
      },
    ],
    relatedPaths: [
      { href: "/fabrics/dress-fabric/", label: "Dress fabric guide" },
      { href: "/fabrics/shirt-fabric/", label: "Shirt fabric guide" },
      { href: "/guides/linen-fabrics-2027/", label: "Linen fabrics 2027" },
      { href: "/guides/cotton-vs-linen/", label: "Cotton vs linen" },
      {
        href: "/guides/lightweight-fabric/",
        label: "Lightweight fabric guide",
      },
      { href: "/marketplace/", label: "Fabric marketplace" },
    ],
  },
  "silk-sheer": {
    seoTitle: "Silk Fabric for Apparel & Occasionwear",
    seoDescription:
      "Explore silk fabric types — chiffon, georgette, organza and crepe. Compare composition and character for apparel, then inquire on FabStitch.",
    primaryKeyword: "silk fabric",
    sections: [
      {
        heading: "What silk fabric is",
        body: "Silk fabric is cloth made with silk fibre as documented on the product page. Sheer chiffon, crinkled georgette, crisp organza and fluid crepe are different tools — not interchangeable “silk.”",
      },
      {
        heading: "Silk apparel and dress or shirt uses",
        body: "Silk clothing fabric suits layered dresses, occasion looks and some fluid shirts when opacity and drape match the silhouette. Satin-like behaviour only applies when the named construction supports it; satin is not automatically silk.",
      },
      {
        heading: "Buying silk by the yard on FabStitch",
        body: "Open a named silk fabric, read composition and construction, then inquire with metres and garment context. Patterned silk claims require documentation on the fabric record.",
      },
    ],
    relatedPaths: [
      { href: "/fabrics/dress-fabric/", label: "Dress fabric guide" },
      { href: "/guides/chiffon-vs-georgette/", label: "Chiffon vs georgette" },
      { href: "/guides/silk-vs-satin/", label: "Silk vs satin" },
      { href: "/fabrics/clothing/", label: "Clothing fabric hub" },
      { href: "/marketplace/", label: "Fabric marketplace" },
    ],
    faqs: [
      {
        question: "Is satin a type of silk?",
        answer:
          "Satin describes a weave/structure family; silk describes a fibre. Some satins use silk, others do not. Check composition on the fabric page.",
      },
    ],
  },
  denim: {
    seoTitle: "Denim Fabric for Jeans & Apparel",
    seoDescription:
      "Explore denim fabric for jeans and apparel. Compare weight units, composition and constructions, then inquire on FabStitch.",
    primaryKeyword: "denim fabric",
    sections: [
      {
        heading: "What denim fabric is",
        body: "Denim is a woven fabric traditionally associated with jeans and workwear. Composition is stated per product — often cotton or cotton blends — and weight may use ounces per square yard rather than GSM.",
      },
      {
        heading: "Denim for jeans and clothing",
        body: "Denim fabric for jeans and broader apparel spans lightweight to heavier documented ranges. Recycled, hemp-cotton and selvedge directions appear as separate named fabrics when published — not as invented grades.",
      },
      {
        heading: "Where to buy denim fabric on FabStitch",
        body: "Browse this collection, open specs, then inquire with quantity. Wholesale and sourcing pages cover commercial process language without exposing supplier identities.",
      },
    ],
    relatedPaths: [
      { href: "/guides/denim-2027/", label: "Denim 2027 guide" },
      { href: "/guides/fabric-weight-and-gsm/", label: "Fabric weight & GSM" },
      { href: "/guides/woven-vs-knit-fabrics/", label: "Woven vs knit" },
      { href: "/wholesale-fabric/", label: "Wholesale fabric" },
      { href: "/fabrics/clothing/", label: "Clothing fabric hub" },
      { href: "/marketplace/", label: "Fabric marketplace" },
    ],
    faqs: [
      {
        question: "What is denim made of?",
        answer:
          "Denim composition is listed on each fabric page. Many denims use cotton or cotton blends; FabStitch does not invent fibre content from the word denim alone.",
      },
    ],
  },
};
