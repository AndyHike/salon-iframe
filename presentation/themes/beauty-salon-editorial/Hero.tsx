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
  const companyName = settings.companyName || 'Premium Salon & Barbershop';

  const isSplit = themeData.heroStyle === 'split';

  const textAnimation = themeData.animationStyle === 'reveal' 
    ? { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 } } 
    : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };

  if (isSplit && hasBgImage) {
    return (
      <section 
        id="hero"
        className="relative pt-24 md:pt-32 pb-0 flex items-stretch min-h-[90vh] bg-white overflow-hidden"
      >
        <div className="container mx-auto px-0 w-full flex flex-col lg:flex-row">
          <motion.div 
            initial={textAnimation.initial}
            animate={textAnimation.animate}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 flex flex-col justify-center items-start px-6 lg:px-16 py-20 z-10"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tighter mb-8 text-stone-900 leading-[0.9]">
              {companyName}
            </h1>
            <div className="w-16 h-1 bg-[var(--primary-color)] mb-8"></div>
            <p className="text-xl md:text-2xl mb-12 max-w-lg text-stone-600 font-light leading-relaxed">
              {t('hero.subtitle') || 'Experience the finest grooming and beauty services tailored just for you.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {themeData.ctaPlacement === 'hero' && (
                <a 
                  href="#contacts"
                  className="px-8 py-4 text-white font-medium tracking-wide text-sm uppercase transition-all hover:bg-stone-800 shadow-none bg-[var(--primary-color)] inline-block"
                >
                  {t('btn.book')}
                </a>
              )}
              <a 
                href="#services"
                className={`px-8 py-4 font-medium tracking-wide text-sm uppercase transition-all inline-block border border-stone-300 text-stone-900 hover:border-stone-900 ${themeData.ctaPlacement === 'hero' ? '' : 'text-white bg-[var(--primary-color)] border-transparent hover:border-transparent hover:opacity-90'}`}
              >
                {t('nav.services')}
              </a>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-full relative"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${tokens.heroBackgroundImage})` }}
            ></div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Fallback to a cleaner centered if no bg image or explicitly spotlight
  const overlayOpacity = tokens.heroOverlay !== undefined ? tokens.heroOverlay : 0.2;
  return (
    <section 
      id="hero"
      className={`relative pt-32 pb-24 flex items-center justify-center min-h-[85vh] overflow-hidden ${hasBgImage ? 'bg-stone-900' : 'bg-stone-50'}`}
      style={hasBgImage ? { backgroundImage: `url(${tokens.heroBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {hasBgImage ? (
        <div className="absolute inset-0 z-0 bg-black" style={{ opacity: overlayOpacity }}></div>
      ) : (
        <div className="absolute inset-0 z-0 opacity-5 bg-[var(--primary-color)]"></div>
      )}
      
      <motion.div 
        initial={textAnimation.initial}
        animate={textAnimation.animate}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`container mx-auto px-4 relative z-10 text-center flex flex-col items-center ${hasBgImage ? 'text-white' : 'text-stone-900'}`}
      >
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif tracking-tighter mb-8 drop-shadow-sm uppercase">
          {companyName}
        </h1>
        <p className={`text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light tracking-wide ${hasBgImage ? 'text-stone-200' : 'text-stone-600'}`}>
          {t('hero.subtitle') || 'Experience the finest grooming and beauty services tailored just for you.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {themeData.ctaPlacement === 'hero' && (
            <a 
              href="#contacts"
              className="px-10 py-5 text-white font-medium text-sm tracking-widest uppercase transition-all bg-[var(--primary-color)] hover:bg-stone-800 inline-block"
            >
              {t('btn.book')}
            </a>
          )}
          <a 
            href="#services"
            className={`px-10 py-5 font-medium text-sm tracking-widest uppercase transition-all inline-block ${themeData.ctaPlacement === 'hero' ? 'border border-current hover:bg-white/10' : 'text-white bg-[var(--primary-color)] hover:bg-stone-800'}`}
          >
            {t('nav.services')}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
