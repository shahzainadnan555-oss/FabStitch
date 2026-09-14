import type { BestForSlug } from "./best-for";
import type { CollectionSlug, SourceFamilySlug } from "./collections";

export type CatalogSeason = "SS 27" | "AW 27/28" | "Home & Contract 27/28";

export type MeasurementUnit =
  | "gsm"
  | "momme"
  | "oz/yd²"
  | "denier"
  | "gauge"
  | "micron"
  | "wale"
  | "Martindale";

export interface CatalogMeasurement {
  readonly unit: MeasurementUnit;
  readonly min?: number;
  readonly max?: number;
  readonly exact?: number;
  readonly qualifier?: string;
}

export interface CatalogProduct {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly aliases?: readonly string[];
  readonly family: SourceFamilySlug;
  readonly collection: CollectionSlug;
  readonly seasons: readonly CatalogSeason[];
  readonly summary?: string;
  readonly description?: string;
  /**
   * Source wording, retained as one or more alternatives where the reference
   * gives alternatives rather than a single known composition.
   */
  readonly composition?: readonly string[];
  readonly measurements?: readonly CatalogMeasurement[];
  readonly construction?: readonly string[];
  readonly characteristics?: readonly string[];
  readonly applications: readonly BestForSlug[];
  readonly source: string;
}

export type MediaStatus = "final" | "temporary" | "placeholder";

export interface FabricMedia {
  readonly status: MediaStatus;
  readonly src?: string;
  readonly alt?: string;
}

export interface CollectionDefinition {
  readonly slug: string;
  readonly label: string;
}

export interface SourceFamilyDefinition {
  readonly slug: string;
  readonly label: string;
  readonly sourceSection: string;
}

export interface BestForDefinition {
  readonly slug: string;
  readonly label: string;
}
