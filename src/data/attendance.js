// Mock attendance data
export const attendanceStatuses = ['Present', 'Absent', 'Leave', 'Late', 'Half Day', 'Weekly Off', 'Holiday', 'On Duty'];

export const attendanceHistory = [];
const empIds = Array.from({ length: 20 }, (_, i) => `KD-EMP-${String(i + 1).padStart(4, '0')}`);
const names = ['Ramesh Reddy', 'Lakshmi Devi', 'Venkat Kumar', 'Priya Sharma', 'Srinivas Rao', 'Kavitha Nair', 'Rajesh Babu', 'Meena Yadav', 'Kumar Goud', 'Sunitha Pillai', 'Ravi Murthy', 'Padma Naidu', 'Nagaraju Verma', 'Sarala Singh', 'Balaiah Teja', 'Usha Prasad', 'Kiran Raju', 'Madhavi Chary', 'Prasad Swamy', 'Vani Varma'];
const depts = ['ICU', 'Nursing', 'OPD', 'Laboratory', 'Housekeeping', 'Security', 'Reception', 'OT'];

for (let day = 1; day <= 20; day++) {
  empIds.forEach((id, idx) => {
    const isWeekend = new Date(2026, 8, day).getDay() === 0;
    const status = isWeekend ? 'Weekly Off' : (Math.random() > 0.85 ? (Math.random() > 0.5 ? 'Leave' : 'Absent') : (Math.random() > 0.88 ? 'Late' : 'Present'));
    const checkIn = status === 'Present' || status === 'Late' ? `0${Math.floor(Math.random() * 2) + 6}:${String(Math.floor(Math.random() * 59)).padStart(2,'0')}` : null;
    const checkOut = checkIn ? `1${Math.floor(Math.random() * 4) + 2}:${String(Math.floor(Math.random() * 59)).padStart(2,'0')}` : null;
    attendanceHistory.push({
      id: `ATT-${day}-${id}`,
      employeeId: id,
      employeeName: names[idx],
      department: depts[idx % depts.length],
      date: `2026-09-${String(day).padStart(2, '0')}`,
      status,
      checkIn,
      checkOut,
      shift: ['Morning', 'Evening', 'Night', 'General'][idx % 4],
      overtime: status === 'Present' ? Math.floor(Math.random() * 90) : 0,
    });
  });
}

export const todayAttendance = empIds.map((id, idx) => ({
  employeeId: id,
  employeeName: names[idx],
  department: depts[idx % depts.length],
  status: ['Present', 'Present', 'Present', 'Late', 'Present', 'Absent', 'Leave', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Weekly Off', 'Present', 'On Duty', 'Present', 'Present', 'Late', 'Present'][idx],
  checkIn: ['06:58', '07:02', '07:12', '07:41', '06:55', null, null, '07:08', '07:15', '07:00', '06:59', '07:03', '07:07', null, '07:01', '07:05', '07:11', '06:57', '07:38', '07:04'][idx],
  shift: ['Morning', 'Morning', 'Night', 'Evening', 'Morning', 'Morning', null, 'Night', 'Evening', 'General', 'Morning', 'Night', 'Evening', null, 'Morning', 'On Duty', 'General', 'Morning', 'Evening', 'Night'][idx],
}));
