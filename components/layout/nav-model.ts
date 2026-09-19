export type NavLink = {
  label: string;
  href: string;
};

export type FooterLinkGroup = {
  label: string;
  links: NavLink[];
};

/** Primary header destinations — keep compact to avoid overlap with utilities. */
export const NAV_SECTIONS: NavLink[] = [
  { label: "Fabrics", href: "/fabrics/" },
  { label: "Marketplace", href: "/marketplace/" },
  { label: "Collections", href: "/collections/" },
  { label: "How It Works", href: "/how-it-works/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    label: "Discover",
    links: [
      NAV_SECTIONS[0],
      NAV_SECTIONS[1],
      NAV_SECTIONS[2],
      { label: "Best For", href: "/fabrics/best-for/" },
      { label: "Guides", href: "/guides/" },
    ],
  },
  {
    label: "Company",
    links: [NAV_SECTIONS[3], NAV_SECTIONS[4], NAV_SECTIONS[5]],
  },
  {
    label: "Resources",
    links: [
      { label: "Fabric questions", href: "/guides/fabric-questions/" },
      { label: "Fabric sourcing", href: "/fabric-sourcing/" },
      { label: "Wholesale fabric", href: "/wholesale-fabric/" },
      { label: "Discover", href: "/discover/" },
      { label: "Help", href: "/help/" },
      { label: "Support", href: "/support/" },
      { label: "How FabStitch works", href: "/help/how-fabstitch-works/" },
    ],
  },
  {
    label: "Account",
    links: [
      { label: "Account", href: "/account/" },
      { label: "My Inquiries", href: "/inquiries/" },
    ],
  },
];

export const FOOTER_LINKS: NavLink[] = FOOTER_LINK_GROUPS.flatMap(
  ({ links }) => links,
);
