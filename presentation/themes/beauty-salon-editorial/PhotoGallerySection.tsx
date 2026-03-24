'use client';

import { useLocale } from '../../../components/LocaleContext';
import { AppearanceContract, CmsItem, CmsSettingsResponse } from '../../../cms/types';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { parseThemeData } from '../../theme-data/parser';

export function PhotoGallerySection({ 
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
  const variant = appearance.sectionVariants.photoGallery || 'grid';
  const themeData = parseThemeData(appearance.themeData);
  
  let images = galleryItems.flatMap(item => item.images || []);
  if (limit) images = images.slice(0, limit);

  // default to framed for editorial unless explicitly overridden
  const isFramed = themeData.galleryChrome !== 'rounded';
  const radiusClass = isFramed ? 'rounded-none border border-stone-200 p-2 md:p-4 bg-white' : 'rounded-none';
  const spacingClass = themeData.sectionSpacing === 'airy' ? 'py-32' : 'py-20';

  return (
    <section id="gallery" className={`${spacingClass} bg-stone-50 border-t border-stone-200`}>
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
             SCENE
          </span>
        </motion.div>
        
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
                  <div key={image.id || i} className={`relative aspect-[3/4] group ${radiusClass}`}>
                    <div className="relative w-full h-full overflow-hidden bg-stone-100 object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
                      <Image
                        src={image.filePath || `https://picsum.photos/seed/gallery-${i}/600/800`}
                        alt={image.altText || `Gallery image ${i}`}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {variant === 'masonry' && (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 max-w-7xl mx-auto space-y-8">
                {images.map((image, i) => (
                  <div key={image.id || i} className={`relative group break-inside-avoid ${radiusClass}`}>
                    <div className="relative w-full overflow-hidden bg-stone-100 grayscale hover:grayscale-0 transition-all duration-700" style={{ paddingBottom: i % 3 === 0 ? '130%' : i % 2 === 0 ? '75%' : '100%' }}>
                      <Image
                        src={image.filePath || `https://picsum.photos/seed/gallery-${i}/600/600`}
                        alt={image.altText || `Gallery image ${i}`}
                        fill
                        className="object-cover absolute inset-0"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {variant === 'carousel' && (
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 max-w-7xl mx-auto hide-scrollbar">
                {images.map((image, i) => (
                  <div key={image.id || i} className={`relative flex-none w-[85%] md:w-[45%] lg:w-[30%] aspect-[3/4] group snap-center ${radiusClass}`}>
                    <div className="relative w-full h-full overflow-hidden bg-stone-100 grayscale group-hover:grayscale-0 transition-all duration-700">
                      <Image
                        src={image.filePath || `https://picsum.photos/seed/gallery-${i}/600/800`}
                        alt={image.altText || `Gallery image ${i}`}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
        
        {limit && galleryItems.flatMap(item => item.images || []).length > limit && (
          <div className="mt-24 flex justify-center">
            <Link 
              href="/gallery" 
              className="inline-block px-12 py-5 font-medium tracking-widest uppercase transition-all border border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white"
            >
              {t('gallery.viewAll')}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
