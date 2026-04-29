'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getAvailableLocaleCodes, getDefaultLocaleCode, localizedPath } from '../lib/routes';

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  availableLocales: string[];
  t: (key: string) => string;
  localePath: (href?: string) => string;
  localizedPaths: boolean;
};

const translations: Record<string, Record<string, string>> = {
  uk: {
    'nav.hero': 'Головна',
    'nav.services': 'Послуги',
    'nav.gallery': 'Галерея',
    'nav.photoGallery': 'Галерея',
    'nav.contacts': 'Контакти',
    'btn.book': 'Записатись',
    'hero.subtitle': 'Досвід найкращих послуг з догляду та краси, створених спеціально для вас.',
    'hero.eyebrow': 'Салон краси',
    'hero.imageCaption': 'Спокійний запис, чисті лінії та продумані деталі.',
    'hero.imageLabel': 'Студія',
    'business.defaultName': 'Салон краси',
    'business.defaultDescription': 'Послуги догляду та краси, створені спеціально для вас.',
    'services.title': 'Наші Послуги',
    'services.description': 'Зрозумілий список послуг з описом, тривалістю та цінами.',
    'services.baseCategories': 'Послуги',
    'services.kicker': 'Меню',
    'services.empty': 'Наразі послуги відсутні.',
    'services.priceOnRequest': 'Ціна за запитом',
    'gallery.title': 'Наші Роботи',
    'gallery.empty': 'У галереї немає зображень.',
    'gallery.filterAll': 'Всі',
    'gallery.openImage': 'Відкрити фото',
    'gallery.kicker': 'Роботи',
    'gallery.close': 'Закрити',
    'gallery.previousImage': 'Попереднє фото',
    'gallery.nextImage': 'Наступне фото',
    'contacts.title': 'Контакти',
    'contacts.subtitle': 'Завітайте до нас',
    'contacts.description': 'Готові до перевтілення? Запишіться на прийом сьогодні або завітайте до нашого салону. Ми з нетерпінням чекаємо на вас.',
    'contacts.address': 'Адреса',
    'contacts.phone': 'Телефон',
    'contacts.email': 'Email',
    'contacts.hours': 'Графік роботи',
    'contacts.social': 'Соціальні мережі',
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
    'contacts.formError': 'Не вдалося надіслати повідомлення.',
    'services.requestService': 'Запит на запис',
    'contacts.formEmailOptional': 'Email (необов’язково)',
    'contacts.formService': 'Послуга',
    'contacts.formServicePlaceholder': 'Оберіть послугу',
    'contacts.formPreferredDate': 'Бажана дата',
    'contacts.formPreferredTime': 'Бажаний час',
    'contacts.formPreferredTimeLabel': 'Гнучкість часу',
    'contacts.formPreferredTimeExact': 'Точний час',
    'contacts.formPreferredTimeMorning': 'Ранок',
    'contacts.formPreferredTimeAfternoon': 'День',
    'contacts.formPreferredTimeEvening': 'Вечір',
    'contacts.formPreferredTimeAny': 'Будь-який час',
    'contacts.formSendRequest': 'Надіслати запит',
    'contacts.formSuccess': 'Повідомлення успішно надіслано!',
    'contacts.formAppointmentSuccess': 'Дякуємо! Ми зв’яжемося з вами, щоб уточнити деталі та підтвердити час.',
    'services.viewAll': 'Переглянути всі послуги',
    'gallery.viewAll': 'Переглянути всю галерею',
    'footer.contact': 'Контакти',
    'footer.social': 'Соціальні мережі',
    'footer.allRightsReserved': 'Всі права захищено.',
    'footer.poweredBy': 'Працює на',
    'footer.platformName': 'Вашій платформі',
    'availability.suspended.eyebrow': '\u041d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e',
    'availability.suspended.title': '\u0421\u0430\u0439\u0442 \u0442\u0438\u043c\u0447\u0430\u0441\u043e\u0432\u043e \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0438\u0439',
    'availability.suspended.message': '\u0421\u0430\u0439\u0442 \u0442\u0438\u043c\u0447\u0430\u0441\u043e\u0432\u043e \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0438\u0439. \u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430, \u0437\u0430\u0432\u0456\u0442\u0430\u0439\u0442\u0435 \u043f\u0456\u0437\u043d\u0456\u0448\u0435.',
    'availability.maintenance.eyebrow': '\u0422\u0435\u0445\u043d\u0456\u0447\u043d\u0456 \u0440\u043e\u0431\u043e\u0442\u0438',
    'availability.maintenance.title': '\u041c\u0438 \u043f\u0440\u043e\u0432\u043e\u0434\u0438\u043c\u043e \u043d\u0435\u0432\u0435\u043b\u0438\u043a\u0435 \u043e\u043d\u043e\u0432\u043b\u0435\u043d\u043d\u044f',
    'availability.maintenance.message': '\u0421\u0430\u0439\u0442 \u0442\u0438\u043c\u0447\u0430\u0441\u043e\u0432\u043e \u0432 \u0440\u0435\u0436\u0438\u043c\u0456 \u0442\u0435\u0445\u043d\u0456\u0447\u043d\u043e\u0433\u043e \u043e\u0431\u0441\u043b\u0443\u0433\u043e\u0432\u0443\u0432\u0430\u043d\u043d\u044f. \u041f\u043e\u0432\u0435\u0440\u0442\u0430\u0439\u0442\u0435\u0441\u044c \u0437\u043e\u0432\u0441\u0456\u043c \u0441\u043a\u043e\u0440\u043e.',
    'availability.closed.eyebrow': '\u0422\u0438\u043c\u0447\u0430\u0441\u043e\u0432\u043e \u0437\u0430\u0447\u0438\u043d\u0435\u043d\u043e',
    'availability.closed.title': '\u041c\u0438 \u0442\u0438\u043c\u0447\u0430\u0441\u043e\u0432\u043e \u0437\u0430\u0447\u0438\u043d\u0435\u043d\u0456',
    'availability.closed.message': '\u0421\u0430\u0439\u0442 \u0442\u0438\u043c\u0447\u0430\u0441\u043e\u0432\u043e \u0437\u0430\u0447\u0438\u043d\u0435\u043d\u0438\u0439. \u0411\u0443\u0434\u044c \u043b\u0430\u0441\u043a\u0430, \u0437\u0430\u0432\u0456\u0442\u0430\u0439\u0442\u0435 \u043f\u0456\u0437\u043d\u0456\u0448\u0435.',
    'availability.until': '\u041e\u0447\u0456\u043a\u0443\u0454\u043c\u043e \u0434\u043e',
    'availability.site': '\u0421\u0430\u0439\u0442',
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
    'nav.photoGallery': 'Gallery',
    'nav.contacts': 'Contacts',
    'btn.book': 'Book Now',
    'hero.subtitle': 'Experience the finest grooming and beauty services tailored just for you.',
    'hero.eyebrow': 'Beauty salon',
    'hero.imageCaption': 'Calm appointments, clean lines, considered details.',
    'hero.imageLabel': 'Studio',
    'business.defaultName': 'Beauty salon',
    'business.defaultDescription': 'Beauty and care services tailored just for you.',
    'services.title': 'Our Services',
    'services.description': 'A concise service menu with clear descriptions, duration, and prices.',
    'services.baseCategories': 'Services',
    'services.kicker': 'Menu',
    'services.empty': 'No services available at the moment.',
    'services.priceOnRequest': 'Price on request',
    'gallery.title': 'Our Work',
    'gallery.empty': 'No images available in the gallery.',
    'gallery.filterAll': 'All',
    'gallery.openImage': 'Open photo',
    'gallery.kicker': 'Work',
    'gallery.close': 'Close',
    'gallery.previousImage': 'Previous photo',
    'gallery.nextImage': 'Next photo',
    'contacts.title': 'Contacts',
    'contacts.subtitle': 'Visit Us',
    'contacts.description': 'Ready for a transformation? Book your appointment today or drop by our salon. We look forward to welcoming you.',
    'contacts.address': 'Address',
    'contacts.phone': 'Phone',
    'contacts.email': 'Email',
    'contacts.hours': 'Working Hours',
    'contacts.social': 'Social Media',
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
    'contacts.formError': 'Failed to send message.',
    'services.requestService': 'Request appointment',
    'contacts.formEmailOptional': 'Email (optional)',
    'contacts.formService': 'Service',
    'contacts.formServicePlaceholder': 'Choose a service',
    'contacts.formPreferredDate': 'Preferred date',
    'contacts.formPreferredTime': 'Preferred time',
    'contacts.formPreferredTimeLabel': 'Time flexibility',
    'contacts.formPreferredTimeExact': 'Exact time',
    'contacts.formPreferredTimeMorning': 'Morning',
    'contacts.formPreferredTimeAfternoon': 'Afternoon',
    'contacts.formPreferredTimeEvening': 'Evening',
    'contacts.formPreferredTimeAny': 'Any time',
    'contacts.formSendRequest': 'Send request',
    'contacts.formSuccess': 'Message sent successfully!',
    'contacts.formAppointmentSuccess': 'Thank you! We will contact you to clarify the details and confirm whether the selected time is available.',
    'services.viewAll': 'View All Services',
    'gallery.viewAll': 'View Full Gallery',
    'footer.contact': 'Contact',
    'footer.social': 'Social',
    'footer.allRightsReserved': 'All rights reserved.',
    'footer.poweredBy': 'Powered by',
    'footer.platformName': 'Your Platform',
    'availability.suspended.eyebrow': 'Unavailable',
    'availability.suspended.title': 'This site is currently unavailable',
    'availability.suspended.message': 'The site is temporarily unavailable. Please check back later.',
    'availability.maintenance.eyebrow': 'Maintenance',
    'availability.maintenance.title': 'We are doing a little maintenance',
    'availability.maintenance.message': 'The site is temporarily in maintenance mode. Please come back soon.',
    'availability.closed.eyebrow': 'Temporarily closed',
    'availability.closed.title': 'We are temporarily closed',
    'availability.closed.message': 'The site is temporarily closed. Please check back later.',
    'availability.until': 'Expected until',
    'availability.site': 'Site',
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
    'nav.photoGallery': 'Galerie',
    'nav.contacts': 'Kontakty',
    'btn.book': 'Rezervovat',
    'hero.subtitle': 'Zažijte ty nejlepší služby v oblasti péče a krásy přizpůsobené přímo vám.',
    'hero.eyebrow': 'Salon krásy',
    'hero.imageCaption': 'Klidné rezervace, čisté linie a promyšlené detaily.',
    'hero.imageLabel': 'Studio',
    'business.defaultName': 'Salon krásy',
    'business.defaultDescription': 'Služby péče a krásy přizpůsobené přímo vám.',
    'services.title': 'Naše Služby',
    'services.description': 'Přehledná nabídka služeb s popisem, délkou a cenami.',
    'services.baseCategories': 'Služby',
    'services.kicker': 'Menu',
    'services.empty': 'Momentálně nejsou k dispozici žádné služby.',
    'services.priceOnRequest': 'Cena na vyžádání',
    'gallery.title': 'Naše Práce',
    'gallery.empty': 'V galerii nejsou k dispozici žádné obrázky.',
    'gallery.filterAll': 'Vše',
    'gallery.openImage': 'Otevřít fotku',
    'gallery.kicker': 'Práce',
    'gallery.close': 'Zavřít',
    'gallery.previousImage': 'Předchozí fotka',
    'gallery.nextImage': 'Další fotka',
    'contacts.title': 'Kontakty',
    'contacts.subtitle': 'Navštivte nás',
    'contacts.description': 'Jste připraveni na transformaci? Rezervujte si termín ještě dnes nebo se zastavte v našem salonu. Těšíme se na vás.',
    'contacts.address': 'Adresa',
    'contacts.phone': 'Telefon',
    'contacts.email': 'E-mail',
    'contacts.hours': 'Pracovní doba',
    'contacts.social': 'Sociální sítě',
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
    'contacts.formError': 'Zprávu se nepodařilo odeslat.',
    'services.requestService': 'Žádost o termín',
    'contacts.formEmailOptional': 'E-mail (volitelné)',
    'contacts.formService': 'Služba',
    'contacts.formServicePlaceholder': 'Vyberte službu',
    'contacts.formPreferredDate': 'Preferované datum',
    'contacts.formPreferredTime': 'Preferovaný čas',
    'contacts.formPreferredTimeLabel': 'Flexibilita času',
    'contacts.formPreferredTimeExact': 'Přesný čas',
    'contacts.formPreferredTimeMorning': 'Ráno',
    'contacts.formPreferredTimeAfternoon': 'Odpoledne',
    'contacts.formPreferredTimeEvening': 'Večer',
    'contacts.formPreferredTimeAny': 'Kdykoliv',
    'contacts.formSendRequest': 'Odeslat žádost',
    'contacts.formSuccess': 'Zpráva byla úspěšně odeslána!',
    'contacts.formAppointmentSuccess': 'Děkujeme! Ozveme se vám, upřesníme detaily a potvrdíme, zda je vybraný čas volný.',
    'services.viewAll': 'Zobrazit všechny služby',
    'gallery.viewAll': 'Zobrazit celou galerii',
    'footer.contact': 'Kontakt',
    'footer.social': 'Sociální sítě',
    'footer.allRightsReserved': 'Všechna práva vyhrazena.',
    'footer.poweredBy': 'Poháněno',
    'footer.platformName': 'Vaší platformou',
    'availability.suspended.eyebrow': 'Nedostupn\u00e9',
    'availability.suspended.title': 'Tento web je moment\u00e1ln\u011b nedostupn\u00fd',
    'availability.suspended.message': 'Web je do\u010dasn\u011b nedostupn\u00fd. Zkuste to pros\u00edm pozd\u011bji.',
    'availability.maintenance.eyebrow': '\u00dadr\u017eba',
    'availability.maintenance.title': 'Prov\u00e1d\u00edme drobnou \u00fadr\u017ebu',
    'availability.maintenance.message': 'Web je do\u010dasn\u011b v re\u017eimu \u00fadr\u017eby. Vra\u0165te se pros\u00edm brzy.',
    'availability.closed.eyebrow': 'Do\u010dasn\u011b zav\u0159eno',
    'availability.closed.title': 'Jsme do\u010dasn\u011b zav\u0159eni',
    'availability.closed.message': 'Web je do\u010dasn\u011b zav\u0159en\u00fd. Zkuste to pros\u00edm pozd\u011bji.',
    'availability.until': 'O\u010dek\u00e1v\u00e1me do',
    'availability.site': 'Web',
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
  availableLocales,
  persistLocale = true,
  localizedPaths = false,
}: { 
  children: React.ReactNode; 
  defaultLocale: string; 
  availableLocales: string[];
  persistLocale?: boolean;
  localizedPaths?: boolean;
}) {
  const localeCodes = useMemo(() => getAvailableLocaleCodes(availableLocales), [availableLocales]);
  const initialLocale = useMemo(
    () => getDefaultLocaleCode(defaultLocale, localeCodes),
    [defaultLocale, localeCodes],
  );
  const [locale, setLocaleState] = useState(initialLocale);

  useEffect(() => {
    if (!persistLocale) return;

    try {
      const savedLocale = localStorage.getItem('locale');
      if (savedLocale && localeCodes.includes(savedLocale)) {
        setTimeout(() => setLocaleState(savedLocale), 0);
      }
    } catch (e) {
      console.warn('localStorage is not available:', e);
    }
  }, [localeCodes, persistLocale]);

  const setLocale = (newLocale: string) => {
    if (!localeCodes.includes(newLocale)) return;

    setLocaleState(newLocale);
    if (!persistLocale) return;

    try {
      localStorage.setItem('locale', newLocale);
    } catch (e) {
      console.warn('localStorage is not available:', e);
    }
  };

  const t = (key: string) => {
    return translations[locale]?.[key] || translations['en']?.[key] || key;
  };

  const localePath = (href: string = '/') => localizedPaths ? localizedPath(locale, href) : href;

  return (
    <LocaleContext.Provider value={{ locale, setLocale, availableLocales: localeCodes, t, localePath, localizedPaths }}>
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
