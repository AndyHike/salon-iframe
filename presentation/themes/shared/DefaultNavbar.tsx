'use client';

/* eslint-disable @next/next/no-img-element -- Admin logoUrl can point to arbitrary external hosts. */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { useLocale } from '../../../components/LocaleContext';
import type { ThemeNavbarProps } from '../types';

export function DefaultNavbar({
  appearance,
  settings,
  layoutConfig,
  navigation,
}: ThemeNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { locale, setLocale, availableLocales, t } = useLocale();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hasBgImage = !!appearance.tokens.heroBackgroundImage;
  const isSolidNav =
    scrolled ||
    isOpen ||
    navigation.transparency === 'solid' ||
    !hasBgImage;
  const isDarkText = isSolidNav;

  const navLinks = layoutConfig.map((section) => ({
    name: t(`nav.${section}`),
    href: `/#${section}`,
  }));

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSolidNav ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className={`flex min-w-0 items-center gap-3 text-2xl font-bold tracking-tighter transition-colors ${isDarkText ? 'text-stone-900' : 'text-white drop-shadow-md'}`}>
          {appearance.tokens.logoUrl && (
            <img
              src={appearance.tokens.logoUrl}
              alt={`${settings.companyName || 'Salon'} logo`}
              className="h-8 w-auto max-w-[120px] shrink-0 object-contain"
            />
          )}
          <span className="truncate">{settings.companyName || 'Salon'}</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`text-sm font-medium transition-colors hover:text-[var(--primary-color)] ${isDarkText ? 'text-stone-600' : 'text-stone-100 drop-shadow-md'}`}>
              {link.name}
            </Link>
          ))}

          {availableLocales.length > 1 && (
            <div className="relative group">
              <button className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-[var(--primary-color)] ${isDarkText ? 'text-stone-600' : 'text-stone-100 drop-shadow-md'}`}>
                <Globe className="w-4 h-4" />
                <span className="uppercase">{locale}</span>
              </button>
              <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                {availableLocales.map((availableLocale) => (
                  <button
                    key={availableLocale}
                    onClick={() => setLocale(availableLocale)}
                    className={`block w-full text-left px-4 py-2 text-sm uppercase hover:bg-stone-50 ${locale === availableLocale ? 'text-[var(--primary-color)] font-bold' : 'text-stone-700'}`}
                  >
                    {availableLocale}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Link href="/#contacts" className="px-5 py-2.5 text-white text-sm font-medium transition-transform hover:scale-105 shadow-md bg-[var(--primary-color)]" style={{ borderRadius: 'var(--btn-radius)' }}>
            {t('btn.book')}
          </Link>
        </div>

        <div className="md:hidden flex items-center space-x-4">
          {availableLocales.length > 1 && (
            <div className="relative">
              <select
                value={locale}
                onChange={(event) => setLocale(event.target.value)}
                className={`appearance-none bg-transparent uppercase text-sm font-medium pr-4 focus:outline-none ${isDarkText ? 'text-stone-900' : 'text-white drop-shadow-md'}`}
              >
                {availableLocales.map((availableLocale) => (
                  <option key={availableLocale} value={availableLocale} className="text-stone-900">
                    {availableLocale}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button className={`p-2 transition-colors ${isDarkText ? 'text-stone-900' : 'text-white drop-shadow-md'}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-4 flex flex-col space-y-4 border-t border-stone-100">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-stone-800 font-medium py-3 border-b border-stone-100 hover:text-[var(--primary-color)] transition-colors">
              {link.name}
            </Link>
          ))}
          <Link href="/#contacts" onClick={() => setIsOpen(false)} className="px-5 py-3 text-white text-center font-medium shadow-md bg-[var(--primary-color)] mt-2" style={{ borderRadius: 'var(--btn-radius)' }}>
            {t('btn.book')}
          </Link>
        </div>
      )}
    </nav>
  );
}
