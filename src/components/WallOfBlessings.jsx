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
    <section id="blessings" className="relative py-24 px-6 bg-[radial-gradient(circle_at_50%_25%,#FBF9F5_0%,#F7F4EE_60%,#EDE8DC_100%)] overflow-hidden text-[#0C223B]">
      {/* Background Ambient Champagne Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B8A072]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-14">
          <span className="font-cormorant uppercase text-[11px] tracking-[0.38em] text-[#9A8052] font-medium block">
            Aashish Vachan
          </span>
          <h3 className="font-cormorant text-4xl sm:text-5xl font-light text-[#0C223B] mt-2 tracking-tight">
            Wall of Blessings
          </h3>
          <p className="font-cormorant italic text-[#0C223B]/75 text-base max-w-md mx-auto mt-2">
            Heartfelt prayers, blessings, and warm wishes from cherished family &amp; friends.
          </p>
          <BotanicalDivider className="w-full max-w-xs mx-auto my-5 text-[#B8A072]" />

          <button
            onClick={onOpenBlessingModal}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0C223B] text-[#FAF8F5] text-xs font-cormorant uppercase tracking-[0.2em] font-medium hover:bg-[#143256] hover:scale-105 transition-all shadow-[0_8px_20px_-4px_rgba(12,34,59,0.22)] border border-[#B8A072]/40 mt-1"
          >
            <Plus className="w-3.5 h-3.5 text-[#B8A072]" />
            <span>Send Your Blessing</span>
          </button>
        </div>

        {/* Blessings Grid - Warm Handmade Cotton Cards with Champagne Borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blessings.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
              className="bg-[#FAF8F5] text-[#0C223B] rounded-2xl p-6 border border-[#B8A072]/30 shadow-[0_12px_28px_-8px_rgba(12,34,59,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(12,34,59,0.14)] hover:border-[#B8A072]/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Inner Hairline Border */}
              <div className="absolute inset-1.5 border border-[#B8A072]/15 rounded-xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F0ECE1] text-[#7C6339] border border-[#B8A072]/25">
                    {item.side || 'Well-Wisher'}
                  </span>
                  <MessageSquareHeart className="w-4 h-4 text-[#B8A072]" />
                </div>

                <p className="font-cormorant italic text-[#0C223B] text-base sm:text-lg leading-relaxed mb-4">
                  “{item.blessing_message}”
                </p>
              </div>

              <div className="relative z-10 pt-3 border-t border-[#B8A072]/20 flex items-center justify-between">
                <div>
                  <strong className="block text-xs font-sans font-semibold text-[#0C223B]">
                    {item.guest_name}
                  </strong>
                  <span className="text-[10px] text-[#526B82] block">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Wedding Guest'}
                  </span>
                </div>
                <Heart className="w-3.5 h-3.5 text-[#C48B83] fill-[#C48B83]/30" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
