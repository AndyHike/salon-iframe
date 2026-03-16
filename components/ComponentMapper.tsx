import { Hero } from './Hero';
import { ServicesList } from './ServicesList';
import { GalleryGrid } from './GalleryGrid';
import { Contacts } from './Contacts';
import { SiteData } from '@/lib/getSiteData';

const componentMap: Record<string, React.ComponentType<{ siteData: SiteData }>> = {
  hero: Hero,
  services: ServicesList,
  gallery: GalleryGrid,
  contacts: Contacts,
};

export function ComponentMapper({ name, siteData }: { name: string; siteData: SiteData }) {
  const Component = componentMap[name];

  if (!Component) {
    console.warn(`Unknown component: ${name}`);
    return null;
  }

  return <Component siteData={siteData} />;
}
