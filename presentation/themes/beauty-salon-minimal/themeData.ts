export type BeautySalonMinimalThemeData = {
  sectionSpacing: 'compact' | 'regular' | 'airy';
  serviceDensity: 'regular' | 'compact';
  galleryImageRatio: 'portrait' | 'square';
  heroChrome: 'caption' | 'clean';
};

export const beautySalonMinimalThemeDataSchema = {
  sectionSpacing: ['compact', 'regular', 'airy'],
  serviceDensity: ['regular', 'compact'],
  galleryImageRatio: ['portrait', 'square'],
  heroChrome: ['caption', 'clean'],
};

export function parseMinimalThemeData(data: Record<string, unknown> | undefined | null): BeautySalonMinimalThemeData {
  const safeData = data || {};

  return {
    sectionSpacing:
      safeData.sectionSpacing === 'compact'
        ? 'compact'
        : safeData.sectionSpacing === 'airy'
          ? 'airy'
          : 'regular',
    serviceDensity: safeData.serviceDensity === 'compact' ? 'compact' : 'regular',
    galleryImageRatio: safeData.galleryImageRatio === 'square' ? 'square' : 'portrait',
    heroChrome: safeData.heroChrome === 'clean' ? 'clean' : 'caption',
  };
}
