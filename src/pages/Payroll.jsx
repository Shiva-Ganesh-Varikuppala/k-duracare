import { useState } from 'react';
import { Wallet, Users, Download, Sparkles, CheckCircle, AlertTriangle, Eye, FileText, Printer } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { employees } from '../data/employees';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';

const SALARY_STRUCTURES = [
  { grade: 'Senior Doctor', basic: 85000, hra: 25500, da: 8500, allowances: 12000, gross: 131000, pf: 10200, esi: 0, net: 120800, staff: 6 },
  { grade: 'Junior Doctor / MO', basic: 55000, hra: 16500, da: 5500, allowances: 8000, gross: 85000, pf: 6600, esi: 0, net: 78400, staff: 8 },
  { grade: 'Senior Nurse / Matron', basic: 32000, hra: 9600, da: 3200, allowances: 5000, gross: 49800, pf: 3840, esi: 0, net: 45960, staff: 14 },
  { grade: 'Staff Nurse', basic: 22000, hra: 6600, da: 2200, allowances: 3500, gross: 34300, pf: 2640, esi: 693, net: 30967, staff: 32 },
  { grade: 'Lab Technician', basic: 18000, hra: 5400, da: 1800, allowances: 2500, gross: 27700, pf: 2160, esi: 567, net: 24973, staff: 8 },
  { grade: 'Receptionist / Admin', basic: 15000, hra: 4500, da: 1500, allowances: 2000, gross: 23000, pf: 1800, esi: 473, net: 20727, staff: 12 },
  { grade: 'Security', basic: 12000, hra: 3600, da: 1200, allowances: 1500, gross: 18300, pf: 1440, esi: 378, net: 16482, staff: 10 },
  { grade: 'Housekeeping', basic: 9500, hra: 2850, da: 950, allowances: 1000, gross: 14300, pf: 1140, esi: 297, net: 12863, staff: 20 },
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
          {p.name}: <span style={{ color: '#fff' }}>₹{p.value}L</span>
        </p>
      ))}
    </div>
  );
};

function PayslipModal({ emp, onClose }) {
  const struct = SALARY_STRUCTURES[2]; // mock
  const handlePrint = () => {
    toast.success('Payslip sent to printer');
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-glass" style={{ width: '100%', maxWidth: 580, padding: '28px 32px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 20, marginBottom: 20 }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Payslip — September 2026</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Kanakadurga Nursing Home</p>
            </div>
            <button className="btn-secondary" style={{ fontSize: 12 }} onClick={handlePrint}>
              <Printer style={{ width: 13, height: 13 }} /> Print
            </button>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'Employee', value: emp?.name || 'Dr. Ravi Shankar' },
              { label: 'Employee ID', value: emp?.id || 'KD-EMP-0001' },
              { label: 'Department', value: emp?.department || 'ICU' },
              { label: 'Designation', value: emp?.designation || 'Senior Doctor' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings & Deductions */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Earnings</p>
            {[
              { label: 'Basic Salary', amt: struct.basic },
              { label: 'HRA', amt: struct.hra },
              { label: 'Dearness Allowance', amt: struct.da },
              { label: 'Other Allowances', amt: struct.allowances },
            ].map(({ label, amt }) => (
              <div key={label} className="flex justify-between" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', fontFamily: "'JetBrains Mono', monospace" }}>₹{amt.toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8, marginTop: 8 }} className="flex justify-between">
              <span style={{ fontSize: 12, fontWeight: 700, color: '#34D399' }}>Gross Salary</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#34D399', fontFamily: "'JetBrains Mono', monospace" }}>₹{struct.gross.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#F87171', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Deductions</p>
            {[
              { label: "PF (12%)", amt: struct.pf },
              { label: 'ESI', amt: struct.esi },
              { label: 'Professional Tax', amt: 200 },
              { label: 'TDS', amt: 0 },
            ].map(({ label, amt }) => (
              <div key={label} className="flex justify-between" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: amt > 0 ? '#F87171' : 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {amt > 0 ? `₹${amt.toLocaleString('en-IN')}` : 'Nil'}
                </span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8, marginTop: 8 }} className="flex justify-between">
              <span style={{ fontSize: 12, fontWeight: 700, color: '#F87171' }}>Total Deductions</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#F87171', fontFamily: "'JetBrains Mono', monospace" }}>₹{(struct.pf + struct.esi + 200).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Net */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(99,102,241,0.1))',
          border: '1px solid rgba(14,165,233,0.2)',
          borderRadius: 16, padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Net Pay (Take Home)</p>
          <p style={{ fontSize: 26, fontWeight: 900, color: '#38BDF8', fontFamily: "'JetBrains Mono', monospace" }}>
            ₹{struct.net.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex gap-3 mt-5">
          <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }} onClick={onClose}>Close</button>
          <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }} onClick={() => { toast.success('Payslip downloaded as PDF'); onClose(); }}>
            <Download style={{ width: 13, height: 13 }} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Payroll() {
  const [activeTab, setActiveTab] = useState('structure');
  const [showPayslip, setShowPayslip] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Sep 2026');

  const totalGross = SALARY_STRUCTURES.reduce((sum, s) => sum + s.gross * s.staff, 0);
  const totalNet = SALARY_STRUCTURES.reduce((sum, s) => sum + s.net * s.staff, 0);
  const totalStaff = SALARY_STRUCTURES.reduce((sum, s) => sum + s.staff, 0);

  const handleProcess = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setProcessed(true);
    setProcessing(false);
    toast.success(`${selectedMonth} payroll processed successfully for ${totalStaff} employees!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>
            Payroll Management
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            AI-powered payroll processing with anomaly detection · {selectedMonth}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="input-field" style={{ width: 'auto', fontSize: 13 }}>
            <option value="Sep 2026">September 2026</option>
            {PAYROLL_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Gross Payroll', value: `₹${(totalGross / 100000).toFixed(1)}L`, color: '#38BDF8' },
          { label: 'Net Disbursement', value: `₹${(totalNet / 100000).toFixed(1)}L`, color: '#34D399' },
          { label: 'Total Deductions', value: `₹${((totalGross - totalNet) / 100000).toFixed(1)}L`, color: '#F87171' },
          { label: 'Employees', value: totalStaff, color: '#FBBF24' },
        ].map(item => (
          <div key={item.label} className="glass-card" style={{ padding: '18px 20px' }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{item.label}</p>
            <p style={{ fontSize: 26, fontWeight: 900, color: item.color, letterSpacing: '-0.04em', fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {[
          { id: 'structure', label: 'Salary Structure' },
          { id: 'process', label: 'Process Payroll' },
          { id: 'payslips', label: 'Payslips' },
          { id: 'trends', label: 'Trends' },
        ].map(tab => (
          <button key={tab.id} className={activeTab === tab.id ? 'tab-active' : 'tab-item'} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* SALARY STRUCTURE */}
      {activeTab === 'structure' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['Grade / Designation', 'Staff', 'Basic', 'HRA', 'DA', 'Allowances', 'Gross', 'PF', 'ESI', 'Net Pay'].map(h => (
                    <th key={h} className="table-header" style={{ textAlign: h === 'Grade / Designation' ? 'left' : 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SALARY_STRUCTURES.map(s => (
                  <tr key={s.grade} className="table-row">
                    <td className="table-cell">
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{s.grade}</span>
                    </td>
                    <td className="table-cell" style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 12, color: '#38BDF8', fontWeight: 600 }}>{s.staff}</span>
                    </td>
                    {[s.basic, s.hra, s.da, s.allowances, s.gross, s.pf, s.esi, s.net].map((val, i) => (
                      <td key={i} className="table-cell" style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace" }}>
                        <span style={{
                          fontSize: 12,
                          color: i === 7 ? '#34D399' : i >= 5 ? '#F87171' : i === 4 ? '#FBBF24' : 'rgba(255,255,255,0.65)',
                          fontWeight: (i === 4 || i === 7) ? 700 : 400,
                        }}>
                          {val > 0 ? `₹${val.toLocaleString('en-IN')}` : '—'}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <td className="table-cell" style={{ fontWeight: 700, color: '#fff' }}>Total</td>
                  <td className="table-cell" style={{ textAlign: 'right', fontWeight: 700, color: '#38BDF8' }}>{totalStaff}</td>
                  <td colSpan={4} className="table-cell" />
                  <td className="table-cell" style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: '#FBBF24', fontSize: 13 }}>
                    ₹{(totalGross / 100000).toFixed(2)}L
                  </td>
                  <td colSpan={2} className="table-cell" />
                  <td className="table-cell" style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: '#34D399', fontSize: 13 }}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Process {selectedMonth} Payroll</h3>
            {/* Checklist */}
            <div className="space-y-3 mb-6">
              {[
                { label: 'Attendance data locked', done: true },
                { label: 'Leave deductions computed', done: true },
                { label: 'OT hours verified', done: true },
                { label: 'Statutory compliance (PF/ESI) calculated', done: true },
                { label: 'AI anomaly scan completed', done: !processed, ai: true },
                { label: 'Payroll finalized & disbursed', done: processed },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3" style={{
                  background: item.done ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${item.done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 10, padding: '10px 14px',
                }}>
                  <CheckCircle style={{ width: 16, height: 16, color: item.done ? '#34D399' : 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: item.done ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.35)' }}>{item.label}</span>
                  {item.ai && <Sparkles style={{ width: 12, height: 12, color: '#818CF8', marginLeft: 'auto' }} />}
                </div>
              ))}
            </div>

            <button
              onClick={handleProcess}
              disabled={processing || processed}
              className="btn-primary w-full"
              style={{ justifyContent: 'center', fontSize: 14, padding: '14px 24px', opacity: processed ? 0.6 : 1 }}
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                  Processing Payroll...
                </span>
              ) : processed ? (
                <span className="flex items-center gap-2">
                  <CheckCircle style={{ width: 16, height: 16 }} />
                  Payroll Processed
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Wallet style={{ width: 16, height: 16 }} />
                  Process {selectedMonth} Payroll
                </span>
              )}
            </button>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles style={{ width: 15, height: 15, color: '#818CF8' }} />
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>AI Anomaly Detection</p>
            </div>
            <div className="space-y-3">
              {[
                { type: 'Overtime Spike', emp: 'Nurse Kavitha Nair · ICU', detail: 'OT hours 340% above baseline this month', color: '#F87171', sev: 'Review' },
                { type: 'Duplicate Entry', emp: 'KD-EMP-0034 · Admin', detail: 'Two salary disbursements detected for same period', color: '#FB923C', sev: 'Block' },
                { type: 'Grade Mismatch', emp: 'Kumar Swamy · ICU', detail: 'Salary grade does not match current designation', color: '#FBBF24', sev: 'Warning' },
              ].map((anomaly, i) => (
                <div key={i} style={{
                  background: `${anomaly.color}08`, border: `1px solid ${anomaly.color}20`,
                  borderRadius: 12, padding: '14px 16px',
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontSize: 12, fontWeight: 700, color: anomaly.color }}>{anomaly.type}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                      color: anomaly.color, background: `${anomaly.color}18`, border: `1px solid ${anomaly.color}30`,
                    }}>{anomaly.sev}</span>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 3 }}>{anomaly.emp}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{anomaly.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAYSLIPS */}
      {activeTab === 'payslips' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['Employee', 'Department', 'Designation', 'Gross', 'Deductions', 'Net Pay', 'Action'].map(h => (
                    <th key={h} className="table-header" style={{ textAlign: h === 'Action' ? 'center' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 15).map((emp, i) => {
                  const struct = SALARY_STRUCTURES[i % SALARY_STRUCTURES.length];
                  return (
                    <tr key={emp.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(99,102,241,0.2))', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#38BDF8' }}>
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{emp.name}</p>
                            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>{emp.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{emp.department}</td>
                      <td className="table-cell" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{emp.designation}</td>
                      <td className="table-cell" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#FBBF24', fontWeight: 600 }}>₹{struct.gross.toLocaleString('en-IN')}</td>
                      <td className="table-cell" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#F87171' }}>₹{(struct.pf + struct.esi + 200).toLocaleString('en-IN')}</td>
                      <td className="table-cell" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#34D399', fontWeight: 700 }}>₹{struct.net.toLocaleString('en-IN')}</td>
                      <td className="table-cell" style={{ textAlign: 'center' }}>
                        <button className="btn-icon" style={{ padding: 7 }} onClick={() => { setSelectedEmp(emp); setShowPayslip(true); }}>
                          <Eye style={{ width: 14, height: 14 }} />
                        </button>
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
        <div className="glass-card" style={{ padding: 24 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 20 }}>6-Month Payroll Trend (₹ Lakhs)</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={TREND_DATA}>
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<GlassTooltip />} />
              <Line type="monotone" dataKey="gross" stroke="#38BDF8" strokeWidth={2.5} dot={{ fill: '#38BDF8', r: 4 }} name="Gross" />
              <Line type="monotone" dataKey="net" stroke="#34D399" strokeWidth={2.5} dot={{ fill: '#34D399', r: 4 }} name="Net" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {showPayslip && <PayslipModal emp={selectedEmp} onClose={() => setShowPayslip(false)} />}
    </div>
  );
}
