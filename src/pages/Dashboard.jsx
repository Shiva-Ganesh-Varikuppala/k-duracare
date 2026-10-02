import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import {
  Users, UserCheck, Calendar, AlertTriangle, Video,
  Sparkles, Send, Bot, ChevronRight, Activity, Clock,
  ArrowUpRight, ArrowRight,
} from 'lucide-react';
import { todayStats, departmentCoverage } from '../data/employees';
import { cameraAlerts, cameras } from '../data/cameras';
import { leaveRequests } from '../data/leaves';
import { askAI, getStaffingInsights } from '../services/aiService';

// Specialized role-specific dashboards
import EmployeeSelfServiceDashboard from '../components/dashboards/EmployeeSelfServiceDashboard';
import DoctorDashboard from '../components/dashboards/DoctorDashboard';
import NurseDashboard from '../components/dashboards/NurseDashboard';
import {
  OpdStaffDashboard, LabStaffDashboard, OtStaffDashboard,
  PhysioStaffDashboard, ReceptionDashboard,
} from '../components/dashboards/ClinicalAlliedDashboards';
import {
  HousekeepingSupervisorDashboard, DhobiDashboard,
  SecuritySupervisorDashboard, SecurityGuardDashboard,
  AttendanceOfficerDashboard, PayrollOfficerDashboard,
  ManagementDashboard, HodDashboard,
} from '../components/dashboards/OperationsSupportDashboards';

const attendanceTrend = [
  { day: 'Mon', present: 271, absent: 18 },
  { day: 'Tue', present: 280, absent: 12 },
  { day: 'Wed', present: 275, absent: 15 },
  { day: 'Thu', present: 283, absent: 10 },
  { day: 'Fri', present: 278, absent: 14 },
  { day: 'Sat', present: 256, absent: 12 },
  { day: 'Today', present: 278, absent: 12 },
];

/* ─── Minimal chart tooltip ─── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <p className="mb-1 text-[11px] font-medium text-gray-400">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs font-semibold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

/* ─── Compact stat row item ─── */
function Stat({ label, value, note, accent }) {
  return (
    <div className="flex flex-col gap-1 py-5 px-6 border-r border-gray-100 dark:border-gray-800 last:border-r-0">
      <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{label}</span>
      <span className={`text-2xl font-semibold tracking-tight ${accent || 'text-gray-900 dark:text-white'}`}>
        {value}
      </span>
      {note && <span className="text-[11px] text-gray-400 dark:text-gray-500">{note}</span>}
    </div>
  );
}

/* ─── AI Chat Panel ─── */
function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello — I'm **K-DuraCare AI**. Ask me about staffing, attendance, leave, payroll, or camera alerts." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const historyRef = useRef([]);

  const QUICK = ["Today's staffing status?", 'Departments under-staffed?', 'Pending leave requests?', 'Camera alert summary'];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    const q = text || input;
    if (!q.trim() || loading) return;
    setInput('');
    setMessages(p => [...p, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const reply = await askAI(q, historyRef.current);
      historyRef.current = [...historyRef.current, { role: 'user', content: q }, { role: 'model', content: reply }];
      setMessages(p => [...p, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: 'Unable to reach AI service. Please try again.' }]);
    }
    setLoading(false);
  };

  const render = (content) =>
    content.split('\n').map((line, i) => (
      <span key={i} className="block" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
    ));

  return (
    <div className="flex flex-col h-full min-h-[380px]">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-gray-800 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
          <Bot className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-white">K-DuraCare AI</p>
          <p className="text-[11px] text-gray-400">Gemini · Hospital Workforce Grounded</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
            }`}>
              {render(msg.content)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-1.5 items-center px-3.5 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
            {[0, 200, 400].map(d => (
              <span key={d} className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length < 3 && (
        <div className="mt-3 flex flex-wrap gap-1.5 pt-3 border-t border-gray-100 dark:border-gray-800">
          {QUICK.map(q => (
            <button key={q} onClick={() => send(q)}
              className="rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1 text-[11px] text-gray-600 dark:text-gray-300 hover:border-brand-300 dark:hover:border-brand-600 transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <input
          type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask anything about hospital operations..."
          disabled={loading}
          className="flex-1 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 text-xs text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-400 focus:outline-none transition-colors"
        />
        <button onClick={() => send()} disabled={loading || !input.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40 transition-colors">
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════ */
export default function Dashboard() {
  const { user, hasPermission, ROLES } = useAuth();
  const navigate = useNavigate();

  // Role-based routing
  if (user?.role === ROLES.DOCTOR || user?.role === 'Doctor / Consultant' || user?.role === 'Doctor') return <DoctorDashboard />;
  if (user?.role === ROLES.NURSE || user?.role === 'Nurse') return <NurseDashboard isIcu={false} />;
  if (user?.role === ROLES.ICU_STAFF) return <NurseDashboard isIcu={true} />;
  if (user?.role === ROLES.OPD_STAFF) return <OpdStaffDashboard />;
  if (user?.role === ROLES.LAB_STAFF) return <LabStaffDashboard />;
  if (user?.role === ROLES.OT_STAFF) return <OtStaffDashboard />;
  if (user?.role === ROLES.PHYSIO_STAFF) return <PhysioStaffDashboard />;
  if (user?.role === ROLES.RECEPTIONIST) return <ReceptionDashboard />;
  if (user?.role === ROLES.HOUSEKEEPING_SUPERVISOR) return <HousekeepingSupervisorDashboard />;
  if (user?.role === ROLES.DHOBI) return <DhobiDashboard />;
  if (user?.role === ROLES.SECURITY_SUPERVISOR || user?.role === 'Security Operator') return <SecuritySupervisorDashboard />;
  if (user?.role === ROLES.SECURITY_GUARD) return <SecurityGuardDashboard />;
  if (user?.role === ROLES.ATTENDANCE_OFFICER) return <AttendanceOfficerDashboard />;
  if (user?.role === ROLES.PAYROLL_OFFICER) return <PayrollOfficerDashboard />;
  if (user?.role === ROLES.MANAGEMENT) return <ManagementDashboard />;
  if (user?.role === ROLES.HOD) return <HodDashboard />;
  if (user?.role === ROLES.AAYAH) return <EmployeeSelfServiceDashboard customTitle="Aayah Ward Assistance Portal" assignedArea="Ward B Inpatient" tasksList={[{ name: 'Linen change & bed-making in Ward B', done: true }, { name: 'Bedside assistance for Patient 1024', done: true }, { name: 'Pantry meal tray delivery', done: false }]} />;
  if (user?.role === ROLES.SWEEPER) return <EmployeeSelfServiceDashboard customTitle="Floor Sanitation & Corridor Portal" assignedArea="Corridor A & Ward B" tasksList={[{ name: 'Corridor A floor scrubbing', done: true }, { name: 'Ward B wet mop & sanitizer refill', done: true }, { name: 'Emergency entry dry mop', done: false }]} />;
  if (user?.role === ROLES.SCAVENGER) return <EmployeeSelfServiceDashboard customTitle="Biomedical Waste Disposal Portal" assignedArea="Waste Storage Yard" tasksList={[{ name: 'Yellow biohazard bag collection from OT', done: true }, { name: 'Red plastic sharps bin audit', done: true }, { name: 'Puncture-proof needle burner check', done: false }]} />;
  if (user?.role === ROLES.EMPLOYEE || user?.role === 'Staff Employee') return <EmployeeSelfServiceDashboard />;

  // ── Super Admin / HR / Management view ──
  const criticalAlerts = cameraAlerts.filter(a => a.status !== 'Resolved');
  const pendingLeave   = leaveRequests.filter(l => l.status === 'Pending');
  const staffingIssues = getStaffingInsights(departmentCoverage).filter(i => i.severity !== 'Info');

  const todayActivities = [
    { time: '07:02', event: 'Shift A check-in sweep completed', cam: 'BIOMETRIC', severity: 'info' },
    { time: '09:12', event: 'OPD high footfall detected by AI', cam: 'CAM-OPD-01', severity: 'medium' },
    { time: '10:05', event: 'Possible unauthorized zone entry', cam: 'CAM-ICU-03', severity: 'high' },
    { time: '10:42', event: 'Fall event detected — paramedic alerted', cam: 'CAM-ICU-03', severity: 'critical' },
    { time: '11:30', event: 'Camera offline — OT Entrance', cam: 'CAM-OT-01', severity: 'high' },
    { time: '13:22', event: 'Restricted zone proximity alert', cam: 'CAM-ICU-01', severity: 'high' },
  ];

  const severityDot = { critical: 'bg-red-500', high: 'bg-orange-400', medium: 'bg-amber-400', info: 'bg-gray-300 dark:bg-gray-600' };

  return (
    <div className="space-y-6 pb-10">

      {/* ── Page heading ── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            {user?.name?.split(' ')[0] || 'Administrator'}
          </h1>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Here's what's happening at Kanakadurga Nursing Home today.
          </p>
        </div>
        {criticalAlerts.length > 0 && (
          <button
            onClick={() => navigate('/monitor/alerts')}
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/15 transition-colors"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {criticalAlerts.length} active alerts
          </button>
        )}
      </div>

      {/* ── Key Metrics — single row, minimal ── */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 dark:divide-gray-800">
          <Stat
            label="Total Staff"
            value={todayStats.total}
            note="Enrolled across all departments"
          />
          <Stat
            label="Present Today"
            value={todayStats.present}
            note={`${Math.round((todayStats.present / todayStats.total) * 100)}% of workforce`}
            accent="text-brand-600 dark:text-brand-400"
          />
          <Stat
            label="On Leave"
            value={todayStats.onLeave}
            note={`${pendingLeave.length} pending approval`}
          />
          <Stat
            label="Open Alerts"
            value={criticalAlerts.length}
            note="Requires attention"
            accent={criticalAlerts.length > 0 ? 'text-red-600 dark:text-red-400' : undefined}
          />
        </div>
      </div>

      {/* ── Secondary quick numbers ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Absent / Unplanned',  value: todayStats.absent },
          { label: 'Weekly Off',          value: todayStats.weeklyOff },
          { label: 'On External Duty',    value: todayStats.onDuty },
          { label: 'Cameras Online',      value: `${cameras.filter(c => c.status === 'Online').length}/${cameras.length}` },
        ].map(item => (
          <div key={item.label} className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] px-4 py-3.5 flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
            <span className="text-sm font-semibold text-gray-800 dark:text-white">{item.value}</span>
          </div>
        ))}
      </div>

      {/* ── Attendance chart + Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Attendance this week</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Daily present vs absent headcount</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#167568]" />
                <span className="text-[11px] text-gray-500 dark:text-gray-400">Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="text-[11px] text-gray-500 dark:text-gray-400">Absent</span>
              </div>
              <button onClick={() => navigate('/attendance')} className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                View full report <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#167568" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#167568" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gAbsent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#98a2b3" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="#98a2b3" fontSize={11} axisLine={false} tickLine={false} domain={[220, 300]} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="present" name="Present" stroke="#167568" strokeWidth={2} fill="url(#gPresent)" />
                <Area type="monotone" dataKey="absent" name="Absent" stroke="#ef4444" strokeWidth={1.5} fill="url(#gAbsent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active alerts */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Active alerts</h2>
            <span className="rounded-full bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-2 py-0.5 text-[11px] font-medium text-red-600 dark:text-red-400">
              {criticalAlerts.length} open
            </span>
          </div>
          <div className="flex-1 space-y-2">
            {criticalAlerts.slice(0, 5).map(alert => (
              <div key={alert.id} className="flex items-start gap-3 py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <div className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                  alert.severity === 'Critical' ? 'bg-red-500' :
                  alert.severity === 'High' ? 'bg-orange-400' : 'bg-amber-400'
                }`} />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-200 leading-snug">{alert.type}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 font-mono">{alert.cameraId} · {alert.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/monitor/alerts')} className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1 text-xs text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
            View all incidents <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── Department coverage + Activity log ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Dept coverage */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Department staffing</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Coverage vs required headcount</p>
            </div>
            <button onClick={() => navigate('/departments')} className="text-xs text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex items-center gap-1">
              All departments <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-4">
            {departmentCoverage.slice(0, 8).map(d => (
              <div key={d.dept} className="flex items-center gap-3">
                <span className="w-28 text-xs text-gray-500 dark:text-gray-400 truncate flex-shrink-0">{d.dept}</span>
                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      d.coverage >= 90 ? 'bg-brand-500' :
                      d.coverage >= 75 ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${d.coverage}%` }}
                  />
                </div>
                <span className={`text-xs font-medium w-10 text-right tabular-nums ${
                  d.coverage >= 90 ? 'text-brand-600 dark:text-brand-400' :
                  d.coverage >= 75 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                }`}>{d.coverage}%</span>
              </div>
            ))}
          </div>
          {staffingIssues.length > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
              {staffingIssues.slice(0, 2).map((issue, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[11px] text-amber-700 dark:text-amber-400 leading-snug">{issue.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's telemetry */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Operational feed</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Real-time check-ins and vision events</p>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
            </span>
          </div>
          <div className="space-y-3">
            {todayActivities.map((ev, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="font-mono text-[11px] text-gray-400 w-11 flex-shrink-0 pt-0.5">{ev.time}</span>
                <div className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${severityDot[ev.severity]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 dark:text-gray-200 leading-snug">{ev.event}</p>
                  <p className="text-[11px] font-mono text-gray-400 mt-0.5">{ev.cam}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/activity')} className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1 text-xs text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors w-full">
            Open full activity workspace <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ── AI Assistant (full width, less imposing) ── */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6">
        <AIChat />
      </div>

    </div>
  );
}
