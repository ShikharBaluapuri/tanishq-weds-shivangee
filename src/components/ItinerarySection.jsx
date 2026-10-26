import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Sparkles, 
  Compass, 
  CalendarPlus,
  ChevronRight
} from 'lucide-react';
import { 
  BotanicalDivider, 
  MarigoldSprig, 
  CrescentMoonStar, 
  SacredLotus, 
  GaneshaIcon 
} from './BespokeIcons';

export default function ItinerarySection() {
  const [activeDay, setActiveDay] = useState(1); // 1: Sunday 14th Feb, 2: Monday 15th Feb

  // Soft botanical petal splash for Haldi
  const triggerHaldiPetals = (e) => {
    e.stopPropagation();
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#C3A56B', '#F5F0E5', '#EAE2D3', '#657968', '#E2CA94', '#A76D6B'],
      shapes: ['circle'],
      scalar: 1.2
    });
  };

  const createGoogleCalendarUrl = (event) => {
    const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const text = encodeURIComponent(event.title + ' • Tanishq & Shivangee Wedding');
    const details = encodeURIComponent(
      `${event.subtitle || ''}\nVenue: ${event.venue}\nTanishq weds Shivangee Celebrations.`
    );
    const location = encodeURIComponent(`${event.venue}, The Waterstone Resort, Chhindwara, MP`);
    const dates = `${event.calStart}/${event.calEnd}`;
    return `${base}&text=${text}&dates=${dates}&details=${details}&location=${location}`;
  };

  const downloadIcs = (event) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Tanishq and Shivangee Wedding//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title} - Tanishq & Shivangee Wedding`,
      `DESCRIPTION:${event.subtitle || ''} | Venue: ${event.venue}`,
      `LOCATION:${event.venue}, The Waterstone Resort, Chhindwara, MP`,
      `DTSTART:${event.calStart}`,
      `DTEND:${event.calEnd}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.id}_invitation.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const EVENTS_DATA = [
    // DAY 1 - SUNDAY 14TH FEB 2027
    {
      id: 'ganesh-poojan',
      day: 1,
      title: 'Ganesh Poojan, Mandap and Mamera',
      hindiTagline: '॥ श्री गणेशाय नमः ॥',
      subtitle: 'Auspicious beginnings, sacred Vedic chants, and family blessings.',
      time: '9:00 AM Onwards',
      venue: 'The Hut – Garden Estate',
      attire: 'Traditional Grace / Auspicious Tones',
      BadgeIcon: GaneshaIcon,
      calStart: '20270214T033000Z',
      calEnd: '20270214T063000Z',
    },
    {
      id: 'haldi-carnival',
      day: 1,
      title: 'Rangrez Haldi Carnival',
      hindiTagline: 'मेरे रंग में रंगने वाली...',
      subtitle: 'Haldi, Phool & Pool party followed by a delightful lunch feast.',
      time: '12:00 Noon Onwards',
      venue: 'The Pool Side – Courtyard',
      attire: 'Sunshine Yellow, Bohemian Flora & Poolside Breezy',
      BadgeIcon: MarigoldSprig,
      isInteractiveHaldi: true,
      hosts: 'Shikhar, Ishan, Adarsh & Dharma 🐾',
      calStart: '20270214T063000Z',
      calEnd: '20270214T103000Z',
    },
    {
      id: 'sham-e-sangeet',
      day: 1,
      title: 'Sham - e - Sangeet (Valentine’s Night)',
      hindiTagline: 'कभी तो किसी की दुल्हनीयां बनोगी... मुझसे शादी करोगी ??',
      romanticQuote: '“Will you be my Valentine…” to “It’s the time to Disco”',
      subtitle: 'Ring Ceremony at 6:00 PM with Aashish Vachan, followed by Cocktails, Music & Dinner.',
      time: '6:00 PM Onwards',
      venue: 'The Garden Estate',
      attire: 'Indo-Western Glamour & Evening Shimmer',
      BadgeIcon: CrescentMoonStar,
      hosts: 'Tanvi, Chetna - Tanay, Shrishti',
      calStart: '20270214T123000Z',
      calEnd: '20270214T183000Z',
    },

    // DAY 2 - MONDAY 15TH FEB 2027 (THE WEDDING)
    {
      id: 'the-royal-wedding',
      day: 2,
      title: 'The Royal Wedding (Shubh Vivah)',
      hindiTagline: '॥ वरमाला एवं पवित्र फेरे ॥',
      subtitle: 'Barat Prasthan at 9:00 AM • Varmala aur Vedic Phere at 10:00 AM amidst the serene lakeside view.',
      time: '9:00 AM Onwards',
      venue: 'The Deck – Lake side',
      attire: 'Regal Pastels, Sherwanis & Silk Lehengas',
      BadgeIcon: SacredLotus,
      calStart: '20270215T033000Z',
      calEnd: '20270215T083000Z',
    },
    {
      id: 'sajan-goth',
      day: 2,
      title: 'Sajan Goth – The Rajbhog Lunch',
      hindiTagline: 'पारंपरिक स्नेह भोज',
      subtitle: 'A celebratory sit-down traditional banquet post Varmala & Phere to cherish family togetherness.',
      time: 'Post Varmala & Phere',
      venue: 'The Hut – Garden Estate',
      attire: 'Traditional Elegance',
      BadgeIcon: SacredLotus,
      calStart: '20270215T073000Z',
      calEnd: '20270215T110000Z',
    }
  ];

  const filteredEvents = EVENTS_DATA.filter(e => e.day === activeDay);

  return (
    <section id="itinerary" className="itinerary-section relative py-24 px-4 sm:px-6 overflow-hidden transition-colors duration-700 bg-paper-texture">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="font-cormorant uppercase text-xs tracking-[0.3em] text-[#657968] font-semibold">
            Wedding Itinerary
          </span>
          <h3 className="font-cormorant text-4xl sm:text-5xl font-normal text-[#343F35] mt-2 tracking-tight">
            The Celebrations
          </h3>
          <p className="font-cormorant italic text-[#657968] text-base max-w-md mx-auto mt-2">
            Two days of sacred traditions, music, poolside celebrations, and everlasting memories.
          </p>
          <BotanicalDivider className="w-full max-w-xs mx-auto my-5 text-[#C3A56B]" />

          {/* Day 1 & Day 2 Minimalist Switcher */}
          <div className="inline-flex p-1 rounded-full bg-[#EAE2D3]/70 border border-[#C3A56B]/30 shadow-sm mt-3">
            <button
              onClick={() => setActiveDay(1)}
              className={`px-6 sm:px-8 py-2 rounded-full font-cormorant uppercase text-xs tracking-[0.2em] font-medium transition-all ${
                activeDay === 1
                  ? 'bg-[#41584C] text-[#F5F0E5] shadow-sm'
                  : 'text-[#343F35] hover:text-[#41584C]'
              }`}
            >
              Day 1 • 14th Feb (Sunday)
            </button>

            <button
              onClick={() => setActiveDay(2)}
              className={`px-6 sm:px-8 py-2 rounded-full font-cormorant uppercase text-xs tracking-[0.2em] font-medium transition-all ${
                activeDay === 2
                  ? 'bg-[#41584C] text-[#F5F0E5] shadow-sm'
                  : 'text-[#343F35] hover:text-[#41584C]'
              }`}
            >
              Day 2 • 15th Feb (The Wedding)
            </button>
          </div>
        </div>

        {/* Cohesive Botanical Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, index) => {
              const Badge = event.BadgeIcon;
              const isFullWidth = event.id === 'sham-e-sangeet' || event.id === 'the-royal-wedding';

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`relative rounded-3xl p-7 sm:p-9 bg-[#FDFBF7] border border-[#C3A56B]/30 shadow-botanical hover:shadow-brass-glow transition-all duration-300 flex flex-col justify-between ${
                    isFullWidth ? 'md:col-span-2' : ''
                  }`}
                >
                  <div>
                    {/* Header: Time & Botanical Emblem */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-cormorant uppercase text-xs tracking-[0.2em] text-[#657968] font-semibold px-3.5 py-1 rounded-full bg-[#EAE2D3]/60 border border-[#C3A56B]/25">
                        {event.time}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#EAE2D3]/60 border border-[#C3A56B]/30 flex items-center justify-center text-[#C3A56B]">
                        <Badge className="w-4 h-4 text-[#C3A56B]" />
                      </div>
                    </div>

                    {/* Hindi Tagline */}
                    {event.hindiTagline && (
                      <span className="font-devanagari text-xs tracking-normal text-[#A78343] block mb-1">
                        {event.hindiTagline}
                      </span>
                    )}

                    {/* Event Title */}
                    <h4 className="font-cormorant text-2xl sm:text-3xl font-medium text-[#343F35] tracking-tight mb-2">
                      {event.title}
                    </h4>

                    {/* Romantic Quote if any */}
                    {event.romanticQuote && (
                      <p className="font-cormorant italic text-sm text-[#657968] mb-2 leading-relaxed">
                        {event.romanticQuote}
                      </p>
                    )}

                    {/* Poetic Subtitle */}
                    <p className="font-sans text-xs sm:text-sm text-[#343F35]/85 leading-relaxed mb-4">
                      {event.subtitle}
                    </p>

                    {/* Venue & Attire Pills */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-sans text-[#657968] mb-4">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EAE2D3]/60 border border-[#C3A56B]/20">
                        <MapPin className="w-3.5 h-3.5 text-[#41584C]" />
                        <span className="text-[#343F35] font-medium">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EAE2D3]/60 border border-[#C3A56B]/20">
                        <span className="text-[#657968]">Attire:</span>
                        <span className="text-[#343F35] font-medium">{event.attire}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-[#C3A56B]/20 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={createGoogleCalendarUrl(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#41584C] text-[#F5F0E5] font-cormorant uppercase tracking-[0.15em] text-xs font-medium hover:bg-[#2C3E34] transition-all"
                      >
                        <CalendarPlus className="w-3 h-3 text-[#C3A56B]" />
                        <span>Google Cal</span>
                      </a>

                      <button
                        onClick={() => downloadIcs(event)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#C3A56B]/30 text-[#343F35] font-cormorant uppercase tracking-[0.15em] text-xs hover:bg-[#EAE2D3]/40 transition-all"
                      >
                        <span>iCal</span>
                      </button>
                    </div>

                    {/* Interactive Haldi Petal Burst */}
                    {event.isInteractiveHaldi && (
                      <button
                        onClick={triggerHaldiPetals}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EAE2D3] border border-[#C3A56B]/40 text-[#4A3816] font-cormorant uppercase tracking-[0.15em] text-xs font-semibold hover:bg-[#DCD0BE] transition-all shadow-sm"
                      >
                        <Sparkles className="w-3 h-3 text-[#C3A56B]" />
                        <span>Splash Phool 🌸</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
