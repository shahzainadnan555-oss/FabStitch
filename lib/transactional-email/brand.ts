/** Shared FabStitch brand tokens for transactional email HTML. */

export const EMAIL_BRAND = {
  siteUrl: "https://fabstitch.net",
  marketplaceUrl: "https://fabstitch.net/marketplace/",
  fabricsUrl: "https://fabstitch.net/fabrics/",
  logoUrl: "https://fabstitch.net/media/fabstitch-mark.png",
  logoAlt: "FabStitch",
  productLine: "B2B Fabric Discovery & Sourcing",
  colors: {
    chrome: "#ece7db",
    paper: "#ffffff",
    paperSunk: "#f8f6f1",
    ink: "#14161a",
    ink2: "#3b4048",
    ink3: "#65686f",
    ink4: "#7e8189",
    navy: "#141f38",
    indigo: "#25388c",
    gold: "#855c23",
    goldOnNavy: "#c79a55",
    rule: "#ded8cd",
    rule2: "#c6bfb1",
    onInk: "#f4f2ed",
  },
  fonts:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
  mono: "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace",
} as const;

export type RenderedTransactionalEmail = {
  subject: string;
  html: string;
  text: string;
};
