import type { ComponentType } from 'react';
import type { AppearanceContract, CmsItem, CmsSettingsResponse } from '../../cms/types';

export type ThemeSectionProps = {
  settings: CmsSettingsResponse['data'];
  appearance: AppearanceContract;
  servicesItems: CmsItem[];
  galleryItems: CmsItem[];
  domain: string;
  limit?: number;
};

export type BeautySalonThemeDefinition = {
  key: string;
  templateKey: 'beauty-salon';
  displayName: Record<string, string>;
  sections: Record<string, ComponentType<ThemeSectionProps>>;
  supportedBlocks: string[];
  supportedSectionVariants: Record<string, string[]>;
  tokens: string[];
  themeDataSchema: Record<string, unknown>;
  fallbackSectionVariants: Record<string, string>;
};
