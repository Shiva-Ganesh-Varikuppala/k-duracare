import { useState, useMemo } from "react";
import {
  Calendar, Clock, Check, X, Sparkles, AlertTriangle, User,
  Plus, ChevronLeft, ChevronRight, FileText, BarChart3, Filter
} from "lucide-react";
import { toast } from "react-hot-toast";
import { leaveRequests, leaveBalances, leaveCalendarData } from "../data/leaves";
import { employees } from "../data/employees";
import { useAuth } from "../context/AuthContext";
import PageBreadcrumb from "../components/common/PageBreadcrumb";
import Badge from "../components/ui/badge/Badge";
import Button from "../components/ui/button/Button";

const LEAVE_TYPES = [
  "Casual Leave", "Sick Leave", "Earned Leave", "Maternity Leave",
  "Paternity Leave", "Emergency Leave", "Compensatory Leave"
];

const LEAVE_COLORS = {
  "Casual Leave":       "primary",
  "Sick Leave":         "error",
  "Earned Leave":       "success",
  "Maternity Leave":    "purple",
  "Paternity Leave":    "info",
  "Emergency Leave":    "warning",
  "Compensatory Leave": "warning",
};

const AI_IMPACTS = {
  "KD-EMP-0001": { level: "High",   msg: "Only 2 senior doctors scheduled. Replacement required.",          color: "error" },
  "KD-EMP-0002": { level: "Medium", msg: "Night shift coverage may drop below 80%. Roster adjustment advised.", color: "warning" },
  "KD-EMP-0005": { level: "Low",    msg: "Sufficient backup available. Auto-suggest: Schedule shift swap.",  color: "success" },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
      toast.error("Please fill all required fields");
      return;
    }
    if (new Date(form.to) < new Date(form.from)) {
      toast.error("To date must be after From date");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    onSubmit(form);
    toast.success("Leave application submitted successfully!");
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-glass max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Apply for Leave</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Real-time staffing impact verification enabled</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="input-label">Select Employee</label>
            <select
              value={form.empId}
              onChange={e => setForm(p => ({ ...p, empId: e.target.value }))}
              className="input-field text-sm"
              required
            >
              <option value="">Choose employee...</option>
              {employees.slice(0, 20).map(emp => (
                <option key={emp.empId || emp.id} value={emp.empId || emp.id}>
                  {emp.name} — {emp.department} ({emp.empId || emp.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">Leave Category</label>
            <select
              value={form.type}
              onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
              className="input-field text-sm"
            >
              {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Start Date</label>
              <input
                type="date"
                value={form.from}
                onChange={e => setForm(p => ({ ...p, from: e.target.value }))}
                className="input-field font-mono text-sm"
                required
              />
            </div>
            <div>
              <label className="input-label">End Date</label>
              <input
                type="date"
                value={form.to}
                onChange={e => setForm(p => ({ ...p, to: e.target.value }))}
                className="input-field font-mono text-sm"
                required
              />
            </div>
          </div>

          {days > 0 && (
            <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-3 text-xs text-brand-800 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">
              Total Duration: <strong className="font-mono">{days} day{days > 1 ? "s" : ""}</strong> ({form.type})
            </div>
          )}

          {impact && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs dark:border-amber-500/20 dark:bg-amber-500/10">
              <div className="flex items-center gap-1.5 mb-1 font-bold text-amber-800 dark:text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Roster Impact: </span>
                <Badge variant="solid" color={impact.color} size="sm">{impact.level}</Badge>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{impact.msg}</p>
            </div>
          )}

          <div>
            <label className="input-label">Reason for Request</label>
            <textarea
              value={form.reason}
              onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
              className="input-field text-sm"
              rows={3}
              placeholder="State medical reason or emergency context..."
              required
            />
          </div>

          <div className="flex gap-3 pt-3">
            <Button variant="outline" className="flex-1" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {MONTHS[viewMonth]} {viewYear}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Hospital Staff Leave & Holiday Schedule</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
              else setViewMonth(m => m - 1);
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
              else setViewMonth(m => m + 1);
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs">
        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <span className="w-2.5 h-2.5 rounded bg-brand-500" /> Today
        </span>
        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Present / Approved
        </span>
        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Staff on Leave
        </span>
        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <span className="w-2.5 h-2.5 rounded bg-purple-500" /> Gazetted Holiday
        </span>
      </div>

      {/* Day of Week */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center font-bold text-gray-400 dark:text-gray-500 text-xs py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} className="min-h-[70px]" />;
          const isToday = isCurrentMonth && day === todayDate;
          const leavesOnDay = leaveMap[day] || [];
          const isWeekend = new Date(viewYear, viewMonth, day).getDay() === 0;
          const calEntry = calData[`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`];
          const isHoliday = calEntry?.holiday;

          return (
            <div
              key={day}
              className={`min-h-[70px] rounded-xl border p-2 text-xs transition-all ${
                isToday
                  ? "border-brand-400 bg-brand-50/60 dark:border-brand-500 dark:bg-brand-500/10 shadow-xs"
                  : isHoliday
                  ? "border-purple-200 bg-purple-50/40 dark:border-purple-500/20 dark:bg-purple-500/10"
                  : isWeekend
                  ? "border-gray-100 bg-gray-50/40 dark:border-gray-800 dark:bg-white/[0.01]"
                  : "border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-mono text-xs font-bold ${isToday ? "text-brand-600 dark:text-brand-400" : "text-gray-700 dark:text-gray-300"}`}>
                  {day}
                </span>
                {isHoliday && (
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 truncate">
                    Holiday
                  </span>
                )}
              </div>

              {leavesOnDay.slice(0, 2).map((lr, li) => (
                <div
                  key={li}
                  className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-brand-100/70 text-brand-800 dark:bg-brand-500/20 dark:text-brand-300 truncate mb-1"
                >
                  {lr.employeeName?.split(" ")[0]} ({lr.leaveType?.split(" ")[0]})
                </div>
              ))}
              {leavesOnDay.length > 2 && (
                <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                  +{leavesOnDay.length - 2} more
                </span>
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
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">My Leave Quota — FY 2026-27</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(balances || []).map(b => {
            const pct = Math.round((b.used / (b.allocated || 1)) * 100);
            return (
              <div key={b.type} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="light" color={LEAVE_COLORS[b.type] || "primary"} size="sm">
                    {b.code}
                  </Badge>
                  <span className="font-mono text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {b.allocated}d total
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">{b.type}</p>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all duration-300"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-600 dark:text-rose-400">Used: {b.used}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Avail: {b.available}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Leave Request Card ───────────────────────────────────────────────────────
function LeaveCard({ req, onAction }) {
  const impact = AI_IMPACTS[req.employeeId];
  const statusColor = req.status === "Approved" ? "success" : req.status === "Rejected" ? "error" : "warning";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:border-brand-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-500/30">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600 font-bold text-xs dark:bg-brand-500/10 dark:text-brand-400 flex-shrink-0">
              {(req.employeeName || req.name || "?").charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{req.employeeName || req.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {req.department} · {req.employeeId}
              </p>
            </div>
            <Badge variant="light" color={LEAVE_COLORS[req.leaveType || req.type] || "primary"} size="sm">
              {req.leaveType || req.type}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 text-xs dark:border-gray-800 dark:bg-white/[0.02]">
            <div>
              <span className="text-gray-400 text-[10px] uppercase font-semibold">From</span>
              <p className="font-mono font-medium text-gray-800 dark:text-gray-200">{req.from}</p>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] uppercase font-semibold">To</span>
              <p className="font-mono font-medium text-gray-800 dark:text-gray-200">{req.to}</p>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] uppercase font-semibold">Duration</span>
              <p className="font-mono font-bold text-brand-600 dark:text-brand-400">{req.days} day(s)</p>
            </div>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-300">
            <strong className="text-gray-800 dark:text-gray-200">Reason: </strong>
            {req.reason || "Not specified"}
          </p>

          {impact && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs dark:border-amber-500/20 dark:bg-amber-500/10">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-800 dark:text-amber-300">AI Staffing Risk: </span>
                <span className="text-gray-700 dark:text-gray-300">{impact.msg}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
          <Badge variant="light" color={statusColor} size="md">
            {req.status}
          </Badge>
          {req.status === "Pending" && (
            <div className="flex items-center gap-2 mt-1">
              <Button
                variant="success"
                size="sm"
                startIcon={<Check className="w-4 h-4" />}
                onClick={() => onAction(req.id, "approve")}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                startIcon={<X className="w-4 h-4" />}
                onClick={() => onAction(req.id, "reject")}
              >
                Reject
              </Button>
            </div>
          )}
          {req.approvedBy && (
            <p className="text-[10px] text-gray-400 font-mono">Audited by: {req.approvedBy}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Leave Component ─────────────────────────────────────────────────────
export default function Leave() {
  const { user } = useAuth();
  const [activeTab, setActiveTab]       = useState("requests");
  const [requests, setRequests]         = useState(leaveRequests);
  const [showApply, setShowApply]       = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const pending  = requests.filter(r => r.status === "Pending");
  const filtered = requests.filter(r => statusFilter === "All" || r.status === statusFilter);

  const handleAction = (id, action) => {
    setRequests(prev => prev.map(r => r.id === id
      ? { ...r, status: action === "approve" ? "Approved" : "Rejected", approvedBy: user?.name || "Admin" }
      : r));
    toast.success(`Leave request ${action === "approve" ? "approved" : "rejected"}`);
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
    { id: "requests", label: `All Requests (${requests.length})`, icon: FileText },
    { id: "pending",  label: `Pending Action (${pending.length})`, icon: Clock },
    { id: "calendar", label: "Hospital Calendar",                 icon: Calendar },
    { id: "balance",  label: "My Leave Balance",                  icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb
          pageTitle="Leave Requests & Entitlements"
          breadcrumbs={[
            { label: 'Workforce', path: '/employees' },
            { label: 'Leave' }
          ]}
        />
        <Button
          variant="primary"
          size="sm"
          startIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowApply(true)}
        >
          Apply for Leave
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Pending Approvals", value: pending.length, color: "text-amber-600 dark:text-amber-400" },
          { label: "Approved Requests", value: requests.filter(r => r.status === "Approved").length, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Staff on Floor Leave", value: 12, color: "text-brand-600 dark:text-brand-400" },
          { label: "Rejected Requests", value: requests.filter(r => r.status === "Rejected").length, color: "text-rose-600 dark:text-rose-400" },
        ].map(item => (
          <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <p className={`text-2xl sm:text-3xl font-bold font-mono ${item.color}`}>{item.value}</p>
            <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Tab bar & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-100 p-1.5 dark:border-gray-800 dark:bg-gray-900/60 w-fit">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-white text-brand-600 shadow-xs dark:bg-brand-500 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {(activeTab === "requests" || activeTab === "pending") && (
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="input-field text-xs w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        )}
      </div>

      {/* Requests Lists */}
      {(activeTab === "requests" || activeTab === "pending") && (
        <div className="space-y-4">
          {(activeTab === "pending" ? pending : filtered).map(req => (
            <LeaveCard key={req.id} req={req} onAction={handleAction} />
          ))}
          {(activeTab === "pending" ? pending : filtered).length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
              <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No matching leave requests</p>
            </div>
          )}
        </div>
      )}

      {/* Calendar */}
      {activeTab === "calendar" && <HospitalCalendar requests={requests} />}

      {/* Balance */}
      {activeTab === "balance" && <MyBalance balances={leaveBalances} />}

      {/* Modal */}
      {showApply && (
        <ApplyLeaveModal
          onClose={() => setShowApply(false)}
          onSubmit={handleNewLeave}
          currentUser={user}
        />
      )}
    </div>
  );
}
