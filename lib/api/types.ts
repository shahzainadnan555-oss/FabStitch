import type { components } from "@/lib/api/schema";

type Schema = components["schemas"];

export type User = Schema["UserPublic"];
export type Profile = Schema["UserPublic"];
export type AuthSession = Schema["MeResponse"];
export type SignupRequest = Schema["SignupRequest"];
export type LoginRequest = Schema["LoginRequest"];
export type ProfileUpdate = Schema["ProfileUpdateRequest"];

export type Country = Schema["CountryOut"];
export type Currency = Schema["CurrencyOut"];
export type Preferences = Schema["CustomerPreferencesOut"];
export type PreferencesUpdate = Schema["PreferencesUpdateRequest"];
export type OnboardingState = Schema["OnboardingStateResponse"];
export type OnboardingOptions = Schema["OnboardingOptionsResponse"];
export type OnboardingUpdate = Schema["OnboardingSaveRequest"];

export type Recommendation = Schema["RecommendedFabric"];
export type RecommendationPage = Schema["RecommendationPage"];
export type DiscoverySection = Schema["DiscoverySection"];
export type Discovery = Schema["DiscoveryResponse"];

export type Fabric = Schema["FabricDetailOut"];
export type FabricCard = Schema["FabricCardOut"];
export type FabricFilter = Schema["FilterOptionOut"];
export type FabricFilters = Schema["FabricFiltersResponse"];
export type FabricPage = Schema["FabricListResponse"];
export type Collection = Schema["CollectionDetailOut"];
export type CollectionCard = Schema["CollectionCardOut"];
export type BestFor = Schema["BestForDetailOut"];
export type BestForCard = Schema["BestForCardOut"];

export type Inquiry = Schema["InquiryOut"];
export type InquiryPage = Schema["InquiryListResponse"];
export type InquiryCreate = Schema["CreateInquiryRequest"];
export type Order = Schema["OrderOut"];
export type OrderSummary = Schema["OrderListItemOut"];
export type OrderPage = Schema["OrderListResponse"];
export type OrderCreate = Schema["CreateOrderRequest"];
export type PaymentState = Order["payment_status"];

export type AdminDashboard = Schema["DashboardOverview"];
export type AdminCustomer = Schema["AdminCustomerDetail"];
export type AdminCustomerSummary = Schema["AdminCustomerListItem"];
export type AdminSupplier = Schema["SupplierOut"];
export type AdminFabric = Schema["AdminFabricDetail"];
export type AdminInquiry = Schema["AdminInquiryOut"];
export type AdminAuditEvent = Schema["AdminAuditListItem"];
export type RealtimeEvent = Schema["RealtimeEnvelope"];

export type SeoPage = Schema["SeoPagePublicOut"];
export type SeoAdminPage = Schema["SeoPageAdminOut"];
export type SeoRouteClassification = Schema["RouteClassifyOut"];
export type SeoRouteClass = Schema["RouteClassOut"];
export type SeoSitemapIndex = Schema["SitemapIndexOut"];
export type SeoSitemapPage = Schema["SitemapPageOut"];
