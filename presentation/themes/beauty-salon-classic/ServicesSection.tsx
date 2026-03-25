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
  const variant = appearance.sectionVariants.services || 'cards';
  const themeData = parseThemeData(appearance.themeData);
  
  let displayItems = servicesItems;
  if (limit) displayItems = displayItems.slice(0, limit);

  const getTitle = (item: CmsItem) => resolveLocalizedText(item.title, locale);
  const getDescription = (item: CmsItem) => resolveLocalizedText(item.description, locale);

  const isPaper = themeData.surfaceStyle === 'paper';
  const surfaceClass = isPaper ? 'shadow-md border-2 border-stone-200 bg-[#fdfbf7]' : 'shadow-sm border border-stone-100 bg-white';
  const spacingClass = themeData.sectionSpacing === 'airy' ? 'py-32' : 'py-24';

  type ServiceGroup = { title: string; items: CmsItem[] };
  const groups: ServiceGroup[] = [];
  const baseItems: CmsItem[] = [];
  const subGroupsMap: Record<string, ServiceGroup> = {};
  let baseTitleStr = '';

  displayItems.forEach(item => {
    if (!item.categories || item.categories.length === 0) {
      baseItems.push(item);
      return;
    }
    const isBase = item.categories.some(c => c.slug === 'services');
    if (isBase) {
      baseItems.push(item);
      if (!baseTitleStr) {
        const cat = item.categories.find(c => c.slug === 'services');
        const tObj = cat?.title as Record<string, string>;
        baseTitleStr = tObj?.[locale] || tObj?.['uk'] || tObj?.['en'] || 'services';
      }
      return;
    }
    const primaryCat = item.categories[0];
    const catSlug = primaryCat.slug;
    const catTitleObj = primaryCat.title as Record<string, string>;
    const catTitleStr = catTitleObj?.[locale] || catTitleObj?.['uk'] || catTitleObj?.['en'] || catSlug;

    if (!subGroupsMap[catSlug]) {
      subGroupsMap[catSlug] = { title: catTitleStr, items: [] };
    }
    subGroupsMap[catSlug].items.push(item);
  });

  if (baseItems.length > 0) {
    groups.push({ title: baseTitleStr || t('services.baseCategories'), items: baseItems });
  }
  Object.values(subGroupsMap).forEach(g => groups.push(g));

  return (
    <section id="services" className={`${spacingClass} bg-stone-50`}>
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
          <div className="max-w-7xl mx-auto space-y-20">
            {groups.map((group, idx) => (
              <div key={idx} className="w-full">
                {group.title && (
                  <h3 className="text-2xl md:text-3xl font-serif text-stone-800 mb-8 text-center">{group.title}</h3>
                )}
                <motion.div 
                  initial={themeData.animationStyle === 'reveal' ? { opacity: 0, scale: 0.95 } : { opacity: 0, y: 20 }}
                  whileInView={themeData.animationStyle === 'reveal' ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`
                    ${variant === 'cards' ? `${surfaceClass} p-8 rounded-3xl` : ''}
                    ${variant === 'grid' ? 'bg-transparent' : ''}
                    ${variant === 'list' ? 'max-w-4xl mx-auto' : ''}
                    ${variant === 'compact' ? `max-w-4xl mx-auto ${surfaceClass} p-6 md:p-10 rounded-3xl` : ''}
                    w-full
                  `}
                >
                  <div className={`
                    ${variant === 'grid' || variant === 'cards' ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : 'flex flex-col space-y-6'}
                    ${variant === 'compact' ? '!space-y-4' : ''}
                  `}>
                    {group.items.map((service) => (
                      <div 
                        key={service.id} 
                        className={`
                          flex flex-col group/item transition-all duration-300 w-full
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
