import { useState } from 'react';
import { Clock, Users, Plus, Edit3, Save, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { employees } from '../data/employees';

const SHIFTS = [
  { id: 'A', name: 'Morning Shift', code: 'Shift A', start: '06:00', end: '14:00', color: '#FBBF24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', staff: 128 },
  { id: 'B', name: 'Evening Shift', code: 'Shift B', start: '14:00', end: '22:00', color: '#38BDF8', bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.2)', staff: 96 },
  { id: 'C', name: 'Night Shift',   code: 'Shift C', start: '22:00', end: '06:00', color: '#C084FC', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)', staff: 64 },
  { id: 'G', name: 'General',       code: 'General', start: '09:00', end: '17:00', color: '#34D399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', staff: 42 },
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

// Weekly roster — random assignments per employee & day
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
      className="glass-card-hover"
      style={{ padding: 22, borderColor: shift.border }}
      onClick={() => onClick(shift)}
    >
      {/* Accent top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${shift.color}, transparent)`, borderRadius: '20px 20px 0 0' }} />
      <div className="flex items-center justify-between mb-4">
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: shift.bg, border: `1px solid ${shift.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Clock style={{ width: 20, height: 20, color: shift.color }} />
        </div>
        <span style={{
          fontSize: 22, fontWeight: 900, color: shift.color,
          fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.03em',
        }}>{shift.staff}</span>
      </div>
      <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{shift.name}</p>
      <p style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.4)' }}>
        {shift.start} — {shift.end}
      </p>
      <div style={{ marginTop: 12, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100 }}>
        <div style={{ height: '100%', width: `${(shift.staff / 330) * 100}%`, background: shift.color, borderRadius: 100 }} />
      </div>
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>
        {Math.round((shift.staff / 330) * 100)}% of workforce
      </p>
    </div>
  );
}

function EditShiftModal({ shift, onClose, onSave }) {
  const [form, setForm] = useState({ start: shift.start, end: shift.end, name: shift.name });
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-glass" style={{ width: '100%', maxWidth: 420, padding: '28px 32px' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 20 }}>Edit {shift.name}</h3>
        <div className="space-y-4">
          <div>
            <label className="input-label">Shift Name</label>
            <input className="input-field" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Start Time</label>
              <input type="time" className="input-field" value={form.start} onChange={e => setForm(p => ({ ...p, start: e.target.value }))} />
            </div>
            <div>
              <label className="input-label">End Time</label>
              <input type="time" className="input-field" value={form.end} onChange={e => setForm(p => ({ ...p, end: e.target.value }))} />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>Cancel</button>
          <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { onSave(form); onClose(); }}>
            <Save style={{ width: 14, height: 14 }} /> Save
          </button>
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

  const getShiftDisplay = (shiftId) => {
    if (shiftId === 'Off') return { label: 'Off', color: 'rgba(255,255,255,0.2)', bg: 'rgba(255,255,255,0.03)' };
    const s = SHIFTS.find(x => x.id === shiftId);
    return s ? { label: s.code, color: s.color, bg: s.bg } : { label: '?', color: '#fff', bg: 'transparent' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>Shift Management</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            Roster planning, shift master & AI coverage analysis
          </p>
        </div>
        <button className="btn-primary" onClick={() => toast.success('New shift creation form coming soon!')}>
          <Plus style={{ width: 15, height: 15 }} /> Add Shift
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {[
          { id: 'overview', label: 'Shift Master' },
          { id: 'roster', label: 'Weekly Roster' },
          { id: 'coverage', label: 'Coverage Analysis' },
        ].map(tab => (
          <button key={tab.id} className={activeTab === tab.id ? 'tab-active' : 'tab-item'} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* SHIFT MASTER */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {shifts.map(shift => (
              <ShiftCard key={shift.id} shift={shift} onClick={setEditingShift} />
            ))}
          </div>

          {/* Shift timeline */}
          <div className="glass-card" style={{ padding: 24 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 20 }}>24-Hour Shift Timeline</p>
            <div style={{ position: 'relative', height: 80 }}>
              {/* Hour markers */}
              {[0, 3, 6, 9, 12, 15, 18, 21, 24].map(h => (
                <div key={h} style={{
                  position: 'absolute', left: `${(h / 24) * 100}%`, top: 0, height: '100%',
                  borderLeft: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', position: 'absolute', top: -16, transform: 'translateX(-50%)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {String(h).padStart(2,'0')}:00
                  </span>
                </div>
              ))}
              {/* Shift bars */}
              {shifts.map((shift, i) => {
                const [sh, sm] = shift.start.split(':').map(Number);
                const [eh, em] = shift.end.split(':').map(Number);
                let startPct = ((sh * 60 + sm) / (24 * 60)) * 100;
                let endPct   = ((eh * 60 + em) / (24 * 60)) * 100;
                if (shift.id === 'C') endPct = 100; // night wraps around
                const top = [0, 25, 50, 72][i];
                return (
                  <div key={shift.id} style={{
                    position: 'absolute', left: `${startPct}%`,
                    width: `${endPct - startPct}%`,
                    top: `${top}%`, height: '20%',
                    background: `linear-gradient(90deg, ${shift.color}80, ${shift.color}50)`,
                    border: `1px solid ${shift.color}50`,
                    borderRadius: 4,
                    display: 'flex', alignItems: 'center', paddingLeft: 8,
                  }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: shift.color, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {shift.code}
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
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button className="btn-icon" onClick={() => setWeekOffset(w => w - 1)}>
                <ChevronLeft style={{ width: 14, height: 14 }} />
              </button>
              <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{weekLabel}</p>
              </div>
              <button className="btn-icon" onClick={() => setWeekOffset(w => w + 1)}>
                <ChevronRight style={{ width: 14, height: 14 }} />
              </button>
              {weekOffset !== 0 && (
                <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setWeekOffset(0)}>Today</button>
              )}
            </div>
            <input placeholder="Search employee..." value={search} onChange={e => setSearch(e.target.value)} className="input-field" style={{ width: 220, fontSize: 12 }} />
          </div>

          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <th className="table-header" style={{ textAlign: 'left', minWidth: 160 }}>Employee</th>
                    <th className="table-header" style={{ textAlign: 'left', minWidth: 100 }}>Department</th>
                    {DAYS.map(d => (
                      <th key={d} className="table-header" style={{ textAlign: 'center', minWidth: 80 }}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRoster.slice(0, 20).map((emp) => (
                    <tr key={emp.id} className="table-row">
                      <td className="table-cell">
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{emp.name}</p>
                          <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.3)' }}>{emp.id}</p>
                        </div>
                      </td>
                      <td className="table-cell" style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{emp.department}</td>
                      {emp.schedule.map((shiftId, di) => {
                        const disp = getShiftDisplay(shiftId);
                        return (
                          <td key={di} className="table-cell" style={{ textAlign: 'center' }}>
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                              color: disp.color, background: disp.bg,
                              display: 'inline-block',
                            }}>{disp.label}</span>
                          </td>
                        );
                      })}
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
        <div className="space-y-4">
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Department × Shift Coverage</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Staff count per department per shift · Today</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <th className="table-header" style={{ textAlign: 'left' }}>Department</th>
                    {SHIFTS.map(s => (
                      <th key={s.id} className="table-header" style={{ textAlign: 'center' }}>
                        <span style={{ color: s.color }}>{s.code}</span>
                        <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace', fontWeight: 400'" }}>{s.start}–{s.end}</p>
                      </th>
                    ))}
                    <th className="table-header" style={{ textAlign: 'center' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {DEPT_COVERAGE.map(row => {
                    const total = row.A + row.B + row.C + row.G;
                    return (
                      <tr key={row.dept} className="table-row">
                        <td className="table-cell" style={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>{row.dept}</td>
                        {[
                          { val: row.A, s: SHIFTS[0] },
                          { val: row.B, s: SHIFTS[1] },
                          { val: row.C, s: SHIFTS[2] },
                          { val: row.G, s: SHIFTS[3] },
                        ].map(({ val, s }) => (
                          <td key={s.id} className="table-cell" style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: 16, fontWeight: 800, color: val > 0 ? s.color : 'rgba(255,255,255,0.15)' }}>{val}</span>
                          </td>
                        ))}
                        <td className="table-cell" style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{total}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {editingShift && (
        <EditShiftModal
          shift={editingShift}
          onClose={() => setEditingShift(null)}
          onSave={(form) => handleSaveShift(editingShift.id, form)}
        />
      )}
    </div>
  );
}
