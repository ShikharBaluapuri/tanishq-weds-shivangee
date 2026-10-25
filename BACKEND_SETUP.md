# Tanishq weds Shivangee • Cloud Backend Setup Guide
**Celebration Dates:** 14th – 15th February 2027  
**Destination:** The Waterstone Resort, Chhindwara, Madhya Pradesh

This web application connects seamlessly with **Google Sheets** (for instant row-by-row guest tracking for the family) and **Supabase PostgreSQL** (for real-time headcount aggregation and the live Wall of Blessings).

> **Graceful Fallback:** If you have not set up your cloud keys yet, the application automatically uses `localStorage` with rich pre-loaded family blessings and sample RSVPs. Everything works out-of-the-box!

---

## 1. Google Sheets Live Webhook Setup (2 Minutes)

Every time a guest submits their RSVP, this webhook logs a complete row into your personal Google Sheet and updates event catering summaries.

### Step-by-Step Instructions:
1. Create a new Google Sheet named **`Tanishq Shivangee Wedding RSVPs`** in your Google Drive.
2. Click on **Extensions** in the top menu → **Apps Script**.
3. Replace any code in `Code.gs` with the complete script below:

```javascript
/**
 * Tanishq weds Shivangee Wedding RSVP Webhook
 * Automatically logs RSVPs and maintains live event counts
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // 10 second timeout lock to prevent concurrency issues
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Log Master RSVP row
    var rsvpSheet = ss.getSheetByName("RSVP Responses");
    if (!rsvpSheet) {
      rsvpSheet = ss.insertSheet("RSVP Responses");
      rsvpSheet.appendRow([
        "Timestamp (IST)", 
        "Full Name", 
        "WhatsApp / Phone", 
        "Side / Affiliation", 
        "Attendance Status", 
        "Headcount", 
        "Ganesh Poojan (14 Feb, 9 AM)", 
        "Rangrez Haldi (14 Feb, 12 PM)", 
        "Sham-e-Sangeet (14 Feb, 6 PM)", 
        "The Royal Wedding (15 Feb, 9 AM)", 
        "Arrival / Logistics", 
        "Needs Accommodation", 
        "Blessing Message (Aashish Vachan)"
      ]);
      rsvpSheet.getRange(1, 1, 1, 13)
        .setFontWeight("bold")
        .setBackground("#F3E5AB")
        .setFontColor("#5A1818");
      rsvpSheet.setFrozenRows(1);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    rsvpSheet.appendRow([
      data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.guest_name,
      "'" + data.phone, // Prepend apostrophe so Excel/Sheets preserves leading zeros
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
    
    // 2. Auto-update or Create Event Catering Summary Tab
    updateCateringSummary(ss);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      "status": "success", 
      "guest": data.guest_name 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      "status": "error", 
      "message": error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Creates/Updates Catering & Event Headcount Summary
 */
function updateCateringSummary(ss) {
  var summarySheet = ss.getSheetByName("Catering Summary");
  if (!summarySheet) {
    summarySheet = ss.insertSheet("Catering Summary", 0);
  }
  summarySheet.clear();
  
  summarySheet.appendRow(["Event Celebration", "Date & Time", "Venue", "Expected Headcount"]);
  summarySheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#D4AF37").setFontColor("#FFFFFF");
  
  summarySheet.appendRow(["Ganesh Poojan & Mamera", "14th Feb 2027, 9:00 AM", "The Hut – Garden Estate", '=SUMIF(\'RSVP Responses\'!G:G, "YES", \'RSVP Responses\'!F:F)']);
  summarySheet.appendRow(["Rangrez Haldi Carnival", "14th Feb 2027, 12:00 Noon", "The Pool Side – Courtyard", '=SUMIF(\'RSVP Responses\'!H:H, "YES", \'RSVP Responses\'!F:F)']);
  summarySheet.appendRow(["Sham-e-Sangeet & Rings", "14th Feb 2027, 6:00 PM", "The Garden Estate", '=SUMIF(\'RSVP Responses\'!I:I, "YES", \'RSVP Responses\'!F:F)']);
  summarySheet.appendRow(["The Royal Wedding (Shubh Vivah)", "15th Feb 2027, 9:00 AM", "The Deck – Lake Side", '=SUMIF(\'RSVP Responses\'!J:J, "YES", \'RSVP Responses\'!F:F)']);
  summarySheet.appendRow(["Sajan Goth – Rajbhog Lunch", "15th Feb 2027, Post Varmala", "The Hut – Garden Estate", '=SUMIF(\'RSVP Responses\'!J:J, "YES", \'RSVP Responses\'!F:F)']);
  
  summarySheet.appendRow(["", "", "", ""]);
  summarySheet.appendRow(["Total Confirmed Guests", "", "", '=SUMIF(\'RSVP Responses\'!E:E, "Joyfully Attending", \'RSVP Responses\'!F:F)']);
  summarySheet.appendRow(["Rooms / Accommodation Needed", "", "", '=COUNTIF(\'RSVP Responses\'!L:L, "Yes")']);
  summarySheet.getRange(7, 1, 2, 4).setFontWeight("bold");
}
```

4. Click **Deploy** (blue button in top right) → **New deployment**.
5. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
6. Set the settings:
   - **Description:** `Tanishq & Shivangee RSVP Webhook`
   - **Execute as:** `Me (your email)`
   - **Who has access:** `Anyone` (Essential for wedding guests to submit without Google login).
7. Click **Deploy** and authorize the script when prompted.
8. Copy the **Web App URL** (looks like `https://script.google.com/macros/s/.../exec`).
9. Paste it into your `.env` file:
   ```env
   VITE_GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
   ```

---

## 2. Supabase Real-Time Database Setup (1 Minute)

Supabase powers real-time sync for the **Live Wall of Blessings** and live headcount numbers.

### Step-by-Step Instructions:
1. Go to [database.new](https://database.new) or log in to your [Supabase Dashboard](https://supabase.com).
2. Create a project named `tanishq-shivangee-wedding`.
3. Open the **SQL Editor** from the left navigation.
4. Paste and run the following script:

```sql
-- 1. Create table for Tanishq weds Shivangee RSVPs
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
ALTER PUBLICATION supabase_realtime ADD TABLE public.wedding_rsvps;
```

5. Go to **Project Settings** → **API** in the Supabase dashboard.
6. Copy the **Project URL** and the **anon public API key**.
7. Add them to your `.env` file:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```

---

## 3. Environment Variables Summary (`.env`)

Create a `.env` file in the project root:
```env
# Optional Cloud Backend Integrations
VITE_GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

---

## 4. Family Host Admin Dashboard

- **Access:** Click the small lock icon (`Family Host Login`) in the website footer.
- **Security PIN:** `1502` (derived from the wedding date: 15th February).
- **Features:**
  - Real-time catering counts per event (Ganesh Poojan, Haldi, Sangeet, Wedding).
  - Searchable and filterable guest table.
  - 1-click **Export to CSV / Excel** button.
  - Built-in copy-paste scripts modal.
