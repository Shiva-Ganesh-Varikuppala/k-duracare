import { useState } from 'react';
import {
  Activity, Video, Users, Clock, AlertTriangle, Sparkles, MapPin, Shield,
  CheckCircle, ArrowRight, Eye, Filter, Search, Check, X, Info, Flame,
  Coffee, UserCheck, ChevronRight, Sliders, FileText, PieChart as PieIcon, RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { toast } from 'react-hot-toast';
import {
  ACTIVITY_STATES,
  LIVE_ACTIVITY_METRICS,
  DEPARTMENT_ACTIVITY_STATS,
  HOUSEKEEPING_BREAKDOWN,
  SHIFT_ACTIVITY_STATS,
  LIVE_CAMERA_SUBJECTS,
  HOSPITAL_ZONE_HEATMAP,
  IDLE_EVENTS_LOG,
  SITTING_ANALYSIS_DATA,
  POSSIBLE_GROUP_INTERACTIONS,
  EMPLOYEE_ACTIVITY_360,
  ROLE_ACTIVITY_POLICIES,
} from '../data/workerActivity';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import Badge from '../components/ui/badge/Badge';
import Button from '../components/ui/button/Button';

const DONUT_COLORS = ['#10B981', '#38BDF8', '#F59E0B', '#6366F1', '#A855F7', '#EC4899', '#64748B'];

const tooltipStyle = {
  contentStyle: { backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.75rem', color: '#f9fafb', fontSize: '12px' },
};

export default function WorkerActivity() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCamera, setSelectedCamera] = useState(LIVE_CAMERA_SUBJECTS[0]);
  const [idleEvents, setIdleEvents] = useState(IDLE_EVENTS_LOG);
  const [interactions, setInteractions] = useState(POSSIBLE_GROUP_INTERACTIONS);
  const [reviewModalEvent, setReviewModalEvent] = useState(null);
  const [reviewReason, setReviewReason] = useState('Patient-related task');
  const [reviewNotes, setReviewNotes] = useState('');
  const [selectedShift, setSelectedShift] = useState('SHIFT-A');

  const distributionData = [
    { name: 'Active Work Zone',        value: 68, color: '#10B981' },
    { name: 'Walking Movement',        value: 9,  color: '#38BDF8' },
    { name: 'Stationary (Observed)',   value: 7,  color: '#F59E0B' },
    { name: 'Sitting Posture',         value: 5,  color: '#6366F1' },
    { name: 'Break Area',              value: 4,  color: '#A855F7' },
    { name: 'Possible Interaction',    value: 3,  color: '#EC4899' },
    { name: 'Occluded / Unknown',      value: 4,  color: '#64748B' },
  ];

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewModalEvent) return;
    if (reviewModalEvent.id.startsWith('IDL')) {
      setIdleEvents(prev => prev.map(ev =>
        ev.id === reviewModalEvent.id
          ? { ...ev, status: 'Reviewed', explanation: `${reviewReason} — ${reviewNotes || 'Supervisor verified'}` }
          : ev
      ));
    } else {
      setInteractions(prev => prev.map(ev =>
        ev.id === reviewModalEvent.id
          ? { ...ev, status: 'Supervisor Verified', notes: `${reviewReason} — ${reviewNotes || 'Normal clinical coordination'}` }
          : ev
      ));
    }
    toast.success(`Event ${reviewModalEvent.id} reviewed and recorded.`);
    setReviewModalEvent(null);
    setReviewNotes('');
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        pageTitle="Worker Activity & Operational Intelligence"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Worker Activity' }]}
      />

      {/* AI Pipeline badge */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="flex items-center gap-2 rounded-full border border-success-200 bg-success-50 px-4 py-1.5 text-xs font-semibold text-success-600 dark:border-success-500/20 dark:bg-success-500/10 dark:text-success-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success-500" />
          </span>
          AI Activity Pipeline Active (YOLO + Temporal Tracking)
        </span>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Real-time vision state analysis · Observable postures & zones · Kanakadurga Nursing Home
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'On-Premises Workforce',      value: LIVE_ACTIVITY_METRICS.presentNow,          sub: `Out of ${LIVE_ACTIVITY_METRICS.totalEmployees} enrolled staff`, icon: Users,       iconBg: 'bg-blue-50 dark:bg-blue-500/10',    iconColor: 'text-blue-500', valColor: 'text-gray-800 dark:text-white' },
          { label: 'Active In Work Zones',        value: LIVE_ACTIVITY_METRICS.activeOperational,   sub: '86.7% operational presence',               icon: UserCheck,   iconBg: 'bg-success-50 dark:bg-success-500/10', iconColor: 'text-success-500', valColor: 'text-success-600 dark:text-success-400' },
          { label: 'Break-Zone Presence',         value: LIVE_ACTIVITY_METRICS.breakArea,           sub: 'Staff Room & Canteen timers',               icon: Coffee,      iconBg: 'bg-purple-50 dark:bg-purple-500/10',  iconColor: 'text-purple-500', valColor: 'text-purple-600 dark:text-purple-400' },
          { label: 'Stationary / Inactivity Alerts', value: LIVE_ACTIVITY_METRICS.idleAlerts,      sub: 'Exceeds zone temporal threshold',           icon: AlertTriangle, iconBg: 'bg-warning-50 dark:bg-warning-500/10', iconColor: 'text-warning-500', valColor: 'text-warning-600 dark:text-warning-400' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{s.label}</span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.iconBg}`}>
                  <Icon className={`h-4 w-4 ${s.iconColor}`} />
                </div>
              </div>
              <p className={`text-3xl font-extrabold ${s.valColor}`}>{s.value}</p>
              <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {[
          { id: 'overview',      label: 'Hospital Activity Overview' },
          { id: 'live',          label: 'Live Camera Tracking' },
          { id: 'heatmap',       label: 'Floor Activity Heatmap' },
          { id: 'posture',       label: 'Sitting & Inactivity Analysis' },
          { id: 'interactions',  label: 'Possible Group Interactions' },
          { id: 'employee',      label: 'Employee 360° Timeline' },
          { id: 'shifts',        label: 'Shift Activity Patterns' },
          { id: 'policies',      label: 'Role Activity Policies' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={activeTab === t.id ? 'tab-active' : 'tab-item'}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ───── TAB 1: OVERVIEW ───── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Disclaimer */}
          <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/[0.06]">
            <Info className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-500 dark:text-blue-400" />
            <div className="text-xs">
              <p className="font-bold text-gray-800 dark:text-white">Objective AI Vision Measurement Principle</p>
              <p className="mt-0.5 leading-relaxed text-gray-600 dark:text-gray-300">
                K-DuraCare records <strong>observable physical states</strong> (posture, location, movement, temporal duration). It does not label staff subjectively as "productive vs unproductive". Sitting at a nursing station or standing at a security post are normal contextual duties.
              </p>
            </div>
          </div>

          {/* Live state gauges + donut */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* State breakdown */}
            <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Live Observable Workforce States</h2>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Real-time breakdown of 278 staff detected across hospital premises</p>
                </div>
                <span className="rounded-full border border-success-200 bg-success-50 px-2.5 py-1 text-xs font-mono text-success-600 dark:border-success-500/20 dark:bg-success-500/10 dark:text-success-400">Updated 2s ago</span>
              </div>
              <div className="space-y-3 pt-2">
                {[
                  { label: 'Active in Designated Work Zone',       count: LIVE_ACTIVITY_METRICS.activeOperational, total: 278, bar: 'bg-success-500',  text: 'text-success-600 dark:text-success-400' },
                  { label: 'Walking / Inter-Zone Movement',        count: LIVE_ACTIVITY_METRICS.walking,           total: 278, bar: 'bg-blue-400',     text: 'text-blue-500 dark:text-blue-400' },
                  { label: 'Observed Stationary (Within Limits)',  count: LIVE_ACTIVITY_METRICS.stationary,        total: 278, bar: 'bg-warning-400',  text: 'text-warning-500 dark:text-warning-400' },
                  { label: 'Observed Sitting Posture',             count: LIVE_ACTIVITY_METRICS.sitting,           total: 278, bar: 'bg-indigo-400',   text: 'text-indigo-500 dark:text-indigo-400' },
                  { label: 'Possible Group Interaction (Proximity)', count: LIVE_ACTIVITY_METRICS.possibleInteraction, total: 278, bar: 'bg-pink-400', text: 'text-pink-500 dark:text-pink-400' },
                  { label: 'Designated Break Area Presence',       count: LIVE_ACTIVITY_METRICS.breakArea,         total: 278, bar: 'bg-purple-400',  text: 'text-purple-500 dark:text-purple-400' },
                  { label: 'Occluded / Low Camera Visibility',     count: LIVE_ACTIVITY_METRICS.unknown,           total: 278, bar: 'bg-gray-400',    text: 'text-gray-500 dark:text-gray-400' },
                ].map(item => {
                  const pct = Math.round((item.count / item.total) * 100);
                  return (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold font-mono ${item.text}`}>{item.count} staff</span>
                          <span className="text-gray-400 font-mono text-[11px]">({pct}%)</span>
                        </div>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className={`h-full rounded-full transition-all duration-500 ${item.bar}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Donut chart */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03] flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Activity Share (Donut)</h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Aggregated today's sensor coverage</p>
                <div className="my-2 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={distributionData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip {...tooltipStyle} formatter={(val) => [`${val}%`, 'Share']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3 text-[11px] border-t border-gray-100 dark:border-gray-800">
                {distributionData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 truncate">
                    <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="truncate text-gray-600 dark:text-gray-300">{d.name}</span>
                    <span className="ml-auto font-mono text-gray-400">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Departmental Operational Presence</h3>
              <span className="text-xs text-gray-400 dark:text-gray-500">Contextual metrics across hospital floors</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {DEPARTMENT_ACTIVITY_STATS.map(dept => (
                <div key={dept.dept} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 dark:text-white">{dept.dept}</h4>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">{dept.present} on duty / {dept.total} staff</p>
                    </div>
                    <Badge
                      variant="light"
                      color={dept.activePct >= 85 ? 'success' : dept.activePct >= 75 ? 'info' : 'warning'}
                      size="sm"
                    >
                      {dept.activePct}% Active
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {[
                      { label: 'Sitting',    value: dept.sitting,     color: 'text-indigo-500 dark:text-indigo-400' },
                      { label: 'Walking',    value: dept.walking,     color: 'text-blue-500 dark:text-blue-400' },
                      { label: 'Groups',     value: dept.interaction, color: 'text-pink-500 dark:text-pink-400' },
                      { label: 'Away Zone',  value: dept.away,        color: dept.away > 0 ? 'text-warning-500 dark:text-warning-400' : 'text-gray-400' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 p-2 dark:border-gray-800 dark:bg-white/[0.03]">
                        <p className={`text-sm font-bold ${color}`}>{value}</p>
                        <p className="text-[10px] text-gray-400">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Housekeeping breakdown */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-white/[0.03] space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white">Housekeeping Multi-Role Activity Breakdown</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Granular tracking for Aayah, Sweeper, Scavenger, and Laundry staff</p>
                </div>
                <Badge variant="light" color="warning" size="sm">Role Specific Evaluation</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
                {HOUSEKEEPING_BREAKDOWN.map(h => (
                  <div key={h.role} className="rounded-xl border border-gray-100 bg-gray-50 p-3.5 text-xs dark:border-gray-800 dark:bg-white/[0.03] space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800 dark:text-white text-sm">{h.role}</span>
                      <span className="font-mono font-semibold text-success-600 dark:text-success-400">{h.active}/{h.present} Active</span>
                    </div>
                    <p className="truncate text-[11px] text-gray-400">Zone: {h.assignedArea}</p>
                    <div className="flex justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-200 dark:border-gray-700">
                      <span>Stationary: {h.idle}</span>
                      <span>Break: {h.break}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───── TAB 2: LIVE CAMERA TRACKING ───── */}
      {activeTab === 'live' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera list */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Authorized Hospital Feeds</h3>
            <div className="space-y-3">
              {LIVE_CAMERA_SUBJECTS.map(cam => (
                <div
                  key={cam.camId}
                  onClick={() => setSelectedCamera(cam)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all hover:shadow-md ${
                    selectedCamera.camId === cam.camId
                      ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500/30 dark:bg-brand-500/10'
                      : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.03]'
                  }`}
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-500">{cam.camId}</span>
                    <Badge variant="light" color="success" size="sm">{cam.totalDetected} Subjects</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white">{cam.name}</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{cam.zone} · {cam.floor}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feed HUD + subjects */}
          <div className="lg:col-span-2 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
              {/* Simulated video */}
              <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.06]"
                  style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />
                <div className="text-center space-y-2">
                  <Video className="mx-auto h-12 w-12 text-indigo-400/40" />
                  <p className="text-sm font-bold text-gray-300">{selectedCamera.name}</p>
                  <p className="font-mono text-xs text-gray-500">RTSP Stream 1080p · AI Bounding Boxes Active</p>
                </div>
                {/* HUD badges */}
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-full border border-success-500/30 bg-black/70 px-3 py-1 text-xs font-bold text-success-400 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success-400" /> LIVE
                  </div>
                  <span className="rounded-full border border-gray-700 bg-black/70 px-3 py-1 font-mono text-xs text-gray-300 backdrop-blur-sm">{selectedCamera.camId}</span>
                </div>
                <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-indigo-600/80 px-3 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5" /> YOLO-Pose Tracking
                </div>
                {/* Bottom stats bar */}
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl border border-gray-700/60 bg-black/70 px-4 py-2 font-mono text-xs text-gray-300 backdrop-blur-sm">
                  <span>Detected: {selectedCamera.totalDetected}</span>
                  <span>Active: {selectedCamera.activeCount}</span>
                  <span>Sitting: {selectedCamera.sittingCount}</span>
                  <span>Interactions: {selectedCamera.interactionCount}</span>
                </div>
              </div>

              {/* Subject list */}
              <div className="space-y-3 p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Tracked Individuals in Camera Frustum</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedCamera.subjects.map(sub => (
                    <div key={sub.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3.5 text-xs dark:border-gray-800 dark:bg-white/[0.03] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-800 dark:text-white">{sub.id}</span>
                        <span className="font-mono text-[10px] text-success-600 dark:text-success-400">{sub.confidence}% Confidence</span>
                      </div>
                      <p className="font-medium text-gray-700 dark:text-gray-200">{sub.role}</p>
                      <p className="text-[11px] text-gray-400">Posture: <span className="text-blue-500 dark:text-blue-300">{sub.posture}</span></p>
                      <div className="flex justify-between items-center text-[10px] text-gray-400 pt-1 border-t border-gray-200 dark:border-gray-700">
                        <span>Duration: {sub.duration}</span>
                        <span className="uppercase font-mono text-gray-500">{sub.state.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───── TAB 3: FLOOR HEATMAP ───── */}
      {activeTab === 'heatmap' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Kanakadurga Hospital Floor Activity Blueprint</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Visual mapping of personnel density, stationary clusters, and corridor flow</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-success-600 dark:text-success-400"><span className="h-2 w-2 rounded-full bg-success-500" /> Normal Activity</span>
                <span className="flex items-center gap-1 text-warning-600 dark:text-warning-400"><span className="h-2 w-2 rounded-full bg-warning-400" /> Heightened Stationary</span>
                <span className="flex items-center gap-1 text-error-500"><span className="h-2 w-2 rounded-full bg-error-500" /> Obstruction Alert</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {HOSPITAL_ZONE_HEATMAP.map(zone => (
                <div key={zone.zone} className="rounded-2xl border border-gray-200 bg-gray-50 p-5 transition-all hover:border-brand-300 hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 dark:text-white">{zone.zone}</h4>
                      <p className="text-[11px] text-gray-400">{zone.floor}</p>
                    </div>
                    <Badge
                      variant="light"
                      color={zone.alertLevel === 'normal' ? 'success' : zone.alertLevel === 'attention' ? 'warning' : 'error'}
                      size="sm"
                    >
                      {zone.alertLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Personnel Density:</span>
                      <span className="font-mono font-bold text-gray-800 dark:text-white">{zone.totalPpl} detected</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Operational Movement:</span>
                      <span className="font-mono font-bold text-success-600 dark:text-success-400">{zone.activePct}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───── TAB 4: POSTURE & INACTIVITY ───── */}
      {activeTab === 'posture' && (
        <div className="space-y-6">
          {/* Sitting analysis */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Observed Sitting Posture Intelligence</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Contextual breakdown: Sitting at desks vs bedsides (Not classified as idle)</p>
              </div>
              <Badge variant="light" color="info" size="sm">Pose Geometry Classification</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SITTING_ANALYSIS_DATA.map(s => (
                <div key={s.dept} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-xs dark:border-gray-800 dark:bg-white/[0.03] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800 dark:text-white text-sm">{s.dept}</span>
                    <span className="font-mono font-bold text-indigo-500 dark:text-indigo-400">{s.currentlySitting} seated</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400">
                    <span>Today's Sessions: {s.todayEvents}</span>
                    <span>Avg Duration: {s.avgDuration}</span>
                  </div>
                  <p className="rounded-lg border border-gray-200 bg-white p-2 text-[10px] text-gray-500 dark:border-gray-700 dark:bg-white/[0.03]">
                    Clinical Context: <span className="text-blue-500 dark:text-blue-300">{s.acceptableContext}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Inactivity log */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03] space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Temporal Inactivity Exceptions (Requires Review)</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Stationary &gt; 5 minutes outside authorized desk locations</p>
            </div>
            <div className="space-y-3">
              {idleEvents.map(ev => (
                <div key={ev.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 text-xs dark:border-gray-800 dark:bg-white/[0.03]">
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="font-bold text-gray-800 dark:text-white">{ev.name}</span>
                      <span className="font-mono text-[11px] text-gray-400">({ev.empId})</span>
                      <Badge variant="light" color="info" size="sm">{ev.dept}</Badge>
                      <Badge variant="light" color={ev.status === 'Reviewed' ? 'success' : 'warning'} size="sm">{ev.status}</Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{ev.observedState} in <span className="font-medium text-blue-500 dark:text-blue-300">{ev.zone}</span></p>
                    {ev.explanation && (
                      <p className="mt-1 italic text-success-600 dark:text-success-400 text-[11px]">Reason: {ev.explanation}</p>
                    )}
                  </div>
                  {ev.status !== 'Reviewed' && (
                    <Button variant="outline" size="sm" startIcon={<Eye className="h-3.5 w-3.5" />} onClick={() => setReviewModalEvent(ev)}>
                      Explain / Review Event
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───── TAB 5: GROUP INTERACTIONS ───── */}
      {activeTab === 'interactions' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Possible Group Interaction Events</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Classified by close proximity + facing orientation + sustained stationary duration</p>
              </div>
              <Badge variant="light" color="purple" size="sm">No Audio Required</Badge>
            </div>
            <div className="space-y-4">
              {interactions.map(item => (
                <div key={item.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-white/[0.03] space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="font-bold text-gray-800 dark:text-white text-sm">{item.id}</span>
                        <span className="rounded border border-gray-200 bg-white px-2.5 py-0.5 font-mono text-xs text-brand-500 dark:border-gray-700 dark:bg-white/[0.05]">{item.camera}</span>
                        <span className="text-xs text-gray-500">{item.zone}</span>
                        <Badge variant="light" color="success" size="sm">{item.status}</Badge>
                      </div>
                      <p className="text-xs text-gray-400">Observed orientation: <span className="text-gray-700 dark:text-gray-200">{item.orientation}</span></p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold font-mono text-base text-gray-800 dark:text-white">{item.duration}</span>
                      <p className="font-mono text-[10px] text-gray-400">Confidence: {item.confidence}%</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-3 text-xs dark:border-gray-700 dark:bg-white/[0.03]">
                    <p className="text-[11px] text-gray-400 mb-0.5">Individuals in Proximity:</p>
                    <p className="font-mono text-gray-700 dark:text-gray-200">{item.participants.join(' · ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───── TAB 6: EMPLOYEE 360° TIMELINE ───── */}
      {activeTab === 'employee' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03] space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-200 bg-brand-50 text-xl font-bold text-brand-500 dark:border-brand-500/30 dark:bg-brand-500/10">
                  RR
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">{EMPLOYEE_ACTIVITY_360.name}</h3>
                  <p className="font-mono text-xs text-gray-400">{EMPLOYEE_ACTIVITY_360.employeeId} · {EMPLOYEE_ACTIVITY_360.department} · {EMPLOYEE_ACTIVITY_360.designation}</p>
                  <p className="mt-0.5 text-xs text-brand-500">{EMPLOYEE_ACTIVITY_360.shift}</p>
                </div>
              </div>
              <div className="text-right text-xs text-gray-400">
                <p>Assigned Operational Area:</p>
                <p className="font-medium text-success-600 dark:text-success-400">{EMPLOYEE_ACTIVITY_360.assignedWorkZones.join(' · ')}</p>
              </div>
            </div>

            {/* Summary pods */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
              {[
                { label: 'Work Zone',    value: EMPLOYEE_ACTIVITY_360.summary.activeWorkZone,      color: 'text-success-600 dark:text-success-400' },
                { label: 'Walking',      value: EMPLOYEE_ACTIVITY_360.summary.walkingMovement,     color: 'text-blue-500 dark:text-blue-400' },
                { label: 'Sitting',      value: EMPLOYEE_ACTIVITY_360.summary.sittingPosture,      color: 'text-indigo-500 dark:text-indigo-400' },
                { label: 'Break Zone',   value: EMPLOYEE_ACTIVITY_360.summary.breakZone,           color: 'text-purple-500 dark:text-purple-400' },
                { label: 'Stationary',   value: EMPLOYEE_ACTIVITY_360.summary.stationaryObserved,  color: 'text-warning-500 dark:text-warning-400' },
                { label: 'Interaction',  value: EMPLOYEE_ACTIVITY_360.summary.possibleInteraction, color: 'text-pink-500 dark:text-pink-400' },
                { label: 'Occluded',     value: EMPLOYEE_ACTIVITY_360.summary.occludedUnknown,     color: 'text-gray-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 p-2.5 dark:border-gray-800 dark:bg-white/[0.03]">
                  <span className="text-[10px] text-gray-400 block">{label}</span>
                  <span className={`font-bold text-sm ${color}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Chronological Vision Event Sequence</h4>
              <div className="relative space-y-2 before:absolute before:bottom-2 before:left-[4.5rem] before:top-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
                {EMPLOYEE_ACTIVITY_360.timeline.map((item, i) => (
                  <div key={i} className="relative flex items-center gap-4 pl-2 text-xs">
                    <span className="w-16 text-right font-mono text-xs font-bold text-gray-400">{item.time}</span>
                    <div className="z-10 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-brand-500 border-2 border-white dark:border-gray-900" />
                    <div className="flex flex-1 items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-2.5 dark:border-gray-800 dark:bg-white/[0.03]">
                      <div>
                        <span className="font-bold text-gray-800 dark:text-white">{item.zone}</span>
                        <p className="text-[11px] text-gray-400">{item.detail}</p>
                      </div>
                      <span className="rounded border border-brand-200 bg-brand-50 px-2 py-0.5 font-mono text-[10px] text-brand-500 dark:border-brand-500/20 dark:bg-brand-500/10">{item.event}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───── TAB 7: SHIFT ACTIVITY PATTERNS ───── */}
      {activeTab === 'shifts' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SHIFT_ACTIVITY_STATS.map(s => (
              <div
                key={s.code}
                onClick={() => setSelectedShift(s.code)}
                className={`cursor-pointer rounded-2xl border p-5 transition-all hover:shadow-md ${
                  selectedShift === s.code
                    ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500/30 dark:bg-brand-500/10'
                    : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]'
                }`}
              >
                <div className="mb-2 flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-brand-500">{s.code}</span>
                  <Badge variant="light" color="success" size="sm">{s.activeRate} Active</Badge>
                </div>
                <h4 className="text-base font-bold text-gray-800 dark:text-white">{s.name}</h4>
                <p className="mt-0.5 font-mono text-xs text-gray-400">{s.time}</p>
                <div className="mt-4 space-y-1 border-t border-gray-100 pt-3 text-xs dark:border-gray-800">
                  {[
                    { label: 'Present',    value: `${s.present} / ${s.scheduled}`, color: 'text-gray-800 dark:text-white' },
                    { label: 'Work Zone',  value: s.activeOperational,              color: 'text-success-600 dark:text-success-400' },
                    { label: 'Stationary', value: s.stationary,                     color: 'text-warning-600 dark:text-warning-400' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex justify-between text-gray-500 dark:text-gray-400">
                      <span>{label}:</span>
                      <span className={`font-bold ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───── TAB 8: ROLE ACTIVITY POLICIES ───── */}
      {activeTab === 'policies' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {ROLE_ACTIVITY_POLICIES.map(pol => (
            <div key={pol.role} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-800 dark:text-white">{pol.role}</h3>
                <Badge variant="light" color="info" size="sm">Policy Configured</Badge>
              </div>
              <div className="space-y-2 text-xs">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03]">
                  <span className="text-[11px] text-gray-400 block">Authorized Work Zones:</span>
                  <p className="mt-0.5 font-semibold text-gray-700 dark:text-gray-200">{pol.workZones.join(' · ')}</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Idle Threshold',  value: `>${pol.maxIdleMinutes}m`,              color: 'text-warning-600 dark:text-warning-400' },
                    { label: 'Max Sitting',      value: `>${pol.maxSittingDurationMinutes}m`,   color: 'text-indigo-500 dark:text-indigo-400' },
                    { label: 'Group Threshold',  value: `>${pol.maxGroupInteractionMinutes}m`,  color: 'text-pink-500 dark:text-pink-400' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 p-2.5 text-center dark:border-gray-800 dark:bg-white/[0.03]">
                      <span className="block text-[10px] text-gray-400">{label}</span>
                      <span className={`font-bold font-mono text-sm ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400">
                  Standing Rule: <span className="text-blue-500 dark:text-blue-300">{pol.standingPolicy}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ───── REVIEW MODAL ───── */}
      {reviewModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900 space-y-4">
            <button
              onClick={() => setReviewModalEvent(null)}
              className="absolute right-5 top-5 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-50 dark:bg-warning-500/10">
                <AlertTriangle className="h-5 w-5 text-warning-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Review Inactivity Exception</h2>
                <p className="text-xs text-gray-400">{reviewModalEvent.id} · {reviewModalEvent.name || reviewModalEvent.camera}</p>
              </div>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/[0.03] space-y-1">
                <p className="text-gray-400">Observed Condition: <span className="font-semibold text-gray-800 dark:text-white">{reviewModalEvent.observedState || reviewModalEvent.duration}</span></p>
                <p className="text-gray-400">Location: <span className="font-semibold text-blue-500 dark:text-blue-300">{reviewModalEvent.zone}</span></p>
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-600 dark:text-gray-300">Select Operational Justification</label>
                <select value={reviewReason} onChange={e => setReviewReason(e.target.value)} className="input-field w-full text-xs">
                  <option>Patient-related clinical assistance</option>
                  <option>Clinical briefing / Team handover</option>
                  <option>Emergency OT / ICU assistance</option>
                  <option>Authorized break period</option>
                  <option>Assigned duty elsewhere by In-charge</option>
                  <option>Camera occlusion / Misclassification</option>
                  <option>Other supervisor verified reason</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block font-medium text-gray-600 dark:text-gray-300">Supervisor Audit Note</label>
                <textarea
                  rows="3"
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  placeholder="Enter confirmation details or staff discussion record..."
                  className="input-field w-full text-xs"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setReviewModalEvent(null)}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm">Confirm & Resolve Event</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
