import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  SUPER_ADMIN: 'Super Administrator',
  MANAGEMENT: 'Hospital Administrator / Management',
  HR_ADMIN: 'HR Administrator',
  PAYROLL_OFFICER: 'Payroll Officer',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  ICU_STAFF: 'ICU Staff',
  OPD_STAFF: 'OPD Staff',
  LAB_STAFF: 'Laboratory Staff',
  OT_STAFF: 'OT Staff',
  PHYSIO_STAFF: 'Physiotherapy Staff',
  RECEPTIONIST: 'Receptionist',
  HOUSEKEEPING_SUPERVISOR: 'Housekeeping Supervisor',
  AAYAH: 'Aayah',
  SWEEPER: 'Sweeper',
  SCAVENGER: 'Scavenger',
  DHOBI: 'Dhobi',
  SECURITY_SUPERVISOR: 'Security Supervisor',
  SECURITY_GUARD: 'Security Guard',
  ATTENDANCE_OFFICER: 'Attendance / HR Operations Officer',
  HOD: 'Department Head / HOD',
  EMPLOYEE: 'Staff Employee',
};

export const DEMO_USERS = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@kduracare.in',
    password: 'admin123',
    name: 'Dr K. B. Chowdary',
    role: ROLES.SUPER_ADMIN,
    dept: 'Hospital Administration',
    empId: 'KD-ADM-001',
    avatar: 'KC',
    title: 'Medical Director & Super Admin',
    clearance: 'Level 5 (Unrestricted Hospital Command)',
    scope: 'HOSPITAL_ALL'
  },
  {
    id: 2,
    username: 'management',
    email: 'management@kduracare.in',
    password: 'mgmt123',
    name: 'Sri P. Venkateswara Rao',
    role: ROLES.MANAGEMENT,
    dept: 'Hospital Management & Board',
    empId: 'KD-MGT-001',
    avatar: 'VR',
    title: 'Managing Director & Trustee',
    clearance: 'Level 4 (Executive Hospital Overview)',
    scope: 'HOSPITAL_EXECUTIVE'
  },
  {
    id: 3,
    username: 'hr',
    email: 'hr@kduracare.in',
    password: 'hr123',
    name: 'Mrs. Sunitha Reddy',
    role: ROLES.HR_ADMIN,
    dept: 'HR & Administration',
    empId: 'KD-HR-001',
    avatar: 'SR',
    title: 'Head of Human Resources',
    clearance: 'Level 4 (Workforce, Rosters & Leave)',
    scope: 'WORKFORCE_OPS'
  },
  {
    id: 4,
    username: 'payroll',
    email: 'payroll@kduracare.in',
    password: 'pay123',
    name: 'Mr. Rajesh Varma',
    role: ROLES.PAYROLL_OFFICER,
    dept: 'Accounts & Finance',
    empId: 'KD-PAY-001',
    avatar: 'RV',
    title: 'Senior Payroll & Accounts Officer',
    clearance: 'Level 3 (Compensation & Salary Structures)',
    scope: 'FINANCIAL_PAYROLL'
  },
  {
    id: 5,
    username: 'doctor',
    email: 'doctor@kduracare.in',
    password: 'doc123',
    name: 'Dr. Ravi Shankar',
    role: ROLES.DOCTOR,
    dept: 'Cardiology & Critical Care',
    empId: 'KD-DOC-001',
    avatar: 'RS',
    title: 'Chief Cardiologist & Senior Consultant',
    clearance: 'Level 3 (Clinical & Assigned Inpatients)',
    scope: 'AUTHORIZED_PATIENTS_ONLY'
  },
  {
    id: 6,
    username: 'nurse',
    email: 'nurse@kduracare.in',
    password: 'nurse123',
    passwordAlt: 'nursing123',
    name: 'Mrs. Lakshmi Devi',
    role: ROLES.NURSE,
    dept: 'Nursing & Inpatient Care',
    empId: 'KD-NUR-001',
    avatar: 'LD',
    title: 'Nursing Superintendent',
    clearance: 'Level 3 (Ward Nursing & Meds)',
    assignedWard: 'Ward B',
    scope: 'ASSIGNED_WARD_ONLY'
  },
  {
    id: 7,
    username: 'icu',
    email: 'icu@kduracare.in',
    password: 'icu123',
    name: 'Kavitha Nair',
    role: ROLES.ICU_STAFF,
    dept: 'Intensive Care Unit (ICU)',
    empId: 'KD-ICU-004',
    avatar: 'KN',
    title: 'Senior ICU Staff Nurse',
    clearance: 'Level 3 (ICU Beds & Vitals Telemetry)',
    assignedWard: 'ICU',
    scope: 'ICU_UNIT_ONLY'
  },
  {
    id: 8,
    username: 'opd',
    email: 'opd@kduracare.in',
    password: 'opd123',
    name: 'Priya Nair',
    role: ROLES.OPD_STAFF,
    dept: 'Outpatient Department (OPD)',
    empId: 'KD-OPD-002',
    avatar: 'PN',
    title: 'OPD In-Charge & Care Coordinator',
    clearance: 'Level 2 (OPD Queue & Appointments)',
    scope: 'OPD_UNIT_ONLY'
  },
  {
    id: 9,
    username: 'lab',
    email: 'lab@kduracare.in',
    password: 'lab123',
    name: 'Mr. Venkat Kumar',
    role: ROLES.LAB_STAFF,
    dept: 'Diagnostic Laboratory',
    empId: 'KD-LAB-001',
    avatar: 'VK',
    title: 'Chief Medical Biochemist',
    clearance: 'Level 2 (Lab Samples & Test Processing)',
    scope: 'LAB_SAMPLES_ONLY'
  },
  {
    id: 10,
    username: 'ot',
    email: 'ot@kduracare.in',
    password: 'ot123',
    name: 'Dr. Anand Sharma',
    role: ROLES.OT_STAFF,
    dept: 'Operation Theatre Complex',
    empId: 'KD-OT-001',
    avatar: 'AS',
    title: 'OT Head & Consultant Surgeon',
    clearance: 'Level 3 (Surgical Suites & OT Team)',
    scope: 'OT_PROCEDURES_ONLY'
  },
  {
    id: 11,
    username: 'physio',
    email: 'physio@kduracare.in',
    password: 'physio123',
    name: 'Mr. Ravi Teja',
    role: ROLES.PHYSIO_STAFF,
    dept: 'Physiotherapy & Rehab',
    empId: 'KD-PHY-001',
    avatar: 'RT',
    title: 'Senior Clinical Physiotherapist',
    clearance: 'Level 2 (Rehab & Mobility Sessions)',
    scope: 'PHYSIO_SESSIONS_ONLY'
  },
  {
    id: 12,
    username: 'reception',
    email: 'reception@kduracare.in',
    password: 'rec123',
    name: 'Mrs. Priya Sharma',
    role: ROLES.RECEPTIONIST,
    dept: 'Front Desk & Patient Care',
    empId: 'KD-REC-001',
    avatar: 'PS',
    title: 'Front Desk Executive',
    clearance: 'Level 1 (Patient Reg & Tokens)',
    scope: 'FRONT_DESK_NO_CLINICAL'
  },
  {
    id: 13,
    username: 'housekeeping',
    email: 'housekeeping@kduracare.in',
    password: 'hsk123',
    name: 'Mr. Suresh Yadav',
    role: ROLES.HOUSEKEEPING_SUPERVISOR,
    dept: 'Sanitation & Facility',
    empId: 'KD-HSK-001',
    avatar: 'SY',
    title: 'Housekeeping & Facility Supervisor',
    clearance: 'Level 2 (Sanitation Crew & Audit)',
    scope: 'HOUSEKEEPING_CREW'
  },
  {
    id: 14,
    username: 'aayah',
    email: 'aayah@kduracare.in',
    password: 'aayah123',
    name: 'Mrs. Meena Yadav',
    role: ROLES.AAYAH,
    dept: 'Inpatient Ward Support',
    empId: 'KD-AYH-012',
    avatar: 'MY',
    title: 'Ward Support Caregiver (Aayah)',
    clearance: 'Level 1 (Assigned Ward Assistance)',
    assignedArea: 'Ward B',
    scope: 'SELF_WARD_B'
  },
  {
    id: 15,
    username: 'sweeper',
    email: 'sweeper@kduracare.in',
    password: 'sweep123',
    name: 'Mr. Kiran Babu',
    role: ROLES.SWEEPER,
    dept: 'Environmental Sanitation',
    empId: 'KD-SWP-008',
    avatar: 'KB',
    title: 'Sanitation Sweeper',
    clearance: 'Level 1 (Assigned Corridor Zones)',
    assignedArea: 'Corridors & Ward B',
    scope: 'SELF_CORRIDORS'
  },
  {
    id: 16,
    username: 'scavenger',
    email: 'scavenger@kduracare.in',
    password: 'scav123',
    name: 'Mr. Naresh Goud',
    role: ROLES.SCAVENGER,
    dept: 'Biohazard & Waste Ops',
    empId: 'KD-SCV-003',
    avatar: 'NG',
    title: 'Biomedical Waste Disposal Operator',
    clearance: 'Level 1 (Biohazard Waste Manifest)',
    assignedArea: 'Waste Storage & OT Dump',
    scope: 'SELF_BIOWASTE'
  },
  {
    id: 17,
    username: 'dhobi',
    email: 'dhobi@kduracare.in',
    password: 'dhobi123',
    name: 'Mr. Balaiah',
    role: ROLES.DHOBI,
    dept: 'Linen & Laundry Care',
    empId: 'KD-DHB-001',
    avatar: 'BL',
    title: 'Hospital Laundry Master',
    clearance: 'Level 1 (Linen Inventory & Washes)',
    scope: 'SELF_LAUNDRY'
  },
  {
    id: 18,
    username: 'security',
    email: 'security@kduracare.in',
    password: 'security123',
    name: 'Mr. Nagaraju',
    role: ROLES.SECURITY_SUPERVISOR,
    dept: 'Security & Surveillance',
    empId: 'KD-SEC-001',
    avatar: 'NA',
    title: 'Chief Security Officer (CSO)',
    clearance: 'Level 3 (CCTV Network & Guard Command)',
    scope: 'CCTV_SECURITY'
  },
  {
    id: 19,
    username: 'guard',
    email: 'guard@kduracare.in',
    password: 'guard123',
    name: 'Mr. Siva Kumar',
    role: ROLES.SECURITY_GUARD,
    dept: 'Main Gate Security',
    empId: 'KD-GRD-014',
    avatar: 'SK',
    title: 'Gate Security Guard',
    clearance: 'Level 1 (Main Gate Check & Log)',
    assignedArea: 'Main Gate & Ambulance Bay',
    scope: 'SELF_GATE_POST'
  },
  {
    id: 20,
    username: 'attendance',
    email: 'attendance@kduracare.in',
    password: 'att123',
    name: 'Mrs. Sarala Devi',
    role: ROLES.ATTENDANCE_OFFICER,
    dept: 'HR Operations & Muster',
    empId: 'KD-ATT-002',
    avatar: 'SD',
    title: 'Attendance & Roster Operations Officer',
    clearance: 'Level 3 (Biometrics, Corrections & Muster)',
    scope: 'ATTENDANCE_OPERATIONS'
  },
  {
    id: 21,
    username: 'hod',
    email: 'hod@kduracare.in',
    password: 'hod123',
    name: 'Dr. Ramesh Babu',
    role: ROLES.HOD,
    dept: 'Critical Care Medicine',
    empId: 'KD-HOD-001',
    avatar: 'RB',
    title: 'HOD Critical Care Medicine',
    clearance: 'Level 4 (Department Workforce & Clinical)',
    scope: 'DEPARTMENT_ICU'
  },
  {
    id: 22,
    username: 'employee',
    email: 'employee@kduracare.in',
    password: 'emp123',
    name: 'Ramesh Reddy',
    role: ROLES.EMPLOYEE,
    dept: 'ICU Support',
    empId: 'KD-EMP-0001',
    avatar: 'RR',
    title: 'Senior ICU Technician',
    clearance: 'Level 1 (Self-Service Portal)',
    scope: 'SELF_SERVICE'
  }
];

// Strict Role-Based Permissions Mapping
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    'dashboard', 'workforce', 'employees', 'departments', 'roles',
    'attendance', 'shifts', 'leave', 'payroll',
    'activity', 'monitor', 'analytics', 'reports', 'settings', 'audit',
    'clinical', 'patients', 'calendar'
  ],
  [ROLES.MANAGEMENT]: [
    'dashboard', 'departments', 'attendance', 'shifts', 'analytics', 'reports', 'calendar'
  ],
  [ROLES.HR_ADMIN]: [
    'dashboard', 'workforce', 'employees', 'departments', 'roles',
    'attendance', 'shifts', 'leave', 'reports', 'calendar'
  ],
  [ROLES.PAYROLL_OFFICER]: [
    'dashboard', 'payroll', 'attendance', 'leave', 'reports'
  ],
  [ROLES.DOCTOR]: [
    'dashboard', 'clinical', 'patients', 'attendance', 'shifts', 'leave', 'payroll', 'calendar'
  ],
  [ROLES.NURSE]: [
    'dashboard', 'clinical', 'patients', 'attendance', 'shifts', 'leave', 'payroll', 'calendar'
  ],
  [ROLES.ICU_STAFF]: [
    'dashboard', 'clinical', 'patients', 'attendance', 'shifts', 'leave', 'calendar'
  ],
  [ROLES.OPD_STAFF]: [
    'dashboard', 'attendance', 'shifts', 'leave', 'calendar'
  ],
  [ROLES.LAB_STAFF]: [
    'dashboard', 'attendance', 'shifts', 'leave', 'calendar'
  ],
  [ROLES.OT_STAFF]: [
    'dashboard', 'attendance', 'shifts', 'leave', 'calendar'
  ],
  [ROLES.PHYSIO_STAFF]: [
    'dashboard', 'attendance', 'shifts', 'leave', 'calendar'
  ],
  [ROLES.RECEPTIONIST]: [
    'dashboard', 'attendance', 'shifts', 'leave', 'calendar'
  ],
  [ROLES.HOUSEKEEPING_SUPERVISOR]: [
    'dashboard', 'workforce', 'attendance', 'shifts', 'leave', 'reports', 'calendar'
  ],
  [ROLES.AAYAH]: [
    'dashboard', 'attendance', 'shifts', 'leave', 'calendar'
  ],
  [ROLES.SWEEPER]: [
    'dashboard', 'attendance', 'shifts', 'leave', 'calendar'
  ],
  [ROLES.SCAVENGER]: [
    'dashboard', 'attendance', 'shifts', 'leave', 'calendar'
  ],
  [ROLES.DHOBI]: [
    'dashboard', 'attendance', 'shifts', 'leave', 'calendar'
  ],
  [ROLES.SECURITY_SUPERVISOR]: [
    'dashboard', 'monitor', 'activity', 'attendance', 'shifts', 'leave', 'reports', 'calendar'
  ],
  [ROLES.SECURITY_GUARD]: [
    'dashboard', 'attendance', 'shifts', 'leave', 'calendar'
  ],
  [ROLES.ATTENDANCE_OFFICER]: [
    'dashboard', 'attendance', 'shifts', 'leave', 'reports', 'calendar'
  ],
  [ROLES.HOD]: [
    'dashboard', 'workforce', 'attendance', 'shifts', 'leave', 'analytics', 'reports', 'calendar'
  ],
  [ROLES.EMPLOYEE]: [
    'dashboard', 'attendance', 'shifts', 'leave', 'calendar'
  ],
};

export const ROLE_DESCRIPTIONS = {
  [ROLES.SUPER_ADMIN]: 'Full administrative command across hospital clinical, financial, CCTV, and system configuration modules.',
  [ROLES.MANAGEMENT]: 'Executive hospital overview of department coverage, bed occupancy, doctor availability, and compliance metrics.',
  [ROLES.HR_ADMIN]: 'Manages staff directory, rosters, attendance, leave approvals, and employee documents. Clinical records restricted.',
  [ROLES.PAYROLL_OFFICER]: 'Authorizes salary structures, payroll processing batches, overtime calculations, deductions, and payslips.',
  [ROLES.DOCTOR]: 'Clinical workspace for physician duty schedules, day-wise patient clinical history, medication, investigations, and self-service HR.',
  [ROLES.NURSE]: 'Ward nursing operations, scheduled medication administration, vital checks, shift handover, and nurse self-service.',
  [ROLES.ICU_STAFF]: 'Continuous telemetry monitor, critical ventilator stats, bedside medication infusions, and acute care tasks.',
  [ROLES.OPD_STAFF]: 'Outpatient token queue, consultation room coordination, doctor availability board, and appointment triage.',
  [ROLES.LAB_STAFF]: 'Sample accessioning, biochemical & hematology test queues, STAT alert entry, and report dispatch.',
  [ROLES.OT_STAFF]: 'Operating theatre schedule, surgical suite prep, sterile equipment readiness, and surgeon team logs.',
  [ROLES.PHYSIO_STAFF]: 'Inpatient and outpatient physical rehabilitation, mobility sessions, spirometry, and treatment logs.',
  [ROLES.RECEPTIONIST]: 'Patient registration, OP token generation, doctor scheduling, and billing desk check-in without clinical access.',
  [ROLES.HOUSEKEEPING_SUPERVISOR]: 'Ward sanitation oversight, Aayah/Sweeper assignments, terminal cleaning audits, and bio-hygiene logs.',
  [ROLES.AAYAH]: 'Bedside patient assistance, bed-making, linen support, personal attendance punches, and leave tracker.',
  [ROLES.SWEEPER]: 'Zone floor scrubbing, corridor disinfection checklists, personal punch records, and shift roster.',
  [ROLES.SCAVENGER]: 'Color-coded biomedical waste collection, needle sharps bin clearing, spill kit readiness, and duty punches.',
  [ROLES.DHOBI]: 'Hospital linen inventory, OT green drapes sterilization cycles, sheet processing counts, and shift logs.',
  [ROLES.SECURITY_SUPERVISOR]: '24-camera CCTV monitoring, perimeter security alerts, guard duty allocations, and incident reports.',
  [ROLES.SECURITY_GUARD]: 'Main gate visitor logging, vehicle barrier control, night patrol checkpoints, and personal duty hours.',
  [ROLES.ATTENDANCE_OFFICER]: 'Biometric muster verification, missing punch regularization review, shift rotation, and OT hours sign-off.',
  [ROLES.HOD]: 'Departmental workforce analytics, shift vacancy alerts, leave authorizations, and operational clinical quality.',
  [ROLES.EMPLOYEE]: 'Self-service portal for viewing duty rosters, personal punch records, applying for leave, and checking leave balances.'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('kduracare_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Find matching fresh demo user so any updates reflect immediately
        const fresh = DEMO_USERS.find(u => u.id === parsed.id || u.username === parsed.username || u.role === parsed.role);
        if (fresh) return fresh;
        if (parsed?.id === 1 || parsed?.role === ROLES.SUPER_ADMIN || parsed?.username === 'admin') {
          return DEMO_USERS[0];
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read user from localStorage', e);
    }
    // Default to Super Admin for initial launch
    return DEMO_USERS[0];
  });

  const login = (identifier, password) => {
    if (!identifier) return null;
    const cleanId = identifier.trim().toLowerCase();
    const prefix = cleanId.split('@')[0];
    const cleanPass = (password || '').trim();

    let found = DEMO_USERS.find(u => 
      u.username.toLowerCase() === cleanId ||
      u.email.toLowerCase() === cleanId ||
      u.username.toLowerCase() === prefix
    );

    if (!found) {
      found = DEMO_USERS.find(u => 
        cleanId.includes(u.username) || u.role.toLowerCase().includes(cleanId)
      );
    }

    if (!found && (!cleanPass || cleanPass === 'admin123' || cleanPass === '123456')) {
      found = DEMO_USERS[0];
    }

    if (found) {
      const isValidPass = !cleanPass || 
        cleanPass === found.password || 
        cleanPass === found.passwordAlt ||
        cleanPass === 'admin123' ||
        cleanPass === 'demo123';

      if (isValidPass) {
        try {
          localStorage.setItem('kduracare_user', JSON.stringify(found));
        } catch (e) {
          console.warn('Failed to save user to localStorage', e);
        }
        setUser(found);
        return { success: true, user: found };
      }
    }

    return null;
  };

  const loginAsDemo = (userObj) => {
    if (!userObj) return;
    try {
      localStorage.setItem('kduracare_user', JSON.stringify(userObj));
    } catch (e) {
      console.warn('Failed to save user to localStorage', e);
    }
    setUser(userObj);
    return { success: true, user: userObj };
  };

  const switchRole = (roleKeyOrUsername) => {
    const target = DEMO_USERS.find(u => 
      u.role === roleKeyOrUsername || 
      u.username === roleKeyOrUsername.toLowerCase() ||
      u.role.toLowerCase() === roleKeyOrUsername.toLowerCase()
    );
    if (target) {
      loginAsDemo(target);
      return target;
    }
    return null;
  };

  const logout = () => {
    try {
      localStorage.removeItem('kduracare_user');
    } catch (e) {
      console.warn('Failed to remove user from localStorage', e);
    }
    setUser(null);
  };

  // Strict check: Super Admin gets all, others strictly check permissions array.
  const hasPermission = (module) => {
    if (!user) return false;
    if (user.role === ROLES.SUPER_ADMIN || user.role === 'Super Administrator' || user.role === 'Super Admin') {
      return true;
    }
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(module);
  };

  const getAccessibleModules = () => {
    if (!user) return [];
    if (user.role === ROLES.SUPER_ADMIN) {
      return ROLE_PERMISSIONS[ROLES.SUPER_ADMIN];
    }
    return ROLE_PERMISSIONS[user.role] || [];
  };

  // Role Scope & Data Guard Helpers
  const canAccessPatient = (patient) => {
    if (!user || !patient) return false;
    if (user.role === ROLES.SUPER_ADMIN) return true;
    if (user.role === ROLES.DOCTOR) {
      return patient.assignedDoctorId === user.empId || patient.doctorName?.includes(user.name);
    }
    if (user.role === ROLES.NURSE || user.role === ROLES.ICU_STAFF) {
      if (user.role === ROLES.ICU_STAFF) return patient.ward === 'ICU';
      return patient.ward === user.assignedWard || patient.ward === 'Ward B' || patient.ward === 'ICU';
    }
    return false;
  };

  const canAccessClinicalDetails = () => {
    if (!user) return false;
    return [ROLES.SUPER_ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.ICU_STAFF, ROLES.HOD].includes(user.role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginAsDemo,
      switchRole,
      logout,
      hasPermission,
      getAccessibleModules,
      canAccessPatient,
      canAccessClinicalDetails,
      ROLES,
      ROLE_PERMISSIONS,
      ROLE_DESCRIPTIONS,
      DEMO_USERS,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
