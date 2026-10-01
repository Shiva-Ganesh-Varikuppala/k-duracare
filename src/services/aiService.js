// AI service for K-DuraCare using Google Gemini
// Uses mock responses when API key is not configured

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Hospital context to ground AI responses
const HOSPITAL_CONTEXT = `
You are K-DuraCare AI, the intelligent assistant for Kanakadurga Nursing Home.
You have access to the hospital's workforce management data including:
- 326 total employees across 12 departments
- Today: 278 present, 18 on leave, 12 absent, 14 on weekly off, 4 on duty
- Departments: ICU (93% coverage), Nursing (91%), OPD (86%), Laboratory (94%), OT (95%), Physiotherapy (92%), Reception (86%), Housekeeping (81%), Security (100%), Dhobi (91%)
- Shifts: Morning (07:00-14:00), Evening (13:00-20:00), Night (19:00-08:00), General (09:00-17:30)
- September 2026 payroll: Gross ₹84,32,500, Net ₹79,56,500
- 12 CCTV cameras: 10 Online, 1 Offline (CAM-OT-01), 1 Degraded (CAM-ICU-03)
- Active alerts: 1 Critical (possible fall event ICU), 1 High (camera offline OT), 1 High (restricted zone entry ICU)

IMPORTANT RULES:
1. Only answer questions about hospital workforce, HR, attendance, leave, payroll, CCTV, and staffing
2. Do NOT invent specific employee salary figures or HR decisions
3. Always note when information requires human verification
4. Keep responses concise, factual and helpful
5. Use ₹ for Indian Rupees
6. Respond in a professional medical/healthcare context
7. For sensitive CCTV/safety events, recommend supervisor review
`;

// Mock AI responses for when API key is not available
const MOCK_RESPONSES = {
  'how many employees': '**278 employees** are currently marked present out of 326 total staff. 18 are on approved leave, 12 are marked absent, and 14 are on weekly off.\n\n*Source: Today\'s attendance records — September 20, 2026*',
  'icu': '**ICU Department Status:**\n- Required staff: 42\n- Currently present: 39 (93% coverage)\n- Active cameras: CAM-ICU-01 (Online), CAM-ICU-02 (Online), CAM-ICU-03 (Degraded)\n- ⚠️ Alert: Possible fall event detected at 10:42 — supervisor review required\n\n*One staff member on approved leave today.*',
  'leave': '**Current Leave Summary (September 2026):**\n- Total employees on leave today: 18\n- Pending leave requests: 4 awaiting HR approval\n- 1 leave request recently rejected (insufficient coverage)\n\nTop departments with leave today: Nursing (4), ICU (3), OPD (2)',
  'staffing': '**Departments Requiring Attention:**\n\n🟡 **OPD** — 86% coverage (30/35 staff present)\n🟡 **Reception** — 86% coverage (12/14 staff present)\n🔴 **Housekeeping** — 81% coverage (44/54 staff present)\n\nAll other departments are above 90% coverage threshold.\n\n*Recommend reviewing Housekeeping roster for current shift.*',
  'payroll': '**September 2026 Payroll Summary:**\n- Employees: 326\n- Gross Payroll: ₹84,32,500\n- Overtime: ₹2,84,000\n- Deductions: ₹7,12,000\n- LOP: ₹48,000\n- **Net Payroll: ₹79,56,500**\n\nStatus: Draft — pending HR verification and approval.',
  'camera': '**Camera Status:**\n- Total cameras: 12\n- 🟢 Online: 10\n- 🔴 Offline: 1 (CAM-OT-01 — OT Entrance)\n- 🟡 Degraded: 1 (CAM-ICU-03 — low FPS)\n\n⚠️ OT Entrance is currently unmonitored. Recommend immediate technical review.',
  'alert': '**Active Alerts (Priority Order):**\n\n🔴 **Critical** — Possible fall event in ICU Monitor Zone (10:42 AM) — Confidence: 91% — Requires supervisor verification\n\n🟠 **High** — CAM-OT-01 offline — OT Entrance unmonitored since 11:30 AM\n\n🟠 **High** — Restricted zone entry detected in ICU (13:22 PM) — Under review\n\n🟡 **Medium** — OPD Entrance crowding detected (09:12 AM) — Acknowledged',
  'nursing': '**Nursing Department:**\n- Total staff: 68\n- Present today: 62 (91% coverage)\n- On leave: 4 (2 approved, 2 pending approval)\n- Shift coverage: Morning: 22, Evening: 20, Night: 20\n\nNo staffing alerts for Nursing at this time.',
  'night shift': '**Night Shift Status (Current — 19:00 to 08:00+1):**\n- ICU Night nurses: 14 scheduled\n- Nursing Night staff: 20 scheduled\n- Security Night: 9 scheduled\n- Housekeeping Night: 18 scheduled\n\nAll night shift positions are adequately filled for today.',
  'overtime': '**September 2026 Overtime:**\n- Total overtime recorded: ₹2,84,000\n- Hours by department: Security (highest), ICU, Nursing\n- ⚠️ Anomaly flagged: EMP-1032 recorded 42 hours overtime vs usual 6 hours — verification recommended by HR\n\n*Overtime requires supervisor approval before payroll finalization.*',
  'break': '**Break-Zone Presence (Live Camera Timers):**\n- **7 employees** currently in designated break areas (Staff Canteen: 4, 2nd Floor Pantry: 3)\n- Average break duration today: 18.4 minutes\n- Zero employees exceeding the 30-minute break policy limit.\n\n*Source: Canteen & Pantry IoT presence sensors & CAM-CANTEEN-01*',
  'icu activity': '**ICU Live Worker Activity Overview:**\n- Staff Present: 36 detected\n- Operational Work Zone: 29 staff active (Bedside monitoring, infusion pumps)\n- Walking / Transit: 4 staff\n- Seated: 2 staff (Seated at ICU ventilator & vitals terminal)\n- Break Area: 1 staff\n- Group Consultations: 1 (Handover between Dr. K. B. Chowdary and Charge Nurse Kavitha)\n\n*Camera Telemetry: CAM-ICU-01, 02, 03 active*',
  'interactions': '**Possible Group Interactions Observed Today (Proximity & Facing):**\n- **38 total proximity events** detected\n- 21 under 5 minutes (standard clinical handovers)\n- 11 between 5–10 minutes\n- 1 event flagged for supervisor review: **INT-023** in OPD Staff Corridor (3 persons stationary for 8m 32s)\n\n*Note: Video telemetry measures distance and orientation only — no audio recorded.*',
  'stationary': '**Prolonged Stationary Events Observed:**\n- **IDL-001**: Suresh Yadav (Housekeeping) — 8m 45s in 2nd Floor Service Corridor (Threshold: 5m) — *Needs Review*\n- **IDL-002**: Meena Yadav (Aayah) — 6m 20s at Bedside 8 — *Resolved (Patient vitals assist verified)*\n- **IDL-003**: Arun Varma (OPD) — 11m 10s in Registration Area — *Needs Review*',
  'timeline': '**Activity Timeline for KD-EMP-0001 (Ramesh Reddy — ICU Nurse):**\n- 07:01 — Check-in BioTerminal 01\n- 07:18 — ICU Nurse Station (Vitals ledger)\n- 07:35 — ICU Bed 3 & 4 (IV administration)\n- 08:42 — ICU Station (EHR update)\n- 09:20 — Group interaction with Dr. K. B. Chowdary (4m)\n- 10:15 — Seated posture at Telemetry Terminal (7m)\n- 12:02–12:20 — Staff Pantry Break (18m)\n- Total Work Zone Presence: 4h 32m (88.4%)',
  'default': 'I\'m K-DuraCare AI, your hospital workforce & operational intelligence assistant. I can help you with:\n\n• **Worker Activity** — live operational states, sitting/stationary postures, break counts\n• **Vision Events** — possible group interactions, prolonged stationary alerts, zone presence\n• **Staffing & Roster** — coverage rates, shortages, shift breakdown\n• **Attendance & Muster Roll** — biometric check-ins, tardiness, muster verification\n• **Leave & Payroll** — pending applications, AI impact analysis, salary register\n\nTry asking: *"Show me current ICU activity"* or *"How many employees are in break zones?"*',
};

function getMockResponse(query, currentUser = null) {
  const q = query.toLowerCase();
  const role = currentUser?.role || '';

  // Security Rule 1: Employee asks for another employee's attendance or general salary
  if (['Staff Employee', 'Aayah', 'Sweeper', 'Scavenger', 'Dhobi'].includes(role)) {
    if (q.includes('another') || (q.includes('salary') && !q.includes('my')) || (q.includes('attendance') && q.includes('nurse')) || (q.includes('other') && q.includes('employee'))) {
      return '⛔ **Access Denied by K-DuraCare Role Scope Policy**\n\nStaff self-service accounts are restricted to viewing personal punches, personal leave balances, and assigned shift rosters only. Querying records of other hospital personnel is prohibited under NABH data privacy policies.';
    }
  }

  // Security Rule 2: Reception asking for clinical data (diagnosis / medication)
  if (role === 'Receptionist') {
    if (q.includes('diagnosis') || q.includes('medication') || q.includes('clinical') || q.includes('prescription')) {
      return '⛔ **Access Denied: Clinical Privacy Restriction**\n\nReception clearance is strictly limited to patient check-in, token queuing, and doctor availability. Diagnostic records and medication charts are restricted to authorized clinical staff.';
    }
  }

  // Security Rule 3: HR asking for clinical patient diagnosis
  if (role === 'HR Administrator') {
    if ((q.includes('patient') && q.includes('diagnosis')) || q.includes('icu patient') || q.includes('clinical notes')) {
      return '⛔ **Access Denied: Non-Clinical Role**\n\nHuman Resources clearance encompasses hospital workforce administration, rosters, leave, and payroll. Inpatient clinical notes and medical diagnoses are restricted.';
    }
  }

  // Security Rule 4: Doctor asking for patients
  if (role === 'Doctor' || role === 'Doctor / Consultant') {
    if (q.includes('all hospital patients') || q.includes('entire hospital')) {
      return 'ℹ️ **Filtered by Physician Data Scope:**\n\nIn compliance with clinical privacy standards, your view is scoped to your 18 authorized inpatients in Cardiology & Critical Care (Ward B & ICU). Unassigned patients in other specialties remain restricted.';
    }
    if (q.includes('my patient') || q.includes('assigned patient')) {
      return '🩺 **Your Authorized Patients (Cardiology & Critical Care):**\n- **PT-1024 (Rajesh Varma, 52/M)** — Ward B, Room 204. Resolving Pneumonia (Day 3). Stable.\n- **PT-1025 (Sunita Devi, 45/F)** — ICU, Bed 08. Post-NSTEMI. Telemetry active.\n- **PT-1026 (Venkata Rao, 61/M)** — OPD, Room 102. Essential HTN. Medication renewed.';
    }
  }

  if (q.includes('break') || q.includes('canteen') || q.includes('pantry')) return MOCK_RESPONSES['break'];
  if (q.includes('timeline') || q.includes('kd-emp-0001') || q.includes('ramesh')) return MOCK_RESPONSES['timeline'];
  if (q.includes('interaction') || q.includes('chit-chat') || q.includes('group') || q.includes('conversation')) return MOCK_RESPONSES['interactions'];
  if (q.includes('stationary') || q.includes('idle') || q.includes('inactive')) return MOCK_RESPONSES['stationary'];
  if (q.includes('icu') && (q.includes('activity') || q.includes('current') || q.includes('live'))) return MOCK_RESPONSES['icu activity'];
  if (q.includes('icu')) return MOCK_RESPONSES['icu'];
  if (q.includes('leave') || q.includes('absent')) return MOCK_RESPONSES['leave'];
  if (q.includes('staffing') || q.includes('shortage') || q.includes('coverage')) return MOCK_RESPONSES['staffing'];
  if (q.includes('payroll') || q.includes('salary') || q.includes('pay')) return MOCK_RESPONSES['payroll'];
  if (q.includes('camera') || q.includes('cctv') || q.includes('offline')) return MOCK_RESPONSES['camera'];
  if (q.includes('alert') || q.includes('fall') || q.includes('safety')) return MOCK_RESPONSES['alert'];
  if (q.includes('nursing') || q.includes('nurse')) return MOCK_RESPONSES['nursing'];
  if (q.includes('night')) return MOCK_RESPONSES['night shift'];
  if (q.includes('overtime')) return MOCK_RESPONSES['overtime'];
  if (q.includes('employee') || q.includes('staff') || q.includes('present') || q.includes('how many')) return MOCK_RESPONSES['how many employees'];
  return MOCK_RESPONSES['default'];
}

export async function askAI(userMessage, conversationHistory = [], currentUser = null) {
  // If no API key, use mock responses with scope enforcement
  if (!GEMINI_API_KEY) {
    await new Promise(r => setTimeout(r, 600));
    return getMockResponse(userMessage, currentUser);
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build chat history
    const history = conversationHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history,
      systemInstruction: HOSPITAL_CONTEXT,
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (err) {
    console.error('Gemini API error:', err);
    return getMockResponse(userMessage);
  }
}

// AI-generated employee summary
export async function generateEmployeeSummary(employee) {
  const data = `
Employee: ${employee.name} (${employee.id})
Department: ${employee.department}
Designation: ${employee.designation}
Attendance this month: ${employee.present} days present, ${employee.absent} absent, ${employee.leaveUsed} on leave
Late arrivals: ${employee.lateCount}
Overtime hours: ${employee.overtimeHours}
Attendance %: ${employee.attendancePercent}%
  `;

  if (!GEMINI_API_KEY) {
    await new Promise(r => setTimeout(r, 600));
    const late = employee.lateCount > 0 ? ` ${employee.lateCount} late arrival${employee.lateCount > 1 ? 's' : ''} recorded.` : ' No late arrivals recorded.';
    const ot = employee.overtimeHours > 0 ? ` ${employee.overtimeHours} hours of overtime are logged this month.` : '';
    const abs = employee.absent > 0 ? ` ${employee.absent} unplanned absence${employee.absent > 1 ? 's' : ''} noted.` : '';
    return `Attendance records show **${employee.present} present days** and **${employee.leaveUsed} approved leave days** during September 2026.${abs}${late}${ot} Overall attendance rate is **${employee.attendancePercent}%**. No anomalies detected in payroll records.`;
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `${HOSPITAL_CONTEXT}\n\nGenerate a concise, factual 2-3 sentence HR summary for this employee based on their September 2026 data. Do not make assumptions beyond the data provided. Be professional and neutral.\n\nEmployee Data:\n${data}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch {
    const late = employee.lateCount > 0 ? ` ${employee.lateCount} late arrival${employee.lateCount > 1 ? 's' : ''} recorded.` : ' No late arrivals recorded.';
    const ot = employee.overtimeHours > 0 ? ` ${employee.overtimeHours} hours of overtime are logged this month.` : '';
    return `Attendance records show **${employee.present} present days** and **${employee.leaveUsed} approved leave days** during September 2026.${late}${ot} Overall attendance rate is **${employee.attendancePercent}%**.`;
  }
}

// AI leave impact analysis
export async function analyzeLeaveImpact(employeeId, department, days, fromDate) {
  await new Promise(r => setTimeout(r, 500));
  const deptCoverage = {
    'ICU': { required: 42, present: 39, onLeave: 2 },
    'Nursing': { required: 68, present: 62, onLeave: 4 },
    'OPD': { required: 35, present: 30, onLeave: 2 },
    'Housekeeping': { required: 54, present: 44, onLeave: 3 },
    'Security': { required: 28, present: 28, onLeave: 0 },
  };
  const data = deptCoverage[department] || { required: 10, present: 9, onLeave: 0 };
  const afterLeave = data.present - 1;
  const coverageAfter = Math.round((afterLeave / data.required) * 100);
  const isCritical = coverageAfter < 80;

  return {
    department,
    required: data.required,
    currentPresent: data.present,
    afterApproval: afterLeave,
    coverageAfter,
    isCritical,
    recommendation: isCritical
      ? `⚠️ Approving this ${days}-day leave would bring ${department} coverage to ${coverageAfter}% (${afterLeave}/${data.required}). This is below the 80% threshold. Review roster coverage before approving.`
      : `✅ Department coverage after approval would be ${coverageAfter}% (${afterLeave}/${data.required}). This is within acceptable range. Leave can be considered for approval.`,
  };
}

// AI payroll anomaly detection
export function detectPayrollAnomalies(records) {
  const anomalies = [];
  records.forEach(r => {
    if (r.status === 'Flagged' || r.lopDays > 3) {
      anomalies.push({
        empId: r.empId,
        name: r.name,
        type: 'LOP Discrepancy',
        detail: `${r.lopDays} LOP days detected — verify attendance records`,
        severity: r.lopDays > 5 ? 'High' : 'Medium',
      });
    }
    if (r.overtime > 5000) {
      anomalies.push({
        empId: r.empId,
        name: r.name,
        type: 'High Overtime',
        detail: `Overtime ₹${r.overtime.toLocaleString()} — verify shift records`,
        severity: 'Medium',
      });
    }
  });
  return anomalies;
}

// AI staffing intelligence
export function getStaffingInsights(departmentCoverage) {
  const insights = [];
  departmentCoverage.forEach(d => {
    if (d.coverage < 80) {
      insights.push({ dept: d.dept, severity: 'Critical', message: `${d.dept} is critically understaffed at ${d.coverage}% coverage. Immediate action required.` });
    } else if (d.coverage < 90) {
      insights.push({ dept: d.dept, severity: 'Warning', message: `${d.dept} is below 90% coverage (${d.coverage}%). Review roster.` });
    }
  });
  if (insights.length === 0) {
    insights.push({ dept: 'All', severity: 'Info', message: 'All departments are at or above 90% coverage. No immediate staffing concerns.' });
  }
  return insights;
}
