import type { BeautySalonThemeManifest } from '../types';
import { beautySalonAvailabilityCodes, beautySalonBaseTokens } from '../shared/beautySalonContract';
import { beautySalonClassicThemeDataSchema } from './themeData';

export const beautySalonClassicThemeManifest = {
  key: 'beauty-salon-classic',
  templateKey: 'beauty-salon',
  displayName: {
    en: 'Classic',
    uk: 'Класична',
  },
  supportedBlocks: ['hero', 'services', 'photoGallery', 'contacts'],
  supportedSectionVariants: {
    services: ['cards', 'grid', 'list', 'compact'],
    photoGallery: ['grid', 'masonry', 'carousel'],
  },
  tokens: beautySalonBaseTokens,
  themeDataSchema: beautySalonClassicThemeDataSchema,
  fallbackSectionVariants: {
    services: 'cards',
    photoGallery: 'masonry',
  },
  navigation: {
    transparency: 'transparent-over-hero-image',
  },
  availabilityCodes: beautySalonAvailabilityCodes,
  requiresAdminControls: true,
} satisfies BeautySalonThemeManifest;
