import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Lock, 
  KeyRound, 
  Users, 
  CheckCircle, 
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
  RefreshCw
} from 'lucide-react';
import { getAllRsvps, calculateHeadcountMetrics } from '../services/rsvpService';
import { VintageCornerFiligree } from './BespokeIcons';

export default function AdminDashboardModal({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | guests | setup

  const [rsvps, setRsvps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSide, setSelectedSide] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [copiedCode, setCopiedCode] = useState('');

  // Correct secret PIN: 1502 (15th February)
  const CORRECT_PIN = '1502';

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  const loadData = async () => {
    const data = await getAllRsvps();
    setRsvps(data || []);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput.trim() === CORRECT_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
      loadData();
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  if (!isOpen) return null;

  // Filter guests
  const filteredGuests = rsvps.filter((g) => {
    const matchesSearch = 
      (g.guest_name && g.guest_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (g.phone && g.phone.includes(searchQuery));
    
    const matchesSide = selectedSide === 'All' || g.side === selectedSide;
    const matchesStatus = selectedStatus === 'All' || g.attending === selectedStatus;

    return matchesSearch && matchesSide && matchesStatus;
  });

  const metrics = calculateHeadcountMetrics(rsvps);

  // CSV Export logic
  const exportToCsv = () => {
    const headers = [
      'Timestamp',
      'Guest Name',
      'Phone Number',
      'Side / Affiliation',
      'Attendance Status',
      'Headcount (Guests)',
      'Ganesh Poojan',
      'Haldi Carnival',
      'Sham-e-Sangeet',
      'The Wedding',
      'Arrival Info',
      'Needs Room',
      'Blessing Message'
    ];

    const rows = filteredGuests.map(g => [
      g.created_at ? new Date(g.created_at).toLocaleString('en-IN') : '',
      `"${(g.guest_name || '').replace(/"/g, '""')}"`,
      `"${g.phone || ''}"`,
      `"${g.side || ''}"`,
      `"${g.attending || ''}"`,
      g.guest_count || 1,
      g.events_attending?.some(e => e.includes('Ganesh')) ? 'YES' : 'NO',
      g.events_attending?.some(e => e.includes('Haldi')) ? 'YES' : 'NO',
      g.events_attending?.some(e => e.includes('Sangeet')) ? 'YES' : 'NO',
      g.events_attending?.some(e => e.includes('Varmala') || e.includes('Barat') || e.includes('Wedding')) ? 'YES' : 'NO',
      `"${(g.arrival_info || '').replace(/"/g, '""')}"`,
      `"${g.needs_accommodation || 'No'}"`,
      `"${(g.blessing_message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Tanishq_Shivangee_RSVP_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyCodeToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  // Google Apps Script template
  const GOOGLE_SCRIPT_CODE = `/**
 * Google Apps Script for Tanishq weds Shivangee Live RSVP Webhook
 * 1. Open Google Sheets -> Extensions -> Apps Script
 * 2. Paste this code into Code.gs
 * 3. Deploy -> New Deployment -> Web App (Execute as: Me, Who has access: Anyone)
 * 4. Copy the Web App URL into .env as VITE_GOOGLE_SHEETS_WEBHOOK_URL
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("RSVPs") || ss.insertSheet("RSVPs");
    
    // Auto-create headers if new sheet
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Full Name", "Phone", "Side", "Attending", 
        "Headcount", "Ganesh Poojan", "Haldi Carnival", "Sham-e-Sangeet", 
        "The Wedding", "Arrival Info", "Needs Room", "Blessing Message"
      ]);
      sheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#F3E5AB");
    }
    
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.guest_name,
      data.phone,
      data.side,
      data.attending,
      data.guest_count,
      data.ganesh_poojan,
      data.haldi_carnival,
      data.sangeet,
      data.wedding,
      data.arrival_info,
      data.needs_accommodation,
      data.blessing_message
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`;

  // Supabase SQL schema template
  const SUPABASE_SQL_CODE = `-- 1. Create table for Tanishq weds Shivangee RSVPs
CREATE TABLE IF NOT EXISTS public.wedding_rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  guest_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  side TEXT DEFAULT 'Friends & Colleagues',
  attending TEXT DEFAULT 'Joyfully Attending',
  guest_count INTEGER DEFAULT 1,
  events_attending TEXT[] DEFAULT '{}',
  arrival_info TEXT,
  needs_accommodation TEXT DEFAULT 'No',
  blessing_message TEXT
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.wedding_rsvps ENABLE ROW LEVEL SECURITY;

-- 3. Public read policy (allows Wall of Blessings & countdown sync)
CREATE POLICY "Allow public read" 
ON public.wedding_rsvps FOR SELECT 
USING (true);

-- 4. Public insert policy (allows guest submissions)
CREATE POLICY "Allow public insert" 
ON public.wedding_rsvps FOR INSERT 
WITH CHECK (true);

-- 5. Enable Real-Time replication on this table
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
              Please enter the 4-digit family security PIN (1502).
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="w-full text-center text-2xl tracking-[0.5em] py-3 rounded-2xl border border-[#C5A869]/40 focus:outline-none focus:ring-2 focus:ring-[#354F3B] font-mono bg-[#F4F6F3]/50"
                autoFocus
              />

              {pinError && (
                <p className="text-xs text-red-600 font-sans">
                  Incorrect PIN. Please enter 1502.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#354F3B] text-[#E8E4D8] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold hover:bg-[#2A3F2F] transition-all"
              >
                Unlock Dashboard
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
                <span>Guest Master List ({rsvps.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('setup')}
                className={`py-3 border-b-2 flex items-center gap-1.5 transition-all ${
                  activeTab === 'setup'
                    ? 'border-[#354F3B] text-[#354F3B]'
                    : 'border-transparent text-[#7A917F] hover:text-[#354F3B]'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>1-Click Cloud Connect</span>
              </button>
            </div>

            {/* TAB 1: HEADCOUNT ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="p-6 sm:p-8 space-y-8">
                {/* 4 KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-[#F4F6F3] border border-[#C5A869]/30">
                    <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-[#7A917F] block">
                      Total RSVPs
                    </span>
                    <strong className="text-3xl font-cormorant font-bold text-[#1E2F23]">
                      {metrics.totalRsvps}
                    </strong>
                    <span className="text-[10px] text-[#7A917F] block mt-0.5">
                      Submissions received
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-emerald-800 block">
                      Total Headcount
                    </span>
                    <strong className="text-3xl font-cormorant font-bold text-emerald-900">
                      {metrics.totalHeadcount}
                    </strong>
                    <span className="text-[10px] text-emerald-700 block mt-0.5">
                      Confirmed guests
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-stone-700 block">
                      Declined
                    </span>
                    <strong className="text-3xl font-cormorant font-bold text-stone-800">
                      {metrics.declinedCount}
                    </strong>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      Regretfully declined
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#C5A869]/10 border border-[#C5A869]/30">
                    <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-[#B08D44] block">
                      Rooms Needed
                    </span>
                    <strong className="text-3xl font-cormorant font-bold text-[#6B5119]">
                      {metrics.roomsNeededCount}
                    </strong>
                    <span className="text-[10px] text-[#B08D44] block mt-0.5">
                      Accommodation requests
                    </span>
                  </div>
                </div>

                {/* Event-Wise Catering Headcount Breakdown */}
                <div className="p-6 rounded-3xl bg-[#F4F6F3] border border-[#C5A869]/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-base font-cormorant font-bold text-[#1E2F23]">
                        Event-Wise Catering &amp; Seating Headcount
                      </h4>
                      <p className="text-xs text-[#7A917F]">
                        Actual expected guests for food &amp; beverage planning
                      </p>
                    </div>
                    <button
                      onClick={loadData}
                      className="inline-flex items-center gap-1 text-xs text-[#354F3B] hover:text-[#C5A869]"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: '1. Ganesh Poojan & Mamera (14th Feb, 9 AM)', count: metrics.events.ganeshPoojan, venue: 'The Hut', color: 'bg-[#C5A869]' },
                      { name: '2. Rangrez Haldi Carnival (14th Feb, 12 PM)', count: metrics.events.haldi, venue: 'The Pool Side', color: 'bg-[#D4A373]' },
                      { name: '3. Sham-e-Sangeet & Ring Ceremony (14th Feb, 6 PM)', count: metrics.events.sangeet, venue: 'The Garden Estate', color: 'bg-[#526B58]' },
                      { name: '4. The Royal Wedding & Rajbhog Lunch (15th Feb)', count: metrics.events.wedding, venue: 'The Deck & The Hut', color: 'bg-[#354F3B]' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between text-xs font-sans mb-1">
                          <span className="font-semibold text-[#1E2F23]">{item.name}</span>
                          <span className="font-bold text-[#354F3B]">
                            {item.count} Guests ({item.venue})
                          </span>
                        </div>
                        <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-500`}
                            style={{ width: `${Math.min(100, Math.max(8, (item.count / (metrics.totalHeadcount || 1)) * 100))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Family Affiliation Breakdown */}
                <div className="grid grid-cols-3 gap-4 text-center text-xs font-sans">
                  <div className="p-3 rounded-2xl bg-white border border-[#C5A869]/30">
                    <span className="text-[#7A917F] block">Baluapuri Family</span>
                    <strong className="text-xl font-cormorant font-bold text-[#1E2F23]">
                      {metrics.sides.baluapuri}
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#C5A869]/30">
                    <span className="text-[#7A917F] block">Verma / Kushwah</span>
                    <strong className="text-xl font-cormorant font-bold text-[#1E2F23]">
                      {metrics.sides.verma}
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#C5A869]/30">
                    <span className="text-[#7A917F] block">Friends &amp; Colleagues</span>
                    <strong className="text-xl font-cormorant font-bold text-[#1E2F23]">
                      {metrics.sides.friends}
                    </strong>
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
                    <option value="Verma / Kushwah Family">Verma / Kushwah Family</option>
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
                        <th className="p-3">Room Needed</th>
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
                          <tr key={g.id || idx} className="hover:bg-[#F4F6F3]/60">
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
                            <td className="p-3 text-center font-bold text-[#1E2F23]">{g.guest_count || 1}</td>
                            <td className="p-3 text-center font-medium text-gray-600">{g.needs_accommodation || 'No'}</td>
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

            {/* TAB 3: 1-CLICK CLOUD CONNECT */}
            {activeTab === 'setup' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-base font-cormorant font-bold text-[#1E2F23] mb-1">
                    Connect Google Sheets &amp; Supabase in 60 Seconds
                  </h4>
                  <p className="text-xs text-[#7A917F] font-sans leading-relaxed">
                    The application currently stores data in local memory and automatically syncs to your live Google Sheet and Supabase PostgreSQL database whenever you set your environment keys.
                  </p>
                </div>

                {/* Google Sheet Script Box */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <strong className="text-xs font-sans text-gray-800">
                        1. Google Apps Script (Code.gs)
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
                  <pre className="p-3 rounded-xl bg-gray-900 text-gray-200 text-[11px] font-mono overflow-x-auto max-h-48">
                    {GOOGLE_SCRIPT_CODE}
                  </pre>
                </div>

                {/* Supabase SQL Schema Box */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <strong className="text-xs font-sans text-gray-800">
                        2. Supabase SQL Table Schema
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
