export type BeautySalonEditorialThemeData = {
  heroStyle: 'spotlight' | 'split';
  surfaceStyle: 'soft' | 'paper';
  sectionSpacing: 'regular' | 'airy';
  galleryChrome: 'rounded' | 'framed';
  ctaPlacement: 'navbar' | 'hero';
  animationStyle: 'float' | 'reveal';
};

export const beautySalonEditorialThemeDataSchema = {
  heroStyle: ['spotlight', 'split'],
  surfaceStyle: ['soft', 'paper'],
  sectionSpacing: ['regular', 'airy'],
  galleryChrome: ['rounded', 'framed'],
  ctaPlacement: ['navbar', 'hero'],
  animationStyle: ['float', 'reveal'],
};

export function parseEditorialThemeData(data: Record<string, unknown> | undefined | null): BeautySalonEditorialThemeData {
  const safeData = data || {};

  return {
    heroStyle: safeData.heroStyle === 'split' ? 'split' : 'spotlight',
    surfaceStyle: safeData.surfaceStyle === 'paper' ? 'paper' : 'soft',
    sectionSpacing: safeData.sectionSpacing === 'airy' ? 'airy' : 'regular',
    galleryChrome: safeData.galleryChrome === 'framed' ? 'framed' : 'rounded',
    ctaPlacement: safeData.ctaPlacement === 'hero' ? 'hero' : 'navbar',
    animationStyle: safeData.animationStyle === 'reveal' ? 'reveal' : 'float',
  };
}
