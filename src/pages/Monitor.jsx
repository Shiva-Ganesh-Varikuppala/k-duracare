import { useState, useEffect } from 'react';
import { Video, WifiOff, Sparkles, AlertTriangle, Settings, RefreshCw, Search } from 'lucide-react';
import { cameras, cameraAlerts } from '../data/cameras';
import { toast } from 'react-hot-toast';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import Badge from '../components/ui/badge/Badge';
import Button from '../components/ui/button/Button';

const STATUS_CFG = {
  Online:   { badgeColor: 'success', dot: '#10B981' },
  Degraded: { badgeColor: 'warning', dot: '#F59E0B' },
  Offline:  { badgeColor: 'error',   dot: '#EF4444' },
};

const ALERT_BADGE = {
  Critical: 'error',
  High:     'warning',
  Medium:   'warning',
  Low:      'info',
};

function CameraFeedCard({ camera, onClick }) {
  const [blink, setBlink] = useState(false);
  const s = STATUS_CFG[camera.status] || STATUS_CFG.Offline;
  const isOn = camera.status === 'Online';

  useEffect(() => {
    if (!isOn || !camera.aiActive) return;
    const t = setInterval(() => setBlink(b => !b), 3000 + Math.random() * 4000);
    return () => clearInterval(t);
  }, [isOn, camera.aiActive]);

  return (
    <div
      onClick={() => onClick(camera)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03]"
    >
      {/* Video surface */}
      <div className="relative aspect-video overflow-hidden bg-gray-950">
        {/* Scan lines */}
        {isOn && (
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 3px)' }}
          />
        )}
        {/* Grid overlay */}
        {isOn && (
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)', backgroundSize: '25% 25%' }}
          />
        )}
        {/* AI detection bounding box */}
        {isOn && camera.aiActive && blink && camera.persons > 0 && (
          <div className="absolute" style={{ top: '30%', left: '20%', width: '35%', height: '40%', border: '1.5px solid rgba(99,102,241,0.7)', borderRadius: 2, boxShadow: '0 0 8px rgba(99,102,241,0.3)' }}>
            <span className="absolute -top-2 left-1 rounded bg-indigo-500/80 px-1 text-[7px] font-bold uppercase text-white tracking-wide">PERSON</span>
          </div>
        )}
        {/* Corner brackets */}
        {isOn && (
          <>
            {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
              <div key={`${v}${h}`} style={{
                position: 'absolute', width: 14, height: 14, [v]: 6, [h]: 6,
                borderTop: v === 'top' ? '2px solid rgba(99,102,241,0.5)' : 'none',
                borderBottom: v === 'bottom' ? '2px solid rgba(99,102,241,0.5)' : 'none',
                borderLeft: h === 'left' ? '2px solid rgba(99,102,241,0.5)' : 'none',
                borderRight: h === 'right' ? '2px solid rgba(99,102,241,0.5)' : 'none',
              }} />
            ))}
          </>
        )}
        {/* Offline overlay */}
        {!isOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
            <WifiOff className="h-5 w-5 text-gray-600" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Offline</span>
          </div>
        )}
        {/* Camera ID */}
        <span className="absolute bottom-1.5 left-2 font-mono text-[8px] text-indigo-400/70">{camera.id}</span>
        {/* Status pill */}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 backdrop-blur-sm">
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: (STATUS_CFG[camera.status] || STATUS_CFG.Offline).dot, boxShadow: isOn ? `0 0 6px ${(STATUS_CFG[camera.status] || STATUS_CFG.Offline).dot}` : 'none' }} />
          <span className="text-[8px] font-bold uppercase tracking-wide text-white/80">{camera.status}</span>
        </div>
        {/* AI badge */}
        {camera.aiActive && isOn && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-indigo-600/80 px-2 py-0.5 backdrop-blur-sm">
            <Sparkles className="h-2 w-2 text-white" />
            <span className="text-[8px] font-bold text-white">AI</span>
          </div>
        )}
        {/* Person count */}
        {isOn && camera.persons > 0 && (
          <span className="absolute bottom-1.5 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[8px] font-medium text-white/70 backdrop-blur-sm">{camera.persons} det.</span>
        )}
      </div>

      {/* Info strip */}
      <div className="px-3 py-2.5">
        <p className="truncate text-xs font-semibold text-gray-800 dark:text-white">{camera.name}</p>
        <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">{camera.location} · {camera.floor}</p>
      </div>
    </div>
  );
}

function CameraDetailModal({ camera, onClose }) {
  if (!camera) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-xs" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-7 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900" onClick={e => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{camera.name}</h3>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{camera.id} · {camera.location} · {camera.floor}</p>
          </div>
          <Badge variant="light" color={STATUS_CFG[camera.status]?.badgeColor || 'error'} size="sm">{camera.status}</Badge>
        </div>

        {/* Mock video feed */}
        <div className="relative mb-5 aspect-video overflow-hidden rounded-xl bg-gray-950">
          <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 3px)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Video className="mx-auto mb-2 h-10 w-10 text-indigo-400/40" />
              <p className="font-mono text-xs tracking-widest text-indigo-400/50">LIVE FEED — {camera.id}</p>
            </div>
          </div>
          {camera.status === 'Online' && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 backdrop-blur-sm">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-red-400">REC</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: 'Resolution', value: '1080p' },
            { label: 'FPS', value: '30' },
            { label: 'Persons Detected', value: camera.persons },
            { label: 'AI Active', value: camera.aiActive ? 'Yes' : 'No' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-800 dark:bg-white/[0.03]">
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{label}</p>
              <p className="mt-1 text-base font-bold text-gray-800 dark:text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="flex-1 justify-center" onClick={onClose}>Close</Button>
          <Button variant="primary" size="sm" startIcon={<Settings className="h-4 w-4" />} className="flex-1 justify-center" onClick={() => { toast.success('Camera settings saved'); onClose(); }}>
            Configure
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Monitor() {
  const [activeTab, setActiveTab] = useState('cameras');
  const [search, setSearch] = useState('');
  const [floorFilter, setFloorFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCam, setSelectedCam] = useState(null);
  const [alerts, setAlerts] = useState(cameraAlerts);
  const [gridCols, setGridCols] = useState(4);

  const floors = ['All', ...new Set(cameras.map(c => c.floor).filter(Boolean))];
  const filteredCams = cameras.filter(c =>
    (floorFilter === 'All' || c.floor === floorFilter) &&
    (statusFilter === 'All' || c.status === statusFilter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()))
  );

  const onlineCount  = cameras.filter(c => c.status === 'Online').length;
  const offlineCount = cameras.filter(c => c.status === 'Offline').length;
  const aiCount      = cameras.filter(c => c.aiActive && c.status === 'Online').length;

  const resolveAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
    toast.success('Alert resolved');
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        pageTitle="CCTV Monitor"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'CCTV Monitor' }]}
      />

      {/* Live pill + refresh */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 rounded-full border border-success-200 bg-success-50 px-4 py-1.5 text-xs font-semibold text-success-600 dark:border-success-500/20 dark:bg-success-500/10 dark:text-success-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success-500" />
            </span>
            Live Feed
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered surveillance · {cameras.length} cameras across Kanakadurga Nursing Home</p>
        </div>
        <Button variant="outline" size="sm" startIcon={<RefreshCw className="h-4 w-4" />} onClick={() => toast.success('Feeds refreshed')}>
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Cameras',  value: cameras.length, color: 'text-gray-800 dark:text-white' },
          { label: 'Online',         value: onlineCount,    color: 'text-success-500' },
          { label: 'Offline',        value: offlineCount,   color: 'text-error-500' },
          { label: 'AI-Enabled',     value: aiCount,        color: 'text-brand-500' },
        ].map(item => (
          <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <p className={`text-3xl font-extrabold ${item.color}`}>{item.value}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {[
          { id: 'cameras', label: `Live Feeds (${filteredCams.length})` },
          { id: 'alerts',  label: `AI Alerts (${alerts.filter(a => a.status !== 'Resolved').length})` },
          { id: 'zones',   label: 'Zone Coverage' },
        ].map(tab => (
          <button key={tab.id} className={activeTab === tab.id ? 'tab-active' : 'tab-item'} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* CAMERAS TAB */}
      {activeTab === 'cameras' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="relative flex-1" style={{ minWidth: 200 }}>
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                className="input-field pl-9 text-xs"
                placeholder="Search cameras..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select value={floorFilter} onChange={e => setFloorFilter(e.target.value)} className="input-field w-auto text-xs">
              {floors.map(f => <option key={f} value={f}>{f === 'All' ? 'All Floors' : f}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto text-xs">
              <option value="All">All Status</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Degraded">Degraded</option>
            </select>
            {/* Grid density toggles */}
            <div className="ml-auto flex gap-1">
              {[3, 4, 5, 6].map(n => (
                <button
                  key={n}
                  onClick={() => setGridCols(n)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                    gridCols === n
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.08]'
                  }`}
                >{n}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`, gap: 12 }}>
            {filteredCams.map(cam => (
              <CameraFeedCard key={cam.id} camera={cam} onClick={setSelectedCam} />
            ))}
          </div>
        </>
      )}

      {/* ALERTS TAB */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.map(alert => {
            const isResolved = alert.status === 'Resolved';
            return (
              <div
                key={alert.id}
                className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-white/[0.03] transition-opacity ${isResolved ? 'opacity-50' : ''}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="light" color={ALERT_BADGE[alert.severity] || 'info'} size="sm">{alert.severity}</Badge>
                      <span className="text-sm font-bold text-gray-800 dark:text-white">{alert.type}</span>
                      <span className="font-mono text-xs text-gray-400 dark:text-gray-500">{alert.cameraId}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{alert.message}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                      <span>{alert.time}</span>
                      {alert.aiNote && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-brand-500">
                            <Sparkles className="h-3 w-3" />
                            {alert.aiNote}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {!isResolved ? (
                    <Button variant="success" size="sm" onClick={() => resolveAlert(alert.id)}>Resolve</Button>
                  ) : (
                    <Badge variant="light" color="success" size="sm">Resolved</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ZONES TAB */}
      {activeTab === 'zones' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { zone: 'ICU & Critical Care',    cameras: 8,  online: 8,  aiEnabled: 8, risk: 'High' },
            { zone: 'OPD & Waiting Area',     cameras: 6,  online: 5,  aiEnabled: 5, risk: 'Medium' },
            { zone: 'Operation Theatre',      cameras: 4,  online: 3,  aiEnabled: 4, risk: 'Critical' },
            { zone: 'Wards & Patient Rooms',  cameras: 10, online: 10, aiEnabled: 7, risk: 'Medium' },
            { zone: 'Laboratory & Pharmacy',  cameras: 4,  online: 4,  aiEnabled: 3, risk: 'Low' },
            { zone: 'Reception & Entrance',   cameras: 5,  online: 5,  aiEnabled: 4, risk: 'Low' },
            { zone: 'Staff Areas',            cameras: 6,  online: 5,  aiEnabled: 4, risk: 'Medium' },
            { zone: 'Parking & Perimeter',    cameras: 8,  online: 6,  aiEnabled: 3, risk: 'Low' },
          ].map(zone => {
            const riskBadge = { Critical: 'error', High: 'warning', Medium: 'warning', Low: 'success' }[zone.risk] || 'info';
            const barColor  = { Critical: 'bg-red-500', High: 'bg-orange-400', Medium: 'bg-yellow-400', Low: 'bg-success-500' }[zone.risk];
            const coveragePct = Math.round((zone.online / zone.cameras) * 100);
            return (
              <div key={zone.zone} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{zone.zone}</p>
                  <Badge variant="light" color={riskBadge} size="sm">{zone.risk} Priority</Badge>
                </div>
                <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${coveragePct}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'Total', value: zone.cameras, color: 'text-gray-800 dark:text-white' },
                    { label: 'Online', value: zone.online, color: 'text-success-500' },
                    { label: 'AI', value: zone.aiEnabled, color: 'text-brand-500' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 py-2 dark:border-gray-800 dark:bg-white/[0.03]">
                      <p className={`text-lg font-extrabold ${color}`}>{value}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedCam && <CameraDetailModal camera={selectedCam} onClose={() => setSelectedCam(null)} />}
    </div>
  );
}
