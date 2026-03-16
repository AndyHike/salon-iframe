import { SiteData } from '@/lib/getSiteData';

export function Hero({ siteData }: { siteData: SiteData }) {
  return (
    <section className="relative py-24 flex items-center justify-center min-h-[70vh] bg-stone-50 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 bg-[var(--primary-color)]"></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900 mb-6">
          {siteData.name || 'Premium Salon & Barbershop'}
        </h1>
        <p className="text-xl md:text-2xl text-stone-600 mb-10 max-w-2xl mx-auto">
          {siteData.description || 'Experience the finest grooming and beauty services tailored just for you.'}
        </p>
        <button className="px-8 py-4 rounded-full text-white font-medium text-lg transition-transform hover:scale-105 shadow-lg bg-[var(--primary-color)]">
          Book an Appointment
        </button>
      </div>
    </section>
  );
}
