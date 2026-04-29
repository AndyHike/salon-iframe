'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useLocale } from '../../../components/LocaleContext';
import type { ThemeSectionProps } from '../types';
import { GalleryLightbox } from '../shared/GalleryLightbox';
import {
  buildGalleryImages,
  buildGalleryServiceFilters,
  filterGalleryImages,
} from '../shared/galleryData';
import { parseMinimalThemeData } from './themeData';

export function PhotoGallerySection({ settings, appearance, servicesItems, galleryItems, limit }: ThemeSectionProps) {
  const { locale, t } = useLocale();
  const [activeServiceId, setActiveServiceId] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const variant = appearance.sectionVariants.photoGallery === 'masonry' ? 'masonry' : 'grid';
  const themeData = parseMinimalThemeData(appearance.themeData);
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
  const spacingClass =
    themeData.sectionSpacing === 'compact'
      ? 'py-16 sm:py-20'
      : themeData.sectionSpacing === 'airy'
        ? 'py-28 sm:py-36'
        : 'py-20 sm:py-28';
  const imageRatioClass = themeData.galleryImageRatio === 'square' ? 'aspect-square' : 'aspect-[4/5]';
  const openImageLabel = t('gallery.openImage');

  return (
    <section id="photoGallery" className={`bg-[#f7f7f3] ${spacingClass} text-stone-950`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mb-12 flex flex-col gap-5 border-t border-stone-300 pt-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <h2 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            {t('gallery.title')}
          </h2>
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
            Selected work
          </span>
        </motion.div>

        {filterOptions.length > 1 && (
          <div className="mb-10 flex flex-wrap gap-2 border-y border-stone-300 py-4">
            <button
              type="button"
              onClick={() => {
                setActiveServiceId('all');
                setLightboxIndex(null);
              }}
              className={`border px-4 py-2 text-sm font-semibold transition ${
                activeServiceId === 'all'
                  ? 'border-stone-950 bg-stone-950 text-white'
                  : 'border-stone-300 bg-white text-stone-600 hover:border-stone-950 hover:text-stone-950'
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
                className={`border px-4 py-2 text-sm font-semibold transition ${
                  activeServiceId === service.id
                    ? 'border-stone-950 bg-stone-950 text-white'
                    : 'border-stone-300 bg-white text-stone-600 hover:border-stone-950 hover:text-stone-950'
                }`}
                style={{ borderRadius: 'var(--btn-radius)' }}
              >
                {service.title}
              </button>
            ))}
          </div>
        )}

        {images.length === 0 ? (
          <p className="border-y border-stone-300 py-8 text-stone-500">{t('gallery.empty')}</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {variant === 'grid' ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className={`relative block w-full ${imageRatioClass} overflow-hidden bg-stone-200`}
                    aria-label={`${openImageLabel}: ${image.altText}`}
                  >
                    <Image
                      src={image.filePath}
                      alt={image.altText}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover transition duration-700 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className="relative mb-3 block w-full break-inside-avoid overflow-hidden bg-stone-200 md:mb-4"
                    style={{
                      aspectRatio:
                        themeData.galleryImageRatio === 'square'
                          ? '1 / 1'
                          : index % 3 === 0
                            ? '4 / 5'
                            : index % 2 === 0
                              ? '1 / 1'
                              : '5 / 4',
                    }}
                    aria-label={`${openImageLabel}: ${image.altText}`}
                  >
                    <Image
                      src={image.filePath}
                      alt={image.altText}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="object-cover transition duration-700 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {limit && galleryImages.length > limit && (
          <div className="mt-12">
            <Link
              href="/gallery"
              className="inline-flex border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-950 transition hover:border-stone-950"
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
        variant="minimal"
      />
    </section>
  );
}
