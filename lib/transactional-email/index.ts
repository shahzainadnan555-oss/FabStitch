/**
 * FabStitch transactional email design system (frontend).
 *
 * These renderers produce email-safe HTML + plain text.
 * Live delivery remains owned by the backend EmailDeliveryPort /
 * inquiry outbox. Use this package as the visual source of truth and
 * port the rendered output into backend templates without inventing a
 * second delivery path.
 */

export { EMAIL_BRAND, type RenderedTransactionalEmail } from "./brand";
export { escapeHtml, escapeHtmlMultiline, present } from "./escape";
export { renderOtpEmail } from "./otp";
export { renderWelcomeEmail } from "./welcome";
export {
  renderInquiryCustomerEmail,
  type InquiryCustomerEmailInput,
} from "./inquiry-customer";
export {
  renderInquiryAdminEmail,
  type InquiryAdminEmailInput,
} from "./inquiry-admin";
