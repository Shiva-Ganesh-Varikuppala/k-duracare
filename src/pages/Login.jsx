import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Eye,
  EyeOff,
  HeartPulse,
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  Sparkles,
  ArrowRight,
  UserCheck,
  Stethoscope,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/button/Button';
import Badge from '../components/ui/badge/Badge';
import ThemeToggleButton from '../components/common/ThemeToggleButton';

const CATEGORIZED_DEMO_USERS = [
  {
    category: 'Leadership & Administration',
    roles: [
      { id: 'admin', role: 'Super Administrator', email: 'admin@kduracare.in', name: 'Dr K. B. Chowdary', title: 'Medical Director', color: 'primary' },
      { id: 'management', role: 'Hospital Administrator / Management', email: 'management@kduracare.in', name: 'Sri P. Venkateswara Rao', title: 'Managing Director', color: 'info' },
      { id: 'hr', role: 'HR Administrator', email: 'hr@kduracare.in', name: 'Mrs. Sunitha Reddy', title: 'Head of HR', color: 'purple' },
      { id: 'payroll', role: 'Payroll Officer', email: 'payroll@kduracare.in', name: 'Mr. Rajesh Varma', title: 'Senior Payroll Officer', color: 'warning' },
    ],
  },
  {
    category: 'Clinical & Patient Care',
    roles: [
      { id: 'doctor', role: 'Doctor', email: 'doctor@kduracare.in', name: 'Dr. Ravi Shankar', title: 'Chief Cardiologist', color: 'success' },
      { id: 'nurse', role: 'Nurse', email: 'nurse@kduracare.in', name: 'Mrs. Lakshmi Devi', title: 'Nursing Superintendent', color: 'warning' },
      { id: 'icu', role: 'ICU Staff', email: 'icu@kduracare.in', name: 'Kavitha Nair', title: 'Senior ICU Staff Nurse', color: 'error' },
      { id: 'hod', role: 'Department Head / HOD', email: 'hod@kduracare.in', name: 'Dr. Ramesh Babu', title: 'HOD Critical Care', color: 'primary' },
    ],
  },
  {
    category: 'Allied & Diagnostic Services',
    roles: [
      { id: 'opd', role: 'OPD Staff', email: 'opd@kduracare.in', name: 'Priya Nair', title: 'OPD In-Charge', color: 'info' },
      { id: 'lab', role: 'Laboratory Staff', email: 'lab@kduracare.in', name: 'Mr. Venkat Kumar', title: 'Chief Medical Biochemist', color: 'purple' },
      { id: 'ot', role: 'OT Staff', email: 'ot@kduracare.in', name: 'Dr. Anand Sharma', title: 'OT Head & Surgeon', color: 'success' },
      { id: 'physio', role: 'Physiotherapy Staff', email: 'physio@kduracare.in', name: 'Mr. Ravi Teja', title: 'Senior Physiotherapist', color: 'primary' },
      { id: 'reception', role: 'Receptionist', email: 'reception@kduracare.in', name: 'Mrs. Priya Sharma', title: 'Front Desk Executive', color: 'info' },
    ],
  },
  {
    category: 'Operations, Facility & Support',
    roles: [
      { id: 'housekeeping', role: 'Housekeeping Supervisor', email: 'housekeeping@kduracare.in', name: 'Mr. Suresh Yadav', title: 'Sanitation Supervisor', color: 'warning' },
      { id: 'aayah', role: 'Aayah', email: 'aayah@kduracare.in', name: 'Mrs. Meena Yadav', title: 'Ward Support Caregiver', color: 'purple' },
      { id: 'sweeper', role: 'Sweeper', email: 'sweeper@kduracare.in', name: 'Mr. Kiran Babu', title: 'Sanitation Sweeper', color: 'light' },
      { id: 'scavenger', role: 'Scavenger', email: 'scavenger@kduracare.in', name: 'Mr. Naresh Goud', title: 'Bio-Waste Operator', color: 'error' },
      { id: 'dhobi', role: 'Dhobi', email: 'dhobi@kduracare.in', name: 'Mr. Balaiah', title: 'Hospital Laundry Master', color: 'light' },
      { id: 'security', role: 'Security Supervisor', email: 'security@kduracare.in', name: 'Mr. Nagaraju', title: 'Chief Security Officer', color: 'info' },
      { id: 'guard', role: 'Security Guard', email: 'guard@kduracare.in', name: 'Mr. Siva Kumar', title: 'Gate Security Guard', color: 'primary' },
      { id: 'employee', role: 'Staff Employee', email: 'employee@kduracare.in', name: 'Ramesh Reddy', title: 'Senior ICU Technician', color: 'light' },
    ],
  },
];

export default function Login() {
  const { user, login, loginAsDemo, DEMO_USERS } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('admin@kduracare.in');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Leadership & Administration');

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const res = login(identifier, password);
    if (res?.success) {
      toast.success(`Welcome back, ${res.user.name}!`);
      navigate('/dashboard', { replace: true });
    } else {
      toast.error('Invalid credentials. Check email or select a demo account below.');
    }
    setLoading(false);
  };

  const handleDemoSelect = (demoEmail) => {
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === demoEmail.toLowerCase() || u.username === demoEmail
    );
    if (found) {
      loginAsDemo(found);
      toast.success(`Signed in as: ${found.name} (${found.role})`);
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center transition-colors">
      {/* Floating Theme Toggle */}
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggleButton />
      </div>

      <div className="w-full flex-1 flex flex-col lg:flex-row">
        {/* Left Column: Sign-in Form & Persona Matrix */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-xl">
            {/* Header Brand */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-theme-md">
                <HeartPulse className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                  K-DuraCare
                  <Badge color="primary" size="sm">
                    v2.4
                  </Badge>
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Hospital operations workspace
                </p>
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                Secure sign in
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Sign in to access your authorised clinical or operational workspace.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Hospital ID / Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. admin@kduracare.in or doctor"
                    required
                    className="tail-input pl-10"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    Security Password <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-brand-500 dark:text-brand-400">
                    Demo pass: admin123
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="tail-input pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full mt-2"
                endIcon={<ArrowRight className="h-4 w-4" />}
              >
                {loading ? 'Authenticating...' : 'Sign In to Workspace'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50 dark:bg-gray-900 px-3 font-semibold text-gray-400 dark:text-gray-500">
                  Presentation personas
                </span>
              </div>
            </div>

            {/* Categorized Demo Role Selector Tabs */}
            <div className="space-y-4">
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-gray-200 dark:border-gray-800">
                {CATEGORIZED_DEMO_USERS.map((cat) => (
                  <button
                    key={cat.category}
                    type="button"
                    onClick={() => setActiveCategory(cat.category)}
                    className={`whitespace-nowrap pb-2 text-xs font-semibold transition-colors border-b-2 px-1 ${
                      activeCategory === cat.category
                        ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>

              {/* Roles in selected category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CATEGORIZED_DEMO_USERS.find((c) => c.category === activeCategory)?.roles.map(
                  (roleItem) => (
                    <button
                      key={roleItem.id}
                      type="button"
                      onClick={() => handleDemoSelect(roleItem.email)}
                      className="group flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white hover:border-brand-300 hover:bg-brand-50/40 dark:border-gray-800 dark:bg-gray-800/40 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5 transition-all text-left"
                    >
                      <div className="flex flex-col truncate pr-2">
                        <span className="text-xs font-bold text-gray-800 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">
                          {roleItem.role}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                          {roleItem.name} · {roleItem.title}
                        </span>
                      </div>
                      <Badge color={roleItem.color} size="sm">
                        Login
                      </Badge>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hospital product narrative */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-brand-950 dark:bg-white/[0.02] border-l border-gray-200 dark:border-gray-800 relative overflow-hidden text-white">
          {/* Subtle grid pattern background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-300">
              Kanakadurga Nursing Home
            </span>
            <Badge color="success" size="sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
              NABH COMPLIANT 2026
            </Badge>
          </div>

          <div className="relative z-10 my-auto max-w-md">
            <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md mb-6 border border-white/10">
              <Sparkles className="h-8 w-8 text-brand-400" />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              One operational view for the entire hospital.
            </h2>

            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              A role-based workspace for safe staffing, attendance, facility readiness and
              clinical coordination—built to help each team act on what matters now.
            </p>

            {/* Quick Metrics highlight */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div>
                <span className="block text-2xl font-bold text-white">326</span>
                <span className="text-xs text-gray-400">Total Enrolled Staff</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-emerald-400">93%</span>
                <span className="text-xs text-gray-400">ICU Shift Coverage</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-brand-400">12</span>
                <span className="text-xs text-gray-400">Monitored locations</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-gray-400 flex items-center justify-between">
            <span>© 2026 Kanakadurga Nursing Home</span>
            <span>Role-based access · simulated data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
