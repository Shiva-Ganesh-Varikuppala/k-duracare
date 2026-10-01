import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import {
  Users, UserCheck, Calendar, AlertTriangle, TrendingUp, Video, Wifi,
  Sparkles, Send, Bot, ChevronRight, Activity, Clock, Building2,
  Heart, Stethoscope, Shield, ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react';
import { todayStats, departmentCoverage, employees } from '../data/employees';
import { cameraAlerts, cameras } from '../data/cameras';
import { leaveRequests } from '../data/leaves';
import { askAI, getStaffingInsights } from '../services/aiService';
import EmployeeSelfServiceDashboard from '../components/dashboards/EmployeeSelfServiceDashboard';
import DoctorDashboard from '../components/dashboards/DoctorDashboard';
import NurseDashboard from '../components/dashboards/NurseDashboard';
import {
  OpdStaffDashboard, LabStaffDashboard, OtStaffDashboard,
  PhysioStaffDashboard, ReceptionDashboard
} from '../components/dashboards/ClinicalAlliedDashboards';
import {
  HousekeepingSupervisorDashboard, DhobiDashboard,
  SecuritySupervisorDashboard, SecurityGuardDashboard,
  AttendanceOfficerDashboard, PayrollOfficerDashboard,
  ManagementDashboard, HodDashboard
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

const deptData = [
  { name: 'ICU', value: 96, color: '#0EA5E9' },
  { name: 'OPD', value: 88, color: '#6366F1' },
  { name: 'OT', value: 92, color: '#8B5CF6' },
  { name: 'Lab', value: 85, color: '#06B6D4' },
  { name: 'Ward', value: 79, color: '#10B981' },
];

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="flex items-center gap-3">
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 22, fontWeight: 700,
        color: '#fff', letterSpacing: '-0.02em',
      }}>
        {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
      </div>
      <div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.2 }}>
          {days[now.getDay()]}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.2 }}>
          {now.getDate()} {months[now.getMonth()]} {now.getFullYear()}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, trend, trendUp, accent }) {
  return (
    <div className="stat-glass" style={{ padding: 20 }}>
      {/* Accent gradient top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${accent || '#0EA5E9'}, transparent)`,
        borderRadius: '20px 20px 0 0',
      }} />

      <div className="flex items-start justify-between mb-4">
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon style={{ width: 20, height: 20, color }} />
        </div>
        {trend && (
          <div className="flex items-center gap-1" style={{
            background: trendUp ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1px solid ${trendUp ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
            borderRadius: 100, padding: '3px 10px',
          }}>
            {trendUp
              ? <ArrowUpRight style={{ width: 11, height: 11, color: '#34D399' }} />
              : <ArrowDownRight style={{ width: 11, height: 11, color: '#F87171' }} />
            }
            <span style={{ fontSize: 11, fontWeight: 600, color: trendUp ? '#34D399' : '#F87171' }}>{trend}</span>
          </div>
        )}
      </div>

      <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function CameraCard({ camera }) {
  const isOnline = camera.status === 'Online';
  const isDegraded = camera.status === 'Degraded';

  return (
    <div className="glass-card" style={{ overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(14,165,233,0.3)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {/* Video feed simulation */}
      <div style={{
        aspectRatio: '16/9',
        background: isOnline
          ? 'linear-gradient(135deg, #050812 0%, #0a1628 50%, #050a1a 100%)'
          : 'rgba(0,0,0,0.5)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Scan lines */}
        {isOnline && (
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.08,
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 4px)',
          }} />
        )}
        {/* Grid */}
        {isOnline && (
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.06,
            backgroundImage: 'linear-gradient(rgba(14,165,233,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.3) 1px, transparent 1px)',
            backgroundSize: '20% 20%',
          }} />
        )}
        {/* Corner brackets */}
        {isOnline && ['topleft', 'topright', 'bottomleft', 'bottomright'].map(corner => (
          <div key={corner} style={{
            position: 'absolute',
            width: 16, height: 16,
            top: corner.startsWith('top') ? 8 : 'auto',
            bottom: corner.startsWith('bottom') ? 8 : 'auto',
            left: corner.endsWith('left') ? 8 : 'auto',
            right: corner.endsWith('right') ? 8 : 'auto',
            borderTop: corner.startsWith('top') ? '2px solid rgba(14,165,233,0.6)' : 'none',
            borderBottom: corner.startsWith('bottom') ? '2px solid rgba(14,165,233,0.6)' : 'none',
            borderLeft: corner.endsWith('left') ? '2px solid rgba(14,165,233,0.6)' : 'none',
            borderRight: corner.endsWith('right') ? '2px solid rgba(14,165,233,0.6)' : 'none',
          }} />
        ))}

        {/* Camera ID watermark */}
        <div style={{
          position: 'absolute', bottom: 8, left: 10,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9, color: 'rgba(14,165,233,0.5)', letterSpacing: '0.05em',
        }}>
          {camera.id}
        </div>

        {/* Status badge */}
        <div style={{
          position: 'absolute', top: 8, left: 8,
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(0,0,0,0.6)', borderRadius: 100,
          padding: '3px 10px', backdropFilter: 'blur(8px)',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: isOnline ? '#34D399' : isDegraded ? '#FBBF24' : '#F87171',
            boxShadow: isOnline ? '0 0 8px #34D399' : 'none',
            animation: isOnline ? 'pulse 2s ease-in-out infinite' : 'none',
          }} />
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
            color: isOnline ? '#34D399' : isDegraded ? '#FBBF24' : '#F87171',
          }}>{camera.status.toUpperCase()}</span>
        </div>

        {/* AI badge */}
        {camera.aiActive && isOnline && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(99,102,241,0.7)', borderRadius: 100,
            padding: '3px 8px', backdropFilter: 'blur(8px)',
          }}>
            <Sparkles style={{ width: 9, height: 9, color: '#fff' }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>AI</span>
          </div>
        )}

        {/* Persons count */}
        {isOnline && camera.persons > 0 && (
          <div style={{
            position: 'absolute', bottom: 8, right: 8,
            background: 'rgba(0,0,0,0.6)', borderRadius: 100,
            padding: '2px 8px', backdropFilter: 'blur(8px)',
            fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: 600,
          }}>
            {camera.persons} detected
          </div>
        )}
      </div>

      <div style={{ padding: '10px 12px' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{camera.name}</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{camera.location}</p>
      </div>
    </div>
  );
}

function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm **K-DuraCare AI**. I can help you with staffing, attendance, leave, payroll, and camera insights. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const historyRef = useRef([]);

  const QUICK = [
    "Today's staffing status?",
    "Any departments under-staffed?",
    "Pending leave requests?",
    "Camera alert summary",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const q = text || input;
    if (!q.trim() || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: q };
    setMessages(p => [...p, userMsg]);
    setLoading(true);
    const history = historyRef.current.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', content: m.content }));
    const reply = await askAI(q, history, user);
    const assistantMsg = { role: 'assistant', content: reply };
    setMessages(p => [...p, assistantMsg]);
    historyRef.current = [...historyRef.current, userMsg, assistantMsg];
    setLoading(false);
  };

  const renderContent = (content) =>
    content.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 2 }}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={j} style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>{part.replace(/\*\*/g, '')}</strong>
              : part
          )}
        </p>
      );
    });

  return (
    <div className="ai-card" style={{ display: 'flex', flexDirection: 'column', height: 380 }}>
      {/* Header */}
      <div className="flex items-center gap-3" style={{ padding: '14px 16px', borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
        }}>
          <Sparkles style={{ width: 15, height: 15, color: '#fff' }} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>K-DuraCare AI</p>
          <p style={{ fontSize: 10, color: '#818CF8' }}>Powered by Gemini · Hospital Intelligence</p>
        </div>
        <div className="ai-dot" style={{ marginLeft: 'auto' }} />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }} className="glass-scroll">
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className="flex gap-2" style={{ flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Bot style={{ width: 12, height: 12, color: '#fff' }} />
                </div>
              )}
              <div style={{
                maxWidth: '82%',
                background: msg.role === 'user'
                  ? 'rgba(14,165,233,0.15)'
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(14,165,233,0.25)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                padding: '10px 12px',
              }}>
                {renderContent(msg.content)}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Bot style={{ width: 12, height: 12, color: '#fff' }} />
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '4px 16px 16px 16px', padding: '12px 14px',
                display: 'flex', gap: 5, alignItems: 'center',
              }}>
                {[0, 150, 300].map(d => (
                  <div key={d} className="animate-bounce" style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#818CF8', animationDelay: `${d}ms`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick questions */}
      {messages.length < 2 && (
        <div style={{ padding: '0 16px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {QUICK.map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              style={{
                fontSize: 11, color: 'rgba(255,255,255,0.55)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 100, padding: '4px 12px', cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(99,102,241,0.12)', display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask K-DuraCare AI anything..."
          disabled={loading}
          className="input-field"
          style={{ fontSize: 12, padding: '8px 12px', flex: 1 }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="btn-primary"
          style={{ padding: '8px 14px', flexShrink: 0, opacity: (loading || !input.trim()) ? 0.4 : 1 }}
        >
          <Send style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
}

// Custom Tooltip for recharts
const GlassTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 12, padding: '10px 14px', backdropFilter: 'blur(16px)',
    }}>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 13, fontWeight: 600, color: p.color }}>
          {p.name}: <span style={{ color: '#fff' }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user, hasPermission, ROLES } = useAuth();
  const navigate = useNavigate();

  // Role-Specific Purpose-Built Dashboards
  if (user?.role === ROLES.DOCTOR || user?.role === 'Doctor / Consultant' || user?.role === 'Doctor') {
    return <DoctorDashboard />;
  }
  if (user?.role === ROLES.NURSE || user?.role === 'Nurse') {
    return <NurseDashboard isIcu={false} />;
  }
  if (user?.role === ROLES.ICU_STAFF) {
    return <NurseDashboard isIcu={true} />;
  }
  if (user?.role === ROLES.OPD_STAFF) {
    return <OpdStaffDashboard />;
  }
  if (user?.role === ROLES.LAB_STAFF) {
    return <LabStaffDashboard />;
  }
  if (user?.role === ROLES.OT_STAFF) {
    return <OtStaffDashboard />;
  }
  if (user?.role === ROLES.PHYSIO_STAFF) {
    return <PhysioStaffDashboard />;
  }
  if (user?.role === ROLES.RECEPTIONIST) {
    return <ReceptionDashboard />;
  }
  if (user?.role === ROLES.HOUSEKEEPING_SUPERVISOR) {
    return <HousekeepingSupervisorDashboard />;
  }
  if (user?.role === ROLES.DHOBI) {
    return <DhobiDashboard />;
  }
  if (user?.role === ROLES.SECURITY_SUPERVISOR || user?.role === 'Security Operator') {
    return <SecuritySupervisorDashboard />;
  }
  if (user?.role === ROLES.SECURITY_GUARD) {
    return <SecurityGuardDashboard />;
  }
  if (user?.role === ROLES.ATTENDANCE_OFFICER) {
    return <AttendanceOfficerDashboard />;
  }
  if (user?.role === ROLES.PAYROLL_OFFICER) {
    return <PayrollOfficerDashboard />;
  }
  if (user?.role === ROLES.MANAGEMENT) {
    return <ManagementDashboard />;
  }
  if (user?.role === ROLES.HOD) {
    return <HodDashboard />;
  }
  if (user?.role === ROLES.AAYAH) {
    return (
      <EmployeeSelfServiceDashboard
        customTitle="Aayah Ward Assistance Portal"
        assignedArea="Ward B Inpatient"
        tasksList={[
          { name: "Linen change & bed-making in Ward B", done: true },
          { name: "Bedside assistance for Patient 1024", done: true },
          { name: "Pantry meal tray delivery", done: false }
        ]}
      />
    );
  }
  if (user?.role === ROLES.SWEEPER) {
    return (
      <EmployeeSelfServiceDashboard
        customTitle="Floor Sanitation & Corridor Portal"
        assignedArea="Corridor A & Ward B"
        tasksList={[
          { name: "Corridor A floor scrubbing", done: true },
          { name: "Ward B wet mop & sanitizer refill", done: true },
          { name: "Emergency entry dry mop", done: false }
        ]}
      />
    );
  }
  if (user?.role === ROLES.SCAVENGER) {
    return (
      <EmployeeSelfServiceDashboard
        customTitle="Biomedical Waste Disposal Portal"
        assignedArea="Waste Storage Yard"
        tasksList={[
          { name: "Yellow biohazard bag collection from OT", done: true },
          { name: "Red plastic sharps bin audit", done: true },
          { name: "Puncture-proof needle burner check", done: false }
        ]}
      />
    );
  }
  if (user?.role === ROLES.EMPLOYEE || user?.role === 'Staff Employee') {
    return <EmployeeSelfServiceDashboard />;
  }
  const staffingInsights = getStaffingInsights(departmentCoverage);
  const criticalAlerts = cameraAlerts.filter(a => a.status !== 'Resolved');
  const pendingLeave = leaveRequests.filter(l => l.status === 'Pending');
  const liveCameras = cameras.slice(0, 4);

  const todayActivities = [
    { time: '07:02', event: 'Shift A check-in sweep completed', cam: 'BIOMETRIC', severity: 'info' },
    { time: '09:12', event: 'OPD high footfall detected by AI', cam: 'CAM-OPD-01', severity: 'medium' },
    { time: '10:05', event: 'Possible unauthorized zone entry — review', cam: 'CAM-ICU-03', severity: 'high' },
    { time: '10:42', event: 'Fall event detected — paramedic alerted', cam: 'CAM-ICU-03', severity: 'critical' },
    { time: '11:30', event: 'Camera offline — OT Entrance', cam: 'CAM-OT-01', severity: 'high' },
    { time: '13:22', event: 'Restricted zone proximity alert', cam: 'CAM-ICU-01', severity: 'high' },
  ];

  const severityColor = { critical: '#F87171', high: '#FB923C', medium: '#FBBF24', info: '#38BDF8' };

  return (
    <div className="space-y-6">
      {/* Role Clearance & Fragmentation Banner */}
      <div className="glass-card p-4 border border-sky-500/20 bg-slate-900/60 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white">Active Profile: {user?.name}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                {user?.role}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {user?.empId} · {user?.dept || 'General'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Role-fragmented workspace · Only authorized modules and clinical feeds are displayed.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-400">Clearance Access:</span>
          {['workforce', 'attendance', 'shifts', 'leave', 'payroll', 'monitor', 'analytics', 'audit'].filter(m => hasPermission(m)).slice(0, 5).map(m => (
            <span key={m} className="text-[10px] font-semibold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20 uppercase font-mono">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            {user?.role === 'Doctor / Consultant' ? "Physician's Clinical Dashboard" :
             user?.role === 'Security Operator' ? "Security Operations Command" :
             user?.role === 'HR Administrator' ? "Hospital Workforce & HR Center" :
             user?.role === 'Nursing Head' ? "Nursing Operations & Ward Roster" :
             user?.role === 'Staff Employee' ? "Hospital Staff Self-Service Portal" :
             "Hospital Executive Dashboard"}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 5 }}>
            Kanakadurga Nursing Home · 120 Beds · NABH Accredited
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LiveClock />
          <div style={{
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 12, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div className="live-dot" />
            <span style={{ fontSize: 12, color: '#34D399', fontWeight: 600 }}>Active Clearance</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users} label="Total Staff" value={todayStats.total}
          sub="Across 12 departments" color="#0EA5E9" accent="#0EA5E9"
          trend="+2 this month" trendUp
        />
        <StatCard
          icon={UserCheck} label="Present Today" value={todayStats.present}
          sub={`${Math.round(todayStats.present / todayStats.total * 100)}% coverage`}
          color="#10B981" accent="#10B981"
        />
        <StatCard
          icon={Calendar} label="On Leave" value={todayStats.onLeave}
          sub={`${pendingLeave.length} pending approval`}
          color="#F59E0B" accent="#F59E0B"
        />
        <StatCard
          icon={AlertTriangle} label="Active Alerts" value={criticalAlerts.length}
          sub="AI-prioritized incidents" color="#EF4444" accent="#EF4444"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Absent', value: todayStats.absent, color: '#FB923C' },
          { label: 'Weekly Off', value: todayStats.weeklyOff, color: 'rgba(255,255,255,0.4)' },
          { label: 'On Duty', value: todayStats.onDuty, color: '#38BDF8' },
          { label: 'Cameras Online', value: cameras.filter(c => c.status === 'Online').length, color: '#34D399' },
        ].map(item => (
          <div key={item.label} className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: item.color, letterSpacing: '-0.04em' }}>{item.value}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, fontWeight: 500 }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Attendance Trend */}
        <div className="glass-card lg:col-span-2" style={{ padding: 22 }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="section-title">Attendance Trend</p>
              <p className="section-subtitle">Weekly view — Kanakadurga Nursing Home</p>
            </div>
            <button onClick={() => navigate('/attendance')} className="btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>
              View Details <ChevronRight style={{ width: 13, height: 13 }} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient id="presentGradDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="absentGradDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F87171" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[220, 300]} />
              <Tooltip content={<GlassTooltip />} />
              <Area type="monotone" dataKey="present" stroke="#0EA5E9" strokeWidth={2} fill="url(#presentGradDash)" name="Present" />
              <Area type="monotone" dataKey="absent" stroke="#F87171" strokeWidth={2} fill="url(#absentGradDash)" name="Absent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Alerts */}
        <div className="glass-card" style={{ padding: 22 }}>
          <div className="flex items-center gap-2 mb-4">
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles style={{ width: 13, height: 13, color: '#fff' }} />
            </div>
            <p className="section-title">AI Alerts</p>
            <div style={{
              marginLeft: 'auto', background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.25)', borderRadius: 100,
              padding: '2px 8px', fontSize: 10, fontWeight: 700, color: '#F87171',
            }}>
              {criticalAlerts.length} LIVE
            </div>
          </div>
          <div className="space-y-3">
            {criticalAlerts.slice(0, 4).map(alert => (
              <div key={alert.id} style={{
                padding: '12px 14px', borderRadius: 12,
                background: alert.severity === 'Critical' ? 'rgba(239,68,68,0.07)'
                  : alert.severity === 'High' ? 'rgba(249,115,22,0.07)'
                  : 'rgba(245,158,11,0.07)',
                border: `1px solid ${alert.severity === 'Critical' ? 'rgba(239,68,68,0.2)'
                  : alert.severity === 'High' ? 'rgba(249,115,22,0.2)'
                  : 'rgba(245,158,11,0.2)'}`,
              }}>
                <div className="flex items-center gap-2 mb-1">
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                    background: alert.severity === 'Critical' ? '#F87171'
                      : alert.severity === 'High' ? '#FB923C' : '#FBBF24',
                  }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{alert.type}</span>
                </div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 }}>{alert.message}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{alert.time}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/monitor/alerts')} className="btn-secondary w-full mt-3" style={{ justifyContent: 'center', fontSize: 12 }}>
            View All Alerts
          </button>
        </div>
      </div>

      {/* Department Coverage + Live Cameras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Department Coverage */}
        <div className="glass-card" style={{ padding: 22 }}>
          <div className="flex items-center gap-2 mb-5">
            <Building2 style={{ width: 16, height: 16, color: '#818CF8' }} />
            <p className="section-title">Staffing Coverage</p>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>AI Analysis</span>
          </div>
          <div className="space-y-3">
            {departmentCoverage.slice(0, 8).map(d => (
              <div key={d.dept} className="flex items-center gap-3">
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', width: 110, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {d.dept}
                </p>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 100,
                    width: `${d.coverage}%`,
                    background: d.coverage >= 90
                      ? 'linear-gradient(90deg, #10B981, #34D399)'
                      : d.coverage >= 75
                      ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                      : 'linear-gradient(90deg, #EF4444, #F87171)',
                    transition: 'width 1s ease',
                    boxShadow: d.coverage >= 90 ? '0 0 8px rgba(16,185,129,0.4)' : 'none',
                  }} />
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 700, width: 38, textAlign: 'right', flexShrink: 0,
                  color: d.coverage >= 90 ? '#34D399' : d.coverage >= 75 ? '#FBBF24' : '#F87171',
                }}>
                  {d.coverage}%
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {staffingInsights.filter(i => i.severity !== 'Info').slice(0, 2).map((insight, i) => (
              <div key={i} className="flex items-start gap-2" style={{ marginTop: i > 0 ? 8 : 0 }}>
                <AlertTriangle style={{ width: 12, height: 12, color: '#FBBF24', flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 11, color: '#FBBF24', lineHeight: 1.5 }}>{insight.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Monitor or Role-Tailored Clinical / HR / Staff Schedule */}
        {hasPermission('monitor') ? (
          <div className="glass-card" style={{ padding: 22 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Video style={{ width: 16, height: 16, color: '#38BDF8' }} />
                <p className="section-title">Live Monitor</p>
              </div>
              <button onClick={() => navigate('/monitor')} className="btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }}>
                Full View <ChevronRight style={{ width: 12, height: 12 }} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {liveCameras.map(cam => (
                <CameraCard key={cam.id} camera={cam} />
              ))}
            </div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
              <span>{cameras.filter(c => c.status === 'Online').length} online</span>
              <span>{cameras.filter(c => c.aiActive).length} AI-enabled</span>
              <span>{cameras.filter(c => c.status === 'Offline').length} offline</span>
            </div>
          </div>
        ) : user?.role === 'Doctor / Consultant' ? (
          <div className="glass-card" style={{ padding: 22 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Stethoscope style={{ width: 16, height: 16, color: '#34D399' }} />
                <p className="section-title">Physician's Clinical Schedule</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ICU & OPD Duty
              </span>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white">Morning Rounds — ICU & CCU</span>
                  <span className="text-emerald-400 font-mono text-[11px]">08:30 – 10:30</span>
                </div>
                <p className="text-[11px] text-slate-400">14 Inpatients assigned · Bed 102 critical vitals review completed</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white">OPD Cardiology Consultations</span>
                  <span className="text-sky-400 font-mono text-[11px]">11:00 – 14:00</span>
                </div>
                <p className="text-[11px] text-slate-400">Cabin #04 · 22 Tokens scheduled · Current Token: #08</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white">Emergency On-Call Standby</span>
                  <span className="text-amber-400 font-mono text-[11px]">Night Shift C</span>
                </div>
                <p className="text-[11px] text-slate-400">Paged via Hospital Intercom · Response Time SLA: &lt;10 mins</p>
              </div>
            </div>
            <button onClick={() => navigate('/shifts')} className="btn-secondary w-full mt-3" style={{ justifyContent: 'center', fontSize: 12 }}>
              View My Duty Roster <ChevronRight style={{ width: 13, height: 13 }} />
            </button>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: 22 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock style={{ width: 16, height: 16, color: '#F59E0B' }} />
                <p className="section-title">Department Operations & Approvals</p>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                3 Pending
              </span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Staff Nurse Priya Sharma</p>
                  <p className="text-[11px] text-slate-400">Casual Leave (2 days) · Medical justification</p>
                </div>
                <button onClick={() => navigate('/leave/requests')} className="btn-secondary text-[11px] px-2.5 py-1">Review</button>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Attendance Regularization (KD-EMP-0012)</p>
                  <p className="text-[11px] text-slate-400">Fingerprint biometric sensor miss at OT Entry</p>
                </div>
                <button onClick={() => navigate('/attendance')} className="btn-secondary text-[11px] px-2.5 py-1">Verify</button>
              </div>
            </div>
            <button onClick={() => navigate('/leave/requests')} className="btn-secondary w-full mt-3" style={{ justifyContent: 'center', fontSize: 12 }}>
              Open Action Center <ChevronRight style={{ width: 13, height: 13 }} />
            </button>
          </div>
        )}
      </div>

      {/* AI Assistant + Today's Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles style={{ width: 14, height: 14, color: '#818CF8' }} />
            <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>K-DuraCare AI Assistant</p>
            <span style={{
              fontSize: 10, color: '#818CF8', background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)', borderRadius: 100, padding: '2px 8px', fontWeight: 600,
            }}>Gemini-powered</span>
          </div>
          <AIAssistant />
        </div>

        {/* Today's Activity Feed */}
        <div className="glass-card" style={{ padding: 22 }}>
          <div className="flex items-center gap-2 mb-4">
            <Activity style={{ width: 16, height: 16, color: '#0EA5E9' }} />
            <p className="section-title">Today's Activity</p>
            <div style={{
              marginLeft: 'auto', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)',
              borderRadius: 100, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <div className="live-dot" style={{ width: 5, height: 5 }} />
              <span style={{ fontSize: 10, color: '#38BDF8', fontWeight: 600 }}>LIVE</span>
            </div>
          </div>
          <div className="space-y-4">
            {todayActivities.map((ev, i) => (
              <div key={i} className="flex items-start gap-3" style={{ fontSize: 12 }}>
                <span style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0, width: 40, marginTop: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                  {ev.time}
                </span>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', marginTop: 3, flexShrink: 0,
                  background: severityColor[ev.severity],
                  boxShadow: ev.severity === 'critical' ? `0 0 8px ${severityColor.critical}` : 'none',
                }} />
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>{ev.event}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>
                    {ev.cam}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/monitor/activity')} className="btn-secondary w-full mt-5" style={{ justifyContent: 'center', fontSize: 12 }}>
            View Full Activity Log
          </button>
        </div>
      </div>
    </div>
  );
}

