import type { BeautySalonThemeManifest } from '../types';
import { beautySalonAvailabilityCodes, beautySalonBaseTokens } from '../shared/beautySalonContract';
import { beautySalonMinimalThemeDataSchema } from './themeData';

export const beautySalonMinimalThemeManifest = {
  key: 'beauty-salon-minimal',
  templateKey: 'beauty-salon',
  displayName: {
    en: 'Minimal',
    uk: 'Мінімальна',
  },
  supportedBlocks: ['hero', 'services', 'photoGallery', 'contacts'],
  supportedSectionVariants: {
    services: ['cards', 'list'],
    photoGallery: ['grid', 'masonry'],
  },
  tokens: beautySalonBaseTokens,
  themeDataSchema: beautySalonMinimalThemeDataSchema,
  fallbackSectionVariants: {
    services: 'list',
    photoGallery: 'grid',
  },
  navigation: {
    transparency: 'solid',
  },
  availabilityCodes: beautySalonAvailabilityCodes,
  fixturePath: '/theme-fixtures/beauty-salon-minimal',
  requiresAdminControls: true,
} satisfies BeautySalonThemeManifest;
