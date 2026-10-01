import { useState } from 'react';
import { Building2, Users, Video, ChevronRight, Sparkles, Activity, X } from 'lucide-react';
import { departments } from '../data/employees';

const DEPT_META = {
  'ICU':             { color: '#F87171', desc: 'Intensive Care Unit — 24/7 critical patient monitoring', cameras: 8, beds: 12, staff: 36, coverage: 96, icon: '🫀' },
  'OPD':             { color: '#38BDF8', desc: 'Outpatient Department — consultations & follow-ups',     cameras: 6, beds: 0,  staff: 28, coverage: 88, icon: '🏥' },
  'Operation Theatre':{ color: '#8B5CF6', desc: 'Sterile surgical environment — elective & emergency OT',  cameras: 4, beds: 4,  staff: 18, coverage: 92, icon: '🔬' },
  'Ward':            { color: '#34D399', desc: 'General & post-op patient wards',                         cameras: 10, beds: 60, staff: 42, coverage: 84, icon: '🛏️' },
  'Laboratory':      { color: '#06B6D4', desc: 'Clinical lab — pathology, biochemistry & microbiology',   cameras: 4,  beds: 0,  staff: 12, coverage: 85, icon: '🧪' },
  'Pharmacy':        { color: '#FBBF24', desc: 'In-house pharmacy & dispensary management',               cameras: 2,  beds: 0,  staff: 6,  coverage: 100, icon: '💊' },
  'Reception':       { color: '#FB923C', desc: 'Front desk, admissions & patient registration',           cameras: 5,  beds: 0,  staff: 10, coverage: 90, icon: '🗃️' },
  'Housekeeping':    { color: '#A78BFA', desc: 'Sanitation, infection control & facility maintenance',    cameras: 3,  beds: 0,  staff: 22, coverage: 78, icon: '🧹' },
  'Security':        { color: '#94A3B8', desc: 'Perimeter & access control — 24/7 surveillance support',  cameras: 8,  beds: 0,  staff: 12, coverage: 100, icon: '🛡️' },
  'Physiotherapy':   { color: '#10B981', desc: 'Rehabilitation & physiotherapy services',                 cameras: 2,  beds: 6,  staff: 8,  coverage: 88, icon: '💪' },
};

function DeptCard({ dept, meta, onClick }) {
  const coverage = meta?.coverage || 80;
  const color = meta?.color || '#38BDF8';
  return (
    <div
      className="glass-card-hover"
      style={{ padding: 22, position: 'relative' }}
      onClick={() => onClick({ dept, meta })}
    >
      {/* Accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, borderRadius: '20px 20px 0 0' }} />

      {/* Icon + name */}
      <div className="flex items-start justify-between mb-4">
        <div style={{ fontSize: 28, lineHeight: 1 }}>{meta?.icon || '🏥'}</div>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
          color: coverage >= 90 ? '#34D399' : coverage >= 75 ? '#FBBF24' : '#F87171',
          background: coverage >= 90 ? 'rgba(16,185,129,0.12)' : coverage >= 75 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${coverage >= 90 ? 'rgba(16,185,129,0.25)' : coverage >= 75 ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)'}`,
        }}>{coverage}% coverage</span>
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 5 }}>{dept.name || dept}</h3>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, marginBottom: 14 }}>
        {meta?.desc || 'Hospital department'}
      </p>

      {/* Coverage bar */}
      <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 100, marginBottom: 14, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${coverage}%`, borderRadius: 100,
          background: coverage >= 90 ? 'linear-gradient(90deg,#10B981,#34D399)' : coverage >= 75 ? 'linear-gradient(90deg,#F59E0B,#FBBF24)' : 'linear-gradient(90deg,#EF4444,#F87171)',
          boxShadow: coverage >= 90 ? '0 0 8px rgba(16,185,129,0.4)' : 'none',
          transition: 'width 1s ease',
        }} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Staff',    value: meta?.staff    || dept.headCount || '—' },
          { label: 'Cameras',  value: meta?.cameras  || 2 },
          { label: 'Beds',     value: meta?.beds != null ? meta.beds : '—' },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 0' }}>
            <p style={{ fontSize: 16, fontWeight: 800, color }}>{value}</p>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1 mt-3" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
        <ChevronRight style={{ width: 12, height: 12, color }} />
        <span style={{ color }}>View Details</span>
      </div>
    </div>
  );
}

function DeptDetailModal({ data, onClose }) {
  if (!data) return null;
  const { dept, meta } = data;
  const name = dept.name || dept;
  const color = meta?.color || '#38BDF8';
  const coverage = meta?.coverage || 80;

  const aiInsights = [
    `${name} has maintained ${coverage}% average coverage this week — ${coverage >= 90 ? 'excellent compliance' : 'needs attention'}.`,
    meta?.cameras > 4 ? `${meta.cameras} CCTV cameras covering ${name} with AI motion detection active.` : `${meta?.cameras || 2} cameras monitoring ${name}. Consider adding coverage in restricted zones.`,
    coverage < 85 ? `⚠️ Staffing below recommended levels. AI suggests roster adjustment for next 3 days.` : `Staffing levels are adequate. No AI alerts for this department.`,
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-glass" style={{ width: '100%', maxWidth: 580, padding: 0 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 32 }}>{meta?.icon || '🏥'}</span>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{name}</h3>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{meta?.desc || 'Hospital Department'}</p>
              </div>
            </div>
            <button className="btn-icon" style={{ padding: 7 }} onClick={onClose}><X style={{ width: 14, height: 14 }} /></button>
          </div>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Staff Total', value: meta?.staff || '—', color },
              { label: 'Beds', value: meta?.beds ?? '—', color: '#34D399' },
              { label: 'Cameras', value: meta?.cameras || 2, color: '#818CF8' },
              { label: 'Coverage', value: `${coverage}%`, color: coverage >= 90 ? '#34D399' : '#FBBF24' },
            ].map(({ label, value, color: c }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px', textAlign: 'center' }}>
                <p style={{ fontSize: 22, fontWeight: 900, color: c }}>{value}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Coverage bar */}
          <div style={{ marginBottom: 20 }}>
            <div className="flex justify-between mb-2">
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Staffing Coverage</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: coverage >= 90 ? '#34D399' : '#FBBF24' }}>{coverage}%</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${coverage}%`, borderRadius: 100,
                background: coverage >= 90 ? 'linear-gradient(90deg,#10B981,#34D399)' : 'linear-gradient(90deg,#F59E0B,#FBBF24)',
                boxShadow: `0 0 12px ${coverage >= 90 ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'}`,
                transition: 'width 1s ease',
              }} />
            </div>
          </div>

          {/* AI Insights */}
          <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 14, padding: '16px 18px' }}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles style={{ width: 14, height: 14, color: '#818CF8' }} />
              <p style={{ fontSize: 13, fontWeight: 700, color: '#818CF8' }}>AI Department Intelligence</p>
            </div>
            <div className="space-y-3">
              {aiInsights.map((insight, i) => (
                <p key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{insight}</p>
              ))}
            </div>
          </div>

          <button className="btn-primary w-full mt-5" style={{ justifyContent: 'center', fontSize: 13 }} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Departments() {
  const [selectedDept, setSelectedDept] = useState(null);
  const [search, setSearch] = useState('');

  const deptList = departments.length > 0 ? departments : Object.keys(DEPT_META).map(k => ({ id: k, name: k }));
  const filtered = deptList.filter(d => (d.name || d).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>
            Departments
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            {deptList.length} hospital departments · AI staffing intelligence enabled
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Departments', value: deptList.length, color: '#38BDF8' },
          { label: 'Fully Staffed (≥90%)', value: Object.values(DEPT_META).filter(m => m.coverage >= 90).length, color: '#34D399' },
          { label: 'Need Attention (<85%)', value: Object.values(DEPT_META).filter(m => m.coverage < 85).length, color: '#F87171' },
          { label: 'Total CCTV Cameras', value: Object.values(DEPT_META).reduce((s, m) => s + (m.cameras || 0), 0), color: '#818CF8' },
        ].map(item => (
          <div key={item.label} className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: item.color, letterSpacing: '-0.04em' }}>{item.value}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 360 }}>
        <Building2 style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(255,255,255,0.3)' }} />
        <input className="input-field" placeholder="Search departments..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36, fontSize: 12 }} />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
        {filtered.map(dept => {
          const name = dept.name || dept;
          const meta = DEPT_META[name] || null;
          return <DeptCard key={dept.id || name} dept={dept} meta={meta} onClick={setSelectedDept} />;
        })}
      </div>

      {selectedDept && <DeptDetailModal data={selectedDept} onClose={() => setSelectedDept(null)} />}
    </div>
  );
}
