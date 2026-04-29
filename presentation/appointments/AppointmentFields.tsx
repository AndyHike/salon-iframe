'use client';

import { useMemo, useState } from 'react';
import { useLocale } from '../../components/LocaleContext';
import type { CmsItem, CmsSettingsResponse } from '../../cms/types';
import {
  createAppointmentServiceSelection,
  type AppointmentServiceSelection,
} from './serviceRequest';

type AppointmentFieldVariant = 'soft' | 'minimal' | 'editorial';

type AppointmentFieldsProps = {
  servicesItems: CmsItem[];
  settings: CmsSettingsResponse['data'];
  selectedService?: AppointmentServiceSelection | null;
  variant?: AppointmentFieldVariant;
};

const variantClasses: Record<AppointmentFieldVariant, {
  label: string;
  input: string;
  grid: string;
}> = {
  soft: {
    label: 'block text-sm font-medium text-stone-700 mb-1',
    input: 'w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all bg-white',
    grid: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  },
  minimal: {
    label: 'grid gap-2 text-sm font-medium text-stone-600',
    input: 'border border-stone-300 bg-white px-4 py-3 text-base text-stone-950 outline-none transition focus:border-stone-950',
    grid: 'grid grid-cols-1 sm:grid-cols-2 gap-5',
  },
  editorial: {
    label: 'block text-xs uppercase tracking-widest text-stone-500 mb-2',
    input: 'w-full bg-transparent border-b border-stone-300 py-3 focus:outline-none focus:border-stone-900 transition-colors text-lg',
    grid: 'grid grid-cols-1 sm:grid-cols-2 gap-8',
  },
};

function HiddenInput({ name, value }: { name: string; value: string | number | undefined }) {
  if (value === undefined || value === '') return null;
  return <input type="hidden" name={name} value={value} />;
}

export function AppointmentFields({
  servicesItems,
  settings,
  selectedService,
  variant = 'soft',
}: AppointmentFieldsProps) {
  const { locale, t } = useLocale();
  const defaultLocale = settings.defaultLocale || 'uk';
  const classes = variantClasses[variant];
  const [selectedServiceId, setSelectedServiceId] = useState(selectedService?.serviceId ?? '');
  const [preferredTime, setPreferredTime] = useState('');
  const timezone = 'Europe/Prague';

  const serviceSelection = useMemo(() => {
    if (!selectedServiceId) return null;

    const service = servicesItems.find((item) => item.id === selectedServiceId);
    if (!service) return selectedService ?? null;

    const source = selectedService?.serviceId === selectedServiceId
      ? selectedService.source
      : 'contact_form';

    return createAppointmentServiceSelection(
      service,
      locale,
      defaultLocale,
      source,
      t('services.priceOnRequest'),
    );
  }, [defaultLocale, locale, selectedService, selectedServiceId, servicesItems, t]);

  const fieldWrapperClass = variant === 'minimal' ? '' : 'space-y-1';

  return (
    <>
      <HiddenInput name="locale" value={locale} />
      <HiddenInput name="source" value={serviceSelection?.source ?? 'contact_form'} />
      <HiddenInput name="timezone" value={timezone} />
      <HiddenInput name="serviceTitle" value={serviceSelection?.serviceTitle} />
      <HiddenInput name="servicePrice" value={serviceSelection?.servicePrice} />
      <HiddenInput name="serviceDurationMinutes" value={serviceSelection?.serviceDurationMinutes} />
      <HiddenInput name="categoryId" value={serviceSelection?.categoryId} />
      <HiddenInput name="categoryTitle" value={serviceSelection?.categoryTitle} />

      <div className={fieldWrapperClass}>
        <label htmlFor="serviceId" className={classes.label}>
          {t('contacts.formService')}
        </label>
        <select
          id="serviceId"
          name="serviceId"
          value={selectedServiceId}
          onChange={(event) => setSelectedServiceId(event.currentTarget.value)}
          className={classes.input}
          data-appointment-service-select
        >
          <option value="">{t('contacts.formServicePlaceholder')}</option>
          {selectedService && !servicesItems.some((service) => service.id === selectedService.serviceId) && (
            <option value={selectedService.serviceId}>{selectedService.serviceTitle}</option>
          )}
          {servicesItems.map((service) => {
            const snapshot = createAppointmentServiceSelection(
              service,
              locale,
              defaultLocale,
              'contact_form',
              t('services.priceOnRequest'),
            );

            return (
              <option key={service.id} value={service.id}>
                {snapshot.serviceTitle}
              </option>
            );
          })}
        </select>
      </div>

      <div className={classes.grid}>
        <div className={fieldWrapperClass}>
          <label htmlFor="preferredDate" className={classes.label}>
            {t('contacts.formPreferredDate')}
          </label>
          <input
            type="date"
            id="preferredDate"
            name="preferredDate"
            required={Boolean(preferredTime)}
            className={classes.input}
          />
        </div>
        <div className={fieldWrapperClass}>
          <label htmlFor="preferredTime" className={classes.label}>
            {t('contacts.formPreferredTime')}
          </label>
          <input
            type="time"
            id="preferredTime"
            name="preferredTime"
            value={preferredTime}
            onChange={(event) => setPreferredTime(event.currentTarget.value)}
            className={classes.input}
          />
        </div>
      </div>
    </>
  );
}
