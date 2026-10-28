import GOOGLE_SCRIPT_CODE from '../../google-apps-script/Code.gs?raw';
import SUPABASE_SQL_CODE from '../../supabase/migrations/20261027_rsvp_outbox.sql?raw';
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
  Send,
  ExternalLink,
  MessageCircle,
  FolderCheck,
  ShieldCheck,
  HelpCircle,
  PhoneCall,
  Clock,
  AlertTriangle
} from 'lucide-react';
import {
  getAllRsvps,
  calculateHeadcountMetrics,
  verifyHostPin,
  fetchProtectedAdminRsvps,
  testGoogleSheetsConnection,
  retryRsvpSync
} from '../services/rsvpService';
import {
  FAMILY_RECIPIENTS,
  getFamilyRecipient,
  formatFamilyNotificationMessage
} from '../lib/whatsapp';

export default function AdminDashboardModal({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | guests | setup

  const [rsvps, setRsvps] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [cloudStatus, setCloudStatus] = useState({
    googleSheetsConfigured: false,
    supabaseConfigured: false,
    whatsappAutomatedConfigured: false,
    whatsappCommunityConfigured: false,
    whatsappCommunityUrl: '',
    spreadsheetName: 'T&S Wedding RSVPs',
    spreadsheetId: '1AIrha5u8g9enc93FaoOTtyeTcsmzIkygLJaiObdYt-Y',
    spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1AIrha5u8g9enc93FaoOTtyeTcsmzIkygLJaiObdYt-Y/edit',
    worksheetName: 'Sheet1'
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSide, setSelectedSide] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSync, setSelectedSync] = useState('All'); // All | synced | pending
  const [selectedWhatsapp, setSelectedWhatsapp] = useState('All'); // All | sent | pending_manual_dispatch | failed
  const [selectedCommunity, setSelectedCommunity] = useState('All'); // All | opted_in | opted_out

  // Configurable settings
  const [friendsRecipient, setFriendsRecipient] = useState(() => {
    return localStorage.getItem('wedding_friends_recipient') || '+91 9425006278';
  });
  const [sheetsUrl, setSheetsUrl] = useState(() => {
    return localStorage.getItem('wedding_google_sheet_url') || import.meta.env.VITE_GOOGLE_SHEETS_URL || 'https://docs.google.com/spreadsheets/d/1AIrha5u8g9enc93FaoOTtyeTcsmzIkygLJaiObdYt-Y/edit';
  });

  const [copiedCode, setCopiedCode] = useState('');
  const [copiedId, setCopiedId] = useState('');

  // Diagnostic test state for Google Sheets
  const [isTestingSheet, setIsTestingSheet] = useState(false);
  const [sheetTestResult, setSheetTestResult] = useState(null);

  // Retry state
  const [retryingId, setRetryingId] = useState(null);
  const [isRetryingAll, setIsRetryingAll] = useState(false);
  const [retryNotification, setRetryNotification] = useState(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  const loadData = async () => {
    try {
      const response = await fetchProtectedAdminRsvps();
      setRsvps(response.rsvps || []);
      if (response.telemetry) {
        setTelemetry(response.telemetry);
      }
      if (response.status) {
        setCloudStatus(prev => ({ ...prev, ...response.status }));
        if (response.status.whatsappCommunityUrl && !localStorage.getItem('wedding_community_url')) {
          localStorage.setItem('wedding_community_url', response.status.whatsappCommunityUrl);
        }
      }
    } catch (error) {
      setRsvps([]);
      setCloudStatus(prev => ({ ...prev, googleSheetsConfigured: false }));
      setRetryNotification({ type: 'error', text: error.message || 'Unable to load confirmed RSVPs.' });
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
      const res = await testGoogleSheetsConnection();
      setSheetTestResult(res);
    } catch (err) {
      setSheetTestResult({ success: false, error: err.message });
    } finally {
      setIsTestingSheet(false);
    }
  };

  const handleRetrySingle = async (rsvpId, action = 'all') => {
    setRetryingId(rsvpId);
    setRetryNotification(null);
    try {
      const res = await retryRsvpSync({
        rsvp_id: rsvpId,
        action
      });
      if (res.success) {
        setRetryNotification({ type: 'success', text: `Sync retry succeeded for RSVP ${rsvpId}` });
        await loadData();
      } else {
        setRetryNotification({ type: 'error', text: res.error || 'Retry attempt failed. Check connection.' });
      }
    } catch (e) {
      setRetryNotification({ type: 'error', text: e.message });
    } finally {
      setRetryingId(null);
    }
  };

  const handleRetryAllPending = async (action = 'all') => {
    setIsRetryingAll(true);
    setRetryNotification(null);
    try {
      const res = await retryRsvpSync({
        action
      });
      if (res.success) {
        setRetryNotification({
          type: 'success',
          text: `Verified ${res.processedCount || 0} record(s). ${res.remainingCount || 0} pending; retry again to continue.`
        });
        await loadData();
      } else {
        setRetryNotification({ type: 'error', text: res.error || 'Retry operations failed.' });
      }
    } catch (e) {
      setRetryNotification({ type: 'error', text: e.message });
    } finally {
      setIsRetryingAll(false);
    }
  };

  const handleSaveFriendsRecipient = (val) => {
    setFriendsRecipient(val);
    localStorage.setItem('wedding_friends_recipient', val);
    setRetryNotification({ type: 'success', text: `Friends & Colleagues routing set to ${val}` });
  };

  const handleSaveSheetsUrl = (val) => {
    setSheetsUrl(val);
    localStorage.setItem('wedding_google_sheet_url', val);
  };

  const handleOpenFamilyWhatsApp = (guest) => {
    const recipient = getFamilyRecipient(guest.side, friendsRecipient);
    const msg = formatFamilyNotificationMessage({
      guest_name: guest.guest_name,
      side: guest.side,
      attending: guest.attending,
      guest_count: guest.guest_count || (guest.attending === 'Regretfully Declining' ? 0 : 1),
      events_attending: guest.events_attending,
      arrival_date: guest.arrival_date,
      arrival_time: guest.arrival_time,
      blessing_message: guest.blessing_message,
      rsvp_id: guest.rsvp_id || guest.submission_id || guest.id
    });
    const url = `https://wa.me/${recipient}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  // Filter guests
  const filteredGuests = rsvps.filter((g) => {
    const matchesSearch =
      (g.guest_name && g.guest_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (g.phone && g.phone.includes(searchQuery)) ||
      (g.rsvp_id && g.rsvp_id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSide = selectedSide === 'All' ||
      g.side === selectedSide ||
      (selectedSide === 'Kushwah Family' && (g.side === 'Verma / Kushwah Family' || (g.side || '').toLowerCase().includes('kushwah')));

    const matchesStatus = selectedStatus === 'All' || g.attending === selectedStatus;

    const matchesSync = selectedSync === 'All' ||
      (selectedSync === 'synced' && g.sheets_sync_status === 'synced') ||
      (selectedSync === 'pending' && g.sheets_sync_status !== 'synced');

    const matchesWhatsapp = selectedWhatsapp === 'All' ||
      g.whatsapp_notify_status === selectedWhatsapp ||
      (selectedWhatsapp === 'pending_manual_dispatch' && (!g.whatsapp_notify_status || g.whatsapp_notify_status === 'pending_manual_dispatch'));

    const matchesCommunity = selectedCommunity === 'All' ||
      (selectedCommunity === 'opted_in' && g.community_consent) ||
      (selectedCommunity === 'opted_out' && !g.community_consent);

    return matchesSearch && matchesSide && matchesStatus && matchesSync && matchesWhatsapp && matchesCommunity;
  });

  const metrics = calculateHeadcountMetrics(rsvps);

  // CSV Export logic conforming to the 16 production columns (A to P)
  const exportToCsv = () => {
    const headers = [
      'RSVP ID',
      'Submission Date',
      'Submission Time',
      'Guest / Family Name',
      'WhatsApp Number',
      'Guest Side',
      'Attendance Status',
      'Number of Guests',
      'Selected Wedding Events',
      'Expected Arrival Date',
      'Expected Arrival Time',
      'Blessing / Message',
      'WhatsApp Consent',
      'Notification Status',
      'Google Sheets Sync Status',
      'Last Updated'
    ];

    const now = new Date();
    const rows = filteredGuests.map(g => [
      `"${g.rsvp_id || g.submission_id || g.id || ''}"`,
      `"${g.submission_date || (g.submitted_at ? g.submitted_at.split(',')[0].trim() : now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric' }))}"`,
      `"${g.submission_time || (g.submitted_at ? g.submitted_at.split(',')[1]?.trim() : now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST')}"`,
      `"${(g.guest_name || '').replace(/"/g, '""')}"`,
      `"${g.phone || ''}"`,
      `"${g.side || ''}"`,
      `"${g.attending || ''}"`,
      g.guest_count || (g.attending === 'Regretfully Declining' ? 0 : 1),
      `"${Array.isArray(g.events_attending) ? g.events_attending.join('; ') : (g.events_attending || '')}"`,
      `"${g.arrival_date || ''}"`,
      `"${g.arrival_time || ''}"`,
      `"${(g.blessing_message || '').replace(/"/g, '""')}"`,
      `"${g.community_consent ? 'Opted In' : 'Not Opted In'}"`,
      `"${g.whatsapp_notify_status === 'sent' ? 'Delivered' : 'Pending Manual Dispatch'}"`,
      `"${g.sheets_sync_status === 'synced' ? 'Synced' : 'Pending Sync'}"`,
      `"${g.last_updated || now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `TS_Wedding_RSVPs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyCodeToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  const copyRsvpId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-5xl bg-white rounded-3xl border border-[#C5A869]/40 shadow-2xl overflow-hidden my-6"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#C5A869]/30 bg-gradient-to-r from-[#F4F6F3] via-white to-[#F4F6F3]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#354F3B] text-[#E8E4D8] flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#C5A869]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-cormorant font-semibold text-[#1E2F23]">
                  Host Management &amp; Guest Hospitality Dashboard
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-sans font-semibold">
                  Official 2027
                </span>
              </div>
              <span className="text-[11px] font-sans text-[#7A917F] block">
                Tanishq &amp; Shivangee • Real-Time Google Sheets, WhatsApp &amp; Headcount Automation
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

        {/* Notification Banner */}
        {retryNotification && (
          <div className={`px-6 py-2.5 text-xs font-sans flex items-center justify-between ${
            retryNotification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
              : 'bg-red-50 text-red-800 border-b border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {retryNotification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              )}
              <span>{retryNotification.text}</span>
            </div>
            <button
              onClick={() => setRetryNotification(null)}
              className="text-gray-400 hover:text-gray-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

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
              Enter the authorized family host passphrase to access protected guest phone numbers, Google Sheets synchronization, and WhatsApp automation controls.
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                maxLength={128}
                value={pinInput}
                onChange={(e) => {
                  setPinError(false);
                  setPinInput(e.target.value);
                }}
                placeholder="Host passphrase"
                className="w-full text-center text-3xl tracking-[0.6em] py-3 rounded-2xl border border-[#C5A869]/40 focus:outline-none focus:ring-2 focus:ring-[#354F3B] font-mono bg-[#F4F6F3]/50"
                autoFocus
              />

              {pinError && (
                <p className="text-xs text-red-600 font-sans">
                  Incorrect host passphrase. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifying || pinInput.length < 8}
                className="w-full py-2.5 rounded-full bg-[#354F3B] text-[#E8E4D8] font-cormorant uppercase tracking-[0.2em] text-xs font-semibold hover:bg-[#2A3F2F] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isVerifying && <LoaderCircle className="w-3.5 h-3.5 animate-spin" />}
                <span>{isVerifying ? 'Verifying...' : 'Unlock Host Dashboard'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div>
            {/* Quick Status Bar */}
            <div className="bg-[#FAF7F2] border-b border-[#C5A869]/20 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[11px] font-sans">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 text-[#1E2F23]">
                  <span className={`w-2 h-2 rounded-full ${cloudStatus.googleSheetsConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="font-semibold">Google Sheets:</span>
                  <span className="text-[#55695C]">{cloudStatus.spreadsheetName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#1E2F23]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold">WhatsApp Routing:</span>
                  <span className="text-[#55695C]">Baluapuri (+91 9425006278) • Kushwah (+91 8319433078)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {sheetsUrl && (
                  <a
                    href={sheetsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#354F3B] hover:text-[#C5A869] font-medium"
                  >
                    <span>Open Connected Google Sheet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={loadData}
                  className="p-1 text-gray-500 hover:text-[#354F3B] rounded-lg hover:bg-gray-100"
                  title="Refresh Live Data"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-[#C5A869]/20 bg-[#F4F6F3] px-6 gap-2 text-xs font-sans font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'analytics'
                    ? 'border-[#354F3B] text-[#354F3B]'
                    : 'border-transparent text-[#7A917F] hover:text-[#354F3B]'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Headcount &amp; Hospitality Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('guests')}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
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
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'setup'
                    ? 'border-[#354F3B] text-[#354F3B]'
                    : 'border-transparent text-[#7A917F] hover:text-[#354F3B]'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Integrations &amp; Automations</span>
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
                    <span className="text-[11px] text-gray-500 block mt-0.5">
                      {metrics.declinedCount} Regretfully Declining
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 uppercase tracking-wider block font-semibold">
                      Confirmed Headcount
                    </span>
                    <strong className="text-2xl font-cormorant font-bold text-emerald-900">
                      {metrics.totalHeadcount} <span className="text-xs font-normal">Guests</span>
                    </strong>
                    <span className="text-[11px] text-emerald-700 block mt-0.5">
                      {metrics.attendingCount} Confirmed Families
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4F6F3] border border-[#C5A869]/30">
                    <span className="text-[10px] text-[#7A917F] uppercase tracking-wider block font-semibold">
                      Baluapuri Family (+91 9425006278)
                    </span>
                    <strong className="text-2xl font-cormorant font-bold text-[#1E2F23]">
                      {metrics.sides.baluapuri} <span className="text-xs font-normal">Guests</span>
                    </strong>
                    <span className="text-[11px] text-[#7A917F] block mt-0.5">
                      Groom's Side RSVPs
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4F6F3] border border-[#C5A869]/30">
                    <span className="text-[10px] text-[#7A917F] uppercase tracking-wider block font-semibold">
                      Kushwah Family (+91 8319433078)
                    </span>
                    <strong className="text-2xl font-cormorant font-bold text-[#1E2F23]">
                      {metrics.sides.kushwah} <span className="text-xs font-normal">Guests</span>
                    </strong>
                    <span className="text-[11px] text-[#7A917F] block mt-0.5">
                      Bride's Side RSVPs
                    </span>
                  </div>
                </div>

                {/* Automation Telemetry Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-2xl bg-white border border-[#C5A869]/30 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#354F3B]">
                        Google Sheets Sync Status
                      </span>
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-xl font-bold font-cormorant text-[#1E2F23]">
                        {telemetry?.sync?.sheetsSynced ?? rsvps.filter(r => r.sheets_sync_status === 'synced').length}
                      </strong>
                      <span className="text-xs text-gray-500">Synced of {rsvps.length}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-amber-700 font-medium">
                        {telemetry?.sync?.sheetsPending ?? rsvps.filter(r => r.sheets_sync_status !== 'synced').length} Pending Sync
                      </span>
                      <button
                        onClick={() => handleRetryAllPending('sheets')}
                        disabled={isRetryingAll}
                        className="text-[#354F3B] hover:underline font-semibold"
                      >
                        {isRetryingAll ? 'Syncing...' : 'Sync Pending'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#C5A869]/30 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#354F3B]">
                        WhatsApp Notifications
                      </span>
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-xl font-bold font-cormorant text-[#1E2F23]">
                        {telemetry?.sync?.whatsappSent ?? rsvps.filter(r => r.whatsapp_notify_status === 'sent').length}
                      </strong>
                      <span className="text-xs text-gray-500">Delivered</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-amber-700 font-medium">
                        {telemetry?.sync?.whatsappPendingManual ?? rsvps.filter(r => r.whatsapp_notify_status !== 'sent').length} Manual Dispatch Ready
                      </span>
                      <button
                        onClick={() => setActiveTab('guests')}
                        className="text-[#354F3B] hover:underline font-semibold"
                      >
                        View Guests
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#C5A869]/30 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#354F3B]">
                        WhatsApp Community Opt-in
                      </span>
                      <Users className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-xl font-bold font-cormorant text-[#1E2F23]">
                        {telemetry?.sync?.communityOptedIn ?? rsvps.filter(r => r.community_consent).length}
                      </strong>
                      <span className="text-xs text-gray-500">Guests Opted In</span>
                    </div>
                    <div className="mt-2 text-[11px] text-gray-500">
                      Explicit Consent Only (Unselected Checkbox)
                    </div>
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
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="relative flex-1 min-w-[220px]">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by guest name, phone, or RSVP ID..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#C5A869]/40 text-xs focus:outline-none focus:ring-1 focus:ring-[#354F3B]"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRetryAllPending('all')}
                        disabled={isRetryingAll}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#C5A869]/40 text-[#354F3B] font-sans font-semibold text-xs hover:bg-[#F4F6F3] transition-all"
                      >
                        {isRetryingAll ? <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                        <span>{isRetryingAll ? 'Syncing...' : 'Sync Pending to Sheets'}</span>
                      </button>

                      <button
                        onClick={exportToCsv}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#354F3B] text-[#E8E4D8] font-sans font-medium text-xs hover:bg-[#2A3F2F] transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
                    <select
                      value={selectedSide}
                      onChange={(e) => setSelectedSide(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-300 text-xs text-[#1E2F23]"
                    >
                      <option value="All">All Families</option>
                      <option value="Baluapuri Family">Baluapuri Family (+91 9425006278)</option>
                      <option value="Kushwah Family">Kushwah Family (+91 8319433078)</option>
                      <option value="Friends &amp; Colleagues">Friends &amp; Colleagues</option>
                    </select>

                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-300 text-xs text-[#1E2F23]"
                    >
                      <option value="All">All Attendance</option>
                      <option value="Joyfully Attending">Joyfully Attending</option>
                      <option value="Regretfully Declining">Regretfully Declining</option>
                    </select>

                    <select
                      value={selectedSync}
                      onChange={(e) => setSelectedSync(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-300 text-xs text-[#1E2F23]"
                    >
                      <option value="All">All Sheets Status</option>
                      <option value="synced">✓ Synced to Sheets</option>
                      <option value="pending">↻ Pending / Not Synced</option>
                    </select>

                    <select
                      value={selectedWhatsapp}
                      onChange={(e) => setSelectedWhatsapp(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-300 text-xs text-[#1E2F23]"
                    >
                      <option value="All">All WhatsApp Status</option>
                      <option value="sent">✓ Automated Sent</option>
                      <option value="pending_manual_dispatch">✉ Manual Dispatch Ready</option>
                      <option value="failed">✕ Failed</option>
                    </select>

                    <select
                      value={selectedCommunity}
                      onChange={(e) => setSelectedCommunity(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-300 text-xs text-[#1E2F23]"
                    >
                      <option value="All">All Community Status</option>
                      <option value="opted_in">✓ Opted In</option>
                      <option value="opted_out">— Not Opted In</option>
                    </select>

                    {(selectedSide !== 'All' || selectedStatus !== 'All' || selectedSync !== 'All' || selectedWhatsapp !== 'All' || selectedCommunity !== 'All' || searchQuery) && (
                      <button
                        onClick={() => {
                          setSelectedSide('All');
                          setSelectedStatus('All');
                          setSelectedSync('All');
                          setSelectedWhatsapp('All');
                          setSelectedCommunity('All');
                          setSearchQuery('');
                        }}
                        className="text-xs text-[#354F3B] underline ml-2"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto rounded-2xl border border-[#C5A869]/30 max-h-96 shadow-sm">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#F4F6F3] text-[#1E2F23] font-bold border-b border-[#C5A869]/30 sticky top-0 z-10">
                      <tr>
                        <th className="p-3">RSVP ID</th>
                        <th className="p-3">Guest &amp; WhatsApp</th>
                        <th className="p-3">Side</th>
                        <th className="p-3">Attendance</th>
                        <th className="p-3 text-center">Count</th>
                        <th className="p-3">Google Sheet</th>
                        <th className="p-3">WhatsApp Alert</th>
                        <th className="p-3">Community</th>
                        <th className="p-3">Arrival &amp; Blessing</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredGuests.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="p-8 text-center text-gray-400">
                            No RSVPs match your selected search or filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredGuests.map((g, idx) => {
                          const rsvpId = g.rsvp_id || g.submission_id || g.id || `RSVP-${idx}`;
                          const isSynced = g.sheets_sync_status === 'synced';
                          const isWhatsappSent = g.whatsapp_notify_status === 'sent';
                          const isRetryingThis = retryingId === rsvpId;

                          return (
                            <tr key={rsvpId} className="hover:bg-[#F4F6F3]/60 transition-colors">
                              {/* RSVP ID */}
                              <td className="p-3 font-mono text-[11px] text-[#354F3B]">
                                <div className="flex items-center gap-1">
                                  <span>{rsvpId}</span>
                                  <button
                                    onClick={() => copyRsvpId(rsvpId)}
                                    className="text-gray-400 hover:text-[#354F3B]"
                                    title="Copy RSVP ID"
                                  >
                                    {copiedId === rsvpId ? (
                                      <Check className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </td>

                              {/* Guest Name & WhatsApp */}
                              <td className="p-3">
                                <strong className="block text-[#1E2F23]">{g.guest_name}</strong>
                                <a
                                  href={`https://wa.me/${(g.phone || '').replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-mono text-[11px] text-[#7A917F] hover:text-[#354F3B] hover:underline"
                                >
                                  {g.phone}
                                </a>
                              </td>

                              {/* Side */}
                              <td className="p-3 text-gray-600 font-medium">
                                {g.side}
                              </td>

                              {/* Attendance */}
                              <td className="p-3">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  g.attending === 'Joyfully Attending'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-stone-200 text-stone-700'
                                }`}>
                                  {g.attending === 'Joyfully Attending' ? 'Attending' : 'Declining'}
                                </span>
                              </td>

                              {/* Count */}
                              <td className="p-3 text-center font-bold text-[#1E2F23]">
                                {g.guest_count || (g.attending === 'Regretfully Declining' ? 0 : 1)}
                              </td>

                              {/* Google Sheet Sync Badge */}
                              <td className="p-3">
                                {isSynced ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold" title={`Synced at ${g.sheets_synced_at || 'Automatic'}`}>
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Synced</span>
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleRetrySingle(rsvpId, 'sheets')}
                                    disabled={isRetryingThis}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold hover:bg-amber-100 transition-all"
                                    title="Click to retry Google Sheet sync"
                                  >
                                    <Clock className="w-3 h-3" />
                                    <span>{isRetryingThis ? 'Syncing...' : 'Pending Sync'}</span>
                                  </button>
                                )}
                              </td>

                              {/* WhatsApp Notification Badge */}
                              <td className="p-3">
                                {isWhatsappSent ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Automated Sent</span>
                                  </span>
                                ) : g.whatsapp_notify_status === 'failed' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-semibold">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Failed</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                                    <MessageCircle className="w-3 h-3" />
                                    <span>Ready for Host</span>
                                  </span>
                                )}
                              </td>

                              {/* Community Opt-in */}
                              <td className="p-3">
                                {g.community_consent ? (
                                  <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                    ✓ Opted In
                                  </span>
                                ) : (
                                  <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px]">
                                    — Not Opted
                                  </span>
                                )}
                              </td>

                              {/* Arrival & Blessing */}
                              <td className="p-3 text-gray-600 max-w-[160px]">
                                <div className="truncate font-medium text-[11px]">
                                  {g.arrival_date ? `${g.arrival_date} ${g.arrival_time || ''}` : 'Schedule TBD'}
                                </div>
                                {g.blessing_message && (
                                  <div className="truncate text-[10px] text-gray-400 italic" title={g.blessing_message}>
                                    "{g.blessing_message}"
                                  </div>
                                )}
                              </td>

                              {/* Row Actions */}
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Send WhatsApp notification to family */}
                                  <button
                                    onClick={() => handleOpenFamilyWhatsApp(g)}
                                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                    title={`Send notification to family contact (${getFamilyRecipient(g.side, friendsRecipient)})`}
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Retry Sync */}
                                  <button
                                    onClick={() => handleRetrySingle(rsvpId, 'all')}
                                    disabled={isRetryingThis}
                                    className="p-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#354F3B] transition-colors"
                                    title="Retry Sync & WhatsApp job"
                                  >
                                    {isRetryingThis ? (
                                      <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <RefreshCw className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
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
                    Live Google Workspace, Drive &amp; WhatsApp Automations
                  </h4>
                  <p className="text-xs text-[#7A917F] font-sans leading-relaxed">
                    RSVPs are validated and saved through the server. The connection check verifies access to your spreadsheet; pending records can be retried from durable storage.
                  </p>
                </div>

                {/* Integration Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Google Sheets & Drive Box */}
                  <div className="p-5 rounded-2xl bg-[#F4F6F3] border border-[#C5A869]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                        <strong className="text-sm font-sans text-[#1E2F23]">
                          Google Sheets &amp; Drive
                        </strong>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        17 Production Columns (A to Q)
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Spreadsheet:</span>
                        <strong className="text-[#1E2F23]">T&amp;S Wedding RSVPs</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Worksheet:</span>
                        <strong className="text-[#1E2F23]">Sheet1</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Spreadsheet ID:</span>
                        <span className="font-mono text-[10px] text-[#354F3B]">1AIrha5u8g9enc93FaoOTtyeTcsmzIkygLJaiObdYt-Y</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Security:</span>
                        <span className="text-emerald-700 font-medium">Formula Injection Sanitization Enabled</span>
                      </div>
                    </div>

                    {/* Sheet Link Input / Open */}
                    <div className="pt-2">
                      <label className="text-[10px] font-sans font-bold text-gray-500 uppercase block mb-1">
                        Spreadsheet Web URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={sheetsUrl}
                          onChange={(e) => handleSaveSheetsUrl(e.target.value)}
                          placeholder="https://docs.google.com/spreadsheets/d/..."
                          className="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-mono"
                        />
                        {sheetsUrl && (
                          <a
                            href={sheetsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-[#354F3B] text-white text-xs font-medium flex items-center gap-1 hover:bg-[#2A3F2F]"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">The Sheets connection is configured securely in Vercel. This check reads the production sheet without adding a test RSVP.</p>

                    {/* Test Sheet Button */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={handleTestGoogleSheets}
                        disabled={isTestingSheet}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#C5A869]/40 text-[#354F3B] text-xs font-semibold hover:bg-gray-50 transition-all flex items-center gap-1"
                      >
                        {isTestingSheet ? <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        <span>{isTestingSheet ? 'Testing Handshake...' : 'Check Sheets Connection'}</span>
                      </button>

                      <button
                        onClick={() => handleRetryAllPending('sheets')}
                        disabled={isRetryingAll}
                        className="px-3 py-1.5 rounded-xl bg-[#354F3B] text-white text-xs font-medium hover:bg-[#2A3F2F]"
                      >
                        Retry Next Pending
                      </button>
                    </div>

                    {sheetTestResult && (
                      <div className={`p-2.5 rounded-xl text-xs font-sans flex items-start gap-2 ${
                        sheetTestResult.success ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-300' : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {sheetTestResult.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <strong>{sheetTestResult.status || (sheetTestResult.success ? 'Connection Confirmed!' : 'Connection Status:')}</strong>
                          <p className="mt-0.5">{sheetTestResult.message || sheetTestResult.error}</p>
                          {(sheetTestResult.error?.includes('401') || sheetTestResult.status === 401) && (
                            <div className="mt-2.5 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed space-y-1">
                              <p className="font-bold text-amber-950">💡 How to fix &ldquo;Status 401&rdquo; in 30 seconds:</p>
                              <ol className="list-decimal list-inside space-y-0.5 text-amber-900">
                                <li>In Google Apps Script, click <strong>Deploy</strong> (top right) &gt; <strong>Manage deployments</strong>.</li>
                                <li>Click the <strong>Edit (pencil)</strong> icon next to your Web app deployment.</li>
                                <li>Under <strong>Who has access</strong>, change from <em>&ldquo;Only myself&rdquo;</em> to <strong>&ldquo;Anyone&rdquo;</strong>.</li>
                                <li>Under <strong>Version</strong>, select <strong>New version</strong>, then click <strong>Deploy</strong>.</li>
                              </ol>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Family Routing Box */}
                  <div className="p-5 rounded-2xl bg-[#F4F6F3] border border-[#C5A869]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-emerald-600" />
                        <strong className="text-sm font-sans text-[#1E2F23]">
                          WhatsApp Family Routing
                        </strong>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Strict Recipient Rules
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 space-y-2">
                      <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex justify-between items-center">
                        <div>
                          <strong className="block text-[#1E2F23]">Baluapuri Family</strong>
                          <span className="text-[10px] text-gray-500">Groom's Side RSVP Alert</span>
                        </div>
                        <span className="font-mono text-xs font-semibold text-[#354F3B]">
                          +91 9425006278
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex justify-between items-center">
                        <div>
                          <strong className="block text-[#1E2F23]">Kushwah Family</strong>
                          <span className="text-[10px] text-gray-500">Bride's Side RSVP Alert</span>
                        </div>
                        <span className="font-mono text-xs font-semibold text-[#354F3B]">
                          +91 8319433078
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-gray-200 space-y-1">
                        <div className="flex justify-between items-center">
                          <strong className="text-[#1E2F23]">Friends &amp; Colleagues Recipient</strong>
                          <span className="text-[10px] text-gray-500">Configurable</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={friendsRecipient}
                            onChange={(e) => setFriendsRecipient(e.target.value)}
                            placeholder="+91 9425006278"
                            className="flex-1 px-2.5 py-1 rounded-lg border border-gray-300 text-xs font-mono"
                          />
                          <button
                            onClick={() => handleSaveFriendsRecipient(friendsRecipient)}
                            className="px-2.5 py-1 rounded-lg bg-[#354F3B] text-white text-[11px] font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Sheet Script Box */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <strong className="text-xs font-sans text-gray-800">
                        Production Google Apps Script (signed requests, 17 columns)
                      </strong>
                    </div>

                    <button
                      onClick={() => copyCodeToClipboard(GOOGLE_SCRIPT_CODE, 'gas')}
                      className="inline-flex items-center gap-1 text-xs text-[#354F3B] font-semibold hover:text-[#C5A869]"
                    >
                      {copiedCode === 'gas' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode === 'gas' ? 'Copied Code.gs!' : 'Copy Code.gs'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-gray-900 text-gray-200 text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed">
                    {GOOGLE_SCRIPT_CODE}
                  </pre>
                </div>

                {/* Supabase SQL Schema Box */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <strong className="text-xs font-sans text-gray-800">
                        Primary Supabase Database Schema (with RSVP ID &amp; Telemetry)
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
                  <pre className="p-3 rounded-xl bg-gray-900 text-gray-200 text-[11px] font-mono overflow-x-auto max-h-48 leading-relaxed">
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
