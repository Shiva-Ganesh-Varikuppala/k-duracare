import { useState, useEffect, useMemo } from "react";
import { CheckCircle, XCircle, Clock, AlertTriangle, Search, Sparkles, Calendar, UserCheck, ChevronLeft, ChevronRight, Check, X, Download, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { todayAttendance, attendanceHistory } from "../data/attendance";
import { todayStats, departmentCoverage } from "../data/employees";

const statusConfig = {
  "Present":    { color: "#34D399", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)"  },
  "Late":       { color: "#FB923C", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.25)"  },
  "Absent":     { color: "#F87171", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)"   },
  "Leave":      { color: "#FBBF24", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)"  },
  "Weekly Off": { color: "#94A3B8", bg: "rgba(100,116,139,0.12)", border: "rgba(100,116,139,0.25)" },
  "On Duty":    { color: "#38BDF8", bg: "rgba(14,165,233,0.12)",  border: "rgba(14,165,233,0.25)"  },
  "Half Day":   { color: "#A78BFA", bg: "rgba(139,92,246,0.12)",  border: "rgba(139,92,246,0.25)"  },
};

const SHIFTS = [
  { id: "A", name: "Morning", start: "06:00", end: "14:00", color: "#FBBF24" },
  { id: "B", name: "Evening", start: "14:00", end: "22:00", color: "#38BDF8" },
  { id: "C", name: "Night",   start: "22:00", end: "06:00", color: "#C084FC" },
  { id: "G", name: "General", start: "09:00", end: "17:00", color: "#34D399" },
];

const DAYS_ABBR = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const ROSTER_NAMES = ["Ramesh Reddy","Lakshmi Devi","Venkat Kumar","Priya Sharma","Srinivas Rao","Kavitha Nair","Rajesh Babu","Meena Yadav","Kumar Goud","Sunitha Pillai","Ravi Murthy","Padma Naidu","Nagaraju Verma","Sarala Singh","Balaiah Teja"];
const ROSTER_DEPTS = ["ICU","Nursing","OPD","OT","Lab","Security","Reception","Housekeeping"];

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
    <div className="glass-card" style={{ overflow: "hidden" }}>
      {/* Header bar */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button className="btn-secondary" style={{ padding: "6px 10px" }} onClick={() => setWeekOffset(w => w - 1)}><ChevronLeft style={{ width: 14, height: 14 }} /></button>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
          {weekDates[0].toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – {weekDates[6].toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <button className="btn-secondary" style={{ padding: "6px 10px" }} onClick={() => setWeekOffset(w => w + 1)}><ChevronRight style={{ width: 14, height: 14 }} /></button>
        <button className="btn-secondary" style={{ fontSize: 11, padding: "6px 12px" }} onClick={() => setWeekOffset(0)}>Today</button>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="input-field" style={{ width: "auto", fontSize: 12 }}>
          <option value="All">All Departments</option>
          {ROSTER_DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <button className={editMode ? "btn-primary" : "btn-secondary"} style={{ fontSize: 12, marginLeft: "auto" }}
          onClick={() => { setEditMode(e => !e); if (editMode) toast.success("Roster saved!"); }}>
          {editMode ? <><Check style={{ width: 13, height: 13 }} /> Save</> : <><RefreshCw style={{ width: 13, height: 13 }} /> Edit</>}
        </button>
      </div>

      {/* Shift legend */}
      <div style={{ padding: "8px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: 12, flexWrap: "wrap" }}>
        {SHIFTS.map(s => (
          <span key={s.id} style={{ fontSize: 11, color: s.color }}>
            <strong>{s.id}</strong> {s.name} ({s.start}–{s.end})
          </span>
        ))}
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Off = Day Off</span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              <th className="table-header" style={{ textAlign: "left", width: 180 }}>Employee</th>
              {DAYS_ABBR.map((d, i) => (
                <th key={d} className="table-header" style={{ textAlign: "center", background: weekOffset === 0 && i === todayCol ? "rgba(14,165,233,0.08)" : "transparent" }}>
                  <div style={{ color: weekOffset === 0 && i === todayCol ? "#38BDF8" : "rgba(255,255,255,0.4)", fontSize: 11 }}>{d}</div>
                  <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>{weekDates[i].getDate()}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map(emp => (
              <tr key={emp.empId} className="table-row">
                <td className="table-cell">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,rgba(14,165,233,0.2),rgba(99,102,241,0.2))", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#38BDF8", flexShrink: 0 }}>
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{emp.name}</p>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{emp.dept}</p>
                    </div>
                  </div>
                </td>
                {emp.schedule.map((sid, di) => {
                  const shift = SHIFTS.find(s => s.id === sid);
                  const isToday = weekOffset === 0 && di === todayCol;
                  return (
                    <td key={di} className="table-cell" style={{ textAlign: "center", background: isToday ? "rgba(14,165,233,0.04)" : "transparent" }}>
                      {editMode ? (
                        <select value={sid} onChange={e => changeShift(emp.empId, di, e.target.value)}
                          style={{ fontSize: 11, fontWeight: 700, color: shift?.color || "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "3px 4px", width: "100%" }}>
                          {SHIFTS.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                          <option value="Off">Off</option>
                        </select>
                      ) : sid === "Off" ? (
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>Off</span>
                      ) : (
                        <span style={{ fontSize: 11, fontWeight: 700, color: shift?.color || "#fff", background: shift ? `${shift.color}15` : "transparent", padding: "3px 8px", borderRadius: 6 }}>
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
  const HOURS = ["06","08","10","12","14","16","18","20","22","00"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coverage.map(dept => {
          const cov   = dept.coverage || 85;
          const color = cov >= 90 ? "#34D399" : cov >= 75 ? "#FBBF24" : "#F87171";
          const total   = dept.total || dept.required || 20;
          const present = dept.present || Math.round(cov * 0.01 * total);
          return (
            <div key={dept.dept} className="glass-card-hover" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{dept.dept}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{dept.category || "Clinical"}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 24, fontWeight: 800, color, letterSpacing: "-0.03em" }}>{cov}%</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{present}/{total} staff</p>
                </div>
              </div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ height: "100%", borderRadius: 100, width: `${cov}%`, transition: "width 1s ease", background: cov >= 90 ? "linear-gradient(90deg,#10B981,#34D399)" : cov >= 75 ? "linear-gradient(90deg,#F59E0B,#FBBF24)" : "linear-gradient(90deg,#EF4444,#F87171)", boxShadow: cov >= 90 ? "0 0 10px rgba(16,185,129,0.4)" : "none" }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Morning","Evening","Night"].map((sh, si) => (
                  <div key={sh} style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>{sh}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color }}>{Math.round(present / 3) + (si === 0 ? 1 : 0)}</p>
                  </div>
                ))}
              </div>
              {cov < 80 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, padding: "8px 12px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8 }}>
                  <AlertTriangle style={{ width: 12, height: 12, color: "#F87171", flexShrink: 0 }} />
                  <p style={{ fontSize: 11, color: "#F87171" }}>Below minimum staffing threshold — action required</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hourly Heatmap */}
      <div className="glass-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Hourly Occupancy Heatmap</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "3px" }}>
            <thead>
              <tr>
                <th style={{ width: 130, textAlign: "left", fontSize: 11, color: "rgba(255,255,255,0.3)", padding: "4px 8px" }}>Department</th>
                {HOURS.map(h => <th key={h} style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", padding: "4px 0", textAlign: "center" }}>{h}:00</th>)}
              </tr>
            </thead>
            <tbody>
              {coverage.slice(0, 6).map(dept => (
                <tr key={dept.dept}>
                  <td style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", padding: "3px 8px", whiteSpace: "nowrap" }}>{dept.dept}</td>
                  {HOURS.map((h, hi) => {
                    const base = dept.coverage || 80;
                    const intensity = Math.min(100, base + Math.sin(hi + (dept.dept.charCodeAt(0) % 6)) * 15);
                    const alpha = (intensity / 100) * 0.75;
                    const bg = intensity >= 85 ? `rgba(16,185,129,${alpha})` : intensity >= 65 ? `rgba(245,158,11,${alpha})` : `rgba(239,68,68,${alpha})`;
                    return (
                      <td key={h} style={{ padding: "2px" }}>
                        <div style={{ height: 28, background: bg, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{Math.round(intensity)}%</span>
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
  const [search, setSearch]       = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("2026-09");
  const [page, setPage]           = useState(0);
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
    <div className="glass-card" style={{ overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "rgba(255,255,255,0.3)" }} />
          <input type="text" placeholder="Search name or Emp ID..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} className="input-field" style={{ paddingLeft: 36, fontSize: 12 }} />
        </div>
        <input type="month" value={monthFilter} onChange={e => { setMonthFilter(e.target.value); setPage(0); }} className="input-field" style={{ width: "auto", fontSize: 12 }} />
        <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(0); }} className="input-field" style={{ width: "auto", fontSize: 12 }}>
          {depts.map(d => <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>)}
        </select>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: "auto" }}>{filtered.length} records</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              {["Date","Employee","Department","Shift","Check In","Check Out","Status","Overtime"].map(h => (
                <th key={h} className="table-header" style={{ textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((rec, i) => {
              const sc = statusConfig[rec.status] || statusConfig["Absent"];
              return (
                <tr key={rec.id || i} className="table-row">
                  <td className="table-cell"><span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "monospace" }}>{rec.date}</span></td>
                  <td className="table-cell">
                    <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>{rec.employeeName}</p>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{rec.employeeId}</p>
                  </td>
                  <td className="table-cell"><span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{rec.department}</span></td>
                  <td className="table-cell"><span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{rec.shift || "General"}</span></td>
                  <td className="table-cell"><span style={{ fontFamily: "monospace", fontSize: 12, color: rec.checkIn ? "#34D399" : "rgba(255,255,255,0.2)" }}>{rec.checkIn || "—"}</span></td>
                  <td className="table-cell"><span style={{ fontFamily: "monospace", fontSize: 12, color: rec.checkOut ? "#38BDF8" : "rgba(255,255,255,0.2)" }}>{rec.checkOut || "—"}</span></td>
                  <td className="table-cell">
                    <span style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>{rec.status}</span>
                  </td>
                  <td className="table-cell">
                    <span style={{ fontSize: 12, color: rec.overtime > 0 ? "#FBBF24" : "rgba(255,255,255,0.2)" }}>{rec.overtime > 0 ? `${rec.overtime}m` : "—"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
          <button className="btn-secondary" style={{ padding: "6px 10px" }} onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft style={{ width: 14, height: 14 }} /></button>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Page {page + 1} / {totalPages}</span>
          <button className="btn-secondary" style={{ padding: "6px 10px" }} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}><ChevronRight style={{ width: 14, height: 14 }} /></button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Attendance() {
  const [activeTab, setActiveTab]   = useState("today");
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [corrections, setCorrections] = useState(CORRECTIONS);
  const [attendanceData]            = useState(todayAttendance || []);
  const stats                       = LiveStats();

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
    { label: "Present",    value: presentVal,          color: "#34D399" },
    { label: "Absent",     value: stats.absent  || 18, color: "#F87171" },
    { label: "On Leave",   value: stats.onLeave || 12, color: "#FBBF24" },
    { label: "Late",       value: stats.late    || 8,  color: "#FB923C" },
    { label: "Weekly Off", value: stats.weeklyOff|| 4, color: "#94A3B8" },
    { label: "Coverage",   value: `${presentPct}%`,    color: presentPct >= 90 ? "#34D399" : presentPct >= 75 ? "#FBBF24" : "#F87171" },
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
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em" }}>Attendance Management</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Real-time muster · Weekly roster · Coverage matrix · History</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 100, padding: "6px 14px" }}>
            <div className="live-dot" /><span style={{ fontSize: 12, color: "#34D399", fontWeight: 600 }}>Live</span>
          </div>
          <button className="btn-secondary" style={{ fontSize: 12 }}><Download style={{ width: 14, height: 14 }} /> Export</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statItems.map(item => (
          <div key={item.label} className="glass-card" style={{ padding: "16px 12px", textAlign: "center" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: item.color, letterSpacing: "-0.04em" }}>{item.value}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-bar" style={{ flexWrap: "wrap" }}>
        {TABS.map(tab => (
          <button key={tab.id} className={activeTab === tab.id ? "tab-active" : "tab-item"} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TODAY'S MUSTER */}
      {activeTab === "today" && (
        <div className="glass-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "rgba(255,255,255,0.3)" }} />
              <input type="text" placeholder="Search name or ID..." value={search} onChange={e => setSearch(e.target.value)} className="input-field" style={{ paddingLeft: 36, fontSize: 12 }} />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field" style={{ width: "auto", fontSize: 12 }}>
              <option value="All">All Statuses</option>
              {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="input-field" style={{ width: "auto", fontSize: 12 }}>
              {depts.map(d => <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>)}
            </select>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: "auto" }}>{filtered.length}/{attendanceData.length}</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                  {["Employee","Department","Shift","Check In","Check Out","Status","AI Note"].map(h => (
                    <th key={h} className="table-header" style={{ textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 30).map((emp, i) => {
                  const sc = statusConfig[emp.status] || statusConfig["Absent"];
                  return (
                    <tr key={emp.employeeId || i} className="table-row">
                      <td className="table-cell">
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,rgba(14,165,233,0.2),rgba(99,102,241,0.2))", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#38BDF8", flexShrink: 0 }}>
                            {(emp.employeeName || emp.name || "U").charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>{emp.employeeName || emp.name}</p>
                            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{emp.employeeId || emp.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell"><span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{emp.department}</span></td>
                      <td className="table-cell"><span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{emp.shift || "General"}</span></td>
                      <td className="table-cell"><span style={{ fontFamily: "monospace", fontSize: 12, color: emp.checkIn ? "#34D399" : "rgba(255,255,255,0.2)" }}>{emp.checkIn || "—"}</span></td>
                      <td className="table-cell"><span style={{ fontFamily: "monospace", fontSize: 12, color: emp.checkOut ? "#38BDF8" : "rgba(255,255,255,0.2)" }}>{emp.checkOut || "—"}</span></td>
                      <td className="table-cell">
                        <span style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>{emp.status}</span>
                      </td>
                      <td className="table-cell">
                        {emp.aiNote && <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Sparkles style={{ width: 10, height: 10, color: "#818CF8" }} /><span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{emp.aiNote}</span></div>}
                      </td>
                    </tr>
                  );
                })}
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
            <div key={corr.id} className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#38BDF8", fontFamily: "monospace", background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.2)", borderRadius: 6, padding: "2px 8px" }}>{corr.id}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{corr.name}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>· {corr.dept}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>{corr.date}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#FBBF24", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6, padding: "2px 8px" }}>{corr.type}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 10, padding: "10px 14px" }}>
                      <p style={{ fontSize: 10, color: "#F87171", fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Original Record</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{corr.original}</p>
                    </div>
                    <div style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 10, padding: "10px 14px" }}>
                      <p style={{ fontSize: 10, color: "#34D399", fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Requested Correction</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{corr.requested}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}><span style={{ color: "rgba(255,255,255,0.3)" }}>Reason: </span>{corr.reason}</p>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 10, padding: "10px 14px" }}>
                    <Sparkles style={{ width: 12, height: 12, color: "#818CF8", flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 11, color: "#818CF8" }}>{corr.aiNote}</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                  {corr.status === "Pending" ? (
                    <>
                      <button className="btn-success" style={{ fontSize: 12, padding: "8px 16px" }} onClick={() => handleCorrection(corr.id, "approve")}><Check style={{ width: 13, height: 13 }} /> Approve</button>
                      <button className="btn-danger"  style={{ fontSize: 12, padding: "8px 16px" }} onClick={() => handleCorrection(corr.id, "reject")}><X style={{ width: 13, height: 13 }} /> Reject</button>
                    </>
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 100, color: corr.status === "Approved" ? "#34D399" : "#F87171", background: corr.status === "Approved" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", border: `1px solid ${corr.status === "Approved" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}` }}>
                      {corr.status}
                    </span>
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
