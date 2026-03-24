'use client';

import { motion } from 'motion/react';
import { useLocale } from '../../../components/LocaleContext';
import { AppearanceContract, CmsItem, CmsSettingsResponse } from '../../../cms/types';
import { parseThemeData } from '../../theme-data/parser';

export function Hero({ 
  settings, 
  appearance,
  servicesItems,
  galleryItems,
  domain,
  limit
}: { 
  settings: CmsSettingsResponse['data']; 
  appearance: AppearanceContract;
  servicesItems: CmsItem[];
  galleryItems: CmsItem[];
  domain: string;
  limit?: number;
}) {
  const { t } = useLocale();
  const themeData = parseThemeData(appearance.themeData);
  const tokens = appearance.tokens;
  const hasBgImage = !!tokens.heroBackgroundImage;
  const overlayOpacity = tokens.heroOverlay !== undefined ? tokens.heroOverlay : 0.4;
  const companyName = settings.companyName || 'Premium Salon & Barbershop';

  const animationFloat: any = themeData.animationStyle === 'float' ? { y: [0, -10, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } } : {};
  const animationInitial = themeData.animationStyle === 'reveal' ? { opacity: 0, scale: 0.95 } : { opacity: 0, y: 30 };
  const animationAnimate = themeData.animationStyle === 'reveal' ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 };

  return (
    <section 
      id="hero"
      className={`relative pt-32 pb-24 flex items-center justify-center min-h-[80vh] overflow-hidden ${hasBgImage ? 'bg-stone-900' : 'bg-stone-50'}`}
      style={hasBgImage ? { backgroundImage: `url(${tokens.heroBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {hasBgImage ? (
        <div className="absolute inset-0 z-0 bg-black" style={{ opacity: overlayOpacity }}></div>
      ) : (
        <div className="absolute inset-0 z-0 opacity-5 bg-[var(--primary-color)]"></div>
      )}
      
      <motion.div 
        initial={animationInitial}
        animate={animationAnimate}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`container mx-auto px-4 relative z-10 text-center flex flex-col items-center ${hasBgImage ? 'text-white' : 'text-stone-900'}`}
      >
        <motion.h1 
          animate={animationFloat}
          className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight mb-6 drop-shadow-sm"
        >
          {companyName}
        </motion.h1>
        <p className={`text-xl md:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-sm font-light ${hasBgImage ? 'text-stone-200' : 'text-stone-600'}`}>
          {t('hero.subtitle') || 'Experience the finest grooming and beauty services tailored just for you.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {themeData.ctaPlacement === 'hero' && (
            <a 
              href="#contacts"
              className="px-8 py-4 text-white font-medium text-lg transition-transform hover:scale-105 shadow-lg bg-[var(--primary-color)] inline-block"
              style={{ borderRadius: 'var(--btn-radius)' }}
            >
              {t('btn.book')}
            </a>
          )}
          <a 
            href="#services"
            className={`px-8 py-4 font-medium text-lg transition-transform hover:scale-105 inline-block ${themeData.ctaPlacement === 'hero' ? 'border-2 ' + (hasBgImage ? 'border-white text-white hover:bg-white/10' : 'border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)]/5') : 'text-white shadow-lg bg-[var(--primary-color)]'}`}
            style={{ borderRadius: 'var(--btn-radius)' }}
          >
            {t('nav.services')}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
