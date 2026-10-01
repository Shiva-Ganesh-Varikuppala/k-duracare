import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Bot, User, Calendar, Clock, Wallet, Activity, MapPin, Phone, Mail, Briefcase, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { employees } from '../data/employees';
import { generateEmployeeSummary } from '../services/aiService';

const TABS = ['Profile', 'Attendance', 'Leave', 'Shift', 'Payroll', 'AI Insights'];

const attendanceMonthData = [
  { week: 'W1', present: 6, absent: 0, leave: 0 },
  { week: 'W2', present: 5, absent: 1, leave: 0 },
  { week: 'W3', present: 6, absent: 0, leave: 0 },
  { week: 'W4', present: 5, absent: 0, leave: 1 },
];

const shiftData = [
  { name: 'Morning', value: 12, color: '#F59E0B' },
  { name: 'Evening', value: 5, color: '#0EA5E9' },
  { name: 'Night', value: 3, color: '#8B5CF6' },
];

const operationalEvents = [
  { time: '07:02', zone: 'Staff Entrance', event: 'Zone Entry', cam: 'CAM-STAFF-01' },
  { time: '07:08', zone: 'ICU Entrance', event: 'Zone Entry', cam: 'CAM-ICU-01' },
  { time: '08:42', zone: 'Nurse Station', event: 'Zone Entry', cam: 'CAM-NK-01' },
  { time: '10:12', zone: 'ICU Staff Area', event: 'Prolonged Presence', cam: 'CAM-ICU-02' },
  { time: '12:03', zone: 'Staff Area', event: 'Zone Entry', cam: 'CAM-ICU-02' },
  { time: '14:04', zone: 'Exit', event: 'Zone Exit', cam: 'CAM-STAFF-01' },
];

export default function Employee360() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const employee = employees.find(e => e.id === id) || employees[0];

  useEffect(() => {
    if (activeTab === 'AI Insights' && !aiSummary) {
      setAiLoading(true);
      generateEmployeeSummary(employee).then(s => {
        setAiSummary(s);
        setAiLoading(false);
      });
    }
  }, [activeTab, employee]);

  const gross = employee.basic + employee.hra + employee.allowance;
  const pf = Math.round(employee.basic * 0.075);
  const esi = employee.basic <= 21000 ? Math.round(gross * 0.02) : 0;
  const net = gross - pf - esi - 200;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/employees')} className="btn-secondary p-2">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Employee 360°</h1>
            <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2 py-0.5 text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Enhanced
            </span>
          </div>
          <p className="text-sm text-slate-400">{employee.id}</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
            {employee.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{employee.name}</h2>
            <p className="text-slate-400 text-sm">{employee.designation} · {employee.department}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${employee.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                {employee.status}
              </span>
              <span className="text-xs bg-navy-700 border border-navy-500 rounded-full px-2 py-0.5 text-slate-400">{employee.employmentType}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                employee.shift === 'Morning' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                employee.shift === 'Evening' ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' :
                employee.shift === 'Night' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {employee.shift} Shift
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center">
            {[
              { label: 'Attendance', value: `${employee.attendancePercent}%`, color: 'text-emerald-400' },
              { label: 'Leave Left', value: `${12 - (employee.leaveUsed || 0)} days`, color: 'text-sky-400' },
              { label: 'Overtime', value: `${employee.overtimeHours}h`, color: 'text-amber-400' },
              { label: 'Late', value: employee.lateCount, color: 'text-orange-400' },
            ].map(m => (
              <div key={m.label} className="glass-card p-3">
                <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-navy-800 border border-navy-600 rounded-xl p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === tab
                ? 'bg-sky-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-700'
            }`}
          >
            {tab === 'AI Insights' && <Sparkles className="w-3 h-3" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-card p-5 space-y-4">
            <p className="section-title flex items-center gap-2"><User className="w-4 h-4 text-sky-400" /> Personal Information</p>
            {[
              { label: 'Full Name', value: employee.name },
              { label: 'Blood Group', value: employee.bloodGroup },
              { label: 'Gender', value: employee.gender },
              { label: 'Phone', value: employee.phone },
              { label: 'Email', value: employee.email },
              { label: 'Address', value: employee.address },
              { label: 'Emergency Contact', value: employee.emergencyContact },
            ].map(f => (
              <div key={f.label} className="flex justify-between items-start border-b border-navy-700 pb-3">
                <span className="text-xs text-slate-500">{f.label}</span>
                <span className="text-xs text-slate-200 text-right max-w-[60%]">{f.value}</span>
              </div>
            ))}
          </div>
          <div className="glass-card p-5 space-y-4">
            <p className="section-title flex items-center gap-2"><Briefcase className="w-4 h-4 text-sky-400" /> Employment Information</p>
            {[
              { label: 'Employee ID', value: employee.id },
              { label: 'Department', value: employee.department },
              { label: 'Designation', value: employee.designation },
              { label: 'Employment Type', value: employee.employmentType },
              { label: 'Joining Date', value: employee.joiningDate },
              { label: 'Shift', value: `${employee.shift} (${employee.shiftCode})` },
              { label: 'PF Number', value: employee.pfNumber },
              { label: 'ESI Number', value: employee.esiNumber },
            ].map(f => (
              <div key={f.label} className="flex justify-between items-start border-b border-navy-700 pb-3">
                <span className="text-xs text-slate-500">{f.label}</span>
                <span className="text-xs text-slate-200 text-right max-w-[60%]">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-card p-5">
            <p className="section-title mb-1">September 2026 — Summary</p>
            <p className="section-subtitle mb-4">Monthly attendance breakdown</p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Present', value: employee.present, color: 'text-emerald-400' },
                { label: 'Absent', value: employee.absent, color: 'text-red-400' },
                { label: 'Leave', value: employee.leaveUsed, color: 'text-amber-400' },
                { label: 'Late', value: employee.lateCount, color: 'text-orange-400' },
                { label: 'Weekly Off', value: 4, color: 'text-slate-400' },
                { label: 'Holiday', value: 2, color: 'text-sky-400' },
              ].map(m => (
                <div key={m.label} className="glass-card p-3 text-center">
                  <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-slate-500">{m.label}</p>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={attendanceMonthData}>
                <XAxis dataKey="week" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1E2A45', border: '1px solid #253355', borderRadius: '8px', color: '#E2E8F0', fontSize: '12px' }} />
                <Bar dataKey="present" fill="#10B981" radius={[3, 3, 0, 0]} name="Present" />
                <Bar dataKey="absent" fill="#EF4444" radius={[3, 3, 0, 0]} name="Absent" />
                <Bar dataKey="leave" fill="#F59E0B" radius={[3, 3, 0, 0]} name="Leave" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card p-5">
            <p className="section-title mb-4">Attendance Log</p>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {Array.from({ length: 20 }, (_, i) => {
                const day = i + 1;
                const date = new Date(2026, 8, day);
                const isWeekend = date.getDay() === 0;
                const status = isWeekend ? 'Weekly Off' : (day === 14 ? 'Holiday' : (day === 2 || day === 19 ? 'Leave' : (day === 8 ? 'Late' : 'Present')));
                const checkIn = status === 'Present' ? '07:04' : status === 'Late' ? '07:42' : null;
                const checkOut = checkIn ? '14:08' : null;
                return (
                  <div key={day} className="flex items-center gap-3 py-2 border-b border-navy-700 text-xs">
                    <span className="text-slate-500 w-12">Sep {day}</span>
                    <span className={`flex-shrink-0 ${
                      status === 'Present' ? 'badge-present' :
                      status === 'Late' ? 'badge-late' :
                      status === 'Leave' ? 'badge-leave' :
                      status === 'Holiday' ? 'text-sky-400 text-xs font-semibold' :
                      'badge-off'
                    }`}>{status}</span>
                    {checkIn && <span className="text-slate-400">{checkIn} → {checkOut}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Leave' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-card p-5">
            <p className="section-title mb-4">Leave Balance</p>
            {[
              { type: 'Casual Leave', used: employee.leaveUsed, total: 12 },
              { type: 'Sick Leave', used: 2, total: 12 },
              { type: 'Earned Leave', used: 5, total: 15 },
              { type: 'Emergency Leave', used: 0, total: 3 },
            ].map(l => (
              <div key={l.type} className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{l.type}</span>
                  <span className="text-slate-400">{l.used} used / {l.total - l.used} available</span>
                </div>
                <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(l.used / l.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card p-5">
            <p className="section-title mb-4">Leave History</p>
            {[
              { date: '20 Sep', type: 'Casual Leave', status: 'Approved', days: 1 },
              { date: '02 Sep', type: 'Sick Leave', status: 'Approved', days: 2 },
              { date: '10 Aug', type: 'Casual Leave', status: 'Rejected', days: 2 },
              { date: '15 Jul', type: 'Earned Leave', status: 'Approved', days: 3 },
            ].map((l, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-navy-700 text-xs">
                <span className="text-slate-500 w-16">{l.date}</span>
                <span className="flex-1 text-slate-300">{l.type}</span>
                <span className="text-slate-400">{l.days}d</span>
                <span className={l.status === 'Approved' ? 'badge-present' : 'badge-absent'}>{l.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Shift' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-card p-5">
            <p className="section-title mb-4">Shift Distribution — September</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={shiftData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {shiftData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1E2A45', border: '1px solid #253355', borderRadius: '8px', color: '#E2E8F0', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 justify-center mt-2">
              {shiftData.map(s => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  {s.name}: {s.value}
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-5">
            <p className="section-title mb-4">Recent Shift History</p>
            {[14,15,16,17,18,19,20].map(d => {
              const shift = d <= 17 ? 'Morning' : d === 18 ? 'Evening' : d === 19 ? 'Night' : 'Morning';
              const color = shift === 'Morning' ? 'text-amber-400' : shift === 'Evening' ? 'text-sky-400' : 'text-purple-400';
              return (
                <div key={d} className="flex items-center gap-3 py-2.5 border-b border-navy-700 text-xs">
                  <span className="text-slate-500 w-12">Sep {d}</span>
                  <span className={`font-medium ${color}`}>{shift}</span>
                  <span className="text-slate-500 ml-auto">{shift === 'Morning' ? '07:00–14:00' : shift === 'Evening' ? '13:00–20:00' : '19:00–08:00'}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'Payroll' && (
        <div className="glass-card p-6 max-w-xl">
          <p className="section-title mb-1">September 2026 Payroll</p>
          <p className="section-subtitle mb-5">Calculated payslip summary</p>
          <div className="space-y-3">
            <div className="bg-navy-700/50 rounded-lg p-4">
              <p className="text-xs font-semibold text-emerald-400 mb-3">EARNINGS</p>
              {[
                ['Basic Salary', employee.basic],
                ['HRA', employee.hra],
                ['Special Allowance', employee.allowance],
                ['Overtime', Math.round(employee.overtimeHours * 200)],
              ].map(([label, amount]) => (
                <div key={label} className="flex justify-between text-sm py-1.5 border-b border-navy-600">
                  <span className="text-slate-300">{label}</span>
                  <span className="text-slate-200">₹{amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 font-bold">
                <span className="text-slate-200">Gross</span>
                <span className="text-emerald-400">₹{(gross + Math.round(employee.overtimeHours * 200)).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="bg-navy-700/50 rounded-lg p-4">
              <p className="text-xs font-semibold text-red-400 mb-3">DEDUCTIONS</p>
              {[
                ['Provident Fund', pf],
                ['ESI', esi],
                ['Professional Tax', 200],
              ].map(([label, amount]) => (
                <div key={label} className="flex justify-between text-sm py-1.5 border-b border-navy-600">
                  <span className="text-slate-300">{label}</span>
                  <span className="text-red-400">- ₹{amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-4 flex justify-between">
              <span className="text-sm font-bold text-slate-100">Net Pay</span>
              <span className="text-lg font-bold text-sky-400">₹{(net + Math.round(employee.overtimeHours * 200)).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'AI Insights' && (
        <div className="space-y-5">
          {/* AI Summary */}
          <div className="ai-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-100">AI Workforce Summary</p>
                <p className="text-xs text-indigo-400">Generated by Gemini · September 2026</p>
              </div>
            </div>
            {aiLoading ? (
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                Generating AI analysis...
              </div>
            ) : (
              <div className="space-y-1">
                {aiSummary.split('\n').map((line, i) => {
                  const parts = line.split(/(\*\*.*?\*\*)/g);
                  return (
                    <p key={i} className="text-sm text-slate-300 leading-relaxed">
                      {parts.map((part, j) =>
                        part.startsWith('**') && part.endsWith('**')
                          ? <strong key={j} className="text-slate-100">{part.replace(/\*\*/g, '')}</strong>
                          : part
                      )}
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          {/* Operational Events */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-sky-400" />
              <p className="section-title">Workplace Events — September 20</p>
              <span className="text-xs text-slate-500 ml-auto">AI observed · Supervisor review required for consequential actions</span>
            </div>
            <div className="space-y-3">
              {operationalEvents.map((ev, i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-navy-700 text-sm">
                  <span className="text-slate-500 w-12 text-xs">{ev.time}</span>
                  <div className="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0" />
                  <div>
                    <p className="text-slate-200 text-xs">{ev.zone}</p>
                    <p className="text-slate-500 text-xs">{ev.event} · {ev.cam}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3 italic">
              System-observed activity based on CCTV zone events. Not used for payroll calculation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
