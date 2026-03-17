import { Hero } from './Hero';
import { ServicesList } from './ServicesList';
import { GalleryGrid } from './GalleryGrid';
import { Contacts } from './Contacts';
import { SiteData } from '@/lib/getSiteData';
import { StoreData } from '@/lib/api';

const componentMap: Record<string, React.ComponentType<{ siteData: SiteData; storeData: StoreData }>> = {
  hero: Hero,
  services: ServicesList,
  gallery: GalleryGrid,
  contacts: Contacts,
};

export function ComponentMapper({ name, siteData, storeData }: { name: string; siteData: SiteData; storeData: StoreData }) {
  const Component = componentMap[name];

  if (!Component) {
    console.warn(`Unknown component: ${name}`);
    return null;
  }

  return <Component siteData={siteData} storeData={storeData} />;
}
