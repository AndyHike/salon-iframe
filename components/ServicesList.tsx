'use client';

import { SiteData } from '@/lib/getSiteData';
import { StoreData } from '@/lib/api';
import Link from 'next/link';
import { useLocale } from './LocaleContext';
import { motion } from 'motion/react';

export function ServicesList({ siteData, storeData, limit }: { siteData: SiteData; storeData: StoreData; limit?: number }) {
  let servicesData = storeData.servicesData || [];
  if (limit) {
    servicesData = servicesData.slice(0, limit);
  }
  const { locale, t } = useLocale();
  
  // @ts-ignore - servicesLayout might not be in the type yet
  const layout = siteData.servicesLayout || 'list';

  const getTitle = (obj: any) => obj?.title?.[locale] || obj?.title?.en || obj?.title?.uk || '';
  const getDescription = (obj: any) => obj?.description?.[locale] || obj?.description?.en || obj?.description?.uk || '';

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
        
        {servicesData.length === 0 ? (
          <p className="text-center text-stone-500">{t('services.empty')}</p>
        ) : (
          <div className={`max-w-7xl mx-auto ${layout === 'grid' || layout === 'cards' ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : 'space-y-16'}`}>
            {servicesData.map((group: any, index: number) => (
              <motion.div 
                key={group.category?.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`
                  ${layout === 'cards' ? 'bg-white p-8 rounded-3xl shadow-sm border border-stone-100' : ''}
                  ${layout === 'grid' ? 'bg-transparent' : ''}
                  ${layout === 'list' ? 'max-w-4xl mx-auto' : ''}
                  ${layout === 'compact' ? 'max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-stone-100' : ''}
                `}
              >
                {group.category?.title && (
                  <h3 className={`text-2xl md:text-3xl font-serif text-stone-800 mb-8 flex items-center gap-4 ${layout === 'compact' ? 'border-b border-stone-100 pb-4' : ''}`}>
                    {getTitle(group.category)}
                  </h3>
                )}
                
                <div className={`
                  ${layout === 'grid' ? 'grid grid-cols-1 gap-6' : 'space-y-6'}
                  ${layout === 'compact' ? 'space-y-4' : ''}
                `}>
                  {group.items.map((service: any) => (
                    <div 
                      key={service.id} 
                      className={`
                        flex flex-col group/item transition-all duration-300
                        ${layout === 'cards' ? 'p-4 hover:bg-stone-50 rounded-2xl' : ''}
                        ${layout === 'compact' ? 'border-b border-stone-50 last:border-0 pb-4 last:pb-0' : ''}
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
            ))}
          </div>
        )}
        
        {limit && storeData.servicesData && storeData.servicesData.length > limit && (
          <div className="mt-16 text-center">
            <Link 
              href="/services" 
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
