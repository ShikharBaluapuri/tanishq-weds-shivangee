import { createWhatsAppLink, formatRsvpConfirmation } from '../lib/whatsapp';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  User, 
  Phone, 
  Share2, 
  Plus, 
  Minus, 
  Check, 
  QrCode, 
  LoaderCircle, 
  AlertCircle,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { submitRsvp } from '../services/rsvpService';
import { BotanicalDivider } from './BespokeIcons';
import { triggerFloralShower } from './FloralPetalsEngine';

/**
 * Bespoke Wedding Stationery Date Picker
 * Allows guests to pick a real date on an elegant ivory & sage calendar
 */
function WeddingDatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date(2027, 1, 1)); // Default view Feb 2027

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(year, month + 1, 1));
  };

  const selectDay = (day) => {
    const formatted = `${day} ${monthNames[month]} ${year}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const quickDates = [
    { label: '13 Feb (Pre-wedding)', val: '13 February 2027' },
    { label: '14 Feb (Day 1)', val: '14 February 2027' },
    { label: '15 Feb (Day 2)', val: '15 February 2027' }
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#C3A56B]/35 text-xs text-left focus:outline-none focus:border-[#41584C] hover:border-[#41584C]/50 transition-all shadow-sm group"
      >
        <div className="flex items-center gap-2.5 truncate">
          <Calendar className="w-4 h-4 text-[#C3A56B] flex-shrink-0" />
          <span className={value ? 'text-[#343F35] font-medium' : 'text-gray-400'}>
            {value || 'Select Arrival Date'}
          </span>
        </div>
        <span className="text-[10px] uppercase font-cormorant tracking-widest text-[#657968] group-hover:text-[#41584C]">
          {isOpen ? 'Close' : 'Choose'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-40 mt-1.5 p-3.5 bg-[#FDFBF7] rounded-2xl border border-[#C3A56B]/40 shadow-xl bg-paper-texture">
          {/* Calendar Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#C3A56B]/20">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-[#EAE2D3] text-[#343F35] transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-cormorant font-semibold text-sm text-[#343F35] tracking-wide">
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-[#EAE2D3] text-[#343F35] transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Dates Chips */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {quickDates.map((q) => (
              <button
                key={q.val}
                type="button"
                onClick={() => { onChange(q.val); setIsOpen(false); }}
                className={`text-[10px] font-sans px-2 py-0.5 rounded-full border transition-all ${
                  value === q.val
                    ? 'bg-[#41584C] text-[#F5F0E5] border-[#41584C] font-medium'
                    : 'bg-white text-[#657968] border-[#C3A56B]/30 hover:border-[#41584C]'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-sans uppercase font-medium text-[#657968] mb-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <span key={`empty-${idx}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const formattedDate = `${day} ${monthNames[month]} ${year}`;
              const isSelected = value === formattedDate;
              const isWeddingDay = year === 2027 && month === 1 && (day === 14 || day === 15);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={`h-7 w-7 mx-auto rounded-lg text-xs font-sans transition-all flex items-center justify-center relative ${
                    isSelected
                      ? 'bg-[#41584C] text-[#F5F0E5] font-semibold shadow-sm'
                      : isWeddingDay
                      ? 'bg-[#EAE2D3] text-[#343F35] font-semibold border border-[#C3A56B]/60 hover:bg-[#41584C] hover:text-white'
                      : 'text-[#343F35] hover:bg-[#EAE2D3]/70'
                  }`}
                >
                  {day}
                  {isWeddingDay && !isSelected && (
                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#C3A56B]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Bespoke Wedding Stationery Time Picker
 * 12-hour format with AM/PM and quick selection
 */
function WeddingTimePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const parseTime = (val) => {
    if (!val) return { hour: '10', minute: '30', period: 'AM' };
    const parts = val.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (parts) {
      return { hour: parts[1].padStart(2, '0'), minute: parts[2], period: parts[3].toUpperCase() };
    }
    return { hour: '10', minute: '30', period: 'AM' };
  };

  const { hour, minute, period } = parseTime(value);

  const updateTime = (newH, newM, newP) => {
    const formatted = `${newH}:${newM} ${newP}`;
    onChange(formatted);
  };

  const quickTimes = [
    { label: 'Morning (09:00 AM)', time: '09:00 AM' },
    { label: 'Noon (12:00 PM)', time: '12:00 PM' },
    { label: 'Afternoon (03:30 PM)', time: '03:30 PM' },
    { label: 'Evening (06:00 PM)', time: '06:00 PM' },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#C3A56B]/35 text-xs text-left focus:outline-none focus:border-[#41584C] hover:border-[#41584C]/50 transition-all shadow-sm group"
      >
        <div className="flex items-center gap-2.5 truncate">
          <Clock className="w-4 h-4 text-[#C3A56B] flex-shrink-0" />
          <span className={value ? 'text-[#343F35] font-medium' : 'text-gray-400'}>
            {value || 'Select Arrival Time'}
          </span>
        </div>
        <span className="text-[10px] uppercase font-cormorant tracking-widest text-[#657968] group-hover:text-[#41584C]">
          {isOpen ? 'Close' : 'Choose'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-40 mt-1.5 p-3.5 bg-[#FDFBF7] rounded-2xl border border-[#C3A56B]/40 shadow-xl bg-paper-texture">
          <div className="text-[11px] font-cormorant uppercase tracking-widest text-[#657968] font-semibold mb-2 text-center">
            Approximate Arrival Time
          </div>

          {/* Quick presets */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {quickTimes.map(qt => (
              <button
                key={qt.time}
                type="button"
                onClick={() => { onChange(qt.time); setIsOpen(false); }}
                className={`text-[10px] font-sans px-2 py-1 rounded-lg border text-left transition-all ${
                  value === qt.time
                    ? 'bg-[#41584C] text-[#F5F0E5] border-[#41584C] font-medium'
                    : 'bg-white text-[#343F35] border-[#C3A56B]/30 hover:border-[#41584C]'
                }`}
              >
                {qt.label}
              </button>
            ))}
          </div>

          {/* Time Dial Selectors */}
          <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-[#EAE2D3]/50 border border-[#C3A56B]/20">
            {/* Hour Selector */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] uppercase font-sans text-[#657968] mb-1">Hour</span>
              <select
                value={hour}
                onChange={(e) => updateTime(e.target.value, minute, period)}
                className="px-2 py-1 rounded-lg bg-white border border-[#C3A56B]/40 text-xs font-mono font-medium text-[#343F35] focus:outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <span className="text-base font-bold text-[#343F35] self-end mb-1">:</span>

            {/* Minute Selector */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] uppercase font-sans text-[#657968] mb-1">Minute</span>
              <select
                value={minute}
                onChange={(e) => updateTime(hour, e.target.value, period)}
                className="px-2 py-1 rounded-lg bg-white border border-[#C3A56B]/40 text-xs font-mono font-medium text-[#343F35] focus:outline-none"
              >
                {['00', '15', '30', '45'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* AM / PM Toggle */}
            <div className="flex flex-col items-center ml-1">
              <span className="text-[9px] uppercase font-sans text-[#657968] mb-1">Period</span>
              <div className="flex rounded-lg border border-[#C3A56B]/40 overflow-hidden">
                {['AM', 'PM'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => updateTime(hour, minute, p)}
                    className={`px-2 py-1 text-xs font-sans font-semibold transition-all ${
                      period === p
                        ? 'bg-[#41584C] text-[#F5F0E5]'
                        : 'bg-white text-[#657968] hover:bg-[#EAE2D3]/60'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!value) updateTime(hour, minute, period);
                setIsOpen(false);
              }}
              className="px-4 py-1 rounded-full bg-[#41584C] text-[#F5F0E5] text-[11px] font-sans font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
    arrival_date: '14 February 2027',
    arrival_time: '10:30 AM',
    arrival_info: '',
    needs_accommodation: 'No',
    blessing_message: '',
    dietary_notes: '',
    event_notes: ''
  });

  const [errors, setErrors] = useState({});

  // Lock background page scroll while RSVP modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

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
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmissionError('');

    const formattedArrival = formData.arrival_date && formData.arrival_time
      ? `${formData.arrival_date} at ${formData.arrival_time}`
      : formData.arrival_date || formData.arrival_time || '14 February 2027';

    const submissionPayload = {
      ...formData,
      arrival_date: formattedArrival,
      arrival_info: `${formData.arrival_mode} - ${formattedArrival}`,
      needs_accommodation: 'No', // Removed from UI, cleanly defaulted for database compatibility
      dietary_notes: '',
      event_notes: '',
      blessing_message: (formData.blessing_message || '').trim()
    };

    try {
      const result = await submitRsvp(submissionPayload);
      if (!result?.success || !result.data) {
        throw new Error('The RSVP helper did not confirm the submission.');
      }
      setSubmittedData({ ...result.data, backend: result.backend });
      setStep(4);
      try {
        triggerFloralShower(null, 45);
      } catch (e) {
        console.warn('Floral shower on RSVP confirmation:', e);
      }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-[#1E2D25]/80 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-xl max-h-[92dvh] sm:max-h-[780px] flex flex-col bg-[#FDFBF7] rounded-3xl border border-[#C3A56B]/40 shadow-2xl overflow-hidden bg-paper-texture"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 border border-[#C3A56B]/30 flex items-center justify-center text-[#343F35] hover:bg-[#41584C] hover:text-[#F5F0E5] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header (Pinned at top) */}
        <div className="shrink-0 pt-6 sm:pt-7 pb-3.5 px-6 sm:px-8 text-center border-b border-[#C3A56B]/20 bg-[#FDFBF7]/95 backdrop-blur-sm z-10">
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
                  step === 1 ? 'Guest Information' : step === 2 ? 'Attendance & Headcount' : 'Travel Schedule'
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

        {/* Form Body (Single-container smooth scrolling with generous bottom padding) */}
        <div className="overflow-y-auto flex-1 px-6 sm:px-9 py-5 overscroll-contain modal-scrollbar pb-8 sm:pb-10">
          
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
                    'Kushwah Family',
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

              <div className="pt-5 pb-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#41584C] text-[#F5F0E5] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold hover:bg-[#2C3E34] transition-all shadow-sm"
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

              {formData.attending === 'Regretfully Declining' && (
                <div className="p-4 rounded-2xl bg-[#EAE2D3]/50 border border-[#C3A56B]/30 text-center">
                  <p className="font-cormorant italic text-sm text-[#343F35]">
                    We will dearly miss your gracious presence at the celebrations.
                  </p>
                  <p className="text-[11px] font-sans text-[#657968] mt-1">
                    Please confirm your response below so we can record your blessings in our guest ledger.
                  </p>
                </div>
              )}

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

              <div className="pt-5 pb-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-2.5 rounded-full border border-[#C3A56B]/30 text-[#343F35] font-cormorant uppercase tracking-[0.15em] text-xs hover:bg-[#EAE2D3]/40 transition-colors"
                >
                  ← Back
                </button>

                {formData.attending === 'Regretfully Declining' ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-full bg-gray-800 text-white font-cormorant uppercase tracking-[0.2em] text-xs font-semibold hover:bg-black transition-all flex items-center gap-2 shadow-sm"
                  >
                    {isSubmitting && <LoaderCircle className="w-3.5 h-3.5 animate-spin" />}
                    <span>Confirm Response</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3 rounded-full bg-[#41584C] text-[#F5F0E5] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold hover:bg-[#2C3E34] transition-all shadow-sm"
                  >
                    Continue to Travel Schedule →
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: TRAVEL SCHEDULE (Streamlined, elegant, no unwanted textboxes) */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              {formData.attending === 'Joyfully Attending' && (
                <>
                  {/* Mode of Travel Pills */}
                  <div>
                    <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#343F35] font-semibold mb-2">
                      Mode of Travel
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'Car', label: 'Personal Car / Road' },
                        { id: 'Train', label: 'Train (CWA / NGP)' },
                        { id: 'Flight', label: 'Flight via Nagpur' },
                        { id: 'Local', label: 'Local Resident' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, arrival_mode: m.id })}
                          className={`p-2.5 rounded-xl border text-xs font-sans text-center transition-all ${
                            formData.arrival_mode === m.id
                              ? 'border-[#41584C] bg-[#41584C] text-[#F5F0E5] font-medium shadow-sm'
                              : 'border-[#C3A56B]/30 bg-white text-[#343F35] hover:border-[#41584C]/40'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time Selectors Side by Side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#343F35] font-semibold mb-1">
                        Expected Arrival Date
                      </label>
                      <WeddingDatePicker
                        value={formData.arrival_date}
                        onChange={(d) => setFormData({ ...formData, arrival_date: d })}
                      />
                    </div>

                    <div>
                      <label className="block font-cormorant uppercase text-xs tracking-[0.2em] text-[#343F35] font-semibold mb-1">
                        Expected Arrival Time
                      </label>
                      <WeddingTimePicker
                        value={formData.arrival_time}
                        onChange={(t) => setFormData({ ...formData, arrival_time: t })}
                      />
                    </div>
                  </div>

                  {/* A Blessing for the Couple (Dedicated luxury wedding stationery message box) */}
                  <div className="rounded-2xl bg-[#FDFBF7] border border-[#C3A56B]/35 p-4 sm:p-5 shadow-sm bg-paper-texture">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C3A56B]" />
                        <h4 className="font-cormorant text-base sm:text-lg font-semibold text-[#343F35]">
                          A Blessing for the Couple
                        </h4>
                      </div>
                      <span className="text-[10px] uppercase font-sans tracking-widest text-[#657968] font-medium">
                        Optional
                      </span>
                    </div>

                    <p className="text-xs text-[#657968] font-sans mb-3">
                      Leave a heartfelt wish or blessing for Tanishq &amp; Shivangee.
                    </p>

                    <div className="relative">
                      <textarea
                        rows={3}
                        maxLength={500}
                        value={formData.blessing_message}
                        onChange={(e) => setFormData({ ...formData, blessing_message: e.target.value })}
                        placeholder="Write your blessings and wishes here..."
                        className="w-full p-3 sm:p-3.5 rounded-xl bg-white/80 border border-[#C3A56B]/30 text-xs font-sans text-[#343F35] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#41584C] focus:border-[#41584C] resize-none transition-all leading-relaxed"
                      />
                      <div className="flex items-center justify-between mt-1 text-[10px] text-[#657968]">
                        <span className="font-cormorant italic">Your words will be cherished forever</span>
                        <span className="font-mono">{(formData.blessing_message || '').length}/500</span>
                      </div>
                    </div>
                  </div>

                  {/* Hospitable reassurance note */}
                  <div className="p-3.5 rounded-2xl bg-[#EAE2D3]/40 border border-[#C3A56B]/30 text-center">
                    <p className="font-cormorant italic text-xs sm:text-sm text-[#343F35]">
                      Our family reception team will be ready to welcome you at The Waterstone Resort, Chhindwara.
                    </p>
                  </div>
                </>
              )}

              <div className="pt-5 pb-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-2.5 rounded-full border border-[#C3A56B]/30 text-[#343F35] font-cormorant uppercase tracking-[0.15em] text-xs hover:bg-[#EAE2D3]/40 transition-colors"
                >
                  ← Back
                </button>

                {submissionError && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-left text-xs text-red-800"
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
                  className="px-9 py-3 rounded-full bg-[#41584C] text-[#F5F0E5] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold border border-[#C3A56B]/40 hover:bg-[#2C3E34] disabled:cursor-wait disabled:opacity-70 transition-all flex items-center gap-2 shadow-sm"
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
                    <span className="text-[10px] text-[#657968] uppercase block">Arrival</span>
                    <strong className="text-[#343F35] text-xs block truncate">
                      {formData.arrival_date ? `${formData.arrival_date}` : 'The Waterstone'}
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

                {submittedData.blessing_message && (
                  <div className="py-3.5 border-b border-[#C3A56B]/20 text-xs font-sans bg-[#FDFBF7] -mx-6 sm:-mx-8 px-6 sm:px-8">
                    <span className="text-[10px] text-[#657968] uppercase block font-semibold mb-1">
                      Your Heartfelt Blessing:
                    </span>
                    <p className="font-cormorant italic text-sm text-[#343F35] leading-relaxed">
                      "{submittedData.blessing_message}"
                    </p>
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
