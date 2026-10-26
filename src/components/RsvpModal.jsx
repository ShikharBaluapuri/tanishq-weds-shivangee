import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { triggerFlowerPetals } from '../services/flowerPetalEngine';
import { 
  X, 
  CheckCircle2, 
  User, 
  Phone, 
  Share2, 
  Plus, 
  Minus,
  Check,
  QrCode
} from 'lucide-react';
import { submitRsvp } from '../services/rsvpService';

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
      // Royal Pushpavarsha (Flower Shower)
      triggerFlowerPetals('pushpavarsha', 75);
    } catch (err) {
      console.error('RSVP submission error:', err);
      setSubmittedData(submissionPayload);
      setStep(4);
      triggerFlowerPetals('pushpavarsha', 75);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C223B]/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-xl bg-[#FAF8F5] text-[#0C223B] rounded-3xl border border-[#B8A072]/40 shadow-[0_30px_90px_rgba(12,34,59,0.45)] overflow-hidden my-6"
      >
        {/* Inner Hairline Border */}
        <div className="absolute inset-2 border border-[#B8A072]/20 rounded-[20px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#B8A072]/40 flex items-center justify-center text-[#0C223B] hover:bg-[#0C223B] hover:text-[#FAF8F5] transition-all shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pt-8 pb-4 px-8 text-center border-b border-[#B8A072]/25 bg-[#F5F2EB]/80 relative z-10">
          <span className="font-cormorant uppercase text-[11px] tracking-[0.3em] text-[#9A8052] font-semibold block">
            Tanishq &amp; Shivangee • 14–15 Feb 2027
          </span>
          <h3 className="font-cormorant text-2xl sm:text-3xl uppercase tracking-[0.2em] font-light text-[#0C223B] mt-1">
            {step === 4 ? 'Royal Admittance Pass' : 'Wedding RSVP'}
          </h3>
          <p className="font-cormorant italic text-xs sm:text-sm text-[#526B82] mt-0.5">
            {step === 4 
              ? 'Your presence is our cherished blessing. See you in Chhindwara!' 
              : `Step ${step} of 3: ${
                  step === 1 ? 'Guest Information' : step === 2 ? 'Attendance & Headcount' : 'Travel & Blessings'
                }`}
          </p>

          {step < 4 && (
            <div className="flex items-center justify-center gap-2 max-w-xs mx-auto mt-4">
              <div className={`h-1 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-[#0C223B]' : 'bg-[#B8A072]/25'}`} />
              <div className={`h-1 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-[#0C223B]' : 'bg-[#B8A072]/25'}`} />
              <div className={`h-1 flex-1 rounded-full transition-all ${step >= 3 ? 'bg-[#0C223B]' : 'bg-[#B8A072]/25'}`} />
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-7 sm:p-9 relative z-10">
          
          {/* STEP 1: GUEST DETAILS */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#0C223B] font-semibold mb-1">
                  Full Name / Family Representative <span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#B8A072] absolute left-1 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.guest_name}
                    onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Sharma &amp; Family"
                    className="w-full pl-8 pr-3 py-2.5 bg-transparent border-b border-[#B8A072]/50 text-[#0C223B] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#0C223B]"
                  />
                </div>
                {errors.guest_name && (
                  <p className="text-xs text-red-600 mt-1 font-sans">{errors.guest_name}</p>
                )}
              </div>

              <div>
                <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#0C223B] font-semibold mb-1">
                  WhatsApp / Phone Number <span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#B8A072] absolute left-1 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full pl-8 pr-3 py-2.5 bg-transparent border-b border-[#B8A072]/50 text-[#0C223B] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#0C223B]"
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1 font-sans">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#0C223B] font-semibold mb-2">
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
                          ? 'border-[#0C223B] bg-[#0C223B] text-[#FAF8F5] font-medium shadow-sm'
                          : 'border-[#B8A072]/30 bg-white text-[#0C223B] hover:border-[#0C223B]'
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
                  className="px-7 py-2.5 rounded-full bg-[#0C223B] text-[#FAF8F5] font-cormorant uppercase tracking-[0.2em] text-xs font-medium hover:bg-[#143256] hover:scale-105 transition-all border border-[#B8A072]/40 shadow-[0_4px_16px_rgba(12,34,59,0.2)]"
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
                <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#0C223B] font-semibold mb-2">
                  Will you grace the celebrations?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attending: 'Joyfully Attending' })}
                    className={`p-3 rounded-2xl border text-xs font-sans font-medium flex items-center justify-center gap-2 transition-all ${
                      formData.attending === 'Joyfully Attending'
                        ? 'border-[#0C223B] bg-[#0C223B] text-[#FAF8F5] shadow-sm'
                        : 'border-[#B8A072]/30 bg-white text-[#0C223B]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B8A072]" />
                    <span>Joyfully Attending</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attending: 'Regretfully Declining' })}
                    className={`p-3 rounded-2xl border text-xs font-sans font-medium flex items-center justify-center gap-2 transition-all ${
                      formData.attending === 'Regretfully Declining'
                        ? 'border-gray-700 bg-gray-700 text-white shadow-sm'
                        : 'border-[#B8A072]/30 bg-white text-[#0C223B]'
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
                      <label className="font-cormorant uppercase text-xs tracking-[0.2em] text-[#0C223B] font-semibold">
                        Total Guests Attending
                      </label>
                      <span className="text-xs text-[#526B82]">
                        Including yourself
                      </span>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-[#B8A072]/30 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, guest_count: Math.max(1, formData.guest_count - 1) })}
                        className="w-9 h-9 rounded-xl bg-[#F5F2EB] border border-[#B8A072]/30 flex items-center justify-center text-[#0C223B] hover:bg-[#0C223B] hover:text-[#FAF8F5] transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex-1 text-center font-cormorant font-normal text-3xl text-[#0C223B]">
                        {formData.guest_count} <span className="text-xs font-sans font-normal text-[#526B82]">Guest(s)</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, guest_count: Math.min(10, formData.guest_count + 1) })}
                        className="w-9 h-9 rounded-xl bg-[#F5F2EB] border border-[#B8A072]/30 flex items-center justify-center text-[#0C223B] hover:bg-[#0C223B] hover:text-[#FAF8F5] transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#0C223B] font-semibold mb-2">
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
                                ? 'border-[#0C223B] bg-[#0C223B]/5 text-[#0C223B] font-medium shadow-sm'
                                : 'border-[#B8A072]/30 bg-white/70 text-[#526B82]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                isChecked ? 'bg-[#0C223B] border-[#0C223B] text-[#FAF8F5]' : 'border-gray-400 bg-white'
                              }`}>
                                {isChecked && <Check className="w-3 h-3" />}
                              </div>
                              <span>{event.label}</span>
                            </div>
                            <span className="text-[10px] uppercase font-mono text-[#9A8052]">
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
                  className="px-5 py-2 rounded-full border border-[#B8A072]/40 text-[#0C223B] font-cormorant uppercase tracking-[0.15em] text-xs font-medium hover:bg-[#F5F2EB]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-7 py-2.5 rounded-full bg-[#0C223B] text-[#FAF8F5] font-cormorant uppercase tracking-[0.2em] text-xs font-medium hover:bg-[#143256] hover:scale-105 transition-all border border-[#B8A072]/40 shadow-[0_4px_16px_rgba(12,34,59,0.2)]"
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
                      <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#0C223B] font-semibold mb-1">
                        Mode of Travel
                      </label>
                      <select
                        value={formData.arrival_mode}
                        onChange={(e) => setFormData({ ...formData, arrival_mode: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#B8A072]/30 text-[#0C223B] text-xs focus:outline-none focus:border-[#0C223B]"
                      >
                        <option value="Car">Personal Car / Road</option>
                        <option value="Train">Train (Chhindwara / Nagpur)</option>
                        <option value="Flight">Flight via Nagpur (NAG)</option>
                        <option value="Local">Local Resident</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#0C223B] font-semibold mb-1">
                        Expected Arrival Time
                      </label>
                      <input
                        type="text"
                        value={formData.arrival_date}
                        onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })}
                        placeholder="e.g. 14th Feb morning"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#B8A072]/30 text-[#0C223B] text-xs focus:outline-none focus:border-[#0C223B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#0C223B] font-semibold mb-1.5">
                      Accommodation Required?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, needs_accommodation: 'Yes' })}
                        className={`p-2.5 rounded-xl border text-xs font-sans transition-all ${
                          formData.needs_accommodation === 'Yes'
                            ? 'border-[#0C223B] bg-[#0C223B] text-[#FAF8F5] font-medium'
                            : 'border-[#B8A072]/30 bg-white text-[#0C223B]'
                        }`}
                      >
                        Yes, Please Arrange Room
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, needs_accommodation: 'No' })}
                        className={`p-2.5 rounded-xl border text-xs font-sans transition-all ${
                          formData.needs_accommodation === 'No'
                            ? 'border-[#0C223B] bg-[#0C223B] text-[#FAF8F5] font-medium'
                            : 'border-[#B8A072]/30 bg-white text-[#0C223B]'
                        }`}
                      >
                        No, Making Own Arrangements
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#0C223B] font-semibold mb-1">
                  Aashish Vachan • Personal Blessing Note
                </label>
                <textarea
                  rows="3"
                  value={formData.blessing_message}
                  onChange={(e) => setFormData({ ...formData, blessing_message: e.target.value })}
                  placeholder="Share your warm blessings and wishes for Tanishq &amp; Shivangee..."
                  className="w-full p-3 rounded-2xl bg-white border border-[#B8A072]/30 text-[#0C223B] placeholder:text-gray-400 text-xs focus:outline-none focus:border-[#0C223B]"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-2 rounded-full border border-[#B8A072]/40 text-[#0C223B] font-cormorant uppercase tracking-[0.15em] text-xs font-medium hover:bg-[#F5F2EB]"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-2.5 rounded-full bg-[#0C223B] text-[#FAF8F5] font-cormorant uppercase tracking-[0.2em] text-xs font-medium border border-[#B8A072]/40 hover:bg-[#143256] hover:scale-105 transition-all flex items-center gap-2 shadow-[0_8px_20px_-4px_rgba(12,34,59,0.25)]"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm RSVP'}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: DIGITAL BOARDING PASS */}
          {step === 4 && submittedData && (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-[#B8A072]/40 shadow-md overflow-hidden">
                <div className="absolute inset-1.5 border border-[#B8A072]/20 rounded-2xl pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between pb-4 border-b border-[#B8A072]/25">
                  <div>
                    <span className="font-cormorant uppercase text-[10px] tracking-[0.25em] text-[#9A8052] font-semibold block">
                      Wedding Admittance Pass
                    </span>
                    <h4 className="font-cormorant text-2xl font-light italic text-[#0C223B]">
                      Tanishq &amp; Shivangee
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#0C223B] text-[#FAF8F5] text-[10px] font-sans font-medium uppercase shadow-sm">
                    Confirmed
                  </span>
                </div>

                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-dashed border-[#B8A072]/30 text-xs font-sans">
                  <div>
                    <span className="text-[10px] text-[#526B82] uppercase block">Guest</span>
                    <strong className="text-[#0C223B] font-cormorant text-base block truncate font-medium">
                      {submittedData.guest_name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#526B82] uppercase block">Headcount</span>
                    <strong className="text-[#0C223B] font-cormorant text-base block font-medium">
                      {submittedData.guest_count || 1} Guest(s)
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#526B82] uppercase block">Side</span>
                    <strong className="text-[#0C223B] text-xs block truncate font-medium">
                      {submittedData.side}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#526B82] uppercase block">Venue</span>
                    <strong className="text-[#0C223B] text-xs block font-medium">
                      The Waterstone
                    </strong>
                  </div>
                </div>

                {submittedData.attending === 'Joyfully Attending' && (
                  <div className="relative z-10 py-4 border-b border-[#B8A072]/25 text-xs font-sans">
                    <span className="text-[10px] text-[#9A8052] uppercase block font-semibold mb-2">
                      Events Checklist:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[#0C223B]">
                      {(submittedData.events_attending || []).map((ev, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                          <span className="truncate">{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="relative z-10 pt-4 flex items-center justify-between text-xs font-sans">
                  <div>
                    <span className="text-[10px] text-[#526B82] block">Host Contact:</span>
                    <span className="font-medium text-[#0C223B]">9425006278 • 8623876930</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <QrCode className="w-7 h-7 text-[#0C223B]" />
                    <span className="text-[9px] font-mono uppercase text-[#9A8052] font-semibold">
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
                  className="flex-1 py-3 rounded-full bg-[#25D366] text-white font-sans font-medium text-xs tracking-wider uppercase shadow-sm hover:bg-[#1EBE5D] transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send Confirmation on WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-[#0C223B] text-[#FAF8F5] border border-[#B8A072]/40 font-cormorant uppercase tracking-[0.2em] text-xs font-medium hover:bg-[#143256] transition-all"
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
