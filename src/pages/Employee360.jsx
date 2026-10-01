import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Sparkles, User, Calendar, Clock, Wallet, Activity,
  Briefcase, TrendingUp, AlertCircle, Phone, Mail, MapPin, CheckCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { employees } from '../data/employees';
import { generateEmployeeSummary } from '../services/aiService';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import Badge from '../components/ui/badge/Badge';
import Button from '../components/ui/button/Button';

const TABS = ['Profile', 'Attendance', 'Leave', 'Shift', 'Payroll', 'AI Insights'];

const attendanceMonthData = [
  { week: 'W1', present: 6, absent: 0, leave: 0 },
  { week: 'W2', present: 5, absent: 1, leave: 0 },
  { week: 'W3', present: 6, absent: 0, leave: 0 },
  { week: 'W4', present: 5, absent: 0, leave: 1 },
];

const shiftData = [
  { name: 'Morning', value: 12, color: '#f59e0b' },
  { name: 'Evening', value: 5, color: '#0ea5e9' },
  { name: 'Night', value: 3, color: '#8b5cf6' },
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
  }, [activeTab, employee, aiSummary]);

  const gross = employee.basic + employee.hra + employee.allowance;
  const pf = Math.round(employee.basic * 0.075);
  const esi = employee.basic <= 21000 ? Math.round(gross * 0.02) : 0;
  const net = gross - pf - esi - 200;

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb
          pageTitle="Employee 360°"
          breadcrumbs={[
            { label: 'Workforce', path: '/employees' },
            { label: employee.name }
          ]}
        />
        <Button
          variant="outline"
          size="sm"
          startIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/employees')}
        >
          Back to Directory
        </Button>
      </div>

      {/* Hero Profile Overview Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-2xl font-bold text-white shadow-theme-xs">
              {employee.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  {employee.name}
                </h1>
                <Badge variant="light" color="primary" size="sm" startIcon={<Sparkles className="w-3 h-3" />}>
                  AI Monitored
                </Badge>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-mono text-gray-700 dark:text-gray-300 font-semibold">{employee.id}</span> · {employee.designation} · {employee.department}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="light" color={employee.status === 'Active' ? 'success' : 'warning'}>
                  {employee.status}
                </Badge>
                <Badge variant="light" color="light">
                  {employee.employmentType}
                </Badge>
                <Badge
                  variant="light"
                  color={
                    employee.shift === 'Morning' ? 'warning' :
                    employee.shift === 'Evening' ? 'info' :
                    employee.shift === 'Night' ? 'purple' : 'success'
                  }
                >
                  {employee.shift} Shift
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 text-center dark:border-gray-800 dark:bg-white/[0.02]">
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {employee.attendancePercent}%
              </p>
              <p className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">Attendance</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 text-center dark:border-gray-800 dark:bg-white/[0.02]">
              <p className="text-xl font-bold text-brand-600 dark:text-brand-400 font-mono">
                {12 - (employee.leaveUsed || 0)}d
              </p>
              <p className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">Leaves Left</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 text-center dark:border-gray-800 dark:bg-white/[0.02]">
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                {employee.overtimeHours}h
              </p>
              <p className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">Overtime</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 text-center dark:border-gray-800 dark:bg-white/[0.02]">
              <p className="text-xl font-bold text-rose-600 dark:text-rose-400 font-mono">
                {employee.lateCount}
              </p>
              <p className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">Late Incidents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-100 p-1.5 dark:border-gray-800 dark:bg-gray-900/60 w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-white text-brand-600 shadow-xs dark:bg-brand-500 dark:text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            {tab === 'AI Insights' && <Sparkles className="w-3.5 h-3.5 text-brand-500 dark:text-brand-300" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Profile' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Personal Information</h2>
            </div>
            <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { label: 'Full Legal Name', value: employee.name },
                { label: 'Blood Group', value: employee.bloodGroup },
                { label: 'Gender', value: employee.gender },
                { label: 'Phone Contact', value: employee.phone },
                { label: 'Official Email', value: employee.email },
                { label: 'Residential Address', value: employee.address },
                { label: 'Emergency Contact', value: employee.emergencyContact },
              ].map(f => (
                <div key={f.label} className="flex items-center justify-between py-3 text-xs sm:text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{f.label}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200 text-right max-w-[65%]">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Employment Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Hospital Placement & Roster</h2>
            </div>
            <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { label: 'Staff ID', value: employee.id, mono: true },
                { label: 'Assigned Department', value: employee.department },
                { label: 'Clinical Role', value: employee.designation },
                { label: 'Employment Status', value: employee.employmentType },
                { label: 'Date of Joining', value: employee.joiningDate },
                { label: 'Current Roster Shift', value: `${employee.shift} (${employee.shiftCode})` },
                { label: 'Provident Fund (PF)', value: employee.pfNumber, mono: true },
                { label: 'ESI Insurance No.', value: employee.esiNumber, mono: true },
              ].map(f => (
                <div key={f.label} className="flex items-center justify-between py-3 text-xs sm:text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{f.label}</span>
                  <span className={`font-medium text-gray-800 dark:text-gray-200 text-right ${f.mono ? 'font-mono' : ''}`}>
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Attendance' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Summary & Recharts */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">September 2026 — Attendance Summary</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Weekly breakdown of presence, leave, and absence</p>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Present', value: employee.present, color: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'Absent', value: employee.absent, color: 'text-rose-600 dark:text-rose-400' },
                { label: 'Leave', value: employee.leaveUsed, color: 'text-amber-600 dark:text-amber-400' },
                { label: 'Late', value: employee.lateCount, color: 'text-orange-600 dark:text-orange-400' },
                { label: 'Weekly Off', value: 4, color: 'text-gray-600 dark:text-gray-400' },
                { label: 'Holiday', value: 2, color: 'text-brand-600 dark:text-brand-400' },
              ].map(m => (
                <div key={m.label} className="rounded-xl border border-gray-200 bg-gray-50/60 p-3 text-center dark:border-gray-800 dark:bg-white/[0.02]">
                  <p className={`text-lg font-bold font-mono ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceMonthData}>
                  <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
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
                  <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} name="Present" />
                  <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent" />
                  <Bar dataKey="leave" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Leave" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Log Table */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Detailed Shift Activity Log</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {Array.from({ length: 20 }, (_, i) => {
                const day = i + 1;
                const date = new Date(2026, 8, day);
                const isWeekend = date.getDay() === 0;
                const status = isWeekend ? 'Weekly Off' : (day === 14 ? 'Holiday' : (day === 2 || day === 19 ? 'Leave' : (day === 8 ? 'Late' : 'Present')));
                const checkIn = status === 'Present' ? '07:04' : status === 'Late' ? '07:42' : null;
                const checkOut = checkIn ? '14:08' : null;
                return (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 text-xs">
                    <span className="font-mono text-gray-500 dark:text-gray-400 w-16">Sep {String(day).padStart(2, '0')}</span>
                    <Badge
                      variant="light"
                      color={
                        status === 'Present' ? 'success' :
                        status === 'Late' ? 'warning' :
                        status === 'Leave' ? 'purple' :
                        status === 'Holiday' ? 'info' : 'light'
                      }
                      size="sm"
                    >
                      {status}
                    </Badge>
                    <span className="font-mono text-gray-600 dark:text-gray-300">
                      {checkIn ? `${checkIn} → ${checkOut}` : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Leave' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Balances */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Annual Leave Quota Balance</h2>
            <div className="space-y-4">
              {[
                { type: 'Casual Leave (CL)', used: employee.leaveUsed, total: 12, color: 'bg-brand-500' },
                { type: 'Sick Leave (SL)', used: 2, total: 12, color: 'bg-rose-500' },
                { type: 'Earned Leave (EL)', used: 5, total: 15, color: 'bg-emerald-500' },
                { type: 'Emergency / Duty Leave', used: 0, total: 3, color: 'bg-amber-500' },
              ].map(l => (
                <div key={l.type} className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 dark:border-gray-800 dark:bg-white/[0.02]">
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-gray-700 dark:text-gray-200">{l.type}</span>
                    <span className="font-mono text-gray-500 dark:text-gray-400">
                      {l.used} used / {l.total - l.used} available
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${l.color}`}
                      style={{ width: `${(l.used / l.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Leave Application Audit Trail</h2>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { date: '20 Sep', type: 'Casual Leave', status: 'Approved', days: 1 },
                { date: '02 Sep', type: 'Sick Leave', status: 'Approved', days: 2 },
                { date: '10 Aug', type: 'Casual Leave', status: 'Rejected', days: 2 },
                { date: '15 Jul', type: 'Earned Leave', status: 'Approved', days: 3 },
              ].map((l, i) => (
                <div key={i} className="flex items-center justify-between py-3 text-xs sm:text-sm">
                  <span className="font-mono text-gray-500 dark:text-gray-400">{l.date}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{l.type}</span>
                  <span className="font-mono text-gray-500 dark:text-gray-400">{l.days} day(s)</span>
                  <Badge variant="light" color={l.status === 'Approved' ? 'success' : 'error'} size="sm">
                    {l.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Shift' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Shift Distribution */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Shift Distribution — September</h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shiftData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={4}
                  >
                    {shiftData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.75rem',
                      color: '#f9fafb',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 justify-center mt-3">
              {shiftData.map(s => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  {s.name}: <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Shifts */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Assigned Shift Schedule</h2>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {[14, 15, 16, 17, 18, 19, 20].map(d => {
                const shift = d <= 17 ? 'Morning' : d === 18 ? 'Evening' : d === 19 ? 'Night' : 'Morning';
                const time = shift === 'Morning' ? '07:00–14:00' : shift === 'Evening' ? '13:00–20:00' : '19:00–08:00';
                return (
                  <div key={d} className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
                    <span className="font-mono text-gray-500 dark:text-gray-400">Sep {d}</span>
                    <Badge
                      variant="light"
                      color={shift === 'Morning' ? 'warning' : shift === 'Evening' ? 'info' : 'purple'}
                      size="sm"
                    >
                      {shift}
                    </Badge>
                    <span className="font-mono text-gray-600 dark:text-gray-400">{time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Payroll' && (
        <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">September 2026 Payroll Statement</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Calculated payslip conforming to Indian statutory deductions</p>
          </div>

          <div className="space-y-4">
            {/* Earnings */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3">Gross Earnings</p>
              {[
                ['Basic Salary', employee.basic],
                ['House Rent Allowance (HRA)', employee.hra],
                ['Special Allowance', employee.allowance],
                ['Overtime Pay', Math.round(employee.overtimeHours * 200)],
              ].map(([label, amount]) => (
                <div key={label} className="flex justify-between py-1.5 text-xs sm:text-sm border-b border-gray-200/60 dark:border-gray-700/60">
                  <span className="text-gray-600 dark:text-gray-400">{label}</span>
                  <span className="font-mono font-medium text-gray-900 dark:text-gray-100">₹{amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2.5 text-sm font-bold">
                <span className="text-gray-900 dark:text-white">Gross Total</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{(gross + Math.round(employee.overtimeHours * 200)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Deductions */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-3">Statutory Deductions</p>
              {[
                ['Employee PF Contribution', pf],
                ['ESI Medical Contribution', esi],
                ['Professional Tax', 200],
              ].map(([label, amount]) => (
                <div key={label} className="flex justify-between py-1.5 text-xs sm:text-sm border-b border-gray-200/60 dark:border-gray-700/60">
                  <span className="text-gray-600 dark:text-gray-400">{label}</span>
                  <span className="font-mono font-medium text-rose-600 dark:text-rose-400">- ₹{amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Net Total */}
            <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4 dark:border-brand-500/20 dark:bg-brand-500/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-brand-700 dark:text-brand-300 uppercase">Net Disbursable Salary</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Direct NEFT to registered account</p>
              </div>
              <p className="text-2xl font-bold font-mono text-brand-600 dark:text-brand-400">
                ₹{(net + Math.round(employee.overtimeHours * 200)).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'AI Insights' && (
        <div className="space-y-6">
          {/* AI Workforce Summary */}
          <div className="rounded-2xl border border-brand-200 bg-brand-50/40 p-6 shadow-xs dark:border-brand-500/20 dark:bg-brand-500/[0.05]">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-theme-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">AI Workforce Summary & Recommendations</h3>
                <p className="text-xs text-brand-600 dark:text-brand-400">Gemini Telemetry Synthesis · September 2026</p>
              </div>
            </div>

            {aiLoading ? (
              <div className="flex items-center gap-3 py-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                Synthesizing multi-modal telemetry and roster records...
              </div>
            ) : (
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {aiSummary.split('\n').map((line, i) => {
                  const parts = line.split(/(\*\*.*?\*\*)/g);
                  return (
                    <p key={i}>
                      {parts.map((part, j) =>
                        part.startsWith('**') && part.endsWith('**') ? (
                          <strong key={j} className="font-semibold text-gray-900 dark:text-white">
                            {part.replace(/\*\*/g, '')}
                          </strong>
                        ) : (
                          part
                        )
                      )}
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          {/* Workplace Events */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2.5 mb-4">
              <Activity className="w-5 h-5 text-brand-500" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Workplace Telemetry Events — Sep 20</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto hidden sm:inline">
                AI observed · Supervisor review required
              </span>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {operationalEvents.map((ev, i) => (
                <div key={i} className="flex items-center gap-4 py-3 text-xs sm:text-sm">
                  <span className="font-mono text-gray-500 dark:text-gray-400 w-14">{ev.time}</span>
                  <div className="h-2 w-2 rounded-full bg-brand-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{ev.zone}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{ev.event} · {ev.cam}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 italic">
              Hospital compliance notice: Telemetry is advisory and not utilized for unconfirmed punitive measures.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
