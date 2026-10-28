export function rowToRecord(row) {
  return {
    id: row[0], rsvp_id: row[0], submission_date: row[1], submission_time: row[2],
    submitted_at: `${row[1]} ${row[2]}`, guest_name: row[3], phone: row[4], side: row[5],
    attending: row[6], guest_count: Number(row[7]), events_attending: (row[8] || '').split('; ').filter(Boolean),
    arrival_date: row[9], arrival_time: row[10], blessing_message: row[11] || '',
    community_consent: row[12] === 'Opted In', whatsapp_notify_status: row[13] === 'Delivered' ? 'sent' : 'pending_manual_dispatch',
    sheets_sync_status: 'synced', last_updated: row[15], arrival_mode: row[16] || ''
  };
}
