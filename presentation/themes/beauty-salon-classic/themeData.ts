export type BeautySalonClassicThemeData = {
  surfaceStyle: 'soft' | 'paper';
  sectionSpacing: 'regular' | 'airy';
  galleryChrome: 'rounded' | 'framed';
  ctaPlacement: 'navbar' | 'hero';
  animationStyle: 'float' | 'reveal';
};

export const beautySalonClassicThemeDataSchema = {
  surfaceStyle: ['soft', 'paper'],
  sectionSpacing: ['regular', 'airy'],
  galleryChrome: ['rounded', 'framed'],
  ctaPlacement: ['navbar', 'hero'],
  animationStyle: ['float', 'reveal'],
};

export function parseClassicThemeData(data: Record<string, unknown> | undefined | null): BeautySalonClassicThemeData {
  const safeData = data || {};

  return {
    surfaceStyle: safeData.surfaceStyle === 'paper' ? 'paper' : 'soft',
    sectionSpacing: safeData.sectionSpacing === 'airy' ? 'airy' : 'regular',
    galleryChrome: safeData.galleryChrome === 'framed' ? 'framed' : 'rounded',
    ctaPlacement: safeData.ctaPlacement === 'hero' ? 'hero' : 'navbar',
    animationStyle: safeData.animationStyle === 'reveal' ? 'reveal' : 'float',
  };
}
