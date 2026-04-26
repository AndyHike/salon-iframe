import { beautySalonClassicTheme } from './beauty-salon-classic/theme';
import { beautySalonEditorialTheme } from './beauty-salon-editorial/theme';
import { beautySalonMinimalTheme } from './beauty-salon-minimal/theme';
import type { BeautySalonThemeDefinition } from './types';

const DEFAULT_THEME_KEY = 'beauty-salon-classic';

const beautySalonTokens = [
  'primaryColor',
  'fontFamily',
  'buttonStyle',
  'heroOverlay',
  'heroBackgroundImage',
  'logoUrl',
];

export const themeDefinitions = {
  'beauty-salon-classic': {
    key: 'beauty-salon-classic',
    templateKey: 'beauty-salon',
    displayName: {
      en: 'Classic',
      uk: '\u041a\u043b\u0430\u0441\u0438\u0447\u043d\u0430',
    },
    sections: beautySalonClassicTheme,
    supportedBlocks: ['hero', 'services', 'photoGallery', 'contacts'],
    supportedSectionVariants: {
      services: ['cards', 'grid', 'list', 'compact'],
      photoGallery: ['grid', 'masonry', 'carousel'],
    },
    tokens: beautySalonTokens,
    themeDataSchema: {},
    fallbackSectionVariants: {
      services: 'cards',
      photoGallery: 'masonry',
    },
  },
  'beauty-salon-editorial': {
    key: 'beauty-salon-editorial',
    templateKey: 'beauty-salon',
    displayName: {
      en: 'Editorial',
      uk: '\u0415\u0434\u0438\u0442\u043e\u0440\u0456\u0430\u043b\u044c\u043d\u0430',
    },
    sections: beautySalonEditorialTheme,
    supportedBlocks: ['hero', 'services', 'photoGallery', 'contacts'],
    supportedSectionVariants: {
      services: ['cards', 'grid', 'list', 'compact'],
      photoGallery: ['grid', 'masonry', 'carousel'],
    },
    tokens: beautySalonTokens,
    themeDataSchema: {
      heroStyle: ['spotlight', 'split'],
      surfaceStyle: ['soft', 'paper'],
      sectionSpacing: ['regular', 'airy'],
      galleryChrome: ['rounded', 'framed'],
      ctaPlacement: ['navbar', 'hero'],
      animationStyle: ['float', 'reveal'],
    },
    fallbackSectionVariants: {
      services: 'list',
      photoGallery: 'grid',
    },
  },
  'beauty-salon-minimal': {
    key: 'beauty-salon-minimal',
    templateKey: 'beauty-salon',
    displayName: {
      en: 'Minimal',
      uk: '\u041c\u0456\u043d\u0456\u043c\u0430\u043b\u044c\u043d\u0430',
    },
    sections: beautySalonMinimalTheme,
    supportedBlocks: ['hero', 'services', 'photoGallery', 'contacts'],
    supportedSectionVariants: {
      services: ['cards', 'list'],
      photoGallery: ['grid', 'masonry'],
    },
    tokens: beautySalonTokens,
    themeDataSchema: {},
    fallbackSectionVariants: {
      services: 'list',
      photoGallery: 'grid',
    },
  },
} satisfies Record<string, BeautySalonThemeDefinition>;

export const themeRegistry: Record<string, BeautySalonThemeDefinition['sections']> = Object.fromEntries(
  Object.entries(themeDefinitions).map(([key, definition]) => [key, definition.sections])
) as Record<string, BeautySalonThemeDefinition['sections']>;

export function resolveThemeDefinition(themeKey: string | null | undefined): BeautySalonThemeDefinition {
  if (themeKey && Object.prototype.hasOwnProperty.call(themeDefinitions, themeKey)) {
    return themeDefinitions[themeKey as keyof typeof themeDefinitions];
  }

  return themeDefinitions[DEFAULT_THEME_KEY];
}
