import { useState, useEffect } from 'react';
import { Video, Wifi, WifiOff, Sparkles, AlertTriangle, Eye, Settings, RefreshCw, Search, Grid, List, Zap, Bell } from 'lucide-react';
import { cameras, cameraAlerts } from '../data/cameras';
import { toast } from 'react-hot-toast';

const STATUS_CFG = {
  Online:   { color: '#34D399', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.2)', dot: '#34D399' },
  Degraded: { color: '#FBBF24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.2)', dot: '#FBBF24' },
  Offline:  { color: '#F87171', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.2)',  dot: '#F87171' },
};

const ALERT_CFG = {
  Critical: { color: '#F87171', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.18)' },
  High:     { color: '#FB923C', bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.18)' },
  Medium:   { color: '#FBBF24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)' },
  Low:      { color: '#38BDF8', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.18)' },
};

function CameraFeedCard({ camera, onClick }) {
  const [blink, setBlink] = useState(false);
  const s = STATUS_CFG[camera.status] || STATUS_CFG.Offline;
  const isOn = camera.status === 'Online';

  // Simulate AI detection blink
  useEffect(() => {
    if (!isOn || !camera.aiActive) return;
    const t = setInterval(() => setBlink(b => !b), 3000 + Math.random() * 4000);
    return () => clearInterval(t);
  }, [isOn, camera.aiActive]);

  return (
    <div
      className="glass-card"
      style={{ overflow: 'hidden', cursor: 'pointer', transition: 'all 0.25s ease' }}
      onClick={() => onClick(camera)}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = 'rgba(14,165,233,0.3)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(14,165,233,0.1) inset';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
      }}
    >
      {/* Video area */}
      <div style={{
        aspectRatio: '16/9', position: 'relative', overflow: 'hidden',
        background: isOn
          ? 'linear-gradient(135deg, #020510 0%, #050d1f 50%, #020510 100%)'
          : 'rgba(0,0,0,0.4)',
      }}>
        {/* CRT scan lines */}
        {isOn && (
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.06,
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 3px)',
            pointerEvents: 'none',
          }} />
        )}
        {/* Grid overlay */}
        {isOn && (
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04,
            backgroundImage: 'linear-gradient(rgba(14,165,233,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.4) 1px, transparent 1px)',
            backgroundSize: '25% 25%',
          }} />
        )}
        {/* Detection box blink */}
        {isOn && camera.aiActive && blink && camera.persons > 0 && (
          <div style={{
            position: 'absolute', top: '30%', left: '20%', width: '35%', height: '40%',
            border: '1.5px solid rgba(14,165,233,0.7)',
            borderRadius: 2,
            boxShadow: '0 0 8px rgba(14,165,233,0.3)',
            animation: 'pulse 0.8s ease-in-out',
          }}>
            <div style={{
              position: 'absolute', top: -9, left: 4,
              background: 'rgba(14,165,233,0.8)',
              fontSize: 7, color: '#fff', fontWeight: 700,
              padding: '1px 5px', borderRadius: 2,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.04em',
            }}>PERSON</div>
          </div>
        )}
        {/* Corner brackets */}
        {isOn && (
          <>
            {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
              <div key={`${v}${h}`} style={{
                position: 'absolute', width: 14, height: 14,
                [v]: 6, [h]: 6,
                borderTop: v === 'top' ? '2px solid rgba(14,165,233,0.5)' : 'none',
                borderBottom: v === 'bottom' ? '2px solid rgba(14,165,233,0.5)' : 'none',
                borderLeft: h === 'left' ? '2px solid rgba(14,165,233,0.5)' : 'none',
                borderRight: h === 'right' ? '2px solid rgba(14,165,233,0.5)' : 'none',
              }} />
            ))}
          </>
        )}
        {/* Offline overlay */}
        {!isOn && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <WifiOff style={{ width: 20, height: 20, color: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: 700, letterSpacing: '0.08em', fontFamily: "'JetBrains Mono', monospace" }}>OFFLINE</span>
          </div>
        )}
        {/* Camera ID */}
        <div style={{
          position: 'absolute', bottom: 6, left: 8,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 8, color: isOn ? 'rgba(14,165,233,0.6)' : 'rgba(255,255,255,0.2)',
          letterSpacing: '0.06em',
        }}>{camera.id}</div>
        {/* Status pill */}
        <div style={{
          position: 'absolute', top: 6, left: 6,
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'rgba(0,0,0,0.65)', borderRadius: 100,
          padding: '2px 8px', backdropFilter: 'blur(8px)',
        }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%', background: s.dot,
            boxShadow: isOn ? `0 0 6px ${s.dot}` : 'none',
            animation: isOn ? 'pulse 2s ease-in-out infinite' : 'none',
          }} />
          <span style={{ fontSize: 8, fontWeight: 700, color: s.color, letterSpacing: '0.08em' }}>
            {camera.status.toUpperCase()}
          </span>
        </div>
        {/* AI badge */}
        {camera.aiActive && isOn && (
          <div style={{
            position: 'absolute', top: 6, right: 6,
            display: 'flex', alignItems: 'center', gap: 3,
            background: 'rgba(99,102,241,0.75)',
            borderRadius: 100, padding: '2px 7px', backdropFilter: 'blur(6px)',
          }}>
            <Sparkles style={{ width: 8, height: 8, color: '#fff' }} />
            <span style={{ fontSize: 8, fontWeight: 700, color: '#fff' }}>AI</span>
          </div>
        )}
        {/* Person count */}
        {isOn && camera.persons > 0 && (
          <div style={{
            position: 'absolute', bottom: 6, right: 6,
            background: 'rgba(0,0,0,0.65)', borderRadius: 100,
            padding: '2px 7px', backdropFilter: 'blur(8px)',
            fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
          }}>{camera.persons} det.</div>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: '10px 12px' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{camera.name}</p>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{camera.location} · {camera.floor}</p>
      </div>
    </div>
  );
}

function CameraDetailModal({ camera, onClose }) {
  if (!camera) return null;
  const s = STATUS_CFG[camera.status] || STATUS_CFG.Offline;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-glass" style={{ width: '100%', maxWidth: 640, padding: '28px 32px' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{camera.name}</h3>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{camera.id} · {camera.location} · {camera.floor}</p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 100, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
            {camera.status}
          </span>
        </div>

        {/* Mock video feed */}
        <div style={{
          aspectRatio: '16/9', background: 'linear-gradient(135deg, #020510, #050d1f)',
          borderRadius: 14, overflow: 'hidden', position: 'relative', marginBottom: 20,
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 3px)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(14,165,233,0.4)', letterSpacing: '0.1em' }}>LIVE FEED — {camera.id}</p>
          </div>
          {camera.status === 'Online' && (
            <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.6)', borderRadius: 100, padding: '3px 10px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F87171', animation: 'pulse 1s infinite' }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: '#F87171', letterSpacing: '0.08em' }}>REC</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Resolution', value: '1080p' },
            { label: 'FPS', value: '30' },
            { label: 'Persons Detected', value: camera.persons },
            { label: 'AI Active', value: camera.aiActive ? 'Yes' : 'No' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }} onClick={onClose}>Close</button>
          <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }} onClick={() => { toast.success('Camera settings saved'); onClose(); }}>
            <Settings style={{ width: 13, height: 13 }} /> Configure
          </button>
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
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>CCTV Monitor</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            AI-powered surveillance · {cameras.length} cameras across Kanakadurga Nursing Home
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 100, padding: '6px 14px' }}>
            <div className="live-dot" />
            <span style={{ fontSize: 12, color: '#34D399', fontWeight: 600 }}>Live Feed</span>
          </div>
          <button className="btn-icon" onClick={() => toast.success('Feeds refreshed')}>
            <RefreshCw style={{ width: 15, height: 15 }} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Cameras', value: cameras.length, color: '#fff' },
          { label: 'Online', value: onlineCount, color: '#34D399' },
          { label: 'Offline', value: offlineCount, color: '#F87171' },
          { label: 'AI-Enabled', value: aiCount, color: '#818CF8' },
        ].map(item => (
          <div key={item.label} className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 30, fontWeight: 800, color: item.color, letterSpacing: '-0.04em' }}>{item.value}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {[
          { id: 'cameras', label: `Live Feeds (${filteredCams.length})` },
          { id: 'alerts', label: `AI Alerts (${alerts.filter(a => a.status !== 'Resolved').length})` },
          { id: 'zones', label: 'Zone Coverage' },
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
          <div className="glass-card flex flex-wrap items-center gap-3" style={{ padding: '14px 18px' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(255,255,255,0.3)' }} />
              <input className="input-field" placeholder="Search cameras..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36, fontSize: 12 }} />
            </div>
            <select value={floorFilter} onChange={e => setFloorFilter(e.target.value)} className="input-field" style={{ width: 'auto', fontSize: 12 }}>
              {floors.map(f => <option key={f} value={f}>{f === 'All' ? 'All Floors' : f}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field" style={{ width: 'auto', fontSize: 12 }}>
              <option value="All">All Status</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Degraded">Degraded</option>
            </select>
            {/* Grid density */}
            <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
              {[3, 4, 5, 6].map(n => (
                <button key={n} onClick={() => setGridCols(n)} style={{
                  width: 30, height: 30, borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  background: gridCols === n ? 'rgba(14,165,233,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${gridCols === n ? 'rgba(14,165,233,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: gridCols === n ? '#38BDF8' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.2s',
                }}>{n}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`, gap: 12 }} className="animate-fade-in">
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
            const ac = ALERT_CFG[alert.severity] || ALERT_CFG.Low;
            const isResolved = alert.status === 'Resolved';
            return (
              <div key={alert.id} className="glass-card" style={{ padding: '18px 22px', opacity: isResolved ? 0.5 : 1 }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100, color: ac.color, background: ac.bg, border: `1px solid ${ac.border}` }}>
                        {alert.severity}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{alert.type}</span>
                      <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.3)' }}>{alert.cameraId}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{alert.message}</p>
                    <div className="flex items-center gap-3" style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                      <span>{alert.time}</span>
                      {alert.aiNote && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Sparkles style={{ width: 10, height: 10, color: '#818CF8' }} />
                            <span style={{ color: '#818CF8' }}>{alert.aiNote}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {!isResolved ? (
                    <button className="btn-success" style={{ fontSize: 12, padding: '7px 16px', flexShrink: 0 }} onClick={() => resolveAlert(alert.id)}>
                      Resolve
                    </button>
                  ) : (
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#34D399', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 100, padding: '5px 14px' }}>Resolved</span>
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
            { zone: 'ICU & Critical Care', cameras: 8, online: 8, aiEnabled: 8, risk: 'High' },
            { zone: 'OPD & Waiting Area', cameras: 6, online: 5, aiEnabled: 5, risk: 'Medium' },
            { zone: 'Operation Theatre', cameras: 4, online: 3, aiEnabled: 4, risk: 'Critical' },
            { zone: 'Wards & Patient Rooms', cameras: 10, online: 10, aiEnabled: 7, risk: 'Medium' },
            { zone: 'Laboratory & Pharmacy', cameras: 4, online: 4, aiEnabled: 3, risk: 'Low' },
            { zone: 'Reception & Entrance', cameras: 5, online: 5, aiEnabled: 4, risk: 'Low' },
            { zone: 'Staff Areas', cameras: 6, online: 5, aiEnabled: 4, risk: 'Medium' },
            { zone: 'Parking & Perimeter', cameras: 8, online: 6, aiEnabled: 3, risk: 'Low' },
          ].map(zone => {
            const riskColor = { Critical: '#F87171', High: '#FB923C', Medium: '#FBBF24', Low: '#34D399' }[zone.risk];
            const coveragePct = Math.round((zone.online / zone.cameras) * 100);
            return (
              <div key={zone.zone} className="glass-card-hover" style={{ padding: 20 }}>
                <div className="flex items-center justify-between mb-3">
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{zone.zone}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100, color: riskColor, background: `${riskColor}15`, border: `1px solid ${riskColor}30` }}>
                    {zone.risk} Priority
                  </span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ height: '100%', width: `${coveragePct}%`, background: `linear-gradient(90deg, ${riskColor}90, ${riskColor})`, borderRadius: 100, transition: 'width 1s ease' }} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Total', value: zone.cameras },
                    { label: 'Online', value: zone.online, color: '#34D399' },
                    { label: 'AI', value: zone.aiEnabled, color: '#818CF8' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 0' }}>
                      <p style={{ fontSize: 18, fontWeight: 800, color: color || 'rgba(255,255,255,0.8)' }}>{value}</p>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{label}</p>
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
