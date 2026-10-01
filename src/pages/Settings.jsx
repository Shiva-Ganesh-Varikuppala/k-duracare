import { useState } from 'react';
import { Settings as SettingsIcon, User, Lock, Bell, Video, Cpu, Building2, Save, Check, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const TABS = [
  { id: 'profile',       label: 'My Profile',     icon: User },
  { id: 'security',      label: 'Security',        icon: Lock },
  { id: 'notifications', label: 'Notifications',   icon: Bell },
  { id: 'hospital',      label: 'Hospital Info',   icon: Building2 },
  { id: 'ai',            label: 'AI Settings',     icon: Cpu },
  { id: 'cameras',       label: 'Camera Config',   icon: Video },
];

function ToggleSwitch({ value, onChange, label }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 44, height: 24, borderRadius: 100, position: 'relative', cursor: 'pointer',
          background: value ? 'linear-gradient(135deg,#0EA5E9,#6366F1)' : 'rgba(255,255,255,0.1)',
          border: `1px solid ${value ? 'rgba(14,165,233,0.4)' : 'rgba(255,255,255,0.12)'}`,
          transition: 'all 0.25s ease', flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: 2, width: 18, height: 18, borderRadius: '50%', background: '#fff',
          left: value ? 22 : 3, transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 1px 6px rgba(0,0,0,0.4)',
        }} />
      </button>
    </div>
  );
}

function SettingSection({ title, children }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</p>
      </div>
      <div style={{ padding: '0 20px' }}>
        {children}
      </div>
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Profile form
  const [profile, setProfile] = useState({
    name: user?.name || 'Hospital Admin',
    email: user?.email || 'admin@kduracare.in',
    phone: '98765 43210',
    role: user?.role || 'Administrator',
    bio: 'Hospital administration & workforce management.',
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
    name: 'Kanakadurga Nursing Home',
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
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>Settings</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            Manage your K-DuraCare profile, AI, notifications & system configuration
          </p>
        </div>
        <button
          className="btn-primary"
          style={{ opacity: saved ? 0.8 : 1 }}
          onClick={handleSave}
        >
          {saved ? <><Check style={{ width: 15, height: 15 }} /> Saved!</> : <><Save style={{ width: 15, height: 15 }} /> Save Settings</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <div className="glass-card lg:col-span-1" style={{ padding: 12, height: 'fit-content' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: isActive ? 'linear-gradient(135deg,rgba(14,165,233,0.15),rgba(99,102,241,0.1))' : 'transparent',
                  borderLeft: isActive ? '2px solid #38BDF8' : '2px solid transparent',
                  transition: 'all 0.2s ease', marginBottom: 2,
                }}
                onMouseEnter={e => !isActive && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
              >
                <tab.icon style={{ width: 15, height: 15, color: isActive ? '#38BDF8' : 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? '#fff' : 'rgba(255,255,255,0.5)' }}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content area */}
        <div className="lg:col-span-3 space-y-4">

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="glass-card animate-fade-in" style={{ padding: 28 }}>
              <div className="flex items-center gap-4 mb-6">
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#0EA5E9,#8B5CF6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 900, color: '#fff',
                  boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                }}>
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{profile.name}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{profile.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Full Name</label>
                  <input className="input-field" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="input-label">Email</label>
                  <input type="email" className="input-field" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label className="input-label">Phone</label>
                  <input className="input-field" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="input-label">Role</label>
                  <input className="input-field" value={profile.role} disabled style={{ opacity: 0.5 }} />
                </div>
                <div className="col-span-2">
                  <label className="input-label">Bio / Notes</label>
                  <textarea className="input-field" value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ resize: 'vertical' }} />
                </div>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div className="glass-card animate-fade-in" style={{ padding: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Change Password</h3>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="input-label">Current Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="input-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPass ? 'text' : 'password'} className="input-field" placeholder="Min. 8 characters" style={{ paddingRight: 44 }} />
                    <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)' }}>
                      {showPass ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="input-label">Confirm New Password</label>
                  <input type="password" className="input-field" placeholder="Re-enter new password" />
                </div>
              </div>
              <SettingSection title="Session Security">
                <ToggleSwitch value={true} onChange={() => {}} label="Auto-logout after 30 minutes of inactivity" />
                <ToggleSwitch value={false} onChange={() => {}} label="Two-Factor Authentication (OTP)" />
                <ToggleSwitch value={true} onChange={() => {}} label="Log all admin actions to audit trail" />
              </SettingSection>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 12, padding: '12px 16px', marginTop: 12 }}>
                <Shield style={{ width: 14, height: 14, color: '#34D399' }} />
                <p style={{ fontSize: 12, color: '#34D399' }}>NABH Compliant — All actions are audit-logged and tamper-proof</p>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="glass-card animate-fade-in" style={{ padding: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Notification Preferences</h3>
              <SettingSection title="Alert Channels">
                <ToggleSwitch value={notifSettings.emailAlerts} onChange={v => setNotifSettings(p => ({ ...p, emailAlerts: v }))} label="Email Alerts" />
                <ToggleSwitch value={notifSettings.smsAlerts} onChange={v => setNotifSettings(p => ({ ...p, smsAlerts: v }))} label="SMS Alerts (to registered mobile)" />
              </SettingSection>
              <SettingSection title="Alert Types">
                <ToggleSwitch value={notifSettings.cameraAlerts} onChange={v => setNotifSettings(p => ({ ...p, cameraAlerts: v }))} label="CCTV & AI Security Alerts" />
                <ToggleSwitch value={notifSettings.attendanceAlerts} onChange={v => setNotifSettings(p => ({ ...p, attendanceAlerts: v }))} label="Attendance Anomalies" />
                <ToggleSwitch value={notifSettings.leaveNotifs} onChange={v => setNotifSettings(p => ({ ...p, leaveNotifs: v }))} label="Leave Requests & Approvals" />
                <ToggleSwitch value={notifSettings.payrollNotifs} onChange={v => setNotifSettings(p => ({ ...p, payrollNotifs: v }))} label="Payroll Ready / Alerts" />
                <ToggleSwitch value={notifSettings.dailyDigest} onChange={v => setNotifSettings(p => ({ ...p, dailyDigest: v }))} label="Daily Summary Digest (7 AM)" />
                <ToggleSwitch value={notifSettings.aiInsightsSummary} onChange={v => setNotifSettings(p => ({ ...p, aiInsightsSummary: v }))} label="Weekly AI Insights Report" />
              </SettingSection>
            </div>
          )}

          {/* HOSPITAL INFO */}
          {activeTab === 'hospital' && (
            <div className="glass-card animate-fade-in" style={{ padding: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Hospital Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="input-label">Hospital Name</label>
                  <input className="input-field" value={hospital.name} onChange={e => setHospital(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="input-label">Registration Number</label>
                  <input className="input-field" value={hospital.regNo} onChange={e => setHospital(p => ({ ...p, regNo: e.target.value }))} />
                </div>
                <div>
                  <label className="input-label">NABH Accreditation No.</label>
                  <input className="input-field" value={hospital.nabh} onChange={e => setHospital(p => ({ ...p, nabh: e.target.value }))} />
                </div>
                <div>
                  <label className="input-label">Total Beds</label>
                  <input className="input-field" value={hospital.beds} onChange={e => setHospital(p => ({ ...p, beds: e.target.value }))} />
                </div>
                <div>
                  <label className="input-label">ICU Beds</label>
                  <input className="input-field" value={hospital.icu} onChange={e => setHospital(p => ({ ...p, icu: e.target.value }))} />
                </div>
                <div>
                  <label className="input-label">Contact Email</label>
                  <input className="input-field" value={hospital.email} onChange={e => setHospital(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label className="input-label">Phone</label>
                  <input className="input-field" value={hospital.phone} onChange={e => setHospital(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <label className="input-label">Address</label>
                  <input className="input-field" value={hospital.address} onChange={e => setHospital(p => ({ ...p, address: e.target.value }))} />
                </div>
              </div>
            </div>
          )}

          {/* AI SETTINGS */}
          {activeTab === 'ai' && (
            <div className="glass-card animate-fade-in" style={{ padding: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20 }}>K-DuraCare AI Configuration</h3>
              <SettingSection title="Workforce Intelligence">
                <ToggleSwitch value={aiSettings.staffingInsights} onChange={v => setAiSettings(p => ({ ...p, staffingInsights: v }))} label="Real-time Staffing Coverage Analysis" />
                <ToggleSwitch value={aiSettings.leaveImpactAnalysis} onChange={v => setAiSettings(p => ({ ...p, leaveImpactAnalysis: v }))} label="Leave Impact Analysis on Requests" />
                <ToggleSwitch value={aiSettings.payrollAnomalyScan} onChange={v => setAiSettings(p => ({ ...p, payrollAnomalyScan: v }))} label="Payroll Anomaly Detection" />
                <ToggleSwitch value={aiSettings.weeklyAIReport} onChange={v => setAiSettings(p => ({ ...p, weeklyAIReport: v }))} label="Weekly AI Insights Summary Report" />
              </SettingSection>
              <SettingSection title="CCTV & Security Intelligence">
                <ToggleSwitch value={aiSettings.anomalyDetection} onChange={v => setAiSettings(p => ({ ...p, anomalyDetection: v }))} label="Camera Anomaly Detection" />
                <ToggleSwitch value={aiSettings.cctvAIMonitoring} onChange={v => setAiSettings(p => ({ ...p, cctvAIMonitoring: v }))} label="AI Person/Activity Detection (CCTV)" />
                <ToggleSwitch value={aiSettings.activityClassification} onChange={v => setAiSettings(p => ({ ...p, activityClassification: v }))} label="Workplace Activity Classification (Experimental)" />
                <ToggleSwitch value={aiSettings.autoAlertResolution} onChange={v => setAiSettings(p => ({ ...p, autoAlertResolution: v }))} label="Auto-resolve Low-severity Alerts" />
              </SettingSection>
              <div style={{ display: 'flex', alignItems: 'start', gap: 8, background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12, padding: '14px 16px', marginTop: 8 }}>
                <Cpu style={{ width: 14, height: 14, color: '#818CF8', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                  K-DuraCare AI is powered by <strong style={{ color: '#818CF8' }}>Google Gemini</strong>. All AI processing is encrypted and NABH-compliant. Activity classification is experimental and uses only anonymous behavioral observations — no personal identification.
                </p>
              </div>
            </div>
          )}

          {/* CAMERA CONFIG */}
          {activeTab === 'cameras' && (
            <div className="glass-card animate-fade-in" style={{ padding: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Camera System Configuration</h3>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="input-label">Video Resolution</label>
                  <select className="input-field">
                    <option>1080p Full HD</option>
                    <option>4K Ultra HD</option>
                    <option>720p</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Frame Rate</label>
                  <select className="input-field">
                    <option>30 FPS</option>
                    <option>25 FPS</option>
                    <option>15 FPS</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Recording Mode</label>
                  <select className="input-field">
                    <option>Continuous 24/7</option>
                    <option>Motion-triggered</option>
                    <option>Scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Retention Period</label>
                  <select className="input-field">
                    <option>30 Days</option>
                    <option>60 Days</option>
                    <option>90 Days</option>
                  </select>
                </div>
              </div>
              <SettingSection title="AI Camera Features">
                <ToggleSwitch value={true} onChange={() => {}} label="Person Detection & Count" />
                <ToggleSwitch value={true} onChange={() => {}} label="Restricted Zone Monitoring" />
                <ToggleSwitch value={true} onChange={() => {}} label="Fall Detection Alerts" />
                <ToggleSwitch value={false} onChange={() => {}} label="Loitering Detection" />
                <ToggleSwitch value={true} onChange={() => {}} label="Crowd Density Monitoring" />
              </SettingSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
