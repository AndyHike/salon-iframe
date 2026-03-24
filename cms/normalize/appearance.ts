import { AppearanceContract } from '../types';

export function normalizeAppearance(input: any): AppearanceContract {
  // If it's already a valid AppearanceContract (new API payload), just fill defaults
  if (input && input.tokens && input.layout && input.sectionVariants) {
    return {
      templateKey: input.templateKey || 'beauty-salon',
      themeKey: input.themeKey || null,
      tokens: {
        primaryColor: input.tokens.primaryColor || '#0f172a',
        fontFamily: input.tokens.fontFamily || "'Inter', sans-serif",
        buttonStyle: input.tokens.buttonStyle || 'pill',
        heroOverlay: input.tokens.heroOverlay ?? 0.4,
        logoUrl: input.tokens.logoUrl || null,
        heroBackgroundImage: input.tokens.heroBackgroundImage || null,
      },
      layout: {
        blocks: input.layout.blocks || ['hero', 'services', 'photoGallery', 'contacts'],
      },
      sectionVariants: input.sectionVariants || {},
      themeData: input.themeData || {},
    };
  }

  // Legacy preview payload mapping
  let blocks: string[] = ['hero', 'services', 'photoGallery', 'contacts'];
  if (input?.layoutConfig) {
    try {
      const parsed = typeof input.layoutConfig === 'string' ? JSON.parse(input.layoutConfig) : input.layoutConfig;
      if (Array.isArray(parsed)) {
        // Map 'gallery' to 'photoGallery'
        blocks = parsed.map(block => block === 'gallery' ? 'photoGallery' : block);
      }
    } catch (e) {
      console.error('Failed to parse legacy layoutConfig', e);
    }
  }

  const sectionVariants: Record<string, string> = {};
  if (input?.servicesLayout) {
    sectionVariants.services = input.servicesLayout;
  } else {
    sectionVariants.services = 'cards'; // Default fallback
  }

  if (input?.galleryLayout) {
    sectionVariants.photoGallery = input.galleryLayout;
  } else {
    sectionVariants.photoGallery = 'masonry'; // Default fallback
  }

  return {
    templateKey: input?.templateKey || 'beauty-salon',
    themeKey: input?.themeKey || null,
    tokens: {
      primaryColor: input?.primaryColor || '#0f172a',
      fontFamily: input?.fontFamily || "'Inter', sans-serif",
      buttonStyle: input?.buttonStyle || 'pill',
      heroOverlay: input?.heroOverlay ? parseFloat(input.heroOverlay) : 0.4,
      logoUrl: input?.logoUrl || null,
      heroBackgroundImage: input?.heroBackgroundImage || null,
    },
    layout: { blocks },
    sectionVariants,
    themeData: {},
  };
}
