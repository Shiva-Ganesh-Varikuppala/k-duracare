// Mock payroll data
export const payrollSummary = {
  month: 'September 2026',
  totalEmployees: 326,
  processedCount: 326,
  grossPayroll: 8432500,
  overtime: 284000,
  deductions: 712000,
  lop: 48000,
  netPayroll: 7956500,
  status: 'Draft',
  processedOn: null,
  approvedBy: null,
};

export const payrollRecords = [
  { empId: 'KD-EMP-0001', name: 'Ramesh Reddy', dept: 'ICU', designation: 'ICU Nurse', basic: 32000, hra: 4800, allowance: 2560, overtime: 1800, gross: 41160, pf: 2400, esi: 820, pt: 200, lop: 0, advance: 0, netPay: 37740, workingDays: 26, presentDays: 24, lopDays: 0, status: 'Calculated' },
  { empId: 'KD-EMP-0002', name: 'Lakshmi Devi', dept: 'Nursing', designation: 'Senior Nurse', basic: 28000, hra: 4200, allowance: 2240, overtime: 600, gross: 35040, pf: 2100, esi: 700, pt: 200, lop: 0, advance: 0, netPay: 32040, workingDays: 26, presentDays: 24, lopDays: 0, status: 'Calculated' },
  { empId: 'KD-EMP-0003', name: 'Venkat Kumar', dept: 'Laboratory', designation: 'Lab Technician', basic: 24000, hra: 3600, allowance: 1920, overtime: 0, gross: 29520, pf: 1800, esi: 590, pt: 200, lop: 1846, advance: 0, netPay: 25084, workingDays: 26, presentDays: 23, lopDays: 2, status: 'Flagged' },
  { empId: 'KD-EMP-0004', name: 'Priya Sharma', dept: 'Reception', designation: 'Senior Receptionist', basic: 20000, hra: 3000, allowance: 1600, overtime: 0, gross: 24600, pf: 1500, esi: 492, pt: 200, lop: 0, advance: 0, netPay: 22408, workingDays: 26, presentDays: 26, lopDays: 0, status: 'Calculated' },
  { empId: 'KD-EMP-0005', name: 'Srinivas Rao', dept: 'OPD', designation: 'OPD In-charge', basic: 35000, hra: 5250, allowance: 2800, overtime: 2400, gross: 45450, pf: 2625, esi: 0, pt: 200, lop: 0, advance: 5000, netPay: 37625, workingDays: 26, presentDays: 24, lopDays: 0, status: 'Calculated' },
  { empId: 'KD-EMP-0006', name: 'Kavitha Nair', dept: 'OT', designation: 'OT Nurse', basic: 30000, hra: 4500, allowance: 2400, overtime: 1200, gross: 38100, pf: 2250, esi: 762, pt: 200, lop: 0, advance: 0, netPay: 34888, workingDays: 26, presentDays: 25, lopDays: 0, status: 'Calculated' },
  { empId: 'KD-EMP-0007', name: 'Rajesh Babu', dept: 'Security', designation: 'Security Guard', basic: 15000, hra: 2250, allowance: 1200, overtime: 3200, gross: 21650, pf: 1125, esi: 433, pt: 150, lop: 0, advance: 0, netPay: 19942, workingDays: 26, presentDays: 26, lopDays: 0, status: 'Calculated' },
  { empId: 'KD-EMP-0008', name: 'Meena Yadav', dept: 'Housekeeping', designation: 'Aayah', basic: 12000, hra: 1800, allowance: 960, overtime: 0, gross: 14760, pf: 900, esi: 295, pt: 100, lop: 923, advance: 0, netPay: 12542, workingDays: 26, presentDays: 24, lopDays: 1, status: 'Calculated' },
];

export const payslipData = {
  empId: 'KD-EMP-0001',
  name: 'Ramesh Reddy',
  dept: 'ICU',
  designation: 'ICU Nurse',
  month: 'September 2026',
  bankAccount: 'XXXXX6789',
  ifsc: 'SBIN0005678',
  pfNumber: 'AP/VJA/123456',
  esiNumber: '51/234567/001',
  earnings: [
    { component: 'Basic Salary', amount: 32000 },
    { component: 'House Rent Allowance', amount: 4800 },
    { component: 'Special Allowance', amount: 2560 },
    { component: 'Overtime', amount: 1800 },
  ],
  deductions: [
    { component: "Provident Fund (Employee's Share)", amount: 2400 },
    { component: 'ESI', amount: 820 },
    { component: 'Professional Tax', amount: 200 },
  ],
  gross: 41160,
  totalDeductions: 3420,
  netPay: 37740,
  workingDays: 26,
  presentDays: 24,
  lopDays: 0,
  overtimeHours: 9,
};

export const monthlyPayrollTrend = [
  { month: 'Apr', gross: 7800000, net: 7200000 },
  { month: 'May', gross: 7950000, net: 7350000 },
  { month: 'Jun', gross: 8100000, net: 7500000 },
  { month: 'Jul', gross: 8050000, net: 7450000 },
  { month: 'Aug', gross: 8250000, net: 7700000 },
  { month: 'Sep', gross: 8432500, net: 7956500 },
];
