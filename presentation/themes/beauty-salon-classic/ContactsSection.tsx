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

  const isPaper = themeData.surfaceStyle === 'paper';
  const surfaceClass = isPaper ? 'shadow-md border-2 border-stone-200 bg-[#fdfbf7]' : 'shadow-sm border border-stone-100 bg-stone-50';
  const spacingClass = themeData.sectionSpacing === 'airy' ? 'py-32' : 'py-24';

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
          <div className="flex flex-col space-y-2 mt-1 w-full max-w-xs">
            {hoursData.byAppointment && <div className="text-sm font-medium text-[var(--primary-color)] mb-1">{t('contacts.byAppointment')}</div>}
            {hoursData.days.map((day: any) => (
              <div key={day.day} className="flex justify-between text-sm text-stone-600 border-b border-stone-100 pb-1 last:border-0 last:pb-0">
                <span className="font-medium capitalize">{t(`days.${day.day}`)}</span>
                <span>{day.isClosed ? t('contacts.closed') : `${day.open} - ${day.close}`}</span>
              </div>
            ))}
          </div>
        );
      }
    } catch (e) {
      console.warn('Failed to parse working hours', e);
    }
    return <p className="text-stone-600 whitespace-pre-line">{String(settings.workingHours)}</p>;
  };

  return (
    <section id="contacts" className={`${spacingClass} bg-white`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">{t('contacts.title')}</h2>
          <div className="w-24 h-1 mx-auto rounded bg-[var(--primary-color)]"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <motion.div
            initial={themeData.animationStyle === 'reveal' ? { opacity: 0 } : { opacity: 0, x: -20 }}
            whileInView={themeData.animationStyle === 'reveal' ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-2 md:order-1"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-6">{t('contacts.subtitle')}</h2>
            <p className="text-stone-600 mb-8">{t('contacts.description')}</p>

            <div className="space-y-6">
              {settings.address && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 text-stone-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 mb-1">{t('contacts.address')}</h4>
                    <p className="text-stone-600">{settings.address}</p>
                  </div>
                </div>
              )}
              {settings.phone && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 text-stone-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 mb-1">{t('contacts.phone')}</h4>
                    <a href={`tel:${settings.phone}`} className="text-stone-600 hover:text-[var(--primary-color)] transition-colors">{settings.phone}</a>
                  </div>
                </div>
              )}
              {settings.email && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 text-stone-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 mb-1">{t('contacts.email')}</h4>
                    <a href={`mailto:${settings.email}`} className="text-stone-600 hover:text-[var(--primary-color)] transition-colors">{settings.email}</a>
                  </div>
                </div>
              )}
              {!!settings.workingHours && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 text-stone-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-stone-900 mb-1">{t('contacts.hours')}</h4>
                    {renderWorkingHours()}
                  </div>
                </div>
              )}
            </div>

            {(settings.instagramActive || settings.facebookActive || settings.telegramActive) && (
              <div className="mt-12 pt-8 border-t border-stone-100">
                <h4 className="font-medium text-stone-900 mb-4">{t('contacts.social')}</h4>
                <div className="flex gap-4">
                  {settings.instagramActive && settings.instagramUrl && (
                    <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-[var(--primary-color)] hover:text-white transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {settings.facebookActive && settings.facebookUrl && (
                    <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-[var(--primary-color)] hover:text-white transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {settings.telegramActive && settings.telegramUrl && (
                    <a href={settings.telegramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-[var(--primary-color)] hover:text-white transition-colors">
                      <Send className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={themeData.animationStyle === 'reveal' ? { opacity: 0 } : { opacity: 0, x: 20 }}
            whileInView={themeData.animationStyle === 'reveal' ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`order-1 md:order-2 ${surfaceClass} p-8 rounded-2xl`}
          >
            <h3 className="text-2xl font-bold text-stone-900 mb-6">{t('contacts.formTitle')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">{t('contacts.formName')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all bg-white"
                  placeholder={t('contacts.formName')}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1">{t('contacts.formPhone')}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all bg-white"
                  placeholder="+38 (000) 000-00-00"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">{t('contacts.formMessage')}</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all bg-white resize-none"
                  placeholder={t('contacts.formMessage')}
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[var(--primary-color)] text-white font-medium rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                style={{ borderRadius: 'var(--btn-radius)' }}
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  t('contacts.formSend')
                )}
              </button>
              
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center text-sm">
                  {t('contacts.formSuccess')}
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center text-sm">
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
