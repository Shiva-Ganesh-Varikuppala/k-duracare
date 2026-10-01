import { useState } from 'react';
import { Shield, Users, Check, X, Search, Sparkles, Award, UserCheck, ChevronRight } from 'lucide-react';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import Badge from '../components/ui/badge/Badge';
import Button from '../components/ui/button/Button';

const ROLES_DATA = [
  {
    id: 'ROLE-DOC',
    title: 'Doctors & Consultants',
    category: 'Medical',
    headcount: 24,
    onDuty: 14,
    color: '#0ea5e9',
    badgeColor: 'info',
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
    color: '#38bdf8',
    badgeColor: 'primary',
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
    color: '#6366f1',
    badgeColor: 'purple',
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
    color: '#10b981',
    badgeColor: 'success',
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
    color: '#ec4899',
    badgeColor: 'warning',
    salaryBand: '₹16,000 – ₹24,000 / mo',
    shifts: ['General (G)', 'Morning (A)', 'Evening (B)'],
    description: 'Patient admissions, OPD registration, insurance claims desk, and billing counters.',
    permissions: {
      patientRecords: true,
      dutyRoster: false,
      leaveApprove: false,
      cctvAccess: true,
      payrollAccess: false,
      biometricBypass: false,
    },
    designations: ['Reception Lead', 'Billing Executive', 'Admission Desk Officer', 'Insurance Coordinator'],
    aiRecommendation: 'Discharge processing peak detected between 11:00–13:00; recommend staffing 2 concurrent billing desks.',
  },
  {
    id: 'ROLE-SEC',
    title: 'Security & Access Control',
    category: 'Support',
    headcount: 18,
    onDuty: 14,
    color: '#64748b',
    badgeColor: 'light',
    salaryBand: '₹14,000 – ₹19,000 / mo',
    shifts: ['Shift A (06:00)', 'Shift B (14:00)', 'Shift C (22:00)'],
    description: 'Campus perimeter, emergency ramp, pharmacy stock gate, and maternity ward security.',
    permissions: {
      patientRecords: false,
      dutyRoster: false,
      leaveApprove: false,
      cctvAccess: true,
      payrollAccess: false,
      biometricBypass: false,
    },
    designations: ['Head Guard', 'Main Gate Sentinel', 'ICU Access Guard', 'Parking Marshall'],
    aiRecommendation: '100% post presence maintained across all 6 surveillance zones during shift handovers.',
  },
  {
    id: 'ROLE-HOUSE',
    title: 'Housekeeping & Sanitation',
    category: 'Support',
    headcount: 36,
    onDuty: 24,
    color: '#8b5cf6',
    badgeColor: 'purple',
    salaryBand: '₹12,000 – ₹16,000 / mo',
    shifts: ['Shift A', 'Shift B', 'Shift C'],
    description: 'Floor sweepers, bio-medical waste handlers, ward sanitizers, and laundry personnel.',
    permissions: {
      patientRecords: false,
      dutyRoster: false,
      leaveApprove: false,
      cctvAccess: false,
      payrollAccess: false,
      biometricBypass: false,
    },
    designations: ['Housekeeping Supervisor', 'Ward Sanitizer', 'BMW Handler', 'Laundry Operator'],
    aiRecommendation: 'OT disinfection turnaround averaged 14 minutes; within 18-minute hospital benchmark.',
  },
  {
    id: 'ROLE-ADMIN',
    title: 'Hospital Operations & Admin',
    category: 'Administrative',
    headcount: 12,
    onDuty: 8,
    color: '#f59e0b',
    badgeColor: 'warning',
    salaryBand: '₹35,000 – ₹90,000 / mo',
    shifts: ['General (09:00 – 18:00)'],
    description: 'HR manager, biomedical engineer, pharmacy inventory officer, and facility coordinator.',
    permissions: {
      patientRecords: true,
      dutyRoster: true,
      leaveApprove: true,
      cctvAccess: true,
      payrollAccess: true,
      biometricBypass: false,
    },
    designations: ['Operations Manager', 'HR Executive', 'Biomedical Engineer', 'Stores & Pharmacy Lead'],
    aiRecommendation: 'HR muster reconciliation running seamlessly with 99.4% daily punch compliance.',
  },
];

export default function Roles() {
  const [selectedRole, setSelectedRole]         = useState(ROLES_DATA[0]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm]             = useState('');

  const categories = ['All', 'Medical', 'Administrative', 'Support'];

  const filteredRoles = ROLES_DATA.filter(role => {
    const matchCat  = selectedCategory === 'All' || role.category === selectedCategory;
    const matchName = role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      role.designations.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchName;
  });

  const totalHeadcount = ROLES_DATA.reduce((acc, r) => acc + r.headcount, 0);
  const totalOnDuty    = ROLES_DATA.reduce((acc, r) => acc + r.onDuty, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb
          pageTitle="Role-Based Access Control (RBAC)"
          breadcrumbs={[
            { label: 'Workforce', path: '/employees' },
            { label: 'Roles & Privileges' }
          ]}
        />
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">
          <Shield className="w-3.5 h-3.5" /> 22 Granular Clearance Roles
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Total Staff Roles
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-brand-600 dark:text-brand-400">
            {ROLES_DATA.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Total Enrolled Staff
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-gray-900 dark:text-white">
            {totalHeadcount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Active On-Duty Now
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {totalOnDuty}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Active Duty Ratio
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-purple-600 dark:text-purple-400">
            {Math.round((totalOnDuty / totalHeadcount) * 100)}%
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-100 p-1.5 dark:border-gray-800 dark:bg-gray-900/60 w-fit">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-brand-600 shadow-xs dark:bg-brand-500 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {cat} Tier
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search role or designation..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-field pl-9 text-xs"
          />
        </div>
      </div>

      {/* Grid: Role Cards List + Selected Role Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Role Cards List */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRoles.map(role => {
            const isSelected = selectedRole?.id === role.id;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`group relative cursor-pointer rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/20 dark:border-brand-500 dark:bg-brand-500/10 ring-1 ring-brand-500'
                    : 'border-gray-200 bg-white hover:border-brand-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-500/30'
                }`}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{ backgroundColor: role.color }}
                />

                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <Badge variant="light" color={role.badgeColor} size="sm">
                      {role.category}
                    </Badge>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {role.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                      {role.onDuty}<span className="text-xs text-gray-400 font-normal">/{role.headcount}</span>
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">On Duty</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                  {role.description}
                </p>

                {/* Designation tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {role.designations.slice(0, 3).map((d, i) => (
                    <span key={i} className="rounded-md border border-gray-100 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-300">
                      {d}
                    </span>
                  ))}
                  {role.designations.length > 3 && (
                    <span className="rounded-md border border-gray-100 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:border-gray-800 dark:bg-white/[0.02]">
                      +{role.designations.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs dark:border-gray-800">
                  <span className="font-mono text-gray-500 dark:text-gray-400 text-[11px]">
                    {role.salaryBand.split('/')[0]}
                  </span>
                  <div className="flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Role Inspector Panel */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03] space-y-5 h-fit xl:sticky xl:top-20">
          {selectedRole ? (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="light" color={selectedRole.badgeColor} size="sm">
                    {selectedRole.category} Tier
                  </Badge>
                  <span className="font-mono text-xs text-gray-400">{selectedRole.id}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedRole.title}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {selectedRole.description}
                </p>
              </div>

              {/* Headcount progress */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 dark:border-gray-800 dark:bg-white/[0.02]">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Deployment Status</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedRole.onDuty} Active / {selectedRole.headcount} Enrolled
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all duration-300"
                    style={{ width: `${(selectedRole.onDuty / selectedRole.headcount) * 100}%` }}
                  />
                </div>
              </div>

              {/* Designations */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Designation Hierarchy
                </p>
                <div className="space-y-1.5">
                  {selectedRole.designations.map((d, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2 text-xs dark:border-gray-800 dark:bg-white/[0.01]">
                      <span className="font-medium text-gray-800 dark:text-gray-200">{d}</span>
                      <span className="font-mono text-[10px] text-gray-400">Rank {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permissions Matrix */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  RBAC Security Permissions
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedRole.permissions).map(([perm, allowed]) => (
                    <div
                      key={perm}
                      className={`flex items-center gap-2 rounded-lg border p-2 ${
                        allowed
                          ? 'border-emerald-200 bg-emerald-50/50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
                          : 'border-gray-200 bg-gray-50/50 text-gray-400 dark:border-gray-800 dark:bg-white/[0.01]'
                      }`}
                    >
                      {allowed ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className="capitalize truncate text-[11px] font-medium">
                        {perm.replace(/([A-Z])/g, ' $1')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-3.5 dark:border-brand-500/20 dark:bg-brand-500/10">
                <div className="flex items-center gap-1.5 mb-1.5 text-brand-700 dark:text-brand-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  <span>AI Staffing Recommendation</span>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedRole.aiRecommendation}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400">Assigned Shift Codes:</span>
                <span className="font-medium text-brand-600 dark:text-brand-400">{selectedRole.shifts.join(', ')}</span>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-xs">Select any role card to view granular privileges</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
