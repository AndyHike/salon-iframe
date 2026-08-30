'use client';

import { useMemo, useState } from 'react';
import { useLocale } from '../../../components/LocaleContext';
import { motion } from 'motion/react';
import { CmsImage } from '../shared/CmsImage';
import Link from 'next/link';
import type { ThemeSectionProps } from '../types';
import { GalleryLightbox } from '../shared/GalleryLightbox';
import {
  buildGalleryImages,
  buildGalleryServiceFilters,
  filterGalleryImages,
} from '../shared/galleryData';
import { parseClassicThemeData } from './themeData';

export function PhotoGallerySection({ 
  settings,
  appearance, 
  servicesItems,
  galleryItems,
  limit
}: ThemeSectionProps) {
  const { locale, t, localePath } = useLocale();
  const [activeServiceId, setActiveServiceId] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const variant = appearance.sectionVariants.photoGallery || 'masonry';
  const themeData = parseClassicThemeData(appearance.themeData);
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

  const isFramed = themeData.galleryChrome === 'framed';
  const radiusClass = isFramed ? 'rounded-none border-[12px] border-white' : 'rounded-xl';
  const spacingClass = themeData.sectionSpacing === 'airy' ? 'py-32' : 'py-24';
  const openImageLabel = t('gallery.openImage');

  return (
    <section id="photoGallery" className={`${spacingClass} bg-white`}>
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">{t('gallery.title')}</h2>
          <div className="w-24 h-1 mx-auto rounded bg-[var(--primary-color)]"></div>
        </motion.div>

        {filterOptions.length > 0 && (
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveServiceId('all');
                setLightboxIndex(null);
              }}
              className={`border px-5 py-2 text-sm font-medium transition ${
                activeServiceId === 'all'
                  ? 'border-[var(--primary-color)] bg-[var(--primary-color)] text-white'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]'
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
                className={`border px-5 py-2 text-sm font-medium transition ${
                  activeServiceId === service.id
                    ? 'border-[var(--primary-color)] bg-[var(--primary-color)] text-white'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]'
                }`}
                style={{ borderRadius: 'var(--btn-radius)' }}
              >
                {service.title}
              </button>
            ))}
          </div>
        )}
        
        {images.length === 0 ? (
          <p className="text-center text-stone-500">{t('gallery.empty')}</p>
        ) : (
          <motion.div 
            initial={themeData.animationStyle === 'reveal' ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {variant === 'grid' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {images.map((image, i) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className={`relative block aspect-square w-full overflow-hidden group shadow-sm ${radiusClass}`}
                    aria-label={`${openImageLabel}: ${image.altText}`}
                  >
                    <CmsImage
                      image={image}
                      alt={image.altText}
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      fill
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </button>
                ))}
              </div>
            )}
            {variant === 'masonry' && (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 max-w-6xl mx-auto space-y-4">
                {images.map((image, i) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className={`relative block w-full overflow-hidden group shadow-sm break-inside-avoid ${radiusClass}`}
                    style={{ aspectRatio: i % 3 === 0 ? '3/4' : i % 2 === 0 ? '4/3' : '1/1' }}
                    aria-label={`${openImageLabel}: ${image.altText}`}
                  >
                    <CmsImage
                      image={image}
                      alt={image.altText}
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      fill
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </button>
                ))}
              </div>
            )}
            {variant === 'carousel' && (
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 max-w-6xl mx-auto hide-scrollbar">
                {images.map((image, i) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className={`relative flex-none w-4/5 md:w-1/3 aspect-[4/5] overflow-hidden group shadow-sm snap-center ${radiusClass}`}
                    aria-label={`${openImageLabel}: ${image.altText}`}
                  >
                    <CmsImage
                      image={image}
                      alt={image.altText}
                      sizes="(min-width: 768px) 33vw, 80vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      fill
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
        
        {limit && galleryImages.length > limit && (
          <div className="mt-16 text-center">
            <Link 
              href={localePath('/gallery')} 
              className="inline-block px-8 py-4 font-medium transition-colors bg-[var(--primary-color)] text-white hover:opacity-90 shadow-md"
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
        variant="classic"
      />
    </section>
  );
}
