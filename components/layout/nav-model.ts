export type NavLink = {
  label: string;
  href: string;
};

export type FooterLinkGroup = {
  label: string;
  links: NavLink[];
};

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
    ],
  },
  {
    label: "Company",
    links: [NAV_SECTIONS[3], NAV_SECTIONS[4], NAV_SECTIONS[5]],
  },
  {
    label: "Resources",
    links: [
      { label: "Guides", href: "/guides/" },
      { label: "Help", href: "/help/" },
      { label: "Support", href: "/support/" },
    ],
  },
  {
    label: "Account",
    links: [
      { label: "My Inquiries", href: "/inquiries/" },
      { label: "Account", href: "/account/" },
      { label: "Sign In", href: "/login/" },
      { label: "Join FabStitch", href: "/signup/" },
    ],
  },
];

export const FOOTER_LINKS: NavLink[] = FOOTER_LINK_GROUPS.flatMap(
  ({ links }) => links,
);
