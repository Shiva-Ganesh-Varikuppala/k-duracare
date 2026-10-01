import { useState } from 'react';
import { Building2, Users, Video, ChevronRight, Sparkles, Activity, X, Bed, ShieldCheck, AlertCircle } from 'lucide-react';
import { departments } from '../data/employees';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import Badge from '../components/ui/badge/Badge';
import Button from '../components/ui/button/Button';

const DEPT_META = {
  'ICU':              { color: 'error', desc: 'Intensive Care Unit — 24/7 critical patient monitoring', cameras: 8, beds: 12, staff: 36, coverage: 96, icon: '🫀' },
  'OPD':              { color: 'info', desc: 'Outpatient Department — consultations & follow-ups',     cameras: 6, beds: 0,  staff: 28, coverage: 88, icon: '🏥' },
  'Operation Theatre':{ color: 'purple', desc: 'Sterile surgical environment — elective & emergency OT',  cameras: 4, beds: 4,  staff: 18, coverage: 92, icon: '🔬' },
  'Ward':             { color: 'success', desc: 'General & post-op patient wards',                         cameras: 10, beds: 60, staff: 42, coverage: 84, icon: '🛏️' },
  'Laboratory':       { color: 'info', desc: 'Clinical lab — pathology, biochemistry & microbiology',   cameras: 4,  beds: 0,  staff: 12, coverage: 85, icon: '🧪' },
  'Pharmacy':         { color: 'warning', desc: 'In-house pharmacy & dispensary management',               cameras: 2,  beds: 0,  staff: 6,  coverage: 100, icon: '💊' },
  'Reception':        { color: 'warning', desc: 'Front desk, admissions & patient registration',           cameras: 5,  beds: 0,  staff: 10, coverage: 90, icon: '🗃️' },
  'Housekeeping':     { color: 'purple', desc: 'Sanitation, infection control & facility maintenance',    cameras: 3,  beds: 0,  staff: 22, coverage: 78, icon: '🧹' },
  'Security':         { color: 'light', desc: 'Perimeter & access control — 24/7 surveillance support',  cameras: 8,  beds: 0,  staff: 12, coverage: 100, icon: '🛡️' },
  'Physiotherapy':    { color: 'success', desc: 'Rehabilitation & physiotherapy services',                 cameras: 2,  beds: 6,  staff: 8,  coverage: 88, icon: '💪' },
};

function DeptCard({ dept, meta, onClick }) {
  const coverage = meta?.coverage || 80;
  const badgeColor = coverage >= 90 ? 'success' : coverage >= 75 ? 'warning' : 'error';
  const progressBg = coverage >= 90 ? 'bg-emerald-500' : coverage >= 75 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div
      className="group relative cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:border-brand-300 hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-500/30"
      onClick={() => onClick({ dept, meta })}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 dark:bg-white/[0.04] text-2xl border border-gray-100 dark:border-gray-800">
          {meta?.icon || '🏥'}
        </div>
        <Badge variant="light" color={badgeColor} size="sm">
          {coverage}% Coverage
        </Badge>
      </div>

      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {dept.name || dept}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
        {meta?.desc || 'Hospital department facility'}
      </p>

      {/* Coverage Progress Bar */}
      <div className="mb-4">
        <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            className={`h-full rounded-full ${progressBg} transition-all duration-500`}
            style={{ width: `${coverage}%` }}
          />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 rounded-xl border border-gray-100 bg-gray-50/60 p-2.5 text-center text-xs dark:border-gray-800 dark:bg-white/[0.01]">
        <div>
          <p className="font-mono font-bold text-gray-900 dark:text-white text-sm">
            {meta?.staff || dept.headCount || '—'}
          </p>
          <p className="text-[10px] text-gray-400 uppercase mt-0.5">Staff</p>
        </div>
        <div>
          <p className="font-mono font-bold text-gray-900 dark:text-white text-sm">
            {meta?.cameras || 2}
          </p>
          <p className="text-[10px] text-gray-400 uppercase mt-0.5">CCTV</p>
        </div>
        <div>
          <p className="font-mono font-bold text-gray-900 dark:text-white text-sm">
            {meta?.beds != null ? meta.beds : '—'}
          </p>
          <p className="text-[10px] text-gray-400 uppercase mt-0.5">Beds</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
        <span>Station Intelligence</span>
        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
}

function DeptDetailModal({ data, onClose }) {
  if (!data) return null;
  const { dept, meta } = data;
  const name = dept.name || dept;
  const coverage = meta?.coverage || 80;

  const aiInsights = [
    `${name} has maintained a ${coverage}% average staffing fulfillment across all 3 shifts this week.`,
    meta?.cameras > 4
      ? `${meta.cameras} optical video channels actively stream telemetry with AI motion analysis enabled.`
      : `${meta?.cameras || 2} operational cameras covering entry/exit points for this station.`,
    coverage < 85
      ? 'Alert: Staffing dropped below 85% safety baseline. Immediate roster re-balancing recommended.'
      : 'Optimal staffing compliance maintained. Zero consequential alerts logged.',
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-glass max-w-xl p-0 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-800">
          <div className="flex items-center gap-3.5">
            <span className="text-3xl">{meta?.icon || '🏥'}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{meta?.desc}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Staff Total', value: meta?.staff || '—', color: 'text-brand-600 dark:text-brand-400' },
              { label: 'Bed Capacity', value: meta?.beds ?? '—', color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'CCTV Feeds', value: meta?.cameras || 2, color: 'text-purple-600 dark:text-purple-400' },
              { label: 'Staff Coverage', value: `${coverage}%`, color: coverage >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 text-center dark:border-gray-800 dark:bg-white/[0.02]">
                <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
                <p className="text-[10px] text-gray-400 uppercase mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* AI Insights Card */}
          <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 dark:border-brand-500/20 dark:bg-brand-500/10">
            <div className="flex items-center gap-2 mb-2 font-bold text-brand-800 dark:text-brand-300 text-xs">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Department AI Synthesis</span>
            </div>
            <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              {aiInsights.map((insight, i) => (
                <p key={i} className="flex items-start gap-2">
                  <span className="text-brand-500 font-bold">•</span>
                  <span>{insight}</span>
                </p>
              ))}
            </div>
          </div>

          <Button variant="primary" className="w-full justify-center" onClick={onClose}>
            Close Inspection
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Departments() {
  const [selectedDept, setSelectedDept] = useState(null);
  const [search, setSearch]             = useState('');

  const deptList = departments.length > 0 ? departments : Object.keys(DEPT_META).map(k => ({ id: k, name: k }));
  const filtered = deptList.filter(d => (d.name || d).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb
          pageTitle="Hospital Clinical & Administrative Wings"
          breadcrumbs={[
            { label: 'Workforce', path: '/employees' },
            { label: 'Departments' }
          ]}
        />
        <div className="relative min-w-[240px]">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input-field pl-9 text-xs"
            placeholder="Search wing or department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Departments', value: deptList.length, color: 'text-brand-600 dark:text-brand-400' },
          { label: 'Fully Staffed (≥90%)', value: Object.values(DEPT_META).filter(m => m.coverage >= 90).length, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Needs Attention (<85%)', value: Object.values(DEPT_META).filter(m => m.coverage < 85).length, color: 'text-rose-600 dark:text-rose-400' },
          { label: 'Total Video Cameras', value: Object.values(DEPT_META).reduce((s, m) => s + (m.cameras || 0), 0), color: 'text-purple-600 dark:text-purple-400' },
        ].map(item => (
          <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <p className={`text-2xl sm:text-3xl font-bold font-mono ${item.color}`}>{item.value}</p>
            <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
