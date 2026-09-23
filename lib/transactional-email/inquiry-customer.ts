import type { RenderedTransactionalEmail } from "./brand";
import { EMAIL_BRAND } from "./brand";
import { escapeHtml, escapeHtmlMultiline, present } from "./escape";
import {
  emailCard,
  emailCta,
  emailEyebrow,
  emailFieldRow,
  emailHeading,
  emailHighlight,
  emailParagraph,
  emailShell,
  textBlock,
} from "./layout";

export type InquiryCustomerEmailInput = {
  inquiryNumber: string;
  inquiryId: string;
  createdDate: string;
  createdTime: string;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  fabricName: string;
  quantity: string;
  quantityUnit?: string | null;
  note?: string | null;
  inquiryUrl?: string | null;
};

function rowsFromFields(
  fields: Array<[string, string | null | undefined]>,
): string {
  return fields
    .map(([label, value]) => {
      const shown = present(value);
      if (!shown) return "";
      return emailFieldRow(label, escapeHtml(shown));
    })
    .join("");
}

export function renderInquiryCustomerEmail(
  input: InquiryCustomerEmailInput,
): RenderedTransactionalEmail {
  const unit = present(input.quantityUnit) ?? "meters";
  const subject = "Your FabStitch inquiry has been received";
  const inquiryUrl =
    present(input.inquiryUrl) ??
    `${EMAIL_BRAND.siteUrl}/inquiries/${encodeURIComponent(input.inquiryId)}/`;

  const summaryRows = rowsFromFields([
    ["Inquiry reference", input.inquiryNumber],
    ["Inquiry ID", input.inquiryId],
    ["Date", input.createdDate],
    ["Time", input.createdTime],
    ["Full name", input.customerName],
    ["Email", input.customerEmail],
    ["Phone", input.customerPhone],
    ["Fabric", input.fabricName],
    ["Quantity", `${input.quantity} ${unit}`],
  ]);

  const note = present(input.note);
  const noteBlock = note
    ? emailCard(
        "Customer note",
        emailFieldRow("Note", escapeHtmlMultiline(note)),
      )
    : "";

  const bodyHtml = `
    ${emailEyebrow("Fabric inquiry")}
    ${emailHeading("Inquiry received")}
    ${emailParagraph("Your fabric inquiry has been submitted successfully.")}
    ${emailCard("Inquiry summary", summaryRows)}
    ${noteBlock}
    ${emailHighlight(
      "Our team will contact you within 24 hours",
      "Your inquiry has been received successfully. Our team will review your request and contact you within 24 hours.",
    )}
    ${emailCta("View your inquiry", inquiryUrl)}
  `;

  const text = textBlock([
    "FabStitch",
    "",
    "Inquiry received",
    "",
    "Your fabric inquiry has been submitted successfully.",
    "",
    `Inquiry reference: ${input.inquiryNumber}`,
    `Inquiry ID: ${input.inquiryId}`,
    `Date: ${input.createdDate}`,
    `Time: ${input.createdTime}`,
    present(input.customerName)
      ? `Full name: ${present(input.customerName)}`
      : null,
    present(input.customerEmail)
      ? `Email: ${present(input.customerEmail)}`
      : null,
    present(input.customerPhone)
      ? `Phone: ${present(input.customerPhone)}`
      : null,
    `Fabric: ${input.fabricName}`,
    `Quantity: ${input.quantity} ${unit}`,
    note ? `Note: ${note}` : null,
    "",
    "Your inquiry has been received successfully. Our team will review your request and contact you within 24 hours.",
    "",
    `View your inquiry: ${inquiryUrl}`,
    "",
    EMAIL_BRAND.productLine,
    EMAIL_BRAND.siteUrl,
  ]);

  return {
    subject,
    html: emailShell({
      title: subject,
      preheader: `Inquiry ${input.inquiryNumber} received. Our team will contact you within 24 hours.`,
      bodyHtml,
    }),
    text,
  };
}
