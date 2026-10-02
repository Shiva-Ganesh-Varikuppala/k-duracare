import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PATIENTS, NURSING_TASKS } from '../../data/clinicalData';
import {
  Heart, Clock, Pill, Activity, CheckCircle2, AlertTriangle, ShieldCheck,
  ChevronRight, Check, Plus, Stethoscope, UserCheck, Calendar
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function NurseDashboard({ isIcu = false }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(NURSING_TASKS);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'patients' | 'hr'

  // Nurse sees patients in their unit/ward only
  const wardPatients = PATIENTS.filter(p => 
    isIcu ? p.ward === 'ICU' : (p.ward === 'Ward B' || p.ward === 'ICU')
  );

  const toggleTaskStatus = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
        toast.success(`Task ${t.id} marked as ${nextStatus}!`);
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-card p-6" style={{ background: 'transparent' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" /> {isIcu ? 'ICU Clinical Care Unit' : 'Nursing Operations & Inpatient Care'}
              </span>
              <span className="text-xs font-mono text-slate-400">{user?.empId || 'KD-NUR-001'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {user?.name || 'Mrs. Lakshmi Devi'}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Assigned Unit: <span className="text-amber-300 font-semibold">{isIcu ? 'Intensive Care Unit (ICU)' : 'Ward B & Step-down Telemetry'}</span>
              <span className="mx-2 text-slate-500">•</span>
              <span className="text-slate-400">Shift A (07:00 AM – 02:00 PM)</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tasks' ? 'bg-amber-500 text-slate-950' : 'bg-white/5 text-slate-300'
              }`}
            >
              Today's Care Tasks
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'patients' ? 'bg-amber-500 text-slate-950' : 'bg-white/5 text-slate-300'
              }`}
            >
              Assigned Patients ({wardPatients.length})
            </button>
            <button
              onClick={() => setActiveTab('hr')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'hr' ? 'bg-sky-500 text-slate-950' : 'bg-white/5 text-slate-300'
              }`}
            >
              Nurse Self-Service
            </button>
          </div>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <p className="text-xs text-slate-400">Assigned Inpatients</p>
            <p className="text-2xl font-bold text-amber-400 mt-0.5">{wardPatients.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{isIcu ? 'Critical Care Beds' : 'Ward B Beds'}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <p className="text-xs text-slate-400">Medication Doses</p>
            <p className="text-2xl font-bold text-emerald-400 mt-0.5">8</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Scheduled on Shift A</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <p className="text-xs text-slate-400">Vitals Checks Due</p>
            <p className="text-2xl font-bold text-sky-400 mt-0.5">4</p>
            <p className="text-[11px] text-sky-300 mt-0.5">q4h telemetry logs</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <p className="text-xs text-slate-400">Pending Tasks</p>
            <p className="text-2xl font-bold text-rose-400 mt-0.5">{pendingCount}</p>
            <p className="text-[11px] text-rose-300 mt-0.5">Action required</p>
          </div>
        </div>
      </div>

      {/* Tab: Tasks */}
      {activeTab === 'tasks' && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-amber-400" />
              Medication & Nursing Care Tasks
            </h2>
            <span className="text-xs text-slate-400">
              {completedCount} Completed / {tasks.length} Total
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map(task => {
              const isDone = task.status === 'Completed';
              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    isDone ? 'bg-emerald-500/10 border-emerald-500/20 opacity-80' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">{task.id}</span>
                      <span className="text-xs font-semibold text-slate-300">{task.bed}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">{task.type}</span>
                    </div>
                    <p className={`text-sm font-semibold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.task}
                    </p>
                    <p className="text-xs text-slate-400">Due at {task.due} • Nurse: {task.nurse}</p>
                  </div>

                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {isDone ? 'Completed' : 'Mark Administered'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Patients in Ward */}
      {activeTab === 'patients' && (
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Inpatients in {isIcu ? 'ICU Unit' : 'Ward B'}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-300 font-semibold border-b border-white/10">
                <tr>
                  <th className="p-3">Bed</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Diagnosis</th>
                  <th className="p-3">Attending Doctor</th>
                  <th className="p-3">Next Med Due</th>
                  <th className="p-3">Vitals</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {wardPatients.map(pt => (
                  <tr key={pt.id} className="hover:bg-white/5">
                    <td className="p-3 font-mono font-bold text-amber-400">{pt.bed}</td>
                    <td className="p-3 font-semibold text-white">{pt.name} ({pt.age}/{pt.gender})</td>
                    <td className="p-3 max-w-[200px] truncate">{pt.diagnosis}</td>
                    <td className="p-3 text-sky-400">{pt.doctorName}</td>
                    <td className="p-3 font-mono text-emerald-400">{pt.medications[0]?.time || '12:00 PM'}</td>
                    <td className="p-3 font-mono text-slate-200">SpO2: {pt.vitals.spo2} | BP: {pt.vitals.bp}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pt.condition === 'Critical' ? 'bg-rose-500/20 text-rose-300 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {pt.condition}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Nurse HR */}
      {activeTab === 'hr' && (
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Nurse Personal Self-Service</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-400">Attendance This Month</p>
              <p className="text-xl font-bold text-white mt-1">24 Days Worked</p>
              <p className="text-xs text-emerald-400 mt-1">Punch In: 06:54 AM</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-400">Leave Balance</p>
              <p className="text-xl font-bold text-white mt-1">9 Days Available</p>
              <p className="text-xs text-slate-400 mt-1">CL: 4 | SL: 5</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-xs text-slate-400">Next Shift</p>
              <p className="text-xl font-bold text-amber-300 mt-1">Tomorrow 07:00 AM</p>
              <p className="text-xs text-slate-400 mt-1">Shift A (Morning)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
