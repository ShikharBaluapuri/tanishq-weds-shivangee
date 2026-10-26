import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Lock } from 'lucide-react';
import { BotanicalDivider } from './BespokeIcons';

export default function RollOfHonor({ onOpenAdminModal }) {
  const BEST_COMPLIMENTS = [
    { title: 'Mrs. Rajshree & Mr. Shailesh Baluapuri', relation: 'Family Elder & Blessings' },
    { title: 'Mrs. Kavita & Mr. Sapan Shrivastava', relation: 'Family Elder & Blessings' },
    { title: 'Dr. Nidhi & Mr. Manish Baluapuri', relation: 'Proud Parents of the Groom' },
    { title: 'Dr. Vidhi & Mr. Vivek Saxena', relation: 'Family Elder & Blessings' },
    { title: 'Mrs. Purvi & Mr. Vishwa Anurag Saxena', relation: 'Family Elder & Blessings' },
    { title: 'Mr. Shikhar Baluapuri', relation: 'Family & Best Man' },
  ];

  const CONTACTS = [
    { name: 'Dr. Nidhi & Mr. Manish Baluapuri', number: '9425006278', role: 'Main Host Contact' },
    { name: 'Hospitality & Room Desk', number: '8454046248', role: 'Guest Care & Rooms' },
    { name: 'Logistics & Arrival Desk', number: '8623876930', role: 'Arrival Queries' },
  ];

  return (
    <footer id="family" className="relative pt-20 pb-24 sm:pb-16 px-6 bg-[radial-gradient(ellipse_at_top,#143256_0%,#0C223B_60%,#081729_100%)] border-t border-[#B8A072]/25 overflow-hidden text-[#FAF8F5]">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-cormorant uppercase text-[11px] tracking-[0.38em] text-[#B8A072] font-medium block">
            With Love &amp; Respect
          </span>
          <h3 className="font-cormorant text-4xl sm:text-5xl font-light text-[#FAF8F5] mt-2 tracking-tight">
            Awaiting to Welcome You All
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-5">
            <span className="font-cormorant font-light text-2xl sm:text-3xl text-[#FAF8F5]">
              Baluapuri Family
            </span>
            <span className="font-pinyon text-3xl text-[#B8A072]">&amp;</span>
            <span className="font-cormorant font-light text-2xl sm:text-3xl text-[#FAF8F5]">
              Verma Family
            </span>
          </div>

          <BotanicalDivider className="w-full max-w-xs mx-auto my-5 text-[#B8A072]" />
        </div>

        {/* Best Compliments From - Warm Cotton Paper Cards */}
        <div className="mb-14">
          <h4 className="text-center font-cormorant uppercase text-[11px] tracking-[0.3em] text-[#B8A072] mb-6 font-medium">
            — Best Compliments From —
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {BEST_COMPLIMENTS.map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3 }}
                className="bg-[#FAF8F5] text-[#0C223B] p-4 rounded-2xl border border-[#B8A072]/30 shadow-md text-center relative overflow-hidden"
              >
                <div className="absolute inset-1 border border-[#B8A072]/15 rounded-xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="font-cormorant font-medium text-[#0C223B] text-base sm:text-lg">
                    {member.title}
                  </div>
                  <div className="text-[11px] font-sans text-[#526B82] mt-0.5">
                    {member.relation}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Contact Dock */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-[#0C223B]/80 border border-[#B8A072]/30 shadow-[0_20px_50px_rgba(8,23,41,0.5)] backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-2 border border-[#B8A072]/20 rounded-[20px] pointer-events-none" />

          <div className="relative z-10">
            <h4 className="text-center font-cormorant uppercase text-xs tracking-[0.25em] text-[#FAF8F5] mb-1 font-medium">
              One-Tap Quick Contact &amp; Assistance
            </h4>
            <p className="text-center text-xs text-[#B8A072]/85 mb-6 font-cormorant italic">
              Feel free to contact our family coordinators for any travel or celebration queries.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CONTACTS.map((c, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-[#081729]/90 border border-[#B8A072]/30 flex flex-col justify-between shadow-inner"
                >
                  <div>
                    <span className="text-[10px] uppercase font-sans font-medium tracking-wider text-[#B8A072] block">
                      {c.role}
                    </span>
                    <strong className="text-xs font-sans font-medium text-[#FAF8F5] block mt-0.5">
                      {c.name}
                    </strong>
                    <div className="text-xs font-mono font-medium text-[#FAF8F5]/90 mt-1">
                      +91 {c.number}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#B8A072]/25">
                    <a
                      href={`tel:+91${c.number}`}
                      className="flex-1 py-1.5 rounded-lg bg-[#0C223B] text-[#FAF8F5] border border-[#B8A072]/40 text-[11px] font-sans font-medium text-center hover:bg-[#143256] transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Phone className="w-3 h-3 text-[#B8A072]" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/91${c.number}?text=${encodeURIComponent('Hello! Looking forward to attending Tanishq & Shivangee’s wedding.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 rounded-lg bg-[#25D366] text-white text-[11px] font-sans font-medium text-center hover:bg-[#1EBE5D] transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer Line & Host Login */}
        <div className="pt-6 border-t border-[#B8A072]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-cormorant uppercase tracking-[0.2em] text-[#FAF8F5]/80">
          <div>
            <span className="text-[#FAF8F5] font-light">Tanishq &amp; Shivangee</span>
            <span className="text-[#B8A072]"> • 14th &amp; 15th Feb 2027</span>
          </div>

          <div>
            <span>The Waterstone Resort, Chhindwara, M.P.</span>
          </div>

          <button
            onClick={onOpenAdminModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] text-[#B8A072] hover:text-[#FAF8F5] hover:bg-white/10 border border-[#B8A072]/30 transition-all"
            title="Family Host Login"
          >
            <Lock className="w-3 h-3 text-[#B8A072]" />
            <span>Family Host Login</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
