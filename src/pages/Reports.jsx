import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, BarChart3, Calendar, Users, Clock, Wallet, Shield, Activity, Sparkles, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { employees } from '../data/employees';
import { attendanceHistory } from '../data/attendance';
import { leaveRequests } from '../data/leaves';
import { payrollRecords } from '../data/payroll';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import Badge from '../components/ui/badge/Badge';

const REPORTS = [
  { id: 'monthly-attendance',  title: 'Monthly Attendance Report',   desc: 'Full muster roll with present/absent/late/leave breakdown per department', icon: Users,     category: 'Attendance', formats: ['PDF', 'XLSX', 'CSV'] },
  { id: 'shift-roster',        title: 'Shift Roster Export',         desc: 'Weekly/monthly shift assignments for all staff across all departments',    icon: Clock,     category: 'Shifts',     formats: ['PDF', 'XLSX'] },
  { id: 'payroll-summary',     title: 'Payroll Summary Report',      desc: 'Gross, deductions, net pay per employee with statutory compliance summary', icon: Wallet,    category: 'Payroll',    formats: ['PDF', 'XLSX'] },
  { id: 'leave-analysis',      title: 'Leave Analysis Report',       desc: 'Leave pattern analysis — type-wise, department-wise, seasonal trends',     icon: Calendar,  category: 'Leave',      formats: ['PDF', 'XLSX', 'CSV'] },
  { id: 'department-coverage', title: 'Department Coverage Report',  desc: 'AI-driven staffing adequacy analysis per department with recommendations', icon: BarChart3,  category: 'Analytics',  formats: ['PDF', 'XLSX'] },
  { id: 'cctv-incidents',      title: 'CCTV Incident Log',           desc: 'All AI-detected incidents, alerts resolved/pending with timestamps',       icon: Activity,  category: 'Security',   formats: ['PDF', 'CSV'] },
  { id: 'nabh-compliance',     title: 'NABH Compliance Report',      desc: 'Audit-ready compliance summary — staffing ratios, training, policy',       icon: Shield,    category: 'Compliance', formats: ['PDF'] },
  { id: 'ai-insights',         title: 'AI Insights Summary',         desc: 'Aggregated K-DuraCare AI recommendations, anomalies, and action items',   icon: Sparkles,  category: 'AI',         formats: ['PDF', 'XLSX'] },
  { id: 'hr-analytics',        title: 'HR Analytics Report',         desc: 'Attrition analysis, hiring trends, performance correlations',              icon: Users,     category: 'HR',         formats: ['PDF', 'XLSX', 'CSV'] },
];

const CATEGORY_BADGE = {
  Attendance: 'info', Shifts: 'warning', Payroll: 'success',
  Leave: 'purple', Analytics: 'primary', Security: 'error',
  Compliance: 'info', AI: 'primary', HR: 'success',
};

const FMT_BADGE = { PDF: 'error', XLSX: 'success', CSV: 'warning' };

/* ─── helpers ─── */
function toCSV(headers, rows) {
  return [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
}
function triggerDownload(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
}
function generateReportContent(reportId, fmt) {
  const now = new Date().toLocaleString('en-IN');
  const ext  = fmt.toLowerCase();
  const mime = fmt === 'CSV' ? 'text/csv' : fmt === 'XLSX' ? 'application/vnd.ms-excel' : 'text/plain';

  if (reportId === 'monthly-attendance' && fmt === 'CSV') {
    const rows = (employees || []).map(e => [e.empId || e.id, e.name, e.department, 22, 2, 1, 1, '88%']);
    return { content: toCSV(['Emp ID', 'Name', 'Department', 'Present', 'Absent', 'Late', 'On Leave', 'Attendance %'], rows), mime, ext };
  }
  return {
    content: `K-DURACARE — Kanakadurga Nursing Home\n${reportId.toUpperCase()} · ${fmt}\nGenerated: ${now}\n\n[Report content ready for export]`,
    mime, ext,
  };
}

/* ─── Report card ─── */
function ReportCard({ report, onDownload }) {
  const [downloading, setDownloading] = useState(null);
  const Icon = report.icon;

  const handleDownload = async (fmt) => {
    setDownloading(fmt);
    await new Promise(r => setTimeout(r, 800));
    try {
      const { content, mime, ext } = generateReportContent(report.id, fmt);
      triggerDownload(content, `${report.id}-${new Date().toISOString().slice(0, 10)}.${ext}`, mime);
      onDownload(report.title, fmt);
    } catch { toast.error('Download failed'); }
    setDownloading(null);
  };

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.05]">
          <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="light" color={CATEGORY_BADGE[report.category] || 'primary'} size="sm">
              {report.category}
            </Badge>
          </div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white leading-snug">{report.title}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="flex-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{report.desc}</p>

      {/* Download buttons */}
      <div className="flex flex-wrap gap-2">
        {report.formats.map(fmt => {
          const isLoading = downloading === fmt;
          return (
            <button
              key={fmt}
              onClick={() => handleDownload(fmt)}
              disabled={!!downloading}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:border-gray-300 disabled:opacity-40 dark:border-gray-700 dark:bg-white/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.08] transition-colors"
            >
              {isLoading
                ? <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                : <Download className="h-3 w-3" />}
              {isLoading ? 'Generating…' : fmt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function Reports() {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [downloads, setDownloads] = useState([]);

  const categories = ['All', ...new Set(REPORTS.map(r => r.category))];
  const filtered   = REPORTS.filter(r => categoryFilter === 'All' || r.category === categoryFilter);

  const handleDownload = (title, fmt) => {
    setDownloads(prev => [{ title, fmt, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
    toast.success(`${title} · ${fmt} downloaded`);
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        pageTitle="Reports"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Reports' }]}
      />

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Templates',   value: REPORTS.length },
          { label: 'Downloaded Today',  value: downloads.length },
          { label: 'Scheduled Reports', value: 3 },
          { label: 'AI-Powered',        value: REPORTS.filter(r => r.category === 'AI').length },
        ].map(item => (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{item.value}</p>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="tab-bar flex-wrap">
        {categories.map(cat => (
          <button key={cat} className={categoryFilter === cat ? 'tab-active' : 'tab-item'} onClick={() => setCategoryFilter(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(report => (
          <ReportCard key={report.id} report={report} onDownload={handleDownload} />
        ))}
      </div>

      {/* Recent downloads */}
      {downloads.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="mb-3 text-sm font-semibold text-gray-800 dark:text-white">Recent downloads</p>
          <div className="space-y-2.5">
            {downloads.map((d, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <CheckCircle className="h-3.5 w-3.5 text-brand-500 flex-shrink-0" />
                <span className="flex-1 text-gray-700 dark:text-gray-200">{d.title}</span>
                <Badge variant="light" color={FMT_BADGE[d.fmt] || 'primary'} size="sm">{d.fmt}</Badge>
                <span className="font-mono text-[11px] text-gray-400">{d.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
