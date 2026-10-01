import { useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle, Download, FileText, TrendingUp, Users, Calendar, Wallet, Clock } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { payrollSummary, payrollRecords, monthlyPayrollTrend } from '../data/payroll';
import { detectPayrollAnomalies } from '../services/aiService';
import { departmentCoverage, todayStats } from '../data/employees';

const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];

const deptExpenseData = [
  { dept: 'Nursing', amount: 2100000 },
  { dept: 'ICU', amount: 1800000 },
  { dept: 'Doctors', amount: 1400000 },
  { dept: 'OT', amount: 900000 },
  { dept: 'Housekeeping', amount: 620000 },
  { dept: 'Security', amount: 480000 },
  { dept: 'Others', amount: 732500 },
];

const attendanceTrend7 = [
  { day: 'Mon', rate: 92 }, { day: 'Tue', rate: 94 }, { day: 'Wed', rate: 91 },
  { day: 'Thu', rate: 95 }, { day: 'Fri', rate: 93 }, { day: 'Sat', rate: 88 }, { day: 'Sun', rate: 85 },
];

const leaveTrendData = [
  { month: 'Apr', casual: 45, sick: 30, earned: 20 },
  { month: 'May', casual: 52, sick: 25, earned: 18 },
  { month: 'Jun', casual: 48, sick: 40, earned: 22 },
  { month: 'Jul', casual: 55, sick: 35, earned: 30 },
  { month: 'Aug', casual: 50, sick: 28, earned: 25 },
  { month: 'Sep', casual: 58, sick: 32, earned: 28 },
];

function HospitalAnalytics() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: todayStats.total, icon: Users, color: 'text-sky-400', border: 'hover:border-sky-500/50', bg: 'bg-sky-500/15' },
          { label: 'Avg Attendance', value: '87.2%', icon: Calendar, color: 'text-emerald-400', border: 'hover:border-emerald-500/50', bg: 'bg-emerald-500/15' },
          { label: 'Monthly Payroll', value: '₹79.6L', icon: Wallet, color: 'text-amber-400', border: 'hover:border-amber-500/50', bg: 'bg-amber-500/15' },
          { label: 'Total Overtime (Sep)', value: '1,420h', icon: Clock, color: 'text-purple-400', border: 'hover:border-purple-500/50', bg: 'bg-purple-500/15' },
        ].map(m => (
          <div key={m.label} className={`glass-card-hover p-5 border border-slate-700/60 transition-all duration-300 ${m.border}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 font-medium">{m.label}</span>
              <div className={`w-9 h-9 rounded-xl ${m.bg} flex items-center justify-center border border-white/5`}>
                <m.icon className={`w-4 h-4 ${m.color}`} />
              </div>
            </div>
            <p className={`text-3xl font-extrabold ${m.color}`}>{m.value}</p>
            <p className="text-[11px] text-slate-500 mt-1">Live aggregated metrics</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card p-5">
          <p className="section-title mb-4">Monthly Payroll Trend</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyPayrollTrend}>
              <defs>
                <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip contentStyle={{ background: '#1E2A45', border: '1px solid #253355', borderRadius: '8px', color: '#E2E8F0', fontSize: '12px' }} formatter={v => [`₹${(v/100000).toFixed(1)}L`]} />
              <Area type="monotone" dataKey="gross" stroke="#0EA5E9" strokeWidth={2} fill="url(#grossGrad)" name="Gross" />
              <Area type="monotone" dataKey="net" stroke="#10B981" strokeWidth={2} fill="url(#netGrad)" name="Net" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <p className="section-title mb-4">Department Payroll Distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={deptExpenseData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="amount" paddingAngle={3}>
                {deptExpenseData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1E2A45', border: '1px solid #253355', borderRadius: '8px', color: '#E2E8F0', fontSize: '12px' }} formatter={v => [`₹${(v/100000).toFixed(1)}L`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card p-5">
          <p className="section-title mb-4">Weekly Attendance Rate</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={attendanceTrend7}>
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[75, 100]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1E2A45', border: '1px solid #253355', borderRadius: '8px', color: '#E2E8F0', fontSize: '12px' }} />
              <Bar dataKey="rate" fill="#0EA5E9" radius={[4, 4, 0, 0]} name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <p className="section-title mb-4">Leave Trend — 6 Months</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={leaveTrendData}>
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1E2A45', border: '1px solid #253355', borderRadius: '8px', color: '#E2E8F0', fontSize: '12px' }} />
              <Line type="monotone" dataKey="casual" stroke="#0EA5E9" strokeWidth={2} dot={false} name="Casual" />
              <Line type="monotone" dataKey="sick" stroke="#10B981" strokeWidth={2} dot={false} name="Sick" />
              <Line type="monotone" dataKey="earned" stroke="#F59E0B" strokeWidth={2} dot={false} name="Earned" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function PayrollPage() {
  const anomalies = detectPayrollAnomalies(payrollRecords);

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="section-title">September 2026 Payroll</p>
            <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5">{payrollSummary.status}</span>
          </div>
          <button className="btn-primary"><Download className="w-4 h-4" /> Export</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            ['Employees', payrollSummary.totalEmployees, 'text-slate-200'],
            ['Gross Payroll', `₹${(payrollSummary.grossPayroll/100000).toFixed(1)}L`, 'text-sky-400'],
            ['Overtime', `₹${(payrollSummary.overtime/100000).toFixed(2)}L`, 'text-amber-400'],
            ['Deductions', `₹${(payrollSummary.deductions/100000).toFixed(2)}L`, 'text-red-400'],
            ['Net Payroll', `₹${(payrollSummary.netPayroll/100000).toFixed(1)}L`, 'text-emerald-400'],
          ].map(([l, v, c]) => (
            <div key={l} className="glass-card p-4 text-center">
              <p className={`text-xl font-bold ${c}`}>{v}</p>
              <p className="text-xs text-slate-400 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Anomaly Detection */}
      {anomalies.length > 0 && (
        <div className="ai-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <p className="section-title">AI Payroll Anomaly Detection</p>
          </div>
          <div className="space-y-3">
            {anomalies.map((a, i) => (
              <div key={i} className={`p-3 rounded-lg border text-sm ${a.severity === 'High' ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className={`w-4 h-4 ${a.severity === 'High' ? 'text-red-400' : 'text-amber-400'}`} />
                  <span className="font-semibold text-slate-100">{a.empId} — {a.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${a.severity === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{a.type}</span>
                </div>
                <p className="text-slate-300 text-sm">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payroll Records */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-navy-700 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-200">Payroll Records</p>
          <div className="flex gap-2">
            <button className="btn-secondary text-xs py-1.5">
              <CheckCircle className="w-3 h-3" /> Verify
            </button>
            <button className="btn-primary text-xs py-1.5">
              Process Payroll
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-navy-700/50">
            <tr>
              <th className="table-header text-left">Employee</th>
              <th className="table-header text-left">Department</th>
              <th className="table-header text-right">Basic</th>
              <th className="table-header text-right">Gross</th>
              <th className="table-header text-right">Deductions</th>
              <th className="table-header text-right">Net Pay</th>
              <th className="table-header text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {payrollRecords.map(r => (
              <tr key={r.empId} className="table-row">
                <td className="table-cell">
                  <p className="text-sm font-medium text-slate-200">{r.name}</p>
                  <p className="text-xs text-slate-500">{r.empId}</p>
                </td>
                <td className="table-cell text-xs text-slate-400">{r.dept}</td>
                <td className="table-cell text-right text-xs text-slate-300">₹{r.basic.toLocaleString('en-IN')}</td>
                <td className="table-cell text-right text-xs text-slate-200 font-medium">₹{r.gross.toLocaleString('en-IN')}</td>
                <td className="table-cell text-right text-xs text-red-400">-₹{(r.pf + r.esi + r.pt + r.lop).toLocaleString('en-IN')}</td>
                <td className="table-cell text-right text-sm font-bold text-emerald-400">₹{r.netPay.toLocaleString('en-IN')}</td>
                <td className="table-cell">
                  <span className={`text-xs font-semibold ${r.status === 'Calculated' ? 'text-sky-400' : 'text-amber-400'}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ShiftsPage() {
  const shifts = [
    { code: 'SHIFT-A', name: 'Morning Shift', start: '07:00', end: '14:00', duration: '7h', employees: 112, color: 'text-amber-400', bar: 'bg-amber-400' },
    { code: 'SHIFT-B', name: 'Evening Shift', start: '13:00', end: '20:00', duration: '7h', employees: 98, color: 'text-sky-400', bar: 'bg-sky-400' },
    { code: 'SHIFT-C', name: 'Night Shift', start: '19:00', end: '08:00+1', duration: '13h', employees: 86, color: 'text-purple-400', bar: 'bg-purple-400' },
    { code: 'GENERAL', name: 'General Shift', start: '09:00', end: '17:30', duration: '8.5h', employees: 30, color: 'text-emerald-400', bar: 'bg-emerald-400' },
  ];

  const roster = [
    { emp: 'Nurse 001', dept: 'Nursing', d1: 'A', d2: 'A', d3: 'B', d4: 'B', d5: 'C', d6: 'C', d7: 'OFF' },
    { emp: 'Nurse 002', dept: 'Nursing', d1: 'B', d2: 'B', d3: 'C', d4: 'C', d5: 'A', d6: 'A', d7: 'OFF' },
    { emp: 'ICU Nurse 001', dept: 'ICU', d1: 'C', d2: 'C', d3: 'A', d4: 'A', d5: 'B', d6: 'B', d7: 'OFF' },
    { emp: 'Security 001', dept: 'Security', d1: 'C', d2: 'C', d3: 'C', d4: 'C', d5: 'C', d6: 'C', d7: 'C' },
    { emp: 'Reception 001', dept: 'Reception', d1: 'G', d2: 'G', d3: 'G', d4: 'G', d5: 'G', d6: 'G', d7: 'OFF' },
  ];

  const days = ['Sep 20', 'Sep 21', 'Sep 22', 'Sep 23', 'Sep 24', 'Sep 25', 'Sep 26'];
  const shiftColors = { A: 'bg-amber-500/20 text-amber-400', B: 'bg-sky-500/20 text-sky-400', C: 'bg-purple-500/20 text-purple-400', G: 'bg-emerald-500/20 text-emerald-400', OFF: 'bg-navy-700 text-slate-500' };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {shifts.map(s => (
          <div key={s.code} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${s.bar}`} />
              <p className="text-sm font-semibold text-slate-100">{s.name}</p>
            </div>
            <p className={`text-xs ${s.color}`}>{s.start} → {s.end} · {s.duration}</p>
            <p className="text-xs text-slate-400 mt-1">{s.employees} employees</p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-x-auto">
        <div className="p-4 border-b border-navy-700">
          <p className="section-title">Weekly Shift Roster — Sep 20–26</p>
        </div>
        <table className="w-full min-w-max">
          <thead className="bg-navy-700/50">
            <tr>
              <th className="table-header text-left">Employee</th>
              <th className="table-header text-left">Dept</th>
              {days.map(d => <th key={d} className="table-header text-center">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {roster.map((r, i) => (
              <tr key={i} className="table-row">
                <td className="table-cell text-sm text-slate-200">{r.emp}</td>
                <td className="table-cell text-xs text-slate-400">{r.dept}</td>
                {['d1','d2','d3','d4','d5','d6','d7'].map(d => (
                  <td key={d} className="table-cell text-center">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${shiftColors[r[d]]}`}>{r[d]}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const PAGE_TABS = ['Hospital Analytics', 'Payroll', 'Shifts'];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('Hospital Analytics');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
        <p className="text-sm text-slate-400">AI-powered hospital workforce intelligence</p>
      </div>

      <div className="tab-bar">
        {PAGE_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'tab-active' : 'tab-item'}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Hospital Analytics' && <HospitalAnalytics />}
      {activeTab === 'Payroll' && <PayrollPage />}
      {activeTab === 'Shifts' && <ShiftsPage />}
    </div>
  );
}
