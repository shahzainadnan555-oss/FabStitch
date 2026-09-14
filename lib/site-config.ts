const configuredSupportEmail =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() ?? "";
const configuredContactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";

export const SUPPORT_EMAIL = configuredSupportEmail || null;
export const CONTACT_EMAIL =
  configuredContactEmail || configuredSupportEmail || null;
