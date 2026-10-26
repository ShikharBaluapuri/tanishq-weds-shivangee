import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Home, Phone, Waves, Trees, Sparkles, Copy, Check, Compass } from 'lucide-react';
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
    <section id="venue-section" className="relative py-24 px-4 sm:px-6 bg-[#F5F0E5] overflow-hidden bg-paper-texture">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header with Refined Scroll Reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <span className="font-cormorant uppercase text-xs tracking-[0.3em] text-[#657968] font-semibold">
            Location &amp; Concierge
          </span>
          <h3 className="font-cormorant text-4xl sm:text-5xl font-normal text-[#343F35] mt-2 tracking-tight">
            The Wedding Destination
          </h3>
          <p className="font-cormorant italic text-[#657968] text-base max-w-md mx-auto mt-2">
            The Waterstone Resort • Nagpur Road, Chhindwara, Madhya Pradesh
          </p>
          <BotanicalDivider className="w-full max-w-xs mx-auto my-5 text-[#C3A56B]" />
        </motion.div>

        {/* Grid: Resort Card + Residence Concierge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Resort Card */}
          <div className="lg:col-span-7 bg-[#FDFBF7] rounded-3xl p-7 sm:p-9 border border-[#C3A56B]/30 shadow-botanical">
            <div className="flex items-center gap-2 text-[#657968] font-cormorant uppercase text-xs tracking-[0.2em] font-semibold mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#41584C]" />
              <span>Primary Venue</span>
            </div>

            <h4 className="font-cormorant text-3xl font-medium text-[#343F35] mb-1">
              The Waterstone Resort
            </h4>

            <p className="text-xs sm:text-sm text-[#657968] font-sans mb-5">
              Nagpur Road, Chhindwara, Madhya Pradesh, 480001, India
            </p>

            {/* Embedded Map */}
            <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#C3A56B]/30 mb-6 bg-[#EAE2D3]">
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#41584C] text-[#F5F0E5] font-cormorant uppercase tracking-[0.15em] text-xs font-semibold hover:bg-[#2C3E34] transition-all"
              >
                <Navigation className="w-3.5 h-3.5 text-[#C3A56B]" />
                <span>Get Directions (Google Maps)</span>
              </a>

              <button
                onClick={() => copyToClipboard('The Waterstone Resort, Nagpur Road, Chhindwara, Madhya Pradesh, 480001, India', 'resort')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#C3A56B]/30 text-[#343F35] font-cormorant uppercase tracking-[0.15em] text-xs hover:bg-[#EAE2D3]/40 transition-all"
              >
                {copiedText === 'resort' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-[#C3A56B]" />}
                <span>{copiedText === 'resort' ? 'Copied' : 'Copy Address'}</span>
              </button>
            </div>

            {/* Resort Campus Spot Guide */}
            <div className="mt-8 pt-6 border-t border-[#C3A56B]/20">
              <span className="font-cormorant uppercase text-xs tracking-[0.2em] text-[#657968] font-semibold block mb-3">
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
                          ? 'border-[#41584C] bg-[#EAE2D3]/70 text-[#343F35] font-semibold' 
                          : 'border-[#C3A56B]/20 bg-white text-[#657968] hover:border-[#C3A56B]/40'
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
                  <div className="p-4 rounded-xl bg-[#EAE2D3]/50 border border-[#C3A56B]/20 text-xs font-sans text-[#343F35]">
                    <div className="font-cormorant text-base font-semibold text-[#343F35] mb-1">{current.name}</div>
                    <p className="text-[#657968] mb-2">{current.description}</p>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-white text-[11px] font-medium text-[#41584C] border border-[#C3A56B]/20">
                      Event: {current.events}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Residence & Travel Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Residence Card */}
            <div className="bg-[#FDFBF7] rounded-3xl p-7 border border-[#C3A56B]/30 shadow-botanical">
              <div className="flex items-center gap-2 text-[#657968] font-cormorant uppercase text-xs tracking-[0.2em] font-semibold mb-2">
                <Home className="w-3.5 h-3.5 text-[#41584C]" />
                <span>Residence RSVP</span>
              </div>

              <h4 className="font-cormorant text-2xl font-medium text-[#343F35] mb-1">
                Dr. Nidhi &amp; Mr. Manish Baluapuri
              </h4>
              <p className="font-cormorant italic text-xs text-[#657968] mb-4">
                White Bungalow
              </p>

              <div className="p-4 rounded-2xl bg-[#EAE2D3]/50 border border-[#C3A56B]/20 text-xs font-sans text-[#343F35] leading-relaxed mb-4">
                <p>House No. 89, White Bungalow,</p>
                <p>Maharishi Valmiki Ward, Adarsh Nagar,</p>
                <p>Parasia Road, Chhindwara, Madhya Pradesh 480001.</p>
              </div>

              <div className="flex gap-2">
                <a
                  href="https://maps.app.goo.gl/eeZJ91HzoFJ98fed7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-full border border-[#C3A56B]/30 bg-white text-[#343F35] hover:bg-[#EAE2D3]/40 font-cormorant uppercase tracking-[0.15em] text-xs text-center transition-all flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3 h-3 text-[#41584C]" />
                  <span>Map</span>
                </a>

                <button
                  onClick={() => copyToClipboard('House No. 89, White Bungalow, Maharishi Valmiki Ward, Adarsh Nagar, Parasia Road, Chhindwara, Madhya Pradesh 480001', 'home')}
                  className="px-4 py-2 rounded-full border border-[#C3A56B]/30 text-[#343F35] font-cormorant uppercase tracking-[0.15em] text-xs hover:bg-[#EAE2D3]/40 transition-all flex items-center justify-center gap-1"
                >
                  {copiedText === 'home' ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3 text-[#C3A56B]" />}
                  <span>{copiedText === 'home' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Travel Assistance Dock */}
            <div className="p-7 rounded-3xl bg-[#41584C] text-[#F5F0E5] border border-[#C3A56B]/30 shadow-botanical">
              <h4 className="font-cormorant text-xl font-medium text-[#F5F0E5] mb-1">
                Travel Assistance
              </h4>
              <p className="text-xs text-[#F5F0E5]/80 font-sans leading-relaxed mb-4">
                Airport: Nagpur International Airport (NAG) ~ 125 km (2.5 hrs). Stations: Chhindwara (CWA) &amp; Nagpur (NGP).
              </p>

              <div className="space-y-2.5 text-xs font-sans">
                {[
                  { name: 'Manish Baluapuri', phone: '+91 9425006278', tel: '+919425006278' },
                  { name: 'Shikhar Baluapuri', phone: '+91 8623876930', tel: '+918623876930' },
                  { name: 'Tanishq Baluapuri', phone: '+91 9167166675', tel: '+919167166675' }
                ].map((contact, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/10 border border-white/10 hover:border-[#C3A56B]/40 hover:bg-white/15 transition-all"
                  >
                    <span className="text-[#F5F0E5] font-medium tracking-wide">
                      {contact.name}
                    </span>
                    <a
                      href={`tel:${contact.tel}`}
                      className="inline-flex items-center gap-1.5 font-semibold text-[#E0CB9B] hover:text-white transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C3A56B]" />
                      <span>{contact.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
