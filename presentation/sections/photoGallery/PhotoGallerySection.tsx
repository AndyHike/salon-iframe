'use client';

import { useLocale } from '../../../components/LocaleContext';
import { AppearanceContract, CmsItem, CmsSettingsResponse } from '../../../cms/types';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

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
  const variant = appearance.sectionVariants.photoGallery || 'masonry';
  
  // Extract all images from gallery items
  let images = galleryItems.flatMap(item => item.images || []);
  if (limit) {
    images = images.slice(0, limit);
  }

  return (
    <section id="gallery" className="py-24 bg-white">
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
        
        {images.length === 0 ? (
          <p className="text-center text-stone-500">{t('gallery.empty')}</p>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {variant === 'grid' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {images.map((image, i) => (
                  <div key={image.id || i} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
                    <Image
                      src={image.filePath || `https://picsum.photos/seed/gallery-${i}/600/600`}
                      alt={image.altText || `Gallery image ${i}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
            )}
            {variant === 'masonry' && (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 max-w-6xl mx-auto space-y-4">
                {images.map((image, i) => (
                  <div key={image.id || i} className="relative rounded-xl overflow-hidden group shadow-sm break-inside-avoid" style={{ aspectRatio: i % 3 === 0 ? '3/4' : i % 2 === 0 ? '4/3' : '1/1' }}>
                    <Image
                      src={image.filePath || `https://picsum.photos/seed/gallery-${i}/600/600`}
                      alt={image.altText || `Gallery image ${i}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
            )}
            {variant === 'carousel' && (
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 max-w-6xl mx-auto hide-scrollbar">
                {images.map((image, i) => (
                  <div key={image.id || i} className="relative flex-none w-4/5 md:w-1/3 aspect-[4/5] rounded-xl overflow-hidden group shadow-sm snap-center">
                    <Image
                      src={image.filePath || `https://picsum.photos/seed/gallery-${i}/600/600`}
                      alt={image.altText || `Gallery image ${i}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
        
        {limit && galleryItems.flatMap(item => item.images || []).length > limit && (
          <div className="mt-16 text-center">
            <Link 
              href="/gallery" 
              className="inline-block px-8 py-4 rounded-full font-medium transition-colors bg-stone-900 text-white hover:bg-stone-800"
            >
              {t('gallery.viewAll')}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
