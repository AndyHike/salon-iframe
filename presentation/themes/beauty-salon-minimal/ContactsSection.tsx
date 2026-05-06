'use client';

import { useState } from 'react';
import { Clock, Instagram, Mail, MapPin, Phone, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { submitContactForm } from '../../../app/actions/contact';
import { useLocale } from '../../../components/LocaleContext';
import { AppointmentFields } from '../../appointments/AppointmentFields';
import { normalizeWorkingHours } from '../shared/workingHours';
import type { ThemeSectionProps } from '../types';
import { parseMinimalThemeData } from './themeData';

export function ContactsSection({
  settings,
  appearance,
  servicesItems,
  domain,
  selectedService,
  onAppointmentRequestComplete,
}: ThemeSectionProps) {
  const { t } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [lastSubmitWasAppointment, setLastSubmitWasAppointment] = useState(false);
  const themeData = parseMinimalThemeData(appearance.themeData);
  const spacingClass =
    themeData.sectionSpacing === 'compact'
      ? 'py-16 sm:py-20'
      : themeData.sectionSpacing === 'airy'
        ? 'py-28 sm:py-36'
        : 'py-20 sm:py-28';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    const wasAppointmentRequest = Boolean(selectedService);
    const form = event.currentTarget;

    const formData = new FormData(form);

    try {
      const result = await submitContactForm(domain, formData);
      if (result.success) {
        setLastSubmitWasAppointment(wasAppointmentRequest);
        setSubmitStatus('success');
        form.reset();
        onAppointmentRequestComplete?.();
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactRows = [
    settings.address ? { icon: MapPin, label: t('contacts.address'), value: settings.address, href: settings.addressUrl || null } : null,
    settings.phone ? { icon: Phone, label: t('contacts.phone'), value: settings.phone, href: `tel:${settings.phone}` } : null,
    settings.email ? { icon: Mail, label: t('contacts.email'), value: settings.email, href: `mailto:${settings.email}` } : null,
  ].filter(Boolean) as Array<{
    icon: typeof MapPin;
    label: string;
    value: string;
    href: string | null;
  }>;

  const socialRows = [
    settings.instagramActive && settings.instagramUrl
      ? { icon: Instagram, label: 'Instagram', href: settings.instagramUrl }
      : null,
    settings.telegramActive && settings.telegramUrl
      ? { icon: Send, label: 'Telegram', href: settings.telegramUrl }
      : null,
  ].filter(Boolean) as Array<{ icon: typeof Instagram; label: string; href: string }>;
  const workingHours = normalizeWorkingHours(settings.workingHours);

  return (
    <section id="contacts" className={`bg-white ${spacingClass} text-stone-950`}>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="border-t border-stone-200 pt-8"
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
            {t('contacts.title')}
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            {t('contacts.subtitle')}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-500">
            {t('contacts.description')}
          </p>

          <div className="mt-10 grid gap-5">
            {contactRows.map((row) => {
              const Icon = row.icon;
              const content = (
                <>
                  <Icon className="mt-1 h-4 w-4 text-[var(--primary-color)]" aria-hidden="true" />
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                      {row.label}
                    </span>
                    <span className="mt-1 block text-base font-medium text-stone-950">{row.value}</span>
                  </span>
                </>
              );

              return row.href ? (
                <a key={row.label} href={row.href} className="grid grid-cols-[auto_1fr] gap-4 hover:text-[var(--primary-color)]">
                  {content}
                </a>
              ) : (
                <div key={row.label} className="grid grid-cols-[auto_1fr] gap-4">
                  {content}
                </div>
              );
            })}

            {workingHours && (
              <div className="grid grid-cols-[auto_1fr] gap-4">
                <Clock className="mt-1 h-4 w-4 text-[var(--primary-color)]" aria-hidden="true" />
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
                    {t('contacts.hours')}
                  </span>
                  {workingHours.kind === 'structured' ? (
                    <div className="mt-2 grid max-w-xs gap-1.5 text-sm text-stone-700">
                      {workingHours.byAppointment && (
                        <p className="mb-1 text-sm font-semibold text-[var(--primary-color)]">
                          {t('contacts.byAppointment')}
                        </p>
                      )}
                      {workingHours.days.map((day) => (
                        <div
                          key={day.day}
                          className="grid grid-cols-[1fr_auto] gap-4 border-b border-stone-200 pb-1 last:border-0 last:pb-0"
                        >
                          <span className="font-medium capitalize text-stone-950">{t(`days.${day.day}`)}</span>
                          <span>{day.isClosed ? t('contacts.closed') : `${day.open} - ${day.close}`}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="mt-1 block whitespace-pre-line text-base font-medium text-stone-950">
                      {workingHours.text}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {socialRows.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {socialRows.map((row) => {
                const Icon = row.icon;
                return (
                  <a
                    key={row.label}
                    href={row.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-stone-300 px-4 py-2 text-sm font-semibold transition hover:border-stone-950"
                    style={{ borderRadius: 'var(--btn-radius)' }}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {row.label}
                  </a>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          onSubmit={handleSubmit}
          className="border border-stone-200 bg-[#fbfaf7] p-6 sm:p-8"
        >
          <h3 className="mb-8 text-2xl font-semibold tracking-tight text-stone-950">
            {t('contacts.formTitle')}
          </h3>
          <div className="grid gap-5">
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
            {selectedService && (
              <AppointmentFields
                key={selectedService.serviceId}
                servicesItems={servicesItems}
                settings={settings}
                selectedService={selectedService}
                variant="minimal"
              />
            )}
            <label className="grid gap-2 text-sm font-medium text-stone-600">
              {t('contacts.formMessage')}
              <textarea
                name="message"
                rows={5}
                className="resize-none border border-stone-300 bg-white px-4 py-3 text-base text-stone-950 outline-none transition focus:border-stone-950"
                placeholder={t('contacts.formMessagePlaceholder')}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex w-full items-center justify-center bg-[var(--primary-color)] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ borderRadius: 'var(--btn-radius)' }}
          >
            {isSubmitting
              ? t('contacts.formSending')
              : selectedService
                ? t('contacts.formSendRequest')
                : t('contacts.formSend')}
          </button>
          {submitStatus === 'success' && (
            <p className="mt-4 border border-emerald-700 bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-sm">
              {lastSubmitWasAppointment ? t('contacts.formAppointmentSuccess') : t('contacts.formSuccess')}
            </p>
          )}
          {submitStatus === 'error' && (
            <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {t('contacts.formError')}
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
