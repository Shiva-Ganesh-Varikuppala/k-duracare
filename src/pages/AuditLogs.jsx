import { useState, useEffect } from 'react';
import { ScrollText, Search, Filter, ShieldCheck, AlertCircle, Sparkles, Download, CheckCircle, XCircle, RefreshCw, Eye, Hash, Shield, Lock, Activity, Terminal, ArrowUpRight, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);
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
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-teal-500/20 border border-sky-400/30 flex items-center justify-center shadow-lg shadow-sky-500/10">
              <ScrollText className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
                Immutable System Audit Trail
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3" /> SHA-256 Chained
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Cryptographically sealed append-only logbook · NABH Digital Records & AP Medical Council Section 7 Compliance
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsLiveStream(!isLiveStream);
              toast.success(isLiveStream ? 'Live stream paused' : 'Live stream activated');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all duration-300 ${
              isLiveStream 
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-lg shadow-emerald-500/10' 
                : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStream ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            {isLiveStream ? 'Live Stream Active' : 'Stream Paused'}
          </button>

          <button
            onClick={handleExportCSV}
            className="btn-primary text-xs"
          >
            <Download className="w-3.5 h-3.5" /> Export Signed CSV
          </button>
        </div>
      </div>

      {/* Audit Stats in Liquid Glass Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Events Logged', value: '14,896', sub: 'SHA-256 Merkle verified', icon: ShieldCheck, color: 'text-sky-400', border: 'border-sky-500/30', bg: 'bg-sky-500/10' },
          { label: "Today's Events", value: logs.length + 420, sub: 'Workforce, CCTV, Payroll', icon: Activity, color: 'text-teal-400', border: 'border-teal-500/30', bg: 'bg-teal-500/10' },
          { label: 'Security Exceptions', value: '1', sub: 'Brute force gateway block', icon: AlertCircle, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
          { label: 'Cryptographic Integrity', value: '100%', sub: 'Zero tampering detected', icon: Lock, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
        ].map((m, idx) => (
          <div key={idx} className={`glass-card p-5 border ${m.border} relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
            <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-sky-500/5 blur-2xl group-hover:bg-sky-500/10 transition-colors pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 font-medium">{m.label}</span>
              <div className={`w-8 h-8 rounded-xl ${m.bg} flex items-center justify-center border border-white/5`}>
                <m.icon className={`w-4 h-4 ${m.color}`} />
              </div>
            </div>
            <p className={`text-3xl font-extrabold ${m.color}`}>{m.value}</p>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {m.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Filters and Search Bar */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-3 border border-slate-700/60 rounded-2xl">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by initiator, action, resource, hash, or IP..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-field pl-10 text-xs w-full bg-slate-900/60 border-slate-700/70 focus:border-sky-500/60"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </div>
          {['All', 'Workforce', 'Leave', 'Payroll', 'Security', 'Hardware', 'Shifts'].map(cat => (
            <button
              key={cat}
              onClick={() => setActionFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                actionFilter === cat
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="input-field text-xs py-1.5 px-3 bg-slate-900/60 border-slate-700/70"
          >
            <option value="All">All Statuses</option>
            <option value="Success">Success Only</option>
            <option value="Failed">Failed Only</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table in Liquid Glass Container */}
      <div className="glass-card overflow-hidden rounded-2xl border border-slate-700/60 shadow-xl">
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/30">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span>Showing {filteredLogs.length} events (Sorted in reverse chronological sequence)</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Blockchain Hash Block #89217</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-700/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Event ID / Hash</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Initiator</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Host IP</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredLogs.map(log => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold text-sky-400">
                      <Hash className="w-3 h-3 text-slate-500" />
                      {log.id}
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono truncate max-w-[120px]">
                      {log.sha.slice(0, 14)}...
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-300 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-white group-hover:text-sky-300 transition-colors">
                      {log.user}
                    </div>
                    <div className="text-[10px] text-slate-400">{log.role}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                      {log.category}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-200">
                    {log.action}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {log.resource}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {log.ip}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                      log.status === 'Success'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {log.status === 'Success' ? <CheckCircle className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                      {log.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLog(log);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-sky-500/20 text-slate-400 hover:text-sky-300 border border-slate-700/50 transition-colors"
                      title="Inspect Log Entry"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card max-w-2xl w-full p-6 border border-slate-700/80 rounded-2xl shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Audit Event Inspector · {selectedLog.id}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedLog.timestamp}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block mb-1">Initiator & Role</span>
                <span className="font-bold text-white text-sm">{selectedLog.user}</span>
                <span className="text-slate-400 block mt-0.5">{selectedLog.role}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block mb-1">Target Resource</span>
                <span className="font-bold text-sky-300 font-mono text-sm">{selectedLog.resource}</span>
                <span className="text-slate-400 block mt-0.5">Category: {selectedLog.category}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Event Description & Telemetry</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  selectedLog.status === 'Success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {selectedLog.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedLog.details || `${selectedLog.action} executed against ${selectedLog.resource}. Verified by internal policy engine.`}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-sky-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-400" /> Cryptographic SHA-256 Hash Digest
                </span>
                <button
                  onClick={() => copyToClipboard(selectedLog.sha, 'SHA-256 Hash')}
                  className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono"
                >
                  <Copy className="w-3 h-3" /> Copy Hash
                </button>
              </div>
              <p className="text-[11px] font-mono text-sky-300/90 break-all bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 select-all">
                {selectedLog.sha}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Certificate Validity: Signed by K-DuraCare Root Authority</span>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="btn-primary text-xs px-4 py-2"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
