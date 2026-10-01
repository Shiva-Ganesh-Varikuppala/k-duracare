import { useState } from 'react';
import { Shield, Users, Check, X, Search, Filter, Sparkles, Award, Clock, ArrowRight, UserCheck, AlertCircle, ChevronRight, Eye } from 'lucide-react';

const ROLES_DATA = [
  {
    id: 'ROLE-DOC',
    title: 'Doctors & Consultants',
    category: 'Medical',
    headcount: 24,
    onDuty: 14,
    color: '#0EA5E9',
    badge: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    salaryBand: '₹55,000 – ₹1,80,000 / mo',
    shifts: ['Morning (A)', 'Evening (B)', 'On-Call'],
    description: 'Senior Consultants, Resident Medical Officers (RMO), and Visiting Specialists.',
    permissions: {
      patientRecords: true,
      dutyRoster: false,
      leaveApprove: true,
      cctvAccess: false,
      payrollAccess: false,
      biometricBypass: true,
    },
    designations: ['Chief Medical Officer', 'Consultant Physician', 'Resident Doctor', 'Surgeon', 'Anesthetist'],
    aiRecommendation: 'Sufficient weekend coverage; recommend 1 additional on-call RMO for Friday nights.',
  },
  {
    id: 'ROLE-NURSE-SR',
    title: 'Senior Nursing Staff',
    category: 'Medical',
    headcount: 42,
    onDuty: 28,
    color: '#38BDF8',
    badge: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    salaryBand: '₹28,000 – ₹42,000 / mo',
    shifts: ['Morning (A)', 'Evening (B)', 'Night (C)'],
    description: 'Ward In-charges, ICU Senior Nurses, and Operation Theatre Nursing Officers.',
    permissions: {
      patientRecords: true,
      dutyRoster: true,
      leaveApprove: false,
      cctvAccess: false,
      payrollAccess: false,
      biometricBypass: false,
    },
    designations: ['Nursing Superintendent', 'ICU Charge Nurse', 'OT Scrub Nurse', 'Ward Supervisor'],
    aiRecommendation: 'Shift rotation balanced at 96% compliance with NABH nurse-to-patient guidelines.',
  },
  {
    id: 'ROLE-NURSE-JR',
    title: 'Staff Nurses & Trainees',
    category: 'Medical',
    headcount: 78,
    onDuty: 56,
    color: '#6366F1',
    badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    salaryBand: '₹20,000 – ₹28,000 / mo',
    shifts: ['Morning (A)', 'Evening (B)', 'Night (C)'],
    description: 'Floor staff nurses handling inpatient wards, vitals recording, and IV administration.',
    permissions: {
      patientRecords: true,
      dutyRoster: false,
      leaveApprove: false,
      cctvAccess: false,
      payrollAccess: false,
      biometricBypass: false,
    },
    designations: ['General Ward Nurse', 'Pediatric Care Nurse', 'Post-Op Nurse', 'Junior Trainee'],
    aiRecommendation: 'Night shift fatigue index slightly elevated (score 4.2/10). Recommend 2 additional rotational off-days.',
  },
  {
    id: 'ROLE-TECH',
    title: 'Diagnostic & Lab Technicians',
    category: 'Medical',
    headcount: 22,
    onDuty: 16,
    color: '#10B981',
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    salaryBand: '₹22,000 – ₹35,000 / mo',
    shifts: ['Morning (A)', 'Evening (B)', 'Night (On-Call)'],
    description: 'Pathology lab technicians, X-Ray/Radiology operators, and Biochemistry analysts.',
    permissions: {
      patientRecords: true,
      dutyRoster: false,
      leaveApprove: false,
      cctvAccess: false,
      payrollAccess: false,
      biometricBypass: false,
    },
    designations: ['Senior Biochemist', 'Lab Technician Grade-1', 'Radiographer', 'Phlebotomist'],
    aiRecommendation: 'Morning sample rush between 07:30–09:30 handled at 92% efficiency.',
  },
  {
    id: 'ROLE-RECEPT',
    title: 'Front Desk & Reception Staff',
    category: 'Administrative',
    headcount: 16,
    onDuty: 10,
    color: '#EC4899',
    badge: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    salaryBand: '₹16,000 – ₹26,000 / mo',
    shifts: ['General (G)', 'Morning (A)', 'Evening (B)'],
    description: 'Patient admissions, outpatient registration, billing counters, and helpdesk operations.',
    permissions: {
      patientRecords: true,
      dutyRoster: false,
      leaveApprove: false,
      cctvAccess: false,
      payrollAccess: false,
      biometricBypass: false,
    },
    designations: ['Front Office Lead', 'Admission Executive', 'Billing Clerk', 'Patient Care Coordinator'],
    aiRecommendation: 'Peak queue time detected at 10:15 AM; automatic counter 4 dynamic activation recommended.',
  },
  {
    id: 'ROLE-HR-ADMIN',
    title: 'HR & Hospital Management',
    category: 'Administrative',
    headcount: 12,
    onDuty: 11,
    color: '#8B5CF6',
    badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    salaryBand: '₹32,000 – ₹85,000 / mo',
    shifts: ['General (G)'],
    description: 'Workforce governance, payroll processing, statutory compliance, and executive operations.',
    permissions: {
      patientRecords: false,
      dutyRoster: true,
      leaveApprove: true,
      cctvAccess: true,
      payrollAccess: true,
      biometricBypass: true,
    },
    designations: ['HR Director', 'Payroll Manager', 'Staffing Specialist', 'Compliance Officer'],
    aiRecommendation: 'Automated salary reconciliation completed for 326 employees with 0 unverified deductions.',
  },
  {
    id: 'ROLE-SECURITY',
    title: 'Security Personnel',
    category: 'Support',
    headcount: 36,
    onDuty: 24,
    color: '#F59E0B',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    salaryBand: '₹14,000 – ₹20,000 / mo',
    shifts: ['Morning (A)', 'Evening (B)', 'Night (C)'],
    description: 'Campus perimeter security, entrance gate monitoring, emergency triage order, and CCTV observation.',
    permissions: {
      patientRecords: false,
      dutyRoster: false,
      leaveApprove: false,
      cctvAccess: true,
      payrollAccess: false,
      biometricBypass: false,
    },
    designations: ['Chief Security Officer', 'Gate Commander', 'Night Patroller', 'Parking Warden'],
    aiRecommendation: 'Emergency bay clear corridor adherence rate 99.4%. Night guard patrol checkpoints synchronized.',
  },
  {
    id: 'ROLE-HOUSEKEEP',
    title: 'Housekeeping, Aayah & Sweepers',
    category: 'Support',
    headcount: 72,
    onDuty: 52,
    color: '#14B8A6',
    badge: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    salaryBand: '₹11,000 – ₹16,500 / mo',
    shifts: ['Morning (A)', 'Evening (B)', 'Night (C)'],
    description: 'Ward sanitization, bio-waste collection, linen replenishment, ICU sterile cleaning, and patient assistance.',
    permissions: {
      patientRecords: false,
      dutyRoster: false,
      leaveApprove: false,
      cctvAccess: false,
      payrollAccess: false,
      biometricBypass: false,
    },
    designations: ['Housekeeping Supervisor', 'Ward Aayah', 'Bio-Medical Waste Scavenger', 'Floor Sweeper', 'Dhobi (Laundry Incharge)'],
    aiRecommendation: 'ICU floor disinfection verified every 90 minutes via AI camera clean-event logging.',
  },
];

export default function Roles() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState(ROLES_DATA[0]);

  const categories = ['All', 'Medical', 'Administrative', 'Support'];

  const filteredRoles = ROLES_DATA.filter(role => {
    const matchesCat = selectedCategory === 'All' || role.category === selectedCategory;
    const matchesSearch = role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          role.designations.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const totalHeadcount = ROLES_DATA.reduce((acc, r) => acc + r.headcount, 0);
  const totalOnDuty = ROLES_DATA.reduce((acc, r) => acc + r.onDuty, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-sky-400" /> Roles & Designations Master
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Hospital organizational hierarchy, access permissions, headcount distribution, and AI staffing governance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-2 text-sky-400">
            <Sparkles className="w-3.5 h-3.5" /> NABH Compliance Active
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Shield className="w-4 h-4" /> Add Role Definition
          </button>
        </div>
      </div>

      {/* Overview Stat Cards with Hover Effects */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card-hover p-4 border border-slate-700/60 transition-all duration-300 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Roles Defined</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{ROLES_DATA.length}</p>
          <p className="text-xs text-slate-400 mt-1">Across 3 core tiers</p>
        </div>

        <div className="glass-card-hover p-4 border border-slate-700/60 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Staff Headcount</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">{totalHeadcount}</p>
          <p className="text-xs text-slate-400 mt-1">Active hospital payroll</p>
        </div>

        <div className="glass-card-hover p-4 border border-slate-700/60 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Currently On Duty</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-indigo-400">{totalOnDuty}</p>
          <p className="text-xs text-slate-400 mt-1">{Math.round((totalOnDuty / totalHeadcount) * 100)}% active duty ratio</p>
        </div>

        <div className="glass-card-hover p-4 border border-slate-700/60 transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Support Staff Ratio</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Award className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-400">33.1%</p>
          <p className="text-xs text-slate-400 mt-1">Aayah, Sweepers, Security, Dhobi</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'bg-navy-800 text-slate-400 hover:text-slate-200 hover:bg-navy-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search role or designation..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-field pl-9 text-xs w-full"
          />
        </div>
      </div>

      {/* Main Grid: Role Cards List + Interactive Selected Role Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Role Cards List (2 cols) */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRoles.map(role => {
            const isSelected = selectedRole?.id === role.id;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`glass-card p-5 cursor-pointer rounded-xl border transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl relative overflow-hidden group ${
                  isSelected
                    ? 'border-sky-500 ring-1 ring-sky-500/50 bg-gradient-to-br from-navy-800 to-navy-900 shadow-sky-500/10 shadow-lg'
                    : 'border-slate-700/60 hover:border-slate-500/60 bg-navy-800/60'
                }`}
              >
                {/* Top decorative accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
                  style={{ backgroundColor: role.color }}
                />

                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${role.badge}`}>
                      {role.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5 group-hover:text-sky-300 transition-colors">
                      {role.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-white">{role.onDuty}</span>
                    <span className="text-xs text-slate-400">/{role.headcount}</span>
                    <p className="text-[10px] text-emerald-400 font-medium">On Duty</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {role.description}
                </p>

                {/* Designations tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {role.designations.slice(0, 3).map((d, i) => (
                    <span key={i} className="text-[11px] bg-navy-900/80 text-slate-300 px-2 py-0.5 rounded border border-navy-700">
                      {d}
                    </span>
                  ))}
                  {role.designations.length > 3 && (
                    <span className="text-[11px] bg-navy-900 text-slate-400 px-1.5 py-0.5 rounded">
                      +{role.designations.length - 3}
                    </span>
                  )}
                </div>

                {/* Footer specs */}
                <div className="pt-3 border-t border-navy-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-slate-300">{role.salaryBand.split('/')[0]}</span>
                  <div className="flex items-center gap-1 text-sky-400 group-hover:translate-x-1 transition-transform">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Role Detail Inspector Panel */}
        <div className="glass-card p-6 border border-slate-700/70 rounded-xl space-y-6 h-fit sticky top-20">
          {selectedRole ? (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${selectedRole.badge}`}>
                    {selectedRole.category} Tier
                  </span>
                  <span className="text-xs font-mono text-slate-400">{selectedRole.id}</span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedRole.title}</h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{selectedRole.description}</p>
              </div>

              {/* Headcount progress */}
              <div className="bg-navy-800/80 rounded-xl p-4 border border-navy-700">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-300 font-medium">Deployment Status</span>
                  <span className="text-emerald-400 font-bold">{selectedRole.onDuty} Active / {selectedRole.headcount} Enrolled</span>
                </div>
                <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full"
                    style={{ width: `${(selectedRole.onDuty / selectedRole.headcount) * 100}%` }}
                  />
                </div>
              </div>

              {/* Designations in this Role */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Mapped Hospital Designations</p>
                <div className="space-y-1.5">
                  {selectedRole.designations.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-navy-800/50 px-3 py-2 rounded-lg border border-navy-700/60">
                      <span className="text-slate-200 font-medium">{d}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Rank {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permissions Matrix */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Security & Access Privileges</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedRole.permissions).map(([perm, allowed]) => (
                    <div
                      key={perm}
                      className={`flex items-center gap-2 p-2 rounded-lg border ${
                        allowed
                          ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                          : 'bg-navy-900 border-navy-800 text-slate-500'
                      }`}
                    >
                      {allowed ? <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> : <X className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />}
                      <span className="capitalize truncate text-[11px]">
                        {perm.replace(/([A-Z])/g, ' $1')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Staffing Intelligence */}
              <div className="ai-card p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold tracking-wide">K-DuraCare AI Staffing Engine</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedRole.aiRecommendation}
                </p>
              </div>

              {/* Assigned Shifts */}
              <div className="pt-2 border-t border-navy-700 flex items-center justify-between text-xs">
                <span className="text-slate-400">Allowed Shifts:</span>
                <span className="text-sky-300 font-medium">{selectedRole.shifts.join(', ')}</span>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select any role card to inspect permissions and headcount details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
