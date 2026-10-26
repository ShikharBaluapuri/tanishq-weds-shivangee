import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquareHeart, Plus } from 'lucide-react';
import { getAllRsvps, subscribeToRsvps, INITIAL_BLESSINGS } from '../services/rsvpService';
import { BotanicalDivider } from './BespokeIcons';

export default function WallOfBlessings({ onOpenBlessingModal }) {
  const [blessings, setBlessings] = useState(INITIAL_BLESSINGS);

  useEffect(() => {
    getAllRsvps().then((data) => {
      if (data && data.length > 0) {
        const withBlessings = data.filter(r => r.blessing_message && r.blessing_message.trim().length > 0);
        setBlessings(withBlessings.length > 0 ? withBlessings : INITIAL_BLESSINGS);
      }
    });

    const unsubscribe = subscribeToRsvps((newRsvp) => {
      if (newRsvp && newRsvp.blessing_message && newRsvp.blessing_message.trim().length > 0) {
        setBlessings(prev => [newRsvp, ...prev.filter(b => b.id !== newRsvp.id)]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="blessings" className="relative py-24 px-6 bg-[#EAEee8]/50 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center mb-14">
          <span className="font-cormorant uppercase text-xs tracking-[0.3em] text-[#7A917F] font-semibold">
            Aashish Vachan
          </span>
          <h3 className="font-cormorant text-4xl sm:text-5xl font-normal text-[#1E2F23] mt-2 tracking-tight">
            Wall of Blessings
          </h3>
          <p className="font-cormorant italic text-[#7A917F] text-base max-w-md mx-auto mt-2">
            Heartfelt prayers, blessings, and warm wishes from cherished family &amp; friends.
          </p>
          <BotanicalDivider className="w-full max-w-xs mx-auto my-5 text-[#C5A869]" />

          <button
            onClick={onOpenBlessingModal}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/90 border border-[#C5A869]/40 text-[#1E2F23] text-xs font-cormorant uppercase tracking-[0.2em] font-medium hover:bg-[#F4F6F3] transition-all shadow-sm mt-1"
          >
            <Plus className="w-3.5 h-3.5 text-[#C5A869]" />
            <span>Send Your Blessing</span>
          </button>
        </div>

        {/* Blessings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blessings.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
              className="bg-white/95 rounded-2xl p-6 border border-[#C5A869]/30 shadow-botanical hover:shadow-brass-glow transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-sans font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F4F6F3] text-[#7A917F]">
                    {item.side || 'Well-Wisher'}
                  </span>
                  <MessageSquareHeart className="w-3.5 h-3.5 text-[#C5A869]" />
                </div>

                <p className="font-cormorant italic text-[#1E2F23] text-sm sm:text-base leading-relaxed mb-4">
                  “{item.blessing_message}”
                </p>
              </div>

              <div className="pt-3 border-t border-[#C5A869]/20 flex items-center justify-between">
                <div>
                  <strong className="block text-xs font-sans font-medium text-[#1E2F23]">
                    {item.guest_name}
                  </strong>
                  <span className="text-[10px] text-[#7A917F] block">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Wedding Guest'}
                  </span>
                </div>
                <Heart className="w-3 h-3 text-[#7A917F] fill-[#7A917F]/20" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
