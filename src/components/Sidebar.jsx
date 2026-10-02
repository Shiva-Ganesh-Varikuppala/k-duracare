import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  Shield,
  UserCheck,
  Clock,
  Calendar,
  Wallet,
  Activity,
  Video,
  BarChart3,
  FileText,
  Bell,
  ScrollText,
  Settings,
  ChevronDown,
  LogOut,
  Stethoscope,
  Bed,
  Layers,
  ChevronRight,
} from 'lucide-react';
import Badge from './ui/badge/Badge';

export default function Sidebar() {
  const { user, logout, hasPermission, ROLES } = useAuth();
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
  } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const [openGroups, setOpenGroups] = useState({
    workforce: true,
    attendance: false,
    shifts: false,
    leave: false,
    payroll: false,
    clinical: true,
    surveillance: false,
    activity: false,
  });

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCollapsedView = !isExpanded && !isHovered && !isMobileOpen;

  // Auto-expand group if child is active
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/employees') || path.startsWith('/departments') || path.startsWith('/roles')) {
      setOpenGroups(p => ({ ...p, workforce: true }));
    } else if (path.startsWith('/attendance')) {
      setOpenGroups(p => ({ ...p, attendance: true }));
    } else if (path.startsWith('/shifts')) {
      setOpenGroups(p => ({ ...p, shifts: true }));
    } else if (path.startsWith('/leave')) {
      setOpenGroups(p => ({ ...p, leave: true }));
    } else if (path.startsWith('/payroll')) {
      setOpenGroups(p => ({ ...p, payroll: true }));
    } else if (path.startsWith('/activity')) {
      setOpenGroups(p => ({ ...p, activity: true }));
    } else if (path.startsWith('/monitor')) {
      setOpenGroups(p => ({ ...p, surveillance: true }));
    }
  }, [location.pathname]);

  const navSections = [
    {
      title: 'MAIN',
      items: [
        {
          label: 'Dashboard',
          icon: LayoutDashboard,
          path: '/dashboard',
          module: 'dashboard',
        },
      ],
    },
    {
      title: 'WORKFORCE & HR',
      items: [
        {
          label: 'Workforce',
          icon: Users,
          module: 'workforce',
          groupKey: 'workforce',
          children: [
            { label: 'All Employees', path: '/employees', module: 'workforce' },
            { label: 'Departments', path: '/departments', module: 'departments' },
            { label: 'Roles & Clearances', path: '/roles', module: 'roles' },
          ],
        },
        {
          label: 'Attendance',
          icon: UserCheck,
          module: 'attendance',
          groupKey: 'attendance',
          children: [
            { label: "Today's Muster", path: '/attendance', module: 'attendance' },
            { label: 'Attendance History', path: '/attendance/history', module: 'attendance' },
            { label: 'Corrections', path: '/attendance/corrections', module: 'attendance' },
          ],
        },
      ],
    },
    {
      title: 'OPERATIONS & ROSTERS',
      items: [
        {
          label: 'Shifts & Rosters',
          icon: Clock,
          module: 'shifts',
          groupKey: 'shifts',
          children: [
            { label: 'Shift Master', path: '/shifts', module: 'shifts' },
            { label: 'Weekly Roster', path: '/shifts/roster', module: 'shifts' },
            { label: 'Coverage Matrix', path: '/shifts/coverage', module: 'shifts' },
          ],
        },
        {
          label: 'Leave Management',
          icon: Calendar,
          module: 'leave',
          groupKey: 'leave',
          children: [
            { label: 'Apply Leave', path: '/leave/apply', module: 'leave' },
            { label: 'Leave Requests', path: '/leave/requests', module: 'leave' },
            { label: 'My Leave Balance', path: '/leave/balance', module: 'leave' },
            { label: 'Hospital Calendar', path: '/leave/calendar', module: 'leave' },
          ],
        },
        {
          label: 'Payroll & Salary',
          icon: Wallet,
          module: 'payroll',
          groupKey: 'payroll',
          children: [
            { label: 'Salary Structure', path: '/payroll/structure', module: 'payroll' },
            { label: 'Process Payroll', path: '/payroll/process', module: 'payroll' },
            { label: 'Staff Payslips', path: '/payroll/payslips', module: 'payroll' },
            { label: 'Financial Reports', path: '/payroll/reports', module: 'payroll' },
          ],
        },
      ],
    },
    {
      title: 'CLINICAL INTELLIGENCE',
      items: [
        {
          label: 'Workforce Operations',
          icon: Activity,
          module: 'activity',
          groupKey: 'activity',
          badge: 'AI',
          children: [
            { label: 'Operational overview', path: '/activity', module: 'activity' },
            { label: 'Work-zone presence', path: '/activity', module: 'activity' },
            { label: 'Coverage patterns', path: '/activity', module: 'activity' },
          ],
        },
        {
          label: 'Facility Monitoring',
          icon: Video,
          module: 'monitor',
          groupKey: 'surveillance',
          children: [
            { label: 'Monitoring overview', path: '/monitor', module: 'monitor' },
            { label: 'Camera health', path: '/monitor/cameras', module: 'monitor' },
            { label: 'Safety events', path: '/monitor/alerts', module: 'monitor' },
          ],
        },
      ],
    },
    {
      title: 'ANALYTICS & SYSTEM',
      items: [
        {
          label: 'Hospital Analytics',
          icon: BarChart3,
          path: '/analytics/hospital',
          module: 'analytics',
        },
        {
          label: 'Reports Library',
          icon: FileText,
          path: '/reports',
          module: 'reports',
        },
        {
          label: 'Notifications',
          icon: Bell,
          path: '/notifications',
          module: 'dashboard',
        },
        {
          label: 'Audit Trail',
          icon: ScrollText,
          path: '/audit',
          module: 'audit',
        },
        {
          label: 'System Settings',
          icon: Settings,
          path: '/settings',
          module: 'settings',
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${
        isExpanded || isHovered
          ? 'w-72'
          : 'w-20'
      } ${
        isMobileOpen
          ? 'translate-x-0'
          : '-translate-x-full xl:translate-x-0'
      }`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sidebar Header with Brand */}
      <div className="flex h-18 items-center justify-between border-b border-gray-100 px-5 dark:border-gray-800">
        <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-theme-sm ring-4 ring-brand-50 dark:ring-brand-500/10">
            <img src="/images/logo/kanakadurga-hospital.jpg" alt="Kanakadurga Hospital logo" className="h-full w-full object-cover" />
          </div>

          {(!isCollapsedView || isMobileOpen) && (
            <div className="flex flex-col truncate">
              <span className="text-base font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
                Kanakadurga Hospital
                <span className="rounded-full bg-brand-50 px-1.5 py-0.2 text-[10px] font-semibold text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                  HOSPITAL
                </span>
              </span>
                <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                A Unit of Dr K B Chowdary Healthcare Providers
              </span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Navigation List */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {navSections.map((section) => {
          // Filter items based on permissions
          const visibleItems = section.items.filter((item) => {
            if (item.children) {
              return item.children.some((c) => hasPermission(c.module || item.module));
            }
            return hasPermission(item.module);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1.5">
              {(!isCollapsedView || isMobileOpen) && (
                <h4 className="px-3 text-[11px] font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
                  {section.title}
                </h4>
              )}

              <ul className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;

                  if (item.children) {
                    const isGroupOpen = openGroups[item.groupKey];
                    const allowedChildren = item.children.filter((c) =>
                      hasPermission(c.module || item.module)
                    );
                    const isAnyChildActive = allowedChildren.some(
                      (c) => location.pathname === c.path
                    );

                    return (
                      <li key={item.label}>
                        <button
                          type="button"
                          onClick={() => toggleGroup(item.groupKey)}
                          className={`menu-item group ${
                            isAnyChildActive
                              ? 'text-brand-500 dark:text-brand-400 font-semibold'
                              : 'menu-item-inactive'
                          } ${isCollapsedView ? 'justify-center px-0' : 'justify-between'}`}
                          title={isCollapsedView ? item.label : undefined}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`shrink-0 ${
                                isAnyChildActive
                                  ? 'text-brand-500 dark:text-brand-400'
                                  : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </span>

                            {(!isCollapsedView || isMobileOpen) && (
                              <span className="text-sm font-medium">{item.label}</span>
                            )}
                          </div>

                          {(!isCollapsedView || isMobileOpen) && (
                            <div className="flex items-center gap-1.5">
                              {item.badge && (
                                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                                  {item.badge}
                                </span>
                              )}
                              <ChevronDown
                                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                                  isGroupOpen ? 'rotate-180 text-brand-500 dark:text-brand-400' : ''
                                }`}
                              />
                            </div>
                          )}
                        </button>

                        {/* Submenu */}
                        {(!isCollapsedView || isMobileOpen) && isGroupOpen && (
                          <ul className="mt-1 space-y-1 pl-9 pr-1">
                            {allowedChildren.map((child) => {
                              const isChildActive = location.pathname === child.path;
                              return (
                                <li key={child.path}>
                                  <NavLink
                                    to={child.path}
                                    className={`menu-dropdown-item ${
                                      isChildActive
                                        ? 'menu-dropdown-item-active'
                                        : 'menu-dropdown-item-inactive'
                                    }`}
                                  >
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                        isChildActive
                                          ? 'bg-brand-500'
                                          : 'bg-gray-300 dark:bg-gray-600'
                                      }`}
                                    />
                                    <span>{child.label}</span>
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  }

                  // Single direct link item
                  const isActive = location.pathname === item.path;

                  return (
                    <li key={item.label}>
                      <NavLink
                        to={item.path}
                        className={`menu-item group ${
                          isActive ? 'menu-item-active font-semibold' : 'menu-item-inactive'
                        } ${isCollapsedView ? 'justify-center px-0' : ''}`}
                        title={isCollapsedView ? item.label : undefined}
                      >
                        <span
                          className={`shrink-0 ${
                            isActive
                              ? 'text-brand-500 dark:text-brand-400'
                              : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </span>

                        {(!isCollapsedView || isMobileOpen) && (
                          <span className="text-sm font-medium">{item.label}</span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* User Status / Quick Logout Footer Card */}
      {user && (
        <div className="border-t border-gray-100 p-3 dark:border-gray-800">
          <div
            className={`flex items-center gap-3 rounded-xl p-2.5 transition-colors ${
              isCollapsedView
                ? 'justify-center'
                : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/60 dark:hover:bg-gray-800'
            }`}
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 font-bold text-white text-xs shadow-theme-xs">
              {user.avatar || user.name?.charAt(0) || 'U'}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900" />
            </div>

            {(!isCollapsedView || isMobileOpen) && (
              <div className="flex flex-1 flex-col truncate">
                <span className="truncate text-xs font-semibold text-gray-800 dark:text-white">
                  {user.name}
                </span>
                <span className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                  {user.role}
                </span>
              </div>
            )}

            {(!isCollapsedView || isMobileOpen) && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-white hover:text-rose-500 dark:hover:bg-gray-700 transition"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
