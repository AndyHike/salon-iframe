'use client';

import { useEffect, useMemo, useState } from 'react';
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
  variant?: AppointmentModalVariant;
};

export type AppointmentModalVariant = 'classic' | 'editorial' | 'minimal';

type AppointmentFieldsVariant = 'soft' | 'editorial' | 'minimal';

const modalStyles: Record<AppointmentModalVariant, {
  panel: string;
  header: string;
  eyebrow: string;
  title: string;
  closeButton: string;
  form: string;
  field: string;
  splitGrid: string;
  label: string;
  input: string;
  textarea: string;
  submitButton: string;
  success: string;
  error: string;
  fieldsVariant: AppointmentFieldsVariant;
}> = {
  classic: {
    panel: 'w-full max-w-3xl rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl sm:p-8',
    header: 'mb-6 flex items-start justify-between gap-6',
    eyebrow: 'mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-400',
    title: 'text-2xl font-bold text-stone-900',
    closeButton: 'inline-flex h-10 w-10 shrink-0 items-center justify-center border border-stone-200 text-stone-500 transition hover:border-stone-950 hover:text-stone-950',
    form: 'space-y-4',
    field: '',
    splitGrid: 'grid gap-4 sm:grid-cols-2',
    label: 'block text-sm font-medium text-stone-700 mb-1',
    input: 'w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all bg-white',
    textarea: 'w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all bg-white resize-none',
    submitButton: 'flex w-full items-center justify-center bg-[var(--primary-color)] py-4 font-medium text-white transition-all hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-70',
    success: 'p-4 bg-emerald-600 text-white rounded-xl text-center text-sm font-medium shadow-sm',
    error: 'p-4 bg-red-50 text-red-700 rounded-xl text-center text-sm',
    fieldsVariant: 'soft',
  },
  editorial: {
    panel: 'w-full max-w-3xl border border-stone-200 bg-[#f9f8f6] p-6 shadow-2xl sm:p-10 lg:p-12',
    header: 'mb-8 flex items-start justify-between gap-6 border-b border-stone-300 pb-4',
    eyebrow: 'mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-stone-500',
    title: 'font-serif text-2xl uppercase tracking-widest text-stone-900',
    closeButton: 'inline-flex h-10 w-10 shrink-0 items-center justify-center border border-stone-300 text-stone-500 transition hover:border-stone-900 hover:text-stone-900',
    form: 'space-y-8',
    field: '',
    splitGrid: 'grid gap-8 sm:grid-cols-2',
    label: 'block text-xs uppercase tracking-widest text-stone-500 mb-2',
    input: 'w-full bg-transparent border-b border-stone-300 py-3 text-lg transition-colors focus:border-stone-900 focus:outline-none',
    textarea: 'w-full resize-none bg-transparent border-b border-stone-300 py-3 text-lg transition-colors focus:border-stone-900 focus:outline-none',
    submitButton: 'flex w-full items-center justify-center bg-[var(--primary-color)] py-5 text-sm font-semibold uppercase tracking-widest text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70',
    success: 'p-4 bg-emerald-600 text-white text-center text-sm font-medium tracking-wide border border-emerald-700 shadow-sm',
    error: 'p-4 bg-red-50 text-red-900 text-center text-sm tracking-wide border border-red-200',
    fieldsVariant: 'editorial',
  },
  minimal: {
    panel: 'w-full max-w-3xl border border-stone-200 bg-[#fbfaf7] p-5 shadow-2xl sm:p-8',
    header: 'mb-6 flex items-start justify-between gap-6',
    eyebrow: 'mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-400',
    title: 'text-2xl font-semibold tracking-tight text-stone-950',
    closeButton: 'inline-flex h-10 w-10 shrink-0 items-center justify-center border border-stone-200 text-stone-500 transition hover:border-stone-950 hover:text-stone-950',
    form: 'grid gap-5',
    field: 'grid gap-2',
    splitGrid: 'grid gap-5 sm:grid-cols-2',
    label: 'text-sm font-medium text-stone-600',
    input: 'border border-stone-300 bg-white px-4 py-3 text-base text-stone-950 outline-none transition focus:border-stone-950',
    textarea: 'resize-none border border-stone-300 bg-white px-4 py-3 text-base text-stone-950 outline-none transition focus:border-stone-950',
    submitButton: 'inline-flex w-full items-center justify-center bg-[var(--primary-color)] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60',
    success: 'border border-emerald-700 bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-sm',
    error: 'border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800',
    fieldsVariant: 'minimal',
  },
};

export function getAppointmentModalVariant(themeKey: string | null | undefined): AppointmentModalVariant {
  if (themeKey?.includes('editorial')) return 'editorial';
  if (themeKey?.includes('minimal')) return 'minimal';

  return 'classic';
}

export function AppointmentRequestModal({
  domain,
  settings,
  service,
  open,
  onClose,
  variant = 'classic',
}: AppointmentRequestModalProps) {
  const { locale, t } = useLocale();
  const defaultLocale = settings.defaultLocale || 'uk';
  const styles = modalStyles[variant];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const selectedService = useMemo(() => createAppointmentServiceSelection(
    service,
    locale,
    defaultLocale,
    'services_section',
    t('services.priceOnRequest'),
  ), [defaultLocale, locale, service, t]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

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
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-stone-950/55 px-4 py-6 backdrop-blur-sm sm:items-center"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-modal-title"
        className={styles.panel}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              {t('services.requestService')}
            </p>
            <h2 id="appointment-modal-title" className={styles.title}>
              {selectedService.serviceTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            style={{ borderRadius: 'var(--btn-radius)' }}
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="hidden" name="requestType" value="appointment_request" />
          <AppointmentFields
            servicesItems={[service]}
            settings={settings}
            selectedService={selectedService}
            variant={styles.fieldsVariant}
          />

          <div className={styles.splitGrid}>
            <div className={styles.field}>
              <label htmlFor="appointment-name" className={styles.label}>{t('contacts.formName')}</label>
              <input
                id="appointment-name"
                name="name"
                required
                autoComplete="name"
                className={styles.input}
                placeholder={t('contacts.formNamePlaceholder')}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="appointment-phone" className={styles.label}>{t('contacts.formPhone')}</label>
              <input
                id="appointment-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                className={styles.input}
                placeholder={t('contacts.formPhonePlaceholder')}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="appointment-email" className={styles.label}>{t('contacts.formEmailOptional')}</label>
            <input
              id="appointment-email"
              name="email"
              type="email"
              autoComplete="email"
              className={styles.input}
              placeholder={t('contacts.formEmailPlaceholder')}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="appointment-message" className={styles.label}>{t('contacts.formMessage')}</label>
            <textarea
              id="appointment-message"
              name="message"
              rows={4}
              className={styles.textarea}
              placeholder={t('contacts.formMessagePlaceholder')}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
            style={{ borderRadius: 'var(--btn-radius)' }}
          >
            {isSubmitting ? t('contacts.formSending') : t('contacts.formSendRequest')}
          </button>

          {submitStatus === 'success' && (
            <p className={styles.success}>
              {t('contacts.formAppointmentSuccess')}
            </p>
          )}
          {submitStatus === 'error' && (
            <p className={styles.error}>
              {t('contacts.formError')}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
