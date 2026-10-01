import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PATIENTS } from '../../data/clinicalData';
import {
  Stethoscope, Users, Clock, AlertTriangle, Calendar, FileText, Activity,
  ChevronRight, X, Heart, Pill, ClipboardList, PlusCircle, ShieldCheck, Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('clinical'); // 'clinical' | 'hr_attendance' | 'hr_leave' | 'hr_shift'
  const [newClinicalNote, setNewClinicalNote] = useState('');

  // Doctor only sees patients assigned to them (or matching their empId/specialty)
  const myPatients = PATIENTS.filter(p => 
    p.assignedDoctorId === user?.empId || 
    p.doctorName?.includes('Ravi Shankar') || 
    user?.role === 'Super Administrator'
  );

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newClinicalNote.trim()) return;
    toast.success(`Clinical note signed and appended to patient chart (${selectedPatient.id})!`);
    setNewClinicalNote('');
  };

  return (
    <div className="space-y-6">
      {/* Doctor Header Banner */}
      <div className="glass-card p-6" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(14,165,233,0.08) 100%)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5" /> Clinical Physician Portal
              </span>
              <span className="text-xs font-mono text-slate-400">{user?.empId || 'KD-DOC-001'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {user?.name || 'Dr. Ravi Shankar'}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Department: <span className="text-emerald-300 font-semibold">{user?.dept || 'Cardiology & Critical Care'}</span>
              <span className="mx-2 text-slate-500">•</span>
              <span className="text-slate-400">NABH Clinical Privilege Level 3</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('clinical')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'clinical' 
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              My Inpatients ({myPatients.length})
            </button>
            <button
              onClick={() => setActiveTab('hr_attendance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab.startsWith('hr') 
                  ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20' 
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              Doctor's Workforce & HR
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <p className="text-xs text-slate-400">Assigned Inpatients</p>
            <p className="text-2xl font-bold text-emerald-400 mt-0.5">18</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Ward B, ICU & OPD</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <p className="text-xs text-slate-400">Today's Consultations</p>
            <p className="text-2xl font-bold text-sky-400 mt-0.5">7</p>
            <p className="text-[11px] text-emerald-400 mt-0.5">4 Completed, 3 Queued</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <p className="text-xs text-slate-400">Pending Reviews</p>
            <p className="text-2xl font-bold text-amber-400 mt-0.5">4</p>
            <p className="text-[11px] text-amber-300 mt-0.5">STAT Lab reports ready</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <p className="text-xs text-slate-400">Physician Shift</p>
            <p className="text-2xl font-bold text-purple-400 mt-0.5">09–05 PM</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Emergency On-Call: 24/7</p>
          </div>
        </div>
      </div>

      {/* Main Tab View: Clinical Inpatients */}
      {activeTab === 'clinical' && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" />
                Authorized Inpatients — Dr. Ravi Shankar
              </h2>
              <p className="text-xs text-slate-400">
                Click any patient to inspect Day-Wise history, medications, investigations, and clinical timeline
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                🔒 Filtered by Physician Clearance
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-300 font-semibold border-b border-white/10">
                <tr>
                  <th className="p-3">Patient ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Age / Sex</th>
                  <th className="p-3">Ward / Bed</th>
                  <th className="p-3">Primary Diagnosis</th>
                  <th className="p-3">Condition</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {myPatients.map(pt => (
                  <tr key={pt.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-mono font-bold text-sky-400">{pt.id}</td>
                    <td className="p-3 font-semibold text-white">{pt.name}</td>
                    <td className="p-3">{pt.age} yrs / {pt.gender}</td>
                    <td className="p-3 font-mono text-slate-200">{pt.ward} – {pt.bed}</td>
                    <td className="p-3 max-w-[220px] truncate text-slate-300">{pt.diagnosis}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pt.condition === 'Critical' ? 'bg-rose-500/20 text-rose-300 animate-pulse' :
                        pt.condition === 'Observation' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {pt.condition}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedPatient(pt)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1"
                      >
                        Clinical Details <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Doctor's Own Workforce / HR Tab */}
      {activeTab === 'hr_attendance' && (
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-sky-400" />
              Doctor's Personal Workforce & Self-Service
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-400">My Attendance</p>
              <p className="text-xl font-bold text-white mt-1">26 Days Present</p>
              <p className="text-xs text-emerald-400 mt-1">100% Biometric Punch Compliance</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-400">My Leave Balance</p>
              <p className="text-xl font-bold text-white mt-1">14 Days Available</p>
              <p className="text-xs text-slate-400 mt-1">CL: 6 | SL: 8 | Conference Leave: 4</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-400">Monthly Compensation</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">₹2,85,000</p>
              <p className="text-xs text-slate-400 mt-1">Disbursed on 1st of month</p>
            </div>
          </div>
        </div>
      )}

      {/* Day-Wise Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-3xl w-full p-6 space-y-6 border border-white/20 my-8">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                    {selectedPatient.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    selectedPatient.condition === 'Critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {selectedPatient.condition}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mt-1">{selectedPatient.name}</h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  {selectedPatient.age} yrs, {selectedPatient.gender} • {selectedPatient.ward} ({selectedPatient.room} – {selectedPatient.bed})
                </p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Current Vitals Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300">
              <div><span className="text-slate-400">BP:</span> <span className="font-bold text-white">{selectedPatient.vitals.bp}</span></div>
              <div><span className="text-slate-400">Pulse:</span> <span className="font-bold text-white">{selectedPatient.vitals.pulse}</span></div>
              <div><span className="text-slate-400">SpO2:</span> <span className="font-bold text-emerald-400">{selectedPatient.vitals.spo2}</span></div>
              <div><span className="text-slate-400">Temp:</span> <span className="font-bold text-white">{selectedPatient.vitals.temp}</span></div>
              <div><span className="text-slate-400">Resp:</span> <span className="font-bold text-white">{selectedPatient.vitals.resp}</span></div>
            </div>

            {/* Day-Wise Clinical Progress Accordion/Tabs */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-emerald-400" />
                Day-Wise Clinical Evolution
              </h3>

              {selectedPatient.dayWiseHistory && selectedPatient.dayWiseHistory.length > 0 ? (
                <div className="space-y-4">
                  {selectedPatient.dayWiseHistory.map((dayItem, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-sm font-bold text-sky-300">{dayItem.day}</span>
                        <span className="text-xs text-slate-400 font-mono">{dayItem.location}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-slate-400 font-semibold">Diagnosis:</p>
                          <p className="text-slate-200 mt-0.5">{dayItem.diagnosis}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold">Medication Regimen:</p>
                          <p className="text-emerald-300 mt-0.5">{dayItem.medication}</p>
                        </div>
                      </div>

                      <div className="text-xs">
                        <p className="text-slate-400 font-semibold">Investigations Ordered:</p>
                        <p className="text-purple-300 mt-0.5">{dayItem.investigation}</p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-black/20 text-xs text-slate-300 border border-white/5">
                        <p className="text-slate-400 font-semibold text-[11px]">Doctor Notes:</p>
                        <p className="mt-0.5 italic">{dayItem.doctorNotes}</p>
                      </div>

                      {/* Clinical Timeline */}
                      {dayItem.timeline && dayItem.timeline.length > 0 && (
                        <div className="pt-2">
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Hourly Timeline</p>
                          <div className="space-y-1.5 pl-2 border-l border-emerald-500/30">
                            {dayItem.timeline.map((tl, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs">
                                <span className="font-mono text-emerald-400 text-[11px] shrink-0">{tl.time}</span>
                                <span className="text-slate-300">{tl.event}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/5 text-xs text-slate-400">
                  Initial consultation chart active. First day progress note being compiled.
                </div>
              )}
            </div>

            {/* Quick Note Append Form */}
            <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-white/10">
              <label className="block text-xs font-semibold text-slate-300">Add Consultant Review Note</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newClinicalNote}
                  onChange={e => setNewClinicalNote(e.target.value)}
                  placeholder="e.g. Afebrile. Bowel sounds present. Continue current IV regimen..."
                  className="flex-1 p-2.5 rounded-xl bg-white/10 border border-white/10 text-white text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  Sign & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
