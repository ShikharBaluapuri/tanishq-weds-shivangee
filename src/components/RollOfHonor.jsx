import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Lock } from 'lucide-react';
import { BotanicalDivider } from './BespokeIcons';

export default function RollOfHonor({ onOpenAdminModal }) {
  const BEST_COMPLIMENTS = [
    { title: 'Dr. Nidhi & Mr. Manish Baluapuri', relation: 'Proud Parents of the Groom' },
    { title: 'Mrs. Kavita & Mr. Sapan Shrivastava', relation: 'Family Elder & Blessings' },
    { title: 'Dr. Vidhi & Mr. Vivek Saxena', relation: 'Family Elder & Blessings' },
    { title: 'Mrs. Purvi & Mr. Vishwa Anurag Saxena', relation: 'Family Elder & Blessings' },
    { title: 'Mr. Shikhar Baluapuri', relation: 'Family & Best Man' },
    { title: 'Ishaan Saxena', relation: 'Best Man' },
    { title: 'Tanay Shrivastava', relation: 'Best Man' },
  ];

  const CONTACTS = [
    { name: 'Manish Baluapuri', number: '9425006278', role: 'Main Host Contact' },
    { name: 'Shikhar Baluapuri', number: '8623876930', role: 'Logistics & Guest Care' },
    { name: 'Tanishq Baluapuri', number: '9167166675', role: 'Groom & Host' },
  ];

  return (
    <footer className="relative pt-20 pb-24 sm:pb-16 px-4 sm:px-6 bg-[#F5F0E5] border-t border-[#C3A56B]/30 overflow-hidden bg-paper-texture">
      <div className="max-w-5xl mx-auto">
        
        {/* Header with Monogram Crest & Luxury Scroll Reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 flex flex-col items-center"
        >
          <img
            src="/monogram_gold_transparent.png"
            alt="Tanishq &amp; Shivangee Crest"
            className="w-14 h-18 object-contain filter drop-shadow-sm mb-3"
          />

          <span className="font-cormorant uppercase text-xs tracking-[0.3em] text-[#657968] font-semibold">
            With Love &amp; Respect
          </span>
          <h3 className="font-cormorant text-4xl sm:text-5xl font-normal text-[#343F35] mt-2 tracking-tight">
            Awaiting to Welcome You All
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-5">
            <span className="font-cormorant font-medium text-2xl sm:text-3xl text-[#343F35]">
              Baluapuri Family
            </span>
            <span className="font-pinyon text-3xl text-[#C3A56B]">&amp;</span>
            <span className="font-cormorant font-medium text-2xl sm:text-3xl text-[#343F35]">
              Kushwah Family
            </span>
          </div>

          <BotanicalDivider className="w-full max-w-xs mx-auto my-5 text-[#C3A56B]" />
        </motion.div>

        {/* Best Compliments From */}
        <motion.div 
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <h4 className="text-center font-cormorant uppercase text-xs tracking-[0.25em] text-[#657968] mb-6 font-semibold">
            — Best Compliments From —
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {BEST_COMPLIMENTS.map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#C3A56B]/30 hover:border-[#C3A56B]/60 shadow-sm text-center transition-colors"
              >
                <div className="font-cormorant font-medium text-[#343F35] text-base sm:text-lg">
                  {member.title}
                </div>
                <div className="text-[11px] font-sans text-[#657968] mt-0.5">
                  {member.relation}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Contact Dock */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 p-6 sm:p-8 rounded-3xl bg-[#FDFBF7] border border-[#C3A56B]/30 shadow-botanical"
        >
          <h4 className="text-center font-cormorant uppercase text-xs tracking-[0.25em] text-[#343F35] mb-1 font-semibold">
            One-Tap Quick Contact &amp; Assistance
          </h4>
          <p className="text-center text-xs text-[#657968] mb-6 font-cormorant italic">
            Feel free to contact our family coordinators for any travel or celebration queries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CONTACTS.map((c, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-2xl bg-[#EAE2D3]/50 border border-[#C3A56B]/20 hover:border-[#C3A56B]/50 flex flex-col justify-between transition-colors shadow-xs"
              >
                <div>
                  <span className="text-[10px] uppercase font-sans font-medium tracking-wider text-[#657968] block">
                    {c.role}
                  </span>
                  <strong className="text-xs font-sans font-semibold text-[#343F35] block mt-0.5">
                    {c.name}
                  </strong>
                  <div className="text-xs font-mono font-medium text-[#343F35] mt-1">
                    +91 {c.number}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#C3A56B]/20">
                  <a
                    href={`tel:+91${c.number}`}
                    className="flex-1 py-1.5 rounded-lg bg-[#41584C] text-[#F5F0E5] text-[11px] font-sans font-medium text-center hover:bg-[#2C3E34] transition-all flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Phone className="w-3 h-3 text-[#C3A56B]" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/91${c.number}?text=${encodeURIComponent('Hello! Looking forward to attending Tanishq & Shivangee’s wedding.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 rounded-lg bg-[#25D366] text-white text-[11px] font-sans font-medium text-center hover:bg-[#1EBE5D] transition-all flex items-center justify-center gap-1 shadow-xs"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Footer Line & Host Login */}
        <div className="pt-6 border-t border-[#C3A56B]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-cormorant uppercase tracking-[0.2em] text-[#657968]">
          <div>
            <span className="text-[#343F35] font-medium">Tanishq &amp; Shivangee</span>
            <span> • 14th &amp; 15th Feb 2027</span>
          </div>

          <div>
            <span>The Waterstone Resort, Chhindwara, M.P.</span>
          </div>

          <button
            onClick={onOpenAdminModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-[#657968] hover:text-[#343F35] hover:bg-white transition-all"
            title="Family Host Login"
          >
            <Lock className="w-3 h-3 text-[#C3A56B]" />
            <span>Family Host Login</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
