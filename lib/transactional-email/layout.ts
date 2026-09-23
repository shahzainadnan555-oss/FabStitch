import { EMAIL_BRAND } from "./brand";
import { escapeAttr, escapeHtml } from "./escape";

const C = EMAIL_BRAND.colors;

export function emailShell(options: {
  title: string;
  preheader?: string;
  bodyHtml: string;
}): string {
  const preheader = options.preheader
    ? `<div style="display:none;font-size:1px;color:${C.chrome};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${escapeHtml(options.preheader)}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>${escapeHtml(options.title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.chrome};font-family:${EMAIL_BRAND.fonts};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
${preheader}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${C.chrome};padding:28px 12px;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:${C.paper};border:1px solid ${C.rule2};border-radius:8px;">
        <tr>
          <td style="padding:24px 24px 8px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="vertical-align:middle;padding-right:10px;">
                  <img src="${escapeAttr(EMAIL_BRAND.logoUrl)}" width="28" height="28" alt="${escapeAttr(EMAIL_BRAND.logoAlt)}" style="display:block;border:0;outline:none;text-decoration:none;" />
                </td>
                <td style="vertical-align:middle;">
                  <p style="margin:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.gold};font-weight:600;">FabStitch</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 24px 28px;">
            ${options.bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="padding:0 24px 28px;border-top:1px solid ${C.rule};">
            <p style="margin:20px 0 0;font-size:12px;line-height:1.5;color:${C.ink4};">
              FabStitch<br />
              ${escapeHtml(EMAIL_BRAND.productLine)}<br />
              <a href="${escapeAttr(EMAIL_BRAND.siteUrl)}" style="color:${C.ink4};text-decoration:underline;">fabstitch.net</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export function emailHeading(text: string): string {
  return `<h1 style="margin:12px 0 0;font-size:24px;line-height:1.25;color:${C.ink};font-weight:700;">${escapeHtml(text)}</h1>`;
}

export function emailParagraph(text: string): string {
  return `<p style="margin:14px 0 0;font-size:15px;line-height:1.55;color:${C.ink2};">${escapeHtml(text)}</p>`;
}

export function emailEyebrow(text: string): string {
  return `<p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${C.gold};font-weight:600;">${escapeHtml(text)}</p>`;
}

export function emailCta(label: string, href: string): string {
  return `<p style="margin:28px 0 0;">
  <a href="${escapeAttr(href)}" style="background:${C.navy};color:${C.onInk};padding:14px 22px;text-decoration:none;border-radius:4px;display:inline-block;font-size:14px;font-weight:600;letter-spacing:0.03em;">${escapeHtml(label)}</a>
</p>`;
}

export function emailCard(title: string, rowsHtml: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:18px 0 0;background:${C.paperSunk};border:1px solid ${C.rule};border-radius:6px;">
  <tr>
    <td style="padding:16px;">
      <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${C.gold};font-weight:600;">${escapeHtml(title)}</p>
      ${rowsHtml}
    </td>
  </tr>
</table>`;
}

export function emailFieldRow(label: string, valueHtml: string): string {
  return `<p style="margin:0 0 10px;font-size:14px;line-height:1.45;color:${C.ink};">
  <span style="display:block;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${C.ink4};margin-bottom:3px;">${escapeHtml(label)}</span>
  ${valueHtml}
</p>`;
}

export function emailHighlight(title: string, body: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:20px 0 0;background:${C.navy};border-radius:6px;">
  <tr>
    <td style="padding:16px;">
      <p style="margin:0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${C.goldOnNavy};font-weight:600;">${escapeHtml(title)}</p>
      <p style="margin:8px 0 0;font-size:14px;line-height:1.5;color:${C.onInk};">${escapeHtml(body)}</p>
    </td>
  </tr>
</table>`;
}

export function textBlock(lines: Array<string | null | undefined>): string {
  return lines
    .filter((line): line is string => Boolean(line && line.trim()))
    .join("\n");
}
