export type AppearanceContract = {
  templateKey: string;
  themeKey: string | null;
  tokens: {
    primaryColor: string;
    fontFamily: string;
    buttonStyle?: string;
    heroOverlay?: number;
    logoUrl?: string | null;
    heroBackgroundImage?: string | null;
  };
  layout: { blocks: string[] };
  sectionVariants: Record<string, string>;
  themeData: Record<string, unknown>;
};

export type LocalizedString = string | Record<string, string>;

export type CmsSeoOverrides = {
  title?: LocalizedString | null;
  titleOverride?: LocalizedString | null;
  description?: LocalizedString | null;
  descriptionOverride?: LocalizedString | null;
  h1?: LocalizedString | null;
  h1Override?: LocalizedString | null;
  ogTitle?: LocalizedString | null;
  ogTitleOverride?: LocalizedString | null;
  ogDescription?: LocalizedString | null;
  ogDescriptionOverride?: LocalizedString | null;
  ogImage?: string | null;
  ogImageOverride?: string | null;
  noindex?: boolean | null;
};

export type SiteAvailabilityCode =
  | 'STORE_SUSPENDED'
  | 'SITE_MAINTENANCE'
  | 'SITE_TEMPORARILY_CLOSED';

export type SiteAvailabilityMode =
  | 'SUSPENDED'
  | 'MAINTENANCE'
  | 'TEMPORARILY_CLOSED'
  | string;

export type SiteAvailability = {
  status: 403;
  success: false;
  code: SiteAvailabilityCode;
  mode: SiteAvailabilityMode | null;
  source: string | null;
  message: string | null;
  until: string | null;
  error: string | null;
};

export type CmsSettingsResponse = {
  success: boolean;
  data: {
    id?: string | null;
    siteId?: string | null;
    storeId?: string | null;
    companyName?: string | null;
    businessType?: string | null;
    businessCategory?: string | null;
    phone?: string | null;
    email?: string | null;
    contactName?: string | null;
    address?: string | null;
    street?: string | null;
    streetAddress?: string | null;
    city?: string | null;
    district?: string | null;
    postalCode?: string | null;
    country?: string | null;
    addressUrl?: string | null;
    bookingUrl?: string | null;
    googleMapsUrl?: string | null;
    googleMapsEmbedUrl?: string | null;
    googleReviewUrl?: string | null;
    languages?: string[] | string | null;
    seo?: CmsSeoOverrides | null;
    defaultLocale?: string | null;
    workingHours?: unknown;
    instagramUrl?: string | null;
    instagramActive?: boolean;
    facebookUrl?: string | null;
    facebookActive?: boolean;
    telegramUrl?: string | null;
    telegramActive?: boolean;
    privacyPolicy?: string | null;
    privacyPolicyActive?: boolean;
    termsOfService?: string | null;
    termsOfServiceActive?: boolean;
    availableLocales?: Array<{ code: string; name: string }>;
    appearance: AppearanceContract;
  };
};

export type CmsItemCategory = {
  id: string;
  slug: string;
  title: Partial<Record<"uk" | "en" | "cs", string>> | Record<string, string>;
  ancestors?: Array<{
    id: string;
    slug: string;
    title: Partial<Record<"uk" | "en" | "cs", string>> | Record<string, string>;
  }>;
};

/**
 * One image as the admin delivers it: a finished URL, a finished `srcset` across
 * the admin's own size ladder, and intrinsic pixels when it knows them.
 *
 * `filePath` is the historical name and still holds a ready-to-render URL, so
 * nothing reading it breaks. What it stopped being is the full-size master.
 *
 * Never assemble a URL from these. The admin's URL shape is explicitly not part
 * of its contract and changes without notice; there is also no size outside the
 * `srcset`, so there is nothing a template could build that the list does not
 * already contain. `srcset` is null for externally hosted images and when the
 * admin has transformed delivery switched off; `width`/`height` are null for
 * anything uploaded before the admin recorded them.
 */
export type CmsImage = {
  id: string;
  filePath: string;
  altText?: string | null;
  isMain?: boolean;
  position?: number;
  srcset?: string | null;
  width?: number | null;
  height?: number | null;
};

export type CmsItem = {
  id: string;
  title: Record<string, string>;
  slug: string;
  description?: Record<string, string> | null;
  content?: Record<string, string> | null;
  seo?: CmsSeoOverrides | null;
  price?: string | number | null;
  attributes?: Record<string, unknown> | null;
  categories?: CmsItemCategory[];
  images?: CmsImage[];
  linkedItems?: Array<{
    id: string;
    type: string;
    overridePrice?: string | number | null;
    targetItem: {
      id: string;
      title: Record<string, string>;
      slug: string;
      price?: string | number | null;
      images?: CmsImage[];
    };
  }>;
};

export type CmsItemsResponse = {
  success: boolean;
  data: CmsItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type CmsCategory = {
  id: string;
  title: Record<string, string>;
  slug: string;
  description?: Record<string, string> | null;
  parentId?: string | null;
};

export type CmsCategoriesResponse = {
  success: boolean;
  data: CmsCategory[];
};

export type CmsItemResponse = {
  success: boolean;
  data: CmsItem;
};

export type ServiceCategoryGroupData = {
  category: CmsCategory;
  items: CmsItem[];
};

export type BeautySalonPageData = {
  settings: CmsSettingsResponse['data'];
  appearance: AppearanceContract;
  servicesItems: CmsItem[];
  servicesData?: ServiceCategoryGroupData[];
  galleryItems: CmsItem[];
  availableLocales: Array<{ code: string; name: string }>;
  defaultLocale: string;
};
