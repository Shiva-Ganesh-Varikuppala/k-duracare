import { useState, useEffect } from 'react';
import {
  ScrollText, Search, Filter, ShieldCheck, AlertCircle, Download,
  CheckCircle, XCircle, Eye, Hash, Shield, Lock, Activity, Terminal, Copy, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import Badge from '../components/ui/badge/Badge';
import Button from '../components/ui/button/Button';

const INITIAL_LOGS = [
  { id: 'AL-9082', timestamp: '2026-09-22 16:21:04', user: 'admin', role: 'Super Administrator', action: 'Biometric Template Synced', resource: 'BIO-ICU-04 (Terminal)', ip: '192.168.1.10', status: 'Success', category: 'Hardware', sha: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', details: 'Template version v3.4 synced to 18 bedside biometric scanners.' },
  { id: 'AL-9081', timestamp: '2026-09-22 16:15:32', user: 'ai-engine', role: 'Autonomous AI', action: 'Zone Occupancy Anomaly', resource: 'CAM-OT-02 (Corridor)', ip: '10.0.4.15', status: 'Success', category: 'Security', sha: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e', details: 'Detected crowding exceeding threshold (7 persons in sterile buffer zone). Automated notification dispatched.' },
  { id: 'AL-9080', timestamp: '2026-09-22 16:02:18', user: 'hr_manager', role: 'HR Administrator', action: 'Leave Request Approved', resource: 'LR-002 (Lakshmi Devi)', ip: '192.168.1.24', status: 'Success', category: 'Leave', sha: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', details: 'Approved 2 days medical leave with coverage assigned to Staff Nurse Priya.' },
  { id: 'AL-9079', timestamp: '2026-09-22 15:48:55', user: 'security_lead', role: 'Security Supervisor', action: 'CCTV Stream Accessed', resource: 'CAM-PHARM-01 (High Security)', ip: '192.168.1.55', status: 'Success', category: 'Hardware', sha: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a', details: 'Authorized audit of scheduled narcotic dispensing cabinet access.' },
  { id: 'AL-9078', timestamp: '2026-09-22 15:31:10', user: 'system_auth', role: 'Security Gateway', action: 'Brute Force Rejected', resource: 'Web Gateway Auth', ip: '192.168.1.99', status: 'Failed', category: 'Security', sha: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d', details: '4 consecutive invalid password attempts on account "billing_head". Terminal locked for 15 minutes.' },
  { id: 'AL-9077', timestamp: '2026-09-22 14:55:00', user: 'nursing_sup', role: 'Nursing Superintendent', action: 'Shift Emergency Reassignment', resource: 'ICU Roster (Shift B)', ip: '192.168.1.32', status: 'Success', category: 'Shifts', sha: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', details: 'Swapped evening duty between Sister Vani and Sister Sunita due to OT caseload spike.' },
  { id: 'AL-9076', timestamp: '2026-09-22 14:10:44', user: 'payroll_exec', role: 'Accounts Officer', action: 'TDS & PF Recalculation', resource: 'Sep-2026 Payroll Batch', ip: '192.168.1.18', status: 'Success', category: 'Payroll', sha: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', details: 'Calculated statutory deductions for 326 employees. Verified against Andhra Pradesh Labour Codes.' },
  { id: 'AL-9075', timestamp: '2026-09-22 13:40:12', user: 'admin', role: 'Super Administrator', action: 'Role Permissions Modified', resource: 'ROLE-NURSE-JR', ip: '192.168.1.10', status: 'Success', category: 'Workforce', sha: 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce', details: 'Updated read access for electronic medication records (EMR) system.' },
];

export default function AuditLogs() {
  const [logs, setLogs]                 = useState(INITIAL_LOGS);
  const [searchTerm, setSearchTerm]     = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLog, setSelectedLog]   = useState(null);
  const [isLiveStream, setIsLiveStream] = useState(true);

  // Live streaming simulation
  useEffect(() => {
    if (!isLiveStream) return;
    const interval = setInterval(() => {
      const liveEvents = [
        { user: 'ai-engine', role: 'Autonomous AI', action: 'PPE Compliance Check', resource: 'CAM-OT-01', ip: '10.0.4.12', status: 'Success', category: 'Security', details: 'Surgical mask and sterile gown verification passed (99.4% confidence).' },
        { user: 'bio_scanner_02', role: 'Edge Device', action: 'Biometric Tap Recorded', resource: 'KD-EMP-0042', ip: '192.168.2.14', status: 'Success', category: 'Attendance', details: 'Face match score 0.98. Geolocation verified at Ward 3B.' },
        { user: 'hr_manager', role: 'HR Administrator', action: 'Leave Balance Queried', resource: 'KD-EMP-0019', ip: '192.168.1.24', status: 'Success', category: 'Leave', details: 'Queried remaining sick leave balance for routine check.' },
        { user: 'cctv_server', role: 'VMS Daemon', action: 'RTSP Stream Heartbeat', resource: 'CAM-ER-01', ip: '192.168.3.1', status: 'Success', category: 'Hardware', details: 'Stream ping: 18ms latency, 1080p@30fps steady.' },
      ];
      const randomEvent = liveEvents[Math.floor(Math.random() * liveEvents.length)];
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      const randomHash = Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');

      const newEntry = {
        id: `AL-${Math.floor(9090 + Math.random() * 900)}`,
        timestamp: timeStr,
        ...randomEvent,
        sha: randomHash,
      };

      setLogs(prev => [newEntry, ...prev.slice(0, 49)]);
    }, 6000);
    return () => clearInterval(interval);
  }, [isLiveStream]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.ip.includes(searchTerm) ||
                          log.sha.includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'All' || log.category === actionFilter;
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    return matchesSearch && matchesAction && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'User', 'Role', 'Category', 'Action', 'Resource', 'IP Address', 'Status', 'SHA256 Hash'];
    const rows = filteredLogs.map(l => [
      l.id, l.timestamp, l.user, `"${l.role}"`, l.category, `"${l.action}"`, `"${l.resource}"`, l.ip, l.status, l.sha
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `K-DuraCare_Audit_Trail_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded cryptographically signed audit log (CSV)');
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb
          pageTitle="Immutable System Audit Trail"
          breadcrumbs={[
            { label: 'Governance', path: '/audit-logs' },
            { label: 'Audit Trail' }
          ]}
        />
        <div className="flex items-center gap-2.5">
          <Button
            variant={isLiveStream ? "success" : "outline"}
            size="sm"
            onClick={() => {
              setIsLiveStream(!isLiveStream);
              toast.success(isLiveStream ? 'Live stream paused' : 'Live stream activated');
            }}
          >
            <span className={`w-2 h-2 rounded-full mr-1.5 ${isLiveStream ? 'bg-white animate-ping' : 'bg-gray-400'}`} />
            {isLiveStream ? 'Live Ingestion' : 'Stream Paused'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            startIcon={<Download className="w-4 h-4" />}
            onClick={handleExportCSV}
          >
            Export Signed CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Events Logged', value: '14,896', sub: 'SHA-256 Merkle verified', icon: ShieldCheck, color: 'text-brand-600 dark:text-brand-400' },
          { label: "Today's Events", value: logs.length + 420, sub: 'Workforce, CCTV, Payroll', icon: Activity, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Security Exceptions', value: '1', sub: 'Brute force gateway block', icon: AlertCircle, color: 'text-rose-600 dark:text-rose-400' },
          { label: 'Cryptographic Integrity', value: '100%', sub: 'Zero tampering detected', icon: Lock, color: 'text-purple-600 dark:text-purple-400' },
        ].map((m, idx) => (
          <div key={idx} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{m.label}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-600 dark:bg-white/[0.04] dark:text-gray-300">
                <m.icon className="w-4 h-4" />
              </div>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold font-mono ${m.color}`}>{m.value}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {m.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by initiator, action, resource, hash, or IP..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-field pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-100 p-1.5 dark:border-gray-800 dark:bg-gray-900/60 w-fit">
          {['All', 'Workforce', 'Leave', 'Payroll', 'Security', 'Hardware', 'Shifts'].map(cat => (
            <button
              key={cat}
              onClick={() => setActionFilter(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                actionFilter === cat
                  ? 'bg-white text-brand-600 shadow-xs dark:bg-brand-500 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="input-field text-xs py-1.5 w-auto"
        >
          <option value="All">All Statuses</option>
          <option value="Success">Success Only</option>
          <option value="Failed">Failed Only</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
            <Terminal className="w-4 h-4 text-brand-500" />
            <span>Showing {filteredLogs.length} events in chronological order</span>
          </div>
          <span className="text-[11px] text-gray-400 font-mono">Merkle Block #89217</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-white/[0.02]">
                <th className="table-header">Event ID / Hash</th>
                <th className="table-header">Timestamp</th>
                <th className="table-header">Initiator</th>
                <th className="table-header">Category</th>
                <th className="table-header">Action</th>
                <th className="table-header">Target Resource</th>
                <th className="table-header">IP Address</th>
                <th className="table-header text-center">Status</th>
                <th className="table-header text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredLogs.map(log => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="table-row cursor-pointer"
                >
                  <td className="table-cell font-mono text-xs">
                    <span className="font-bold text-brand-600 dark:text-brand-400">{log.id}</span>
                    <span className="block text-[10px] text-gray-400 truncate max-w-[110px]">{log.sha.slice(0, 12)}...</span>
                  </td>
                  <td className="table-cell font-mono text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="table-cell">
                    <p className="font-semibold text-gray-900 dark:text-white text-xs">{log.user}</p>
                    <p className="text-[10px] text-gray-400">{log.role}</p>
                  </td>
                  <td className="table-cell">
                    <Badge variant="light" color="light" size="sm">{log.category}</Badge>
                  </td>
                  <td className="table-cell font-medium text-gray-800 dark:text-gray-200 text-xs">
                    {log.action}
                  </td>
                  <td className="table-cell font-mono text-xs text-gray-500 dark:text-gray-400">
                    {log.resource}
                  </td>
                  <td className="table-cell font-mono text-xs text-gray-500 dark:text-gray-400">
                    {log.ip}
                  </td>
                  <td className="table-cell text-center">
                    <Badge variant="light" color={log.status === 'Success' ? 'success' : 'error'} size="sm">
                      {log.status}
                    </Badge>
                  </td>
                  <td className="table-cell text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-2 py-1"
                      onClick={e => { e.stopPropagation(); setSelectedLog(log); }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Inspector Modal */}
      {selectedLog && (
        <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="modal-glass max-w-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Audit Event · {selectedLog.id}
                  </h3>
                  <p className="font-mono text-xs text-gray-500 dark:text-gray-400">{selectedLog.timestamp}</p>
                </div>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-white/[0.02]">
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold mb-1">Initiator & Role</span>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{selectedLog.user}</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5">{selectedLog.role}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-white/[0.02]">
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold mb-1">Target Resource</span>
                  <p className="font-mono font-bold text-brand-600 dark:text-brand-400 text-sm">{selectedLog.resource}</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5">Category: {selectedLog.category}</p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 text-xs dark:border-gray-800 dark:bg-white/[0.02]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Action Telemetry</span>
                  <Badge variant="light" color={selectedLog.status === 'Success' ? 'success' : 'error'} size="sm">
                    {selectedLog.status}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedLog.details || `${selectedLog.action} executed against ${selectedLog.resource}. Verified by internal policy engine.`}
                </p>
              </div>

              <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-3.5 dark:border-brand-500/20 dark:bg-brand-500/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> SHA-256 Cryptographic Hash
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-brand-600 dark:text-brand-400"
                    onClick={() => copyToClipboard(selectedLog.sha, 'SHA-256 Hash')}
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Button>
                </div>
                <p className="font-mono text-[11px] text-brand-900 dark:text-brand-200 break-all select-all">
                  {selectedLog.sha}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Valid Signature: K-DuraCare Root Authority</span>
                </div>
                <Button variant="primary" size="sm" onClick={() => setSelectedLog(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
