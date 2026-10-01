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

const DONUT_COLORS = ['#10B981', '#38BDF8', '#F59E0B', '#6366F1', '#A855F7', '#EC4899', '#64748B'];

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
    { name: 'Active Work Zone', value: 68, color: '#10B981' },
    { name: 'Walking Movement', value: 9, color: '#38BDF8' },
    { name: 'Stationary (Observed)', value: 7, color: '#F59E0B' },
    { name: 'Sitting Posture', value: 5, color: '#6366F1' },
    { name: 'Break Area', value: 4, color: '#A855F7' },
    { name: 'Possible Interaction', value: 3, color: '#EC4899' },
    { name: 'Occluded / Unknown', value: 4, color: '#64748B' },
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
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-sky-400" /> Worker Activity & Operational Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time vision state analysis · Observable postures & zones · Role-specific context · Kanakadurga Nursing Home
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-emerald-500/10 border border-emerald-500/25 rounded-full px-4 py-2 text-emerald-400">
            <div className="live-dot" />
            <span>AI Activity Pipeline Active (YOLO + Temporal Tracking)</span>
          </div>
        </div>
      </div>

      {/* Top Glass Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card-hover p-5 border border-slate-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">On-Premises Workforce</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{LIVE_ACTIVITY_METRICS.presentNow}</p>
          <p className="text-[11px] text-slate-400 mt-1">Out of {LIVE_ACTIVITY_METRICS.totalEmployees} enrolled staff</p>
        </div>

        <div className="glass-card-hover p-5 border border-slate-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Active In Work Zones</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">{LIVE_ACTIVITY_METRICS.activeOperational}</p>
          <p className="text-[11px] text-slate-400 mt-1">86.7% operational presence</p>
        </div>

        <div className="glass-card-hover p-5 border border-slate-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Break-Zone Presence</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Coffee className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-purple-400">{LIVE_ACTIVITY_METRICS.breakArea}</p>
          <p className="text-[11px] text-slate-400 mt-1">Staff Room & Canteen timers</p>
        </div>

        <div className="glass-card-hover p-5 border border-slate-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Stationary / Inactivity Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-400">{LIVE_ACTIVITY_METRICS.idleAlerts}</p>
          <p className="text-[11px] text-slate-400 mt-1">Exceeds zone temporal threshold</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {[
          { id: 'overview', label: 'Hospital Activity Overview' },
          { id: 'live', label: 'Live Camera Tracking' },
          { id: 'heatmap', label: 'Floor Activity Heatmap' },
          { id: 'posture', label: 'Sitting & Inactivity Analysis' },
          { id: 'interactions', label: 'Possible Group Interactions' },
          { id: 'employee', label: 'Employee 360° Timeline' },
          { id: 'shifts', label: 'Shift Activity Patterns' },
          { id: 'policies', label: 'Role Activity Policies' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={activeTab === t.id ? 'tab-active' : 'tab-item'}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: HOSPITAL ACTIVITY OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Important Clinical Disclaimer Card */}
          <div className="glass-card p-4 border-l-4 border-sky-500 flex items-start gap-3 bg-sky-500/5">
            <Info className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-white">Objective AI Vision Measurement Principle</p>
              <p className="text-slate-300 mt-0.5 leading-relaxed">
                K-DuraCare records <strong>observable physical states</strong> (posture, location, movement, temporal duration). It does not label staff subjectively as "productive vs unproductive". Sitting at a nursing station or standing at a security post are normal contextual duties.
              </p>
            </div>
          </div>

          {/* Primary Split: Live Activity State Gauges & Donut Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live State Breakdown (2 cols) */}
            <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-700/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Live Observable Workforce States</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time breakdown of 278 staff detected across hospital premises</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Updated 2s ago
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { label: 'Active in Designated Work Zone', count: LIVE_ACTIVITY_METRICS.activeOperational, total: 278, color: 'bg-emerald-500', text: 'text-emerald-400' },
                  { label: 'Walking / Inter-Zone Movement', count: LIVE_ACTIVITY_METRICS.walking, total: 278, color: 'bg-sky-400', text: 'text-sky-400' },
                  { label: 'Observed Stationary (Within Limits)', count: LIVE_ACTIVITY_METRICS.stationary, total: 278, color: 'bg-amber-400', text: 'text-amber-400' },
                  { label: 'Observed Sitting Posture', count: LIVE_ACTIVITY_METRICS.sitting, total: 278, color: 'bg-indigo-400', text: 'text-indigo-400' },
                  { label: 'Possible Group Interaction (Proximity)', count: LIVE_ACTIVITY_METRICS.possibleInteraction, total: 278, color: 'bg-pink-400', text: 'text-pink-400' },
                  { label: 'Designated Break Area Presence', count: LIVE_ACTIVITY_METRICS.breakArea, total: 278, color: 'bg-purple-400', text: 'text-purple-400' },
                  { label: 'Occluded / Low Camera Visibility', count: LIVE_ACTIVITY_METRICS.unknown, total: 278, color: 'bg-slate-500', text: 'text-slate-400' },
                ].map(item => {
                  const pct = Math.round((item.count / item.total) * 100);
                  return (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold font-mono ${item.text}`}>{item.count} staff</span>
                          <span className="text-slate-500 font-mono text-[11px]">({pct}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-navy-800">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Donut Chart Distribution (1 col) */}
            <div className="glass-card p-6 rounded-2xl border border-slate-700/60 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Activity Share (Donut)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Aggregated today's sensor coverage</p>
                <div className="h-48 my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: '#0F1629', border: '1px solid #1E2A45', borderRadius: '10px', fontSize: '12px' }}
                        formatter={(val) => [`${val}%`, 'Share']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-navy-700">
                {distributionData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 truncate">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-300 truncate">{d.name}</span>
                    <span className="text-slate-500 font-mono ml-auto">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department Activity Matrix Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Departmental Operational Presence</h3>
              <span className="text-xs text-slate-400">Contextual metrics across hospital floors</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {DEPARTMENT_ACTIVITY_STATS.map(dept => (
                <div
                  key={dept.dept}
                  className="glass-card-hover p-5 rounded-2xl border border-slate-700/60 transition-all duration-300 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">{dept.dept}</h4>
                      <p className="text-[11px] text-slate-400">{dept.present} on duty / {dept.total} staff</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      dept.activePct >= 85 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                      dept.activePct >= 75 ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' :
                      'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {dept.activePct}% Active
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-navy-950/70 rounded-lg border border-navy-800">
                      <p className="text-[10px] text-slate-400">Sitting</p>
                      <p className="text-sm font-bold text-indigo-400 mt-0.5">{dept.sitting}</p>
                    </div>
                    <div className="p-2 bg-navy-950/70 rounded-lg border border-navy-800">
                      <p className="text-[10px] text-slate-400">Walking</p>
                      <p className="text-sm font-bold text-sky-400 mt-0.5">{dept.walking}</p>
                    </div>
                    <div className="p-2 bg-navy-950/70 rounded-lg border border-navy-800">
                      <p className="text-[10px] text-slate-400">Groups</p>
                      <p className="text-sm font-bold text-pink-400 mt-0.5">{dept.interaction}</p>
                    </div>
                    <div className="p-2 bg-navy-950/70 rounded-lg border border-navy-800">
                      <p className="text-[10px] text-slate-400">Away Zone</p>
                      <p className={`text-sm font-bold mt-0.5 ${dept.away > 0 ? 'text-amber-400' : 'text-slate-400'}`}>{dept.away}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Housekeeping Role Drilldown */}
            <div className="glass-card p-5 rounded-2xl border border-slate-700/60 space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Housekeeping Multi-Role Activity Breakdown</h4>
                  <p className="text-xs text-slate-400">Granular tracking for Aayah, Sweeper, Scavenger, and Laundry staff</p>
                </div>
                <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Role Specific Evaluation
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
                {HOUSEKEEPING_BREAKDOWN.map(h => (
                  <div key={h.role} className="p-3.5 rounded-xl bg-navy-900/80 border border-navy-700/70 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-sm">{h.role}</span>
                      <span className="text-emerald-400 font-mono font-semibold">{h.active}/{h.present} Active</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">Zone: {h.assignedArea}</p>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-navy-800">
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

      {/* TAB 2: LIVE CAMERA TRACKING & HUD */}
      {activeTab === 'live' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Camera Selection List (1 col) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Authorized Hospital Feeds</h3>
            <div className="space-y-3">
              {LIVE_CAMERA_SUBJECTS.map(cam => (
                <div
                  key={cam.camId}
                  onClick={() => setSelectedCamera(cam)}
                  className={`glass-card-hover p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedCamera.camId === cam.camId
                      ? 'border-sky-500 bg-navy-800 ring-1 ring-sky-500/50'
                      : 'border-slate-700/60 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-sky-400">{cam.camId}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {cam.totalDetected} Subjects Tracked
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{cam.name}</h4>
                  <p className="text-xs text-slate-400">{cam.zone} · {cam.floor}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Feed HUD Viewport & Subject Inspector (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card rounded-2xl overflow-hidden border border-slate-700/60">
              {/* Simulated Camera Video Surface with HUD Elements */}
              <div className="aspect-video bg-navy-950 relative flex items-center justify-center overflow-hidden border-b border-navy-800">
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                <div className="text-center p-6 space-y-2">
                  <Video className="w-12 h-12 text-sky-400/40 mx-auto" />
                  <p className="text-sm font-bold text-slate-200">{selectedCamera.name}</p>
                  <p className="text-xs text-slate-500 font-mono">RTSP Stream 1080p · AI Bounding Boxes Active</p>
                </div>

                {/* Top HUD Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-400 border border-emerald-500/30">
                    <div className="live-dot" /> LIVE
                  </div>
                  <span className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-slate-300 border border-slate-700">
                    {selectedCamera.camId}
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-indigo-500/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" /> YOLO-Pose Tracking
                </div>

                {/* Bottom HUD Stats */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs font-mono text-slate-300 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/60">
                  <span>Detected: {selectedCamera.totalDetected} Persons</span>
                  <span>Active: {selectedCamera.activeCount}</span>
                  <span>Sitting: {selectedCamera.sittingCount}</span>
                  <span>Interactions: {selectedCamera.interactionCount}</span>
                </div>
              </div>

              {/* Tracked Subjects in this Camera */}
              <div className="p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tracked Individuals in Camera Frustum</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedCamera.subjects.map(sub => (
                    <div key={sub.id} className="p-3.5 rounded-xl bg-navy-900/80 border border-navy-700 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{sub.id}</span>
                        <span className="font-mono text-[10px] text-emerald-400">{sub.confidence}% Confidence</span>
                      </div>
                      <p className="text-slate-300 font-medium">{sub.role}</p>
                      <p className="text-[11px] text-slate-400">Posture: <span className="text-sky-300">{sub.posture}</span></p>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-navy-800">
                        <span>Duration in state: {sub.duration}</span>
                        <span className="text-slate-400 uppercase font-mono">{sub.state.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FLOOR ACTIVITY HEATMAP */}
      {activeTab === 'heatmap' && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card p-6 rounded-2xl border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Kanakadurga Hospital Floor Activity Blueprint</h3>
                <p className="text-xs text-slate-400">Visual mapping of personnel density, stationary clusters, and corridor flow</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Normal Activity</span>
                <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400" /> Heightened Stationary</span>
                <span className="flex items-center gap-1 text-red-400"><span className="w-2 h-2 rounded-full bg-red-400" /> Obstruction Alert</span>
              </div>
            </div>

            {/* Visual Floor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {HOSPITAL_ZONE_HEATMAP.map(zone => (
                <div
                  key={zone.zone}
                  className="glass-card-hover p-5 rounded-2xl border border-slate-700/60 space-y-3 transition-all hover:border-sky-500/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{zone.zone}</h4>
                      <p className="text-[11px] text-slate-400">{zone.floor}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      zone.alertLevel === 'normal' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      zone.alertLevel === 'attention' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {zone.alertLevel.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Personnel Density:</span>
                      <span className="font-mono font-bold text-white">{zone.totalPpl} detected</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Operational Movement:</span>
                      <span className="font-mono font-bold text-emerald-400">{zone.activePct}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SITTING & INACTIVITY POSTURE ANALYSIS */}
      {activeTab === 'posture' && (
        <div className="space-y-6 animate-fade-in">
          {/* Sitting Analysis Grid */}
          <div className="glass-card p-6 rounded-2xl border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Observed Sitting Posture Intelligence</h3>
                <p className="text-xs text-slate-400">Contextual breakdown: Sitting at desks vs bedsides (Not classified as idle)</p>
              </div>
              <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Pose Geometry Classification
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SITTING_ANALYSIS_DATA.map(s => (
                <div key={s.dept} className="p-4 rounded-xl bg-navy-900/80 border border-navy-700 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{s.dept}</span>
                    <span className="text-indigo-300 font-mono font-bold">{s.currentlySitting} currently seated</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Today's Sessions: {s.todayEvents}</span>
                    <span>Avg Duration: {s.avgDuration}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 p-2 rounded bg-navy-950/70 border border-navy-800">
                    Clinical Context: <span className="text-sky-300">{s.acceptableContext}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Potential Inactivity Log Cards */}
          <div className="glass-card p-6 rounded-2xl border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Temporal Inactivity Exceptions (Requires Review)</h3>
                <p className="text-xs text-slate-400">Stationary &gt; 5 minutes outside authorized desk locations</p>
              </div>
            </div>

            <div className="space-y-3">
              {idleEvents.map(ev => (
                <div key={ev.id} className="p-4 rounded-xl bg-navy-900/80 border border-slate-700 flex items-center justify-between gap-4 flex-wrap text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">{ev.name}</span>
                      <span className="text-slate-400 font-mono text-[11px]">({ev.empId})</span>
                      <span className="bg-navy-950 text-sky-400 px-2 py-0.5 rounded border border-navy-800">{ev.dept}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ev.status === 'Reviewed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {ev.status}
                      </span>
                    </div>
                    <p className="text-slate-300">{ev.observedState} in <span className="text-sky-300 font-medium">{ev.zone}</span></p>
                    {ev.explanation && (
                      <p className="text-emerald-400 text-[11px] mt-1 italic">Reason: {ev.explanation}</p>
                    )}
                  </div>

                  {ev.status !== 'Reviewed' && (
                    <button
                      onClick={() => setReviewModalEvent(ev)}
                      className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Explain / Review Event
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: POSSIBLE GROUP INTERACTIONS */}
      {activeTab === 'interactions' && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-card p-6 rounded-2xl border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Possible Group Interaction Events</h3>
                <p className="text-xs text-slate-400">Classified by close proximity + facing orientation + sustained stationary duration</p>
              </div>
              <span className="text-xs text-pink-400 font-semibold bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
                No Audio Required (Visual Geometry Only)
              </span>
            </div>

            <div className="space-y-4">
              {interactions.map(item => (
                <div key={item.id} className="glass-card-hover p-5 rounded-2xl border border-slate-700/60 space-y-3">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">{item.id}</span>
                        <span className="text-xs bg-navy-900 text-sky-400 px-2.5 py-0.5 rounded border border-navy-700 font-mono">
                          {item.camera}
                        </span>
                        <span className="text-xs text-slate-300">{item.zone}</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Observed orientation: <span className="text-slate-200">{item.orientation}</span></p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-white font-mono">{item.duration}</span>
                      <p className="text-[10px] text-slate-500 font-mono">Confidence: {item.confidence}%</p>
                    </div>
                  </div>

                  <div className="p-3 bg-navy-950/70 rounded-xl border border-navy-800 text-xs text-slate-300 space-y-1">
                    <p className="text-[11px] text-slate-500">Individuals in Proximity:</p>
                    <p className="font-mono text-slate-200">{item.participants.join(' · ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: EMPLOYEE 360° ACTIVITY TIMELINE */}
      {activeTab === 'employee' && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-card p-6 rounded-2xl border border-slate-700/60 space-y-5">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-xl font-bold text-sky-400">
                  RR
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{EMPLOYEE_ACTIVITY_360.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{EMPLOYEE_ACTIVITY_360.employeeId} · {EMPLOYEE_ACTIVITY_360.department} · {EMPLOYEE_ACTIVITY_360.designation}</p>
                  <p className="text-xs text-sky-400 mt-0.5">{EMPLOYEE_ACTIVITY_360.shift}</p>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400">
                <p>Assigned Operational Area:</p>
                <p className="text-emerald-400 font-medium">{EMPLOYEE_ACTIVITY_360.assignedWorkZones.join(' · ')}</p>
              </div>
            </div>

            {/* Observed State Summary Pods */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
              <div className="p-2.5 bg-navy-950/80 rounded-xl border border-navy-800">
                <span className="text-[10px] text-slate-500 block">Work Zone</span>
                <span className="text-emerald-400 font-bold text-sm">{EMPLOYEE_ACTIVITY_360.summary.activeWorkZone}</span>
              </div>
              <div className="p-2.5 bg-navy-950/80 rounded-xl border border-navy-800">
                <span className="text-[10px] text-slate-500 block">Walking</span>
                <span className="text-sky-400 font-bold text-sm">{EMPLOYEE_ACTIVITY_360.summary.walkingMovement}</span>
              </div>
              <div className="p-2.5 bg-navy-950/80 rounded-xl border border-navy-800">
                <span className="text-[10px] text-slate-500 block">Sitting</span>
                <span className="text-indigo-400 font-bold text-sm">{EMPLOYEE_ACTIVITY_360.summary.sittingPosture}</span>
              </div>
              <div className="p-2.5 bg-navy-950/80 rounded-xl border border-navy-800">
                <span className="text-[10px] text-slate-500 block">Break Zone</span>
                <span className="text-purple-400 font-bold text-sm">{EMPLOYEE_ACTIVITY_360.summary.breakZone}</span>
              </div>
              <div className="p-2.5 bg-navy-950/80 rounded-xl border border-navy-800">
                <span className="text-[10px] text-slate-500 block">Stationary</span>
                <span className="text-amber-400 font-bold text-sm">{EMPLOYEE_ACTIVITY_360.summary.stationaryObserved}</span>
              </div>
              <div className="p-2.5 bg-navy-950/80 rounded-xl border border-navy-800">
                <span className="text-[10px] text-slate-500 block">Interaction</span>
                <span className="text-pink-400 font-bold text-sm">{EMPLOYEE_ACTIVITY_360.summary.possibleInteraction}</span>
              </div>
              <div className="p-2.5 bg-navy-950/80 rounded-xl border border-navy-800">
                <span className="text-[10px] text-slate-500 block">Occluded</span>
                <span className="text-slate-400 font-bold text-sm">{EMPLOYEE_ACTIVITY_360.summary.occludedUnknown}</span>
              </div>
            </div>

            {/* Chronological Timeline */}
            <div className="space-y-2 pt-3 border-t border-navy-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Chronological Vision Event Sequence</h4>

              <div className="space-y-2 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-navy-800">
                {EMPLOYEE_ACTIVITY_360.timeline.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-xs relative pl-2">
                    <span className="font-mono text-slate-400 w-12 font-bold">{item.time}</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-sky-400 border-2 border-navy-950 z-10" />
                    <div className="p-2.5 rounded-xl bg-navy-900/80 border border-navy-700/60 flex-1 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white">{item.zone}</span>
                        <p className="text-[11px] text-slate-400">{item.detail}</p>
                      </div>
                      <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                        {item.event}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SHIFT ACTIVITY PATTERNS */}
      {activeTab === 'shifts' && (
        <div className="space-y-5 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SHIFT_ACTIVITY_STATS.map(s => (
              <div
                key={s.code}
                onClick={() => setSelectedShift(s.code)}
                className={`glass-card-hover p-5 rounded-2xl border cursor-pointer transition-all ${
                  selectedShift === s.code ? 'border-sky-500 ring-1 ring-sky-500/50 bg-navy-850' : 'border-slate-700/60'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono font-bold text-sky-400">{s.code}</span>
                  <span className="text-xs font-bold text-emerald-400">{s.activeRate} Active</span>
                </div>
                <h4 className="text-base font-bold text-white">{s.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">{s.time}</p>

                <div className="mt-4 pt-3 border-t border-navy-800 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Present:</span>
                    <span className="font-bold text-white">{s.present} / {s.scheduled}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Work Zone:</span>
                    <span className="font-bold text-emerald-400">{s.activeOperational}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Stationary:</span>
                    <span className="font-bold text-amber-400">{s.stationary}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: ROLE ACTIVITY POLICIES */}
      {activeTab === 'policies' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in">
          {ROLE_ACTIVITY_POLICIES.map(pol => (
            <div key={pol.role} className="glass-card-hover p-6 rounded-2xl border border-slate-700/60 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{pol.role}</h3>
                <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/25">
                  Policy Configured
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-navy-950/80 rounded-xl border border-navy-800">
                  <span className="text-slate-400 text-[11px] block">Authorized Work Zones:</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{pol.workZones.join(' · ')}</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 bg-navy-950/80 rounded-xl border border-navy-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Idle Threshold</span>
                    <span className="text-amber-400 font-bold text-sm font-mono">&gt;{pol.maxIdleMinutes}m</span>
                  </div>
                  <div className="p-2.5 bg-navy-950/80 rounded-xl border border-navy-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Max Sitting</span>
                    <span className="text-indigo-400 font-bold text-sm font-mono">&gt;{pol.maxSittingDurationMinutes}m</span>
                  </div>
                  <div className="p-2.5 bg-navy-950/80 rounded-xl border border-navy-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Group Threshold</span>
                    <span className="text-pink-400 font-bold text-sm font-mono">&gt;{pol.maxGroupInteractionMinutes}m</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 pt-1">
                  Standing Rule: <span className="text-sky-300">{pol.standingPolicy}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUPERVISOR EXCEPTION REVIEW MODAL (Frosted Glass) */}
      {reviewModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-lg w-full p-6 border border-slate-700/80 rounded-2xl space-y-4 bg-navy-900/90 shadow-2xl relative">
            <button
              onClick={() => setReviewModalEvent(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-navy-800 hover:bg-navy-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Review Inactivity Exception</h2>
                <p className="text-xs text-slate-400">{reviewModalEvent.id} · {reviewModalEvent.name || reviewModalEvent.camera}</p>
              </div>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 space-y-1">
                <p className="text-slate-400">Observed Condition: <span className="text-white font-semibold">{reviewModalEvent.observedState || reviewModalEvent.duration}</span></p>
                <p className="text-slate-400">Location: <span className="text-sky-300 font-semibold">{reviewModalEvent.zone}</span></p>
              </div>

              <div>
                <label className="text-slate-400 block mb-1.5 font-medium">Select Operational Justification</label>
                <select
                  value={reviewReason}
                  onChange={e => setReviewReason(e.target.value)}
                  className="input-field w-full text-xs"
                >
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
                <label className="text-slate-400 block mb-1.5 font-medium">Supervisor Audit Note</label>
                <textarea
                  rows="3"
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  placeholder="Enter confirmation details or staff discussion record..."
                  className="input-field w-full text-xs"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalEvent(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Confirm & Resolve Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
