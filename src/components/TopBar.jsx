import { useState, useEffect, useRef } from 'react';
import { Bell, Search, Sparkles, X, Wifi, Clock, Key, Shield, UserCheck, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const NOTIFICATIONS = [
  { id: 1, type: 'critical', title: 'Camera Offline', message: 'CAM-OT-01 is offline — OT Entrance unmonitored', time: '5 min ago', read: false },
  { id: 2, type: 'alert', title: 'Attendance Alert', message: 'KD-EMP-0050 has not checked in — Morning Shift', time: '12 min ago', read: false },
  { id: 3, type: 'warning', title: 'Leave Request', message: 'Sr. Nurse Priya Sharma — Casual Leave pending approval', time: '31 min ago', read: false },
  { id: 4, type: 'warning', title: 'Staffing Alert', message: 'Housekeeping shift has insufficient staff coverage', time: '1 hr ago', read: true },
  { id: 5, type: 'info', title: 'Payroll Ready', message: 'September 2026 payroll draft is ready for review', time: '2 hr ago', read: true },
];

const typeColors = {
  critical: { text: '#F87171', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.2)', dot: '#F87171' },
  alert:    { text: '#FB923C', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.2)', dot: '#FB923C' },
  warning:  { text: '#FBBF24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.2)', dot: '#FBBF24' },
  info:     { text: '#38BDF8', bg: 'rgba(14,165,233,0.12)', border: 'rgba(14,165,233,0.2)', dot: '#38BDF8' },
};

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Clock style={{ width: 13, height: 13, color: 'rgba(255,255,255,0.35)' }} />
      <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
        {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </div>
  );
}

export default function TopBar({ sidebarCollapsed }) {
  const { user, switchRole, DEMO_USERS, ROLES } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [search, setSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  const roleMenuRef = useRef(null);

  const unread = notifs.filter(n => !n.read).length;
  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target)) {
        setShowRoleMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRole = (demo) => {
    switchRole(demo.role);
    setShowRoleMenu(false);
    toast.success(`Switched role to: ${demo.role} (${demo.name})`);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case ROLES.SUPER_ADMIN: return '#38BDF8';
      case ROLES.MANAGEMENT: return '#818CF8';
      case ROLES.HR_ADMIN: return '#A78BFA';
      case ROLES.PAYROLL_OFFICER: return '#C084FC';
      case ROLES.DOCTOR: return '#34D399';
      case ROLES.NURSE:
      case ROLES.ICU_STAFF: return '#FBBF24';
      case ROLES.SECURITY_SUPERVISOR:
      case ROLES.SECURITY_GUARD: return '#2DD4BF';
      case ROLES.LAB_STAFF: return '#06B6D4';
      case ROLES.OT_STAFF: return '#EC4899';
      case ROLES.PHYSIO_STAFF: return '#10B981';
      case ROLES.RECEPTIONIST: return '#38BDF8';
      case ROLES.HOUSEKEEPING_SUPERVISOR: return '#F59E0B';
      default: return '#94A3B8';
    }
  };

  return (
    <header
      className="topbar-glass fixed top-0 right-0 z-40 flex items-center px-6 gap-4 transition-all"
      style={{
        height: 'var(--topbar-height)',
        left: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        transitionDuration: '300ms',
        transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Search Bar */}
      <div style={{ flex: 1, maxWidth: 360, position: 'relative' }}>
        <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(255,255,255,0.3)' }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search hospital records, staff..."
          className="input-field"
          style={{ paddingLeft: 36, paddingTop: 8, paddingBottom: 8, fontSize: 12 }}
        />
      </div>

      <div className="flex items-center gap-3" style={{ marginLeft: 'auto' }}>
        {/* Live clock */}
        <div className="hidden md:block">
          <LiveClock />
        </div>

        {/* Role Switcher Pill & Dropdown for Testing & Real Fragmentation */}
        <div className="relative" ref={roleMenuRef}>
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${getRoleColor(user?.role)}40`,
              borderRadius: '12px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Click to switch and test different hospital roles"
          >
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: getRoleColor(user?.role),
              boxShadow: `0 0 8px ${getRoleColor(user?.role)}`,
            }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#fff', lineHeight: 1.2 }}>
                {user?.role}
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                Role Switcher ▼
              </div>
            </div>
          </button>

          {/* Role Dropdown Menu */}
          {showRoleMenu && (
            <div
              className="modal-glass animate-scale-in"
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '340px',
                zIndex: 100,
                borderRadius: '18px',
                padding: '10px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
              }}
            >
              <div style={{ padding: '6px 8px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Hospital Role Switcher (22 Roles)
                </p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px', marginBottom: '8px' }}>
                  Select any profile to test purpose-built dashboards & scopes
                </p>
                <input
                  type="text"
                  value={roleSearch}
                  onChange={e => setRoleSearch(e.target.value)}
                  placeholder="Filter by role, name, department..."
                  className="input-field"
                  style={{ width: '100%', padding: '6px 10px', fontSize: '11px' }}
                />
              </div>

              <div style={{ maxHeight: '320px', overflowY: 'auto', paddingTop: '4px' }}>
                {DEMO_USERS
                  .filter(demo => 
                    !roleSearch ||
                    demo.role.toLowerCase().includes(roleSearch.toLowerCase()) ||
                    demo.name.toLowerCase().includes(roleSearch.toLowerCase()) ||
                    demo.dept.toLowerCase().includes(roleSearch.toLowerCase())
                  )
                  .map(demo => {
                  const isCurrent = user?.role === demo.role;
                  const color = getRoleColor(demo.role);
                  return (
                    <button
                      key={demo.id}
                      type="button"
                      onClick={() => handleSelectRole(demo)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: isCurrent ? 'rgba(255,255,255,0.08)' : 'transparent',
                        border: isCurrent ? `1px solid ${color}40` : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        marginBottom: '4px',
                      }}
                      onMouseEnter={e => {
                        if (!isCurrent) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      }}
                      onMouseLeave={e => {
                        if (!isCurrent) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: color }}>
                          {demo.role}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
                          {demo.name}
                        </div>
                        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>
                          {demo.clearance}
                        </div>
                      </div>
                      {isCurrent && <Check style={{ width: '14px', height: '14px', color }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="btn-icon"
            style={{ position: 'relative', padding: 8 }}
            title="Notifications"
          >
            <Bell style={{ width: 16, height: 16 }} />
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: -2, right: -2,
                width: 16, height: 16, borderRadius: '50%',
                background: '#EF4444', color: '#fff',
                fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 8px rgba(239,68,68,0.5)',
              }}>
                {unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div
              className="modal-glass animate-scale-in"
              style={{
                position: 'absolute', right: 0, top: '52px',
                width: 340, zIndex: 100,
                borderRadius: 20,
              }}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Notifications</p>
                  {unread > 0 && (
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>{unread} unread alerts</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button className="btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }} onClick={markAllRead}>Mark all read</button>
                  )}
                  <button className="btn-icon" style={{ padding: 6 }} onClick={() => setShowNotifs(false)}>
                    <X style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>
              <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                {notifs.map(n => {
                  const c = typeColors[n.type];
                  return (
                    <div
                      key={n.id}
                      onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                      style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        opacity: n.read ? 0.5 : 1,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div className="flex items-start gap-3">
                        <div style={{
                          width: 7, height: 7, borderRadius: '50%',
                          background: c.dot, flexShrink: 0, marginTop: 5,
                          boxShadow: n.read ? 'none' : `0 0 6px ${c.dot}`,
                        }} />
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{n.title}</p>
                          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2, lineHeight: 1.4 }}>{n.message}</p>
                          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{n.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0EA5E9, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 12, fontWeight: 700,
            boxShadow: '0 2px 12px rgba(99,102,241,0.3)',
          }}>
            {user?.avatar || user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block">
            <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>{user?.name}</p>
            <p style={{ fontSize: 10, color: getRoleColor(user?.role), fontWeight: 600 }}>{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
