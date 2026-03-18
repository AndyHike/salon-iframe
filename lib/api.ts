const adminApiUrl = process.env.ADMIN_API_URL;
const masterKey = process.env.SYSTEM_MASTER_KEY;

export async function fetchStoreData(path: string, params: Record<string, string>, domain: string) {
  if (!domain || domain === 'favicon.ico' || domain === 'robots.txt' || domain === 'sitemap.xml' || domain.includes('.png') || domain.includes('.jpg')) {
    return null;
  }
  if (!adminApiUrl || !masterKey) return null;
  
  try {
    const cleanApiUrl = adminApiUrl.endsWith('/') ? adminApiUrl.slice(0, -1) : adminApiUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${cleanApiUrl}${cleanPath}`);
    url.searchParams.append('domain', domain);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value);
    }
    
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${masterKey.trim()}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 10 }
    });
    
    if (!res.ok) {
      console.error(`API Error ${path}: ${res.statusText}`);
      return null;
    }
    
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (e) {
    console.error(`Fetch error ${path}:`, e);
    return null;
  }
}

export interface StoreData {
  domain: string;
  categories: any[];
  galleryItems: any[];
  servicesData: any[];
  settings: any;
}

export async function getStoreData(domain: string): Promise<StoreData> {
  const [categories, galleryItems, settings] = await Promise.all([
    getCategories(domain),
    getItems(domain, 'gallery'),
    getSettings(domain)
  ]);

  const servicesCategory = categories?.find((c: any) => c.slug === 'services');
  const serviceSubcategories = categories?.filter((c: any) => c.parentId === servicesCategory?.id) || [];
  
  let servicesData: any = [];
  if (serviceSubcategories.length > 0) {
    servicesData = await Promise.all(serviceSubcategories.map(async (sub: any) => {
      const items = await getItems(domain, sub.slug);
      return { category: sub, items: items || [] };
    }));
  } else if (servicesCategory) {
    const items = await getItems(domain, 'services');
    if (items && items.length > 0) {
      servicesData = [{ category: servicesCategory, items }];
    }
  }

  return {
    domain,
    categories: categories || [],
    galleryItems: galleryItems || [],
    servicesData,
    settings: settings || {}
  };
}
export async function getCategories(domain: string) {
  const data = await fetchStoreData('/api/public/v1/categories', {}, domain);
  return data || getMockCategories();
}

export async function getItems(domain: string, categorySlug?: string) {
  const params: Record<string, string> = {};
  if (categorySlug) {
    params.categorySlug = categorySlug;
  }
  const data = await fetchStoreData('/api/public/v1/items', params, domain);
  return data || getMockItems(categorySlug);
}

export async function getSettings(domain: string) {
  const data = await fetchStoreData('/api/public/v1/settings', {}, domain);
  return data || getMockSettings();
}

function getMockCategories() {
  return [
    { id: 'c1', slug: 'services', title: { uk: 'Послуги', en: 'Services' }, parentId: null },
    { id: 'c2', slug: 'haircut', title: { uk: 'Стрижки', en: 'Haircuts' }, parentId: 'c1' },
    { id: 'c3', slug: 'coloring', title: { uk: 'Фарбування', en: 'Coloring' }, parentId: 'c1' },
    { id: 'c4', slug: 'gallery', title: { uk: 'Галерея', en: 'Gallery' }, parentId: null }
  ];
}

function getMockItems(categorySlug?: string) {
  if (categorySlug === 'gallery') {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: `g${i}`,
      images: [{ filePath: `https://picsum.photos/seed/gallery${i}/600/600` }]
    }));
  }
  if (categorySlug === 'haircut') {
    return [
      { id: 'h1', title: { uk: 'Чоловіча стрижка', en: 'Men Haircut' }, price: '400', description: { uk: 'Класична стрижка', en: 'Classic cut' } },
      { id: 'h2', title: { uk: 'Дитяча стрижка', en: 'Kids Haircut' }, price: '300', description: { uk: 'Для дітей до 12 років', en: 'For kids under 12' } }
    ];
  }
  if (categorySlug === 'coloring') {
    return [
      { id: 'c1', title: { uk: 'Мелірування', en: 'Highlights' }, price: '1200', description: { uk: 'Часткове освітлення', en: 'Partial lightening' } }
    ];
  }
  return [];
}

function getMockSettings() {
  return {
    locales: ['uk', 'en', 'cs'],
    defaultLocale: 'uk',
    workingHours: {
      byAppointment: false,
      days: [
        { day: 'monday', open: '09:00', close: '18:00', isClosed: false },
        { day: 'tuesday', open: '09:00', close: '18:00', isClosed: false },
        { day: 'wednesday', open: '09:00', close: '18:00', isClosed: false },
        { day: 'thursday', open: '09:00', close: '18:00', isClosed: false },
        { day: 'friday', open: '09:00', close: '18:00', isClosed: false },
        { day: 'saturday', open: '10:00', close: '16:00', isClosed: false },
        { day: 'sunday', open: '10:00', close: '16:00', isClosed: true }
      ]
    }
  };
}
