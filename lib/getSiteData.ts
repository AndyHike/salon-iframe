export interface SiteData {
  id: string;
  storeId: string;
  primaryColor: string;
  fontFamily: string;
  layoutConfig: string | string[]; // Can be JSON string or array
  buttonStyle?: 'pill' | 'square' | 'soft';
  heroBackgroundImage?: string;
  heroOverlay?: number;
  galleryLayout?: 'grid' | 'masonry' | 'carousel';
  logoUrl: string | null;
  name?: string;
  description?: string;
}

export async function getSiteData(domain: string): Promise<SiteData | null> {
  const adminApiUrl = process.env.ADMIN_API_URL;
  const masterKey = process.env.SYSTEM_MASTER_KEY;

  if (!adminApiUrl || !masterKey) {
    console.warn('Missing ADMIN_API_URL or SYSTEM_MASTER_KEY. Using mock data for preview.');
    return getMockData(domain);
  }

  try {
    const cleanApiUrl = adminApiUrl.endsWith('/') ? adminApiUrl.slice(0, -1) : adminApiUrl;
    const res = await fetch(`${cleanApiUrl}/api/v1/internal/appearance?domain=${domain}`, {
      headers: {
        Authorization: `Bearer ${masterKey.trim()}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 10 }, // Cache for 10 seconds
    });

    if (!res.ok) {
      console.error(`Failed to fetch site data for ${domain}: ${res.statusText}`);
      return getMockData(domain); // Fallback to mock data for preview
    }

    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching site data for ${domain}:`, error);
    return getMockData(domain);
  }
}

function getMockData(domain: string): SiteData {
  // Generate a deterministic color based on the domain length for variety
  const colors = ['#0f172a', '#1e3a8a', '#831843', '#14532d', '#7c2d12'];
  const colorIndex = domain.length % colors.length;

  return {
    id: `mock-id-${domain}`,
    storeId: `mock-store-id-${domain}`,
    primaryColor: colors[colorIndex],
    fontFamily: "'Inter', sans-serif",
    layoutConfig: ['hero', 'services', 'gallery', 'contacts'],
    buttonStyle: 'pill',
    heroBackgroundImage: 'https://picsum.photos/seed/salon/1920/1080',
    heroOverlay: 0.4,
    logoUrl: null,
    name: `${domain.split('.')[0].toUpperCase()} Salon`,
    description: `Welcome to ${domain}, your premium beauty and grooming destination.`,
  };
}
