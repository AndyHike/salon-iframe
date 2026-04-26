'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { resolveLocalizedText } from '../../../cms/normalize/localized';
import { useLocale } from '../../../components/LocaleContext';
import type { CmsItem } from '../../../cms/types';
import type { ThemeSectionProps } from '../types';

function formatPrice(item: CmsItem, fallback: string): string {
  if (item.price === null || item.price === undefined || item.price === '') {
    return fallback;
  }

  return String(item.price);
}

export function ServicesSection({ settings, appearance, servicesItems, limit }: ThemeSectionProps) {
  const { locale, t } = useLocale();
  const defaultLocale = settings.defaultLocale || 'uk';
  const variant = appearance.sectionVariants.services === 'cards' ? 'cards' : 'list';
  const displayItems = limit ? servicesItems.slice(0, limit) : servicesItems;

  return (
    <section id="services" className="bg-white py-20 text-stone-950 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mb-12 grid gap-5 border-t border-stone-200 pt-8 lg:grid-cols-[0.8fr_1fr] lg:items-end"
        >
          <h2 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            {t('services.title')}
          </h2>
          <p className="max-w-2xl text-base leading-7 text-stone-500 lg:justify-self-end">
            A concise service menu with room for signature rituals, quick treatments, and price clarity.
          </p>
        </motion.div>

        {displayItems.length === 0 ? (
          <p className="border-y border-stone-200 py-8 text-stone-500">{t('services.empty')}</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={
              variant === 'cards'
                ? 'grid grid-cols-1 gap-4 md:grid-cols-2'
                : 'divide-y divide-stone-200 border-y border-stone-200'
            }
          >
            {displayItems.map((service) => {
              const title = resolveLocalizedText(service.title, locale, defaultLocale);
              const description = resolveLocalizedText(service.description, locale, defaultLocale);

              return (
                <article
                  key={service.id}
                  className={
                    variant === 'cards'
                      ? 'border border-stone-200 bg-[#fbfaf7] p-6 transition hover:border-stone-400 sm:p-7'
                      : 'grid gap-4 py-7 transition hover:bg-[#fbfaf7] sm:grid-cols-[1fr_auto] sm:items-start'
                  }
                >
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-stone-950">{title}</h3>
                    {description && (
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">{description}</p>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[var(--primary-color)] sm:pt-1">
                    {formatPrice(service, t('services.priceOnRequest'))}
                  </p>
                </article>
              );
            })}
          </motion.div>
        )}

        {limit && servicesItems.length > limit && (
          <div className="mt-12">
            <Link
              href="/services"
              className="inline-flex border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:border-stone-950"
              style={{ borderRadius: 'var(--btn-radius)' }}
            >
              {t('services.viewAll')}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
