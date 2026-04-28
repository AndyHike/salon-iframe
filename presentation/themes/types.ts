import type { ComponentType } from 'react';
import type { AppearanceContract, CmsItem, CmsSettingsResponse } from '../../cms/types';
import type { AppointmentServiceSelection } from '../appointments/serviceRequest';

export type ThemeNavigationBehavior = {
  transparency: 'solid' | 'transparent-over-hero-image';
};

export type ThemeSectionProps = {
  settings: CmsSettingsResponse['data'];
  appearance: AppearanceContract;
  servicesItems: CmsItem[];
  galleryItems: CmsItem[];
  domain: string;
  limit?: number;
  selectedService?: AppointmentServiceSelection | null;
  onRequestService?: (service: CmsItem) => void;
  onAppointmentRequestComplete?: () => void;
};

export type ThemeNavbarProps = {
  appearance: AppearanceContract;
  settings: CmsSettingsResponse['data'];
  layoutConfig: string[];
  domain: string;
  navigation: ThemeNavigationBehavior;
};

export type ThemeFooterProps = {
  appearance: AppearanceContract;
  settings: CmsSettingsResponse['data'];
};

export type BeautySalonThemeShell = {
  Navbar: ComponentType<ThemeNavbarProps>;
  Footer: ComponentType<ThemeFooterProps>;
};

export type BeautySalonThemeManifest = {
  key: string;
  templateKey: 'beauty-salon';
  displayName: Record<string, string>;
  supportedBlocks: string[];
  supportedSectionVariants: Record<string, string[]>;
  tokens: string[];
  themeDataSchema: Record<string, unknown>;
  fallbackSectionVariants: Record<string, string>;
  navigation: ThemeNavigationBehavior;
  availabilityCodes: string[];
  fixturePath?: string;
  requiresAdminControls: boolean;
};

export type BeautySalonThemeDefinition = BeautySalonThemeManifest & {
  sections: Record<string, ComponentType<ThemeSectionProps>>;
  shell: BeautySalonThemeShell;
};
