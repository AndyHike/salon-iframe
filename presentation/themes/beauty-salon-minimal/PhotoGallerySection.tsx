'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useLocale } from '../../../components/LocaleContext';
import type { ThemeSectionProps } from '../types';
import { parseMinimalThemeData } from './themeData';

export function PhotoGallerySection({ appearance, galleryItems, limit }: ThemeSectionProps) {
  const { t } = useLocale();
  const variant = appearance.sectionVariants.photoGallery === 'masonry' ? 'masonry' : 'grid';
  const themeData = parseMinimalThemeData(appearance.themeData);
  const allImages = galleryItems.flatMap((item) => item.images || []);
  const images = limit ? allImages.slice(0, limit) : allImages;
  const spacingClass =
    themeData.sectionSpacing === 'compact'
      ? 'py-16 sm:py-20'
      : themeData.sectionSpacing === 'airy'
        ? 'py-28 sm:py-36'
        : 'py-20 sm:py-28';
  const imageRatioClass = themeData.galleryImageRatio === 'square' ? 'aspect-square' : 'aspect-[4/5]';

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
                  <div
                    key={image.id || index}
                    className={`relative ${imageRatioClass} overflow-hidden bg-stone-200`}
                  >
                    <Image
                      src={image.filePath || `https://picsum.photos/seed/minimal-gallery-${index}/800/1000`}
                      alt={image.altText || `Gallery image ${index + 1}`}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover transition duration-700 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
                {images.map((image, index) => (
                  <div
                    key={image.id || index}
                    className="relative mb-3 break-inside-avoid overflow-hidden bg-stone-200 md:mb-4"
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
                  >
                    <Image
                      src={image.filePath || `https://picsum.photos/seed/minimal-gallery-${index}/900/900`}
                      alt={image.altText || `Gallery image ${index + 1}`}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="object-cover transition duration-700 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {limit && allImages.length > limit && (
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
    </section>
  );
}
