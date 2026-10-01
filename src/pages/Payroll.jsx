import { useState } from 'react';
import { Wallet, Users, Download, Sparkles, CheckCircle, AlertTriangle, Eye, Printer, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { employees } from '../data/employees';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import Badge from '../components/ui/badge/Badge';
import Button from '../components/ui/button/Button';

const SALARY_STRUCTURES = [
  { grade: 'Senior Doctor', basic: 85000, hra: 25500, da: 8500, allowances: 12000, gross: 131000, pf: 10200, esi: 0, net: 120800, staff: 6 },
  { grade: 'Junior Doctor / MO', basic: 55000, hra: 16500, da: 5500, allowances: 8000, gross: 85000, pf: 6600, esi: 0, net: 78400, staff: 8 },
  { grade: 'Senior Nurse / Matron', basic: 32000, hra: 9600, da: 3200, allowances: 5000, gross: 49800, pf: 3840, esi: 0, net: 45960, staff: 14 },
  { grade: 'Staff Nurse', basic: 22000, hra: 6600, da: 2200, allowances: 3500, gross: 34300, pf: 2640, esi: 693, net: 30967, staff: 32 },
  { grade: 'Lab Technician', basic: 18000, hra: 5400, da: 1800, allowances: 2500, gross: 27700, pf: 2160, esi: 567, net: 24973, staff: 8 },
  { grade: 'Receptionist / Admin', basic: 15000, hra: 4500, da: 1500, allowances: 2000, gross: 23000, pf: 1800, esi: 473, net: 20727, staff: 12 },
  { grade: 'Security Staff', basic: 12000, hra: 3600, da: 1200, allowances: 1500, gross: 18300, pf: 1440, esi: 378, net: 16482, staff: 10 },
  { grade: 'Housekeeping Services', basic: 9500, hra: 2850, da: 950, allowances: 1000, gross: 14300, pf: 1140, esi: 297, net: 12863, staff: 20 },
];

const PAYROLL_MONTHS = ['Aug 2026', 'Jul 2026', 'Jun 2026', 'May 2026', 'Apr 2026'];

const TREND_DATA = [
  { month: 'Apr', gross: 38.2, net: 34.1 },
  { month: 'May', gross: 38.8, net: 34.5 },
  { month: 'Jun', gross: 39.1, net: 34.9 },
  { month: 'Jul', gross: 39.4, net: 35.1 },
  { month: 'Aug', gross: 39.8, net: 35.5 },
  { month: 'Sep', gross: 40.2, net: 35.9 },
];

function PayslipModal({ emp, onClose }) {
  const struct = SALARY_STRUCTURES[2];
  const handlePrint = () => {
    toast.success('Payslip queued for printing');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-glass max-w-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Confidential Payslip</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">Month: September 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" startIcon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
              Print
            </Button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Employee Summary Card */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 text-xs dark:border-gray-800 dark:bg-white/[0.02]">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Employee</span>
            <p className="font-semibold text-gray-900 dark:text-white">{emp?.name || 'Dr. Ravi Shankar'}</p>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Staff ID</span>
            <p className="font-mono text-gray-700 dark:text-gray-300">{emp?.id || 'KD-EMP-0001'}</p>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Department</span>
            <p className="text-gray-700 dark:text-gray-300">{emp?.department || 'ICU'}</p>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Designation</span>
            <p className="text-gray-700 dark:text-gray-300">{emp?.designation || 'Senior Doctor'}</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="rounded-xl border border-gray-200 p-3.5 dark:border-gray-800">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2.5">
              Gross Earnings
            </p>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Basic Salary', amt: struct.basic },
                { label: 'House Rent Allowance (HRA)', amt: struct.hra },
                { label: 'Dearness Allowance (DA)', amt: struct.da },
                { label: 'Special Medical Allowance', amt: struct.allowances },
              ].map(({ label, amt }) => (
                <div key={label} className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">{label}</span>
                  <span className="font-mono font-medium text-gray-900 dark:text-white">₹{amt.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1.5 font-bold">
                <span className="text-gray-900 dark:text-white">Gross Amount</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">₹{struct.gross.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-3.5 dark:border-gray-800">
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2.5">
              Statutory Deductions
            </p>
            <div className="space-y-2 text-xs">
              {[
                { label: "Provident Fund (PF)", amt: struct.pf },
                { label: 'Employee State Insurance (ESI)', amt: struct.esi },
                { label: 'Professional Tax (PT)', amt: 200 },
                { label: 'Income Tax (TDS)', amt: 0 },
              ].map(({ label, amt }) => (
                <div key={label} className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">{label}</span>
                  <span className="font-mono font-medium text-rose-600 dark:text-rose-400">
                    {amt > 0 ? `- ₹${amt.toLocaleString('en-IN')}` : 'Nil'}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-1.5 font-bold">
                <span className="text-gray-900 dark:text-white">Total Deductions</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">
                  - ₹{(struct.pf + struct.esi + 200).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Take Home */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50/60 p-4 dark:border-brand-500/20 dark:bg-brand-500/10">
          <div>
            <p className="text-xs font-semibold text-brand-700 dark:text-brand-300 uppercase">Net Salary Credited</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Via Bank NEFT / Direct Deposit</p>
          </div>
          <p className="font-mono text-2xl font-bold text-brand-600 dark:text-brand-400">
            ₹{struct.net.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex gap-3 mt-5">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            startIcon={<Download className="w-4 h-4" />}
            onClick={() => { toast.success('Payslip downloaded as PDF'); onClose(); }}
          >
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Payroll() {
  const [activeTab, setActiveTab]         = useState('structure');
  const [showPayslip, setShowPayslip]     = useState(false);
  const [selectedEmp, setSelectedEmp]     = useState(null);
  const [processing, setProcessing]       = useState(false);
  const [processed, setProcessed]         = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Sep 2026');

  const totalGross = SALARY_STRUCTURES.reduce((sum, s) => sum + s.gross * s.staff, 0);
  const totalNet = SALARY_STRUCTURES.reduce((sum, s) => sum + s.net * s.staff, 0);
  const totalStaff = SALARY_STRUCTURES.reduce((sum, s) => sum + s.staff, 0);

  const handleProcess = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1600));
    setProcessed(true);
    setProcessing(false);
    toast.success(`${selectedMonth} payroll processed successfully for ${totalStaff} employees!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb
          pageTitle="Payroll & Statutory Compensation"
          breadcrumbs={[
            { label: 'Workforce', path: '/employees' },
            { label: 'Payroll' }
          ]}
        />
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="input-field text-xs py-1.5 w-auto"
          >
            <option value="Sep 2026">September 2026</option>
            {PAYROLL_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Gross Payroll', value: `₹${(totalGross / 100000).toFixed(1)}L`, color: 'text-brand-600 dark:text-brand-400' },
          { label: 'Net Disbursement', value: `₹${(totalNet / 100000).toFixed(1)}L`, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Statutory Deductions', value: `₹${((totalGross - totalNet) / 100000).toFixed(1)}L`, color: 'text-rose-600 dark:text-rose-400' },
          { label: 'Active Roster Staff', value: totalStaff, color: 'text-amber-600 dark:text-amber-400' },
        ].map(item => (
          <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              {item.label}
            </p>
            <p className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-100 p-1.5 dark:border-gray-800 dark:bg-gray-900/60 w-fit">
        {[
          { id: 'structure', label: 'Salary Structure' },
          { id: 'process', label: 'Batch Processing' },
          { id: 'payslips', label: 'Employee Payslips' },
          { id: 'trends', label: 'Historical Trends' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-brand-600 shadow-xs dark:bg-brand-500 dark:text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SALARY STRUCTURE */}
      {activeTab === 'structure' && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.02]">
                  {['Grade / Designation', 'Staff', 'Basic', 'HRA', 'DA', 'Allowances', 'Gross', 'PF', 'ESI', 'Net Pay'].map(h => (
                    <th key={h} className={`table-header ${h === 'Grade / Designation' ? 'text-left' : 'text-right'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {SALARY_STRUCTURES.map(s => (
                  <tr key={s.grade} className="table-row">
                    <td className="table-cell font-semibold text-gray-900 dark:text-white text-xs">{s.grade}</td>
                    <td className="table-cell text-right font-mono text-xs font-semibold text-brand-600 dark:text-brand-400">{s.staff}</td>
                    {[s.basic, s.hra, s.da, s.allowances, s.gross, s.pf, s.esi, s.net].map((val, i) => (
                      <td key={i} className="table-cell text-right font-mono text-xs">
                        <span className={
                          i === 7 ? 'font-bold text-emerald-600 dark:text-emerald-400' :
                          i >= 5 ? 'text-rose-600 dark:text-rose-400' :
                          i === 4 ? 'font-semibold text-amber-600 dark:text-amber-400' :
                          'text-gray-600 dark:text-gray-300'
                        }>
                          {val > 0 ? `₹${val.toLocaleString('en-IN')}` : '—'}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200 bg-gray-50/60 font-bold dark:border-gray-800 dark:bg-white/[0.02]">
                  <td className="table-cell text-gray-900 dark:text-white">Hospital Total</td>
                  <td className="table-cell text-right font-mono text-brand-600 dark:text-brand-400">{totalStaff}</td>
                  <td colSpan={4} className="table-cell" />
                  <td className="table-cell text-right font-mono text-amber-600 dark:text-amber-400 font-bold">
                    ₹{(totalGross / 100000).toFixed(2)}L
                  </td>
                  <td colSpan={2} className="table-cell" />
                  <td className="table-cell text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    ₹{(totalNet / 100000).toFixed(2)}L
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* PROCESS PAYROLL */}
      {activeTab === 'process' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Process {selectedMonth} Payroll</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Comprehensive automated validation checks</p>

            <div className="space-y-3 mb-6">
              {[
                { label: 'Biometric muster & attendance locked', done: true },
                { label: 'Leave deductions & loss of pay (LOP) computed', done: true },
                { label: 'Overtime & emergency OT verified by supervisors', done: true },
                { label: 'Statutory compliance (PF & ESI) verified against salary caps', done: true },
                { label: 'AI salary anomaly scan executed', done: !processed, ai: true },
                { label: 'Bank disbursement NEFT batch ready', done: processed },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-xs transition-all ${
                    item.done
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
                      : 'border-gray-200 bg-gray-50/50 text-gray-500 dark:border-gray-800 dark:bg-white/[0.01] dark:text-gray-400'
                  }`}
                >
                  <CheckCircle className={`w-4 h-4 flex-shrink-0 ${item.done ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-300 dark:text-gray-600'}`} />
                  <span className="font-medium flex-1">{item.label}</span>
                  {item.ai && <Sparkles className="w-3.5 h-3.5 text-brand-500" />}
                </div>
              ))}
            </div>

            <Button
              variant={processed ? "success" : "primary"}
              className="w-full justify-center py-3"
              disabled={processing || processed}
              onClick={handleProcess}
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing Roster Deductions...
                </span>
              ) : processed ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Payroll Finalized for {selectedMonth}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Execute {selectedMonth} Payroll Batch
                </span>
              )}
            </Button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">AI Payroll Anomaly Warnings</h3>
            </div>
            <div className="space-y-3">
              {[
                { type: 'Overtime Spike', emp: 'Nurse Kavitha Nair · ICU', detail: 'OT hours 340% above baseline this month', color: 'error', sev: 'Requires Review' },
                { type: 'Duplicate Disbursement', emp: 'KD-EMP-0034 · Admin', detail: 'Two salary disbursement requests detected for same period', color: 'error', sev: 'Disbursement Blocked' },
                { type: 'Grade Mismatch', emp: 'Kumar Swamy · ICU', detail: 'Salary grade does not match verified designation in HRMS', color: 'warning', sev: 'Audit Warning' },
              ].map((anomaly, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-white/[0.02]"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{anomaly.type}</span>
                    <Badge variant="light" color={anomaly.color} size="sm">{anomaly.sev}</Badge>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{anomaly.emp}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{anomaly.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAYSLIPS TABLE */}
      {activeTab === 'payslips' && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.02]">
                  {['Employee', 'Department', 'Designation', 'Gross Pay', 'Deductions', 'Net Disbursed', 'Payslip'].map(h => (
                    <th key={h} className={`table-header ${h === 'Payslip' ? 'text-center' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {employees.slice(0, 15).map((emp, i) => {
                  const struct = SALARY_STRUCTURES[i % SALARY_STRUCTURES.length];
                  return (
                    <tr key={emp.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600 font-bold text-xs dark:bg-brand-500/10 dark:text-brand-400 flex-shrink-0">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-xs">{emp.name}</p>
                            <p className="font-mono text-[10px] text-gray-500 dark:text-gray-400">{emp.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell text-xs text-gray-600 dark:text-gray-400">{emp.department}</td>
                      <td className="table-cell text-xs text-gray-600 dark:text-gray-400">{emp.designation}</td>
                      <td className="table-cell font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
                        ₹{struct.gross.toLocaleString('en-IN')}
                      </td>
                      <td className="table-cell font-mono text-xs text-rose-600 dark:text-rose-400">
                        ₹{(struct.pf + struct.esi + 200).toLocaleString('en-IN')}
                      </td>
                      <td className="table-cell font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        ₹{struct.net.toLocaleString('en-IN')}
                      </td>
                      <td className="table-cell text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-2 py-1"
                          onClick={() => { setSelectedEmp(emp); setShowPayslip(true); }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TRENDS */}
      {activeTab === 'trends' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">6-Month Disbursement Trajectory</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Gross vs Net salary expenditure (₹ in Lakhs)</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_DATA}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.75rem',
                    color: '#f9fafb',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="gross" stroke="#465fff" strokeWidth={2.5} dot={{ fill: '#465fff', r: 4 }} name="Gross Expenditure" />
                <Line type="monotone" dataKey="net" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} name="Net Take Home" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {showPayslip && <PayslipModal emp={selectedEmp} onClose={() => setShowPayslip(false)} />}
    </div>
  );
}
