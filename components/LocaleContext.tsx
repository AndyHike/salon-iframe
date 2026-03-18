'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  availableLocales: string[];
  t: (key: string) => string;
};

const translations: Record<string, Record<string, string>> = {
  uk: {
    'nav.hero': 'Головна',
    'nav.services': 'Послуги',
    'nav.gallery': 'Галерея',
    'nav.contacts': 'Контакти',
    'btn.book': 'Записатись',
    'services.title': 'Наші Послуги',
    'services.empty': 'Наразі послуги відсутні.',
    'services.priceOnRequest': 'Ціна за запитом',
    'gallery.title': 'Наші Роботи',
    'gallery.empty': 'У галереї немає зображень.',
    'contacts.title': 'Контакти',
    'contacts.subtitle': 'Завітайте до нас',
    'contacts.description': 'Готові до перевтілення? Запишіться на прийом сьогодні або завітайте до нашого салону. Ми з нетерпінням чекаємо на вас.',
    'contacts.address': 'Адреса',
    'contacts.phone': 'Телефон',
    'contacts.email': 'Email',
    'contacts.hours': 'Графік роботи',
    'contacts.closed': 'Вихідний',
    'contacts.byAppointment': 'Тільки за записом',
    'contacts.defaultHours1': 'Пн-Пт: 9:00 - 20:00',
    'contacts.defaultHours2': 'Сб-Нд: 10:00 - 18:00',
    'contacts.formTitle': 'Надіслати повідомлення',
    'contacts.formName': 'Ім\'я',
    'contacts.formNamePlaceholder': 'Ваше ім\'я',
    'contacts.formEmail': 'Email',
    'contacts.formEmailPlaceholder': 'ваш@email.com',
    'contacts.formPhone': 'Телефон',
    'contacts.formPhonePlaceholder': 'Ваш номер телефону',
    'contacts.formMessage': 'Повідомлення',
    'contacts.formMessagePlaceholder': 'Чим ми можемо допомогти?',
    'contacts.formSending': 'Надсилання...',
    'contacts.formSend': 'Надіслати повідомлення',
    'contacts.formSuccess': 'Повідомлення успішно надіслано!',
    'contacts.formError': 'Не вдалося надіслати повідомлення.',
    'footer.contact': 'Контакти',
    'footer.social': 'Соціальні мережі',
    'footer.allRightsReserved': 'Всі права захищено.',
    'footer.poweredBy': 'Працює на',
    'days.monday': 'Понеділок',
    'days.tuesday': 'Вівторок',
    'days.wednesday': 'Середа',
    'days.thursday': 'Четвер',
    'days.friday': 'П\'ятниця',
    'days.saturday': 'Субота',
    'days.sunday': 'Неділя',
  },
  en: {
    'nav.hero': 'Home',
    'nav.services': 'Services',
    'nav.gallery': 'Gallery',
    'nav.contacts': 'Contacts',
    'btn.book': 'Book Now',
    'services.title': 'Our Services',
    'services.empty': 'No services available at the moment.',
    'services.priceOnRequest': 'Price on request',
    'gallery.title': 'Our Work',
    'gallery.empty': 'No images available in the gallery.',
    'contacts.title': 'Contacts',
    'contacts.subtitle': 'Visit Us',
    'contacts.description': 'Ready for a transformation? Book your appointment today or drop by our salon. We look forward to welcoming you.',
    'contacts.address': 'Address',
    'contacts.phone': 'Phone',
    'contacts.email': 'Email',
    'contacts.hours': 'Working Hours',
    'contacts.closed': 'Closed',
    'contacts.byAppointment': 'By appointment only',
    'contacts.defaultHours1': 'Mon-Fri: 9am - 8pm',
    'contacts.defaultHours2': 'Sat-Sun: 10am - 6pm',
    'contacts.formTitle': 'Send a Message',
    'contacts.formName': 'Name',
    'contacts.formNamePlaceholder': 'Your name',
    'contacts.formEmail': 'Email',
    'contacts.formEmailPlaceholder': 'your@email.com',
    'contacts.formPhone': 'Phone',
    'contacts.formPhonePlaceholder': 'Your phone number',
    'contacts.formMessage': 'Message',
    'contacts.formMessagePlaceholder': 'How can we help you?',
    'contacts.formSending': 'Sending...',
    'contacts.formSend': 'Send Message',
    'contacts.formSuccess': 'Message sent successfully!',
    'contacts.formError': 'Failed to send message.',
    'footer.contact': 'Contact',
    'footer.social': 'Social',
    'footer.allRightsReserved': 'All rights reserved.',
    'footer.poweredBy': 'Powered by',
    'days.monday': 'Monday',
    'days.tuesday': 'Tuesday',
    'days.wednesday': 'Wednesday',
    'days.thursday': 'Thursday',
    'days.friday': 'Friday',
    'days.saturday': 'Saturday',
    'days.sunday': 'Sunday',
  },
  cs: {
    'nav.hero': 'Domů',
    'nav.services': 'Služby',
    'nav.gallery': 'Galerie',
    'nav.contacts': 'Kontakty',
    'btn.book': 'Rezervovat',
    'services.title': 'Naše Služby',
    'services.empty': 'Momentálně nejsou k dispozici žádné služby.',
    'services.priceOnRequest': 'Cena na vyžádání',
    'gallery.title': 'Naše Práce',
    'gallery.empty': 'V galerii nejsou k dispozici žádné obrázky.',
    'contacts.title': 'Kontakty',
    'contacts.subtitle': 'Navštivte nás',
    'contacts.description': 'Jste připraveni na transformaci? Rezervujte si termín ještě dnes nebo se zastavte v našem salonu. Těšíme se na vás.',
    'contacts.address': 'Adresa',
    'contacts.phone': 'Telefon',
    'contacts.email': 'E-mail',
    'contacts.hours': 'Pracovní doba',
    'contacts.closed': 'Zavřeno',
    'contacts.byAppointment': 'Pouze na objednání',
    'contacts.defaultHours1': 'Po-Pá: 9:00 - 20:00',
    'contacts.defaultHours2': 'So-Ne: 10:00 - 18:00',
    'contacts.formTitle': 'Poslat zprávu',
    'contacts.formName': 'Jméno',
    'contacts.formNamePlaceholder': 'Vaše jméno',
    'contacts.formEmail': 'E-mail',
    'contacts.formEmailPlaceholder': 'vas@email.cz',
    'contacts.formPhone': 'Telefon',
    'contacts.formPhonePlaceholder': 'Vaše telefonní číslo',
    'contacts.formMessage': 'Zpráva',
    'contacts.formMessagePlaceholder': 'Jak vám můžeme pomoci?',
    'contacts.formSending': 'Odesílání...',
    'contacts.formSend': 'Poslat zprávu',
    'contacts.formSuccess': 'Zpráva byla úspěšně odeslána!',
    'contacts.formError': 'Zprávu se nepodařilo odeslat.',
    'footer.contact': 'Kontakt',
    'footer.social': 'Sociální sítě',
    'footer.allRightsReserved': 'Všechna práva vyhrazena.',
    'footer.poweredBy': 'Poháněno',
    'days.monday': 'Pondělí',
    'days.tuesday': 'Úterý',
    'days.wednesday': 'Středa',
    'days.thursday': 'Čtvrtek',
    'days.friday': 'Pátek',
    'days.saturday': 'Sobota',
    'days.sunday': 'Neděle',
  }
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ 
  children, 
  defaultLocale, 
  availableLocales 
}: { 
  children: React.ReactNode; 
  defaultLocale: string; 
  availableLocales: string[];
}) {
  const [locale, setLocaleState] = useState(defaultLocale);

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && availableLocales.includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, [availableLocales]);

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string) => {
    return translations[locale]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, availableLocales, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
