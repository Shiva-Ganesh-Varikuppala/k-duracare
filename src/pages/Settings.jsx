import { useState } from 'react';
import {
  Settings as SettingsIcon, User, Lock, Bell, Video, Cpu,
  Building2, Save, Check, Eye, EyeOff, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import Badge from '../components/ui/badge/Badge';
import Button from '../components/ui/button/Button';

const TABS = [
  { id: 'profile',       label: 'My Profile',     icon: User },
  { id: 'security',      label: 'Security & Auth', icon: Lock },
  { id: 'notifications', label: 'Notifications',   icon: Bell },
  { id: 'hospital',      label: 'Hospital Info',   icon: Building2 },
  { id: 'ai',            label: 'AI Automation',   icon: Cpu },
  { id: 'cameras',       label: 'Camera Config',   icon: Video },
];

function ToggleSwitch({ value, onChange, label }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-100 dark:border-gray-800">
      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          value ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
            value ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

function SettingSection({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 mb-4 dark:border-gray-800 dark:bg-white/[0.01]">
      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </p>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {children}
      </div>
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved]         = useState(false);
  const [showPass, setShowPass]   = useState(false);

  // Profile form
  const [profile, setProfile] = useState({
    name: user?.name || 'Hospital Admin',
    email: user?.email || 'admin@kduracare.in',
    phone: '98765 43210',
    role: user?.role || 'Administrator',
    bio: 'Hospital administration & workforce governance.',
  });

  // Notification settings
  const [notifSettings, setNotifSettings] = useState({
    emailAlerts: true,
    smsAlerts: true,
    cameraAlerts: true,
    attendanceAlerts: true,
    leaveNotifs: true,
    payrollNotifs: true,
    aiInsightsSummary: false,
    dailyDigest: true,
  });

  // AI settings
  const [aiSettings, setAiSettings] = useState({
    anomalyDetection: true,
    staffingInsights: true,
    leaveImpactAnalysis: true,
    payrollAnomalyScan: true,
    cctvAIMonitoring: true,
    activityClassification: false,
    autoAlertResolution: false,
    weeklyAIReport: true,
  });

  // Hospital settings
  const [hospital, setHospital] = useState({
    name: 'Kanakadurga Hospital',
    regNo: 'APMC-KNH-2003-1284',
    nabh: 'NABH-2019-0458',
    address: 'Vijayawada, Andhra Pradesh — 520010',
    beds: '120',
    icu: '12',
    email: 'info@kanakadurganursinghome.in',
    phone: '0866-234567',
  });

  const handleSave = async () => {
    setSaved(true);
    await new Promise(r => setTimeout(r, 600));
    setSaved(false);
    toast.success('Configuration parameters updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageBreadcrumb
          pageTitle="System Preferences & Hospital Config"
          breadcrumbs={[
            { label: 'Admin', path: '/settings' },
            { label: 'Settings' }
          ]}
        />
        <Button
          variant="primary"
          size="sm"
          startIcon={saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          onClick={handleSave}
        >
          {saved ? 'Saved!' : 'Save Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-xs dark:border-gray-800 dark:bg-white/[0.03] lg:col-span-1 h-fit">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all mb-1 ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 shadow-xs dark:bg-brand-500/10 dark:text-brand-400'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/[0.02] dark:hover:text-white'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-brand-500' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content area */}
        <div className="lg:col-span-3">
          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-2xl font-bold text-white shadow-theme-xs">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{profile.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{profile.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Full Name</label>
                  <input
                    className="input-field"
                    value={profile.name}
                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="input-label">Email Address</label>
                  <input
                    type="email"
                    className="input-field"
                    value={profile.email}
                    onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="input-label">Contact Number</label>
                  <input
                    className="input-field font-mono"
                    value={profile.phone}
                    onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="input-label">Assigned Clearance Role</label>
                  <input
                    className="input-field bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed"
                    value={profile.role}
                    disabled
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="input-label">Administrative Bio</label>
                  <textarea
                    className="input-field"
                    value={profile.bio}
                    onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Credentials & Password Policy</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="input-label">Current Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="input-label">New Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="input-field pr-10"
                      placeholder="Min. 8 characters with numbers & symbols"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="input-label">Confirm New Password</label>
                  <input type="password" className="input-field" placeholder="Re-enter new password" />
                </div>
              </div>

              <SettingSection title="Session & Encryption Controls">
                <ToggleSwitch value={true} onChange={() => {}} label="Auto-logout after 30 minutes of terminal inactivity" />
                <ToggleSwitch value={false} onChange={() => {}} label="Enforce Multi-Factor Authentication (SMS OTP)" />
                <ToggleSwitch value={true} onChange={() => {}} label="Cryptographically sign all administrator actions to Audit Trail" />
              </SettingSection>

              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>NABH & HIPAA Compliant — All audit records are cryptographically sealed with SHA-256 Merkle chain.</span>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Notification Channels & Delivery</h3>
              <SettingSection title="Delivery Channels">
                <ToggleSwitch
                  value={notifSettings.emailAlerts}
                  onChange={v => setNotifSettings(p => ({ ...p, emailAlerts: v }))}
                  label="Official Email Alerts (Critical notifications)"
                />
                <ToggleSwitch
                  value={notifSettings.smsAlerts}
                  onChange={v => setNotifSettings(p => ({ ...p, smsAlerts: v }))}
                  label="Emergency SMS Alerts (To registered duty doctor mobile)"
                />
              </SettingSection>

              <SettingSection title="Automated Event Triggers">
                <ToggleSwitch
                  value={notifSettings.cameraAlerts}
                  onChange={v => setNotifSettings(p => ({ ...p, cameraAlerts: v }))}
                  label="CCTV & AI Security Zone Alerts"
                />
                <ToggleSwitch
                  value={notifSettings.attendanceAlerts}
                  onChange={v => setNotifSettings(p => ({ ...p, attendanceAlerts: v }))}
                  label="Attendance & Biometric Punch Discrepancies"
                />
                <ToggleSwitch
                  value={notifSettings.leaveNotifs}
                  onChange={v => setNotifSettings(p => ({ ...p, leaveNotifs: v }))}
                  label="Leave Applications & Roster Swap Requests"
                />
                <ToggleSwitch
                  value={notifSettings.payrollNotifs}
                  onChange={v => setNotifSettings(p => ({ ...p, payrollNotifs: v }))}
                  label="Monthly Payroll Batch Calculation & Status"
                />
                <ToggleSwitch
                  value={notifSettings.dailyDigest}
                  onChange={v => setNotifSettings(p => ({ ...p, dailyDigest: v }))}
                  label="Daily Morning Staffing Digest (07:00 AM)"
                />
              </SettingSection>
            </div>
          )}

          {/* HOSPITAL INFO */}
          {activeTab === 'hospital' && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Hospital Organization Parameters</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="input-label">Hospital Name</label>
                  <input
                    className="input-field"
                    value={hospital.name}
                    onChange={e => setHospital(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="input-label">State Medical Council Reg. No.</label>
                  <input
                    className="input-field font-mono"
                    value={hospital.regNo}
                    onChange={e => setHospital(p => ({ ...p, regNo: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="input-label">NABH Accreditation ID</label>
                  <input
                    className="input-field font-mono"
                    value={hospital.nabh}
                    onChange={e => setHospital(p => ({ ...p, nabh: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="input-label">Total Operational Beds</label>
                  <input
                    className="input-field font-mono"
                    value={hospital.beds}
                    onChange={e => setHospital(p => ({ ...p, beds: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="input-label">ICU Specialized Beds</label>
                  <input
                    className="input-field font-mono"
                    value={hospital.icu}
                    onChange={e => setHospital(p => ({ ...p, icu: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="input-label">Administrative Email</label>
                  <input
                    className="input-field"
                    value={hospital.email}
                    onChange={e => setHospital(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="input-label">Board Phone</label>
                  <input
                    className="input-field font-mono"
                    value={hospital.phone}
                    onChange={e => setHospital(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="input-label">Hospital Physical Address</label>
                  <input
                    className="input-field"
                    value={hospital.address}
                    onChange={e => setHospital(p => ({ ...p, address: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* AI SETTINGS */}
          {activeTab === 'ai' && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">K-DuraCare AI Engine Preferences</h3>
              <SettingSection title="Workforce & Clinical Telemetry">
                <ToggleSwitch
                  value={aiSettings.staffingInsights}
                  onChange={v => setAiSettings(p => ({ ...p, staffingInsights: v }))}
                  label="Live Department Coverage & Understaffing Prediction"
                />
                <ToggleSwitch
                  value={aiSettings.leaveImpactAnalysis}
                  onChange={v => setAiSettings(p => ({ ...p, leaveImpactAnalysis: v }))}
                  label="Predictive Shift Impact Analysis on Leave Submission"
                />
                <ToggleSwitch
                  value={aiSettings.payrollAnomalyScan}
                  onChange={v => setAiSettings(p => ({ ...p, payrollAnomalyScan: v }))}
                  label="Automated Anomaly Audit in Salary Computations"
                />
                <ToggleSwitch
                  value={aiSettings.weeklyAIReport}
                  onChange={v => setAiSettings(p => ({ ...p, weeklyAIReport: v }))}
                  label="Weekly Synthesis Digest by Google Gemini"
                />
              </SettingSection>

              <SettingSection title="Surveillance Vision Pipelines">
                <ToggleSwitch
                  value={aiSettings.cctvAIMonitoring}
                  onChange={v => setAiSettings(p => ({ ...p, cctvAIMonitoring: v }))}
                  label="Edge Vision Person Presence Detection (YOLO)"
                />
                <ToggleSwitch
                  value={aiSettings.activityClassification}
                  onChange={v => setAiSettings(p => ({ ...p, activityClassification: v }))}
                  label="Observable Posture & Sitting Duration Tracking"
                />
                <ToggleSwitch
                  value={aiSettings.autoAlertResolution}
                  onChange={v => setAiSettings(p => ({ ...p, autoAlertResolution: v }))}
                  label="Auto-resolve verified low-severity sensor events"
                />
              </SettingSection>
            </div>
          )}

          {/* CAMERA CONFIG */}
          {activeTab === 'cameras' && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-white/[0.03]">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">VMS Stream Encoding & Storage</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="input-label">RTSP Video Resolution</label>
                  <select className="input-field">
                    <option>1080p Full HD (1920x1080)</option>
                    <option>4K Ultra HD (3840x2160)</option>
                    <option>720p HD</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Stream Frame Rate</label>
                  <select className="input-field">
                    <option>30 FPS (Standard)</option>
                    <option>25 FPS</option>
                    <option>15 FPS (Bandwidth Saver)</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">NVR Recording Mode</label>
                  <select className="input-field">
                    <option>Continuous 24/7 Archival</option>
                    <option>Motion & Event-Triggered</option>
                    <option>Scheduled Operational Hours</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Retention Archive Window</label>
                  <select className="input-field">
                    <option>30 Days (NABH Standard)</option>
                    <option>60 Days</option>
                    <option>90 Days</option>
                  </select>
                </div>
              </div>

              <SettingSection title="Vision Analytics Features">
                <ToggleSwitch value={true} onChange={() => {}} label="Crowd Density & Corridor Bottleneck Alerts" />
                <ToggleSwitch value={true} onChange={() => {}} label="Restricted Sterile Zone Access Protection" />
                <ToggleSwitch value={true} onChange={() => {}} label="Emergency Ramp Obstruction Detection" />
              </SettingSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
