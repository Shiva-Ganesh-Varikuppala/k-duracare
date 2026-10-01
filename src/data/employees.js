// Mock employee data for K-DuraCare
export const departments = [
  { id: 1, name: 'ICU', category: 'Medical', head: 'Dr. Ramesh Babu', staff: 42 },
  { id: 2, name: 'Nursing', category: 'Medical', head: 'Mrs. Lakshmi Devi', staff: 68 },
  { id: 3, name: 'OPD', category: 'Medical', head: 'Dr. Srinivas Rao', staff: 35 },
  { id: 4, name: 'Laboratory', category: 'Medical', head: 'Mr. Venkat Kumar', staff: 18 },
  { id: 5, name: 'OT', category: 'Medical', head: 'Dr. Anand Sharma', staff: 22 },
  { id: 6, name: 'Physiotherapy', category: 'Medical', head: 'Mr. Ravi Teja', staff: 12 },
  { id: 7, name: 'Reception', category: 'Administrative', head: 'Mrs. Priya Nair', staff: 14 },
  { id: 8, name: 'HR & Administration', category: 'Administrative', head: 'Mrs. Sunitha Reddy', staff: 8 },
  { id: 9, name: 'Housekeeping', category: 'Support', head: 'Mr. Suresh Yadav', staff: 54 },
  { id: 10, name: 'Security', category: 'Support', head: 'Mr. Nagaraju', staff: 28 },
  { id: 11, name: 'Dhobi', category: 'Support', head: 'Mr. Balaiah', staff: 11 },
  { id: 12, name: 'Doctors', category: 'Medical', head: 'Dr. K. B. Chowdary', staff: 14 },
];

export const shifts = [
  { id: 1, code: 'SHIFT-A', name: 'Morning', start: '07:00', end: '14:00', crossesMidnight: false, color: '#F59E0B' },
  { id: 2, code: 'SHIFT-B', name: 'Evening', start: '13:00', end: '20:00', crossesMidnight: false, color: '#0EA5E9' },
  { id: 3, code: 'SHIFT-C', name: 'Night', start: '19:00', end: '08:00', crossesMidnight: true, color: '#8B5CF6' },
  { id: 4, code: 'GENERAL', name: 'General', start: '09:00', end: '17:30', crossesMidnight: false, color: '#10B981' },
];

const firstNames = ['Ramesh', 'Suresh', 'Lakshmi', 'Priya', 'Venkat', 'Anand', 'Srinivas', 'Kavitha', 'Rajesh', 'Meena', 'Kumar', 'Sunitha', 'Ravi', 'Padma', 'Nagaraju', 'Sarala', 'Balaiah', 'Usha', 'Kiran', 'Madhavi', 'Prasad', 'Vani', 'Mahesh', 'Nirmala', 'Vijay', 'Asha', 'Arun', 'Rekha', 'Deepak', 'Jyothi', 'Gopal', 'Swathi', 'Mohan', 'Sudha', 'Naresh', 'Latha', 'Siva', 'Parvathi', 'Krishna', 'Radha'];
const lastNames = ['Reddy', 'Rao', 'Kumar', 'Sharma', 'Devi', 'Nair', 'Babu', 'Yadav', 'Goud', 'Pillai', 'Murthy', 'Naidu', 'Verma', 'Singh', 'Teja', 'Prasad', 'Raju', 'Chary', 'Swamy', 'Varma'];

const designationsByDept = {
  'ICU': ['ICU Nurse', 'ICU Technician', 'ICU In-charge', 'Staff Nurse'],
  'Nursing': ['Staff Nurse', 'Senior Nurse', 'Nursing Supervisor', 'Nurse In-charge'],
  'OPD': ['OPD Nurse', 'OPD Assistant', 'OPD In-charge', 'Staff Nurse'],
  'Laboratory': ['Lab Technician', 'Senior Lab Technician', 'Lab Supervisor', 'Pathology Assistant'],
  'OT': ['OT Nurse', 'OT Technician', 'Anesthesia Technician', 'OT In-charge'],
  'Physiotherapy': ['Physiotherapist', 'Senior Physiotherapist', 'PT Assistant'],
  'Reception': ['Receptionist', 'Senior Receptionist', 'Front Desk Executive', 'Billing Executive'],
  'HR & Administration': ['HR Executive', 'HR Manager', 'Admin Executive', 'Payroll Executive'],
  'Housekeeping': ['Sweeper', 'Aayah', 'Scavenger', 'Housekeeping Supervisor'],
  'Security': ['Security Guard', 'Security Supervisor', 'Security In-charge'],
  'Dhobi': ['Dhobi Worker', 'Laundry Supervisor'],
  'Doctors': ['Resident Doctor', 'Consultant', 'Senior Consultant', 'Medical Officer'],
};

const shiftsByDept = {
  'ICU': [1, 2, 3],
  'Nursing': [1, 2, 3],
  'OPD': [1, 2],
  'Laboratory': [1, 2],
  'OT': [1, 2, 3],
  'Physiotherapy': [4],
  'Reception': [4],
  'HR & Administration': [4],
  'Housekeeping': [1, 2, 3],
  'Security': [1, 2, 3],
  'Dhobi': [4],
  'Doctors': [1, 2, 3],
};

const statuses = ['Active', 'Active', 'Active', 'Active', 'Active', 'Active', 'Active', 'Active', 'On Leave', 'Active'];
const bloodGroups = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];
const employmentTypes = ['Permanent', 'Permanent', 'Permanent', 'Contract', 'Probation'];

function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function padNum(n) { return String(n).padStart(4, '0'); }

export const employees = [];
let empCount = 1;
departments.forEach(dept => {
  for (let i = 0; i < dept.staff; i++) {
    const firstName = getRandom(firstNames);
    const lastName = getRandom(lastNames);
    const designations = designationsByDept[dept.name] || ['Staff'];
    const designation = getRandom(designations);
    const deptShifts = shiftsByDept[dept.name] || [4];
    const shiftId = getRandom(deptShifts);
    const shift = shifts.find(s => s.id === shiftId);
    const joiningYear = getRandomInt(2018, 2025);
    const joiningMonth = getRandomInt(1, 12);
    const basic = dept.category === 'Medical' ? getRandomInt(22000, 55000) :
                  dept.category === 'Administrative' ? getRandomInt(18000, 35000) :
                  getRandomInt(12000, 22000);
    employees.push({
      id: `KD-EMP-${padNum(empCount)}`,
      name: `${firstName} ${lastName}`,
      department: dept.name,
      departmentId: dept.id,
      designation,
      joiningDate: `${String(joiningMonth).padStart(2,'0')}-01-${joiningYear}`,
      employmentType: getRandom(employmentTypes),
      status: getRandom(statuses),
      shift: shift.name,
      shiftCode: shift.code,
      basic,
      hra: Math.round(basic * 0.15),
      allowance: Math.round(basic * 0.08),
      phone: `9${getRandomInt(100000000, 999999999)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@kduracare.in`,
      bloodGroup: getRandom(bloodGroups),
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      address: `Flat ${getRandomInt(1, 500)}, ${getRandom(['MG Road', 'Station Road', 'Park Lane', 'NH 16', 'Nehru Nagar'])}, Vijayawada`,
      emergencyContact: `9${getRandomInt(100000000, 999999999)}`,
      attendancePercent: getRandomInt(78, 100),
      lateCount: getRandomInt(0, 5),
      overtimeHours: getRandomInt(0, 24),
      present: getRandomInt(18, 24),
      absent: getRandomInt(0, 3),
      leaveUsed: getRandomInt(0, 8),
      pfNumber: `AP/VJA/${getRandomInt(100000, 999999)}`,
      esiNumber: `51/${getRandomInt(100000, 999999)}/001`,
    });
    empCount++;
  }
});

export const todayStats = {
  total: employees.length,
  present: 278,
  onLeave: 18,
  absent: 12,
  weeklyOff: 14,
  onDuty: 4,
};

export const departmentCoverage = [
  { dept: 'Nursing', required: 68, present: 62, coverage: 91 },
  { dept: 'ICU', required: 42, present: 39, coverage: 93 },
  { dept: 'OPD', required: 35, present: 30, coverage: 86 },
  { dept: 'Laboratory', required: 18, present: 17, coverage: 94 },
  { dept: 'Reception', required: 14, present: 12, coverage: 86 },
  { dept: 'Housekeeping', required: 54, present: 44, coverage: 81 },
  { dept: 'Security', required: 28, present: 28, coverage: 100 },
  { dept: 'Physiotherapy', required: 12, present: 11, coverage: 92 },
  { dept: 'OT', required: 22, present: 21, coverage: 95 },
  { dept: 'Dhobi', required: 11, present: 10, coverage: 91 },
];
