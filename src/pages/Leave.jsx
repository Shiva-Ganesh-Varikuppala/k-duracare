import { useState, useMemo } from "react";
import { Calendar, Clock, Check, X, Sparkles, AlertTriangle, User, Plus, ChevronLeft, ChevronRight, FileText, BarChart3, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { leaveRequests, leaveBalances, leaveCalendarData } from "../data/leaves";
import { employees } from "../data/employees";
import { useAuth } from "../context/AuthContext";

const LEAVE_TYPES = ["Casual Leave", "Sick Leave", "Earned Leave", "Maternity Leave", "Paternity Leave", "Emergency Leave", "Compensatory Leave"];

const STATUS_CFG = {
  "Pending":  { color: "#FBBF24", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)"  },
  "Approved": { color: "#34D399", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)" },
  "Rejected": { color: "#F87171", bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.25)"  },
};

const LEAVE_COLORS = {
  "Casual Leave":      "#38BDF8",
  "Sick Leave":        "#F87171",
  "Earned Leave":      "#34D399",
  "Maternity Leave":   "#C084FC",
  "Paternity Leave":   "#818CF8",
  "Emergency Leave":   "#FB923C",
  "Compensatory Leave":"#FBBF24",
};

const AI_IMPACTS = {
  "KD-EMP-0001": { level: "High",   msg: "Only 2 senior doctors scheduled. Replacement required.",          color: "#F87171" },
  "KD-EMP-0002": { level: "Medium", msg: "Night shift coverage may drop below 80%. Roster adjustment advised.", color: "#FBBF24" },
  "KD-EMP-0005": { level: "Low",    msg: "Sufficient backup available. Auto-suggest: Schedule shift swap.",  color: "#34D399" },
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ─── Apply Leave Modal ────────────────────────────────────────────────────────
function ApplyLeaveModal({ onClose, onSubmit, currentUser }) {
  const [form, setForm] = useState({
    empId: currentUser?.empId || "",
    type: "Casual Leave", from: "", to: "", reason: "",
  });
  const [loading, setLoading] = useState(false);

  const days = form.from && form.to
    ? Math.max(1, Math.ceil((new Date(form.to) - new Date(form.from)) / 86400000) + 1)
    : 0;

  const impact = AI_IMPACTS[form.empId];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.empId || !form.from || !form.to || !form.reason.trim()) {
      toast.error("Please fill all required fields"); return;
    }
    if (new Date(form.to) < new Date(form.from)) {
      toast.error("To date must be after From date"); return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    onSubmit(form);
    toast.success("Leave application submitted successfully!");
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-glass" style={{ width: "100%", maxWidth: 540 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "22px 28px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Apply for Leave</h3>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>AI impact analysis on submission</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 4 }}><X style={{ width: 18, height: 18 }} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: "22px 28px" }}>
          <div className="space-y-4">
            <div>
              <label className="input-label">Employee</label>
              <select value={form.empId} onChange={e => setForm(p => ({ ...p, empId: e.target.value }))} className="input-field" required>
                <option value="">Select Employee</option>
                {employees.slice(0, 20).map(emp => (
                  <option key={emp.empId || emp.id} value={emp.empId || emp.id}>{emp.name} — {emp.department}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">Leave Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="input-field">
                {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="input-label">From Date</label>
                <input type="date" value={form.from} onChange={e => setForm(p => ({ ...p, from: e.target.value }))} className="input-field" required />
              </div>
              <div>
                <label className="input-label">To Date</label>
                <input type="date" value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))} className="input-field" required />
              </div>
            </div>
            {days > 0 && (
              <div style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.15)", borderRadius: 10, padding: "10px 14px" }}>
                <p style={{ fontSize: 12, color: "#38BDF8" }}>Duration: <strong>{days} day{days > 1 ? "s" : ""}</strong> · {form.type}</p>
              </div>
            )}
            {impact && (
              <div style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <Sparkles style={{ width: 12, height: 12, color: "#818CF8" }} />
                  <span style={{ fontSize: 11, color: "#818CF8", fontWeight: 700 }}>AI IMPACT ANALYSIS</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, color: impact.color, background: `${impact.color}18`, border: `1px solid ${impact.color}30`, marginLeft: "auto" }}>{impact.level}</span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{impact.msg}</p>
              </div>
            )}
            <div>
              <label className="input-label">Reason <span style={{ color: "rgba(255,255,255,0.3)", textTransform: "none", fontWeight: 400 }}>(required)</span></label>
              <textarea value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} className="input-field" rows={3} placeholder="Provide a detailed reason..." required style={{ resize: "vertical" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Hospital Calendar ────────────────────────────────────────────────────────
function HospitalCalendar({ requests }) {
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();

  const leaveMap = useMemo(() => {
    const map = {};
    requests.forEach(r => {
      const from = new Date(r.from);
      const to   = new Date(r.to);
      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        if (d.getMonth() === viewMonth && d.getFullYear() === viewYear) {
          const key = d.getDate();
          if (!map[key]) map[key] = [];
          map[key].push(r);
        }
      }
    });
    return map;
  }, [requests, viewMonth, viewYear]);

  const calData = leaveCalendarData || {};

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayDate = today.getDate();
  const isCurrentMonth = viewMonth === today.getMonth() && viewYear === today.getFullYear();

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{MONTHS[viewMonth]} {viewYear}</h3>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Hospital Leave & Attendance Calendar</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary" style={{ padding: "8px 12px" }} onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); }}>
            <ChevronLeft style={{ width: 16, height: 16 }} />
          </button>
          <button className="btn-secondary" style={{ padding: "8px 12px" }} onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); }}>
            <ChevronRight style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { color: "#34D399", label: "High Attendance" },
          { color: "#FBBF24", label: "Staff on Leave" },
          { color: "#818CF8", label: "Holiday" },
          { color: "#38BDF8", label: "Today" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", padding: "6px 0", letterSpacing: "0.04em" }}>{d}</div>
        ))}
      </div>

      {/* Calendar cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const isToday      = isCurrentMonth && day === todayDate;
          const leavesOnDay  = leaveMap[day] || [];
          const isWeekend    = new Date(viewYear, viewMonth, day).getDay() === 0;
          const calEntry     = calData[`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`];
          const isHoliday    = calEntry?.holiday;

          let bg     = "rgba(255,255,255,0.03)";
          let border = "rgba(255,255,255,0.06)";
          let textColor = "rgba(255,255,255,0.7)";
          if (isToday)    { bg = "rgba(14,165,233,0.15)"; border = "rgba(14,165,233,0.4)"; textColor = "#38BDF8"; }
          if (isWeekend)  { bg = "rgba(255,255,255,0.015)"; textColor = "rgba(255,255,255,0.3)"; }
          if (isHoliday)  { bg = "rgba(99,102,241,0.12)"; border = "rgba(99,102,241,0.25)"; textColor = "#818CF8"; }

          return (
            <div key={day} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "8px 6px", minHeight: 64, position: "relative", transition: "all 0.15s" }}>
              <span style={{ fontSize: 12, fontWeight: isToday ? 800 : 600, color: textColor, display: "block", textAlign: "right", marginBottom: 4 }}>{day}</span>
              {isHoliday && calEntry?.holidayName && (
                <div style={{ fontSize: 9, color: "#818CF8", fontWeight: 700, lineHeight: 1.2, textAlign: "center" }}>{calEntry.holidayName}</div>
              )}
              {leavesOnDay.slice(0, 2).map((lr, li) => (
                <div key={li} style={{ fontSize: 9, fontWeight: 700, color: LEAVE_COLORS[lr.leaveType] || "#38BDF8", background: `${LEAVE_COLORS[lr.leaveType] || "#38BDF8"}15`, borderRadius: 4, padding: "1px 4px", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {lr.employeeName?.split(" ")[0]}
                </div>
              ))}
              {leavesOnDay.length > 2 && (
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>+{leavesOnDay.length - 2} more</div>
              )}
              {calEntry?.onLeave > 0 && leavesOnDay.length === 0 && (
                <div style={{ fontSize: 9, color: "#FBBF24", marginTop: 2 }}>{calEntry.onLeave} on leave</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── My Balance ───────────────────────────────────────────────────────────────
function MyBalance({ balances }) {
  return (
    <div className="space-y-4">
      <div className="glass-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 16 }}>My Leave Balance — FY 2026-27</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {(balances || []).map(b => {
            const pct = Math.round((b.used / (b.allocated || 1)) * 100);
            return (
              <div key={b.type} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: b.color || "#38BDF8" }}>{b.code}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>{b.allocated} days total</span>
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>{b.type}</p>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 100, marginBottom: 8 }}>
                  <div style={{ height: "100%", borderRadius: 100, width: `${Math.min(pct, 100)}%`, background: `linear-gradient(90deg, ${b.color}90, ${b.color})`, boxShadow: `0 0 8px ${b.color}40` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: "#F87171" }}>Used: {b.used}</span>
                  {b.pending > 0 && <span style={{ color: "#FBBF24" }}>Pending: {b.pending}</span>}
                  <span style={{ color: b.color || "#34D399", fontWeight: 700 }}>Avail: {b.available}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary table */}
      <div className="glass-card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Leave Summary</p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                {["Leave Type", "Allocated", "Used", "Pending", "Available", "Status"].map(h => (
                  <th key={h} className="table-header" style={{ textAlign: h === "Leave Type" ? "left" : "center" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(balances || []).map(b => (
                <tr key={b.type} className="table-row">
                  <td className="table-cell">
                    <span style={{ fontSize: 12, fontWeight: 600, color: b.color || "#38BDF8" }}>{b.type}</span>
                  </td>
                  {[b.allocated, b.used, b.pending, b.available].map((v, i) => (
                    <td key={i} className="table-cell" style={{ textAlign: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: i === 3 ? (b.color || "#34D399") : "rgba(255,255,255,0.7)" }}>{v}</span>
                    </td>
                  ))}
                  <td className="table-cell" style={{ textAlign: "center" }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                      color: b.available > 5 ? "#34D399" : b.available > 0 ? "#FBBF24" : "#F87171",
                      background: b.available > 5 ? "rgba(16,185,129,0.1)" : b.available > 0 ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)",
                    }}>
                      {b.available > 5 ? "Good" : b.available > 0 ? "Low" : "Exhausted"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Leave Request Card ───────────────────────────────────────────────────────
function LeaveCard({ req, onAction }) {
  const s = STATUS_CFG[req.status] || STATUS_CFG["Pending"];
  const impact = AI_IMPACTS[req.employeeId];
  return (
    <div className="glass-card" style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, rgba(14,165,233,0.2), rgba(99,102,241,0.2))", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#38BDF8", flexShrink: 0 }}>
              {(req.employeeName || req.name || "?").charAt(0)}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{req.employeeName || req.name}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{req.department} · {req.employeeId}</p>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, color: LEAVE_COLORS[req.leaveType || req.type] || "#38BDF8", background: `${LEAVE_COLORS[req.leaveType || req.type] || "#38BDF8"}15`, border: `1px solid ${LEAVE_COLORS[req.leaveType || req.type] || "#38BDF8"}30` }}>
              {req.leaveType || req.type}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 10 }}>
            {[["FROM", req.from], ["TO", req.to], ["DURATION", `${req.days} day${req.days > 1 ? "s" : ""}`]].map(([label, val]) => (
              <div key={label}>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: label === "DURATION" ? "#38BDF8" : "rgba(255,255,255,0.8)" }}>{val}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: impact ? 10 : 0 }}>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>Reason: </span>{req.reason || "Not specified"}
          </p>
          {impact && (
            <div style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 8 }}>
              <Sparkles style={{ width: 12, height: 12, color: "#818CF8", flexShrink: 0, marginTop: 2 }} />
              <div>
                <span style={{ fontSize: 10, color: "#818CF8", fontWeight: 700 }}>AI IMPACT: </span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 100, color: impact.color, background: `${impact.color}18`, border: `1px solid ${impact.color}30`, marginLeft: 4 }}>{impact.level}</span>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 3 }}>{impact.msg}</p>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 100, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>{req.status}</span>
          {req.status === "Pending" && (
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-success" style={{ fontSize: 12, padding: "7px 14px" }} onClick={() => onAction(req.id, "approve")}>
                <Check style={{ width: 13, height: 13 }} /> Approve
              </button>
              <button className="btn-danger" style={{ fontSize: 12, padding: "7px 14px" }} onClick={() => onAction(req.id, "reject")}>
                <X style={{ width: 13, height: 13 }} /> Reject
              </button>
            </div>
          )}
          {req.approvedBy && <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>By: {req.approvedBy}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Leave() {
  const { user } = useAuth();
  const [activeTab, setActiveTab]   = useState("requests");
  const [requests, setRequests]     = useState(leaveRequests);
  const [showApply, setShowApply]   = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const pending  = requests.filter(r => r.status === "Pending");
  const filtered = requests.filter(r => statusFilter === "All" || r.status === statusFilter);

  const handleAction = (id, action) => {
    setRequests(prev => prev.map(r => r.id === id
      ? { ...r, status: action === "approve" ? "Approved" : "Rejected", approvedBy: user?.name || "Admin" }
      : r));
    toast.success(`Leave ${action === "approve" ? "approved" : "rejected"}`);
  };

  const handleNewLeave = (form) => {
    const emp = employees.find(e => (e.empId || e.id) === form.empId);
    const newReq = {
      id: `LR-${Date.now()}`,
      employeeId: form.empId,
      employeeName: emp?.name || form.empId,
      department: emp?.department || "N/A",
      leaveType: form.type,
      type: form.type,
      from: form.from,
      to: form.to,
      days: Math.max(1, Math.ceil((new Date(form.to) - new Date(form.from)) / 86400000) + 1),
      reason: form.reason,
      status: "Pending",
      appliedOn: new Date().toISOString().split("T")[0],
      approvedBy: null,
    };
    setRequests(prev => [newReq, ...prev]);
  };

  const TABS = [
    { id: "requests",  label: `All Requests (${requests.length})`,    icon: FileText   },
    { id: "pending",   label: `Pending (${pending.length})`,           icon: Clock      },
    { id: "calendar",  label: "Hospital Calendar",                     icon: Calendar   },
    { id: "balance",   label: "My Balance",                            icon: BarChart3  },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em" }}>Leave Management</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>AI-powered staffing impact analysis on every leave request</p>
        </div>
        <button className="btn-primary" onClick={() => setShowApply(true)}>
          <Plus style={{ width: 15, height: 15 }} /> Apply Leave
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Pending Requests", value: pending.length,                                         color: "#FBBF24" },
          { label: "Approved",         value: requests.filter(r => r.status === "Approved").length,  color: "#34D399" },
          { label: "Staff on Leave",   value: 12,                                                    color: "#38BDF8" },
          { label: "Rejected",         value: requests.filter(r => r.status === "Rejected").length,  color: "#F87171" },
        ].map(item => (
          <div key={item.label} className="glass-card" style={{ padding: "16px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 30, fontWeight: 800, color: item.color, letterSpacing: "-0.04em" }}>{item.value}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div className="tab-bar">
          {TABS.map(tab => (
            <button key={tab.id} className={activeTab === tab.id ? "tab-active" : "tab-item"} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>
        {(activeTab === "requests" || activeTab === "pending") && (
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field" style={{ width: "auto", fontSize: 12 }}>
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        )}
      </div>

      {/* All Requests */}
      {(activeTab === "requests" || activeTab === "pending") && (
        <div className="space-y-4">
          {(activeTab === "pending" ? pending : filtered).map(req => (
            <LeaveCard key={req.id} req={req} onAction={handleAction} />
          ))}
          {(activeTab === "pending" ? pending : filtered).length === 0 && (
            <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
              <Calendar style={{ width: 40, height: 40, color: "rgba(255,255,255,0.15)", margin: "0 auto 12px" }} />
              <p style={{ color: "rgba(255,255,255,0.4)" }}>No leave requests found</p>
            </div>
          )}
        </div>
      )}

      {/* Hospital Calendar */}
      {activeTab === "calendar" && <HospitalCalendar requests={requests} />}

      {/* My Balance */}
      {activeTab === "balance" && <MyBalance balances={leaveBalances} />}

      {/* Apply Modal */}
      {showApply && <ApplyLeaveModal onClose={() => setShowApply(false)} onSubmit={handleNewLeave} currentUser={user} />}
    </div>
  );
}
