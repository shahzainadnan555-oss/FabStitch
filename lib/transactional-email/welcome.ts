import type { RenderedTransactionalEmail } from "./brand";
import { EMAIL_BRAND } from "./brand";
import {
  emailCta,
  emailEyebrow,
  emailHeading,
  emailParagraph,
  emailShell,
  textBlock,
} from "./layout";

export function renderWelcomeEmail(input: {
  fullName?: string | null;
}): RenderedTransactionalEmail {
  const name = (input.fullName ?? "").trim() || "there";
  const subject = "Welcome to FabStitch";

  const bodyHtml = `
    ${emailEyebrow("Welcome")}
    ${emailHeading("Welcome to FabStitch")}
    ${emailParagraph(`Hi ${name}, your account is ready.`)}
    ${emailParagraph(
      "Discover fabrics, evaluate materials, explore the marketplace, and submit inquiries when you are ready to source cloth for your next project.",
    )}
    ${emailCta("Explore fabrics", EMAIL_BRAND.marketplaceUrl)}
    ${emailParagraph("Ready to find the right fabric?")}
    ${emailParagraph(
      "Start in the marketplace, open a named fabric page, and send an inquiry with the quantity you need. Commercial follow-up happens by email after your request is reviewed.",
    )}
  `;

  const text = textBlock([
    "FabStitch",
    "",
    "Welcome to FabStitch",
    "",
    `Hi ${name}, your account is ready.`,
    "",
    "Discover fabrics, evaluate materials, explore the marketplace, and submit inquiries when you are ready to source cloth for your next project.",
    "",
    `Explore fabrics: ${EMAIL_BRAND.marketplaceUrl}`,
    "",
    "Ready to find the right fabric?",
    "Start in the marketplace, open a named fabric page, and send an inquiry with the quantity you need.",
    "",
    EMAIL_BRAND.productLine,
    EMAIL_BRAND.siteUrl,
  ]);

  return {
    subject,
    html: emailShell({
      title: subject,
      preheader: "Your FabStitch account is ready. Explore fabrics to begin.",
      bodyHtml,
    }),
    text,
  };
}
