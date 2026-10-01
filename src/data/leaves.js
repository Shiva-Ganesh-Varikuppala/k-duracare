// Mock leave data
export const leaveTypes = [
  { id: 1, name: 'Casual Leave', code: 'CL', allocated: 12, color: '#0EA5E9' },
  { id: 2, name: 'Sick Leave', code: 'SL', allocated: 12, color: '#10B981' },
  { id: 3, name: 'Earned Leave', code: 'EL', allocated: 15, color: '#F59E0B' },
  { id: 4, name: 'Maternity Leave', code: 'ML', allocated: 180, color: '#EC4899' },
  { id: 5, name: 'Emergency Leave', code: 'EmL', allocated: 3, color: '#EF4444' },
  { id: 6, name: 'Loss of Pay', code: 'LOP', allocated: 0, color: '#6B7280' },
  { id: 7, name: 'Compensatory Leave', code: 'CompL', allocated: 0, color: '#8B5CF6' },
];

export const leaveRequests = [
  { id: 'LR-001', employeeId: 'KD-EMP-0001', employeeName: 'Ramesh Reddy', department: 'ICU', leaveType: 'Casual Leave', from: '2026-09-22', to: '2026-09-24', days: 3, reason: 'Family function', status: 'Pending', appliedOn: '2026-09-19', approvedBy: null },
  { id: 'LR-002', employeeId: 'KD-EMP-0002', employeeName: 'Lakshmi Devi', department: 'Nursing', leaveType: 'Sick Leave', from: '2026-09-20', to: '2026-09-21', days: 2, reason: 'Fever and cold', status: 'Approved', appliedOn: '2026-09-19', approvedBy: 'Mrs. Sunitha Reddy' },
  { id: 'LR-003', employeeId: 'KD-EMP-0005', employeeName: 'Srinivas Rao', department: 'OPD', leaveType: 'Earned Leave', from: '2026-09-25', to: '2026-09-28', days: 4, reason: 'Annual vacation', status: 'Pending', appliedOn: '2026-09-18', approvedBy: null },
  { id: 'LR-004', employeeId: 'KD-EMP-0008', employeeName: 'Meena Yadav', department: 'Housekeeping', leaveType: 'Casual Leave', from: '2026-09-21', to: '2026-09-21', days: 1, reason: 'Personal work', status: 'Approved', appliedOn: '2026-09-19', approvedBy: 'Mrs. Sunitha Reddy' },
  { id: 'LR-005', employeeId: 'KD-EMP-0012', employeeName: 'Padma Naidu', department: 'Nursing', leaveType: 'Emergency Leave', from: '2026-09-20', to: '2026-09-20', days: 1, reason: 'Medical emergency', status: 'Approved', appliedOn: '2026-09-20', approvedBy: 'Mrs. Lakshmi Devi' },
  { id: 'LR-006', employeeId: 'KD-EMP-0015', employeeName: 'Usha Prasad', department: 'ICU', leaveType: 'Casual Leave', from: '2026-09-26', to: '2026-09-27', days: 2, reason: 'Sister marriage', status: 'Rejected', appliedOn: '2026-09-17', approvedBy: 'Mrs. Sunitha Reddy', rejectionReason: 'Insufficient staff coverage during requested period.' },
  { id: 'LR-007', employeeId: 'KD-EMP-0020', employeeName: 'Vani Varma', department: 'OT', leaveType: 'Sick Leave', from: '2026-09-22', to: '2026-09-23', days: 2, reason: 'Medical treatment', status: 'Pending', appliedOn: '2026-09-19', approvedBy: null },
  { id: 'LR-008', employeeId: 'KD-EMP-0025', employeeName: 'Gopal Reddy', department: 'Security', leaveType: 'Casual Leave', from: '2026-09-23', to: '2026-09-23', days: 1, reason: 'Personal', status: 'Pending', appliedOn: '2026-09-20', approvedBy: null },
];

export const myLeaveBalance = [
  { type: 'Casual Leave', code: 'CL', allocated: 12, used: 4, pending: 1, available: 7, color: '#0EA5E9' },
  { type: 'Sick Leave', code: 'SL', allocated: 12, used: 2, pending: 0, available: 10, color: '#10B981' },
  { type: 'Earned Leave', code: 'EL', allocated: 15, used: 5, pending: 0, available: 10, color: '#F59E0B' },
  { type: 'Emergency Leave', code: 'EmL', allocated: 3, used: 0, pending: 0, available: 3, color: '#EF4444' },
  { type: 'Compensatory Leave', code: 'CompL', allocated: 2, used: 1, pending: 0, available: 1, color: '#8B5CF6' },
];

export const leaveBalances = myLeaveBalance;

// Calendar data — dates with events
export const leaveCalendarData = {
  '2026-09-01': { onLeave: 12, present: 289, holiday: false },
  '2026-09-02': { onLeave: 14, present: 282, holiday: false },
  '2026-09-03': { onLeave: 11, present: 285, holiday: false },
  '2026-09-04': { onLeave: 16, present: 276, holiday: false },
  '2026-09-05': { onLeave: 8, present: 292, holiday: false },
  '2026-09-06': { onLeave: 18, present: 278, holiday: false },
  '2026-09-07': { onLeave: 0, present: 0, holiday: false, weeklyOff: true },
  '2026-09-14': { onLeave: 0, present: 0, holiday: true, holidayName: 'Onam' },
  '2026-09-17': { onLeave: 22, present: 265, holiday: false },
  '2026-09-20': { onLeave: 18, present: 278, holiday: false, today: true },
  '2026-09-25': { onLeave: 15, present: 282, holiday: false },
  '2026-09-28': { onLeave: 0, present: 0, holiday: false, weeklyOff: true },
};
