'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Phone, Tag } from 'lucide-react';
import { resolveLocalizedText } from '@/cms/normalize/localized';
import type { AppearanceContract, CmsItem, CmsSettingsResponse } from '@/cms/types';
import { useLocale } from '@/components/LocaleContext';
import { serviceDetailHref } from '@/lib/routes';
import { formatServicePrice, getServiceDurationMinutes, getServiceImageList } from '@/lib/service-data';
import { buildServiceH1, getBusinessName, getBusinessType, getLocationLabel } from '@/lib/seo';
import { ServiceRequestAction } from '@/presentation/appointments/ServiceRequestAction';

type ServiceDetailPageProps = {
  settings: CmsSettingsResponse['data'];
  appearance: AppearanceContract;
  serviceItem: CmsItem;
};

function getPrimaryCategory(item: CmsItem): Record<string, string> | null {
  const category = item.categories?.find((entry) => entry.slug !== 'services') || item.categories?.[0];
  if (!category) return null;

  return category.title as Record<string, string>;
}

function imageAlt(item: CmsItem, serviceTitle: string, businessName: string, location: string, index: number): string {
  const image = getServiceImageList(item)[index];
  if (image?.altText) return image.altText;

  return [serviceTitle, businessName, location].filter(Boolean).join(', ') || `Service image ${index + 1}`;
}

export function ServiceDetailPage({
  settings,
  serviceItem,
}: ServiceDetailPageProps) {
  const { locale, t } = useLocale();
  const defaultLocale = settings.defaultLocale || 'uk';
  const businessName = getBusinessName(settings);
  const businessType = getBusinessType(settings);
  const location = getLocationLabel(settings);
  const serviceTitle = resolveLocalizedText(serviceItem.title, locale, defaultLocale);
  const description = resolveLocalizedText(serviceItem.description, locale, defaultLocale);
  const content = resolveLocalizedText(serviceItem.content, locale, defaultLocale);
  const category = resolveLocalizedText(getPrimaryCategory(serviceItem), locale, defaultLocale);
  const duration = getServiceDurationMinutes(serviceItem);
  const images = getServiceImageList(serviceItem);
  const primaryImage = images[0];
  const h1 = buildServiceH1(serviceTitle, settings, locale);

  return (
    <section className="bg-[#f7f7f3] px-5 pb-20 pt-28 text-stone-950 sm:px-8 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/services"
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-[var(--primary-color)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t('nav.services')}
        </Link>

        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
              {businessType}
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight text-stone-950 sm:text-6xl">
              {h1}
            </h1>
            {description && (
              <p className="mt-8 max-w-2xl text-lg leading-8 text-stone-600">
                {description}
              </p>
            )}

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <div className="border border-stone-200 bg-white p-5">
                <span className="mb-3 flex h-9 w-9 items-center justify-center bg-stone-100 text-[var(--primary-color)]">
                  <Tag className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-sm font-semibold text-stone-500">{category || businessName}</p>
                <p className="mt-1 text-xl font-semibold text-stone-950">
                  {formatServicePrice(serviceItem, t('services.priceOnRequest'))}
                </p>
              </div>

              {duration && (
                <div className="border border-stone-200 bg-white p-5">
                  <span className="mb-3 flex h-9 w-9 items-center justify-center bg-stone-100 text-[var(--primary-color)]">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-semibold text-stone-500">{t('contacts.hours')}</p>
                  <p className="mt-1 text-xl font-semibold text-stone-950">{duration} min</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ServiceRequestAction
                service={serviceItem}
                label={t('services.requestService')}
                className="inline-flex items-center justify-center gap-2 bg-[var(--primary-color)] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
              />
              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center justify-center gap-2 border border-stone-300 bg-white px-6 py-4 text-sm font-semibold text-stone-950 transition hover:border-stone-950"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {settings.phone}
                </a>
              )}
            </div>

            {(settings.address || location) && (
              <div className="mt-10 grid grid-cols-[auto_1fr] gap-4 border-t border-stone-300 pt-8 text-stone-700">
                <MapPin className="mt-1 h-5 w-5 text-[var(--primary-color)]" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                    {t('contacts.address')}
                  </p>
                  <p className="mt-2 text-base font-medium text-stone-950">{settings.address || location}</p>
                  {settings.addressUrl && (
                    <a
                      href={settings.addressUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex text-sm font-semibold text-[var(--primary-color)] hover:opacity-80"
                    >
                      Google Maps
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-6">
            {primaryImage ? (
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-200">
                <Image
                  src={primaryImage.filePath}
                  alt={imageAlt(serviceItem, serviceTitle, businessName, location, 0)}
                  fill
                  priority
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center bg-stone-200 p-10 text-center text-stone-500">
                {serviceTitle}
              </div>
            )}

            {content && (
              <div className="border border-stone-200 bg-white p-6 text-base leading-8 text-stone-600 sm:p-8">
                <p className="whitespace-pre-line">{content}</p>
              </div>
            )}

            {images.length > 1 && (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {images.slice(1, 7).map((image, index) => (
                  <Link
                    key={image.id || image.filePath || index}
                    href={serviceDetailHref(serviceItem.slug)}
                    className="relative aspect-square overflow-hidden bg-stone-200"
                    aria-label={serviceTitle}
                  >
                    <Image
                      src={image.filePath}
                      alt={imageAlt(serviceItem, serviceTitle, businessName, location, index + 1)}
                      fill
                      sizes="(min-width: 768px) 16vw, 50vw"
                      className="object-cover transition duration-700 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
