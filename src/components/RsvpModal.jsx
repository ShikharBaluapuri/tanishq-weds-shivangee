import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  User, 
  Phone, 
  Send, 
  Share2, 
  Plus, 
  Minus,
  Check,
  QrCode
} from 'lucide-react';
import { submitRsvp } from '../services/rsvpService';
import { BotanicalDivider } from './BespokeIcons';

export default function RsvpModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const [formData, setFormData] = useState({
    guest_name: '',
    phone: '',
    side: 'Baluapuri Family',
    attending: 'Joyfully Attending',
    guest_count: 2,
    events_attending: [
      'Ganesh Poojan & Mamera (14th Feb, 9 AM)',
      'Rangrez Haldi Carnival (14th Feb, 12 PM)',
      'Sham-e-Sangeet & Ring Ceremony (14th Feb, 6 PM)',
      'Barat, Varmala & Sajan Goth Lunch (15th Feb, 9 AM)'
    ],
    arrival_mode: 'Car',
    arrival_date: '14th Feb Morning',
    arrival_info: '',
    needs_accommodation: 'No',
    blessing_message: ''
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const ALL_EVENTS = [
    { id: 'ganesh', label: 'Ganesh Poojan & Mamera (14th Feb, 9 AM)', venue: 'The Hut' },
    { id: 'haldi', label: 'Rangrez Haldi Carnival (14th Feb, 12 PM)', venue: 'The Pool Side' },
    { id: 'sangeet', label: 'Sham-e-Sangeet & Ring Ceremony (14th Feb, 6 PM)', venue: 'The Garden Estate' },
    { id: 'wedding', label: 'Barat, Varmala & Sajan Goth Lunch (15th Feb, 9 AM)', venue: 'The Deck' }
  ];

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.guest_name.trim()) {
        newErrors.guest_name = 'Please enter your name.';
      }
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        newErrors.phone = 'Please enter a valid 10-digit phone number.';
      }
    }
    if (currentStep === 2 && formData.attending === 'Joyfully Attending') {
      if (!formData.events_attending || formData.events_attending.length === 0) {
        newErrors.events_attending = 'Please select at least one celebration event.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const toggleEvent = (eventLabel) => {
    setFormData(prev => {
      const exists = prev.events_attending.includes(eventLabel);
      return {
        ...prev,
        events_attending: exists 
          ? prev.events_attending.filter(e => e !== eventLabel)
          : [...prev.events_attending, eventLabel]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const submissionPayload = {
      ...formData,
      arrival_info: formData.arrival_info 
        ? `${formData.arrival_mode} - ${formData.arrival_date} (${formData.arrival_info})`
        : `${formData.arrival_mode} - ${formData.arrival_date}`
    };

    try {
      const result = await submitRsvp(submissionPayload);
      setSubmittedData(result.data);
      setStep(4);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C5A869', '#E8E4D8', '#354F3B', '#7A917F']
      });
    } catch (err) {
      console.error('RSVP submission error:', err);
      setSubmittedData(submissionPayload);
      setStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppShareUrl = () => {
    const data = submittedData || formData;
    const isAttending = data.attending === 'Joyfully Attending';
    const text = encodeURIComponent(
      `*Tanishq & Shivangee Wedding RSVP* 🌿✨\n\n` +
      `*Guest:* ${data.guest_name}\n` +
      `*Phone:* ${data.phone}\n` +
      `*Side:* ${data.side}\n` +
      `*Status:* ${data.attending} ${isAttending ? `(${data.guest_count} Guests)` : ''}\n` +
      (isAttending ? `*Events:*\n${data.events_attending.map(e => `• ${e}`).join('\n')}\n\n` : '\n') +
      `*Arrival:* ${data.arrival_info || 'Not specified'}\n` +
      `*Room Required:* ${data.needs_accommodation}\n` +
      (data.blessing_message ? `*Blessing Note:* "${data.blessing_message}"\n\n` : '\n') +
      `_Looking forward to celebrating at The Waterstone Resort, Chhindwara!_`
    );
    return `https://wa.me/919425006278?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2F23]/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-xl bg-[#F4F6F3] rounded-3xl border border-[#C5A869]/40 shadow-2xl overflow-hidden my-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 border border-[#C5A869]/30 flex items-center justify-center text-[#1E2F23] hover:bg-[#354F3B] hover:text-[#E8E4D8] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pt-8 pb-4 px-8 text-center border-b border-[#C5A869]/20 bg-white/50">
          <span className="font-cormorant uppercase text-[11px] tracking-[0.3em] text-[#7A917F] font-semibold block">
            Tanishq &amp; Shivangee • 14–15 Feb 2027
          </span>
          <h3 className="font-cormorant text-2xl sm:text-3xl uppercase tracking-[0.2em] font-light text-[#1E2F23] mt-1">
            {step === 4 ? 'Digital Boarding Pass' : 'Wedding RSVP'}
          </h3>
          <p className="font-cormorant italic text-xs sm:text-sm text-[#7A917F] mt-0.5">
            {step === 4 
              ? 'Your presence is our cherished blessing. See you in Chhindwara!' 
              : `Step ${step} of 3: ${
                  step === 1 ? 'Guest Information' : step === 2 ? 'Attendance & Headcount' : 'Travel & Blessings'
                }`}
          </p>

          {step < 4 && (
            <div className="flex items-center justify-center gap-2 max-w-xs mx-auto mt-4">
              <div className={`h-1 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-[#354F3B]' : 'bg-[#C5A869]/30'}`} />
              <div className={`h-1 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-[#354F3B]' : 'bg-[#C5A869]/30'}`} />
              <div className={`h-1 flex-1 rounded-full transition-all ${step >= 3 ? 'bg-[#354F3B]' : 'bg-[#C5A869]/30'}`} />
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-7 sm:p-9">
          
          {/* STEP 1: GUEST DETAILS */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#1E2F23] font-semibold mb-1">
                  Full Name / Family Representative <span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#7A917F] absolute left-1 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.guest_name}
                    onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Sharma &amp; Family"
                    className="w-full pl-8 pr-3 py-2.5 bg-transparent border-b border-[#354F3B]/30 text-[#1E2F23] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#354F3B]"
                  />
                </div>
                {errors.guest_name && (
                  <p className="text-xs text-red-600 mt-1 font-sans">{errors.guest_name}</p>
                )}
              </div>

              <div>
                <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#1E2F23] font-semibold mb-1">
                  WhatsApp / Phone Number <span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#7A917F] absolute left-1 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full pl-8 pr-3 py-2.5 bg-transparent border-b border-[#354F3B]/30 text-[#1E2F23] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#354F3B]"
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1 font-sans">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#1E2F23] font-semibold mb-2">
                  Affiliation / Guest Side
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    'Baluapuri Family',
                    'Verma / Kushwah Family',
                    'Friends & Colleagues'
                  ].map((sideOption) => (
                    <button
                      key={sideOption}
                      type="button"
                      onClick={() => setFormData({ ...formData, side: sideOption })}
                      className={`p-2.5 rounded-xl border text-xs font-sans text-center transition-all ${
                        formData.side === sideOption
                          ? 'border-[#354F3B] bg-[#354F3B] text-[#E8E4D8] font-medium shadow-sm'
                          : 'border-[#C5A869]/30 bg-white/70 text-[#1E2F23] hover:border-[#354F3B]/40'
                      }`}
                    >
                      {sideOption}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-7 py-2.5 rounded-full bg-[#354F3B] text-[#E8E4D8] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold hover:bg-[#2A3F2F] transition-all"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: ATTENDANCE & HEADCOUNT */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#1E2F23] font-semibold mb-2">
                  Will you grace the celebrations?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attending: 'Joyfully Attending' })}
                    className={`p-3 rounded-2xl border text-xs font-sans font-semibold flex items-center justify-center gap-2 transition-all ${
                      formData.attending === 'Joyfully Attending'
                        ? 'border-[#354F3B] bg-[#354F3B] text-[#E8E4D8] shadow-sm'
                        : 'border-[#C5A869]/30 bg-white/80 text-[#1E2F23]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A869]" />
                    <span>Joyfully Attending</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attending: 'Regretfully Declining' })}
                    className={`p-3 rounded-2xl border text-xs font-sans font-semibold flex items-center justify-center gap-2 transition-all ${
                      formData.attending === 'Regretfully Declining'
                        ? 'border-gray-800 bg-gray-800 text-white shadow-sm'
                        : 'border-[#C5A869]/30 bg-white/80 text-[#1E2F23]'
                    }`}
                  >
                    <span>Regretfully Declining</span>
                  </button>
                </div>
              </div>

              {formData.attending === 'Joyfully Attending' && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-cormorant uppercase text-xs tracking-[0.2em] text-[#1E2F23] font-semibold">
                        Total Guests Attending
                      </label>
                      <span className="text-xs text-[#7A917F]">
                        Including yourself
                      </span>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/80 border border-[#C5A869]/30">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, guest_count: Math.max(1, formData.guest_count - 1) })}
                        className="w-9 h-9 rounded-xl bg-[#F4F6F3] border border-[#C5A869]/30 flex items-center justify-center text-[#1E2F23] hover:bg-[#354F3B] hover:text-[#E8E4D8] transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex-1 text-center font-cormorant font-bold text-3xl text-[#1E2F23]">
                        {formData.guest_count} <span className="text-xs font-sans font-normal text-[#7A917F]">Guest(s)</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, guest_count: Math.min(10, formData.guest_count + 1) })}
                        className="w-9 h-9 rounded-xl bg-[#F4F6F3] border border-[#C5A869]/30 flex items-center justify-center text-[#1E2F23] hover:bg-[#354F3B] hover:text-[#E8E4D8] transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#1E2F23] font-semibold mb-2">
                      Select Celebrations You Will Attend
                    </label>
                    <div className="space-y-2">
                      {ALL_EVENTS.map((event) => {
                        const isChecked = formData.events_attending.includes(event.label);
                        return (
                          <div
                            key={event.id}
                            onClick={() => toggleEvent(event.label)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs font-sans ${
                              isChecked
                                ? 'border-[#354F3B] bg-white text-[#1E2F23] font-semibold shadow-sm'
                                : 'border-[#C5A869]/20 bg-white/50 text-[#7A917F]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                isChecked ? 'bg-[#354F3B] border-[#354F3B] text-[#E8E4D8]' : 'border-gray-400 bg-white'
                              }`}>
                                {isChecked && <Check className="w-3 h-3" />}
                              </div>
                              <span>{event.label}</span>
                            </div>
                            <span className="text-[10px] uppercase font-mono text-[#7A917F]">
                              {event.venue}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-2 rounded-full border border-[#C5A869]/30 text-[#1E2F23] font-cormorant uppercase tracking-[0.15em] text-xs"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-7 py-2.5 rounded-full bg-[#354F3B] text-[#E8E4D8] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold hover:bg-[#2A3F2F] transition-all"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: TRAVEL & BLESSING */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              {formData.attending === 'Joyfully Attending' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#1E2F23] font-semibold mb-1">
                        Mode of Travel
                      </label>
                      <select
                        value={formData.arrival_mode}
                        onChange={(e) => setFormData({ ...formData, arrival_mode: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/80 border border-[#C5A869]/30 text-[#1E2F23] text-xs focus:outline-none"
                      >
                        <option value="Car">Personal Car / Road</option>
                        <option value="Train">Train (Chhindwara / Nagpur)</option>
                        <option value="Flight">Flight via Nagpur (NAG)</option>
                        <option value="Local">Local Resident</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#1E2F23] font-semibold mb-1">
                        Expected Arrival Time
                      </label>
                      <input
                        type="text"
                        value={formData.arrival_date}
                        onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })}
                        placeholder="e.g. 14th Feb morning"
                        className="w-full px-3 py-2 rounded-xl bg-white/80 border border-[#C5A869]/30 text-[#1E2F23] text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#1E2F23] font-semibold mb-1.5">
                      Accommodation Required?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, needs_accommodation: 'Yes' })}
                        className={`p-2.5 rounded-xl border text-xs font-sans transition-all ${
                          formData.needs_accommodation === 'Yes'
                            ? 'border-[#354F3B] bg-[#354F3B] text-[#E8E4D8] font-medium'
                            : 'border-[#C5A869]/30 bg-white/70 text-[#1E2F23]'
                        }`}
                      >
                        Yes, Please Arrange Room
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, needs_accommodation: 'No' })}
                        className={`p-2.5 rounded-xl border text-xs font-sans transition-all ${
                          formData.needs_accommodation === 'No'
                            ? 'border-[#354F3B] bg-[#354F3B] text-[#E8E4D8] font-medium'
                            : 'border-[#C5A869]/30 bg-white/70 text-[#1E2F23]'
                        }`}
                      >
                        No, Making Own Arrangements
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#1E2F23] font-semibold mb-1">
                  Aashish Vachan • Personal Blessing Note
                </label>
                <textarea
                  rows="3"
                  value={formData.blessing_message}
                  onChange={(e) => setFormData({ ...formData, blessing_message: e.target.value })}
                  placeholder="Share your warm blessings and wishes for Tanishq &amp; Shivangee..."
                  className="w-full p-3 rounded-2xl bg-white/80 border border-[#C5A869]/30 text-[#1E2F23] placeholder:text-gray-400 text-xs focus:outline-none focus:border-[#354F3B]"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-2 rounded-full border border-[#C5A869]/30 text-[#1E2F23] font-cormorant uppercase tracking-[0.15em] text-xs"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-2.5 rounded-full bg-[#354F3B] text-[#E8E4D8] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold border border-[#C5A869]/40 hover:bg-[#2A3F2F] transition-all flex items-center gap-2"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm RSVP'}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: DIGITAL BOARDING PASS */}
          {step === 4 && submittedData && (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A869]/40 shadow-botanical overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-[#C5A869]/20">
                  <div>
                    <span className="font-cormorant uppercase text-[10px] tracking-[0.25em] text-[#7A917F] font-semibold block">
                      Wedding Admittance Pass
                    </span>
                    <h4 className="font-pinyon text-3xl text-[#1E2F23]">
                      Tanishq &amp; Shivangee
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#EAEee8] text-[#354F3B] border border-[#354F3B]/30 text-[10px] font-sans font-bold uppercase">
                    Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-dashed border-[#C5A869]/30 text-xs font-sans">
                  <div>
                    <span className="text-[10px] text-[#7A917F] uppercase block">Guest</span>
                    <strong className="text-[#1E2F23] font-cormorant text-sm block truncate">
                      {submittedData.guest_name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A917F] uppercase block">Headcount</span>
                    <strong className="text-[#1E2F23] font-cormorant text-sm block">
                      {submittedData.guest_count || 1} Guest(s)
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A917F] uppercase block">Side</span>
                    <strong className="text-[#1E2F23] text-xs block truncate">
                      {submittedData.side}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A917F] uppercase block">Venue</span>
                    <strong className="text-[#1E2F23] text-xs block">
                      The Waterstone
                    </strong>
                  </div>
                </div>

                {submittedData.attending === 'Joyfully Attending' && (
                  <div className="py-4 border-b border-[#C5A869]/20 text-xs font-sans">
                    <span className="text-[10px] text-[#7A917F] uppercase block font-semibold mb-2">
                      Events Checklist:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[#1E2F23]">
                      {(submittedData.events_attending || []).map((ev, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                          <span className="truncate">{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between text-xs font-sans">
                  <div>
                    <span className="text-[10px] text-[#7A917F] block">Host Contact:</span>
                    <span className="font-semibold text-[#1E2F23]">9425006278 • 8623876930</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <QrCode className="w-7 h-7 text-[#1E2F23]/70" />
                    <span className="text-[9px] font-mono uppercase text-[#7A917F]">
                      14–15 FEB 2027
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={getWhatsAppShareUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-full bg-[#25D366] text-white font-sans font-semibold text-xs tracking-wider uppercase shadow-sm hover:bg-[#1EBE5D] transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send Confirmation on WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-[#354F3B] text-[#E8E4D8] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold hover:bg-[#2A3F2F] transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
