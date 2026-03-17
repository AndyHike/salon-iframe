'use client';

import { useState } from 'react';
import { SiteData } from '@/lib/getSiteData';
import { StoreData } from '@/lib/api';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { sendMessage } from '@/app/actions';

export function Contacts({ siteData, storeData }: { siteData: SiteData; storeData: StoreData }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const settings = storeData.settings || {};
  const workingHours = settings.workingHours?.days || [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const result = await sendMessage(storeData.domain, formData);
    
    if (result.success) {
      setStatus('success');
      setMessage(result.message || 'Message sent successfully!');
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus('error');
      setMessage(result.error || 'Failed to send message.');
    }
  };

  return (
    <section id="contacts" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-6">Visit Us</h2>
            <p className="text-stone-600 mb-8">
              Ready for a transformation? Book your appointment today or drop by our salon. We look forward to welcoming you.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-[var(--primary-color)]"><MapPin size={24} /></div>
                <div>
                  <h4 className="font-semibold text-stone-900">Address</h4>
                  <p className="text-stone-600">{settings.address || '123 Beauty Blvd, Style City, SC 12345'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 text-[var(--primary-color)]"><Phone size={24} /></div>
                <div>
                  <h4 className="font-semibold text-stone-900">Phone</h4>
                  <p className="text-stone-600">{settings.phone || '+1 (555) 123-4567'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 text-[var(--primary-color)]"><Mail size={24} /></div>
                <div>
                  <h4 className="font-semibold text-stone-900">Email</h4>
                  <p className="text-stone-600">{settings.email || `hello@${siteData.name?.toLowerCase().replace(/\s+/g, '') || 'salon'}.com`}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 text-[var(--primary-color)]"><Clock size={24} /></div>
                <div>
                  <h4 className="font-semibold text-stone-900">Hours</h4>
                  <div className="text-stone-600">
                    {settings.workingHours?.byAppointment ? (
                      <p>By appointment only</p>
                    ) : workingHours.length > 0 ? (
                      <ul className="space-y-1">
                        {workingHours.map((day: any) => (
                          <li key={day.day} className="capitalize">
                            {day.day}: {day.isClosed ? 'Closed' : `${day.open} - ${day.close}`}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Mon-Fri: 9am - 8pm<br/>Sat-Sun: 10am - 6pm</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 shadow-sm">
            <h3 className="text-2xl font-bold text-stone-900 mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                <input name="name" required type="text" className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                <input name="email" required type="email" className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                <input name="phone" type="tel" className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" placeholder="Your phone number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                <textarea name="message" required rows={4} className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" placeholder="How can we help you?"></textarea>
              </div>
              
              {status === 'success' && <p className="text-green-600 text-sm">{message}</p>}
              {status === 'error' && <p className="text-red-600 text-sm">{message}</p>}
              
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full py-3 text-white font-medium transition-opacity hover:opacity-90 shadow-md bg-[var(--primary-color)] disabled:opacity-50"
                style={{ borderRadius: 'var(--btn-radius)' }}
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
