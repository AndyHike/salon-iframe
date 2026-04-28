'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { resolveLocalizedText } from '../../../cms/normalize/localized';
import { useLocale } from '../../../components/LocaleContext';
import { ServiceRequestAction } from '../../appointments/ServiceRequestAction';
import { serviceDetailHref } from '../../../lib/routes';
import type { CmsItem } from '../../../cms/types';
import type { ThemeSectionProps } from '../types';
import { parseMinimalThemeData } from './themeData';

function formatPrice(item: CmsItem, fallback: string): string {
  if (item.price === null || item.price === undefined || item.price === '') {
    return fallback;
  }

  return String(item.price);
}

export function ServicesSection({ settings, appearance, servicesItems, limit, onRequestService }: ThemeSectionProps) {
  const { locale, t } = useLocale();
  const defaultLocale = settings.defaultLocale || 'uk';
  const variant = appearance.sectionVariants.services === 'cards' ? 'cards' : 'list';
  const themeData = parseMinimalThemeData(appearance.themeData);
  const displayItems = limit ? servicesItems.slice(0, limit) : servicesItems;
  const spacingClass =
    themeData.sectionSpacing === 'compact'
      ? 'py-16 sm:py-20'
      : themeData.sectionSpacing === 'airy'
        ? 'py-28 sm:py-36'
        : 'py-20 sm:py-28';
  const cardPaddingClass = themeData.serviceDensity === 'compact' ? 'p-5 sm:p-6' : 'p-6 sm:p-7';
  const listPaddingClass = themeData.serviceDensity === 'compact' ? 'py-5' : 'py-7';

  return (
    <section id="services" className={`bg-white ${spacingClass} text-stone-950`}>
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
                      ? `border border-stone-200 bg-[#fbfaf7] ${cardPaddingClass} transition hover:border-stone-400`
                      : `grid gap-4 ${listPaddingClass} transition hover:bg-[#fbfaf7] sm:grid-cols-[1fr_auto] sm:items-start`
                  }
                >
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-stone-950">
                      <Link href={serviceDetailHref(service.slug)} className="hover:text-[var(--primary-color)]">
                        {title}
                      </Link>
                    </h3>
                    {description && (
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">{description}</p>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[var(--primary-color)] sm:pt-1">
                    {formatPrice(service, t('services.priceOnRequest'))}
                  </p>
                  <div className={variant === 'cards' ? 'mt-5 md:col-span-2' : 'sm:col-span-2'}>
                    <ServiceRequestAction
                      service={service}
                      label={t('services.requestService')}
                      onRequestService={onRequestService}
                      className="inline-flex items-center gap-2 border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:border-stone-950"
                    />
                  </div>
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
