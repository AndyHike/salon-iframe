'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { SiteData } from '@/lib/getSiteData';
import { StoreData } from '@/lib/api';

export function Navbar({ siteData, storeData, layoutConfig }: { siteData: SiteData; storeData: StoreData; layoutConfig: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hasBgImage = !!siteData.heroBackgroundImage;
  const isDarkText = scrolled || !hasBgImage;

  const navLinks = layoutConfig.map(section => ({
    name: section.charAt(0).toUpperCase() + section.slice(1),
    href: `#${section}`
  }));

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#" className={`text-2xl font-bold tracking-tighter transition-colors ${isDarkText ? 'text-stone-900' : 'text-white drop-shadow-md'}`}>
          {siteData.name || 'Salon'}
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className={`text-sm font-medium transition-colors hover:text-[var(--primary-color)] ${isDarkText ? 'text-stone-600' : 'text-stone-100 drop-shadow-md'}`}>
              {link.name}
            </a>
          ))}
          <a href="#contacts" className="px-5 py-2.5 text-white text-sm font-medium transition-transform hover:scale-105 shadow-md bg-[var(--primary-color)]" style={{ borderRadius: 'var(--btn-radius)' }}>
            Book Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className={`md:hidden p-2 transition-colors ${isDarkText ? 'text-stone-900' : 'text-white drop-shadow-md'}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-4 flex flex-col space-y-4 border-t border-stone-100">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-stone-800 font-medium py-3 border-b border-stone-100 hover:text-[var(--primary-color)] transition-colors">
              {link.name}
            </a>
          ))}
          <a href="#contacts" onClick={() => setIsOpen(false)} className="px-5 py-3 text-white text-center font-medium shadow-md bg-[var(--primary-color)] mt-2" style={{ borderRadius: 'var(--btn-radius)' }}>
            Book Now
          </a>
        </div>
      )}
    </nav>
  );
}
