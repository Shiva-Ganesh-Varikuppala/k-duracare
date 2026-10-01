import { useState } from 'react';
import { Clock, Users, Plus, Edit3, Save, X, ChevronLeft, ChevronRight, Calendar, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { employees } from '../data/employees';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import Badge from '../components/ui/badge/Badge';
import Button from '../components/ui/button/Button';

const SHIFTS = [
  { id: 'A', name: 'Morning Shift', code: 'Shift A', start: '06:00', end: '14:00', color: '#f59e0b', staff: 128 },
  { id: 'B', name: 'Evening Shift', code: 'Shift B', start: '14:00', end: '22:00', color: '#0ea5e9', staff: 96 },
  { id: 'C', name: 'Night Shift',   code: 'Shift C', start: '22:00', end: '06:00', color: '#8b5cf6', staff: 64 },
  { id: 'G', name: 'General Shift', code: 'General', start: '09:00', end: '17:00', color: '#10b981', staff: 42 },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEPT_COVERAGE = [
  { dept: 'ICU',          A: 14, B: 12, C: 10, G: 0  },
  { dept: 'OPD',          A: 20, B: 16, C: 4,  G: 8  },
  { dept: 'OT',           A: 8,  B: 6,  C: 4,  G: 2  },
  { dept: 'Wards',        A: 22, B: 18, C: 14, G: 0  },
  { dept: 'Lab',          A: 6,  B: 4,  C: 2,  G: 4  },
  { dept: 'Pharmacy',     A: 4,  B: 3,  C: 2,  G: 2  },
  { dept: 'Reception',    A: 4,  B: 3,  C: 0,  G: 4  },
  { dept: 'Housekeeping', A: 10, B: 8,  C: 6,  G: 4  },
];

const generateRoster = () => {
  return employees.slice(0, 40).map(emp => ({
    ...emp,
    schedule: DAYS.map(() => {
      const roll = Math.random();
      if (roll < 0.1) return 'Off';
      const s = SHIFTS[Math.floor(Math.random() * SHIFTS.length)];
      return s.id;
    }),
  }));
};
const ROSTER = generateRoster();

function ShiftCard({ shift, onClick }) {
  return (
    <div
      className="group relative cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:border-brand-300 hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-500/40"
      onClick={() => onClick(shift)}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ backgroundColor: shift.color }}
      />
      <div className="flex items-center justify-between mb-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${shift.color}15`, color: shift.color }}
        >
          <Clock className="w-5 h-5" />
        </div>
        <span className="font-mono text-2xl font-bold tracking-tight" style={{ color: shift.color }}>
          {shift.staff}
        </span>
      </div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-0.5">{shift.name}</h3>
      <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
        {shift.start} — {shift.end}
      </p>

      <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${(shift.staff / 330) * 100}%`, backgroundColor: shift.color }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
        <span>Workforce Share</span>
        <span className="font-mono font-semibold">{Math.round((shift.staff / 330) * 100)}%</span>
      </div>
    </div>
  );
}

function EditShiftModal({ shift, onClose, onSave }) {
  const [form, setForm] = useState({ start: shift.start, end: shift.end, name: shift.name });
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-glass" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Edit {shift.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="input-label">Shift Display Name</label>
            <input
              className="input-field"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Start Time</label>
              <input
                type="time"
                className="input-field font-mono"
                value={form.start}
                onChange={e => setForm(p => ({ ...p, start: e.target.value }))}
              />
            </div>
            <div>
              <label className="input-label">End Time</label>
              <input
                type="time"
                className="input-field font-mono"
                value={form.end}
                onChange={e => setForm(p => ({ ...p, end: e.target.value }))}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            startIcon={<Save className="w-4 h-4" />}
            onClick={() => { onSave(form); onClose(); }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Shifts() {
  const [activeTab, setActiveTab] = useState('overview');
  const [shifts, setShifts] = useState(SHIFTS);
  const [editingShift, setEditingShift] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [search, setSearch] = useState('');

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1 + weekOffset * 7);
  const weekLabel = `${weekStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — ${new Date(weekStart.getTime() + 6 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  const filteredRoster = ROSTER.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveShift = (id, form) => {
    setShifts(prev => prev.map(s => s.id === id ? { ...s, ...form } : s));
    toast.success('Shift updated successfully');
  };

  const getShiftBadge = (shiftId) => {
    if (shiftId === 'Off') {
      return <span className="font-mono text-[11px] text-gray-400 font-medium">Off</span>;
    }
    const s = SHIFTS.find(x => x.id === shiftId);
    if (!s) return null;
    return (
      <span
        className="inline-flex items-center justify-center rounded-md px-2 py-0.5 font-mono text-xs font-bold"
        style={{
          backgroundColor: `${s.color}15`,
          color: s.color,
          border: `1px solid ${s.color}35`,
        }}
      >
        {s.code}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb
          pageTitle="Shift Configuration & Roster"
          breadcrumbs={[
            { label: 'Workforce', path: '/employees' },
            { label: 'Shifts' }
          ]}
        />
        <Button
          variant="primary"
          size="sm"
          startIcon={<Plus className="w-4 h-4" />}
          onClick={() => toast.success('New shift template dialog activated')}
        >
          Add Shift
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-100 p-1.5 dark:border-gray-800 dark:bg-gray-900/60 w-fit">
        {[
          { id: 'overview', label: 'Shift Master' },
          { id: 'roster', label: 'Weekly Roster' },
          { id: 'coverage', label: 'Coverage Analysis' },
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

      {/* SHIFT MASTER */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {shifts.map(shift => (
              <ShiftCard key={shift.id} shift={shift} onClick={setEditingShift} />
            ))}
          </div>

          {/* 24-Hour Timeline */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">24-Hour Operational Timeline</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Continuous round-the-clock handover progression</p>
            <div className="relative h-24 pt-4">
              {/* Hour markers */}
              {[0, 3, 6, 9, 12, 15, 18, 21, 24].map(h => (
                <div
                  key={h}
                  className="absolute top-0 h-full border-l border-gray-200 dark:border-gray-800"
                  style={{ left: `${(h / 24) * 100}%` }}
                >
                  <span className="absolute -top-3.5 -translate-x-1/2 font-mono text-[10px] text-gray-400">
                    {String(h).padStart(2, '0')}:00
                  </span>
                </div>
              ))}
              {/* Shift bars */}
              {shifts.map((shift, i) => {
                const [sh, sm] = shift.start.split(':').map(Number);
                const [eh, em] = shift.end.split(':').map(Number);
                let startPct = ((sh * 60 + sm) / (24 * 60)) * 100;
                let endPct = ((eh * 60 + em) / (24 * 60)) * 100;
                if (shift.id === 'C') endPct = 100;
                const top = [0, 24, 48, 72][i];
                return (
                  <div
                    key={shift.id}
                    className="absolute h-5 rounded-md flex items-center px-2 shadow-xs transition-transform hover:scale-y-110"
                    style={{
                      left: `${startPct}%`,
                      width: `${endPct - startPct}%`,
                      top: `${top}%`,
                      backgroundColor: `${shift.color}25`,
                      border: `1px solid ${shift.color}60`,
                    }}
                  >
                    <span className="font-mono text-[10px] font-bold truncate" style={{ color: shift.color }}>
                      {shift.code} ({shift.start}–{shift.end})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* WEEKLY ROSTER */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setWeekOffset(w => w - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 px-2 font-mono">
                {weekLabel}
              </span>
              <Button variant="outline" size="sm" onClick={() => setWeekOffset(w => w + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              {weekOffset !== 0 && (
                <Button variant="ghost" size="sm" onClick={() => setWeekOffset(0)}>
                  Today
                </Button>
              )}
            </div>
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Search staff or ward..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-9 text-xs"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.02]">
                    <th className="table-header min-w-[160px]">Employee</th>
                    <th className="table-header min-w-[100px]">Department</th>
                    {DAYS.map(d => (
                      <th key={d} className="table-header text-center min-w-[80px]">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredRoster.slice(0, 20).map(emp => (
                    <tr key={emp.id} className="table-row">
                      <td className="table-cell">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-xs">{emp.name}</p>
                          <p className="font-mono text-[10px] text-gray-500 dark:text-gray-400">{emp.id}</p>
                        </div>
                      </td>
                      <td className="table-cell text-xs text-gray-600 dark:text-gray-400">{emp.department}</td>
                      {emp.schedule.map((shiftId, di) => (
                        <td key={di} className="table-cell text-center">
                          {getShiftBadge(shiftId)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* COVERAGE ANALYSIS */}
      {activeTab === 'coverage' && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Department × Shift Staffing Matrix</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Physical coverage distribution across hospital wings today</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.02]">
                  <th className="table-header">Department</th>
                  {SHIFTS.map(s => (
                    <th key={s.id} className="table-header text-center">
                      <span style={{ color: s.color }}>{s.code}</span>
                      <p className="font-mono text-[10px] text-gray-400 normal-case font-normal">{s.start}–{s.end}</p>
                    </th>
                  ))}
                  <th className="table-header text-center">Total Staff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {DEPT_COVERAGE.map(row => {
                  const total = row.A + row.B + row.C + row.G;
                  return (
                    <tr key={row.dept} className="table-row">
                      <td className="table-cell font-semibold text-gray-900 dark:text-white text-xs">{row.dept}</td>
                      {[
                        { val: row.A, s: SHIFTS[0] },
                        { val: row.B, s: SHIFTS[1] },
                        { val: row.C, s: SHIFTS[2] },
                        { val: row.G, s: SHIFTS[3] },
                      ].map(({ val, s }) => (
                        <td key={s.id} className="table-cell text-center font-mono">
                          <span className="text-base font-bold" style={{ color: val > 0 ? s.color : '#94a3b8' }}>
                            {val}
                          </span>
                        </td>
                      ))}
                      <td className="table-cell text-center font-mono font-bold text-gray-900 dark:text-white text-base">
                        {total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingShift && (
        <EditShiftModal
          shift={editingShift}
          onClose={() => setEditingShift(null)}
          onSave={form => handleSaveShift(editingShift.id, form)}
        />
      )}
    </div>
  );
}
