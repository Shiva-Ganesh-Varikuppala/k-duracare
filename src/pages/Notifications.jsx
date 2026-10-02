import { useState } from 'react';
import { Bell, AlertTriangle, Info, X, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import Badge from '../components/ui/badge/Badge';
import Button from '../components/ui/button/Button';

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
  critical: { badgeColor: 'error',   label: 'Critical', Icon: AlertTriangle, iconClass: 'text-gray-400 dark:text-gray-500' },
  high:     { badgeColor: 'warning', label: 'High',     Icon: AlertTriangle, iconClass: 'text-gray-400 dark:text-gray-500' },
  medium:   { badgeColor: 'warning', label: 'Medium',   Icon: Bell,          iconClass: 'text-gray-400 dark:text-gray-500' },
  info:     { badgeColor: 'info',    label: 'Info',     Icon: Info,          iconClass: 'text-gray-400 dark:text-gray-500' },
};

const TABS = ['All', 'Unread', 'critical', 'high', 'medium', 'info'];

export default function Notifications() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState('All');

  const unread = notifs.filter(n => !n.read).length;
  const filtered = notifs.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.read;
    return n.type === filter;
  });

  const markRead    = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => { setNotifs(prev => prev.map(n => ({ ...n, read: true }))); toast.success('All notifications marked as read'); };
  const dismiss     = (id) => { setNotifs(prev => prev.filter(n => n.id !== id)); };

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        pageTitle="Notifications"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Notifications' }]}
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: notifs.length, color: 'text-gray-800 dark:text-white' },
          { label: 'Unread', value: unread, color: 'text-brand-500' },
          { label: 'Critical / High', value: notifs.filter(n => n.type === 'critical' || n.type === 'high').length, color: 'text-error-500' },
          { label: 'Info', value: notifs.filter(n => n.type === 'info').length, color: 'text-blue-500' },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + actions */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  filter === tab
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.08]'
                }`}
              >
                {tab === 'All' ? 'All' : tab === 'Unread' ? `Unread (${unread})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unread === 0}>
            Mark all read
          </Button>
        </div>
      </div>

      {/* Notification list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <Bell className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No notifications here</p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Try a different filter</p>
          </div>
        )}

        {filtered.map(notif => {
          const cfg = TYPE_CFG[notif.type] || TYPE_CFG.info;
          const Icon = cfg.Icon;
          return (
            <div
              key={notif.id}
              onClick={() => markRead(notif.id)}
              className={`relative cursor-pointer rounded-xl border bg-white transition-colors hover:bg-gray-50 dark:bg-white/[0.03] dark:hover:bg-white/[0.05] ${notif.read ? 'border-gray-100 dark:border-gray-800 opacity-60' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <div className="flex items-start gap-4 p-4">
                {/* Unread dot */}
                {!notif.read && (
                  <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-brand-500" />
                )}

                {/* Icon */}
                <div className={`mt-0.5 flex-shrink-0 ${cfg.iconClass}`}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant="light" color={cfg.badgeColor} size="sm">{cfg.label}</Badge>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{notif.title}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{notif.message}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                    <span>{notif.time}</span>
                    {notif.cam && (
                      <>
                        <span>·</span>
                        <span className="font-mono">{notif.cam}</span>
                      </>
                    )}
                    {notif.link && (
                      <>
                        <span>·</span>
                        <a
                          href={notif.link}
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 text-brand-500 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" /> View
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Dismiss */}
                <button
                  onClick={e => { e.stopPropagation(); dismiss(notif.id); }}
                  className="ml-1 flex-shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.06] dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
