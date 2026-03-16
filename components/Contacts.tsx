import { SiteData } from '@/lib/getSiteData';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function Contacts({ siteData }: { siteData: SiteData }) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">Visit Us</h2>
            <p className="text-stone-600 mb-8">
              Ready for a transformation? Book your appointment today or drop by our salon. We look forward to welcoming you.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-[var(--primary-color)]"><MapPin size={24} /></div>
                <div>
                  <h4 className="font-semibold text-stone-900">Address</h4>
                  <p className="text-stone-600">123 Beauty Blvd, Style City, SC 12345</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 text-[var(--primary-color)]"><Phone size={24} /></div>
                <div>
                  <h4 className="font-semibold text-stone-900">Phone</h4>
                  <p className="text-stone-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 text-[var(--primary-color)]"><Mail size={24} /></div>
                <div>
                  <h4 className="font-semibold text-stone-900">Email</h4>
                  <p className="text-stone-600">hello@{siteData.name?.toLowerCase().replace(/\s+/g, '') || 'salon'}.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 text-[var(--primary-color)]"><Clock size={24} /></div>
                <div>
                  <h4 className="font-semibold text-stone-900">Hours</h4>
                  <p className="text-stone-600">Mon-Fri: 9am - 8pm<br/>Sat-Sun: 10am - 6pm</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 shadow-sm">
            <h3 className="text-2xl font-bold text-stone-900 mb-6">Send a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                <input type="email" className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full py-3 rounded-lg text-white font-medium transition-opacity hover:opacity-90 shadow-md bg-[var(--primary-color)]">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
