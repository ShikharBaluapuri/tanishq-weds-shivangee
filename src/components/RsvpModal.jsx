import { createWhatsAppLink, formatRsvpConfirmation } from '../lib/whatsapp';
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
  QrCode, 
  LoaderCircle, 
  AlertCircle 
} from 'lucide-react';
import { submitRsvp } from '../services/rsvpService';
import { BotanicalDivider } from './BespokeIcons';

export default function RsvpModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [submissionError, setSubmissionError] = useState('');

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
    blessing_message: '',
    dietary_notes: '',
    event_notes: ''
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
    setSubmissionError('');

    const submissionPayload = {
      ...formData,
      arrival_info: formData.arrival_info 
        ? `${formData.arrival_mode} - ${formData.arrival_date} (${formData.arrival_info})`
        : `${formData.arrival_mode} - ${formData.arrival_date}`
    };

    try {
      const result = await submitRsvp(submissionPayload);
      if (!result?.success || !result.data) {
        throw new Error('The RSVP helper did not confirm the submission.');
      }
      setSubmittedData({ ...result.data, backend: result.backend });
      setStep(4);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C3A56B', '#F5F0E5', '#41584C', '#657968']
      });
    } catch (err) {
      console.error('RSVP submission error:', err);
      setErrors({ ...(err.fields || {}), submission: err.message || 'Unable to save RSVP. Please try again.' });
      setSubmissionError(err.message || 'Unable to save RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppShareUrl = () => createWhatsAppLink(
    '919425006278',
    formatRsvpConfirmation(submittedData || formData)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1E2D25]/75 backdrop-blur-md overflow-y-auto overscroll-contain">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] bg-[#FDFBF7] rounded-3xl border border-[#C3A56B]/40 shadow-2xl overflow-y-auto my-2 sm:my-6 bg-paper-texture"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 border border-[#C3A56B]/30 flex items-center justify-center text-[#343F35] hover:bg-[#41584C] hover:text-[#F5F0E5] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pt-7 pb-4 px-8 text-center border-b border-[#C3A56B]/20 bg-white/60">
          <img
            src="/monogram_gold_transparent.png"
            alt="T&amp;S"
            className="w-10 h-14 object-contain mx-auto mb-2 drop-shadow-sm"
          />

          <span className="font-cormorant uppercase text-[11px] tracking-[0.3em] text-[#657968] font-semibold block">
            Tanishq &amp; Shivangee • 14–15 Feb 2027
          </span>
          <h3 className="font-cormorant text-2xl sm:text-3xl uppercase tracking-[0.2em] font-light text-[#343F35] mt-0.5">
            {step === 4 ? 'Digital Boarding Pass' : 'Wedding Response Card'}
          </h3>
          <p className="font-cormorant italic text-xs sm:text-sm text-[#657968] mt-0.5">
            {step === 4 
              ? 'Your presence is our cherished blessing. See you in Chhindwara!' 
              : `Step ${step} of 3: ${
                  step === 1 ? 'Guest Information' : step === 2 ? 'Attendance & Headcount' : 'Travel & Blessings'
                }`}
          </p>

          {step < 4 && (
            <div className="flex items-center justify-center gap-2 max-w-xs mx-auto mt-4">
              <div className={`h-1 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-[#41584C]' : 'bg-[#C3A56B]/25'}`} />
              <div className={`h-1 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-[#41584C]' : 'bg-[#C3A56B]/25'}`} />
              <div className={`h-1 flex-1 rounded-full transition-all ${step >= 3 ? 'bg-[#41584C]' : 'bg-[#C3A56B]/25'}`} />
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-7 sm:p-9">
          
          {/* STEP 1: GUEST DETAILS */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div>
                <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#343F35] font-semibold mb-1">
                  Full Name / Family Representative <span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#657968] absolute left-1 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.guest_name}
                    onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Sharma &amp; Family"
                    className="w-full pl-8 pr-3 py-2.5 bg-transparent border-b border-[#41584C]/30 text-[#343F35] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#41584C]"
                  />
                </div>
                {errors.guest_name && (
                  <p className="text-xs text-red-600 mt-1 font-sans">{errors.guest_name}</p>
                )}
              </div>

              <div>
                <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#343F35] font-semibold mb-1">
                  WhatsApp / Phone Number <span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#657968] absolute left-1 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full pl-8 pr-3 py-2.5 bg-transparent border-b border-[#41584C]/30 text-[#343F35] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#41584C]"
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1 font-sans">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#343F35] font-semibold mb-2">
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
                          ? 'border-[#41584C] bg-[#41584C] text-[#F5F0E5] font-medium shadow-sm'
                          : 'border-[#C3A56B]/30 bg-white/80 text-[#343F35] hover:border-[#41584C]/40'
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
                  className="px-7 py-2.5 rounded-full bg-[#41584C] text-[#F5F0E5] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold hover:bg-[#2C3E34] transition-all"
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
                <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#343F35] font-semibold mb-2">
                  Will you grace the celebrations?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attending: 'Joyfully Attending' })}
                    className={`p-3 rounded-2xl border text-xs font-sans font-semibold flex items-center justify-center gap-2 transition-all ${
                      formData.attending === 'Joyfully Attending'
                        ? 'border-[#41584C] bg-[#41584C] text-[#F5F0E5] shadow-sm'
                        : 'border-[#C3A56B]/30 bg-white/80 text-[#343F35]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C3A56B]" />
                    <span>Joyfully Attending</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attending: 'Regretfully Declining' })}
                    className={`p-3 rounded-2xl border text-xs font-sans font-semibold flex items-center justify-center gap-2 transition-all ${
                      formData.attending === 'Regretfully Declining'
                        ? 'border-gray-800 bg-gray-800 text-white shadow-sm'
                        : 'border-[#C3A56B]/30 bg-white/80 text-[#343F35]'
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
                      <label className="font-cormorant uppercase text-xs tracking-[0.2em] text-[#343F35] font-semibold">
                        Total Guests Attending
                      </label>
                      <span className="text-xs text-[#657968]">
                        Including yourself
                      </span>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#EAE2D3]/40 border border-[#C3A56B]/30">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, guest_count: Math.max(1, formData.guest_count - 1) })}
                        className="w-9 h-9 rounded-xl bg-white border border-[#C3A56B]/30 flex items-center justify-center text-[#343F35] hover:bg-[#41584C] hover:text-[#F5F0E5] transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex-1 text-center font-cormorant font-bold text-3xl text-[#343F35]">
                        {formData.guest_count} <span className="text-xs font-sans font-normal text-[#657968]">Guest(s)</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, guest_count: Math.min(10, formData.guest_count + 1) })}
                        className="w-9 h-9 rounded-xl bg-white border border-[#C3A56B]/30 flex items-center justify-center text-[#343F35] hover:bg-[#41584C] hover:text-[#F5F0E5] transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#343F35] font-semibold mb-2">
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
                                ? 'border-[#41584C] bg-white text-[#343F35] font-semibold shadow-sm'
                                : 'border-[#C3A56B]/20 bg-white/50 text-[#657968]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                isChecked ? 'bg-[#41584C] border-[#41584C] text-[#F5F0E5]' : 'border-gray-400 bg-white'
                              }`}>
                                {isChecked && <Check className="w-3 h-3" />}
                              </div>
                              <span>{event.label}</span>
                            </div>
                            <span className="text-[10px] uppercase font-mono text-[#657968]">
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
                  className="px-5 py-2 rounded-full border border-[#C3A56B]/30 text-[#343F35] font-cormorant uppercase tracking-[0.15em] text-xs hover:bg-[#EAE2D3]/40"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-7 py-2.5 rounded-full bg-[#41584C] text-[#F5F0E5] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold hover:bg-[#2C3E34] transition-all"
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
                      <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#343F35] font-semibold mb-1">
                        Mode of Travel
                      </label>
                      <select
                        value={formData.arrival_mode}
                        onChange={(e) => setFormData({ ...formData, arrival_mode: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#C3A56B]/30 text-[#343F35] text-xs focus:outline-none"
                      >
                        <option value="Car">Personal Car / Road</option>
                        <option value="Train">Train (Chhindwara / Nagpur)</option>
                        <option value="Flight">Flight via Nagpur (NAG)</option>
                        <option value="Local">Local Resident</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#343F35] font-semibold mb-1">
                        Expected Arrival Time
                      </label>
                      <input
                        type="text"
                        value={formData.arrival_date}
                        onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })}
                        placeholder="e.g. 14th Feb morning"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#C3A56B]/30 text-[#343F35] text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#343F35] font-semibold mb-1.5">
                      Accommodation Required?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, needs_accommodation: 'Yes' })}
                        className={`p-2.5 rounded-xl border text-xs font-sans transition-all ${
                          formData.needs_accommodation === 'Yes'
                            ? 'border-[#41584C] bg-[#41584C] text-[#F5F0E5] font-medium'
                            : 'border-[#C3A56B]/30 bg-white text-[#343F35]'
                        }`}
                      >
                        Yes, Please Arrange Room
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, needs_accommodation: 'No' })}
                        className={`p-2.5 rounded-xl border text-xs font-sans transition-all ${
                          formData.needs_accommodation === 'No'
                            ? 'border-[#41584C] bg-[#41584C] text-[#F5F0E5] font-medium'
                            : 'border-[#C3A56B]/30 bg-white text-[#343F35]'
                        }`}
                      >
                        No, Making Own Arrangements
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#343F35] font-semibold mb-1">
                  Aashish Vachan • Personal Blessing Note
                </label>
                {['dietary_notes', 'event_notes'].map((field) => (
                  <label key={field} className="block mb-3 font-cormorant uppercase text-xs tracking-[0.2em] text-[#343F35] font-semibold">
                    {field === 'dietary_notes' ? 'Dietary Requirements' : 'Event Notes'}
                    <textarea
                      rows="2"
                      maxLength={1000}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="mt-1 block w-full rounded-xl bg-white border border-[#C3A56B]/30 p-3 font-sans normal-case tracking-normal text-xs font-normal text-[#343F35] focus:outline-none focus:border-[#41584C]"
                    />
                  </label>
                ))}

                <textarea
                  rows="3"
                  value={formData.blessing_message}
                  onChange={(e) => setFormData({ ...formData, blessing_message: e.target.value })}
                  placeholder="Share your warm blessings and wishes for Tanishq &amp; Shivangee..."
                  className="w-full p-3 rounded-2xl bg-white border border-[#C3A56B]/30 text-[#343F35] placeholder:text-gray-400 text-xs focus:outline-none focus:border-[#41584C]"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-2 rounded-full border border-[#C3A56B]/30 text-[#343F35] font-cormorant uppercase tracking-[0.15em] text-xs hover:bg-[#EAE2D3]/40"
                >
                  ← Back
                </button>

                {submissionError && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="mt-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-left text-xs text-red-800"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{submissionError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="px-8 py-2.5 rounded-full bg-[#41584C] text-[#F5F0E5] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold border border-[#C3A56B]/40 hover:bg-[#2C3E34] disabled:cursor-wait disabled:opacity-70 transition-all flex items-center gap-2"
                >
                  {isSubmitting && <LoaderCircle className="w-3.5 h-3.5 animate-spin" />}
                  {isSubmitting ? 'Saving RSVP...' : 'Confirm RSVP'}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: DIGITAL BOARDING PASS WITH CUSTOM MONOGRAM CREST */}
          {step === 4 && submittedData && (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div role="status" aria-live="polite" className="flex items-center gap-2 rounded-2xl border border-[#41584C]/20 bg-[#EAE2D3]/60 px-3 py-2.5 text-xs text-[#343F35]">
                <CheckCircle2 className="h-4 w-4 text-[#41584C]" />
                <span>Your RSVP is confirmed and ready to share with the hosts.</span>
              </div>
              <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-[#C3A56B]/40 shadow-botanical overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-[#C3A56B]/20">
                  <div className="flex items-center gap-3">
                    <img
                      src="/monogram_gold_transparent.png"
                      alt="T&amp;S Crest"
                      className="w-10 h-14 object-contain filter drop-shadow-sm"
                    />
                    <div>
                      <span className="font-cormorant uppercase text-[10px] tracking-[0.25em] text-[#657968] font-semibold block">
                        Wedding Admittance Pass
                      </span>
                      <h4 className="font-pinyon text-3xl text-[#343F35]">
                        Tanishq &amp; Shivangee
                      </h4>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#EAE2D3] text-[#41584C] border border-[#41584C]/30 text-[10px] font-sans font-bold uppercase">
                    Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-dashed border-[#C3A56B]/30 text-xs font-sans">
                  <div>
                    <span className="text-[10px] text-[#657968] uppercase block">Guest</span>
                    <strong className="text-[#343F35] font-cormorant text-sm block truncate">
                      {submittedData.guest_name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#657968] uppercase block">Headcount</span>
                    <strong className="text-[#343F35] font-cormorant text-sm block">
                      {submittedData.guest_count || 1} Guest(s)
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#657968] uppercase block">Side</span>
                    <strong className="text-[#343F35] text-xs block truncate">
                      {submittedData.side}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#657968] uppercase block">Venue</span>
                    <strong className="text-[#343F35] text-xs block">
                      The Waterstone
                    </strong>
                  </div>
                </div>

                {submittedData.attending === 'Joyfully Attending' && (
                  <div className="py-4 border-b border-[#C3A56B]/20 text-xs font-sans">
                    <span className="text-[10px] text-[#657968] uppercase block font-semibold mb-2">
                      Events Checklist:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[#343F35]">
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
                    <span className="text-[10px] text-[#657968] block">Host Contact:</span>
                    <span className="font-semibold text-[#343F35]">9425006278 • 8623876930</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <QrCode className="w-7 h-7 text-[#343F35]/70" />
                    <span className="text-[9px] font-mono uppercase text-[#657968]">
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
                  aria-label="Confirm RSVP on WhatsApp"
                  className="flex-1 py-3 rounded-full bg-[#25D366] text-white font-sans font-semibold text-xs tracking-wider uppercase shadow-sm hover:bg-[#1EBE5D] transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Confirm on WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-[#41584C] text-[#F5F0E5] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold hover:bg-[#2C3E34] transition-all"
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
