import { permanentRedirect } from "next/navigation";

export default function LegacyBuyerInquiriesRedirect() {
  permanentRedirect("/inquiries/");
}
