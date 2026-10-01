import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Heart, Sparkles, Shield, Clock, ArrowRight, User, Lock, Zap, Phone, RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

const DEMO_ACCOUNTS = [
  { role: "Super Administrator", email: "admin@kduracare.in",    pass: "admin123",    name: "Dr K. B. Chowdary",   title: "Medical Director",        color: "#38BDF8", glow: "rgba(56,189,248,0.15)"  },
  { role: "Hospital Administrator / Management", email: "management@kduracare.in", pass: "mgmt123", name: "Sri P. Venkateswara Rao", title: "Managing Director", color: "#818CF8", glow: "rgba(129,140,248,0.15)" },
  { role: "Doctor",              email: "doctor@kduracare.in",   pass: "doc123",      name: "Dr. Ravi Shankar",    title: "Chief Cardiologist",      color: "#34D399", glow: "rgba(52,211,153,0.15)"  },
  { role: "Nurse",               email: "nurse@kduracare.in",    pass: "nurse123",    name: "Mrs. Lakshmi Devi",   title: "Nursing Superintendent",  color: "#FBBF24", glow: "rgba(251,191,36,0.15)"  },
  { role: "Receptionist",        email: "reception@kduracare.in", pass: "rec123",     name: "Mrs. Priya Sharma",   title: "Front Desk Executive",    color: "#38BDF8", glow: "rgba(56,189,248,0.15)"  },
  { role: "Staff Employee",      email: "employee@kduracare.in", pass: "emp123",      name: "Ramesh Reddy",        title: "Senior ICU Technician",   color: "#94A3B8", glow: "rgba(148,163,184,0.15)" },
  { role: "Security Guard",      email: "guard@kduracare.in",    pass: "guard123",    name: "Mr. Siva Kumar",      title: "Gate Security Guard",     color: "#2DD4BF", glow: "rgba(45,212,191,0.15)"  },
  { role: "Laboratory Staff",    email: "lab@kduracare.in",      pass: "lab123",      name: "Mr. Venkat Kumar",    title: "Chief Biochemist",        color: "#06B6D4", glow: "rgba(6,182,212,0.15)"   },
  { role: "Aayah",               email: "aayah@kduracare.in",    pass: "aayah123",    name: "Mrs. Meena Yadav",    title: "Ward Support Caregiver",  color: "#EC4899", glow: "rgba(236,72,153,0.15)"  },
  { role: "Payroll Officer",     email: "payroll@kduracare.in",  pass: "pay123",      name: "Mr. Rajesh Varma",    title: "Senior Payroll Officer",  color: "#A855F7", glow: "rgba(168,85,247,0.15)"  },
];

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>
      {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </span>
  );
}

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function OTPInput({ value, onChange }) {
  const inputs = useRef([]);
  const digits = (value + "      ").slice(0, 6).split("");

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      const next = [...digits]; next[i] = " ";
      onChange(next.join("").trimEnd());
      if (i > 0) inputs.current[i - 1]?.focus();
    } else if (/^\d$/.test(e.key)) {
      const next = [...digits]; next[i] = e.key;
      const joined = next.join("").replace(/ /g, "").slice(0, 6);
      onChange(joined);
      if (i < 5) inputs.current[i + 1]?.focus();
    }
    e.preventDefault();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
      {Array.from({ length: 6 }).map((_, i) => {
        const d = value[i] || "";
        return (
          <input
            key={i}
            ref={el => inputs.current[i] = el}
            type="text" inputMode="numeric" maxLength={1}
            value={d} readOnly={false}
            onChange={() => {}}
            onKeyDown={e => handleKey(i, e)}
            onPaste={handlePaste}
            autoFocus={i === 0}
            style={{
              width: "46px", height: "54px", textAlign: "center",
              fontSize: "22px", fontWeight: 800,
              fontFamily: "'JetBrains Mono', monospace",
              color: "#ffffff",
              background: d ? "rgba(14,165,233,0.2)" : "rgba(255,255,255,0.06)",
              border: d ? "1.5px solid rgba(14,165,233,0.6)" : "1.5px solid rgba(255,255,255,0.12)",
              borderRadius: "12px", outline: "none", transition: "all 0.2s ease",
              caretColor: "transparent",
            }}
          />
        );
      })}
    </div>
  );
}

export default function Login() {
  const { user, login, loginAsDemo, DEMO_USERS } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState("admin@kduracare.in");
  const [password, setPassword] = useState("admin123");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const [otpStep, setOtpStep]         = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [otpCode, setOtpCode]         = useState("");
  const [otpInput, setOtpInput]       = useState("");
  const [otpError, setOtpError]       = useState("");
  const [otpLoading, setOtpLoading]   = useState(false);
  const [resendCD, setResendCD]       = useState(0);

  useEffect(() => { if (user) navigate("/dashboard", { replace: true }); }, [user, navigate]);

  useEffect(() => {
    if (resendCD <= 0) return;
    const t = setTimeout(() => setResendCD(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCD]);

  const sendOTP = (targetUser) => {
    const code = generateOTP();
    setOtpCode(code);
    setOtpInput("");
    setOtpError("");
    setResendCD(30);
    toast(
      () => (
        <div style={{ fontFamily: "monospace" }}>
          <div style={{ fontWeight: 700, marginBottom: 4, color: "#0EA5E9" }}>OTP for {targetUser.name}</div>
          <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: "0.25em", color: "#fff" }}>{code}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>Valid 5 minutes � Do not share</div>
        </div>
      ),
      { duration: 15000, style: { background: "#0f172a", border: "1px solid rgba(14,165,233,0.35)", borderRadius: "16px" } }
    );
  };

  const handleCredentialSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = login(email, password);
      if (res && res.success) {
        setPendingUser(res.user);
        setOtpStep(true);
        sendOTP(res.user);
        toast.success("Credentials verified! OTP sent.", { icon: "??" });
      } else {
        setError("Invalid credentials. Use demo logins below or check your password.");
        toast.error("Authentication failed.");
      }
    } finally { setLoading(false); }
  };

  const handleOTPSubmit = async (e) => {
    if (e) e.preventDefault();
    setOtpError("");
    if (otpInput.length < 6) { setOtpError("Please enter all 6 digits."); return; }
    setOtpLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (otpInput === otpCode) {
      loginAsDemo(pendingUser);
      toast.success(`Welcome back, ${pendingUser.name}!`, { icon: "??" });
      navigate("/dashboard", { replace: true });
    } else {
      setOtpError("Incorrect OTP. Check the notification or request a new code.");
      setOtpLoading(false);
    }
  };

  const handleQuickDemoLogin = (demo) => {
    const targetUser = DEMO_USERS.find(u => u.email.toLowerCase() === demo.email.toLowerCase()) || DEMO_USERS[0];
    loginAsDemo(targetUser);
    toast.success(`Demo: ${targetUser.role} (${targetUser.name})`, { icon: "?" });
    navigate("/dashboard", { replace: true });
  };

  const handleResend = () => {
    if (resendCD > 0 || !pendingUser) return;
    sendOTP(pendingUser);
    toast.success("New OTP sent!");
  };

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at 50% 0%, #0c152e 0%, #050812 70%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-120px", left: "15%", width: "550px", height: "550px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 65%)", filter: "blur(50px)" }} />
        <div style={{ position: "absolute", bottom: "-100px", right: "15%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)", filter: "blur(50px)" }} />
      </div>

      <div className="login-glass-container animate-fade-in">

        {/* Left branding */}
        <div className="login-left-brand">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "linear-gradient(135deg, #0EA5E9, #6366F1)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(14,165,233,0.35)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <Heart style={{ width: "24px", height: "24px", color: "#ffffff" }} />
              </div>
              <div>
                <div style={{ fontSize: "22px", fontWeight: "900", color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>K-DuraCare</div>
                <div style={{ fontSize: "11px", color: "#38BDF8", fontWeight: "600", letterSpacing: "0.04em" }}>Kanakadurga Nursing Home</div>
              </div>
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "9999px", background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.25)", marginBottom: "16px" }}>
              <Sparkles style={{ width: "13px", height: "13px", color: "#38BDF8" }} />
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#7DD3FC", letterSpacing: "0.04em" }}>NEXT-GEN HOSPITAL INTELLIGENCE</span>
            </div>

            <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", lineHeight: 1.25, marginBottom: "14px", letterSpacing: "-0.02em" }}>
              Workforce &amp; Operational{" "}
              <span style={{ background: "linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #34D399 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Intelligence</span>
            </h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "24px" }}>Real-time CCTV telemetry, automated biometric rosters, statutory payroll compliance, and tamper-evident audit ledger.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { icon: Sparkles, text: "Live CCTV Observational Telemetry",   color: "#38BDF8" },
                { icon: Shield,   text: "Cryptographic SHA-256 Audit Trail",    color: "#34D399" },
                { icon: Clock,    text: "Automated Shift & Overtime Payroll",   color: "#818CF8" },
                { icon: Phone,    text: "2FA OTP Authentication Enabled",       color: "#FBBF24" },
              ].map((feat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontSize: "12px", color: "rgba(255,255,255,0.75)" }}>
                  <feat.icon style={{ width: "15px", height: "15px", color: feat.color, flexShrink: 0 }} />
                  <span>{feat.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="live-dot" />
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontWeight: "500" }}>Core Engine Online � 2FA Active</span>
            </div>
            <LiveClock />
          </div>
        </div>

        {/* Right form */}
        <div className="login-right-form">

          {/* STEP 1 */}
          {!otpStep && (
            <>
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "6px" }}>System Sign-In</h2>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>Enter staff credentials. An OTP will be sent for 2FA verification.</p>
              </div>

              {error && (
                <div style={{ padding: "12px 14px", borderRadius: "12px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#F87171", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
                  <Shield style={{ width: "16px", height: "16px", flexShrink: 0 }} /><span>{error}</span>
                </div>
              )}

              <form onSubmit={handleCredentialSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label className="input-label">
                    <span>Staff Username / Email</span>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", textTransform: "none" }}>e.g. admin@kduracare.in</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <User className="input-icon-left" />
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="input-field input-with-icon" placeholder="admin@kduracare.in" required />
                  </div>
                </div>

                <div>
                  <label className="input-label">
                    <span>Password</span>
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", textTransform: "none" }}>e.g. admin123</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock className="input-icon-left" />
                    <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="input-field input-with-icon" placeholder="��������" style={{ paddingRight: "42px" }} required />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="input-icon-right">
                      {showPass ? <EyeOff style={{ width: "15px", height: "15px" }} /> : <Eye style={{ width: "15px", height: "15px" }} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-login-submit">
                  {loading
                    ? <><div className="animate-spin" style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#ffffff", borderRadius: "50%" }} /><span>Verifying...</span></>
                    : <><span>Verify Credentials</span><ArrowRight style={{ width: "16px", height: "16px" }} /></>}
                </button>
              </form>

              {/* Demo logins */}
              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Zap style={{ width: "13px", height: "13px", color: "#FBBF24" }} />Instant Demo Logins
                  </span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>Skips OTP</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {DEMO_ACCOUNTS.map(demo => (
                    <button key={demo.role} type="button" onClick={() => handleQuickDemoLogin(demo)} className="demo-role-card"
                      style={{ borderLeft: `3px solid ${demo.color}` }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 24px ${demo.glow}`}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: demo.color }}>{demo.role}</span>
                        <ArrowRight style={{ width: "12px", height: "12px", color: "rgba(255,255,255,0.4)" }} />
                      </div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{demo.name}</div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{demo.email}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 2 � OTP */}
          {otpStep && (
            <div className="animate-fade-in">
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "linear-gradient(135deg, rgba(14,165,233,0.25), rgba(99,102,241,0.25))", border: "1px solid rgba(14,165,233,0.35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Phone style={{ width: "28px", height: "28px", color: "#38BDF8" }} />
                </div>
                <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "8px" }}>2-Factor Verification</h2>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                  OTP dispatched to <strong style={{ color: "#38BDF8" }}>{pendingUser?.email}</strong>
                </p>
                <div style={{ marginTop: "10px", display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "9999px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}>
                  <Sparkles style={{ width: "12px", height: "12px", color: "#FBBF24" }} />
                  <span style={{ fontSize: "10px", fontWeight: "700", color: "#FCD34D", letterSpacing: "0.04em" }}>CHECK TOAST NOTIFICATION FOR OTP CODE</span>
                </div>
              </div>

              <form onSubmit={handleOTPSubmit}>
                <OTPInput value={otpInput} onChange={setOtpInput} />

                {otpError && (
                  <div style={{ marginTop: "14px", padding: "10px 14px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#F87171", fontSize: "12px", textAlign: "center" }}>
                    {otpError}
                  </div>
                )}

                <button type="submit" disabled={otpLoading || otpInput.length < 6} className="btn-login-submit" style={{ marginTop: "20px", opacity: otpInput.length < 6 ? 0.5 : 1 }}>
                  {otpLoading
                    ? <><div className="animate-spin" style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#ffffff", borderRadius: "50%" }} /><span>Verifying OTP...</span></>
                    : <><CheckCircle2 style={{ width: "16px", height: "16px" }} /><span>Confirm &amp; Enter Workspace</span></>}
                </button>
              </form>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "18px" }}>
                <button type="button"
                  onClick={() => { setOtpStep(false); setPendingUser(null); setOtpInput(""); setOtpError(""); }}
                  style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  Back to Login
                </button>
                <button type="button" onClick={handleResend} disabled={resendCD > 0}
                  style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: resendCD > 0 ? "rgba(255,255,255,0.3)" : "#38BDF8", background: "none", border: "none", cursor: resendCD > 0 ? "default" : "pointer", fontWeight: 600 }}>
                  <RefreshCw style={{ width: "13px", height: "13px" }} />
                  {resendCD > 0 ? `Resend in ${resendCD}s` : "Resend OTP"}
                </button>
              </div>

              <div style={{ marginTop: "20px", padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "linear-gradient(135deg, #0EA5E9, #6366F1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                  {pendingUser?.avatar}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>{pendingUser?.name}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{pendingUser?.title} � {pendingUser?.role}</div>
                </div>
              </div>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>
            Kanakadurga Nursing Home � NABH Digital Records v2.4 � 2FA Enabled
          </div>
        </div>

      </div>
    </div>
  );
}
