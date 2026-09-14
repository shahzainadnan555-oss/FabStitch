import { permanentRedirect } from "next/navigation";

export default function LegacyBuyerOrdersRedirect() {
  permanentRedirect("/account/orders/");
}
