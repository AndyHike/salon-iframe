import type { AppearanceContract, BeautySalonPageData } from '../types';

export const beautySalonMinimalAppearanceFixture: AppearanceContract = {
  templateKey: 'beauty-salon',
  themeKey: 'beauty-salon-minimal',
  tokens: {
    primaryColor: '#111827',
    fontFamily: "'Inter', sans-serif",
    buttonStyle: 'soft',
    heroOverlay: 0.18,
    logoUrl: null,
    heroBackgroundImage: 'https://picsum.photos/seed/minimal-salon-hero/1400/1600',
  },
  layout: {
    blocks: ['hero', 'services', 'photoGallery', 'contacts'],
  },
  sectionVariants: {
    services: 'cards',
    photoGallery: 'masonry',
  },
  themeData: {},
};

export const beautySalonMinimalFixture: BeautySalonPageData = {
  settings: {
    companyName: 'Noir & Bloom',
    phone: '+1 202 555 0198',
    email: 'hello@noirandbloom.example',
    contactName: 'Minimal beauty studio for hair, skin, and quiet rituals.',
    address: '18 Linden Street, Studio 4',
    addressUrl: 'https://maps.google.com',
    defaultLocale: 'en',
    workingHours: 'Mon-Fri: 9:00 - 19:00\nSat: 10:00 - 16:00',
    instagramUrl: 'https://instagram.com',
    instagramActive: true,
    facebookActive: false,
    telegramUrl: 'https://t.me',
    telegramActive: true,
    availableLocales: [{ code: 'en', name: 'English' }],
    appearance: beautySalonMinimalAppearanceFixture,
  },
  appearance: beautySalonMinimalAppearanceFixture,
  servicesItems: [
    {
      id: 'service-cut',
      title: { en: 'Signature cut' },
      slug: 'signature-cut',
      description: { en: 'Shape, finish, and a calm consultation tailored to your daily routine.' },
      price: '$70',
    },
    {
      id: 'service-color',
      title: { en: 'Soft color refresh' },
      slug: 'soft-color-refresh',
      description: { en: 'Low-maintenance tone work with a natural finish and gloss.' },
      price: '$120',
    },
    {
      id: 'service-facial',
      title: { en: 'Hydration facial' },
      slug: 'hydration-facial',
      description: { en: 'A clean, restorative treatment for glow, texture, and comfort.' },
      price: '$95',
    },
    {
      id: 'service-brow',
      title: { en: 'Brow architecture' },
      slug: 'brow-architecture',
      description: { en: 'Measured shaping and tinting for a polished, natural line.' },
      price: '$45',
    },
    {
      id: 'service-ritual',
      title: { en: 'Evening ritual' },
      slug: 'evening-ritual',
      description: { en: 'Hair refresh, skin prep, and finishing details for special plans.' },
      price: '$150',
    },
  ],
  galleryItems: [
    {
      id: 'gallery-cut',
      title: { en: 'Signature cut work' },
      slug: 'signature-cut-work',
      linkedItems: [
        {
          id: 'gallery-cut-service-link',
          type: 'service',
          targetItem: {
            id: 'service-cut',
            title: { en: 'Signature cut' },
            slug: 'signature-cut',
            price: '$70',
          },
        },
      ],
      images: [
        {
          id: 'gallery-1',
          filePath: 'https://picsum.photos/seed/minimal-salon-1/900/1100',
          altText: 'Minimal salon chair and mirror',
        },
        {
          id: 'gallery-3',
          filePath: 'https://picsum.photos/seed/minimal-salon-3/900/1000',
          altText: 'Hair styling station',
        },
      ],
    },
    {
      id: 'gallery-color',
      title: { en: 'Color refresh work' },
      slug: 'color-refresh-work',
      linkedItems: [
        {
          id: 'gallery-color-service-link',
          type: 'service',
          targetItem: {
            id: 'service-color',
            title: { en: 'Soft color refresh' },
            slug: 'soft-color-refresh',
            price: '$120',
          },
        },
      ],
      images: [
        {
          id: 'gallery-2',
          filePath: 'https://picsum.photos/seed/minimal-salon-2/900/900',
          altText: 'Beauty products arranged on a shelf',
        },
        {
          id: 'gallery-4',
          filePath: 'https://picsum.photos/seed/minimal-salon-4/900/700',
          altText: 'Soft salon interior detail',
        },
      ],
    },
    {
      id: 'gallery-facial',
      title: { en: 'Hydration facial work' },
      slug: 'hydration-facial-work',
      linkedItems: [
        {
          id: 'gallery-facial-service-link',
          type: 'service',
          targetItem: {
            id: 'service-facial',
            title: { en: 'Hydration facial' },
            slug: 'hydration-facial',
            price: '$95',
          },
        },
      ],
      images: [
        {
          id: 'gallery-5',
          filePath: 'https://picsum.photos/seed/minimal-salon-5/900/1200',
          altText: 'Treatment room detail',
        },
        {
          id: 'gallery-6',
          filePath: 'https://picsum.photos/seed/minimal-salon-6/900/900',
          altText: 'Minimal beauty tools',
        },
      ],
    },
  ],
  availableLocales: [{ code: 'en', name: 'English' }],
  defaultLocale: 'en',
};
