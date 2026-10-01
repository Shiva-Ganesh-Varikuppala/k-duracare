import { useState } from 'react';
import {
  Sparkles, AlertTriangle, CheckCircle, Download, TrendingUp,
  Users, Calendar, Wallet, Clock, Activity, BarChart2
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  Tooltip, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { payrollSummary, payrollRecords, monthlyPayrollTrend } from '../data/payroll';
import { detectPayrollAnomalies } from '../services/aiService';
import { departmentCoverage, todayStats } from '../data/employees';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import Badge from '../components/ui/badge/Badge';
import Button from '../components/ui/button/Button';

const COLORS = ['#465fff', '#12b76a', '#f79009', '#9e77ed', '#f04438', '#0ba5ec'];

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
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Enrolled', value: todayStats.total, icon: Users, color: 'text-brand-600 dark:text-brand-400' },
          { label: 'Avg Attendance', value: '87.2%', icon: Calendar, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Monthly Payroll', value: '₹79.6L', icon: Wallet, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Overtime (Sep)', value: '1,420h', icon: Clock, color: 'text-purple-600 dark:text-purple-400' },
        ].map(m => (
          <div key={m.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{m.label}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600 dark:bg-white/[0.04] dark:text-gray-300">
                <m.icon className="w-4 h-4" />
              </div>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold font-mono ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Primary Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Monthly Payroll Trend</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Gross vs Net salary expenditure (in ₹ Lakhs)</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPayrollTrend}>
                <defs>
                  <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#465fff" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#465fff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#12b76a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#12b76a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.75rem',
                    color: '#f9fafb',
                    fontSize: '12px',
                  }}
                  formatter={v => [`₹${(v / 100000).toFixed(1)}L`]}
                />
                <Area type="monotone" dataKey="gross" stroke="#465fff" strokeWidth={2} fill="url(#grossGrad)" name="Gross" />
                <Area type="monotone" dataKey="net" stroke="#12b76a" strokeWidth={2} fill="url(#netGrad)" name="Net" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Department Expense Allocation</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Relative salary budget split across hospital units</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptExpenseData} cx="50%" cy="50%" innerRadius={48} outerRadius={80} dataKey="amount" paddingAngle={3}>
                  {deptExpenseData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.75rem',
                    color: '#f9fafb',
                    fontSize: '12px',
                  }}
                  formatter={v => [`₹${(v / 100000).toFixed(1)}L`]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Weekly Attendance Rate</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Past 7 days physical punch fulfillment (%)</p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceTrend7}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[75, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.75rem',
                    color: '#f9fafb',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="rate" fill="#465fff" radius={[4, 4, 0, 0]} name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Leave Utilization — 6 Months</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Historical leave volume by type</p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leaveTrendData}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.75rem',
                    color: '#f9fafb',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="casual" stroke="#465fff" strokeWidth={2} dot={false} name="Casual" />
                <Line type="monotone" dataKey="sick" stroke="#12b76a" strokeWidth={2} dot={false} name="Sick" />
                <Line type="monotone" dataKey="earned" stroke="#f79009" strokeWidth={2} dot={false} name="Earned" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function PayrollPage() {
  const anomalies = detectPayrollAnomalies(payrollRecords);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">September 2026 Payroll Summary</h3>
            <Badge variant="light" color="warning" size="sm">{payrollSummary.status}</Badge>
          </div>
          <Button variant="outline" size="sm" startIcon={<Download className="w-4 h-4" />}>
            Export CSV
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            ['Active Employees', payrollSummary.totalEmployees, 'text-gray-900 dark:text-white'],
            ['Gross Total', `₹${(payrollSummary.grossPayroll / 100000).toFixed(1)}L`, 'text-brand-600 dark:text-brand-400'],
            ['Overtime Pay', `₹${(payrollSummary.overtime / 100000).toFixed(2)}L`, 'text-amber-600 dark:text-amber-400'],
            ['Total Deductions', `₹${(payrollSummary.deductions / 100000).toFixed(2)}L`, 'text-rose-600 dark:text-rose-400'],
            ['Net Disbursed', `₹${(payrollSummary.netPayroll / 100000).toFixed(1)}L`, 'text-emerald-600 dark:text-emerald-400'],
          ].map(([l, v, c]) => (
            <div key={l} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 text-center dark:border-gray-800 dark:bg-white/[0.01]">
              <p className={`text-xl font-bold font-mono ${c}`}>{v}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Anomaly Detection */}
      {anomalies.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">AI Payroll Anomaly Engine</h4>
          </div>
          <div className="space-y-2.5">
            {anomalies.map((a, i) => (
              <div
                key={i}
                className="rounded-xl border border-amber-200/80 bg-white/80 p-3 text-xs dark:border-amber-500/30 dark:bg-gray-900/60"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900 dark:text-white font-mono">{a.empId} — {a.name}</span>
                  <Badge variant="light" color={a.severity === 'High' ? 'error' : 'warning'} size="sm">
                    {a.type}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payroll Records */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Individual Employee Records</h4>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Verify Register</Button>
            <Button variant="primary" size="sm">Execute Transfer</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.02]">
                <th className="table-header">Employee</th>
                <th className="table-header">Department</th>
                <th className="table-header text-right">Basic</th>
                <th className="table-header text-right">Gross</th>
                <th className="table-header text-right">Deductions</th>
                <th className="table-header text-right">Net Pay</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {payrollRecords.map(r => (
                <tr key={r.empId} className="table-row">
                  <td className="table-cell">
                    <p className="font-semibold text-gray-900 dark:text-white text-xs">{r.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{r.empId}</p>
                  </td>
                  <td className="table-cell text-xs text-gray-600 dark:text-gray-400">{r.dept}</td>
                  <td className="table-cell text-right font-mono text-xs text-gray-700 dark:text-gray-300">
                    ₹{r.basic.toLocaleString('en-IN')}
                  </td>
                  <td className="table-cell text-right font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                    ₹{r.gross.toLocaleString('en-IN')}
                  </td>
                  <td className="table-cell text-right font-mono text-xs text-rose-600 dark:text-rose-400">
                    -₹{(r.pf + r.esi + r.pt + r.lop).toLocaleString('en-IN')}
                  </td>
                  <td className="table-cell text-right font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{r.netPay.toLocaleString('en-IN')}
                  </td>
                  <td className="table-cell">
                    <Badge variant="light" color={r.status === 'Calculated' ? 'info' : 'warning'} size="sm">
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ShiftsPage() {
  const shifts = [
    { code: 'SHIFT-A', name: 'Morning Shift', start: '07:00', end: '14:00', duration: '7h', employees: 112, color: 'text-amber-600 dark:text-amber-400', bar: 'bg-amber-500' },
    { code: 'SHIFT-B', name: 'Evening Shift', start: '13:00', end: '20:00', duration: '7h', employees: 98, color: 'text-brand-600 dark:text-brand-400', bar: 'bg-brand-500' },
    { code: 'SHIFT-C', name: 'Night Shift', start: '19:00', end: '08:00+1', duration: '13h', employees: 86, color: 'text-purple-600 dark:text-purple-400', bar: 'bg-purple-500' },
    { code: 'GENERAL', name: 'General Shift', start: '09:00', end: '17:30', duration: '8.5h', employees: 30, color: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500' },
  ];

  const roster = [
    { emp: 'Nurse 001', dept: 'Nursing', d1: 'A', d2: 'A', d3: 'B', d4: 'B', d5: 'C', d6: 'C', d7: 'OFF' },
    { emp: 'Nurse 002', dept: 'Nursing', d1: 'B', d2: 'B', d3: 'C', d4: 'C', d5: 'A', d6: 'A', d7: 'OFF' },
    { emp: 'ICU Nurse 001', dept: 'ICU', d1: 'C', d2: 'C', d3: 'A', d4: 'A', d5: 'B', d6: 'B', d7: 'OFF' },
    { emp: 'Security 001', dept: 'Security', d1: 'C', d2: 'C', d3: 'C', d4: 'C', d5: 'C', d6: 'C', d7: 'C' },
    { emp: 'Reception 001', dept: 'Reception', d1: 'G', d2: 'G', d3: 'G', d4: 'G', d5: 'G', d6: 'G', d7: 'OFF' },
  ];

  const days = ['Sep 20', 'Sep 21', 'Sep 22', 'Sep 23', 'Sep 24', 'Sep 25', 'Sep 26'];
  const shiftColors = {
    A: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20',
    B: 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400 border border-brand-200 dark:border-brand-500/20',
    C: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20',
    G: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
    OFF: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {shifts.map(s => (
          <div key={s.code} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2.5 h-2.5 rounded-full ${s.bar}`} />
              <p className="text-xs font-bold text-gray-900 dark:text-white">{s.name}</p>
            </div>
            <p className={`font-mono text-xs font-semibold ${s.color}`}>{s.start} → {s.end}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.employees} staff rostered</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Sample Roster Distribution — Sep 20–26</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.02]">
                <th className="table-header">Employee</th>
                <th className="table-header">Dept</th>
                {days.map(d => <th key={d} className="table-header text-center">{d}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {roster.map((r, i) => (
                <tr key={i} className="table-row">
                  <td className="table-cell font-semibold text-gray-900 dark:text-white text-xs">{r.emp}</td>
                  <td className="table-cell text-xs text-gray-600 dark:text-gray-400">{r.dept}</td>
                  {['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'].map(d => (
                    <td key={d} className="table-cell text-center">
                      <span className={`inline-block font-mono text-[11px] font-bold px-2 py-0.5 rounded ${shiftColors[r[d]]}`}>
                        {r[d]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const PAGE_TABS = ['Hospital Analytics', 'Payroll', 'Shifts'];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('Hospital Analytics');

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        pageTitle="Operational Analytics & Statistical Reports"
        breadcrumbs={[
          { label: 'Workforce', path: '/employees' },
          { label: 'Analytics' }
        ]}
      />

      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-100 p-1.5 dark:border-gray-800 dark:bg-gray-900/60 w-fit">
        {PAGE_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-white text-brand-600 shadow-xs dark:bg-brand-500 dark:text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
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
