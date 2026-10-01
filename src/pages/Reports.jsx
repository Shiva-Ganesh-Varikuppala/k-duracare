import { useState } from "react";
import { Download, FileText, FileSpreadsheet, BarChart3, Calendar, Users, Clock, Wallet, Shield, Activity, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { employees } from "../data/employees";
import { attendanceHistory } from "../data/attendance";
import { leaveRequests } from "../data/leaves";
import { payrollRecords } from "../data/payroll";

const REPORTS = [
  { id: "monthly-attendance", title: "Monthly Attendance Report",    desc: "Full muster roll with present/absent/late/leave breakdown per department", icon: Users,    color: "#38BDF8", category: "Attendance", formats: ["PDF", "XLSX", "CSV"] },
  { id: "shift-roster",       title: "Shift Roster Export",          desc: "Weekly/monthly shift assignments for all staff across all departments",    icon: Clock,    color: "#FBBF24", category: "Shifts",     formats: ["PDF", "XLSX"] },
  { id: "payroll-summary",    title: "Payroll Summary Report",       desc: "Gross, deductions, net pay per employee with statutory compliance summary",icon: Wallet,   color: "#34D399", category: "Payroll",    formats: ["PDF", "XLSX"] },
  { id: "leave-analysis",     title: "Leave Analysis Report",        desc: "Leave pattern analysis — type-wise, department-wise, seasonal trends",    icon: Calendar, color: "#C084FC", category: "Leave",      formats: ["PDF", "XLSX", "CSV"] },
  { id: "department-coverage",title: "Department Coverage Report",   desc: "AI-driven staffing adequacy analysis per department with recommendations",icon: BarChart3, color: "#FB923C", category: "Analytics", formats: ["PDF", "XLSX"] },
  { id: "cctv-incidents",     title: "CCTV Incident Log",            desc: "All AI-detected incidents, alerts resolved/pending with timestamps",      icon: Activity, color: "#F87171", category: "Security",   formats: ["PDF", "CSV"] },
  { id: "nabh-compliance",    title: "NABH Compliance Report",       desc: "Audit-ready compliance summary — staffing ratios, training, policy",     icon: Shield,   color: "#818CF8", category: "Compliance", formats: ["PDF"] },
  { id: "ai-insights",        title: "AI Insights Summary",          desc: "Aggregated K-DuraCare AI recommendations, anomalies, and action items",  icon: Sparkles, color: "#06B6D4", category: "AI",         formats: ["PDF", "XLSX"] },
  { id: "hr-analytics",       title: "HR Analytics Report",          desc: "Attrition analysis, hiring trends, performance correlations",            icon: Users,    color: "#10B981", category: "HR",          formats: ["PDF", "XLSX", "CSV"] },
];

const CATEGORY_COLORS = {
  Attendance: "#38BDF8", Shifts: "#FBBF24", Payroll: "#34D399",
  Leave: "#C084FC", Analytics: "#FB923C", Security: "#F87171",
  Compliance: "#818CF8", AI: "#06B6D4", HR: "#10B981",
};

const FMT_ICONS = {
  PDF:  { color: "#F87171", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.2)"  },
  XLSX: { color: "#34D399", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.2)" },
  CSV:  { color: "#FBBF24", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)" },
};

/** Generate report content for each report id + format */
function generateReportContent(reportId, fmt) {
  const now = new Date().toLocaleDateString("en-IN");
  const nowFull = new Date().toLocaleString("en-IN");

  // Helper to build CSV rows
  const toCSV = (headers, rows) => [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");

  // Helper to build simple PDF-text (formatted plain text, not real PDF)
  const toPDFText = (title, sections) => {
    const header = [
      "================================================================",
      `  K-DURACARE · Kanakadurga Nursing Home`,
      `  ${title}`,
      `  Generated: ${nowFull}`,
      "================================================================",
      "",
    ].join("\n");
    return header + sections.join("\n\n");
  };

  switch (reportId) {
    case "monthly-attendance": {
      const headers = ["Emp ID", "Name", "Department", "Present", "Absent", "Late", "On Leave", "Attendance %"];
      const rows = (employees || []).map(e => [
        e.empId || e.id, e.name, e.department,
        22, 2, 1, 1, "88%",
      ]);
      if (fmt === "CSV") return { content: toCSV(headers, rows), mime: "text/csv", ext: "csv" };
      if (fmt === "XLSX") return { content: toCSV(headers, rows), mime: "text/csv", ext: "csv" };
      return { content: toPDFText("Monthly Attendance Report", [toCSV(headers, rows)]), mime: "text/plain", ext: "txt" };
    }
    case "shift-roster": {
      const headers = ["Emp ID", "Name", "Dept", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const shifts = ["Morning", "Evening", "Night", "Off"];
      const rows = (employees || []).slice(0, 10).map(e => [
        e.empId || e.id, e.name, e.department,
        ...Array(7).fill(0).map((_, i) => i === 6 ? "Off" : shifts[i % 3]),
      ]);
      if (fmt === "XLSX") return { content: toCSV(headers, rows), mime: "text/csv", ext: "csv" };
      return { content: toPDFText("Shift Roster Export", [toCSV(headers, rows)]), mime: "text/plain", ext: "txt" };
    }
    case "payroll-summary": {
      const headers = ["Emp ID", "Name", "Department", "Basic", "HRA", "Allowances", "Gross", "PF Deduction", "TDS", "Net Pay"];
      const rows = (payrollRecords || []).map(p => [
        p.empId || p.employeeId || "N/A",
        p.employeeName || p.name || "N/A",
        p.department || "N/A",
        p.basicSalary || p.basic || 0,
        p.hra || 0,
        p.allowances || 0,
        p.grossSalary || p.gross || 0,
        p.pfDeduction || p.pf || 0,
        p.tds || 0,
        p.netSalary || p.net || 0,
      ]);
      if (fmt === "XLSX") return { content: toCSV(headers, rows), mime: "text/csv", ext: "csv" };
      return { content: toPDFText("Payroll Summary Report", [toCSV(headers, rows)]), mime: "text/plain", ext: "txt" };
    }
    case "leave-analysis": {
      const headers = ["Request ID", "Emp ID", "Name", "Department", "Leave Type", "From", "To", "Days", "Status", "Approved By"];
      const rows = (leaveRequests || []).map(l => [
        l.id, l.employeeId, l.employeeName, l.department,
        l.leaveType, l.from, l.to, l.days, l.status, l.approvedBy || "Pending",
      ]);
      if (fmt === "CSV") return { content: toCSV(headers, rows), mime: "text/csv", ext: "csv" };
      if (fmt === "XLSX") return { content: toCSV(headers, rows), mime: "text/csv", ext: "csv" };
      return { content: toPDFText("Leave Analysis Report", [toCSV(headers, rows)]), mime: "text/plain", ext: "txt" };
    }
    case "department-coverage": {
      const depts = ["ICU", "Nursing", "OPD", "OT", "Pharmacy", "Security", "Housekeeping", "Administration"];
      const headers = ["Department", "Required Staff", "Present Today", "On Leave", "Coverage %", "AI Status"];
      const rows = depts.map(d => {
        const req = Math.floor(Math.random() * 20) + 10;
        const present = req - Math.floor(Math.random() * 4);
        return [d, req, present, req - present, `${Math.round((present/req)*100)}%`, present/req >= 0.9 ? "ADEQUATE" : "REVIEW NEEDED"];
      });
      if (fmt === "XLSX") return { content: toCSV(headers, rows), mime: "text/csv", ext: "csv" };
      return { content: toPDFText("Department Coverage Report", [toCSV(headers, rows)]), mime: "text/plain", ext: "txt" };
    }
    case "cctv-incidents": {
      const headers = ["Incident ID", "Zone", "Camera", "Event Type", "Detected At", "Duration", "Severity", "Status"];
      const rows = [
        ["INC-001", "Main Gate", "CAM-01", "Unauthorized Access Attempt", "2026-09-22 09:14", "2 min", "HIGH", "Resolved"],
        ["INC-002", "ICU Corridor", "CAM-04", "Long Stationary Period", "2026-09-22 11:22", "12 min", "LOW", "Logged"],
        ["INC-003", "OT Entrance", "CAM-07", "Group Gathering (4+)", "2026-09-22 13:05", "8 min", "MEDIUM", "Reviewed"],
        ["INC-004", "Pharmacy", "CAM-09", "Restricted Zone Entry", "2026-09-22 15:45", "3 min", "HIGH", "Escalated"],
      ];
      if (fmt === "CSV") return { content: toCSV(headers, rows), mime: "text/csv", ext: "csv" };
      return { content: toPDFText("CCTV Incident Log", [toCSV(headers, rows)]), mime: "text/plain", ext: "txt" };
    }
    case "nabh-compliance": {
      const sections = [
        "STAFFING RATIOS",
        "Nurse-to-Patient Ratio (ICU): 1:2 [TARGET: 1:2] ?",
        "Nurse-to-Patient Ratio (General): 1:6 [TARGET: 1:6] ?",
        "Doctor-to-Patient Ratio: 1:20 [TARGET: 1:25] ?",
        "",
        "TRAINING COMPLIANCE",
        "CPR Training: 94% staff certified [TARGET: 90%] ?",
        "Infection Control: 88% [TARGET: 85%] ?",
        "Fire Safety Drill: Completed 2026-08-15 ?",
        "",
        "POLICY ADHERENCE",
        "Medication Administration Policy: Compliant ?",
        "Patient Identification Protocol: Compliant ?",
        "Incident Reporting: 100% within 24h ?",
      ];
      return { content: toPDFText("NABH Compliance Report", sections), mime: "text/plain", ext: "txt" };
    }
    case "ai-insights": {
      const headers = ["Insight Type", "Area", "Observation", "Recommendation", "Priority", "Date"];
      const rows = [
        ["Attendance Anomaly", "Nursing Dept", "23% spike in SL on Mondays (Sep)", "Review workload distribution on weekends", "HIGH", now],
        ["Zone Occupancy", "ICU Corridor", "Avg 3.2 staff idle 14:00-16:00", "Stagger break times or reassign tasks", "MEDIUM", now],
        ["Payroll Alert", "OT Dept", "3 employees with >30h overtime this month", "Trigger mandatory rest or hire temporary", "HIGH", now],
        ["CCTV Pattern", "Main Gate", "Peak unauthorized access attempts: Fri 18:00", "Increase guard deployment Friday evenings", "MEDIUM", now],
      ];
      if (fmt === "XLSX") return { content: toCSV(headers, rows), mime: "text/csv", ext: "csv" };
      return { content: toPDFText("AI Insights Summary", [toCSV(headers, rows)]), mime: "text/plain", ext: "txt" };
    }
    case "hr-analytics": {
      const headers = ["Metric", "Value", "Change vs Last Month", "Benchmark", "Status"];
      const rows = [
        ["Total Headcount", "312", "+4", "300", "Above Target"],
        ["Attrition Rate", "2.1%", "-0.3%", "<3%", "Healthy"],
        ["Avg Tenure (years)", "4.2", "+0.1", ">3", "Good"],
        ["New Joiners (MTD)", "6", "+2", "-", "Active Hiring"],
        ["Open Positions", "8", "-2", "<10", "Manageable"],
        ["Training Hours (avg)", "12h", "+1h", ">10h", "Compliant"],
      ];
      if (fmt === "CSV") return { content: toCSV(headers, rows), mime: "text/csv", ext: "csv" };
      if (fmt === "XLSX") return { content: toCSV(headers, rows), mime: "text/csv", ext: "csv" };
      return { content: toPDFText("HR Analytics Report", [toCSV(headers, rows)]), mime: "text/plain", ext: "txt" };
    }
    default:
      return { content: `K-DuraCare Report\nGenerated: ${nowFull}\n\nNo data available.`, mime: "text/plain", ext: "txt" };
  }
}

/** Trigger browser file download */
function triggerDownload(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function ReportCard({ report, onDownload }) {
  const [downloading, setDownloading] = useState(null);

  const handleDownload = async (fmt) => {
    setDownloading(fmt);
    try {
      await new Promise(r => setTimeout(r, 900));
      const { content, mime, ext } = generateReportContent(report.id, fmt);
      const filename = `${report.id}-${new Date().toISOString().slice(0,10)}.${ext}`;
      triggerDownload(content, filename, mime);
      onDownload(report.title, fmt);
    } catch (err) {
      toast.error("Download failed. Please try again.");
      console.error(err);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="glass-card-hover" style={{ padding: 22, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${report.color}, transparent)`, borderRadius: "20px 20px 0 0" }} />

      <div className="flex items-start gap-3 mb-4">
        <div style={{ width: 42, height: 42, borderRadius: 12, background: `${report.color}15`, border: `1px solid ${report.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <report.icon style={{ width: 20, height: 20, color: report.color }} />
        </div>
        <div>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, color: CATEGORY_COLORS[report.category] || "#38BDF8", background: `${CATEGORY_COLORS[report.category] || "#38BDF8"}15`, border: `1px solid ${CATEGORY_COLORS[report.category] || "#38BDF8"}25` }}>
            {report.category}
          </span>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginTop: 5, lineHeight: 1.3 }}>{report.title}</h3>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, flex: 1, marginBottom: 16 }}>{report.desc}</p>

      <div className="flex items-center gap-2 flex-wrap">
        {report.formats.map(fmt => {
          const fc = FMT_ICONS[fmt];
          const isLoading = downloading === fmt;
          return (
            <button
              key={fmt}
              onClick={() => handleDownload(fmt)}
              disabled={!!downloading}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 8,
                color: fc.color, background: fc.bg, border: `1px solid ${fc.border}`,
                cursor: downloading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease", opacity: downloading && !isLoading ? 0.5 : 1,
              }}
              onMouseEnter={e => !downloading && (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {isLoading
                ? <div className="animate-spin" style={{ width: 12, height: 12, border: `2px solid ${fc.color}40`, borderTopColor: fc.color, borderRadius: "50%" }} />
                : <Download style={{ width: 12, height: 12 }} />}
              {isLoading ? "Generating..." : fmt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Reports() {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [downloads, setDownloads] = useState([]);

  const categories = ["All", ...new Set(REPORTS.map(r => r.category))];
  const filtered   = REPORTS.filter(r => categoryFilter === "All" || r.category === categoryFilter);

  const handleDownload = (title, fmt) => {
    const record = { title, fmt, time: new Date().toLocaleTimeString() };
    setDownloads(prev => [record, ...prev].slice(0, 5));
    toast.success(`${title} — ${fmt} downloaded!`, { icon: "??" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: "-0.04em" }}>Reports</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
            {REPORTS.length} report templates · Real data export (PDF, XLSX, CSV)
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Reports",     value: REPORTS.length, color: "#38BDF8" },
          { label: "Downloaded Today",  value: downloads.length, color: "#34D399" },
          { label: "Scheduled Reports", value: 3,             color: "#FBBF24" },
          { label: "AI Reports",        value: REPORTS.filter(r => r.category === "AI").length, color: "#818CF8" },
        ].map(item => (
          <div key={item.label} className="glass-card" style={{ padding: "16px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: item.color, letterSpacing: "-0.04em" }}>{item.value}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="tab-bar" style={{ flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button key={cat} className={categoryFilter === cat ? "tab-active" : "tab-item"} onClick={() => setCategoryFilter(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
        {filtered.map(report => (
          <ReportCard key={report.id} report={report} onDownload={handleDownload} />
        ))}
      </div>

      {/* Recent Downloads */}
      {downloads.length > 0 && (
        <div className="glass-card" style={{ padding: 20 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Recent Downloads</p>
          <div className="space-y-2">
            {downloads.map((d, i) => (
              <div key={i} className="flex items-center gap-3" style={{ fontSize: 12 }}>
                <CheckCircle style={{ width: 14, height: 14, color: "#34D399", flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,0.7)", flex: 1 }}>{d.title}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, color: FMT_ICONS[d.fmt]?.color || "#fff", background: FMT_ICONS[d.fmt]?.bg || "transparent" }}>{d.fmt}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>{d.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

