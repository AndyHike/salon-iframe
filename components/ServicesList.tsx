import { SiteData } from '@/lib/getSiteData';
import { Scissors, Sparkles, Droplets } from 'lucide-react';

const mockServices = [
  { id: 1, name: 'Classic Haircut', price: '$40', icon: Scissors, description: 'Precision cut with hot towel finish.' },
  { id: 2, name: 'Beard Trim', price: '$25', icon: Droplets, description: 'Detailed shaping and conditioning.' },
  { id: 3, name: 'Premium Facial', price: '$60', icon: Sparkles, description: 'Rejuvenating skin treatment.' },
];

export function ServicesList({ siteData }: { siteData: SiteData }) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Our Services</h2>
          <div className="w-24 h-1 mx-auto rounded bg-[var(--primary-color)]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {mockServices.map((service) => (
            <div key={service.id} className="p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow bg-stone-50 group">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110 bg-[var(--primary-color)] text-white">
                <service.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">{service.name}</h3>
              <p className="text-stone-500 mb-4">{service.description}</p>
              <p className="text-2xl font-bold text-[var(--primary-color)]">{service.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
