import React, { useState } from 'react';
import { MapPin, Navigation, Home, Waves, Trees, Sparkles, Copy, Check } from 'lucide-react';
import { BotanicalDivider } from './BespokeIcons';

export default function VenueSection() {
  const [copiedText, setCopiedText] = useState('');
  const [activeSubVenue, setActiveSubVenue] = useState('the-deck');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2500);
  };

  const SUB_VENUES = [
    {
      id: 'the-deck',
      name: 'The Deck – Lake Side',
      tagline: 'Scenic Lakeside Promenade',
      icon: Waves,
      events: 'Barat Prasthan, Varmala aur Phere (The Wedding)',
      description: 'Tranquil open-air deck along the water with panoramic vistas, hosting the sacred Vedic Phere.'
    },
    {
      id: 'the-pool-side',
      name: 'The Pool Side – Courtyard',
      tagline: 'Sunlit Courtyard & Cabanas',
      icon: Sparkles,
      events: 'Rangrez Haldi Carnival, Phool & Pool Party',
      description: 'Festive marigold courtyard with refreshing mist, music, and poolside lunch feast.'
    },
    {
      id: 'the-hut',
      name: 'The Hut – Garden Estate',
      tagline: 'Manicured Lawns & Pavilion',
      icon: Trees,
      events: 'Ganesh Poojan, Sangeet & Sajan Goth Lunch',
      description: 'Expansive wooden pavilion surrounded by lush emerald greenery for musical nights and royal banquets.'
    }
  ];

  return (
    <section id="venue-section" className="relative py-24 px-6 bg-[#F7F4EE] text-[#0C223B] overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#B8A072]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-14">
          <span className="font-cormorant uppercase text-xs tracking-[0.35em] text-[#9A8052] font-semibold">
            Location &amp; Concierge
          </span>
          <h3 className="font-cormorant text-4xl sm:text-5xl font-light text-[#0C223B] mt-2 tracking-tight">
            The Wedding Destination
          </h3>
          <p className="font-cormorant italic text-[#4A6278] text-base max-w-md mx-auto mt-2">
            The Waterstone Resort • Nagpur Road, Chhindwara, Madhya Pradesh
          </p>
          <BotanicalDivider className="w-full max-w-xs mx-auto my-5 text-[#B8A072]" />
        </div>

        {/* Grid: Resort Card + Residence Concierge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Resort Card (Warm Handmade Cotton-Ivory Card) */}
          <div className="lg:col-span-7 bg-[#FAF8F5] rounded-3xl p-7 sm:p-9 border border-[#B8A072]/30 shadow-quiet-luxury relative overflow-hidden">
            {/* Inner Hairline Accent */}
            <div className="absolute inset-2 sm:inset-3 border border-[#B8A072]/20 rounded-[20px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[#9A8052] font-cormorant uppercase text-xs tracking-[0.2em] font-semibold mb-2">
                <MapPin className="w-3.5 h-3.5 text-[#0C223B]" />
                <span>Primary Venue</span>
              </div>

              <h4 className="font-cormorant text-3xl font-normal text-[#0C223B] mb-1">
                The Waterstone Resort
              </h4>

              <p className="text-xs sm:text-sm text-[#4A6278] font-sans mb-5">
                Nagpur Road, Chhindwara, Madhya Pradesh, 480001, India
              </p>

              {/* Embedded Map */}
              <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#B8A072]/30 mb-6 bg-[#EFECE4] shadow-inner">
                <iframe
                  title="The Waterstone Resort Chhindwara Google Map"
                  src="https://maps.google.com/maps?q=The+Waterstone+Resort+Nagpur+Road+Chhindwara+Madhya+Pradesh+480001&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=The+Waterstone+Resort+Nagpur+Road+Chhindwara+Madhya+Pradesh+480001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0C223B] text-[#FAF8F5] font-cormorant uppercase tracking-[0.15em] text-xs font-semibold hover:bg-[#143256] shadow-sm transition-all border border-[#B8A072]/30"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#B8A072]" />
                  <span>Get Directions (Google Maps)</span>
                </a>

                <button
                  onClick={() => copyToClipboard('The Waterstone Resort, Nagpur Road, Chhindwara, Madhya Pradesh, 480001, India', 'resort')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#B8A072]/40 text-[#0C223B] font-cormorant uppercase tracking-[0.15em] text-xs font-medium hover:bg-[#EFECE4] transition-all"
                >
                  {copiedText === 'resort' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-[#9A8052]" />}
                  <span>{copiedText === 'resort' ? 'Copied' : 'Copy Address'}</span>
                </button>
              </div>

              {/* Resort Campus Mini Guide */}
              <div className="mt-8 pt-6 border-t border-[#B8A072]/25">
                <span className="font-cormorant uppercase text-xs tracking-[0.2em] text-[#9A8052] font-semibold block mb-3">
                  Resort Campus Spot Guide
                </span>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {SUB_VENUES.map((sub) => {
                    const isSelected = activeSubVenue === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setActiveSubVenue(sub.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                          isSelected 
                            ? 'border-[#0C223B] bg-[#0C223B] text-[#FAF8F5] font-medium shadow-sm' 
                            : 'border-[#B8A072]/30 bg-[#EFECE4] text-[#4A6278] hover:border-[#B8A072]'
                        }`}
                      >
                        <span className="block truncate font-cormorant text-sm">{sub.name.split('–')[0]}</span>
                      </button>
                    );
                  })}
                </div>

                {(() => {
                  const current = SUB_VENUES.find(s => s.id === activeSubVenue) || SUB_VENUES[0];
                  return (
                    <div className="p-4 rounded-xl bg-[#EFECE4] border border-[#B8A072]/30 text-xs font-sans text-[#0C223B]">
                      <div className="font-cormorant text-base font-semibold text-[#0C223B] mb-1">{current.name}</div>
                      <p className="text-[#4A6278] mb-2">{current.description}</p>
                      <span className="inline-block px-2.5 py-0.5 rounded bg-[#FAF8F5] text-[11px] font-medium text-[#0C223B] border border-[#B8A072]/20">
                        Event: {current.events}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Residence & Travel Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Residence Card (Warm Handmade Cotton-Ivory Card) */}
            <div className="bg-[#FAF8F5] rounded-3xl p-7 border border-[#B8A072]/30 shadow-quiet-luxury relative overflow-hidden">
              <div className="absolute inset-2 border border-[#B8A072]/20 rounded-[20px] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[#9A8052] font-cormorant uppercase text-xs tracking-[0.2em] font-semibold mb-2">
                  <Home className="w-3.5 h-3.5 text-[#0C223B]" />
                  <span>Residence RSVP</span>
                </div>

                <h4 className="font-cormorant text-2xl font-normal text-[#0C223B] mb-1">
                  Dr. Nidhi &amp; Mr. Manish Baluapuri
                </h4>
                <p className="font-cormorant italic text-xs text-[#4A6278] mb-4">
                  White Bungalow
                </p>

                <div className="p-4 rounded-2xl bg-[#EFECE4] border border-[#B8A072]/25 text-xs font-sans text-[#0C223B] leading-relaxed mb-4">
                  <p>House No. 89, White Bungalow,</p>
                  <p>Maharishi Valmiki Ward, Adarsh Nagar,</p>
                  <p>Parasia Road, Chhindwara, Madhya Pradesh 480001.</p>
                </div>

                <div className="flex gap-2">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=House+89+White+Bungalow+Adarsh+Nagar+Parasia+Road+Chhindwara+Madhya+Pradesh+480001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-full border border-[#B8A072]/40 bg-[#EFECE4] text-[#0C223B] hover:bg-[#FAF8F5] font-cormorant uppercase tracking-[0.15em] text-xs font-medium text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Navigation className="w-3 h-3 text-[#0C223B]" />
                    <span>Map</span>
                  </a>

                  <button
                    onClick={() => copyToClipboard('House No. 89, White Bungalow, Maharishi Valmiki Ward, Adarsh Nagar, Parasia Road, Chhindwara, Madhya Pradesh 480001', 'home')}
                    className="px-4 py-2 rounded-full border border-[#B8A072]/40 text-[#0C223B] font-cormorant uppercase tracking-[0.15em] text-xs font-medium hover:bg-[#EFECE4] transition-all flex items-center justify-center gap-1"
                  >
                    {copiedText === 'home' ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3 text-[#9A8052]" />}
                    <span>{copiedText === 'home' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Travel Assistance Dock - Deep Royal Sapphire Velvet Card */}
            <div className="p-7 rounded-3xl bg-[#0C223B] text-[#FAF8F5] border border-[#B8A072]/40 shadow-quiet-luxury relative overflow-hidden">
              <div className="absolute inset-2 border border-[#B8A072]/25 rounded-[20px] pointer-events-none" />

              <div className="relative z-10">
                <h4 className="font-cormorant text-2xl font-light text-[#EFECE4] mb-1">
                  Travel Assistance
                </h4>
                <p className="text-xs text-[#FAF8F5]/75 font-sans leading-relaxed mb-4">
                  Airport: Nagpur International Airport (NAG) ~ 125 km (2.5 hrs). Stations: Chhindwara (CWA) &amp; Nagpur (NGP).
                </p>

                <div className="space-y-2 text-xs font-sans">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/10 hover:border-[#B8A072]/50 transition-colors">
                    <span className="text-[#FAF8F5]/90">Main Host Desk</span>
                    <a href="tel:+919425006278" className="font-semibold text-[#D5C4A1] hover:underline">
                      +91 9425006278
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/10 hover:border-[#B8A072]/50 transition-colors">
                    <span className="text-[#FAF8F5]/90">Guest Care &amp; Rooms</span>
                    <a href="tel:+918454046248" className="font-semibold text-[#D5C4A1] hover:underline">
                      +91 8454046248
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/10 hover:border-[#B8A072]/50 transition-colors">
                    <span className="text-[#FAF8F5]/90">Logistics &amp; Arrival</span>
                    <a href="tel:+918623876930" className="font-semibold text-[#D5C4A1] hover:underline">
                      +91 8623876930
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
