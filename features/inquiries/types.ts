import type { MediaSubject } from "@/components/marketplace/fabric-media";

export type InquiryFlowFabric = {
  id: string;
  slug: string;
  name: string;
  imageSrc?: string;
  imageAlt: string;
  mediaSubject: MediaSubject;
  variantId?: string;
  variantLabel?: string;
  quantityUnit?: string;
};
