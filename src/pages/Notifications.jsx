import { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, X, ExternalLink, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';

const NOTIFICATIONS = [
  { id: 1, type: 'critical', title: 'Fall Event Detected — ICU',          message: 'AI detected a possible fall event in ICU Room 3. Paramedic team alerted. Please review CCTV footage immediately.', time: '2 min ago', cam: 'CAM-ICU-03', link: '/monitor', read: false },
  { id: 2, type: 'high',     title: 'Camera Offline — OT Entrance',       message: 'CAM-OT-01 has gone offline. OT Entrance is unmonitored. Engineer dispatched.', time: '10 min ago', cam: 'CAM-OT-01', link: '/monitor', read: false },
  { id: 3, type: 'high',     title: 'Attendance Anomaly Detected',        message: 'KD-EMP-0034 marked present by biometric but not detected by CCTV at any entry point in the last 3 hours.', time: '24 min ago', cam: 'BIOMETRIC', link: '/attendance', read: false },
  { id: 4, type: 'medium',   title: 'Staffing Alert — ICU Night Shift',   message: 'ICU Night Shift (Shift C) has only 7 of required 10 nurses scheduled. 3 vacancies exist for tonight.', time: '45 min ago', link: '/shifts', read: false },
  { id: 5, type: 'medium',   title: 'Leave Request Pending — 3 Requests', message: '3 leave requests are awaiting your approval for next week. 2 are from ICU nurses — AI impact: High.', time: '1 hr ago', link: '/leave/requests', read: true },
  { id: 6, type: 'info',     title: 'Payroll Draft Ready',                message: 'September 2026 payroll draft is ready for review. Total gross payroll: ₹40.2L. AI has flagged 2 anomalies.', time: '2 hr ago', link: '/payroll/process', read: true },
  { id: 7, type: 'info',     title: 'Monthly Attendance Report Generated', message: 'August 2026 attendance report has been auto-generated and is available for download in Reports section.', time: '3 hr ago', link: '/reports', read: true },
  { id: 8, type: 'high',     title: 'Restricted Zone Alert — Lab',        message: 'Unauthorized personnel detected near restricted chemical storage in Laboratory. Security notified.', time: '3.5 hr ago', cam: 'CAM-LAB-02', link: '/monitor/alerts', read: true },
  { id: 9, type: 'info',     title: 'Shift Roster Published',             message: 'September Week 4 shift roster has been published. Staff can view their schedules via the K-DuraCare app.', time: '5 hr ago', link: '/shifts/roster', read: true },
  { id: 10, type: 'medium',  title: 'Biometric Device Offline — Floor 2', message: 'Biometric terminal on Floor 2 (near ICU) went offline at 14:30. Maintenance team informed.', time: '6 hr ago', link: '/settings', read: true },
];

const TYPE_CFG = {
  critical: { color: '#F87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',   label: 'Critical', dotColor: '#F87171' },
  high:     { color: '#FB923C', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.2)',  label: 'High',     dotColor: '#FB923C' },
  medium:   { color: '#FBBF24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', label: 'Medium',   dotColor: '#FBBF24' },
  info:     { color: '#38BDF8', bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.2)', label: 'Info',     dotColor: '#38BDF8' },
};

const TYPE_ICON = {
  critical: AlertTriangle,
  high:     AlertTriangle,
  medium:   Bell,
  info:     Info,
};

export default function Notifications() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState('All');

  const unread = notifs.filter(n => !n.read).length;
  const filtered = notifs.filter(n => filter === 'All' || n.type === filter || (filter === 'Unread' && !n.read));

  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => { setNotifs(prev => prev.map(n => ({ ...n, read: true }))); toast.success('All notifications marked as read'); };
  const dismiss = (id) => { setNotifs(prev => prev.filter(n => n.id !== id)); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>
            Notifications
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            {unread > 0 ? `${unread} unread alert${unread > 1 ? 's' : ''} require your attention` : 'All notifications are read'}
          </p>
        </div>
        {unread > 0 && (
          <button className="btn-secondary" style={{ fontSize: 12 }} onClick={markAllRead}>
            <CheckCircle style={{ width: 14, height: 14 }} /> Mark all read
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Critical', value: notifs.filter(n => n.type === 'critical').length, color: '#F87171' },
          { label: 'High Priority', value: notifs.filter(n => n.type === 'high').length, color: '#FB923C' },
          { label: 'Medium', value: notifs.filter(n => n.type === 'medium').length, color: '#FBBF24' },
          { label: 'Unread', value: unread, color: '#38BDF8' },
        ].map(item => (
          <div key={item.label} className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: item.color, letterSpacing: '-0.04em' }}>{item.value}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="tab-bar">
        {['All', 'Unread', 'critical', 'high', 'medium', 'info'].map(f => (
          <button key={f} className={filter === f ? 'tab-active' : 'tab-item'} onClick={() => setFilter(f)}>
            {f === 'All' ? 'All' : f === 'Unread' ? `Unread (${unread})` : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.map(notif => {
          const cfg = TYPE_CFG[notif.type] || TYPE_CFG.info;
          const Icon = TYPE_ICON[notif.type] || Bell;
          return (
            <div
              key={notif.id}
              onClick={() => markRead(notif.id)}
              style={{
                background: notif.read ? 'rgba(255,255,255,0.04)' : `${cfg.bg}`,
                border: `1px solid ${notif.read ? 'rgba(255,255,255,0.07)' : cfg.border}`,
                borderRadius: 16, padding: '18px 22px',
                cursor: 'pointer', transition: 'all 0.2s ease',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateX(3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
            >
              {/* Unread indicator */}
              {!notif.read && (
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                  background: `linear-gradient(180deg, ${cfg.color}, ${cfg.color}60)`,
                  borderRadius: '16px 0 0 16px',
                }} />
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: cfg.bg, border: `1px solid ${cfg.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: 16, height: 16, color: cfg.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{notif.title}</p>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                        color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
                      }}>{cfg.label}</span>
                      {!notif.read && (
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, boxShadow: `0 0 6px ${cfg.color}`, flexShrink: 0 }} />
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, marginBottom: 6 }}>{notif.message}</p>
                    <div className="flex items-center gap-3" style={{ fontSize: 11 }}>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>{notif.time}</span>
                      {notif.cam && <span style={{ color: 'rgba(255,255,255,0.25)' }}>· {notif.cam}</span>}
                      {notif.link && (
                        <a href={notif.link} style={{ color: '#38BDF8', display: 'flex', alignItems: 'center', gap: 3 }} onClick={e => e.stopPropagation()}>
                          <ExternalLink style={{ width: 10, height: 10 }} /> View
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  className="btn-icon"
                  style={{ padding: 5, flexShrink: 0 }}
                  onClick={e => { e.stopPropagation(); dismiss(notif.id); }}
                  title="Dismiss"
                >
                  <X style={{ width: 13, height: 13 }} />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
            <Bell style={{ width: 40, height: 40, color: 'rgba(255,255,255,0.15)', margin: '0 auto 12px' }} />
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>No notifications in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
