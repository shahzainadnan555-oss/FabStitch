import { permanentRedirect } from "next/navigation";

export default function ObsoleteSupplierRoute() {
  permanentRedirect("/marketplace/");
}
