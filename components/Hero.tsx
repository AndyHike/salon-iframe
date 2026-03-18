'use client';

import { SiteData } from '@/lib/getSiteData';
import { StoreData } from '@/lib/api';
import { useLocale } from './LocaleContext';
import { motion } from 'motion/react';

export function Hero({ siteData, storeData }: { siteData: SiteData; storeData: StoreData }) {
  const hasBgImage = !!siteData.heroBackgroundImage;
  const overlayOpacity = siteData.heroOverlay !== undefined ? siteData.heroOverlay : 0.4;
  const { t } = useLocale();

  return (
    <section 
      id="hero"
      className={`relative pt-32 pb-24 flex items-center justify-center min-h-[80vh] overflow-hidden ${hasBgImage ? 'bg-stone-900' : 'bg-stone-50'}`}
      style={hasBgImage ? { backgroundImage: `url(${siteData.heroBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {hasBgImage ? (
        <div className="absolute inset-0 z-0 bg-black" style={{ opacity: overlayOpacity }}></div>
      ) : (
        <div className="absolute inset-0 z-0 opacity-5 bg-[var(--primary-color)]"></div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`container mx-auto px-4 relative z-10 text-center ${hasBgImage ? 'text-white' : 'text-stone-900'}`}
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight mb-6 drop-shadow-sm">
          {siteData.name || 'Premium Salon & Barbershop'}
        </h1>
        <p className={`text-xl md:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-sm font-light ${hasBgImage ? 'text-stone-200' : 'text-stone-600'}`}>
          {siteData.description || 'Experience the finest grooming and beauty services tailored just for you.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#services"
            className="px-8 py-4 text-white font-medium text-lg transition-transform hover:scale-105 shadow-lg bg-[var(--primary-color)] inline-block"
            style={{ borderRadius: 'var(--btn-radius)' }}
          >
            {t('nav.services')}
          </a>
          <a 
            href="#contacts"
            className={`px-8 py-4 font-medium text-lg transition-transform hover:scale-105 inline-block border-2 ${hasBgImage ? 'border-white text-white hover:bg-white/10' : 'border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)]/5'}`}
            style={{ borderRadius: 'var(--btn-radius)' }}
          >
            {t('btn.book')}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
