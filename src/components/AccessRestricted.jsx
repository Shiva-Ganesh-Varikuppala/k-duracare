import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, Lock, UserCheck, AlertTriangle, Key, ChevronRight } from 'lucide-react';

const MODULE_NAMES = {
  payroll: 'Hospital Payroll & Compensation Register',
  monitor: 'Live CCTV Surveillance Matrix',
  activity: 'Worker Activity Observational AI',
  settings: 'System Configuration & Hardware Settings',
  audit: 'Cryptographic Audit Trail & Tamper Ledger',
  workforce: 'Comprehensive Workforce & Staff Directory',
  roles: 'Hospital RBAC Roles & Permissions Matrix',
  departments: 'Hospital Department Management',
  analytics: 'Executive Analytics & Financial Intelligence',
  shifts: 'Duty Shift Rostering Master',
  leave: 'Hospital Leave Approval Gateway',
  attendance: 'Biometric Attendance & Muster Logs',
};

const REQUIRED_ROLES = {
  payroll: ['Super Administrator', 'HR Administrator'],
  monitor: ['Super Administrator', 'Security Operator'],
  activity: ['Super Administrator', 'Nursing Head', 'Security Operator'],
  settings: ['Super Administrator'],
  audit: ['Super Administrator', 'Security Operator'],
  workforce: ['Super Administrator', 'HR Administrator', 'Doctor / Consultant', 'Nursing Head'],
  roles: ['Super Administrator', 'HR Administrator'],
  departments: ['Super Administrator', 'HR Administrator', 'Nursing Head'],
  analytics: ['Super Administrator', 'HR Administrator'],
  shifts: ['Super Administrator', 'HR Administrator', 'Doctor / Consultant', 'Nursing Head', 'Staff Employee'],
  leave: ['Super Administrator', 'HR Administrator', 'Doctor / Consultant', 'Nursing Head', 'Staff Employee'],
  attendance: ['Super Administrator', 'HR Administrator', 'Doctor / Consultant', 'Nursing Head', 'Staff Employee'],
};

export default function AccessRestricted({ module }) {
  const { user, switchRole, ROLES } = useAuth();
  const navigate = useNavigate();

  const moduleTitle = MODULE_NAMES[module] || module;
  const authorizedRoles = REQUIRED_ROLES[module] || ['Super Administrator'];

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="glass-card max-w-xl w-full p-8 border border-red-500/30 rounded-3xl shadow-2xl relative overflow-hidden text-center space-y-6 animate-fade-in">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

        {/* Shield Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shadow-lg shadow-red-500/20">
          <ShieldAlert className="w-8 h-8 text-red-400" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 inline-flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> Role Clearance Required
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Access Restricted to {moduleTitle}
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Your current account clearance does not grant access to this hospital department module.
          </p>
        </div>

        {/* User Identity Box */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Active Profile:</span>
            <span className="font-bold text-white">{user?.name} ({user?.empId})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Current Hospital Role:</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {user?.role}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-slate-500">Authorized Clearances:</span>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {authorizedRoles.map(r => (
                <span key={r} className="text-[10px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary text-xs px-5 py-2.5 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to My Dashboard
          </button>

          {/* Quick Demo Switcher if user wants to test with authorized role */}
          {authorizedRoles[0] && (
            <button
              onClick={() => {
                switchRole(authorizedRoles[0]);
                navigate(0); // Refresh route
              }}
              className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
            >
              <Key className="w-4 h-4" /> Switch to {authorizedRoles[0]}
            </button>
          )}
        </div>

        <p className="text-[10px] text-slate-500 font-mono">
          K-DuraCare Security Policy NABH-SEC-2026-APMC
        </p>

      </div>
    </div>
  );
}
