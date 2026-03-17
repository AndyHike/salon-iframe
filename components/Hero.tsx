import { SiteData } from '@/lib/getSiteData';

export function Hero({ siteData }: { siteData: SiteData }) {
  const hasBgImage = !!siteData.heroBackgroundImage;
  const overlayOpacity = siteData.heroOverlay !== undefined ? siteData.heroOverlay : 0.4;

  return (
    <section 
      className={`relative py-24 flex items-center justify-center min-h-[70vh] overflow-hidden ${hasBgImage ? 'bg-stone-900' : 'bg-stone-50'}`}
      style={hasBgImage ? { backgroundImage: `url(${siteData.heroBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {hasBgImage ? (
        <div className="absolute inset-0 z-0 bg-black" style={{ opacity: overlayOpacity }}></div>
      ) : (
        <div className="absolute inset-0 z-0 opacity-10 bg-[var(--primary-color)]"></div>
      )}
      
      <div className={`container mx-auto px-4 relative z-10 text-center ${hasBgImage ? 'text-white' : 'text-stone-900'}`}>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-md">
          {siteData.name || 'Premium Salon & Barbershop'}
        </h1>
        <p className={`text-xl md:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-md ${hasBgImage ? 'text-stone-100' : 'text-stone-600'}`}>
          {siteData.description || 'Experience the finest grooming and beauty services tailored just for you.'}
        </p>
        <button 
          className="px-8 py-4 text-white font-medium text-lg transition-transform hover:scale-105 shadow-lg bg-[var(--primary-color)]"
          style={{ borderRadius: 'var(--btn-radius)' }}
        >
          Book an Appointment
        </button>
      </div>
    </section>
  );
}
