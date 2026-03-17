import { SiteData } from '@/lib/getSiteData';
import { StoreData } from '@/lib/api';

export function ServicesList({ siteData, storeData }: { siteData: SiteData; storeData: StoreData }) {
  const servicesData = storeData.servicesData || [];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Our Services</h2>
          <div className="w-24 h-1 mx-auto rounded bg-[var(--primary-color)]"></div>
        </div>
        
        {servicesData.length === 0 ? (
          <p className="text-center text-stone-500">No services available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {servicesData.map((group: any, index: number) => (
              <div key={group.category?.id || index} className="bg-stone-50/50 p-8 rounded-3xl border border-stone-100">
                {group.category?.title && (
                  <h3 className="text-2xl font-serif text-stone-800 mb-8 border-b border-stone-200 pb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[var(--primary-color)]/10 flex items-center justify-center text-[var(--primary-color)] text-sm font-bold">
                      {index + 1}
                    </span>
                    {group.category.title.uk || group.category.title.en}
                  </h3>
                )}
                <div className="space-y-6">
                  {group.items.map((service: any) => (
                    <div key={service.id} className="flex flex-col group/item">
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-lg font-medium text-stone-900 group-hover/item:text-[var(--primary-color)] transition-colors">
                          {service.title?.uk || service.title?.en}
                        </h4>
                        <div className="flex-grow border-b-2 border-dotted border-stone-200 mx-4 opacity-50"></div>
                        <span className="text-lg font-semibold text-stone-900">
                          {service.price ? `${service.price} ₴` : 'Price on request'}
                        </span>
                      </div>
                      <p className="text-stone-500 text-sm pr-16 leading-relaxed">
                        {service.description?.uk || service.description?.en}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
