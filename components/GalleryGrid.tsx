import { SiteData } from '@/lib/getSiteData';
import { StoreData } from '@/lib/api';
import Image from 'next/image';

export function GalleryGrid({ siteData, storeData }: { siteData: SiteData; storeData: StoreData }) {
  const galleryItems = storeData.galleryItems || [];
  
  // Extract all images from gallery items
  const images = galleryItems.flatMap(item => item.images || []);
  const layout = siteData.galleryLayout || 'grid';

  return (
    <section id="gallery" className="py-24 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Gallery</h2>
          <div className="w-24 h-1 mx-auto rounded bg-[var(--primary-color)]"></div>
        </div>
        
        {images.length === 0 ? (
          <p className="text-center text-stone-500">No images available in the gallery.</p>
        ) : (
          <>
            {layout === 'grid' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {images.map((image: any, i: number) => (
                  <div key={image.id || i} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
                    <Image
                      src={image.filePath || `https://picsum.photos/seed/${siteData.id}-${i}/600/600`}
                      alt={`Gallery image ${i}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
            )}
            {layout === 'masonry' && (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 max-w-6xl mx-auto space-y-4">
                {images.map((image: any, i: number) => (
                  <div key={image.id || i} className="relative rounded-xl overflow-hidden group shadow-sm break-inside-avoid" style={{ aspectRatio: i % 3 === 0 ? '3/4' : i % 2 === 0 ? '4/3' : '1/1' }}>
                    <Image
                      src={image.filePath || `https://picsum.photos/seed/${siteData.id}-${i}/600/600`}
                      alt={`Gallery image ${i}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
            )}
            {layout === 'carousel' && (
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 max-w-6xl mx-auto hide-scrollbar">
                {images.map((image: any, i: number) => (
                  <div key={image.id || i} className="relative flex-none w-4/5 md:w-1/3 aspect-[4/5] rounded-xl overflow-hidden group shadow-sm snap-center">
                    <Image
                      src={image.filePath || `https://picsum.photos/seed/${siteData.id}-${i}/600/600`}
                      alt={`Gallery image ${i}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
