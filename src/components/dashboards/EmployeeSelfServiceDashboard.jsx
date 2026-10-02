import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, PlusCircle,
  FileText, Check, ChevronRight, X, UserCheck, ShieldAlert, AlertTriangle,
  Sparkles, Coffee, ArrowUpRight, ChevronLeft, MapPin
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EmployeeSelfServiceDashboard({ customTitle, customSubtitle, tasksList, assignedArea }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'calendar' | 'history' | 'leave' | 'shift' | 'hospital_calendar'
  const [selectedDay, setSelectedDay] = useState(null);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);
  const [isPunchedIn, setIsPunchedIn] = useState(true);

  // Correction Form State
  const [correctionType, setCorrectionType] = useState('Missing Punch Out');
  const [correctionDate, setCorrectionDate] = useState('2026-09-24');
  const [correctionTime, setCorrectionTime] = useState('14:07');
  const [correctionReason, setCorrectionReason] = useState('Forgot to punch out due to emergency patient handover');

  // Leave Form State
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [leaveStart, setLeaveStart] = useState('2026-09-28');
  const [leaveEnd, setLeaveEnd] = useState('2026-09-29');
  const [leaveReason, setLeaveReason] = useState('Family medical requirement');

  // September 2026 Attendance Days Mapping
  // Types: 'present' (🟢), 'absent' (🔴), 'leave' (🟡), 'off' (🔵), 'holiday' (🟣), 'future' (⚪)
  const septemberDays = [
    { day: 1, type: 'present', shift: '07:00 AM – 02:00 PM', in: '06:55 AM', out: '02:05 PM', total: '7h 10m' },
    { day: 2, type: 'present', shift: '07:00 AM – 02:00 PM', in: '06:58 AM', out: '02:02 PM', total: '7h 04m' },
    { day: 3, type: 'present', shift: '07:00 AM – 02:00 PM', in: '07:02 AM', out: '02:15 PM', total: '7h 13m' },
    { day: 4, type: 'absent',  shift: '07:00 AM – 02:00 PM', in: '—', out: '—', total: '0h 00m' },
    { day: 5, type: 'present', shift: '07:00 AM – 02:00 PM', in: '06:54 AM', out: '02:00 PM', total: '7h 06m' },
    { day: 6, type: 'off',     shift: 'Weekly Off', in: '—', out: '—', total: '—' },
    { day: 7, type: 'off',     shift: 'Weekly Off', in: '—', out: '—', total: '—' },
    { day: 8, type: 'present', shift: '07:00 AM – 02:00 PM', in: '06:52 AM', out: '02:10 PM', total: '7h 18m' },
    { day: 9, type: 'present', shift: '07:00 AM – 02:00 PM', in: '06:59 AM', out: '02:04 PM', total: '7h 05m' },
    { day: 10, type: 'present', shift: '07:00 AM – 02:00 PM', in: '06:50 AM', out: '02:00 PM', total: '7h 10m' },
    { day: 11, type: 'present', shift: '07:00 AM – 02:00 PM', in: '07:05 AM', out: '02:20 PM', total: '7h 15m' },
    { day: 12, type: 'present', shift: '07:00 AM – 02:00 PM', in: '06:56 AM', out: '02:08 PM', total: '7h 12m' },
    { day: 13, type: 'off',     shift: 'Weekly Off', in: '—', out: '—', total: '—' },
    { day: 14, type: 'off',     shift: 'Weekly Off', in: '—', out: '—', total: '—' },
    { day: 15, type: 'holiday', shift: 'Hospital Holiday (Milad-un-Nabi)', in: '—', out: '—', total: '—' },
    { day: 16, type: 'present', shift: '07:00 AM – 02:00 PM', in: '06:58 AM', out: '02:00 PM', total: '7h 02m' },
    { day: 17, type: 'absent',  shift: '07:00 AM – 02:00 PM', in: '—', out: '—', total: '0h 00m' },
    { day: 18, type: 'present', shift: '07:00 AM – 02:00 PM', in: '06:50 AM', out: '02:12 PM', total: '7h 22m' },
    { day: 19, type: 'present', shift: '07:00 AM – 02:00 PM', in: '06:55 AM', out: '02:01 PM', total: '7h 06m' },
    { day: 20, type: 'off',     shift: 'Weekly Off', in: '—', out: '—', total: '—' },
    { day: 21, type: 'off',     shift: 'Weekly Off', in: '—', out: '—', total: '—' },
    { day: 22, type: 'present', shift: '07:00 AM – 02:00 PM', in: '07:00 AM', out: '02:00 PM', total: '7h 00m' },
    { day: 23, type: 'present', shift: '07:00 AM – 02:00 PM', in: '07:04 AM', out: '02:02 PM', total: '6h 58m' },
    { day: 24, type: 'present', shift: '07:00 AM – 02:00 PM', in: '06:57 AM', out: '02:08 PM', total: '7h 11m', overtime: '8 minutes', isToday: true },
    { day: 25, type: 'leave',   shift: 'Casual Leave (Approved)', in: '—', out: '—', total: '—' },
    { day: 26, type: 'future',  shift: '07:00 AM – 02:00 PM', in: '—', out: '—', total: '—' },
    { day: 27, type: 'off',     shift: 'Weekly Off', in: '—', out: '—', total: '—' },
    { day: 28, type: 'off',     shift: 'Weekly Off', in: '—', out: '—', total: '—' },
    { day: 29, type: 'future',  shift: '07:00 AM – 02:00 PM', in: '—', out: '—', total: '—' },
    { day: 30, type: 'future',  shift: '07:00 AM – 02:00 PM', in: '—', out: '—', total: '—' },
  ];

  const handleTogglePunch = () => {
    setIsPunchedIn(!isPunchedIn);
    if (!isPunchedIn) {
      toast.success('Punched IN at Bio-Terminal 01 (ICU/Ward Gate)');
    } else {
      toast.success('Punched OUT recorded: 02:08 PM. Total shift 7h 11m.');
    }
  };

  const handleCorrectionSubmit = (e) => {
    e.preventDefault();
    setShowCorrectionModal(false);
    toast.success('Correction request submitted! Sent to Supervisor & Attendance Officer for sign-off.');
  };

  const handleApplyLeaveSubmit = (e) => {
    e.preventDefault();
    setShowApplyLeaveModal(false);
    toast.success(`Leave request (${leaveType}) sent for HOD & HR approval!`);
  };

  return (
    <div className="space-y-6">
      {/* Employee Greeting Header */}
      <div className="glass-card" style={{ padding: '24px 28px' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded">
                Self-Service Portal
              </span>
              {assignedArea && (
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {assignedArea}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Good Morning, {user?.name || 'Staff Employee'}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              <span className="font-mono text-sky-300 font-semibold">{user?.empId || 'KD-EMP-1024'}</span>
              <span className="mx-2 text-slate-500">•</span>
              <span>{user?.title || 'Staff Nurse'}</span>
              <span className="mx-2 text-slate-500">•</span>
              <span className="text-slate-400">{user?.dept || 'Nursing'}</span>
            </p>
          </div>

          {/* Biometric Punch Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePunch}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                isPunchedIn
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full animate-ping ${isPunchedIn ? 'bg-rose-400' : 'bg-emerald-400'}`} />
              {isPunchedIn ? 'Punch Out' : 'Punch In (Terminal)'}
            </button>
            <button
              onClick={() => setShowCorrectionModal(true)}
              className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
            >
              Request Correction
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <p className="text-xs text-slate-400">Attendance This Month</p>
            <p className="text-xl font-bold text-sky-400 mt-0.5">24 Days</p>
            <p className="text-[11px] text-emerald-400 mt-0.5">96% On-Duty Rate</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <p className="text-xs text-slate-400">Leave Balance Used</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">5 Used</p>
            <p className="text-[11px] text-slate-400 mt-0.5">29 Days Available</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <p className="text-xs text-slate-400">Pending Requests</p>
            <p className="text-xl font-bold text-indigo-400 mt-0.5">1 Request</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Casual Leave (25 Sep)</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <p className="text-xs text-slate-400">Current Shift</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">07–02 PM</p>
            <p className="text-[11px] text-sky-400 mt-0.5">Morning Ward Duty</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Self-Service */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: "Today's Status", icon: UserCheck },
          { id: 'calendar', label: 'Attendance Calendar', icon: CalendarIcon },
          { id: 'history', label: 'Attendance History', icon: Clock },
          { id: 'leave', label: 'My Leave', icon: Coffee },
          { id: 'shift', label: 'My Shift', icon: Clock },
          { id: 'hospital_calendar', label: 'Hospital Calendar', icon: CalendarIcon },
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Today's Status */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card md:col-span-2 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Today's Punch Status — 24 Sep 2026
              </h2>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                🟢 PRESENT
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div>
                <p className="text-xs text-slate-400">Shift Timings</p>
                <p className="text-sm font-semibold text-white mt-1">07:00 AM – 02:00 PM</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Punch In</p>
                <p className="text-sm font-semibold text-emerald-400 mt-1">06:57 AM</p>
                <span className="text-[10px] text-emerald-300">On time (-3m)</span>
              </div>
              <div>
                <p className="text-xs text-slate-400">Punch Out</p>
                <p className="text-sm font-semibold text-sky-400 mt-1">02:08 PM</p>
                <span className="text-[10px] text-sky-300">+8m Overtime</span>
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Shift Time</p>
                <p className="text-sm font-semibold text-amber-300 mt-1">7h 11m</p>
                <span className="text-[10px] text-slate-400">Full day credited</span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setShowApplyLeaveModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 text-xs font-semibold transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Apply Leave
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold transition-all flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" /> Attendance History
                </button>
                <button
                  onClick={() => setShowCorrectionModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-xs font-semibold transition-all flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" /> Request Correction
                </button>
                <button
                  onClick={() => setActiveTab('shift')}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-semibold transition-all flex items-center gap-2"
                >
                  <CalendarIcon className="w-4 h-4" /> My Shift
                </button>
              </div>
            </div>

            {/* If tasks provided for support crew (Aayah, Sweeper, etc.) */}
            {tasksList && tasksList.length > 0 && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Today's Assigned Tasks</p>
                <div className="space-y-2">
                  {tasksList.map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-xs text-slate-200">{t.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {t.done ? '✓ Completed' : '○ Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Leave Quick Balance Widget */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Coffee className="w-4 h-4 text-sky-400" />
              My Leave Balances
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Casual Leave (CL)</span>
                  <span className="text-emerald-400 font-bold">7 Available</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Allocated: 12</span>
                  <span>Used: 4 | Pending: 1</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Sick Leave (SL)</span>
                  <span className="text-emerald-400 font-bold">10 Available</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Allocated: 12</span>
                  <span>Used: 2 | Pending: 0</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Earned Leave (EL)</span>
                  <span className="text-emerald-400 font-bold">12 Available</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Allocated: 15</span>
                  <span>Used: 3 | Pending: 0</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowApplyLeaveModal(true)}
              className="w-full py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-semibold transition-all text-center"
            >
              Apply for Leave
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Attendance Calendar (September 2026) */}
      {activeTab === 'calendar' && (
        <div className="glass-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">September 2026 — Attendance Calendar</h2>
              <p className="text-xs text-slate-400">Click on any date to inspect shift timings and punch logs</p>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Present</span>
              <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Absent</span>
              <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Leave</span>
              <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Weekly Off</span>
              <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Holiday</span>
              <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Future</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
              <div key={day} className="text-center font-bold text-xs text-slate-400 py-2 border-b border-white/10 font-mono">
                {day}
              </div>
            ))}
            {septemberDays.map(item => {
              const dotColor = 
                item.type === 'present' ? 'bg-emerald-400' :
                item.type === 'absent'  ? 'bg-rose-500' :
                item.type === 'leave'   ? 'bg-amber-400' :
                item.type === 'off'     ? 'bg-sky-500' :
                item.type === 'holiday' ? 'bg-purple-400' : 'bg-slate-500';

              const bgGlass = item.isToday 
                ? 'bg-sky-500/20 border-sky-400/50 shadow-md ring-1 ring-sky-400/40' 
                : 'bg-white/5 hover:bg-white/10 border-white/5';

              return (
                <div
                  key={item.day}
                  onClick={() => setSelectedDay(item)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[76px] ${bgGlass}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${item.isToday ? 'text-sky-300' : 'text-white'}`}>
                      {item.day}
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">
                    {item.type === 'present' ? 'Present' : item.type === 'off' ? 'Off' : item.type}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Attendance History Table */}
      {activeTab === 'history' && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Employee Attendance History</h2>
            <button
              onClick={() => setShowCorrectionModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold"
            >
              Request Correction
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-300 font-semibold border-b border-white/10">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Shift</th>
                  <th className="p-3">Punch In</th>
                  <th className="p-3">Punch Out</th>
                  <th className="p-3">Total Worked</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {septemberDays.filter(d => d.type !== 'future').reverse().map(d => (
                  <tr key={d.day} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-semibold text-white">{d.day} Sep 2026</td>
                    <td className="p-3">{d.shift}</td>
                    <td className="p-3 font-mono text-emerald-400">{d.in}</td>
                    <td className="p-3 font-mono text-sky-400">{d.out}</td>
                    <td className="p-3 font-mono text-amber-300">{d.total}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.type === 'present' ? 'bg-emerald-500/20 text-emerald-300' :
                        d.type === 'absent'  ? 'bg-rose-500/20 text-rose-300' :
                        d.type === 'leave'   ? 'bg-amber-500/20 text-amber-300' :
                        d.type === 'off'     ? 'bg-sky-500/20 text-sky-300' :
                        'bg-purple-500/20 text-purple-300'
                      }`}>
                        {d.type.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: My Leave Dashboard */}
      {activeTab === 'leave' && (
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">My Leave Dashboard</h2>
              <p className="text-xs text-slate-400">Track allocations, approved leaves, and pending requests</p>
            </div>
            <button
              onClick={() => setShowApplyLeaveModal(true)}
              className="px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-bold flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Apply Leave
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="text-sm font-bold text-sky-400">Casual Leave (CL)</h3>
              <div className="text-2xl font-black text-white">7 <span className="text-xs font-normal text-slate-400">Available</span></div>
              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-white/5">
                <div className="flex justify-between"><span>Allocated:</span> <span>12 Days</span></div>
                <div className="flex justify-between"><span>Used:</span> <span className="text-amber-400">4 Days</span></div>
                <div className="flex justify-between"><span>Pending Approval:</span> <span className="text-indigo-400">1 Day</span></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="text-sm font-bold text-emerald-400">Sick Leave (SL)</h3>
              <div className="text-2xl font-black text-white">10 <span className="text-xs font-normal text-slate-400">Available</span></div>
              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-white/5">
                <div className="flex justify-between"><span>Allocated:</span> <span>12 Days</span></div>
                <div className="flex justify-between"><span>Used:</span> <span className="text-amber-400">2 Days</span></div>
                <div className="flex justify-between"><span>Pending Approval:</span> <span className="text-indigo-400">0 Days</span></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="text-sm font-bold text-purple-400">Earned Leave (EL)</h3>
              <div className="text-2xl font-black text-white">12 <span className="text-xs font-normal text-slate-400">Available</span></div>
              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-white/5">
                <div className="flex justify-between"><span>Allocated:</span> <span>15 Days</span></div>
                <div className="flex justify-between"><span>Used:</span> <span className="text-amber-400">3 Days</span></div>
                <div className="flex justify-between"><span>Pending Approval:</span> <span className="text-indigo-400">0 Days</span></div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <h3 className="text-sm font-bold text-white mb-3">Recent Leave Requests</h3>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  Pending HOD Approval
                </span>
                <p className="text-sm font-semibold text-white mt-1.5">Casual Leave — 25 Sep 2026 (1 Day)</p>
                <p className="text-xs text-slate-400">Reason: Family medical requirement</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">Applied: 22 Sep</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: My Shift Module */}
      {activeTab === 'shift' && (
        <div className="glass-card p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white">My Shift Schedule</h2>
            <p className="text-xs text-slate-400">Assigned by Nursing Superintendent & HOD. Contact supervisor for shift swaps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
              <span className="text-[10px] font-bold uppercase text-sky-400">Today (Thursday)</span>
              <p className="text-base font-bold text-white mt-1">07:00 AM – 02:00 PM</p>
              <p className="text-xs text-slate-400 mt-0.5">Shift A (Morning)</p>
              <span className="mt-2 inline-block text-[10px] font-semibold text-emerald-300">🟢 In Progress</span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] font-bold uppercase text-slate-400">Tomorrow (Friday)</span>
              <p className="text-base font-bold text-white mt-1">01:00 PM – 08:00 PM</p>
              <p className="text-xs text-slate-400 mt-0.5">Shift B (Evening)</p>
              <span className="mt-2 inline-block text-[10px] font-semibold text-slate-400">Scheduled</span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] font-bold uppercase text-slate-400">Saturday</span>
              <p className="text-base font-bold text-white mt-1">07:00 PM – 08:00 AM</p>
              <p className="text-xs text-slate-400 mt-0.5">Shift C (Night OT Support)</p>
              <span className="mt-2 inline-block text-[10px] font-semibold text-purple-300">Night Allowance</span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] font-bold uppercase text-slate-400">Sunday</span>
              <p className="text-base font-bold text-sky-400 mt-1">Weekly Off</p>
              <p className="text-xs text-slate-400 mt-0.5">Rest Day</p>
              <span className="mt-2 inline-block text-[10px] font-semibold text-sky-300">Authorized Off</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Shift modifications cannot be done directly by employees. Any shift exchange requires approval from the Nursing Supervisor or HOD at least 24 hours in advance.</span>
          </div>
        </div>
      )}

      {/* Tab 6: Hospital Calendar */}
      {activeTab === 'hospital_calendar' && (
        <div className="glass-card p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">Kanakadurga Nursing Home — Hospital Calendar</h2>
            <p className="text-xs text-slate-400">Hospital Working Schedule & Public/Gazetted Holidays (September – October 2026)</p>
          </div>

          <div className="space-y-3">
            {[
              { date: '15 Sep 2026', title: 'Milad-un-Nabi', type: 'Hospital Holiday', note: 'Emergency services & Inpatient Wards operational.' },
              { date: '02 Oct 2026', title: 'Gandhi Jayanti', type: 'National Holiday', note: 'Essential staff rostered on Shift A/C.' },
              { date: '20 Oct 2026', title: 'Dussehra / Vijayadashami', type: 'Hospital Holiday', note: 'Holiday pay rates apply for working staff.' },
              { date: '14 Nov 2026', title: 'Diwali (Deepavali)', type: 'Festival Holiday', note: 'Emergency Triage & ICU staffed 24/7.' },
            ].map((hol, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <span className="text-xs font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                    {hol.type}
                  </span>
                  <h4 className="text-sm font-semibold text-white mt-1">{hol.title}</h4>
                  <p className="text-xs text-slate-400">{hol.note}</p>
                </div>
                <span className="text-xs font-mono font-bold text-sky-300">{hol.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day Details Modal (When user clicks a calendar day) */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 space-y-4 border border-white/20">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Punch Details — {selectedDay.day} Sep 2026
              </h3>
              <button onClick={() => setSelectedDay(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold text-emerald-400 uppercase">{selectedDay.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Shift:</span>
                <span className="font-semibold text-white">{selectedDay.shift}</span>
              </div>
              <div className="flex justify-between">
                <span>Punch In:</span>
                <span className="font-mono text-emerald-400">{selectedDay.in}</span>
              </div>
              <div className="flex justify-between">
                <span>Punch Out:</span>
                <span className="font-mono text-sky-400">{selectedDay.out}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5">
                <span>Total Worked:</span>
                <span className="font-mono font-bold text-amber-300">{selectedDay.total}</span>
              </div>
              {selectedDay.overtime && (
                <div className="flex justify-between">
                  <span>Overtime:</span>
                  <span className="font-mono text-emerald-300">{selectedDay.overtime}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedDay(null);
                setCorrectionDate(`2026-09-${String(selectedDay.day).padStart(2, '0')}`);
                setShowCorrectionModal(true);
              }}
              className="w-full py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-semibold"
            >
              Request Correction for This Day
            </button>
          </div>
        </div>
      )}

      {/* Forgot Punch / Correction Request Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 space-y-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Request Attendance Correction</h3>
                <p className="text-xs text-slate-400">Regularize missing or discrepancy punches</p>
              </div>
              <button onClick={() => setShowCorrectionModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCorrectionSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Correction Type</label>
                <select
                  value={correctionType}
                  onChange={e => setCorrectionType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/10 border border-white/10 text-white"
                >
                  <option value="Missing Punch Out" className="bg-slate-900">Missing Punch Out</option>
                  <option value="Missing Punch In" className="bg-slate-900">Missing Punch In</option>
                  <option value="Late Regularization" className="bg-slate-900">Late Regularization (Emergency On-Duty)</option>
                  <option value="Shift Correction" className="bg-slate-900">Shift Swap Correction</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    value={correctionDate}
                    onChange={e => setCorrectionDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/10 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Actual Time</label>
                  <input
                    type="time"
                    value={correctionTime}
                    onChange={e => setCorrectionTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/10 border border-white/10 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Reason for Request</label>
                <textarea
                  rows={3}
                  value={correctionReason}
                  onChange={e => setCorrectionReason(e.target.value)}
                  placeholder="e.g. Biometric terminal offline or delayed emergency handover..."
                  className="w-full p-2.5 rounded-xl bg-white/10 border border-white/10 text-white"
                  required
                />
              </div>

              {/* Workflow info callout */}
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[11px] text-sky-300">
                <span className="font-bold">Approval Workflow:</span> Employee ➔ Supervisor ➔ HR / Attendance Officer. Direct database edits are restricted.
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {showApplyLeaveModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 space-y-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Apply for Leave</h3>
                <p className="text-xs text-slate-400">Available: CL (7), SL (10), EL (12)</p>
              </div>
              <button onClick={() => setShowApplyLeaveModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeaveSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/10 border border-white/10 text-white"
                >
                  <option value="Casual Leave" className="bg-slate-900">Casual Leave (CL - 7 days left)</option>
                  <option value="Sick Leave" className="bg-slate-900">Sick Leave (SL - 10 days left)</option>
                  <option value="Earned Leave" className="bg-slate-900">Earned Leave (EL - 12 days left)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">From Date</label>
                  <input
                    type="date"
                    value={leaveStart}
                    onChange={e => setLeaveStart(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/10 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">To Date</label>
                  <input
                    type="date"
                    value={leaveEnd}
                    onChange={e => setLeaveEnd(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/10 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Reason</label>
                <textarea
                  rows={3}
                  value={leaveReason}
                  onChange={e => setLeaveReason(e.target.value)}
                  placeholder="State the reason for leave..."
                  className="w-full p-2.5 rounded-xl bg-white/10 border border-white/10 text-white"
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyLeaveModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
