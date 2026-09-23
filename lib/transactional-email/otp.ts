import type { RenderedTransactionalEmail } from "./brand";
import { EMAIL_BRAND } from "./brand";
import { escapeHtml } from "./escape";
import {
  emailEyebrow,
  emailHeading,
  emailParagraph,
  emailShell,
  textBlock,
} from "./layout";

export function renderOtpEmail(input: {
  code: string;
  purpose: "signup" | "login" | string;
  expiresMinutes: number;
}): RenderedTransactionalEmail {
  const digits = input.code.replace(/\D/g, "").slice(0, 6).split("");
  while (digits.length < 6) digits.push("·");

  const digitCells = digits
    .map(
      (digit, index) =>
        `${index > 0 ? '<td width="8"></td>' : ""}<td style="width:42px;height:52px;border:2px solid ${EMAIL_BRAND.colors.navy};border-radius:4px;text-align:center;vertical-align:middle;font-family:${EMAIL_BRAND.mono};font-size:22px;font-weight:700;color:${EMAIL_BRAND.colors.ink};">${escapeHtml(digit)}</td>`,
    )
    .join("");

  const intro =
    input.purpose === "signup"
      ? "Thanks for creating your FabStitch account. Use the verification code below to continue."
      : "Use the verification code below to finish signing in to FabStitch.";

  const bodyHtml = `
    ${emailEyebrow("Email verification")}
    ${emailHeading("Verify your email")}
    ${emailParagraph(intro)}
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:24px auto 0;">
      <tr>${digitCells}</tr>
    </table>
    <p style="margin:16px 0 0;text-align:center;font-family:${EMAIL_BRAND.mono};font-size:20px;letter-spacing:0.35em;color:${EMAIL_BRAND.colors.ink};font-weight:700;">${escapeHtml(digits.join(""))}</p>
    ${emailParagraph(`This code expires in ${Math.max(1, input.expiresMinutes)} minutes.`)}
    ${emailParagraph("If you did not request this verification email, you can safely ignore it.")}
  `;

  const subject =
    input.purpose === "signup"
      ? "Verify your FabStitch email"
      : "Your FabStitch verification code";

  const text = textBlock([
    "FabStitch",
    "",
    "Verify your email",
    "",
    intro,
    "",
    `Code: ${digits.join("")}`,
    "",
    `This code expires in ${Math.max(1, input.expiresMinutes)} minutes.`,
    "If you did not request this verification email, you can safely ignore it.",
    "",
    EMAIL_BRAND.productLine,
    EMAIL_BRAND.siteUrl,
  ]);

  return {
    subject,
    html: emailShell({
      title: subject,
      preheader: `Your FabStitch verification code is ${digits.join("")}`,
      bodyHtml,
    }),
    text,
  };
}
