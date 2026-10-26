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
    <footer className="relative pt-20 pb-24 sm:pb-16 px-6 bg-[#F4F6F3] border-t border-[#C5A869]/30 overflow-hidden bg-paper-texture">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-cormorant uppercase text-xs tracking-[0.3em] text-[#7A917F] font-semibold">
            With Love &amp; Respect
          </span>
          <h3 className="font-cormorant text-4xl sm:text-5xl font-normal text-[#1E2F23] mt-2 tracking-tight">
            Awaiting to Welcome You All
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-5">
            <span className="font-cormorant font-medium text-2xl sm:text-3xl text-[#1E2F23]">
              Baluapuri Family
            </span>
            <span className="font-pinyon text-3xl text-[#C5A869]">&amp;</span>
            <span className="font-cormorant font-medium text-2xl sm:text-3xl text-[#1E2F23]">
              Verma Family
            </span>
          </div>

          <BotanicalDivider className="w-full max-w-xs mx-auto my-5 text-[#C5A869]" />
        </div>

        {/* Best Compliments From */}
        <div className="mb-14">
          <h4 className="text-center font-cormorant uppercase text-xs tracking-[0.25em] text-[#7A917F] mb-6">
            — Best Compliments From —
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {BEST_COMPLIMENTS.map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                className="bg-white/95 p-4 rounded-2xl border border-[#C5A869]/30 shadow-sm text-center"
              >
                <div className="font-cormorant font-medium text-[#1E2F23] text-base sm:text-lg">
                  {member.title}
                </div>
                <div className="text-[11px] font-sans text-[#7A917F] mt-0.5">
                  {member.relation}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Contact Dock */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-white/95 border border-[#C5A869]/30 shadow-botanical">
          <h4 className="text-center font-cormorant uppercase text-xs tracking-[0.25em] text-[#1E2F23] mb-1 font-semibold">
            One-Tap Quick Contact &amp; Assistance
          </h4>
          <p className="text-center text-xs text-[#7A917F] mb-6 font-cormorant italic">
            Feel free to contact our family coordinators for any travel or celebration queries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CONTACTS.map((c, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#F4F6F3] border border-[#C5A869]/20 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-sans font-medium tracking-wider text-[#7A917F] block">
                    {c.role}
                  </span>
                  <strong className="text-xs font-sans font-semibold text-[#1E2F23] block mt-0.5">
                    {c.name}
                  </strong>
                  <div className="text-xs font-mono font-medium text-[#1E2F23] mt-1">
                    +91 {c.number}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#C5A869]/20">
                  <a
                    href={`tel:+91${c.number}`}
                    className="flex-1 py-1.5 rounded-lg bg-[#354F3B] text-[#E8E4D8] text-[11px] font-sans font-medium text-center hover:bg-[#2A3F2F] transition-all flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-[#C5A869]" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/91${c.number}?text=${encodeURIComponent('Hello! Looking forward to attending Tanishq & Shivangee’s wedding.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 rounded-lg bg-[#25D366] text-white text-[11px] font-sans font-medium text-center hover:bg-[#1EBE5D] transition-all flex items-center justify-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer Line & Host Login */}
        <div className="pt-6 border-t border-[#C5A869]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-cormorant uppercase tracking-[0.2em] text-[#7A917F]">
          <div>
            <span className="text-[#1E2F23] font-medium">Tanishq &amp; Shivangee</span>
            <span> • 14th &amp; 15th Feb 2027</span>
          </div>

          <div>
            <span>The Waterstone Resort, Chhindwara, M.P.</span>
          </div>

          <button
            onClick={onOpenAdminModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-[#7A917F] hover:text-[#1E2F23] hover:bg-white transition-all"
            title="Family Host Login"
          >
            <Lock className="w-3 h-3 text-[#C5A869]" />
            <span>Family Host Login</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
