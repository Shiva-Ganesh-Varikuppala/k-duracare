import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle, XCircle, Clock, AlertTriangle, Search, Sparkles,
  Calendar, UserCheck, ChevronLeft, ChevronRight, Check, X, Download, RefreshCw, Filter
} from "lucide-react";
import { toast } from "react-hot-toast";
import { todayAttendance, attendanceHistory } from "../data/attendance";
import { todayStats, departmentCoverage } from "../data/employees";
import PageBreadcrumb from "../components/common/PageBreadcrumb";
import Badge from "../components/ui/badge/Badge";
import Button from "../components/ui/button/Button";

const SHIFTS = [
  { id: "A", name: "Morning", start: "06:00", end: "14:00", color: "#f59e0b" },
  { id: "B", name: "Evening", start: "14:00", end: "22:00", color: "#0ea5e9" },
  { id: "C", name: "Night",   start: "22:00", end: "06:00", color: "#8b5cf6" },
  { id: "G", name: "General", start: "09:00", end: "17:00", color: "#10b981" },
];

const DAYS_ABBR = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ROSTER_NAMES = [
  "Ramesh Reddy", "Lakshmi Devi", "Venkat Kumar", "Priya Sharma",
  "Srinivas Rao", "Kavitha Nair", "Rajesh Babu", "Meena Yadav",
  "Kumar Goud", "Sunitha Pillai", "Ravi Murthy", "Padma Naidu",
  "Nagaraju Verma", "Sarala Singh", "Balaiah Teja"
];
const ROSTER_DEPTS = ["ICU", "Nursing", "OPD", "OT", "Lab", "Security", "Reception", "Housekeeping"];

const WEEKLY_ROSTER = ROSTER_NAMES.map((name, idx) => ({
  empId: `KD-EMP-${String(idx + 1).padStart(4, "0")}`,
  name,
  dept: ROSTER_DEPTS[idx % ROSTER_DEPTS.length],
  schedule: DAYS_ABBR.map((_, di) => {
    if (di === 6) return "Off";
    const r = (idx + di) % 5;
    return r === 4 ? "Off" : SHIFTS[r % SHIFTS.length].id;
  }),
}));

const CORRECTIONS = [
  { id: "COR-001", name: "Priya Sharma",  dept: "Reception", date: "2026-09-19", type: "Punch Missing",       original: "Check-out missing",          requested: "Out: 17:35",                  reason: "Biometric terminal 2 offline during shift handover.",      aiNote: "Verified via CCTV Front Desk Cam 02 exit timestamp 17:34:40.", status: "Pending" },
  { id: "COR-002", name: "Kavitha Nair",  dept: "OT",        date: "2026-09-18", type: "Late Regularization", original: "Check-in: 07:44 (Late 44m)",  requested: "On Duty: Emergency OT",        reason: "Called at 05:30 AM for emergency Cesarean section.",       aiNote: "Corroborated with OT Log Book & Dr. K. B. Chowdary sign-off.",      status: "Pending" },
  { id: "COR-003", name: "Kumar Swamy",   dept: "ICU",       date: "2026-09-17", type: "Shift Correction",    original: "Marked Shift B (Evening)",    requested: "Worked Shift C (Night OT)",    reason: "Substituted for nurse on medical leave.",                  aiNote: "ICU Entry Cam 19:02 check-in matches ICU shift C roster.",     status: "Pending" },
  { id: "COR-004", name: "Padma Naidu",   dept: "Nursing",   date: "2026-09-16", type: "Absent Regularization",original: "Marked Absent",              requested: "Emergency Leave",              reason: "Family medical emergency — medical certificate submitted.", aiNote: "Certificate verified. Recommend EL deduction instead of LOP.", status: "Pending" },
];

function getStatusBadge(status) {
  switch (status) {
    case "Present": return <Badge variant="light" color="success" size="sm">Present</Badge>;
    case "Late": return <Badge variant="light" color="warning" size="sm">Late</Badge>;
    case "Absent": return <Badge variant="light" color="error" size="sm">Absent</Badge>;
    case "Leave": return <Badge variant="light" color="purple" size="sm">Leave</Badge>;
    case "On Duty": return <Badge variant="light" color="info" size="sm">On Duty</Badge>;
    case "Half Day": return <Badge variant="light" color="warning" size="sm">Half Day</Badge>;
    default: return <Badge variant="light" color="light" size="sm">{status || "Off"}</Badge>;
  }
}

function LiveStats() {
  const [stats, setStats] = useState(todayStats || { present: 278, absent: 18, onLeave: 12, late: 8, weeklyOff: 4, total: 312 });
  useEffect(() => {
    const t = setInterval(() => {
      setStats(s => ({ ...s, present: Math.min((s.present || 278) + (Math.random() > 0.9 ? 1 : 0), s.total || 312) }));
    }, 5000);
    return () => clearInterval(t);
  }, []);
  return stats;
}

// ── Weekly Roster ─────────────────────────────────────────────────────────────
function WeeklyRoster() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [editMode, setEditMode]     = useState(false);
  const [roster, setRoster]         = useState(WEEKLY_ROSTER);
  const [deptFilter, setDeptFilter] = useState("All");

  const today  = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7);
  const weekDates = DAYS_ABBR.map((_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });

  const visible = deptFilter === "All" ? roster : roster.filter(r => r.dept === deptFilter);
  const todayCol = (today.getDay() + 6) % 7;

  const changeShift = (empId, dayIdx, val) => {
    setRoster(prev => prev.map(r => r.empId === empId ? { ...r, schedule: r.schedule.map((s, j) => j === dayIdx ? val : s) } : r));
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setWeekOffset(w => w - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-bold text-gray-900 dark:text-white px-1">
            {weekDates[0].toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – {weekDates[6].toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <Button variant="outline" size="sm" onClick={() => setWeekOffset(w => w + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setWeekOffset(0)}>
            Today
          </Button>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="input-field text-xs py-1.5 w-auto"
          >
            <option value="All">All Departments</option>
            {ROSTER_DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <Button
            variant={editMode ? "primary" : "outline"}
            size="sm"
            onClick={() => {
              setEditMode(e => !e);
              if (editMode) toast.success("Roster assignments saved!");
            }}
            startIcon={editMode ? <Check className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
          >
            {editMode ? "Save Roster" : "Edit Assignments"}
          </Button>
        </div>
      </div>

      {/* Shift legend */}
      <div className="flex flex-wrap items-center gap-4 bg-gray-50/70 px-5 py-2.5 text-xs border-b border-gray-200 dark:bg-white/[0.01] dark:border-gray-800">
        {SHIFTS.map(s => (
          <span key={s.id} className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
            <span
              className="inline-flex h-5 w-5 items-center justify-center rounded font-mono font-bold text-[10px]"
              style={{ backgroundColor: `${s.color}20`, color: s.color }}
            >
              {s.id}
            </span>
            {s.name} ({s.start}–{s.end})
          </span>
        ))}
        <span className="text-gray-400 dark:text-gray-500 font-mono">Off = Scheduled Off</span>
      </div>

      {/* Roster Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.02]">
              <th className="table-header w-52">Employee</th>
              {DAYS_ABBR.map((d, i) => (
                <th
                  key={d}
                  className={`table-header text-center ${
                    weekOffset === 0 && i === todayCol
                      ? "bg-brand-50/60 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400"
                      : ""
                  }`}
                >
                  <div className="font-bold">{d}</div>
                  <div className="text-[10px] font-normal text-gray-400">{weekDates[i].getDate()}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {visible.map(emp => (
              <tr key={emp.empId} className="table-row">
                <td className="table-cell">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600 font-bold text-xs dark:bg-brand-500/10 dark:text-brand-400 flex-shrink-0">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-xs">{emp.name}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">{emp.dept}</p>
                    </div>
                  </div>
                </td>
                {emp.schedule.map((sid, di) => {
                  const shift = SHIFTS.find(s => s.id === sid);
                  const isToday = weekOffset === 0 && di === todayCol;
                  return (
                    <td
                      key={di}
                      className={`table-cell text-center ${
                        isToday ? "bg-brand-50/20 dark:bg-brand-500/[0.03]" : ""
                      }`}
                    >
                      {editMode ? (
                        <select
                          value={sid}
                          onChange={e => changeShift(emp.empId, di, e.target.value)}
                          className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[11px] font-bold py-1 px-1 text-center w-full"
                          style={{ color: shift?.color }}
                        >
                          {SHIFTS.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                          <option value="Off">Off</option>
                        </select>
                      ) : sid === "Off" ? (
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-mono font-medium">Off</span>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center rounded-md px-2 py-0.5 font-mono text-xs font-bold"
                          style={{
                            backgroundColor: shift ? `${shift.color}15` : "transparent",
                            color: shift?.color || "#465fff",
                            border: `1px solid ${shift ? `${shift.color}35` : "transparent"}`
                          }}
                        >
                          {sid}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Coverage Matrix ───────────────────────────────────────────────────────────
function CoverageMatrix() {
  const coverage = departmentCoverage || [];
  const HOURS = ["06", "08", "10", "12", "14", "16", "18", "20", "22", "00"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {coverage.map(dept => {
          const cov   = dept.coverage || 85;
          const total   = dept.total || dept.required || 20;
          const present = dept.present || Math.round(cov * 0.01 * total);
          const colorClass = cov >= 90 ? "text-emerald-600 dark:text-emerald-400" : cov >= 75 ? "text-amber-600 dark:text-amber-400" : "text-rose-600 dark:text-rose-400";
          const barBg = cov >= 90 ? "bg-emerald-500" : cov >= 75 ? "bg-amber-500" : "bg-rose-500";

          return (
            <div key={dept.dept} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{dept.dept}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{dept.category || "Clinical Station"}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold font-mono ${colorClass}`}>{cov}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{present}/{total} on floor</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mb-3">
                <div className={`h-full rounded-full ${barBg} transition-all duration-500`} style={{ width: `${cov}%` }} />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {["Morning", "Evening", "Night"].map((sh, si) => (
                  <div key={sh} className="rounded-lg border border-gray-100 bg-gray-50/60 p-2 dark:border-gray-800 dark:bg-white/[0.02]">
                    <span className="text-gray-500 dark:text-gray-400 block text-[10px]">{sh}</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                      {Math.round(present / 3) + (si === 0 ? 1 : 0)}
                    </span>
                  </div>
                ))}
              </div>

              {cov < 80 && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50/70 p-2 text-xs text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Below 80% staffing minimum — immediate floater nurse recommended</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hourly Occupancy Heatmap */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Hourly Occupancy & Sensor Heatmap</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Station sensor telemetry corroborating physical presence</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-1.5 text-xs">
            <thead>
              <tr>
                <th className="w-36 text-left font-semibold text-gray-500 dark:text-gray-400 p-1">Department</th>
                {HOURS.map(h => (
                  <th key={h} className="text-center font-mono text-[11px] text-gray-400 dark:text-gray-500 p-1">
                    {h}:00
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coverage.slice(0, 6).map(dept => (
                <tr key={dept.dept}>
                  <td className="font-medium text-gray-800 dark:text-gray-200 p-1 whitespace-nowrap">{dept.dept}</td>
                  {HOURS.map((h, hi) => {
                    const base = dept.coverage || 80;
                    const intensity = Math.min(100, Math.max(40, base + Math.sin(hi + (dept.dept.charCodeAt(0) % 6)) * 15));
                    const isHigh = intensity >= 85;
                    const isMed = intensity >= 65 && intensity < 85;
                    const cellBg = isHigh
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : isMed
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400"
                      : "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400";
                    return (
                      <td key={h} className="p-0.5">
                        <div className={`h-7 rounded flex items-center justify-center font-mono text-[10px] font-bold ${cellBg}`}>
                          {Math.round(intensity)}%
                        </div>
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
  );
}

// ── Attendance History ────────────────────────────────────────────────────────
function AttendanceHistory() {
  const [search, setSearch]           = useState("");
  const [deptFilter, setDeptFilter]   = useState("All");
  const [monthFilter, setMonthFilter] = useState("2026-09");
  const [page, setPage]               = useState(0);
  const PER_PAGE = 20;

  const depts = useMemo(() => ["All", ...new Set(attendanceHistory.map(r => r.department))], []);

  const filtered = useMemo(() => attendanceHistory.filter(r => {
    const name = r.employeeName || "";
    const id   = r.employeeId   || "";
    return (
      (!search || name.toLowerCase().includes(search.toLowerCase()) || id.toLowerCase().includes(search.toLowerCase())) &&
      (deptFilter === "All" || r.department === deptFilter) &&
      (!monthFilter || r.date?.startsWith(monthFilter))
    );
  }), [search, deptFilter, monthFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageData   = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employee name or ID..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="input-field pl-9 text-xs"
          />
        </div>
        <input
          type="month"
          value={monthFilter}
          onChange={e => { setMonthFilter(e.target.value); setPage(0); }}
          className="input-field text-xs w-auto"
        />
        <select
          value={deptFilter}
          onChange={e => { setDeptFilter(e.target.value); setPage(0); }}
          className="input-field text-xs w-auto"
        >
          {depts.map(d => <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>)}
        </select>
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 ml-auto">
          {filtered.length} total entries
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.02]">
              {["Date", "Employee", "Department", "Shift", "Check In", "Check Out", "Status", "Overtime"].map(h => (
                <th key={h} className="table-header">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {pageData.map((rec, i) => (
              <tr key={rec.id || i} className="table-row">
                <td className="table-cell font-mono text-xs text-gray-500 dark:text-gray-400">{rec.date}</td>
                <td className="table-cell">
                  <p className="font-semibold text-gray-900 dark:text-white text-xs">{rec.employeeName}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">{rec.employeeId}</p>
                </td>
                <td className="table-cell text-xs text-gray-600 dark:text-gray-400">{rec.department}</td>
                <td className="table-cell text-xs text-gray-500 dark:text-gray-400 font-mono">{rec.shift || "General"}</td>
                <td className="table-cell font-mono text-xs text-emerald-600 dark:text-emerald-400">{rec.checkIn || "—"}</td>
                <td className="table-cell font-mono text-xs text-brand-600 dark:text-brand-400">{rec.checkOut || "—"}</td>
                <td className="table-cell">{getStatusBadge(rec.status)}</td>
                <td className="table-cell font-mono text-xs">
                  {rec.overtime > 0 ? (
                    <span className="text-amber-600 dark:text-amber-400 font-bold">+{rec.overtime}m</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 p-4 dark:border-gray-800">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            Page {page + 1} of {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Main Attendance Component ─────────────────────────────────────────────────
export default function Attendance() {
  const [activeTab, setActiveTab]       = useState("today");
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deptFilter, setDeptFilter]     = useState("All");
  const [corrections, setCorrections]   = useState(CORRECTIONS);
  const [attendanceData]                = useState(todayAttendance || []);
  const stats                           = LiveStats();

  const depts = useMemo(() => ["All", ...new Set((todayAttendance || []).map(e => e.department).filter(Boolean))], []);

  const filtered = useMemo(() => attendanceData.filter(e => {
    const name = e.employeeName || e.name || "";
    const id   = e.employeeId   || e.id   || "";
    return (
      (statusFilter === "All" || e.status === statusFilter) &&
      (deptFilter   === "All" || e.department === deptFilter) &&
      (!search || name.toLowerCase().includes(search.toLowerCase()) || id.toLowerCase().includes(search.toLowerCase()))
    );
  }), [attendanceData, search, statusFilter, deptFilter]);

  const handleCorrection = (id, action) => {
    setCorrections(prev => prev.map(c => c.id === id ? { ...c, status: action === "approve" ? "Approved" : "Rejected" } : c));
    toast.success(`Correction ${action === "approve" ? "approved" : "rejected"}`);
  };

  const presentVal = stats.present || 278;
  const totalVal   = stats.total   || 312;
  const presentPct = Math.round((presentVal / totalVal) * 100);

  const statItems = [
    { label: "Present Today", value: presentVal, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Absent",        value: stats.absent || 18, color: "text-rose-600 dark:text-rose-400" },
    { label: "On Leave",      value: stats.onLeave || 12, color: "text-amber-600 dark:text-amber-400" },
    { label: "Late Punches",  value: stats.late || 8, color: "text-orange-600 dark:text-orange-400" },
    { label: "Weekly Off",    value: stats.weeklyOff || 4, color: "text-gray-600 dark:text-gray-400" },
    { label: "Floor Coverage",value: `${presentPct}%`, color: "text-brand-600 dark:text-brand-400" },
  ];

  const TABS = [
    { id: "today",       label: "Today's Muster" },
    { id: "history",     label: "Attendance History" },
    { id: "weekly",      label: "Weekly Roster" },
    { id: "coverage",    label: "Coverage Matrix" },
    { id: "corrections", label: `Corrections (${corrections.filter(c => c.status === "Pending").length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb
          pageTitle="Attendance & Workforce Roster"
          breadcrumbs={[
            { label: 'Workforce', path: '/employees' },
            { label: 'Attendance' }
          ]}
        />
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
            <span className="live-dot" /> Live Biometric Stream
          </div>
          <Button variant="outline" size="sm" startIcon={<Download className="w-4 h-4" />}>
            Export Muster
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {statItems.map(item => (
          <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <p className={`text-2xl font-bold font-mono sm:text-3xl ${item.color}`}>{item.value}</p>
            <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-100 p-1.5 dark:border-gray-800 dark:bg-gray-900/60 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-white text-brand-600 shadow-xs dark:bg-brand-500 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TODAY'S MUSTER */}
      {activeTab === "today" && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-4 dark:border-gray-800">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employee name or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-9 text-xs"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="input-field text-xs w-auto"
            >
              <option value="All">All Statuses</option>
              {["Present", "Late", "Absent", "Leave", "On Duty", "Half Day"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="input-field text-xs w-auto"
            >
              {depts.map(d => <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>)}
            </select>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 ml-auto">
              Showing {filtered.length} of {attendanceData.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.02]">
                  {["Employee", "Department", "Shift", "Check In", "Check Out", "Status", "AI Sensor Note"].map(h => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.slice(0, 30).map((emp, i) => (
                  <tr key={emp.employeeId || i} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600 font-bold text-xs dark:bg-brand-500/10 dark:text-brand-400 flex-shrink-0">
                          {(emp.employeeName || emp.name || "U").charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-xs">
                            {emp.employeeName || emp.name}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                            {emp.employeeId || emp.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-xs text-gray-600 dark:text-gray-400">{emp.department}</td>
                    <td className="table-cell text-xs text-gray-500 dark:text-gray-400 font-mono">{emp.shift || "General"}</td>
                    <td className="table-cell font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{emp.checkIn || "—"}</td>
                    <td className="table-cell font-mono text-xs text-brand-600 dark:text-brand-400 font-semibold">{emp.checkOut || "—"}</td>
                    <td className="table-cell">{getStatusBadge(emp.status)}</td>
                    <td className="table-cell">
                      {emp.aiNote ? (
                        <div className="flex items-center gap-1.5 text-xs text-brand-700 dark:text-brand-300">
                          <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-brand-500" />
                          <span className="truncate max-w-[260px]">{emp.aiNote}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "history"     && <AttendanceHistory />}
      {activeTab === "weekly"      && <WeeklyRoster />}
      {activeTab === "coverage"    && <CoverageMatrix />}

      {/* CORRECTIONS */}
      {activeTab === "corrections" && (
        <div className="space-y-4">
          {corrections.map(corr => (
            <div key={corr.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="light" color="primary" size="sm">
                      <span className="font-mono">{corr.id}</span>
                    </Badge>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{corr.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">· {corr.dept}</span>
                    <span className="text-xs text-gray-400 font-mono">· {corr.date}</span>
                    <Badge variant="light" color="warning" size="sm">{corr.type}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-xs dark:border-rose-500/20 dark:bg-rose-500/10">
                      <p className="font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider text-[10px] mb-1">Original Biometric Entry</p>
                      <p className="font-mono text-gray-800 dark:text-gray-200">{corr.original}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs dark:border-emerald-500/20 dark:bg-emerald-500/10">
                      <p className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[10px] mb-1">Requested Regularization</p>
                      <p className="font-mono text-gray-800 dark:text-gray-200">{corr.requested}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-700 dark:text-gray-300">Staff Note: </strong>
                    {corr.reason}
                  </p>

                  <div className="flex items-start gap-2 rounded-xl border border-brand-200 bg-brand-50/50 p-3 text-xs text-brand-800 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">
                    <Sparkles className="w-4 h-4 flex-shrink-0 text-brand-500 mt-0.5" />
                    <p>{corr.aiNote}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {corr.status === "Pending" ? (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        startIcon={<Check className="w-4 h-4" />}
                        onClick={() => handleCorrection(corr.id, "approve")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        startIcon={<X className="w-4 h-4" />}
                        onClick={() => handleCorrection(corr.id, "reject")}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Badge variant="light" color={corr.status === "Approved" ? "success" : "error"} size="md">
                      {corr.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
