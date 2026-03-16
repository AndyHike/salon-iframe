import { SiteData } from '@/lib/getSiteData';
import Image from 'next/image';

export function GalleryGrid({ siteData }: { siteData: SiteData }) {
  return (
    <section className="py-24 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Gallery</h2>
          <div className="w-24 h-1 mx-auto rounded bg-[var(--primary-color)]"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
              <Image
                src={`https://picsum.photos/seed/${siteData.id}-${i}/600/600`}
                alt={`Gallery image ${i}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
