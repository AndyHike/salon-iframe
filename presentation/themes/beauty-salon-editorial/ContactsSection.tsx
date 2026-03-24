'use client';

import { useState } from 'react';
import { useLocale } from '../../../components/LocaleContext';
import { AppearanceContract, CmsItem, CmsSettingsResponse } from '../../../cms/types';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Send } from 'lucide-react';
import { submitContactForm } from '../../../app/actions/contact';
import { parseThemeData } from '../../theme-data/parser';

export function ContactsSection({ 
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
  const { t } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const themeData = parseThemeData(appearance.themeData);

  const spacingClass = themeData.sectionSpacing === 'airy' ? 'py-32' : 'py-20';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await submitContactForm(domain, formData);
      if (result.success) {
        setSubmitStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderWorkingHours = () => {
    if (!settings.workingHours) return null;
    try {
      const hoursData = typeof settings.workingHours === 'string' ? JSON.parse(settings.workingHours) : settings.workingHours;
      if (hoursData && hoursData.days && Array.isArray(hoursData.days)) {
        return (
          <div className="flex flex-col space-y-4 mt-2 w-full max-w-sm">
            {hoursData.byAppointment && <div className="text-xs tracking-widest uppercase font-semibold text-[var(--primary-color)] mb-2 pb-2 border-b border-stone-200">{t('contacts.byAppointment')}</div>}
            {hoursData.days.map((day: any) => (
              <div key={day.day} className="flex justify-between text-sm tracking-wide text-stone-900 border-b border-stone-200 pb-2 last:border-0 last:pb-0">
                <span className="font-semibold uppercase">{t(`days.${day.day}`)}</span>
                <span className="font-light">{day.isClosed ? t('contacts.closed') : `${day.open} - ${day.close}`}</span>
              </div>
            ))}
          </div>
        );
      }
    } catch (e) {
      console.warn('Failed to parse working hours', e);
    }
    return <p className="text-stone-600 whitespace-pre-line tracking-wide font-light">{String(settings.workingHours)}</p>;
  };

  return (
    <section id="contacts" className={`${spacingClass} bg-white border-t border-stone-200`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={themeData.animationStyle === 'reveal' ? { opacity: 0, y: 40 } : { opacity: 0, x: -20 }}
            whileInView={themeData.animationStyle === 'reveal' ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1 pt-8 border-t-4 border-stone-900"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-8 uppercase tracking-tighter">{t('contacts.subtitle')}</h2>
            <p className="text-stone-500 mb-12 text-lg font-light leading-relaxed max-w-lg">
              {t('contacts.description')}
            </p>

            <div className="space-y-10">
              {settings.address && (
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-stone-400 mb-3">{t('contacts.address')}</h4>
                  <p className="text-xl font-serif text-stone-900 leading-snug max-w-sm">{settings.address}</p>
                </div>
              )}
              {settings.phone && (
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-stone-400 mb-3">{t('contacts.phone')}</h4>
                  <a href={`tel:${settings.phone}`} className="text-xl font-serif text-stone-900 hover:text-[var(--primary-color)] transition-colors inline-block">{settings.phone}</a>
                </div>
              )}
              {settings.email && (
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-stone-400 mb-3">{t('contacts.email')}</h4>
                  <a href={`mailto:${settings.email}`} className="text-xl font-serif text-stone-900 hover:text-[var(--primary-color)] transition-colors inline-block">{settings.email}</a>
                </div>
              )}
              {!!settings.workingHours && (
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-stone-400 mb-4">{t('contacts.hours')}</h4>
                  {renderWorkingHours()}
                </div>
              )}
            </div>

            {(settings.instagramActive || settings.facebookActive || settings.telegramActive) && (
              <div className="mt-16 pt-10 border-t border-stone-200">
                <h4 className="text-xs uppercase tracking-widest text-stone-400 mb-6">{t('contacts.social')}</h4>
                <div className="flex gap-6">
                  {settings.instagramActive && settings.instagramUrl && (
                    <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-stone-900 hover:text-[var(--primary-color)] transition-colors">
                      <span className="uppercase text-sm font-semibold tracking-widest underline underline-offset-4">INSTAGRAM</span>
                    </a>
                  )}
                  {settings.facebookActive && settings.facebookUrl && (
                    <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-stone-900 hover:text-[var(--primary-color)] transition-colors">
                      <span className="uppercase text-sm font-semibold tracking-widest underline underline-offset-4">FACEBOOK</span>
                    </a>
                  )}
                  {settings.telegramActive && settings.telegramUrl && (
                    <a href={settings.telegramUrl} target="_blank" rel="noopener noreferrer" className="text-stone-900 hover:text-[var(--primary-color)] transition-colors">
                      <span className="uppercase text-sm font-semibold tracking-widest underline underline-offset-4">TELEGRAM</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={themeData.animationStyle === 'reveal' ? { opacity: 0, y: 40 } : { opacity: 0, x: 20 }}
            whileInView={themeData.animationStyle === 'reveal' ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className={`order-1 lg:order-2 bg-[#f9f8f6] p-10 lg:p-16 border border-stone-200`}
          >
            <h3 className="text-2xl font-serif text-stone-900 mb-10 uppercase tracking-widest border-b border-stone-300 pb-4">{t('contacts.formTitle')}</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="name" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">{t('contacts.formName')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full bg-transparent border-b border-stone-300 py-3 focus:outline-none focus:border-stone-900 transition-colors text-lg"
                  placeholder="JOHN DOE"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">{t('contacts.formPhone')}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full bg-transparent border-b border-stone-300 py-3 focus:outline-none focus:border-stone-900 transition-colors text-lg"
                  placeholder="+38 (000) 000-00-00"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">{t('contacts.formMessage')}</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full bg-transparent border-b border-stone-300 py-3 focus:outline-none focus:border-stone-900 transition-colors text-lg resize-none"
                  placeholder="INQUIRE ABOUT APPOINTMENT"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-stone-900 text-white font-semibold tracking-widest text-sm uppercase hover:bg-stone-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center mt-4"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-[3px] border-stone-500 border-t-white rounded-full animate-spin"></div>
                ) : (
                  t('contacts.formSend')
                )}
              </button>
              
              {submitStatus === 'success' && (
                <div className="p-4 bg-[var(--primary-color)] bg-opacity-10 text-[var(--primary-color)] text-center text-sm tracking-wide border border-[var(--primary-color)]">
                  {t('contacts.formSuccess')}
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 text-red-900 text-center text-sm tracking-wide border border-red-200">
                  {t('contacts.formError')}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
