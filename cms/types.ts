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

export type CmsSettingsResponse = {
  success: boolean;
  data: {
    companyName?: string | null;
    phone?: string | null;
    email?: string | null;
    contactName?: string | null;
    address?: string | null;
    addressUrl?: string | null;
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

export type CmsItem = {
  id: string;
  title: Record<string, string>;
  slug: string;
  description?: Record<string, string> | null;
  content?: Record<string, string> | null;
  price?: string | number | null;
  attributes?: Record<string, unknown> | null;
  categories?: CmsItemCategory[];
  images?: Array<{
    id: string;
    filePath: string;
    altText?: string | null;
    isMain?: boolean;
    position?: number;
  }>;
  linkedItems?: Array<{
    id: string;
    type: string;
    overridePrice?: string | number | null;
    targetItem: {
      id: string;
      title: Record<string, string>;
      slug: string;
      price?: string | number | null;
      images?: Array<{ id: string; filePath: string; altText?: string | null }>;
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
