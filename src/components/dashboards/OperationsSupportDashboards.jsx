import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HOUSEKEEPING_ZONES, LAUNDRY_INVENTORY, SECURITY_POSTS } from '../../data/clinicalData';
import {
  Sparkles, Shield, Camera, AlertTriangle, UserCheck, DollarSign,
  Building2, Users, FileText, CheckCircle2, XCircle, Clock, Calendar,
  ArrowUpRight, Check, X, ShieldAlert, Video, Eye, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// 1. HOUSEKEEPING SUPERVISOR DASHBOARD
export function HousekeepingSupervisorDashboard() {
  const { user } = useAuth();
  const [zones, setZones] = useState(HOUSEKEEPING_ZONES);

  const handleInspectZone = (zoneName) => {
    toast.success(`Sanitation audit for "${zoneName}" certified 100% sterile!`);
    setZones(prev => prev.map(z => z.zone === zoneName ? { ...z, status: 'Clean & Certified', rating: '100% Sterile' } : z));
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(245,158,11,0.08) 100%)' }}>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
          Sanitation & Facility Hygiene Command
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Housekeeping Operations
        </h1>
        <p className="text-sm text-slate-300">
          Supervisor: <span className="text-emerald-300 font-semibold">{user?.name || 'Mr. Suresh Yadav'}</span> • NABH Infection Control Standard
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Total Sanitation Staff</p>
            <p className="text-xl font-bold text-white mt-0.5">54 Staff</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Present On Shift</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">48 Present</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Absent / On Leave</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">4 Absent, 2 Leave</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Average Audit Score</p>
            <p className="text-xl font-bold text-sky-400 mt-0.5">96.8% Clean</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="text-base font-bold text-white">Ward & Zone Sanitation Deployments</h2>
        <div className="space-y-3">
          {zones.map(z => (
            <div key={z.zone} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white">{z.zone}</h3>
                <p className="text-xs text-slate-300">Rostered Staff: <span className="font-semibold text-emerald-300">{z.staff}</span></p>
                <p className="text-[11px] text-slate-400 mt-0.5">Protocol: {z.frequency} • Last Cleaned: {z.lastCleaned} (Next: {z.nextDue})</p>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <span className="text-xs font-mono font-bold text-emerald-400">{z.rating}</span>
                <button
                  onClick={() => handleInspectZone(z.zone)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
                >
                  Verify Audit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. DHOBI / LAUNDRY DASHBOARD
export function DhobiDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div className="glass-card p-6" style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.12) 0%, rgba(139,92,246,0.08) 100%)' }}>
        <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
          Hospital Linen & Sterile Laundry
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Laundry & Linen Operations
        </h1>
        <p className="text-sm text-slate-300">
          Laundry Master: <span className="text-sky-300 font-semibold">{user?.name || 'Mr. Balaiah'}</span> • Basement Laundry Complex
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Total Linen Received</p>
            <p className="text-xl font-bold text-white mt-0.5">150 Pieces</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Washed & Disinfected</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">130 Clean</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">In Press / Drying</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">20 In Process</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">OT Sterile Packs</p>
            <p className="text-xl font-bold text-purple-400 mt-0.5">18 Dispatched</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="text-base font-bold text-white">Daily Hospital Linen Batch Ledger</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-300 font-semibold border-b border-white/10">
              <tr>
                <th className="p-3">Linen Item Category</th>
                <th className="p-3">Received Today</th>
                <th className="p-3">Processed</th>
                <th className="p-3">Pending Wash</th>
                <th className="p-3">Cycle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {LAUNDRY_INVENTORY.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">{item.item}</td>
                  <td className="p-3 font-mono">{item.received}</td>
                  <td className="p-3 font-mono text-emerald-400">{item.processed}</td>
                  <td className="p-3 font-mono text-amber-400">{item.pending}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300">
                      {item.status}
                    </span>
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

// 3. SECURITY SUPERVISOR DASHBOARD
export function SecuritySupervisorDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div className="glass-card p-6" style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.12) 0%, rgba(59,130,246,0.08) 100%)' }}>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
          CCTV Command & Guard Operations
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Security Operations Command
        </h1>
        <p className="text-sm text-slate-300">
          Chief Security Officer: <span className="text-teal-300 font-semibold">{user?.name || 'Mr. Nagaraju'}</span> • 24/7 Hospital Surveillance
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Cameras Online</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">24 Online</p>
            <p className="text-[10px] text-rose-400">1 Offline (CAM-OT-01)</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Active AI Alerts</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">3 Alerts</p>
            <p className="text-[10px] text-slate-400">Corridor Loitering</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Restricted Events</p>
            <p className="text-xl font-bold text-rose-400 mt-0.5">2 Events</p>
            <p className="text-[10px] text-rose-300">ICU Entry After Hours</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Security Guards</p>
            <p className="text-xl font-bold text-sky-400 mt-0.5">11 / 12 Present</p>
            <p className="text-[10px] text-emerald-400">100% Post Coverage</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="text-base font-bold text-white">Live Guard Post Allocations</h2>
        <div className="space-y-3">
          {SECURITY_POSTS.map((sp, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white">{sp.post}</h3>
                <p className="text-xs text-slate-300">Guard: <span className="font-semibold text-teal-300">{sp.guard}</span> • Shift: {sp.shift}</p>
                {sp.visitorsLogged !== undefined && (
                  <p className="text-[11px] text-slate-400 mt-0.5">Visitors Logged: {sp.visitorsLogged} | Vehicle Checks: {sp.vehicleChecks}</p>
                )}
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 self-start sm:self-auto">
                {sp.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. SECURITY GUARD DASHBOARD (Main Gate)
export function SecurityGuardDashboard() {
  const { user } = useAuth();
  const [visitorName, setVisitorName] = useState('');
  const [visitorCount, setVisitorCount] = useState(84);

  const handleLogVisitor = (e) => {
    e.preventDefault();
    setVisitorCount(c => c + 1);
    toast.success(`Visitor "${visitorName}" gate pass issued!`);
    setVisitorName('');
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6" style={{ background: 'linear-gradient(135deg, rgba(45,212,191,0.12) 0%, rgba(14,165,233,0.08) 100%)' }}>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
          Gate Duty & Patrol Post
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Main Gate Security Post
        </h1>
        <p className="text-sm text-slate-300">
          Guard: <span className="text-teal-300 font-semibold">{user?.name || 'Mr. Siva Kumar'}</span> • Shift C (07:00 PM – 08:00 AM)
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Post Status</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">ON DUTY</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Visitors Logged</p>
            <p className="text-xl font-bold text-white mt-0.5">{visitorCount} Entries</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Vehicle Checks</p>
            <p className="text-xl font-bold text-teal-400 mt-0.5">32 Vehicles</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Patrol Checkpoints</p>
            <p className="text-xl font-bold text-sky-400 mt-0.5">18 / 24 Done</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="text-base font-bold text-white">Log Visitor Entry</h2>
        <form onSubmit={handleLogVisitor} className="flex gap-2">
          <input
            type="text"
            value={visitorName}
            onChange={e => setVisitorName(e.target.value)}
            placeholder="Visitor Name & Patient Attending..."
            className="flex-1 p-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-xs"
            required
          />
          <button type="submit" className="px-4 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs">
            Issue Gate Pass
          </button>
        </form>
      </div>
    </div>
  );
}

// 5. ATTENDANCE OFFICER DASHBOARD
export function AttendanceOfficerDashboard() {
  const { user } = useAuth();
  const [corrections, setCorrections] = useState([
    { id: 'COR-001', name: 'Priya Sharma', dept: 'Reception', type: 'Punch Missing', reason: 'Biometric terminal 2 offline', status: 'Pending' },
    { id: 'COR-002', name: 'Kavitha Nair', dept: 'OT', type: 'Late Regularization', reason: 'Emergency Cesarean section call', status: 'Pending' },
    { id: 'COR-003', name: 'Kumar Swamy', dept: 'ICU', type: 'Shift Correction', reason: 'Substituted for nurse on sick leave', status: 'Pending' }
  ]);

  const handleApprove = (id) => {
    toast.success(`Correction request ${id} APPROVED and updated in Bio-Terminal DB!`);
    setCorrections(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(99,102,241,0.08) 100%)' }}>
        <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
          Biometric Muster & Regularization Operations
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Attendance Operations Center
        </h1>
        <p className="text-sm text-slate-300">
          Attendance Officer: <span className="text-sky-300 font-semibold">{user?.name || 'Mrs. Sarala Devi'}</span> • 3 Biometric Gateways Active
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Present Today</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">278 Present</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Absent</p>
            <p className="text-xl font-bold text-rose-400 mt-0.5">12 Absent</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Late Punches</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">18 Late</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Missing Punches</p>
            <p className="text-xl font-bold text-purple-400 mt-0.5">7 Missing</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Pending Regularization</p>
            <p className="text-xl font-bold text-sky-400 mt-0.5">{corrections.length} Requests</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="text-base font-bold text-white">Pending Attendance Regularization Requests</h2>
        {corrections.length > 0 ? (
          <div className="space-y-3">
            {corrections.map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono font-bold text-sky-400">{c.id}</span>
                  <h3 className="text-sm font-bold text-white">{c.name} ({c.dept})</h3>
                  <p className="text-xs text-amber-300">{c.type}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Reason: {c.reason}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(c.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                  >
                    Approve Punch
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-emerald-400">All attendance corrections for today have been reviewed and approved!</p>
        )}
      </div>
    </div>
  );
}

// 6. PAYROLL OFFICER DASHBOARD
export function PayrollOfficerDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div className="glass-card p-6" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(14,165,233,0.08) 100%)' }}>
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
          Compensation & Disbursal Command
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Payroll & Financial Disbursement
        </h1>
        <p className="text-sm text-slate-300">
          Payroll Officer: <span className="text-purple-300 font-semibold">{user?.name || 'Mr. Rajesh Varma'}</span> • September 2026 Batch
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Employees in Cycle</p>
            <p className="text-xl font-bold text-white mt-0.5">326 Staff</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Reviewed</p>
            <p className="text-xl font-bold text-sky-400 mt-0.5">300 Reviewed</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Approved by Management</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">280 Approved</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Finalized & Disbursed</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">260 Finalized</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="text-base font-bold text-white">Monthly Disbursal Breakdown (INR)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-xs text-slate-400">Gross Salary</p>
            <p className="text-xl font-bold text-white mt-1">₹78,40,000</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-xs text-slate-400">Approved Overtime</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">₹12,84,000</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-xs text-slate-400">LOP & Deductions</p>
            <p className="text-xl font-bold text-rose-400 mt-1">-₹8,20,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. HOSPITAL MANAGEMENT DASHBOARD
export function ManagementDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div className="glass-card p-6" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.14) 0%, rgba(99,102,241,0.08) 100%)' }}>
        <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
          Executive Hospital Command
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Hospital Executive Overview
        </h1>
        <p className="text-sm text-slate-300">
          Managing Director: <span className="text-sky-300 font-semibold">{user?.name || 'Sri P. Venkateswara Rao'}</span> • 120 Beds • NABH Accredited
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Total Workforce</p>
            <p className="text-2xl font-bold text-white mt-0.5">326</p>
            <p className="text-[11px] text-emerald-400 mt-0.5">278 Present (85%)</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Current Inpatients</p>
            <p className="text-2xl font-bold text-sky-400 mt-0.5">142</p>
            <p className="text-[11px] text-slate-400 mt-0.5">88% Bed Occupancy</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Doctors Available</p>
            <p className="text-2xl font-bold text-emerald-400 mt-0.5">18</p>
            <p className="text-[11px] text-slate-400 mt-0.5">All Specialties Staffed</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Staffing & Ops Alerts</p>
            <p className="text-2xl font-bold text-amber-400 mt-0.5">4 Alerts</p>
            <p className="text-[11px] text-amber-300 mt-0.5">Actionable insights</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="text-base font-bold text-white">Departmental Operations Summary Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <h3 className="text-sm font-bold text-sky-400">Intensive Care Unit (ICU)</h3>
            <p className="text-xs text-slate-300 mt-1">Staff: 42 | Present: 36 (86% coverage)</p>
            <p className="text-xs text-emerald-400 mt-1">Inpatients: 18 Beds Active</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <h3 className="text-sm font-bold text-indigo-400">Outpatient (OPD)</h3>
            <p className="text-xs text-slate-300 mt-1">Staff: 38 | Present: 31 (82% coverage)</p>
            <p className="text-xs text-emerald-400 mt-1">Footfall: 74 Consultations</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <h3 className="text-sm font-bold text-cyan-400">Diagnostic Laboratory</h3>
            <p className="text-xs text-slate-300 mt-1">Staff: 16 | Present: 15 (94% coverage)</p>
            <p className="text-xs text-cyan-300 mt-1">Workload: 28 Samples Accessioned</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 8. DEPARTMENT HEAD / HOD DASHBOARD
export function HodDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div className="glass-card p-6" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(16,185,129,0.08) 100%)' }}>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
          Department Head Operations
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          {user?.dept || 'Critical Care Medicine'} — HOD Command
        </h1>
        <p className="text-sm text-slate-300">
          HOD: <span className="text-indigo-300 font-semibold">{user?.name || 'Dr. Ramesh Babu'}</span> • Departmental Scope
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Department Staff</p>
            <p className="text-xl font-bold text-white mt-0.5">42 Staff</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Present On Duty</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">36 Present</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">On Leave / Absent</p>
            <p className="text-xl font-bold text-amber-400 mt-0.5">4 Leave, 2 Absent</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-400">Shift Coverage</p>
            <p className="text-xl font-bold text-sky-400 mt-0.5">86% Optimal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
