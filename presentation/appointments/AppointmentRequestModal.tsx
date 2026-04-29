'use client';

import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { submitContactForm } from '../../app/actions/contact';
import type { CmsItem, CmsSettingsResponse } from '../../cms/types';
import { useLocale } from '../../components/LocaleContext';
import { createAppointmentServiceSelection } from './serviceRequest';
import { AppointmentFields } from './AppointmentFields';

type AppointmentRequestModalProps = {
  domain: string;
  settings: CmsSettingsResponse['data'];
  service: CmsItem;
  open: boolean;
  onClose: () => void;
};

export function AppointmentRequestModal({
  domain,
  settings,
  service,
  open,
  onClose,
}: AppointmentRequestModalProps) {
  const { locale, t } = useLocale();
  const defaultLocale = settings.defaultLocale || 'uk';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const selectedService = useMemo(() => createAppointmentServiceSelection(
    service,
    locale,
    defaultLocale,
    'services_section',
    t('services.priceOnRequest'),
  ), [defaultLocale, locale, service, t]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(event.currentTarget);
    formData.set('requestType', 'appointment_request');

    try {
      const result = await submitContactForm(domain, formData);
      if (result.success) {
        setSubmitStatus('success');
        event.currentTarget.reset();
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-stone-950/55 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-modal-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-stone-200 bg-white p-5 shadow-2xl sm:p-8"
        style={{ borderRadius: 'var(--btn-radius)' }}
      >
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              {t('services.requestService')}
            </p>
            <h2 id="appointment-modal-title" className="text-2xl font-semibold tracking-tight text-stone-950">
              {selectedService.serviceTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-stone-200 text-stone-500 transition hover:border-stone-950 hover:text-stone-950"
            style={{ borderRadius: 'var(--btn-radius)' }}
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <input type="hidden" name="requestType" value="appointment_request" />
          <AppointmentFields
            servicesItems={[service]}
            settings={settings}
            selectedService={selectedService}
            variant="minimal"
          />

          <label className="grid gap-2 text-sm font-medium text-stone-600">
            {t('contacts.formName')}
            <input
              name="name"
              required
              autoComplete="name"
              className="border border-stone-300 bg-white px-4 py-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
              placeholder={t('contacts.formNamePlaceholder')}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-stone-600">
            {t('contacts.formEmailOptional')}
            <input
              name="email"
              type="email"
              autoComplete="email"
              className="border border-stone-300 bg-white px-4 py-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
              placeholder={t('contacts.formEmailPlaceholder')}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-stone-600">
            {t('contacts.formPhone')}
            <input
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              className="border border-stone-300 bg-white px-4 py-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
              placeholder={t('contacts.formPhonePlaceholder')}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-stone-600">
            {t('contacts.formMessage')}
            <textarea
              name="message"
              rows={4}
              className="resize-none border border-stone-300 bg-white px-4 py-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
              placeholder={t('contacts.formMessagePlaceholder')}
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center bg-[var(--primary-color)] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ borderRadius: 'var(--btn-radius)' }}
          >
            {isSubmitting ? t('contacts.formSending') : t('contacts.formSendRequest')}
          </button>

          {submitStatus === 'success' && (
            <p className="border border-emerald-700 bg-emerald-600 px-4 py-3 text-sm font-medium text-white">
              {t('contacts.formAppointmentSuccess')}
            </p>
          )}
          {submitStatus === 'error' && (
            <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {t('contacts.formError')}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
