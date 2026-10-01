import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Building2, Shield, Clock, Calendar, Wallet, Video,
  BarChart3, FileText, Bell, Settings, ScrollText, ChevronRight, ChevronDown,
  LogOut, Menu, X, Stethoscope, UserCheck, Layers, Activity, Heart, Key, Lock
} from 'lucide-react';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    module: 'dashboard'
  },
  {
    label: 'Workforce',
    icon: Users,
    module: 'workforce',
    children: [
      { label: 'All Employees', path: '/employees', module: 'workforce' },
      { label: 'Departments', path: '/departments', module: 'departments' },
      { label: 'Roles & Permissions', path: '/roles', module: 'roles' },
    ]
  },
  {
    label: 'Attendance',
    icon: UserCheck,
    module: 'attendance',
    children: [
      { label: "Today's Muster", path: '/attendance', module: 'attendance' },
      { label: 'Attendance History', path: '/attendance/history', module: 'attendance' },
      { label: 'Corrections', path: '/attendance/corrections', module: 'attendance' },
    ]
  },
  {
    label: 'Shifts & Rosters',
    icon: Clock,
    module: 'shifts',
    children: [
      { label: 'Shift Master', path: '/shifts', module: 'shifts' },
      { label: 'Weekly Roster', path: '/shifts/roster', module: 'shifts' },
      { label: 'Coverage Matrix', path: '/shifts/coverage', module: 'shifts' },
    ]
  },
  {
    label: 'Leave Management',
    icon: Calendar,
    module: 'leave',
    children: [
      { label: 'Apply Leave', path: '/leave/apply', module: 'leave' },
      { label: 'Leave Requests', path: '/leave/requests', module: 'leave' },
      { label: 'My Balance', path: '/leave/balance', module: 'leave' },
      { label: 'Hospital Calendar', path: '/leave/calendar', module: 'leave' },
    ]
  },
  {
    label: 'Payroll & Salary',
    icon: Wallet,
    module: 'payroll',
    children: [
      { label: 'Salary Structure', path: '/payroll/structure', module: 'payroll' },
      { label: 'Process Payroll', path: '/payroll/process', module: 'payroll' },
      { label: 'Staff Payslips', path: '/payroll/payslips', module: 'payroll' },
      { label: 'Financial Reports', path: '/payroll/reports', module: 'payroll' },
    ]
  },
  {
    label: 'Worker Activity AI',
    icon: Activity,
    module: 'activity',
    children: [
      { label: 'Live Telemetry', path: '/activity', module: 'activity' },
      { label: 'Zone Movement', path: '/activity', module: 'activity' },
      { label: 'Heatmaps', path: '/activity', module: 'activity' },
    ]
  },
  {
    label: 'CCTV Surveillance',
    icon: Video,
    module: 'monitor',
    children: [
      { label: 'Live Matrix', path: '/monitor', module: 'monitor' },
      { label: 'Camera Feeds', path: '/monitor/cameras', module: 'monitor' },
      { label: 'Incident Alerts', path: '/monitor/alerts', module: 'monitor' },
    ]
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics/hospital',
    module: 'analytics'
  },
  {
    label: 'Reports Library',
    icon: FileText,
    path: '/reports',
    module: 'reports'
  },
  {
    label: 'Notifications',
    icon: Bell,
    path: '/notifications',
    module: 'dashboard'
  },
  {
    label: 'Audit Trail',
    icon: ScrollText,
    path: '/audit',
    module: 'audit'
  },
  {
    label: 'System Settings',
    icon: Settings,
    path: '/settings',
    module: 'settings'
  },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout, hasPermission, switchRole, ROLES } = useAuth();
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState({ Workforce: true, 'Shifts & Rosters': false, 'Payroll & Salary': false });

  const toggleGroup = (label) => setOpenGroups(p => ({ ...p, [label]: !p[label] }));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filter items strictly based on role permissions
  const visibleItems = NAV_ITEMS.reduce((acc, item) => {
    // If item has children, filter children first
    if (item.children) {
      const allowedChildren = item.children.filter(child => hasPermission(child.module || item.module));
      if (allowedChildren.length > 0 && hasPermission(item.module)) {
        acc.push({ ...item, children: allowedChildren });
      }
    } else if (hasPermission(item.module)) {
      acc.push(item);
    }
    return acc;
  }, []);

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38BDF8', border: 'rgba(56, 189, 248, 0.3)' };
      case ROLES.MANAGEMENT:
        return { bg: 'rgba(99, 102, 241, 0.15)', text: '#818CF8', border: 'rgba(99, 102, 241, 0.3)' };
      case ROLES.HR_ADMIN:
        return { bg: 'rgba(167, 139, 250, 0.15)', text: '#A78BFA', border: 'rgba(167, 139, 250, 0.3)' };
      case ROLES.PAYROLL_OFFICER:
        return { bg: 'rgba(168, 85, 247, 0.15)', text: '#C084FC', border: 'rgba(168, 85, 247, 0.3)' };
      case ROLES.DOCTOR:
        return { bg: 'rgba(52, 211, 153, 0.15)', text: '#34D399', border: 'rgba(52, 211, 153, 0.3)' };
      case ROLES.NURSE:
      case ROLES.ICU_STAFF:
        return { bg: 'rgba(251, 191, 36, 0.15)', text: '#FBBF24', border: 'rgba(251, 191, 36, 0.3)' };
      case ROLES.SECURITY_SUPERVISOR:
      case ROLES.SECURITY_GUARD:
        return { bg: 'rgba(45, 212, 191, 0.15)', text: '#2DD4BF', border: 'rgba(45, 212, 191, 0.3)' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94A3B8', border: 'rgba(148, 163, 184, 0.3)' };
    }
  };

  const getCustomLabel = (item) => {
    if (item.label === 'Dashboard') {
      if (user?.role === ROLES.DOCTOR) return 'Clinical Dashboard';
      if (user?.role === ROLES.NURSE) return 'Nurse Dashboard';
      if (user?.role === ROLES.ICU_STAFF) return 'ICU Command';
      if (user?.role === ROLES.OPD_STAFF) return 'OPD Dashboard';
      if (user?.role === ROLES.LAB_STAFF) return 'Lab Workload';
      if (user?.role === ROLES.OT_STAFF) return 'OT Suites';
      if (user?.role === ROLES.RECEPTIONIST) return 'Reception & Queue';
      if (user?.role === ROLES.SECURITY_SUPERVISOR || user?.role === ROLES.SECURITY_GUARD) return 'Security Command';
      if (user?.role === ROLES.ATTENDANCE_OFFICER) return 'Attendance Center';
      if (user?.role === ROLES.PAYROLL_OFFICER) return 'Payroll Center';
      if (user?.role === ROLES.MANAGEMENT) return 'Hospital Overview';
      if (user?.role === ROLES.HOD) return 'Department HOD';
      if ([ROLES.EMPLOYEE, ROLES.AAYAH, ROLES.SWEEPER, ROLES.SCAVENGER, ROLES.DHOBI].includes(user?.role)) return 'My K-DuraCare';
    }
    if (item.label === 'Attendance' && [ROLES.EMPLOYEE, ROLES.DOCTOR, ROLES.NURSE, ROLES.AAYAH, ROLES.SWEEPER, ROLES.SCAVENGER, ROLES.DHOBI, ROLES.RECEPTIONIST, ROLES.ICU_STAFF].includes(user?.role)) {
      return 'My Attendance';
    }
    if (item.label === 'Leave Management' && [ROLES.EMPLOYEE, ROLES.DOCTOR, ROLES.NURSE, ROLES.AAYAH, ROLES.SWEEPER, ROLES.SCAVENGER, ROLES.DHOBI, ROLES.RECEPTIONIST, ROLES.ICU_STAFF].includes(user?.role)) {
      return 'My Leave';
    }
    if (item.label === 'Shifts & Rosters' && [ROLES.EMPLOYEE, ROLES.DOCTOR, ROLES.NURSE, ROLES.AAYAH, ROLES.SWEEPER, ROLES.SCAVENGER, ROLES.DHOBI, ROLES.RECEPTIONIST, ROLES.ICU_STAFF].includes(user?.role)) {
      return 'My Shifts';
    }
    return item.label;
  };

  const badgeStyle = getRoleBadgeStyle(user?.role);

  return (
    <aside
      className="sidebar-glass fixed left-0 top-0 h-screen flex flex-col z-50 transition-all select-none"
      style={{
        width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        transitionDuration: '300ms',
        transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Brand Header */}
      <div
        className="flex items-center gap-3 px-4 border-b border-white/5"
        style={{ minHeight: '64px', padding: collapsed ? '0 14px' : '0 16px' }}
      >
        <div
          style={{
            width: 36, height: 36,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(14,165,233,0.35)',
            border: '1px solid rgba(255,255,255,0.2)',
            flexShrink: 0,
          }}
        >
          <Heart style={{ width: 18, height: 18, color: '#fff' }} />
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0">
            <span style={{ fontSize: 15, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.2 }}>
              K-DuraCare
            </span>
            <span style={{ fontSize: 10, color: '#38BDF8', fontWeight: 600, letterSpacing: '0.03em' }}>
              Kanakadurga Hospital
            </span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn-icon"
          style={{ padding: 6, marginLeft: 'auto', flexShrink: 0 }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight style={{ width: 14, height: 14 }} /> : <Menu style={{ width: 14, height: 14 }} />}
        </button>
      </div>

      {/* Role Clearance Pill in Sidebar */}
      {!collapsed && (
        <div style={{ padding: '10px 14px 4px' }}>
          <div style={{
            background: badgeStyle.bg,
            border: `1px solid ${badgeStyle.border}`,
            borderRadius: '10px',
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock style={{ width: '11px', height: '11px', color: badgeStyle.text }} />
              <span style={{ fontSize: '11px', fontWeight: '700', color: badgeStyle.text }}>
                {user?.role}
              </span>
            </div>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {visibleItems.length} Modules
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1" style={{ paddingLeft: '8px', paddingRight: '8px' }}>
        {visibleItems.map(item => {
          if (item.children) {
            const isOpen = openGroups[item.label] ?? false;
            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => toggleGroup(item.label)}
                  className="nav-item flex items-center justify-between"
                  style={{
                    width: '100%',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    padding: '8px 12px',
                    borderRadius: '12px',
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <item.icon style={{ width: 16, height: 16, flexShrink: 0 }} />
                    {!collapsed && <span style={{ fontSize: 13, fontWeight: 500 }}>{getCustomLabel(item)}</span>}
                  </div>
                  {!collapsed && (
                    <ChevronDown style={{
                      width: 13, height: 13,
                      transition: 'transform 0.2s ease',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      opacity: 0.5,
                    }} />
                  )}
                </button>
                {!collapsed && isOpen && (
                  <div style={{ marginLeft: 10, marginTop: 2, paddingLeft: 12, borderLeft: '1px solid rgba(255,255,255,0.08)' }} className="space-y-1">
                    {item.children.map((child, ci) => (
                      <NavLink
                        key={`${child.path}-${ci}`}
                        to={child.path}
                        className={({ isActive }) =>
                          isActive ? 'nav-item-active' : 'nav-item'
                        }
                        style={{ fontSize: 12, padding: '7px 12px', borderRadius: 10 }}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'nav-item-active' : 'nav-item'
              }
              style={{
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: '8px 12px',
                borderRadius: '12px',
              }}
              title={collapsed ? item.label : undefined}
            >
              <item.icon style={{ width: 16, height: 16, flexShrink: 0 }} />
              {!collapsed && <span style={{ fontSize: 13, fontWeight: 500 }}>{getCustomLabel(item)}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Identity & Logout Footer */}
      <div className="border-t border-white/5" style={{ padding: '12px' }}>
        <div
          className="flex items-center gap-3"
          style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <div
            style={{
              width: 36, height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0EA5E9, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
              boxShadow: '0 2px 12px rgba(99,102,241,0.3)',
            }}
          >
            {user?.avatar || user?.name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.95)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name}
                </p>
                <p style={{ fontSize: 10, color: badgeStyle.text, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-icon"
                style={{ padding: 6, flexShrink: 0 }}
                title="Logout"
              >
                <LogOut style={{ width: 14, height: 14, color: '#F87171' }} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
