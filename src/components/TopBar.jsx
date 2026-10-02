import { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Search,
  Sparkles,
  X,
  UserCheck,
  ChevronDown,
  Check,
  Menu,
  LogOut,
  Settings,
  HelpCircle,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { toast } from 'react-hot-toast';
import ThemeToggleButton from './common/ThemeToggleButton';
import Badge from './ui/badge/Badge';

const NOTIFICATIONS = [
  { id: 1, type: 'critical', title: 'Camera Offline', message: 'CAM-OT-01 is offline — OT Entrance unmonitored', time: '5 min ago', read: false },
  { id: 2, type: 'alert', title: 'Attendance Alert', message: 'KD-EMP-0050 has not checked in — Morning Shift', time: '12 min ago', read: false },
  { id: 3, type: 'warning', title: 'Leave Request', message: 'Sr. Nurse Priya Sharma — Casual Leave pending approval', time: '31 min ago', read: false },
  { id: 4, type: 'warning', title: 'Staffing Alert', message: 'Housekeeping shift has insufficient staff coverage', time: '1 hr ago', read: true },
  { id: 5, type: 'info', title: 'Payroll Ready', message: 'September 2026 payroll draft is ready for review', time: '2 hr ago', read: true },
];


export default function TopBar() {
  const { user, switchRole, DEMO_USERS, logout } = useAuth();
  const { toggleSidebar, toggleMobileSidebar, isMobileOpen } = useSidebar();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [search, setSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');

  const searchInputRef = useRef(null);
  const notifRef = useRef(null);
  const userDropdownRef = useRef(null);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifs((n) => n.map((x) => ({ ...x, read: true })));
    toast.success('All notifications marked as read');
  };

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRole = (demo) => {
    switchRole(demo.role);
    setShowUserDropdown(false);
    setShowRoleSwitcher(false);
    toast.success(`Active persona switched to: ${demo.role}`);
  };

  const handleToggle = () => {
    if (window.innerWidth >= 1280) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const filteredRoles = DEMO_USERS.filter(
    (u) =>
      u.role.toLowerCase().includes(roleSearch.toLowerCase()) ||
      u.name.toLowerCase().includes(roleSearch.toLowerCase()) ||
      u.dept.toLowerCase().includes(roleSearch.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 flex h-18 w-full border-b border-gray-200/80 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90 transition-colors">
      <div className="flex grow items-center justify-between px-4 sm:px-6">
        {/* Left Section: Toggle Button & Search */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-lg">
          <button
            type="button"
            onClick={handleToggle}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records, teams, or reports..."
              className="h-10 sm:h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-12 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-800/60 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-brand-400 dark:focus:bg-gray-800 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:text-gray-300">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Section: Notifications, Theme Toggle, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifs((p) => !p)}
              className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {showNotifs && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900 animate-scale-in z-50">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                      Notifications
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {unreadCount} unread hospital alerts
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="custom-scrollbar max-h-72 overflow-y-auto space-y-2">
                  {notifs.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl border transition-colors ${
                        n.read
                          ? 'border-transparent bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/40 text-gray-600 dark:text-gray-400'
                          : 'border-brand-100 dark:border-brand-500/20 bg-brand-50/40 dark:bg-brand-500/5 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold">{n.title}</span>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle (Dark / Light) */}
          <ThemeToggleButton />

          {/* User Profile & Role Switcher Dropdown */}
          {user && (
            <div className="relative" ref={userDropdownRef}>
              <button
                type="button"
                onClick={() => setShowUserDropdown((p) => !p)}
                className="flex items-center gap-3 rounded-full border border-gray-200 bg-white p-1 pr-3 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white font-bold text-xs shadow-theme-xs">
                  {user.avatar || user.name?.charAt(0) || 'U'}
                </div>

                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-gray-800 dark:text-white truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                    {user.role}
                  </span>
                </div>

                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900 animate-scale-in z-50">
                  {/* User Profile Header */}
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-3 mb-3">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <Badge color="primary" size="sm">
                        {user.role}
                      </Badge>
                      <Badge color="light" size="sm">
                        {user.dept}
                      </Badge>
                    </div>
                  </div>

                  {/* 1-Click Role Switcher Trigger */}
                  <div className="mb-3">
                    <button
                      type="button"
                      onClick={() => setShowRoleSwitcher((p) => !p)}
                      className="flex w-full items-center justify-between rounded-xl bg-brand-50 p-2.5 text-xs font-semibold text-brand-600 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-500/20 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="h-4 w-4" /> Switch Hospital Persona
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          showRoleSwitcher ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Role Selection List */}
                    {showRoleSwitcher && (
                      <div className="mt-2 border border-gray-100 dark:border-gray-800 rounded-xl p-2 bg-gray-50 dark:bg-gray-800/40">
                        <input
                          type="text"
                          value={roleSearch}
                          onChange={(e) => setRoleSearch(e.target.value)}
                          placeholder="Search 22 roles..."
                          className="w-full text-xs p-2 mb-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none"
                        />
                        <div className="custom-scrollbar max-h-48 overflow-y-auto space-y-1">
                          {filteredRoles.map((demo) => {
                            const isCurrent = user.role === demo.role;
                            return (
                              <button
                                key={demo.id}
                                onClick={() => handleSelectRole(demo)}
                                className={`flex w-full items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                                  isCurrent
                                    ? 'bg-brand-500 text-white font-semibold'
                                    : 'hover:bg-gray-200/60 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                <div>
                                  <p>{demo.role}</p>
                                  <p
                                    className={`text-[10px] ${
                                      isCurrent ? 'text-brand-100' : 'text-gray-400'
                                    }`}
                                  >
                                    {demo.name} · {demo.dept}
                                  </p>
                                </div>
                                {isCurrent && <Check className="h-3.5 w-3.5" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
