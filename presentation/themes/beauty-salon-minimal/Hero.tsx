'use client';

/* eslint-disable @next/next/no-img-element -- Admin logoUrl can point to arbitrary external hosts. */

import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocale } from '../../../components/LocaleContext';
import type { ThemeSectionProps } from '../types';
import { parseMinimalThemeData } from './themeData';

export function Hero({ settings, appearance }: ThemeSectionProps) {
  const { t } = useLocale();
  const tokens = appearance.tokens;
  const themeData = parseMinimalThemeData(appearance.themeData);
  const companyName = settings.companyName || 'Minimal Beauty Studio';
  const heroImage =
    tokens.heroBackgroundImage ||
    'https://picsum.photos/seed/beauty-salon-minimal-hero/1200/1500';
  const overlayOpacity = tokens.heroOverlay ?? 0.16;

  return (
    <section id="hero" className="relative overflow-hidden bg-[#f7f7f3] pt-28 text-stone-950">
      <div className="mx-auto grid min-h-[78vh] max-w-7xl grid-cols-1 gap-12 px-5 pb-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-10 max-w-3xl self-center"
        >
          {tokens.logoUrl && (
            <img
              src={tokens.logoUrl}
              alt={`${companyName} logo`}
              className="mb-8 h-12 w-auto max-w-[180px] object-contain"
            />
          )}
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
            Beauty salon
          </p>
          <h1 className="max-w-3xl text-6xl font-semibold leading-[0.9] tracking-tight text-stone-950 sm:text-7xl lg:text-8xl">
            {companyName}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-stone-600 sm:text-xl">
            {t('hero.subtitle') || 'Precise care, quiet rituals, and beauty services shaped around you.'}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contacts"
              className="inline-flex items-center justify-center gap-2 bg-[var(--primary-color)] px-7 py-4 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ borderRadius: 'var(--btn-radius)' }}
            >
              {t('btn.book')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center border border-stone-300 bg-white px-7 py-4 text-sm font-semibold text-stone-950 transition hover:border-stone-950"
              style={{ borderRadius: 'var(--btn-radius)' }}
            >
              {t('nav.services')}
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
          className="relative min-h-[440px] overflow-hidden bg-stone-200 shadow-[0_28px_80px_rgba(28,25,23,0.16)] lg:min-h-[640px]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-stone-950" style={{ opacity: overlayOpacity }} />
          {themeData.heroChrome === 'caption' && (
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-6 bg-gradient-to-t from-stone-950/70 to-transparent p-6 text-white sm:p-8">
              <span className="max-w-[12rem] text-sm font-medium leading-6 text-white/90">
                Calm appointments, clean lines, considered details.
              </span>
              <span className="hidden text-xs font-semibold uppercase tracking-[0.28em] text-white/70 sm:block">
                Studio
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
