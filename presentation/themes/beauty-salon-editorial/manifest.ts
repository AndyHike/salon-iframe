import type { BeautySalonThemeManifest } from '../types';
import { beautySalonAvailabilityCodes, beautySalonBaseTokens } from '../shared/beautySalonContract';
import { beautySalonEditorialThemeDataSchema } from './themeData';

export const beautySalonEditorialThemeManifest = {
  key: 'beauty-salon-editorial',
  templateKey: 'beauty-salon',
  displayName: {
    en: 'Editorial',
    uk: 'Едиторіальна',
  },
  supportedBlocks: ['hero', 'services', 'photoGallery', 'contacts'],
  supportedSectionVariants: {
    services: ['cards', 'grid', 'list', 'compact'],
    photoGallery: ['grid', 'masonry', 'carousel'],
  },
  tokens: beautySalonBaseTokens,
  themeDataSchema: beautySalonEditorialThemeDataSchema,
  fallbackSectionVariants: {
    services: 'list',
    photoGallery: 'grid',
  },
  navigation: {
    transparency: 'solid',
  },
  availabilityCodes: beautySalonAvailabilityCodes,
  requiresAdminControls: true,
} satisfies BeautySalonThemeManifest;
