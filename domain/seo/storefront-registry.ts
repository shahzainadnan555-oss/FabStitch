import {
  BEST_FOR_BY_SLUG,
  CATALOG_COLLECTION_CARDS,
  COLLECTION_BY_SLUG,
  CURATED_FABRIC_SLUGS,
  FABRICS_2027,
  MEDIA_BY_FABRIC_SLUG,
  SEASONAL_COLLECTIONS,
  SEO_USE_CASES,
  SOURCE_FAMILY_BY_SLUG,
  fabricsForSeason,
  fabricsForUseCase,
} from "@/catalog";
import { CATALOG_GUIDES } from "@/content/guides";
import {
  SEO_LANDING_PAGES,
  seoLandingWordCount,
} from "@/content/seo-landing-pages";
import {
  MATERIAL_LANDING_PAGES,
  materialLandingWordCount,
} from "@/content/material-landing-pages";
import {
  COMMERCIAL_LANDING_PAGES,
  commercialLandingWordCount,
} from "@/content/commercial-landing-pages";
import { COLLECTION_SEO_BY_SLUG } from "@/content/collection-seo";
import { HELP_ARTICLES } from "@/features/help/content";
import { STOREFRONT_REDIRECT_FAMILIES } from "@/lib/storefront-redirects";
import {
  INDEXABLE_SEMANTIC_PAGES,
  SEMANTIC_PAGES,
} from "@/domain/seo/semantic";
import { MARKETPLACE_SUPPORT_PAGES } from "@/domain/seo/marketplace-cluster";
import {
  MARKETPLACE_TOPIC_HUBS,
  MARKETPLACE_TOPIC_PAGES,
} from "@/domain/seo/marketplace-thousand";
import {
  FABRIC_QUESTION_PAGES,
  fabricQuestionParent,
} from "@/domain/seo/fabric-questions";
import {
  DISCOVER_CLUSTER_META,
  discoverClusterPageCount,
  discoverClusterPath,
  pagesForDiscoverCluster,
} from "@/lib/discover-directory";
import {
  SEO_PUBLICATION_OVERRIDES,
  launchBatchForPage,
  launchPhaseForPageType,
  publicationForPage,
} from "@/domain/seo/launch-manifest";
import {
  assertPublication,
  canonicalSeoPath,
  resolvePublication,
  type EffectivePublicationStatus,
  type SeoLaunchPhase,
  type SeoPublication,
  type SeoPublicationStatus,
} from "@/domain/seo/publication";

export type StorefrontPageType =
  | "home"
  | "marketplace"
  | "marketplace_support"
  | "marketplace_topic"
  | "fabric_hub"
  | "fabric"
  | "intent_hub"
  | "commercial_landing"
  | "semantic_landing"
  | "collection_hub"
  | "collection"
  | "seasonal_collection"
  | "best_for_hub"
  | "best_for"
  | "guide_hub"
  | "guide"
  | "fabric_question"
  | "help_hub"
  | "help"
  | "brand"
  | "support"
  | "legal"
  | "private";

export type SearchIntent =
  | "brand"
  | "commercial"
  | "commercial_investigation"
  | "informational"
  | "navigational"
  | "support";

export type SeoSchemaType =
  | "Organization"
  | "WebSite"
  | "WebPage"
  | "CollectionPage"
  | "Product"
  | "Article"
  | "FAQPage"
  | "BreadcrumbList";

type SeoPageDefinition = {
  path: string;
  type: StorefrontPageType;
  title: string;
  description: string;
  h1?: string;
  primaryTopic: string;
  secondaryTopics: readonly string[];
  intent: SearchIntent;
  audience: "Fabric customers" | "Existing customers";
  contentOwner: "FabStitch";
  contentSource: string;
  relatedPaths: readonly string[];
  qualityGatePassed: boolean;
  productCount?: number;
  wordCount?: number;
  image?: string;
};

export type SeoPageRecord = Omit<
  SeoPageDefinition,
  "h1" | "qualityGatePassed"
> & {
  h1: string;
  canonicalPath: string;
  parentPath?: string;
  qualityGatePassed: boolean;
  launchPhase: SeoLaunchPhase;
  launchBatch: string;
  publication: SeoPublication;
  status: SeoPublicationStatus;
  effectiveStatus: EffectivePublicationStatus;
  isPublic: boolean;
  indexable: boolean;
  sitemapEligible: boolean;
  internalLinkEligible: boolean;
  expectedSchemas: readonly SeoSchemaType[];
  expectsBreadcrumbs: boolean;
};

function words(values: readonly string[]): number {
  return values.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

const staticPages: SeoPageDefinition[] = [
  {
    path: "/",
    type: "home",
    title: "FabStitch | B2B Fabric Marketplace & Fabric Sourcing",
    h1: "Find fabric that fits your vision.",
    description:
      "Discover fabrics for apparel, fashion, and manufacturing with FabStitch, a B2B fabric marketplace for discovering materials and sourcing fabric for your next project.",
    primaryTopic: "FabStitch fabric marketplace",
    secondaryTopics: [
      "fabric discovery",
      "fabric sourcing",
      "fabric materials",
      "textile marketplace",
    ],
    intent: "brand",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "FabStitch product positioning and 2027 catalog",
    relatedPaths: [
      "/marketplace/",
      "/fabrics/",
      "/collections/",
      "/fabrics/best-for/shirts/",
      "/fabrics/best-for/dresses/",
      "/guides/",
      "/guides/fabric-questions/",
      "/wholesale-fabric/",
      "/fabric-sourcing/",
      "/discover/",
    ],
    qualityGatePassed: true,
    image: "/media/hero-navy-jersey.jpg",
  },
  {
    path: "/marketplace/",
    type: "marketplace",
    title: "Fabric Marketplace",
    h1: "Discover fabrics for what comes next.",
    description:
      "Buy fabric online through the FabStitch B2B textile marketplace and online fabric shop. Search by material, construction, season, weight, and Best For use, then inquire on the cloth that fits.",
    primaryTopic: "fabric marketplace",
    secondaryTopics: [
      "buy fabric",
      "fabric website",
      "where to buy fabric",
      "fabric search",
      "textile sourcing",
      "b2b textile marketplace",
      "textile marketplace",
      "2027 fabrics",
    ],
    intent: "commercial",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "Canonical FabStitch catalog",
    relatedPaths: [
      "/fabrics/",
      "/collections/",
      "/fabrics/best-for/",
      "/fabric-sourcing/",
      "/wholesale-fabric/",
      "/fabrics/clothing/",
      "/fabrics/apparel/",
      "/fabrics/fashion/",
      "/guides/",
      "/guides/fabric-questions/",
      "/guides/fabric-weight-and-gsm/",
      "/guides/cotton-vs-linen/",
      "/guides/how-to-buy-fabric-online/",
      "/guides/how-to-source-fabric-for-clothing-brands/",
      ...CURATED_FABRIC_SLUGS.map((slug) => `/fabrics/${slug}/`),
    ],
    qualityGatePassed: true,
  },
  {
    path: "/fabrics/",
    type: "fabric_hub",
    title: "Explore Fabrics",
    h1: "Find the fabric, then read the detail.",
    description:
      "Browse FabStitch fabrics and fabric materials by collection, Best For use, and searchable marketplace. Compare composition, weight, construction, and sources of fabric before you inquire.",
    primaryTopic: "fabric materials",
    secondaryTopics: [
      "fabrics",
      "fabric textile material",
      "fabric types",
      "cloth material",
      "source of fabric",
      "sources of fabrics",
      "fabric products",
    ],
    intent: "commercial_investigation",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "Canonical FabStitch catalog",
    relatedPaths: [
      "/marketplace/",
      "/collections/",
      "/fabrics/best-for/",
      "/fabric-sourcing/",
      "/wholesale-fabric/",
      "/fabrics/clothing/",
      "/fabrics/apparel/",
      "/fabrics/fashion/",
      "/guides/",
    ],
    qualityGatePassed: true,
    productCount: FABRICS_2027.length,
  },
  ...COMMERCIAL_LANDING_PAGES.map((page): SeoPageDefinition => ({
    path: page.path,
    type: "commercial_landing",
    title: page.title,
    h1: page.h1,
    description: page.metaDescription,
    primaryTopic: page.primaryKeyword,
    secondaryTopics: [...page.secondaryKeywords],
    intent: "commercial",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "FabStitch commercial keyword-cluster landing content",
    relatedPaths: [
      "/marketplace/",
      "/fabrics/",
      "/collections/",
      "/fabrics/best-for/",
      "/guides/",
      ...page.relatedLandingPaths,
      ...page.guidePaths,
      ...page.bestForSlugs.map((slug) => `/fabrics/best-for/${slug}/`),
      ...page.collectionSlugs.map((slug) => `/collections/${slug}/`),
      ...page.fabricSlugs.map((slug) => `/fabrics/${slug}/`),
    ],
    qualityGatePassed: commercialLandingWordCount(page) >= 500,
    wordCount: commercialLandingWordCount(page),
    image: page.image,
  })),
  ...SEO_LANDING_PAGES.map((page): SeoPageDefinition => ({
    path: page.path,
    type: "intent_hub",
    title: page.title,
    h1: page.h1,
    description: page.metaDescription,
    primaryTopic: page.primaryKeyword,
    secondaryTopics: [...page.secondaryKeywords],
    intent: "commercial_investigation",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "FabStitch keyword-cluster landing content",
    relatedPaths: [
      "/marketplace/",
      "/fabrics/",
      "/collections/",
      "/fabrics/best-for/",
      "/fabric-sourcing/",
      "/wholesale-fabric/",
      "/guides/",
      ...page.relatedLandingPaths,
      ...page.guidePaths,
      ...page.bestForSlugs.map((slug) => `/fabrics/best-for/${slug}/`),
      ...page.collectionSlugs.map((slug) => `/collections/${slug}/`),
      ...page.fabricSlugs.map((slug) => `/fabrics/${slug}/`),
    ],
    qualityGatePassed: seoLandingWordCount(page) >= 400,
    wordCount: seoLandingWordCount(page),
    image: page.image,
  })),
  ...MATERIAL_LANDING_PAGES.map((page): SeoPageDefinition => ({
    path: page.path,
    type: "intent_hub",
    title: page.title,
    h1: page.h1,
    description: page.metaDescription,
    primaryTopic: page.primaryKeyword,
    secondaryTopics: [...page.secondaryKeywords],
    intent: "commercial_investigation",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "FabStitch material keyword-cluster landing content",
    relatedPaths: [
      "/marketplace/",
      "/fabrics/",
      "/collections/",
      "/fabrics/best-for/",
      "/fabric-sourcing/",
      "/wholesale-fabric/",
      "/guides/",
      ...page.relatedLandingPaths,
      ...page.guidePaths,
      ...page.bestForSlugs.map((slug) => `/fabrics/best-for/${slug}/`),
      ...page.collectionSlugs.map((slug) => `/collections/${slug}/`),
      ...page.fabricSlugs.map((slug) => `/fabrics/${slug}/`),
    ],
    qualityGatePassed: materialLandingWordCount(page) >= 400,
    wordCount: materialLandingWordCount(page),
    image: page.image,
  })),
  {
    path: "/collections/",
    type: "collection_hub",
    title: "Fabric Collections",
    h1: "Start with the material.",
    description:
      "Browse FabStitch fabric collections — linen, cotton, silk, denim, technical outerwear, and home textiles — then open individual fabrics for source-backed specs.",
    primaryTopic: "fabric collections",
    secondaryTopics: [
      "fabric materials",
      "seasonal fabrics",
      "linen fabrics",
      "cotton fabrics",
    ],
    intent: "commercial_investigation",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "Canonical collection registry",
    relatedPaths: [
      "/marketplace/",
      "/fabrics/",
      "/fabrics/best-for/",
      ...CATALOG_COLLECTION_CARDS.map(
        (collection) => `/collections/${collection.slug}/`,
      ),
      ...SEASONAL_COLLECTIONS.map(
        (collection) => `/collections/${collection.slug}/`,
      ),
    ],
    qualityGatePassed: true,
    productCount: FABRICS_2027.length,
  },
  {
    path: "/fabrics/best-for/",
    type: "best_for_hub",
    title: "Fabrics by Use",
    h1: "Find fabric for what you are making.",
    description:
      "Choose fabrics by end use — shirts, dresses, activewear, outerwear, bedding, and more. Each Best For edit groups FabStitch fabrics with documented fit for that product.",
    primaryTopic: "best fabrics by use",
    secondaryTopics: [
      "apparel fabrics",
      "home textiles",
      "shirt fabrics",
      "dress fabrics",
    ],
    intent: "commercial_investigation",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "Document-supported catalog applications",
    relatedPaths: [
      "/marketplace/",
      "/fabrics/",
      "/collections/",
      "/guides/",
      ...SEO_USE_CASES.map((useCase) => `/fabrics/best-for/${useCase.slug}/`),
    ],
    qualityGatePassed: true,
    productCount: FABRICS_2027.length,
  },
  {
    path: "/guides/",
    type: "guide_hub",
    title: "Fabric Guides",
    h1: "Fabric knowledge for better sourcing.",
    description:
      "Practical FabStitch guides on fabric weight, composition, weaves, and how to choose materials for shirts, dresses, activewear, and more.",
    primaryTopic: "fabric education",
    secondaryTopics: [
      "fabric sourcing education",
      "2027 fabric directions",
      "fabric weight GSM",
      "woven vs knit",
    ],
    intent: "informational",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "FabStitch 2027 reference and catalog",
    relatedPaths: [
      ...CATALOG_GUIDES.map((guide) => guide.path),
      "/marketplace/",
      "/fabrics/",
      "/collections/",
      "/fabrics/best-for/",
      "/guides/fabric-questions/",
      "/help/",
    ],
    qualityGatePassed: true,
  },
  {
    path: "/help/",
    type: "help_hub",
    title: "Help Center",
    h1: "How can we help?",
    description:
      "Find quick answers about discovering fabrics, sending inquiries, managing your account, and using FabStitch.",
    primaryTopic: "FabStitch help",
    secondaryTopics: ["fabric search help", "fabric inquiries"],
    intent: "support",
    audience: "Existing customers",
    contentOwner: "FabStitch",
    contentSource: "FabStitch product behavior",
    relatedPaths: [
      ...HELP_ARTICLES.map((article) => `/help/${article.slug}/`),
      "/contact/",
    ],
    qualityGatePassed: true,
  },
  {
    path: "/about/",
    type: "brand",
    title: "About FabStitch",
    h1: "Material decisions, made clearer.",
    description:
      "Why FabStitch exists and how a material-first fabric storefront makes product discovery and comparison clearer.",
    primaryTopic: "about FabStitch",
    secondaryTopics: ["fabric discovery", "material sourcing"],
    intent: "brand",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "FabStitch product positioning",
    relatedPaths: ["/how-it-works/", "/marketplace/", "/contact/"],
    qualityGatePassed: true,
  },
  {
    path: "/how-it-works/",
    type: "brand",
    title: "How FabStitch works",
    h1: "From an idea to the right fabric.",
    description:
      "See how FabStitch connects fabric discovery, search, Best For guidance, product detail, quantity and buying.",
    primaryTopic: "how FabStitch works",
    secondaryTopics: ["fabric search", "fabric buying"],
    intent: "navigational",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "FabStitch product behavior",
    relatedPaths: [
      "/marketplace/",
      "/collections/",
      "/help/how-fabstitch-works/",
    ],
    qualityGatePassed: true,
  },
  {
    path: "/contact/",
    type: "brand",
    title: "Contact",
    h1: "Let’s talk fabrics.",
    description:
      "Contact FabStitch about a fabric, the marketplace, an order or how the product works.",
    primaryTopic: "contact FabStitch",
    secondaryTopics: ["fabric help", "customer support"],
    intent: "navigational",
    audience: "Existing customers",
    contentOwner: "FabStitch",
    contentSource: "FabStitch contact configuration",
    relatedPaths: ["/help/", "/support/", "/marketplace/"],
    qualityGatePassed: true,
  },
  {
    path: "/support/",
    type: "support",
    title: "Need help with something specific?",
    h1: "Need help with something specific?",
    description:
      "Contact FabStitch for fabric inquiries, sourcing questions, account issues, and help using the platform.",
    primaryTopic: "FabStitch support",
    secondaryTopics: ["customer assistance"],
    intent: "support",
    audience: "Existing customers",
    contentOwner: "FabStitch",
    contentSource: "FabStitch support configuration",
    relatedPaths: ["/help/", "/contact/"],
    qualityGatePassed: true,
  },
];

const fabricPages: SeoPageDefinition[] = FABRICS_2027.map((fabric) => {
  const family = SOURCE_FAMILY_BY_SLUG[fabric.family];
  const collection = COLLECTION_BY_SLUG[fabric.collection];
  const composition =
    "composition" in fabric ? (fabric.composition ?? []).join(" / ") : "";
  const characteristics =
    "characteristics" in fabric
      ? (fabric.characteristics ?? []).join(", ")
      : "";
  const applications = fabric.applications.map(
    (slug) => BEST_FOR_BY_SLUG[slug].label,
  );
  const description = `Explore ${fabric.name} in the FabStitch 2027 collection${composition ? `, with ${composition}` : ""}${characteristics ? `. ${characteristics}` : ""}${applications.length ? `. Best for ${applications.slice(0, 3).join(", ")}` : ""}.`;
  const media = MEDIA_BY_FABRIC_SLUG[fabric.slug];
  const fabricTopic = /\bfabric$/i.test(fabric.name)
    ? fabric.name
    : `${fabric.name} fabric`;
  return {
    path: `/fabrics/${fabric.slug}/`,
    type: "fabric",
    title: fabric.name,
    h1: fabric.name,
    description,
    primaryTopic: fabricTopic,
    secondaryTopics: [
      family.label,
      collection.label,
      ...applications.slice(0, 3),
    ],
    intent: "commercial_investigation",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: fabric.source,
    relatedPaths: [
      `/collections/${collection.slug}/`,
      ...applications
        .map((label) =>
          SEO_USE_CASES.find((item) =>
            item.applicationSlugs.some(
              (slug) => BEST_FOR_BY_SLUG[slug].label === label,
            ),
          ),
        )
        .filter(Boolean)
        .slice(0, 2)
        .map((item) => `/fabrics/best-for/${item!.slug}/`),
    ],
    qualityGatePassed: true,
    image:
      (media.status as string) === "final" && "src" in media
        ? media.src
        : undefined,
  } satisfies SeoPageDefinition;
});

const collectionPages: SeoPageDefinition[] = CATALOG_COLLECTION_CARDS.map(
  (card) => {
    const collection = COLLECTION_BY_SLUG[card.slug];
    const products = FABRICS_2027.filter(
      (fabric) => fabric.collection === card.slug,
    );
    const representativeMedia = MEDIA_BY_FABRIC_SLUG[card.representativeFabric];
    const enrichment = COLLECTION_SEO_BY_SLUG[card.slug];
    return {
      path: `/collections/${card.slug}/`,
      type: "collection",
      title: enrichment?.seoTitle ?? `${collection.label} fabrics`,
      h1: enrichment?.seoTitle ?? `${collection.label} fabrics`,
      description:
        enrichment?.seoDescription ??
        `${card.description} Compare ${products.length} named FabStitch fabrics with source-supported properties and uses.`,
      primaryTopic: enrichment?.primaryKeyword ?? `${collection.label} fabrics`,
      secondaryTopics: products.slice(0, 5).map((fabric) => fabric.name),
      intent: "commercial_investigation",
      audience: "Fabric customers",
      contentOwner: "FabStitch",
      contentSource: "FabStitch 2027 collection registry",
      relatedPaths: [
        "/marketplace/",
        "/fabrics/",
        "/fabrics/best-for/",
        "/fabric-sourcing/",
        "/wholesale-fabric/",
        "/guides/",
        ...(enrichment?.relatedPaths.map((item) => item.href) ?? []),
        ...products.map((fabric) => `/fabrics/${fabric.slug}/`),
      ],
      productCount: products.length,
      qualityGatePassed: products.length >= 3,
      image:
        representativeMedia?.status === "final"
          ? representativeMedia.src
          : undefined,
    };
  },
);

const seasonalPages: SeoPageDefinition[] = SEASONAL_COLLECTIONS.map((theme) => {
  const products = fabricsForSeason(theme);
  return {
    path: `/collections/${theme.slug}/`,
    type: "seasonal_collection",
    title: theme.title,
    h1: theme.title,
    description: theme.description,
    primaryTopic: theme.title,
    secondaryTopics: theme.relatedCollections.map(
      (slug) => COLLECTION_BY_SLUG[slug].label,
    ),
    intent: "commercial_investigation",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "Fabrics for 2027 sourcing and design reference",
    relatedPaths: [
      "/guides/fabrics-2027/",
      ...theme.relatedCollections.map((slug) => `/collections/${slug}/`),
      ...products.map((fabric) => `/fabrics/${fabric.slug}/`),
    ],
    productCount: products.length,
    wordCount: words([
      theme.title,
      theme.description,
      ...theme.introduction,
      ...products.map((fabric) => fabric.name),
    ]),
    qualityGatePassed: products.length >= 3 && words(theme.introduction) >= 50,
    image:
      products[0] && MEDIA_BY_FABRIC_SLUG[products[0].slug]?.status === "final"
        ? MEDIA_BY_FABRIC_SLUG[products[0].slug].src
        : undefined,
  };
});

const bestForPages: SeoPageDefinition[] = SEO_USE_CASES.map((useCase) => {
  const products = fabricsForUseCase(useCase);
  const introWords = words(useCase.introduction);
  const indexable = products.length >= 3 && introWords >= 45;
  const contentWords = words([
    useCase.title,
    useCase.description,
    ...useCase.introduction,
    ...products.map((fabric) => fabric.name),
  ]);
  return {
    path: `/fabrics/best-for/${useCase.slug}/`,
    type: "best_for",
    title: useCase.title,
    h1: useCase.title,
    description: useCase.description,
    primaryTopic: useCase.title,
    secondaryTopics: products.slice(0, 6).map((fabric) => fabric.name),
    intent: "commercial_investigation",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "Document-supported catalog application mappings",
    relatedPaths: [
      ...products.map((fabric) => `/fabrics/${fabric.slug}/`),
      ...useCase.related.map((slug) => `/fabrics/best-for/${slug}/`),
      ...CATALOG_GUIDES.filter((guide) =>
        guide.applicationSlugs.includes(useCase.slug),
      ).map((guide) => guide.path),
    ],
    productCount: products.length,
    wordCount: contentWords,
    qualityGatePassed: indexable,
    image:
      products[0] && MEDIA_BY_FABRIC_SLUG[products[0].slug]?.status === "final"
        ? MEDIA_BY_FABRIC_SLUG[products[0].slug].src
        : undefined,
  };
});

const guidePages: SeoPageDefinition[] = CATALOG_GUIDES.map((guide) => {
  const indexable = guide.wordCount >= 300 && guide.sections.length >= 3;
  return {
    path: guide.path,
    type: "guide",
    title: guide.title,
    h1: guide.heading,
    description: guide.metaDescription,
    primaryTopic: guide.heading,
    secondaryTopics: [
      guide.cluster,
      ...guide.fabricSlugs.slice(0, 5),
      ...guide.applicationSlugs.slice(0, 3),
    ],
    intent: "informational",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "FabStitch 2027 reference and canonical catalog",
    relatedPaths: [
      ...guide.fabricSlugs.map((slug) => `/fabrics/${slug}/`),
      ...guide.applicationSlugs.map((slug) => `/fabrics/best-for/${slug}/`),
      ...(guide.slug === "spring-summer-2027-fabrics"
        ? ["/collections/spring-summer-2027/"]
        : []),
      ...(guide.slug === "autumn-winter-2027-28-fabrics"
        ? ["/collections/autumn-winter-2027-28/"]
        : []),
      ...(guide.slug === "fabrics-2027"
        ? ["/collections/home-contract-2027-28/"]
        : []),
    ],
    wordCount: guide.wordCount,
    qualityGatePassed: indexable,
  };
});

const helpPages: SeoPageDefinition[] = HELP_ARTICLES.map((article) => ({
  path: `/help/${article.slug}/`,
  type: "help",
  title: article.title,
  h1: article.title,
  description: article.summary,
  primaryTopic: article.title,
  secondaryTopics: [article.category],
  intent: "support",
  audience: "Existing customers",
  contentOwner: "FabStitch",
  contentSource: "FabStitch visible product behavior",
  relatedPaths: [
    ...article.related.map((item) => item.href),
    ...HELP_ARTICLES.filter(
      (candidate) =>
        candidate.category === article.category &&
        candidate.slug !== article.slug,
    )
      .slice(0, 5)
      .map((candidate) => `/help/${candidate.slug}/`),
  ],
  qualityGatePassed: article.indexable,
  wordCount: words(
    article.sections.flatMap((section) => [section.heading, ...section.body]),
  ),
}));

const privatePages: SeoPageDefinition[] = [
  "/login/",
  "/signup/",
  "/account/",
  "/account/preferences/",
  "/onboarding/",
  "/verify/",
  "/forgot-password/",
  "/reset-password/",
].map((path) => ({
  path,
  type: "private",
  title: `Private FabStitch page: ${path}`,
  h1: "Account utility",
  description: "Private or account utility route.",
  primaryTopic: "Account utility",
  secondaryTopics: [],
  intent: "navigational",
  audience: "Existing customers",
  contentOwner: "FabStitch",
  contentSource: "Application route policy",
  relatedPaths: [],
  qualityGatePassed: false,
}));

function parentPathFor(page: SeoPageDefinition): string | undefined {
  if (page.path === "/") return undefined;
  if (
    page.type === "marketplace" ||
    page.type === "fabric_hub" ||
    page.type === "brand" ||
    page.type === "legal"
  ) {
    return "/";
  }
  if (page.type === "marketplace_support") return "/marketplace/";
  if (page.type === "marketplace_topic") {
    const topic = MARKETPLACE_TOPIC_PAGES.find((item) => item.path === page.path);
    if (!topic || topic.kind === "hub") return "/marketplace/";
    return (
      MARKETPLACE_TOPIC_HUBS.find((hub) => hub.family === topic.family)?.path ??
      "/marketplace/"
    );
  }
  if (page.type === "collection_hub") return "/fabrics/";
  if (page.type === "collection" || page.type === "seasonal_collection") {
    return "/collections/";
  }
  if (page.type === "fabric") {
    return page.relatedPaths.find((path) => path.startsWith("/collections/"));
  }
  if (page.type === "best_for_hub") return "/fabrics/";
  if (page.type === "best_for") return "/fabrics/best-for/";
  if (page.type === "intent_hub") return "/fabrics/";
  if (page.type === "commercial_landing") return "/";
  if (page.type === "semantic_landing") {
    if (page.path === "/discover/") return "/";
    if (/^\/discover\/topics\/[^/]+\/page\/\d+\/$/.test(page.path)) {
      return page.path.replace(/page\/\d+\/$/, "");
    }
    if (/^\/discover\/topics\/[^/]+\/$/.test(page.path)) return "/discover/";
    return "/discover/";
  }
  if (page.type === "guide_hub") return "/guides/";
  if (page.type === "guide") {
    const guide = CATALOG_GUIDES.find((item) => item.path === page.path);
    return guide?.pillarSlug ? `/guides/${guide.pillarSlug}/` : "/guides/";
  }
  if (page.type === "fabric_question") return fabricQuestionParent(page.path);
  if (page.type === "help_hub") return "/";
  if (page.type === "help" || page.type === "support") return "/help/";
  return undefined;
}

function expectedSchemasFor(page: SeoPageDefinition): SeoSchemaType[] {
  const schemas: SeoSchemaType[] = ["Organization"];
  if (page.type === "home") schemas.push("WebSite");
  if (
    page.type === "marketplace" ||
    page.type === "fabric_hub" ||
    page.type === "intent_hub" ||
    page.type === "commercial_landing" ||
    page.type === "semantic_landing" ||
    page.type === "collection_hub" ||
    page.type === "collection" ||
    page.type === "seasonal_collection" ||
    page.type === "best_for_hub" ||
    page.type === "best_for" ||
    page.type === "guide_hub"
  ) {
    schemas.push("CollectionPage");
  }
  if (page.type === "fabric") schemas.push("Product");
  if (page.type === "guide") {
    schemas.push("Article");
    const guide = CATALOG_GUIDES.find((item) => item.path === page.path);
    if (guide?.faqs.length) schemas.push("FAQPage");
  }
  if (page.type === "fabric_question") {
    const question = FABRIC_QUESTION_PAGES.find(
      (item) => item.path === page.path,
    );
    if (question?.kind === "question") {
      schemas.push("Article");
    } else {
      schemas.push("CollectionPage");
    }
    if (question?.faqs.length) schemas.push("FAQPage");
  }
  if (
    page.type === "marketplace_support" ||
    page.type === "marketplace_topic"
  ) {
    schemas.push("Article", "FAQPage");
  }
  if (page.type === "commercial_landing") {
    const commercial = COMMERCIAL_LANDING_PAGES.find(
      (item) => item.path === page.path,
    );
    if (commercial?.faqs.length) schemas.push("FAQPage");
  }
  if (page.type === "intent_hub") {
    const material = MATERIAL_LANDING_PAGES.find(
      (item) => item.path === page.path,
    );
    if (material?.faqs.length) schemas.push("FAQPage");
  }
  if (page.type === "semantic_landing") {
    const semantic = SEMANTIC_PAGES.find((item) => item.path === page.path);
    if (semantic?.faqs.length) schemas.push("FAQPage");
  }
  if (page.type === "collection") {
    const enrichment = COLLECTION_SEO_BY_SLUG[page.path.split("/")[2] ?? ""];
    if (enrichment?.faqs?.length) schemas.push("FAQPage");
  }

  const hasBreadcrumbs =
    page.path !== "/" &&
    page.path !== "/marketplace/" &&
    page.path !== "/how-it-works/" &&
    page.path !== "/contact/" &&
    page.type !== "private";
  if (hasBreadcrumbs) schemas.push("BreadcrumbList");
  return schemas;
}

function resolvePage(page: SeoPageDefinition): SeoPageRecord {
  const path = canonicalSeoPath(page.path);
  const publication = publicationForPage({
    path,
    type: page.type,
    qualityGatePassed: page.qualityGatePassed,
  });
  assertPublication(publication);
  const resolved = resolvePublication(publication);
  const parentPath = parentPathFor({ ...page, path });
  return {
    ...page,
    path,
    h1: page.h1 ?? page.primaryTopic,
    canonicalPath: path,
    parentPath: parentPath ? canonicalSeoPath(parentPath) : undefined,
    launchPhase: launchPhaseForPageType(page.type),
    launchBatch: launchBatchForPage(page.type, path),
    publication,
    status: resolved.configuredStatus,
    effectiveStatus: resolved.effectiveStatus,
    isPublic: resolved.isPublic,
    indexable: resolved.isIndexable,
    sitemapEligible: resolved.isSitemapEligible,
    internalLinkEligible: resolved.isInternalLinkEligible,
    expectedSchemas: expectedSchemasFor({ ...page, path }),
    expectsBreadcrumbs: expectedSchemasFor({ ...page, path }).includes(
      "BreadcrumbList",
    ),
  };
}

const discoverDirectoryPages: SeoPageDefinition[] =
  DISCOVER_CLUSTER_META.flatMap((meta) => {
    const totalItems = pagesForDiscoverCluster(meta.cluster).length;
    const totalPages = discoverClusterPageCount(meta.cluster);
    const pages: SeoPageDefinition[] = [];
    for (let pageNum = 1; pageNum <= totalPages; pageNum += 1) {
      const path = discoverClusterPath(meta.cluster, pageNum);
      const isFirst = pageNum === 1;
      pages.push({
        path,
        type: "semantic_landing",
        title: isFirst
          ? `${meta.label} | Fabric Discovery`
          : `${meta.label} | Fabric Discovery (page ${pageNum})`,
        h1: isFirst ? meta.hubTitle : `${meta.hubTitle} — page ${pageNum}`,
        description: isFirst
          ? `${meta.description} Browse ${totalItems} FabStitch discovery topics with links into collections, Best For pages and the marketplace.`
          : `Continued ${meta.label.toLowerCase()} fabric discovery topics (page ${pageNum} of ${totalPages}) on FabStitch.`,
        primaryTopic: meta.label.toLowerCase(),
        secondaryTopics: [
          "fabric discovery",
          meta.label.toLowerCase(),
          "fabric topics",
        ],
        intent: "commercial_investigation",
        audience: "Fabric customers",
        contentOwner: "FabStitch",
        contentSource: "Semantic discovery directory",
        relatedPaths: [
          "/discover/",
          "/marketplace/",
          "/fabrics/",
          "/collections/",
          "/guides/",
        ],
        qualityGatePassed: true,
        wordCount: 160 + Math.min(totalItems, 80),
      });
    }
    return pages;
  });

const semanticPages: SeoPageDefinition[] = [
  {
    path: "/discover/",
    type: "semantic_landing",
    title: "Fabric Discovery Topics",
    h1: "Fabric discovery topics",
    description:
      "Explore FabStitch fabric discovery topics spanning materials, garment uses, attributes, guides and commercial pathways into the marketplace.",
    primaryTopic: "fabric discovery topics",
    secondaryTopics: [
      "fabric topics",
      "fabric materials guide",
      "fabric use cases",
    ],
    intent: "commercial_investigation",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "Semantic discovery registry",
    relatedPaths: [
      "/marketplace/",
      "/fabrics/",
      "/collections/",
      "/guides/",
      "/fabric-sourcing/",
      ...DISCOVER_CLUSTER_META.slice(0, 6).map((meta) =>
        discoverClusterPath(meta.cluster),
      ),
    ],
    qualityGatePassed: true,
    wordCount: 220,
  },
  ...discoverDirectoryPages,
  ...INDEXABLE_SEMANTIC_PAGES.map((page): SeoPageDefinition => ({
    path: page.path,
    type: "semantic_landing",
    title: page.title,
    h1: page.h1,
    description: page.metaDescription,
    primaryTopic: page.primaryKeyword,
    secondaryTopics: page.secondaryKeywords,
    intent: page.intent,
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "Semantic discovery registry",
    relatedPaths: page.relatedPaths,
    qualityGatePassed: page.qualityGatePassed,
    wordCount: page.wordCount,
    image: page.material?.imageHint,
  })),
];

const marketplaceSupportPages: SeoPageDefinition[] =
  MARKETPLACE_SUPPORT_PAGES.map((page): SeoPageDefinition => ({
    path: page.path,
    type: "marketplace_support",
    title: page.title,
    h1: page.h1,
    description: page.description,
    primaryTopic: page.primaryKeyword,
    secondaryTopics: ["fabric marketplace", page.family],
    intent: "commercial_investigation",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "Marketplace content cluster",
    relatedPaths: page.relatedPaths,
    qualityGatePassed: page.indexable,
    wordCount: page.wordCount,
    image: page.imagePath,
  }));

const marketplaceTopicPages: SeoPageDefinition[] = MARKETPLACE_TOPIC_PAGES.map(
  (page): SeoPageDefinition => ({
    path: page.path,
    type: "marketplace_topic",
    title: page.title,
    h1: page.h1,
    description: page.description,
    primaryTopic: page.primaryKeyword,
    secondaryTopics: page.secondaryKeywords,
    intent: "commercial_investigation",
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "Marketplace topic registry",
    relatedPaths: page.relatedPaths,
    qualityGatePassed: true,
    wordCount: page.wordCount,
    image: page.imagePath,
  }),
);

const fabricQuestionPages: SeoPageDefinition[] = FABRIC_QUESTION_PAGES.map(
  (page): SeoPageDefinition => ({
    path: page.path,
    type: "fabric_question",
    title: page.title,
    h1: page.h1,
    description: page.description,
    primaryTopic: page.primaryKeyword,
    secondaryTopics: page.secondaryKeywords,
    intent: page.intent,
    audience: "Fabric customers",
    contentOwner: "FabStitch",
    contentSource: "Fabric question inventory",
    relatedPaths: page.relatedPaths,
    qualityGatePassed: true,
    wordCount: page.wordCount,
    image: page.imagePath,
  }),
);

export const SEO_PAGE_REGISTRY: readonly SeoPageRecord[] = [
  ...staticPages,
  ...fabricPages,
  ...collectionPages,
  ...seasonalPages,
  ...bestForPages,
  ...guidePages,
  ...helpPages,
  ...privatePages,
  ...semanticPages,
  ...marketplaceSupportPages,
  ...marketplaceTopicPages,
  ...fabricQuestionPages,
].map(resolvePage);

export const INDEXABLE_SEO_PAGES = SEO_PAGE_REGISTRY.filter(
  (page) => page.indexable,
);
export const PUBLIC_SEO_PAGES = SEO_PAGE_REGISTRY.filter(
  (page) => page.isPublic,
);
export const SITEMAP_ELIGIBLE_SEO_PAGES = SEO_PAGE_REGISTRY.filter(
  (page) => page.sitemapEligible,
);
export const LINKABLE_SEO_PAGES = SEO_PAGE_REGISTRY.filter(
  (page) => page.internalLinkEligible,
);
export const NOINDEX_SEO_PAGES = SEO_PAGE_REGISTRY.filter(
  (page) => page.isPublic && !page.indexable,
);
export { STOREFRONT_REDIRECT_FAMILIES };

export function seoPage(path: string): SeoPageRecord | undefined {
  const normalized = canonicalSeoPath(path);
  return SEO_PAGE_REGISTRY.find((page) => page.path === normalized);
}

export function isPublicSeoPath(path: string): boolean {
  return seoPage(path)?.isPublic ?? false;
}

export function isIndexableSeoPath(path: string): boolean {
  return seoPage(path)?.indexable ?? false;
}

export function isInternalLinkEligibleSeoPath(path: string): boolean {
  return seoPage(path)?.internalLinkEligible ?? false;
}

function duplicates(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const duplicated = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicated.add(value);
    seen.add(value);
  }
  return [...duplicated];
}

export function assertStorefrontSeoRegistry(): void {
  const paths = duplicates(SEO_PAGE_REGISTRY.map((page) => page.path));
  const canonicals = duplicates(
    SEO_PAGE_REGISTRY.map((page) => page.canonicalPath),
  );
  const titles = duplicates(
    INDEXABLE_SEO_PAGES.map((page) => page.title.toLowerCase()),
  );
  const descriptions = duplicates(
    INDEXABLE_SEO_PAGES.map((page) => page.description.toLowerCase()),
  );
  if (paths.length) throw new Error(`Duplicate SEO paths: ${paths.join(", ")}`);
  if (canonicals.length)
    throw new Error(`Duplicate SEO canonicals: ${canonicals.join(", ")}`);
  if (titles.length)
    throw new Error(`Duplicate indexable titles: ${titles.join(", ")}`);
  if (descriptions.length)
    throw new Error(
      `Duplicate indexable descriptions: ${descriptions.join(", ")}`,
    );
  const registered = new Set(SEO_PAGE_REGISTRY.map((page) => page.path));
  for (const path of Object.keys(SEO_PUBLICATION_OVERRIDES)) {
    if (!registered.has(canonicalSeoPath(path))) {
      throw new Error(`Publication override is not registered: ${path}`);
    }
  }
  for (const page of SEO_PAGE_REGISTRY) {
    assertPublication(page.publication);
    if (!page.path.endsWith("/") && page.path !== "/")
      throw new Error(`Non-canonical trailing slash: ${page.path}`);
    if (page.path !== page.canonicalPath)
      throw new Error(`Path and canonical disagree: ${page.path}`);
    if (!page.title.trim() || !page.description.trim() || !page.h1.trim())
      throw new Error(`Missing metadata: ${page.path}`);
    if (!page.contentSource.trim())
      throw new Error(`Missing content source: ${page.path}`);
    if (page.indexable && !page.isPublic)
      throw new Error(`Unavailable page is indexable: ${page.path}`);
    if (page.sitemapEligible !== page.indexable)
      throw new Error(`Sitemap/indexability mismatch: ${page.path}`);
    if (!page.isPublic && page.internalLinkEligible)
      throw new Error(`Unavailable page is linkable: ${page.path}`);
    if (
      page.indexable &&
      page.path !== "/" &&
      (!page.parentPath || !registered.has(page.parentPath))
    ) {
      throw new Error(`Indexable page has no registered parent: ${page.path}`);
    }
    if (page.indexable && !page.expectedSchemas.length)
      throw new Error(`Indexable page has no schema expectation: ${page.path}`);
  }
}

assertStorefrontSeoRegistry();
