export type HelpCategory =
  | "Account"
  | "Fabric Discovery"
  | "Search & Filters"
  | "Inquiries"
  | "Orders"
  | "Country & Currency"
  | "Website & Navigation";

export type HelpArticle = {
  slug: string;
  title: string;
  summary: string;
  category: HelpCategory;
  indexable: boolean;
  keywords?: readonly string[];
  sections: { heading: string; body: string[] }[];
  related: { label: string; href: string }[];
};

const SEARCH_STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "can",
  "do",
  "does",
  "for",
  "how",
  "i",
  "in",
  "is",
  "it",
  "my",
  "of",
  "on",
  "or",
  "the",
  "to",
  "we",
  "what",
  "when",
  "where",
  "with",
]);

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: "what-is-fabstitch",
    title: "What is FabStitch?",
    summary:
      "FabStitch is a fabric discovery and sourcing storefront for professional customers.",
    category: "Website & Navigation",
    indexable: true,
    sections: [
      {
        heading: "One customer experience",
        body: [
          "FabStitch helps you find fabric by material, construction, weight and what you are making. You browse collections, search the catalog, open a fabric and send a quantity inquiry.",
          "There is one customer account. There is no buyer dashboard and no supplier marketplace in the public site.",
        ],
      },
      {
        heading: "What you can do",
        body: [
          "Explore fabrics, collections and Best For pages. Create an account to save preferences and submit inquiries. After an inquiry, FabStitch contacts you at your registered email.",
        ],
      },
    ],
    related: [
      { label: "How FabStitch works", href: "/help/how-fabstitch-works/" },
      { label: "Browse fabrics", href: "/marketplace/" },
      { label: "About FabStitch", href: "/about/" },
    ],
  },
  {
    slug: "how-fabstitch-works",
    title: "How does FabStitch work?",
    summary:
      "Discover a fabric, choose a quantity and send an inquiry. Commercial terms follow by email.",
    category: "Website & Navigation",
    indexable: true,
    sections: [
      {
        heading: "The sourcing path",
        body: [
          "Start from Collections if you know the material, from Best For if you know the product, or from Search if you have a name or construction.",
          "Open a fabric page to read composition, construction, weight and documented uses. Enter the quantity you need and submit an inquiry. FabStitch follows up at your registered email.",
        ],
      },
      {
        heading: "What happens next",
        body: [
          "The inquiry is saved to your account. You can reopen it from My Inquiries. Payment is not taken at inquiry.",
        ],
      },
    ],
    related: [
      {
        label: "How to submit an inquiry",
        href: "/help/how-to-submit-an-inquiry/",
      },
      { label: "How to find fabrics", href: "/help/how-to-find-fabrics/" },
    ],
  },
  {
    slug: "how-to-find-fabrics",
    title: "How do I find a fabric?",
    summary:
      "Use collections, Best For, marketplace search or filters to reach a named FabStitch fabric.",
    category: "Fabric Discovery",
    indexable: true,
    keywords: ["find a fabric", "find fabric", "browse fabrics"],
    sections: [
      {
        heading: "Four ways in",
        body: [
          "Collections group fabrics by material character, such as Cotton or Silk & Sheer. Best For groups fabrics by product, such as shirts or dresses. Marketplace search matches names and constructions. Filters narrow the same catalog.",
          "Every path opens the same fabric page, so a cloth has one identity.",
        ],
      },
    ],
    related: [
      { label: "Collections", href: "/collections/" },
      { label: "Best For", href: "/fabrics/best-for/" },
      { label: "Marketplace", href: "/marketplace/" },
    ],
  },
  {
    slug: "understanding-fabric-pages",
    title: "How do I read a fabric page?",
    summary:
      "A fabric page shows the named cloth, documented properties and the inquiry action.",
    category: "Fabric Discovery",
    indexable: true,
    sections: [
      {
        heading: "What the page contains",
        body: [
          "Each fabric has a stable name and slug. Composition, construction, measurements and Best For uses appear when the catalog includes them. Missing values stay missing.",
          "Send inquiry is the commercial next step. It collects quantity, not payment details.",
        ],
      },
    ],
    related: [
      { label: "Explore fabrics", href: "/marketplace/" },
      {
        label: "How to submit an inquiry",
        href: "/help/how-to-submit-an-inquiry/",
      },
    ],
  },
  {
    slug: "how-search-works",
    title: "How do I search for a fabric?",
    summary:
      "Type a fibre, construction, fabric name or product into search to open matching catalog results.",
    category: "Search & Filters",
    indexable: true,
    sections: [
      {
        heading: "What search looks at",
        body: [
          "Search is useful for names such as chiffon, linen or melton, and for uses such as shirts. Results stay inside the published catalog.",
          "Search views are working states. They are not separate public pages for every query.",
        ],
      },
    ],
    related: [
      { label: "Open marketplace search", href: "/marketplace/" },
      { label: "How filters work", href: "/help/how-filters-work/" },
    ],
  },
  {
    slug: "how-filters-work",
    title: "How do fabric filters work?",
    summary:
      "Filters narrow the catalog by documented fields such as fibre, construction, weight and Best For.",
    category: "Search & Filters",
    indexable: true,
    sections: [
      {
        heading: "What you can filter",
        body: [
          "Filters come from catalog fields. Within one dimension, such as fibre, values combine as alternatives. Across dimensions, filters combine. If a field is not on the fabric record, the fabric will not match that filter.",
          "Price sorts are not offered because the catalog does not publish prices.",
        ],
      },
    ],
    related: [
      { label: "Marketplace filters", href: "/marketplace/" },
      { label: "Country and currency", href: "/help/country-and-currency/" },
    ],
  },
  {
    slug: "how-to-submit-an-inquiry",
    title: "How do I submit a fabric inquiry?",
    summary:
      "Open a fabric, enter the quantity you need and submit the inquiry from your FabStitch account.",
    category: "Inquiries",
    indexable: true,
    keywords: [
      "send inquiry",
      "send an inquiry",
      "submit inquiry",
      "fabric inquiry",
      "request fabric",
    ],
    sections: [
      {
        heading: "Send an inquiry",
        body: [
          "Sign in, open the fabric, enter the quantity in metres and submit. You can add an optional note about the product you are making.",
          "After a successful submission you can open that inquiry from My Inquiries. FabStitch does not take payment at this step.",
        ],
      },
    ],
    related: [
      {
        label: "What information is included",
        href: "/help/what-information-is-in-an-inquiry/",
      },
      { label: "My Inquiries", href: "/inquiries/" },
      {
        label: "What happens next",
        href: "/help/what-happens-after-an-inquiry/",
      },
    ],
  },
  {
    slug: "what-information-is-in-an-inquiry",
    title: "What information is included in my inquiry?",
    summary:
      "An inquiry records the fabric, the quantity in metres, your registered email and any note you add.",
    category: "Inquiries",
    indexable: true,
    keywords: ["inquiry details", "what is included", "inquiry information"],
    sections: [
      {
        heading: "What FabStitch receives",
        body: [
          "Each inquiry includes the named fabric, the quantity you entered in metres, and the email on your customer account. An optional note can describe the product you are making or other relevant context.",
          "Payment details are not collected. Availability, pricing and lead time are confirmed afterwards by FabStitch.",
        ],
      },
    ],
    related: [
      {
        label: "How to submit an inquiry",
        href: "/help/how-to-submit-an-inquiry/",
      },
      { label: "My Inquiries", href: "/inquiries/" },
    ],
  },
  {
    slug: "what-happens-after-an-inquiry",
    title: "What happens after I submit an inquiry?",
    summary:
      "The inquiry is saved to your account and FabStitch contacts you at your registered email.",
    category: "Inquiries",
    indexable: true,
    keywords: ["after inquiry", "contact me", "follow up", "what happens next"],
    sections: [
      {
        heading: "Follow-up",
        body: [
          "FabStitch reviews the fabric and quantity and contacts you at the email on your account. Response time is not promised on the website.",
          "You can reopen the inquiry later from My Inquiries. Status values such as NEW or CONTACTED come from the inquiry record.",
        ],
      },
    ],
    related: [
      { label: "My Inquiries", href: "/inquiries/" },
      {
        label: "How to submit an inquiry",
        href: "/help/how-to-submit-an-inquiry/",
      },
    ],
  },
  {
    slug: "viewing-my-inquiries",
    title: "Where can I see my previous inquiries?",
    summary: "Signed-in customers can open My Inquiries from the account menu.",
    category: "Inquiries",
    indexable: true,
    keywords: ["previous inquiries", "my inquiries", "inquiry history"],
    sections: [
      {
        heading: "Your inquiry list",
        body: [
          "Go to Account and choose My Inquiries, or open /inquiries. You only see inquiries submitted from your account.",
          "Each inquiry shows the inquiry number, fabric, quantity, status and submitted date.",
        ],
      },
    ],
    related: [
      { label: "My Inquiries", href: "/inquiries/" },
      { label: "Account", href: "/account/" },
    ],
  },
  {
    slug: "how-to-buy-fabric",
    title: "How do I buy fabric on FabStitch?",
    summary:
      "The live commercial path is fabric, quantity and inquiry. Payment is not collected on the website.",
    category: "Inquiries",
    indexable: true,
    sections: [
      {
        heading: "Inquiry first",
        body: [
          "Choose a fabric and send the quantity you need. FabStitch confirms availability and commercial terms afterwards by email.",
          "There is no Pay Now or card form on the inquiry path. If an order later appears on your account, it is a record of that commercial process, not a checkout you complete in the browser.",
        ],
      },
    ],
    related: [
      {
        label: "How to submit an inquiry",
        href: "/help/how-to-submit-an-inquiry/",
      },
      { label: "Orders", href: "/help/orders/" },
    ],
  },
  {
    slug: "orders",
    title: "How do orders work?",
    summary:
      "Orders appear on your account when FabStitch has recorded one. You can open and, when allowed, cancel them.",
    category: "Orders",
    indexable: true,
    sections: [
      {
        heading: "Viewing orders",
        body: [
          "If an order exists for your account, it is listed under Account orders. An order can be cancelled only while its status still allows customer cancellation.",
          "Orders are not created by the inquiry form itself. An inquiry is the request; an order is a later recorded commercial document.",
        ],
      },
    ],
    related: [
      { label: "Account orders", href: "/account/orders/" },
      { label: "My Inquiries", href: "/inquiries/" },
    ],
  },
  {
    slug: "sign-up",
    title: "How do I create an account?",
    summary:
      "Join FabStitch with your work email, a password, your name and country.",
    category: "Account",
    indexable: true,
    sections: [
      {
        heading: "Create one customer account",
        body: [
          "Open Join FabStitch and complete the form. Google sign-in is available when that provider is configured.",
          "After sign-up you may be asked for discovery preferences. Those preferences do not hide the catalog.",
        ],
      },
    ],
    related: [
      { label: "Join FabStitch", href: "/signup/" },
      { label: "Sign in", href: "/help/sign-in/" },
    ],
  },
  {
    slug: "sign-in",
    title: "How do I sign in?",
    summary:
      "Use your FabStitch email and password, or Google if it is linked to your account.",
    category: "Account",
    indexable: true,
    sections: [
      {
        heading: "Return to your account",
        body: [
          "Open Sign in and enter the email and password for your customer account. If you were sent to sign in from an inquiry or another private page, you return there after a successful session.",
        ],
      },
    ],
    related: [
      { label: "Sign in", href: "/login/" },
      { label: "Create an account", href: "/help/sign-up/" },
    ],
  },
  {
    slug: "account",
    title: "How do I update my account information?",
    summary:
      "Change your name and phone on the account profile page while signed in.",
    category: "Account",
    indexable: true,
    keywords: ["update account", "change name", "phone number", "profile"],
    sections: [
      {
        heading: "Profile details",
        body: [
          "Open Account to update your name and phone. The work email on the account is shown but is not edited on that form.",
          "Country and currency are managed under Preferences.",
        ],
      },
    ],
    related: [
      { label: "Account", href: "/account/" },
      { label: "Preferences", href: "/account/preferences/" },
    ],
  },
  {
    slug: "country-and-currency",
    title: "How do I change country or currency?",
    summary:
      "Set country and currency in Preferences or from the header. They are display preferences, not exchange rates.",
    category: "Country & Currency",
    indexable: true,
    keywords: [
      "change currency",
      "change country",
      "update currency",
      "market preference",
    ],
    sections: [
      {
        heading: "What the preference does",
        body: [
          "Country and currency tell FabStitch your market context. They do not convert prices, because the catalog does not publish a price to convert.",
          "You can change them from the header controls or from Account preferences.",
        ],
      },
    ],
    related: [
      { label: "Preferences", href: "/account/preferences/" },
      { label: "How filters work", href: "/help/how-filters-work/" },
    ],
  },
];

export const HELP_CATEGORIES: HelpCategory[] = [
  "Account",
  "Fabric Discovery",
  "Search & Filters",
  "Inquiries",
  "Orders",
  "Country & Currency",
  "Website & Navigation",
];

export function getHelpArticle(slug: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((item) => item.slug === slug);
}

export function searchHelp(query: string): HelpArticle[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return HELP_ARTICLES;
  const terms = needle
    .split(/[^a-z0-9]+/)
    .filter((term) => term && !SEARCH_STOP_WORDS.has(term));
  if (!terms.length) return HELP_ARTICLES;
  return HELP_ARTICLES.filter((item) => {
    const haystack = [
      item.title,
      item.summary,
      item.category,
      ...(item.keywords ?? []),
      ...item.sections.flatMap((section) => [section.heading, ...section.body]),
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  }).sort(
    (left, right) => scoreHelpMatch(right, terms) - scoreHelpMatch(left, terms),
  );
}

function scoreHelpMatch(item: HelpArticle, terms: string[]): number {
  const title = item.title.toLowerCase();
  const keywords = (item.keywords ?? []).join(" ").toLowerCase();
  if (terms.every((term) => title.includes(term))) return 3;
  if (terms.every((term) => keywords.includes(term))) return 2;
  return 1;
}
