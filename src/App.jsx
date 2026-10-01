import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Employee360 from './pages/Employee360';
import Departments from './pages/Departments';
import Roles from './pages/Roles';
import Attendance from './pages/Attendance';
import Shifts from './pages/Shifts';
import Leave from './pages/Leave';
import Payroll from './pages/Payroll';
import Monitor from './pages/Monitor';
import WorkerActivity from './pages/WorkerActivity';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import AccessRestricted from './components/AccessRestricted';

function ProtectedRoute({ module, children }) {
  const { hasPermission } = useAuth();
  if (!hasPermission(module)) {
    return <AccessRestricted module={module} />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1E2A45', color: '#E2E8F0', border: '1px solid #253355' },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Workforce */}
            <Route path="employees" element={<ProtectedRoute module="workforce"><Employees /></ProtectedRoute>} />
            <Route path="employees/:id" element={<ProtectedRoute module="workforce"><Employee360 /></ProtectedRoute>} />
            <Route path="departments" element={<ProtectedRoute module="departments"><Departments /></ProtectedRoute>} />
            <Route path="roles" element={<ProtectedRoute module="roles"><Roles /></ProtectedRoute>} />

            {/* Attendance */}
            <Route path="attendance" element={<ProtectedRoute module="attendance"><Attendance /></ProtectedRoute>} />
            <Route path="attendance/history" element={<ProtectedRoute module="attendance"><Attendance /></ProtectedRoute>} />
            <Route path="attendance/corrections" element={<ProtectedRoute module="attendance"><Attendance /></ProtectedRoute>} />

            {/* Shifts */}
            <Route path="shifts" element={<ProtectedRoute module="shifts"><Shifts /></ProtectedRoute>} />
            <Route path="shifts/roster" element={<ProtectedRoute module="shifts"><Shifts /></ProtectedRoute>} />
            <Route path="shifts/coverage" element={<ProtectedRoute module="shifts"><Shifts /></ProtectedRoute>} />

            {/* Leave */}
            <Route path="leave" element={<Navigate to="/leave/requests" replace />} />
            <Route path="leave/apply" element={<ProtectedRoute module="leave"><Leave /></ProtectedRoute>} />
            <Route path="leave/requests" element={<ProtectedRoute module="leave"><Leave /></ProtectedRoute>} />
            <Route path="leave/balance" element={<ProtectedRoute module="leave"><Leave /></ProtectedRoute>} />
            <Route path="leave/calendar" element={<ProtectedRoute module="leave"><Leave /></ProtectedRoute>} />

            {/* Payroll */}
            <Route path="payroll" element={<ProtectedRoute module="payroll"><Payroll /></ProtectedRoute>} />
            <Route path="payroll/structure" element={<ProtectedRoute module="payroll"><Payroll /></ProtectedRoute>} />
            <Route path="payroll/process" element={<ProtectedRoute module="payroll"><Payroll /></ProtectedRoute>} />
            <Route path="payroll/payslips" element={<ProtectedRoute module="payroll"><Payroll /></ProtectedRoute>} />
            <Route path="payroll/reports" element={<ProtectedRoute module="payroll"><Payroll /></ProtectedRoute>} />

            {/* Worker Activity AI */}
            <Route path="activity" element={<ProtectedRoute module="activity"><WorkerActivity /></ProtectedRoute>} />
            <Route path="activity/*" element={<ProtectedRoute module="activity"><WorkerActivity /></ProtectedRoute>} />

            {/* Monitor */}
            <Route path="monitor" element={<ProtectedRoute module="monitor"><Monitor /></ProtectedRoute>} />
            <Route path="monitor/cameras" element={<ProtectedRoute module="monitor"><Monitor /></ProtectedRoute>} />
            <Route path="monitor/zones" element={<ProtectedRoute module="monitor"><Monitor /></ProtectedRoute>} />
            <Route path="monitor/activity" element={<ProtectedRoute module="activity"><WorkerActivity /></ProtectedRoute>} />
            <Route path="monitor/alerts" element={<ProtectedRoute module="monitor"><Monitor /></ProtectedRoute>} />

            {/* Analytics */}
            <Route path="analytics" element={<Navigate to="/analytics/hospital" replace />} />
            <Route path="analytics/hospital" element={<ProtectedRoute module="analytics"><Analytics /></ProtectedRoute>} />
            <Route path="analytics/departments" element={<ProtectedRoute module="analytics"><Analytics /></ProtectedRoute>} />
            <Route path="analytics/employee360" element={<ProtectedRoute module="analytics"><Analytics /></ProtectedRoute>} />
            <Route path="analytics/attendance" element={<ProtectedRoute module="analytics"><Analytics /></ProtectedRoute>} />
            <Route path="analytics/leave" element={<ProtectedRoute module="analytics"><Analytics /></ProtectedRoute>} />

            {/* Reports */}
            <Route path="reports" element={<ProtectedRoute module="reports"><Reports /></ProtectedRoute>} />

            {/* Notifications & System */}
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<ProtectedRoute module="settings"><Settings /></ProtectedRoute>} />
            <Route path="audit" element={<ProtectedRoute module="audit"><AuditLogs /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
