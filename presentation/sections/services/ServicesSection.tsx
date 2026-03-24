'use client';

import { useLocale } from '../../../components/LocaleContext';
import { AppearanceContract, CmsItem, CmsSettingsResponse } from '../../../cms/types';
import { resolveLocalizedText } from '../../../cms/normalize/localized';
import { motion } from 'motion/react';
import Link from 'next/link';

export function ServicesSection({ 
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
  const { locale, t } = useLocale();
  const variant = appearance.sectionVariants.services || 'cards';
  
  // For now, we assume servicesItems is a flat list or grouped by some logic.
  // We will group them by category if parentId exists, or just display them flat.
  // The prompt says: "Не фільтруй services/gallery по item.type; джерело істини для homepage секцій зараз це categorySlug=services і categorySlug=gallery."
  // So we just display the items we get.

  let displayItems = servicesItems;
  if (limit) {
    displayItems = displayItems.slice(0, limit);
  }

  const getTitle = (item: CmsItem) => resolveLocalizedText(item.title, locale);
  const getDescription = (item: CmsItem) => resolveLocalizedText(item.description, locale);

  return (
    <section id="services" className="py-24 bg-stone-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">{t('services.title')}</h2>
          <div className="w-24 h-1 mx-auto rounded bg-[var(--primary-color)]"></div>
        </motion.div>
        
        {displayItems.length === 0 ? (
          <p className="text-center text-stone-500">{t('services.empty')}</p>
        ) : (
          <div className={`max-w-7xl mx-auto ${variant === 'grid' || variant === 'cards' ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : 'space-y-16'}`}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`
                ${variant === 'cards' ? 'bg-white p-8 rounded-3xl shadow-sm border border-stone-100' : ''}
                ${variant === 'grid' ? 'bg-transparent' : ''}
                ${variant === 'list' ? 'max-w-4xl mx-auto' : ''}
                ${variant === 'compact' ? 'max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-stone-100' : ''}
                w-full
              `}
            >
              <div className={`
                ${variant === 'grid' ? 'grid grid-cols-1 gap-6' : 'space-y-6'}
                ${variant === 'compact' ? 'space-y-4' : ''}
              `}>
                {displayItems.map((service) => (
                  <div 
                    key={service.id} 
                    className={`
                      flex flex-col group/item transition-all duration-300
                      ${variant === 'cards' ? 'p-4 hover:bg-stone-50 rounded-2xl' : ''}
                      ${variant === 'compact' ? 'border-b border-stone-50 last:border-0 pb-4 last:pb-0' : ''}
                    `}
                  >
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="text-lg md:text-xl font-medium text-stone-900 group-hover/item:text-[var(--primary-color)] transition-colors">
                        {getTitle(service)}
                      </h4>
                      <div className="flex-grow border-b-2 border-dotted border-stone-200 mx-4 opacity-40"></div>
                      <span className="text-lg md:text-xl font-semibold text-stone-900 whitespace-nowrap">
                        {service.price ? `${service.price} ₴` : t('services.priceOnRequest')}
                      </span>
                    </div>
                    {getDescription(service) && (
                      <p className="text-stone-500 text-sm md:text-base pr-16 leading-relaxed">
                        {getDescription(service)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
        
        {limit && servicesItems.length > limit && (
          <div className="mt-16 text-center">
            <Link 
              href={`/${domain}/services`} 
              className="inline-block px-8 py-4 rounded-full font-medium transition-colors bg-stone-900 text-white hover:bg-stone-800"
            >
              {t('services.viewAll')}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
