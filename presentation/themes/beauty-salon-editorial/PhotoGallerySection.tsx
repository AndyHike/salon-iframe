'use client';

import { useMemo, useState } from 'react';
import { useLocale } from '../../../components/LocaleContext';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import type { ThemeSectionProps } from '../types';
import { GalleryLightbox } from '../shared/GalleryLightbox';
import {
  buildGalleryImages,
  buildGalleryServiceFilters,
  filterGalleryImages,
} from '../shared/galleryData';
import { parseEditorialThemeData } from './themeData';

export function PhotoGallerySection({ 
  settings,
  appearance, 
  servicesItems,
  galleryItems,
  limit
}: ThemeSectionProps) {
  const { locale, t } = useLocale();
  const [activeServiceId, setActiveServiceId] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const variant = appearance.sectionVariants.photoGallery || 'grid';
  const themeData = parseEditorialThemeData(appearance.themeData);
  const defaultLocale = settings.defaultLocale || 'uk';
  const galleryImages = useMemo(
    () => buildGalleryImages(galleryItems, servicesItems, locale, defaultLocale),
    [defaultLocale, galleryItems, locale, servicesItems],
  );
  const filterOptions = useMemo(
    () => buildGalleryServiceFilters(galleryImages, servicesItems, locale, defaultLocale),
    [defaultLocale, galleryImages, locale, servicesItems],
  );
  const filteredImages = filterGalleryImages(galleryImages, activeServiceId);
  const images = limit ? filteredImages.slice(0, limit) : filteredImages;

  // default to framed for editorial unless explicitly overridden
  const isFramed = themeData.galleryChrome !== 'rounded';
  const radiusClass = isFramed ? 'rounded-none border border-stone-200 p-2 md:p-4 bg-white' : 'rounded-none';
  const spacingClass = themeData.sectionSpacing === 'airy' ? 'py-32' : 'py-20';
  const openImageLabel = t('gallery.openImage');

  return (
    <section id="photoGallery" className={`${spacingClass} bg-stone-50 border-t border-stone-200`}>
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col lg:flex-row items-baseline justify-between mb-20 border-b border-stone-300 pb-6"
        >
          <h2 className="text-5xl md:text-7xl font-serif text-stone-900 tracking-tighter uppercase">{t('gallery.title')}</h2>
          <span className="hidden lg:block text-sm font-medium tracking-widest uppercase text-[var(--primary-color)] mt-4 lg:mt-0">
            {t('gallery.kicker')}
          </span>
        </motion.div>

        {filterOptions.length > 0 && (
          <div className="mb-14 flex flex-wrap gap-3 border-b border-stone-200 pb-6">
            <button
              type="button"
              onClick={() => {
                setActiveServiceId('all');
                setLightboxIndex(null);
              }}
              className={`border px-5 py-3 text-xs font-semibold uppercase tracking-widest transition ${
                activeServiceId === 'all'
                  ? 'border-stone-950 bg-stone-950 text-white'
                  : 'border-stone-300 bg-transparent text-stone-600 hover:border-stone-950 hover:text-stone-950'
              }`}
              style={{ borderRadius: 'var(--btn-radius)' }}
            >
              {t('gallery.filterAll')}
            </button>
            {filterOptions.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => {
                  setActiveServiceId(service.id);
                  setLightboxIndex(null);
                }}
                className={`border px-5 py-3 text-xs font-semibold uppercase tracking-widest transition ${
                  activeServiceId === service.id
                    ? 'border-stone-950 bg-stone-950 text-white'
                    : 'border-stone-300 bg-transparent text-stone-600 hover:border-stone-950 hover:text-stone-950'
                }`}
                style={{ borderRadius: 'var(--btn-radius)' }}
              >
                {service.title}
              </button>
            ))}
          </div>
        )}
        
        {images.length === 0 ? (
          <p className="text-center text-stone-500 uppercase tracking-widest text-sm">{t('gallery.empty')}</p>
        ) : (
          <motion.div 
            initial={themeData.animationStyle === 'reveal' ? { opacity: 0, y: 40 } : { opacity: 0, scale: 0.98 }}
            whileInView={themeData.animationStyle === 'reveal' ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {variant === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {images.map((image, i) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className={`relative block aspect-[3/4] w-full text-left group ${radiusClass}`}
                    aria-label={`${openImageLabel}: ${image.altText}`}
                  >
                    <div className="relative w-full h-full overflow-hidden bg-stone-100 object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
                      <Image
                        src={image.filePath}
                        alt={image.altText}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
            {variant === 'masonry' && (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 max-w-7xl mx-auto space-y-8">
                {images.map((image, i) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className={`relative block w-full text-left group break-inside-avoid ${radiusClass}`}
                    aria-label={`${openImageLabel}: ${image.altText}`}
                  >
                    <div className="relative w-full overflow-hidden bg-stone-100 grayscale hover:grayscale-0 transition-all duration-700" style={{ paddingBottom: i % 3 === 0 ? '130%' : i % 2 === 0 ? '75%' : '100%' }}>
                      <Image
                        src={image.filePath}
                        alt={image.altText}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover absolute inset-0"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
            {variant === 'carousel' && (
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 max-w-7xl mx-auto hide-scrollbar">
                {images.map((image, i) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className={`relative flex-none w-[85%] md:w-[45%] lg:w-[30%] aspect-[3/4] text-left group snap-center ${radiusClass}`}
                    aria-label={`${openImageLabel}: ${image.altText}`}
                  >
                    <div className="relative w-full h-full overflow-hidden bg-stone-100 grayscale group-hover:grayscale-0 transition-all duration-700">
                      <Image
                        src={image.filePath}
                        alt={image.altText}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 85vw"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
        
        {limit && galleryImages.length > limit && (
          <div className="mt-24 flex justify-center">
            <Link 
              href="/gallery" 
              className="inline-block px-12 py-5 font-medium tracking-widest uppercase transition-all bg-[var(--primary-color)] text-white hover:opacity-90 shadow-lg"
              style={{ borderRadius: 'var(--btn-radius)' }}
            >
              {t('gallery.viewAll')}
            </Link>
          </div>
        )}
      </div>
      <GalleryLightbox
        images={images}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
        variant="editorial"
      />
    </section>
  );
}
