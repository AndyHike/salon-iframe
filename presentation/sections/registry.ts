import { Hero } from './hero/Hero';
import { ServicesSection } from './services/ServicesSection';
import { PhotoGallerySection } from './photoGallery/PhotoGallerySection';
import { ContactsSection } from './contacts/ContactsSection';

export const sectionRegistry: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  services: ServicesSection,
  photoGallery: PhotoGallerySection,
  contacts: ContactsSection,
};
