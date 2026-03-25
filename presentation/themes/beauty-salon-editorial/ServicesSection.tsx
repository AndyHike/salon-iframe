'use client';

import { useLocale } from '../../../components/LocaleContext';
import { AppearanceContract, CmsItem, CmsSettingsResponse } from '../../../cms/types';
import { resolveLocalizedText } from '../../../cms/normalize/localized';
import { motion } from 'motion/react';
import Link from 'next/link';
import { parseThemeData } from '../../theme-data/parser';

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
  const variant = appearance.sectionVariants.services || 'list';
  const themeData = parseThemeData(appearance.themeData);
  
  let displayItems = servicesItems;
  if (limit) displayItems = displayItems.slice(0, limit);

  const getTitle = (item: CmsItem) => resolveLocalizedText(item.title, locale);
  const getDescription = (item: CmsItem) => resolveLocalizedText(item.description, locale);

  const isPaper = themeData.surfaceStyle === 'paper';
  // Editorial uses sharper aesthetics
  const surfaceClass = isPaper ? 'border border-stone-300 bg-[#fdfbf7]' : 'border border-stone-200 bg-white';
  const spacingClass = themeData.sectionSpacing === 'airy' ? 'py-32' : 'py-20';

  type ServiceGroup = { title: string; items: CmsItem[] };
  const groups: ServiceGroup[] = [];
  const baseItems: CmsItem[] = [];
  const subGroupsMap: Record<string, ServiceGroup> = {};
  let baseTitleStr = '';

  displayItems.forEach(item => {
    if (!item.categories || item.categories.length === 0) {
      if (!baseItems.includes(item)) baseItems.push(item);
      return;
    }
    
    let addedToBase = false;

    item.categories.forEach(cat => {
      if (cat.slug === 'services') {
        if (!addedToBase) {
          baseItems.push(item);
          addedToBase = true;
          if (!baseTitleStr) {
            const tObj = cat?.title as Record<string, string>;
            baseTitleStr = tObj?.[locale] || tObj?.['uk'] || tObj?.['en'] || 'services';
          }
        }
      } else {
        const catSlug = cat.slug;
        const catTitleObj = cat.title as Record<string, string>;
        const catTitleStr = catTitleObj?.[locale] || catTitleObj?.['uk'] || catTitleObj?.['en'] || catSlug;

        if (!subGroupsMap[catSlug]) {
          subGroupsMap[catSlug] = { title: catTitleStr, items: [] };
        }
        if (!subGroupsMap[catSlug].items.includes(item)) {
          subGroupsMap[catSlug].items.push(item);
        }
      }
    });
  });

  if (baseItems.length > 0) {
    groups.push({ title: baseTitleStr || t('services.baseCategories'), items: baseItems });
  }
  Object.values(subGroupsMap).forEach(g => {
    if (g.items.length > 0) groups.push(g);
  });

  return (
    <section id="services" className={`${spacingClass} bg-stone-50 border-t border-stone-200`}>
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col lg:flex-row items-baseline justify-between mb-20 border-b border-stone-300 pb-6"
        >
          <h2 className="text-5xl md:text-7xl font-serif text-stone-900 tracking-tighter uppercase">{t('services.title')}</h2>
          <span className="hidden lg:block text-sm font-medium tracking-widest uppercase text-[var(--primary-color)] mt-4 lg:mt-0">
            {domain}
          </span>
        </motion.div>
        
        {displayItems.length === 0 ? (
          <p className="text-center text-stone-500 uppercase tracking-widest text-sm">{t('services.empty')}</p>
        ) : (
          <div className="max-w-7xl mx-auto space-y-32">
            {groups.map((group, idx) => (
              <div key={idx} className="w-full">
                {group.title && (
                  <div className="mb-12 w-full border-t-2 border-stone-900 pt-6">
                    <h3 className="text-4xl md:text-5xl font-serif text-stone-900 uppercase tracking-tighter">{group.title}</h3>
                  </div>
                )}
                <motion.div 
                  initial={themeData.animationStyle === 'reveal' ? { opacity: 0, y: 40 } : { opacity: 0, y: 20 }}
                  whileInView={themeData.animationStyle === 'reveal' ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className={`
                    ${variant === 'cards' ? `${surfaceClass} p-8 md:p-12` : ''}
                    ${variant === 'grid' ? 'bg-transparent' : ''}
                    ${variant === 'list' ? 'max-w-5xl mx-auto' : ''}
                    ${variant === 'compact' ? `max-w-4xl mx-auto ${surfaceClass} p-8` : ''}
                    w-full
                  `}
                >
                  <div className={`
                    ${variant === 'grid' || variant === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16' : ''}
                    ${variant === 'list' ? 'space-y-12' : ''}
                    ${variant === 'compact' ? 'space-y-0' : ''}
                  `}>
                    {group.items.map((service, serviceIdx) => (
                      <div 
                        key={`${service.id}-${serviceIdx}`} 
                        className={`
                          flex flex-col group/item
                          ${variant === 'compact' ? 'border-b border-stone-200 py-6 last:border-0' : ''}
                          ${variant === 'list' ? 'border-b border-stone-200 pb-12 last:border-0' : ''}
                        `}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-3 w-full">
                          <h4 className="text-2xl font-serif text-stone-900 group-hover/item:text-[var(--primary-color)] transition-colors mb-2 sm:mb-0">
                            {getTitle(service)}
                          </h4>
                          <span className="text-lg font-medium text-stone-900 tracking-wider">
                            {service.price ? `${service.price} ₴` : t('services.priceOnRequest')}
                          </span>
                        </div>
                        {getDescription(service) && (
                          <p className="text-stone-500 font-light text-base md:text-lg max-w-2xl leading-relaxed">
                            {getDescription(service)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
