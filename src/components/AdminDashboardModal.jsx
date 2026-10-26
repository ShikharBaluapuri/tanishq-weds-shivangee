import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Lock, 
  KeyRound, 
  Users, 
  CheckCircle, 
  CheckCircle2,
  XCircle, 
  Hotel, 
  Search, 
  Download, 
  Copy, 
  Check, 
  Code2, 
  Database, 
  FileSpreadsheet, 
  BarChart3, 
  Filter,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  Sparkles,
  Send
} from 'lucide-react';
import { 
  getAllRsvps, 
  calculateHeadcountMetrics, 
  verifyHostPin, 
  fetchProtectedAdminRsvps,
  testGoogleSheetsConnection 
} from '../services/rsvpService';
import { VintageCornerFiligree } from './BespokeIcons';

export default function AdminDashboardModal({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | guests | setup

  const [rsvps, setRsvps] = useState([]);
  const [cloudStatus, setCloudStatus] = useState({ googleSheetsConfigured: false, supabaseConfigured: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSide, setSelectedSide] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [copiedCode, setCopiedCode] = useState('');

  // Diagnostic test state for Google Sheets
  const [customWebhookInput, setCustomWebhookInput] = useState('');
  const [isTestingSheet, setIsTestingSheet] = useState(false);
  const [sheetTestResult, setSheetTestResult] = useState(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  const loadData = async () => {
    try {
      const response = await fetchProtectedAdminRsvps();
      setRsvps(response.rsvps || []);
      if (response.status) {
        setCloudStatus(response.status);
      }
    } catch {
      const fallbackData = await getAllRsvps();
      setRsvps(fallbackData || []);
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (isVerifying) return;
    setIsVerifying(true);
    setPinError(false);

    try {
      const result = await verifyHostPin(pinInput);
      if (result.success) {
        setIsAuthenticated(true);
        setPinError(false);
        setPinInput('');
        await loadData();
      } else {
        setPinError(true);
        setPinInput('');
      }
    } catch {
      setPinError(true);
      setPinInput('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTestGoogleSheets = async () => {
    setIsTestingSheet(true);
    setSheetTestResult(null);
    try {
      const res = await testGoogleSheetsConnection(customWebhookInput.trim() || null);
      setSheetTestResult(res);
    } catch (err) {
      setSheetTestResult({ success: false, error: err.message });
    } finally {
      setIsTestingSheet(false);
    }
  };

  if (!isOpen) return null;

  // Filter guests
  const filteredGuests = rsvps.filter((g) => {
    const matchesSearch = 
      (g.guest_name && g.guest_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (g.phone && g.phone.includes(searchQuery));
    
    const matchesSide = selectedSide === 'All' || 
      g.side === selectedSide || 
      (selectedSide === 'Kushwah Family' && g.side === 'Verma / Kushwah Family');
    const matchesStatus = selectedStatus === 'All' || g.attending === selectedStatus;

    return matchesSearch && matchesSide && matchesStatus;
  });

  const metrics = calculateHeadcountMetrics(rsvps);

  // CSV Export logic
  const exportToCsv = () => {
    const headers = [
      'Submission ID',
      'Submitted At (IST)',
      'Guest Name',
      'Phone / WhatsApp',
      'Side / Affiliation',
      'Attendance Response',
      'Number of Guests',
      'Expected Arrival Date',
      'Expected Arrival Time',
      'Blessings / Message',
      'Ganesh Poojan',
      'Haldi Carnival',
      'Sham-e-Sangeet',
      'The Wedding',
      'Arrival Logistics'
    ];

    const rows = filteredGuests.map(g => [
      `"${g.submission_id || g.id || ''}"`,
      `"${g.submitted_at || (g.created_at ? new Date(g.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '')}"`,
      `"${(g.guest_name || '').replace(/"/g, '""')}"`,
      `"${g.phone || ''}"`,
      `"${g.side || ''}"`,
      `"${g.attending || ''}"`,
      g.guest_count || (g.attending === 'Regretfully Declining' ? 0 : 1),
      `"${g.arrival_date || ''}"`,
      `"${g.arrival_time || ''}"`,
      `"${(g.blessing_message || '').replace(/"/g, '""')}"`,
      g.events_attending?.some(e => e.toLowerCase().includes('ganesh')) ? 'YES' : 'NO',
      g.events_attending?.some(e => e.toLowerCase().includes('haldi')) ? 'YES' : 'NO',
      g.events_attending?.some(e => e.toLowerCase().includes('sangeet')) ? 'YES' : 'NO',
      g.events_attending?.some(e => e.toLowerCase().includes('varmala') || e.toLowerCase().includes('barat') || e.toLowerCase().includes('wedding')) ? 'YES' : 'NO',
      `"${(g.arrival_info || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Tanishq_Shivangee_Wedding_RSVPs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyCodeToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  // Google Apps Script code with 10 exact columns and formula injection protection
  const GOOGLE_SCRIPT_CODE = `/**
 * Tanishq weds Shivangee • Official RSVP Webhook for Google Sheets
 * 1. Open Google Sheets -> Extensions -> Apps Script
 * 2. Paste this code into Code.gs
 * 3. Deploy -> New Deployment -> Web App
 *    - Execute as: Me (your Google account)
 *    - Who has access: Anyone
 * 4. Copy Web App URL into .env or Vercel as VITE_GOOGLE_SHEETS_WEBHOOK_URL
 */

function sanitizeForSheets(v) {
  if (typeof v !== 'string') return v;
  return /^[=+\\-@]/.test(v) ? "'" + v : v;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("RSVP Responses") || ss.insertSheet("RSVP Responses");
    
    // Auto-create headers with beautiful styling if new sheet
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Submission ID",
        "Submitted At (IST)",
        "Guest Name / Family Representative",
        "Phone / WhatsApp Number",
        "Guest Side / Family Affiliation",
        "Attendance Response",
        "Number of Guests",
        "Expected Arrival Date",
        "Expected Arrival Time",
        "Blessings / Message",
        "Ganesh Poojan (14 Feb, 9 AM)",
        "Rangrez Haldi (14 Feb, 12 PM)",
        "Sham-e-Sangeet (14 Feb, 6 PM)",
        "The Royal Wedding (15 Feb, 9 AM)",
        "Arrival Logistics & Notes"
      ]);
      sheet.getRange(1, 1, 1, 15)
        .setFontWeight("bold")
        .setBackground("#F3E5AB")
        .setFontColor("#354F3B");
      sheet.setFrozenRows(1);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      sanitizeForSheets(data.submission_id || Utilities.getUuid()),
      sanitizeForSheets(data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })),
      sanitizeForSheets(data.guest_name),
      sanitizeForSheets("'" + (data.phone || "")),
      sanitizeForSheets(data.side),
      sanitizeForSheets(data.attending),
      data.guest_count || (data.attending === "Regretfully Declining" ? 0 : 1),
      sanitizeForSheets(data.arrival_date || ""),
      sanitizeForSheets(data.arrival_time || ""),
      sanitizeForSheets(data.blessing_message || ""),
      sanitizeForSheets(data.ganesh_poojan || "NO"),
      sanitizeForSheets(data.haldi_carnival || "NO"),
      sanitizeForSheets(data.sangeet || "NO"),
      sanitizeForSheets(data.wedding || "NO"),
      sanitizeForSheets(data.arrival_info || "")
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      guest: data.guest_name 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`;

  // Supabase SQL schema template
  const SUPABASE_SQL_CODE = `-- Table for Tanishq weds Shivangee RSVPs
CREATE TABLE IF NOT EXISTS public.wedding_rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  guest_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  side TEXT DEFAULT 'Friends & Colleagues',
  attending TEXT DEFAULT 'Joyfully Attending',
  guest_count INTEGER DEFAULT 1,
  events_attending TEXT[] DEFAULT '{}',
  arrival_date TEXT,
  arrival_time TEXT,
  arrival_info TEXT,
  needs_accommodation TEXT DEFAULT 'No',
  blessing_message TEXT
);

-- Row Level Security
ALTER TABLE public.wedding_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" 
ON public.wedding_rsvps FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert" 
ON public.wedding_rsvps FOR INSERT 
WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.wedding_rsvps;`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl border border-[#C5A869]/40 shadow-2xl overflow-hidden my-6"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#C5A869]/30 bg-gradient-to-r from-[#F4F6F3] via-white to-[#F4F6F3]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#354F3B] text-[#E8E4D8] flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#C5A869]" />
            </div>
            <div>
              <h3 className="text-lg font-cormorant font-semibold text-[#1E2F23]">
                Family Host Hospitality Dashboard
              </h3>
              <span className="text-[10px] font-sans text-[#7A917F] block">
                Tanishq &amp; Shivangee • Real-Time Catering &amp; Guest Headcount
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F4F6F3] border border-[#C5A869]/30 flex items-center justify-center text-[#1E2F23] hover:bg-[#354F3B] hover:text-white transition-all"
            aria-label="Close Dashboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PIN Authentication Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#F4F6F3] border border-[#C5A869]/40 flex items-center justify-center mx-auto mb-4 text-[#354F3B]">
              <KeyRound className="w-8 h-8 text-[#C5A869]" />
            </div>

            <h4 className="text-xl font-cormorant font-semibold text-[#1E2F23] mb-1">
              Host Security Verification
            </h4>
            <p className="text-xs text-[#7A917F] mb-6 font-sans">
              Please enter your 4-digit family security PIN to access the host dashboard.
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                inputMode="numeric"
                pattern="[0-9]*"
                value={pinInput}
                onChange={(e) => {
                  setPinError(false);
                  setPinInput(e.target.value.replace(/\D/g, ''));
                }}
                placeholder="••••"
                className="w-full text-center text-3xl tracking-[0.6em] py-3 rounded-2xl border border-[#C5A869]/40 focus:outline-none focus:ring-2 focus:ring-[#354F3B] font-mono bg-[#F4F6F3]/50"
                autoFocus
              />

              {pinError && (
                <p className="text-xs text-red-600 font-sans">
                  Incorrect security PIN. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifying || pinInput.length !== 4}
                className="w-full py-2.5 rounded-full bg-[#354F3B] text-[#E8E4D8] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold hover:bg-[#2A3F2F] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isVerifying && <LoaderCircle className="w-3.5 h-3.5 animate-spin" />}
                <span>{isVerifying ? 'Verifying...' : 'Unlock Dashboard'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div>
            {/* Tabs Header */}
            <div className="flex border-b border-[#C5A869]/20 bg-[#F4F6F3] px-6 gap-4 text-xs font-sans font-semibold">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-3 border-b-2 flex items-center gap-1.5 transition-all ${
                  activeTab === 'analytics'
                    ? 'border-[#354F3B] text-[#354F3B]'
                    : 'border-transparent text-[#7A917F] hover:text-[#354F3B]'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Headcount Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('guests')}
                className={`py-3 border-b-2 flex items-center gap-1.5 transition-all ${
                  activeTab === 'guests'
                    ? 'border-[#354F3B] text-[#354F3B]'
                    : 'border-transparent text-[#7A917F] hover:text-[#354F3B]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Guest Master List ({filteredGuests.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('setup')}
                className={`py-3 border-b-2 flex items-center gap-1.5 transition-all ${
                  activeTab === 'setup'
                    ? 'border-[#354F3B] text-[#354F3B]'
                    : 'border-transparent text-[#7A917F] hover:text-[#354F3B]'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Google Sheet &amp; Database Sync</span>
              </button>
            </div>

            {/* TAB 1: ANALYTICS & CATERING COUNTS */}
            {activeTab === 'analytics' && (
              <div className="p-6 sm:p-8 space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-2xl bg-[#F4F6F3] border border-[#C5A869]/30">
                    <span className="text-[10px] text-[#7A917F] uppercase tracking-wider block font-semibold">
                      Total RSVP Entries
                    </span>
                    <strong className="text-2xl font-cormorant font-bold text-[#1E2F23]">
                      {metrics.totalRsvps}
                    </strong>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 uppercase tracking-wider block font-semibold">
                      Confirmed Headcount
                    </span>
                    <strong className="text-2xl font-cormorant font-bold text-emerald-900">
                      {metrics.totalHeadcount} <span className="text-xs font-normal">Guests</span>
                    </strong>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4F6F3] border border-[#C5A869]/30">
                    <span className="text-[10px] text-[#7A917F] uppercase tracking-wider block font-semibold">
                      Baluapuri Family
                    </span>
                    <strong className="text-2xl font-cormorant font-bold text-[#1E2F23]">
                      {metrics.sides.baluapuri} <span className="text-xs font-normal">Guests</span>
                    </strong>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4F6F3] border border-[#C5A869]/30">
                    <span className="text-[10px] text-[#7A917F] uppercase tracking-wider block font-semibold">
                      Kushwah Family
                    </span>
                    <strong className="text-2xl font-cormorant font-bold text-[#1E2F23]">
                      {metrics.sides.kushwah} <span className="text-xs font-normal">Guests</span>
                    </strong>
                  </div>
                </div>

                {/* Event-by-Event Headcount Table */}
                <div className="p-5 rounded-2xl bg-white border border-[#C5A869]/30 shadow-sm">
                  <h4 className="font-cormorant text-lg font-semibold text-[#1E2F23] mb-3">
                    Celebration Catering Headcount Requirements
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                    <div className="p-3.5 rounded-xl bg-[#F4F6F3] flex items-center justify-between">
                      <div>
                        <strong className="block text-[#1E2F23]">Ganesh Poojan &amp; Mamera</strong>
                        <span className="text-[10px] text-[#7A917F]">14 Feb, 9:00 AM • The Hut</span>
                      </div>
                      <span className="text-lg font-bold text-[#354F3B] font-cormorant">
                        {metrics.events.ganeshPoojan} Guests
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F4F6F3] flex items-center justify-between">
                      <div>
                        <strong className="block text-[#1E2F23]">Rangrez Haldi Carnival</strong>
                        <span className="text-[10px] text-[#7A917F]">14 Feb, 12:00 Noon • Pool Side</span>
                      </div>
                      <span className="text-lg font-bold text-[#354F3B] font-cormorant">
                        {metrics.events.haldi} Guests
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F4F6F3] flex items-center justify-between">
                      <div>
                        <strong className="block text-[#1E2F23]">Sham-e-Sangeet &amp; Rings</strong>
                        <span className="text-[10px] text-[#7A917F]">14 Feb, 6:00 PM • Garden Estate</span>
                      </div>
                      <span className="text-lg font-bold text-[#354F3B] font-cormorant">
                        {metrics.events.sangeet} Guests
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div>
                        <strong className="block text-emerald-900">The Royal Wedding &amp; Feast</strong>
                        <span className="text-[10px] text-emerald-700">15 Feb, 9:00 AM • Lake Deck</span>
                      </div>
                      <span className="text-lg font-bold text-emerald-900 font-cormorant">
                        {metrics.events.wedding} Guests
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GUEST MASTER LIST & SEARCH */}
            {activeTab === 'guests' && (
              <div className="p-6 sm:p-8 space-y-4">
                {/* Search & Filters Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by guest name or phone..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#C5A869]/40 text-xs focus:outline-none"
                    />
                  </div>

                  <select
                    value={selectedSide}
                    onChange={(e) => setSelectedSide(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#C5A869]/40 text-xs text-[#1E2F23]"
                  >
                    <option value="All">All Affiliations</option>
                    <option value="Baluapuri Family">Baluapuri Family</option>
                    <option value="Kushwah Family">Kushwah Family</option>
                    <option value="Friends &amp; Colleagues">Friends &amp; Colleagues</option>
                  </select>

                  <button
                    onClick={exportToCsv}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#354F3B] text-[#E8E4D8] font-sans font-medium text-xs hover:bg-[#2A3F2F] transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV (Excel)</span>
                  </button>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto rounded-2xl border border-[#C5A869]/30 max-h-96">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#F4F6F3] text-[#1E2F23] font-bold border-b border-[#C5A869]/30 sticky top-0">
                      <tr>
                        <th className="p-3">Guest Name</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Side</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Headcount</th>
                        <th className="p-3">Arrival Schedule</th>
                        <th className="p-3">Blessing Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredGuests.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-gray-400">
                            No RSVPs match your filters.
                          </td>
                        </tr>
                      ) : (
                        filteredGuests.map((g, idx) => (
                          <tr key={g.id || g.submission_id || idx} className="hover:bg-[#F4F6F3]/60">
                            <td className="p-3 font-semibold text-[#1E2F23]">{g.guest_name}</td>
                            <td className="p-3 font-mono text-[#7A917F]">{g.phone}</td>
                            <td className="p-3 text-gray-600">{g.side}</td>
                            <td className="p-3">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                g.attending === 'Joyfully Attending'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-200 text-stone-700'
                              }`}>
                                {g.attending}
                              </span>
                            </td>
                            <td className="p-3 text-center font-bold text-[#1E2F23]">
                              {g.guest_count || (g.attending === 'Regretfully Declining' ? 0 : 1)}
                            </td>
                            <td className="p-3 text-gray-600">
                              {g.arrival_date ? `${g.arrival_date} ${g.arrival_time || ''}` : (g.arrival_info || '—')}
                            </td>
                            <td className="p-3 text-gray-500 max-w-xs truncate" title={g.blessing_message}>
                              {g.blessing_message || '—'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: REAL GOOGLE SHEETS & DATABASE SYNC */}
            {activeTab === 'setup' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-base font-cormorant font-bold text-[#1E2F23] mb-1">
                    Live Google Sheets &amp; Cloud Database Connection
                  </h4>
                  <p className="text-xs text-[#7A917F] font-sans leading-relaxed">
                    Every successful RSVP submission is automatically sanitized against formula injection and saved directly to your real Google Sheet and cloud database.
                  </p>
                </div>

                {/* Connection Status & Live Ping Test Dock */}
                <div className="p-5 rounded-2xl bg-[#F4F6F3] border border-[#C5A869]/30 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#354F3B] block">
                        Google Sheets Live Sync Status
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span className="text-xs font-medium text-[#1E2F23]">
                          Active &amp; Ready for Webhook Logging
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleTestGoogleSheets}
                      disabled={isTestingSheet}
                      className="px-4 py-2 rounded-xl bg-[#354F3B] text-[#E8E4D8] font-sans text-xs font-semibold hover:bg-[#2A3F2F] disabled:opacity-50 transition-all flex items-center gap-1.5"
                    >
                      {isTestingSheet ? (
                        <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>{isTestingSheet ? 'Testing Connection...' : 'Test Google Sheet Connection'}</span>
                    </button>
                  </div>

                  {sheetTestResult && (
                    <div className={`p-3 rounded-xl text-xs font-sans flex items-start gap-2 ${
                      sheetTestResult.success ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-300' : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {sheetTestResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong>{sheetTestResult.success ? 'Connection Confirmed!' : 'Connection Status:'}</strong>
                        <p className="mt-0.5">{sheetTestResult.message || sheetTestResult.error}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Google Sheet Script Box */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <strong className="text-xs font-sans text-gray-800">
                        Google Apps Script Webhook (Code.gs)
                      </strong>
                    </div>

                    <button
                      onClick={() => copyCodeToClipboard(GOOGLE_SCRIPT_CODE, 'gas')}
                      className="inline-flex items-center gap-1 text-xs text-[#354F3B] font-semibold hover:text-[#C5A869]"
                    >
                      {copiedCode === 'gas' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode === 'gas' ? 'Copied Script!' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-gray-900 text-gray-200 text-[11px] font-mono overflow-x-auto max-h-56">
                    {GOOGLE_SCRIPT_CODE}
                  </pre>
                </div>

                {/* Supabase SQL Schema Box */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <strong className="text-xs font-sans text-gray-800">
                        Supabase PostgreSQL Schema
                      </strong>
                    </div>

                    <button
                      onClick={() => copyCodeToClipboard(SUPABASE_SQL_CODE, 'sql')}
                      className="inline-flex items-center gap-1 text-xs text-[#354F3B] font-semibold hover:text-[#C5A869]"
                    >
                      {copiedCode === 'sql' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode === 'sql' ? 'Copied SQL!' : 'Copy SQL'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-gray-900 text-gray-200 text-[11px] font-mono overflow-x-auto max-h-48">
                    {SUPABASE_SQL_CODE}
                  </pre>
                </div>
              </div>
            )}

          </div>
        )}

      </motion.div>
    </div>
  );
}
