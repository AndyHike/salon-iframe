import { SiteData } from '@/lib/getSiteData';
import { StoreData } from '@/lib/api';

export function Footer({ siteData, storeData }: { siteData: SiteData; storeData: StoreData }) {
  const settings = storeData.settings || {};
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">{siteData.name || 'Premium Salon'}</h3>
            <p className="mb-4 max-w-xs">{siteData.description || 'Experience the finest grooming and beauty services tailored just for you.'}</p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              {settings.address && <li>{settings.address}</li>}
              {settings.phone && <li>{settings.phone}</li>}
              {settings.email && <li>{settings.email}</li>}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Social</h4>
            <ul className="space-y-2">
              {settings.socialLinks?.instagram && (
                <li><a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
              )}
              {settings.socialLinks?.facebook && (
                <li><a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Facebook</a></li>
              )}
              {settings.socialLinks?.tiktok && (
                <li><a href={settings.socialLinks.tiktok} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">TikTok</a></li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-stone-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {currentYear} {siteData.name || 'Premium Salon'}. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Powered by <span className="text-white font-semibold">Your Platform</span></p>
        </div>
      </div>
    </footer>
  );
}
