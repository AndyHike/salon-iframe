'use client';

import { motion } from 'motion/react';
import { useLocale } from '../../../components/LocaleContext';
import type { ThemeFooterProps } from '../types';

export function DefaultFooter({ settings }: ThemeFooterProps) {
  const currentYear = new Date().getFullYear();
  const { t } = useLocale();
  const platformName = process.env.NEXT_PUBLIC_PLATFORM_NAME;

  return (
    <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-white text-xl font-bold mb-4">
              {settings.companyName || settings.businessType || t('business.defaultName')}
            </h3>
            <p className="mb-4 max-w-xs">{settings.contactName || t('business.defaultDescription')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-white font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-2">
              {settings.address && <li>{settings.address}</li>}
              {settings.phone && <li>{settings.phone}</li>}
              {settings.email && <li>{settings.email}</li>}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-white font-semibold mb-4">{t('footer.social')}</h4>
            <ul className="space-y-2">
              {settings.instagramActive && settings.instagramUrl && (
                <li><a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
              )}
              {settings.facebookActive && settings.facebookUrl && (
                <li><a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Facebook</a></li>
              )}
              {settings.telegramActive && settings.telegramUrl && (
                <li><a href={settings.telegramUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Telegram</a></li>
              )}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-8 border-t border-stone-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center"
        >
          <p>&copy; {currentYear} {settings.companyName || settings.businessType || t('business.defaultName')}. {t('footer.allRightsReserved')}</p>
          {platformName && (
            <p className="mt-2 md:mt-0">
              {t('footer.poweredBy')} <span className="text-white font-semibold">{platformName}</span>
            </p>
          )}
        </motion.div>
      </div>
    </footer>
  );
}
