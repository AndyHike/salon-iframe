'use client';

import { CalendarClock, CircleAlert, Clock3, Wrench } from 'lucide-react';
import type { SiteAvailability } from '../cms/types';
import { useLocale } from './LocaleContext';

const availabilityTranslationKeys = {
  STORE_SUSPENDED: {
    eyebrow: 'availability.suspended.eyebrow',
    title: 'availability.suspended.title',
    message: 'availability.suspended.message',
  },
  SITE_MAINTENANCE: {
    eyebrow: 'availability.maintenance.eyebrow',
    title: 'availability.maintenance.title',
    message: 'availability.maintenance.message',
  },
  SITE_TEMPORARILY_CLOSED: {
    eyebrow: 'availability.closed.eyebrow',
    title: 'availability.closed.title',
    message: 'availability.closed.message',
  },
};

function formatUntil(until: string | null, locale: string): string | null {
  if (!until) return null;

  const date = new Date(until);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function AvailabilityScreen({
  availability,
  domain,
}: {
  availability: SiteAvailability;
  domain?: string;
}) {
  const { locale, t } = useLocale();
  const translationKeys = availabilityTranslationKeys[availability.code];
  const message = availability.message || t(translationKeys.message);
  const untilLabel = formatUntil(availability.until, locale);
  const Icon =
    availability.code === 'STORE_SUSPENDED'
      ? CircleAlert
      : availability.code === 'SITE_MAINTENANCE'
        ? Wrench
        : Clock3;

  return (
    <main
      className="min-h-screen bg-[#f6f5f1] text-stone-950"
      data-availability-code={availability.code}
      data-availability-source={availability.source || undefined}
      style={{ '--primary-color': '#111827' } as React.CSSProperties}
    >
      <section className="min-h-screen px-5 py-10 sm:px-8 flex items-center">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1fr_0.45fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-full border border-stone-300 bg-white text-[var(--primary-color)]">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
              {t(translationKeys.eyebrow)}
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-tight text-stone-950 sm:text-6xl lg:text-7xl">
              {t(translationKeys.title)}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl">
              {message}
            </p>
            {untilLabel && (
              <div className="mt-10 inline-flex max-w-full items-center gap-3 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-700 shadow-sm">
                <CalendarClock className="h-4 w-4 shrink-0 text-[var(--primary-color)]" aria-hidden="true" />
                <span>{t('availability.until')}</span>
                <time dateTime={availability.until || undefined} className="font-semibold text-stone-950">
                  {untilLabel}
                </time>
              </div>
            )}
          </div>

          {domain && (
            <aside className="border-t border-stone-300 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">{t('availability.site')}</p>
              <p className="mt-2 break-all text-base font-medium text-stone-900">{domain}</p>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}
