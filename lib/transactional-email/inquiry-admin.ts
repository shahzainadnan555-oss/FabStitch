import type { RenderedTransactionalEmail } from "./brand";
import { EMAIL_BRAND } from "./brand";
import { escapeHtml, escapeHtmlMultiline, present } from "./escape";
import {
  emailCard,
  emailEyebrow,
  emailFieldRow,
  emailHeading,
  emailParagraph,
  emailShell,
  textBlock,
} from "./layout";

export type InquiryAdminEmailInput = {
  inquiryNumber: string;
  inquiryId: string;
  createdDate: string;
  createdTime: string;
  customerName?: string | null;
  customerEmail: string;
  customerPhone?: string | null;
  fabricName: string;
  quantity: string;
  quantityUnit?: string | null;
  note?: string | null;
  composition?: string | null;
  construction?: string | null;
  gsm?: string | null;
  width?: string | null;
  finish?: string | null;
  certification?: string | null;
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

export function renderInquiryAdminEmail(
  input: InquiryAdminEmailInput,
): RenderedTransactionalEmail {
  const unit = present(input.quantityUnit) ?? "meters";
  const subject = `New Fabric Inquiry — ${input.fabricName} — ${input.inquiryNumber}`;

  const headerRows = rowsFromFields([
    ["Inquiry reference", input.inquiryNumber],
    ["Inquiry ID", input.inquiryId],
    ["Created", `${input.createdDate} · ${input.createdTime}`],
  ]);

  const customerRows = rowsFromFields([
    ["Full name", input.customerName],
    ["Email", input.customerEmail],
    ["Phone", input.customerPhone],
  ]);

  const fabricRows = rowsFromFields([
    ["Fabric", input.fabricName],
    ["Quantity", input.quantity],
    ["Unit", unit],
    ["Composition", input.composition],
    ["Construction", input.construction],
    ["GSM", input.gsm],
    ["Width", input.width],
    ["Finish", input.finish],
    ["Certification", input.certification],
  ]);

  const note = present(input.note);
  const noteBlock = note
    ? emailCard(
        "Customer note",
        `<p style="margin:0;font-size:14px;line-height:1.55;color:${EMAIL_BRAND.colors.ink};">${escapeHtmlMultiline(note)}</p>`,
      )
    : "";

  const summary = [
    present(input.customerName) ?? "A customer",
    `(${input.customerEmail}${present(input.customerPhone) ? `, ${present(input.customerPhone)}` : ""})`,
    `requested ${input.quantity} ${unit} of ${input.fabricName}.`,
    `Inquiry ${input.inquiryNumber} created ${input.createdDate} ${input.createdTime}.`,
  ].join(" ");

  const bodyHtml = `
    ${emailEyebrow("Internal notification")}
    ${emailHeading("New fabric inquiry")}
    <p style="margin:14px 0 0;font-family:${EMAIL_BRAND.mono};font-size:20px;letter-spacing:0.04em;color:${EMAIL_BRAND.colors.ink};font-weight:700;">${escapeHtml(input.inquiryNumber)}</p>
    ${emailCard("Inquiry information", headerRows)}
    ${emailCard("Customer details", customerRows)}
    ${emailCard("Fabric requirement", fabricRows)}
    ${noteBlock}
    ${emailParagraph("Customer request summary")}
    ${emailParagraph(summary)}
  `;

  const text = textBlock([
    "FabStitch",
    "",
    "NEW FABRIC INQUIRY",
    "",
    `Inquiry reference: ${input.inquiryNumber}`,
    `Inquiry ID: ${input.inquiryId}`,
    `Created: ${input.createdDate} · ${input.createdTime}`,
    "",
    "CUSTOMER DETAILS",
    present(input.customerName)
      ? `Full name: ${present(input.customerName)}`
      : null,
    `Email: ${input.customerEmail}`,
    present(input.customerPhone)
      ? `Phone: ${present(input.customerPhone)}`
      : null,
    "",
    "FABRIC REQUIREMENT",
    `Fabric: ${input.fabricName}`,
    `Quantity: ${input.quantity}`,
    `Unit: ${unit}`,
    present(input.composition)
      ? `Composition: ${present(input.composition)}`
      : null,
    present(input.construction)
      ? `Construction: ${present(input.construction)}`
      : null,
    present(input.gsm) ? `GSM: ${present(input.gsm)}` : null,
    present(input.width) ? `Width: ${present(input.width)}` : null,
    present(input.finish) ? `Finish: ${present(input.finish)}` : null,
    present(input.certification)
      ? `Certification: ${present(input.certification)}`
      : null,
    "",
    note ? "CUSTOMER NOTE" : null,
    note,
    "",
    "CUSTOMER REQUEST SUMMARY",
    summary,
    "",
    EMAIL_BRAND.productLine,
  ]);

  return {
    subject,
    html: emailShell({
      title: subject,
      preheader: `New inquiry ${input.inquiryNumber} for ${input.fabricName}`,
      bodyHtml,
    }),
    text,
  };
}
