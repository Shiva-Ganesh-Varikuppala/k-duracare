// Clinical, Departmental & Operations Mock Data for Kanakadurga Nursing Home
export const PATIENTS = [
  {
    id: 'PT-1024',
    name: 'Rajesh Varma',
    age: 52,
    gender: 'Male',
    assignedDoctorId: 'KD-DOC-001',
    doctorName: 'Dr. Ravi Shankar',
    department: 'Cardiology',
    ward: 'Ward B',
    room: 'Room 204',
    bed: 'Bed 04',
    admissionDate: '2026-09-21',
    diagnosis: 'Severe Pneumonia & Post-CABG recovery',
    condition: 'Observation',
    treatmentPlan: 'Dual IV antibiotic coverage, respiratory physiotherapy, vitals monitoring q4h.',
    medications: [
      { name: 'IV Ceftriaxone 1g', dose: 'BD', time: '10:00 AM', status: 'Due' },
      { name: 'Nebulization Duolin', dose: 'TDS', time: '12:00 PM', status: 'Scheduled' },
      { name: 'Tab Azithromycin 500mg', dose: 'OD', time: '02:00 PM', status: 'Scheduled' },
      { name: 'Tab Aspirin 75mg', dose: 'OD post-meals', time: '08:00 PM', status: 'Scheduled' }
    ],
    investigations: ['CBC & ESR', 'Chest X-Ray PA', 'Serum Electrolytes', 'ECG 12-Lead'],
    vitals: { bp: '128/84', pulse: '78 bpm', spo2: '97%', temp: '98.6°F', resp: '18/min' },
    clinicalNotes: 'Chest expansion symmetrical. Bilateral basal crepitations reduced compared to Day 1. Cough productive with whitish sputum. Afebrile for 24 hours.',
    dayWiseHistory: [
      {
        day: 'Day 1 (21 Sep 2026)',
        diagnosis: 'Acute Bacterial Pneumonia & Exertional Dyspnea',
        location: 'Ward B – Room 204',
        medication: 'IV Ceftriaxone 1g Stat, Hydrocortisone 100mg, Nebulization Levolin',
        investigation: 'Blood Culture, CXR PA view, ABG analysis',
        doctorNotes: 'Patient admitted with severe cough, fever (102°F), and SpO2 91% on room air. Initiated supplemental O2 at 3L/min.',
        timeline: [
          { time: '09:10', event: 'Emergency Triage & Primary Consultation by Dr. Ravi Shankar' },
          { time: '10:20', event: 'Medication IV regimen prescribed & administered in Ward B' },
          { time: '11:15', event: 'Laboratory phlebotomist sample drawn for Blood Culture & ABG' },
          { time: '13:40', event: 'Afternoon clinical review: SpO2 improved to 95% on 2L O2' },
          { time: '16:00', event: 'Evening nursing vitals log & physician round sign-off' }
        ]
      },
      {
        day: 'Day 2 (22 Sep 2026)',
        diagnosis: 'Resolving Pneumonia — Hemodynamically stable',
        location: 'Ward B – Room 204',
        medication: 'IV Ceftriaxone BD, Tab Azithromycin 500mg OD, Nebulization Duolin TDS',
        investigation: 'Repeat Chest X-Ray, Serum Creatinine (0.9 mg/dL)',
        doctorNotes: 'Crepitations clearing in right lower zone. Tolerating oral fluids well. Tapering oxygen support to room air.',
        timeline: [
          { time: '08:30', event: 'Morning round: SpO2 97% on room air, lungs clearing' },
          { time: '11:00', event: 'Repeat CXR performed at bedside mobile unit' },
          { time: '14:15', event: 'Physiotherapist assisted chest spirometry session' },
          { time: '18:00', event: 'Vitals stable. Diet upgraded to soft regular.' }
        ]
      },
      {
        day: 'Day 3 (23 Sep 2026)',
        diagnosis: 'Convalescent Phase — Stable',
        location: 'Ward B – Room 204',
        medication: 'Tab Azithromycin, Tab Paracetamol SOS, Respiratory exercises',
        investigation: 'Discharge readiness panel',
        doctorNotes: 'Patient afebrile for 48 hours. Lungs clear bilaterally. Planned for oral step-down and potential discharge tomorrow.',
        timeline: [
          { time: '09:00', event: 'Consultant review: Patient ambulating in corridor comfortably' },
          { time: '12:30', event: 'Medication administration verification' },
          { time: '15:45', event: 'Discharge counseling provided to patient and family' }
        ]
      }
    ]
  },
  {
    id: 'PT-1025',
    name: 'Sunita Devi',
    age: 45,
    gender: 'Female',
    assignedDoctorId: 'KD-DOC-001',
    doctorName: 'Dr. Ravi Shankar',
    department: 'Cardiology',
    ward: 'ICU',
    room: 'ICU Unit 1',
    bed: 'Bed 08',
    admissionDate: '2026-09-22',
    diagnosis: 'Acute Coronary Syndrome — NSTEMI',
    condition: 'Critical',
    treatmentPlan: 'Continuous telemetry ECG, Heparin infusion, dual antiplatelets, serial troponin monitoring.',
    medications: [
      { name: 'Heparin Infusion 1000U/hr', dose: 'Continuous', time: 'Infusing', status: 'Active' },
      { name: 'Tab Ticagrelor 90mg', dose: 'BD', time: '10:00 AM', status: 'Due' },
      { name: 'Tab Atorvastatin 80mg', dose: 'OD HS', time: '09:00 PM', status: 'Scheduled' },
      { name: 'IV Pantoprazole 40mg', dose: 'BD', time: '08:00 AM', status: 'Completed' }
    ],
    investigations: ['Serial Troponin-I', 'Echocardiogram', 'Lipid Profile', 'Coagulation Profile'],
    vitals: { bp: '114/72', pulse: '86 bpm', spo2: '98%', temp: '98.2°F', resp: '20/min' },
    clinicalNotes: 'Patient chest pain resolved post-anti-ischemic therapy. Telemetry shows sinus rhythm with T-wave inversions in V4-V6. Cardiac enzymes trending downwards.',
    dayWiseHistory: [
      {
        day: 'Day 1 (22 Sep 2026)',
        diagnosis: 'Acute Subendocardial Ischemia',
        location: 'ICU – Bed 08',
        medication: 'Loading dose Aspirin 300mg + Ticagrelor 180mg, IV Heparin bolus',
        investigation: 'ECG, Trop-I (2.4 ng/mL), Serum electrolytes',
        doctorNotes: 'Emergency ICU admission at 03:00 AM with retrosternal chest tightness. Coronary angiography planned after stabilization.',
        timeline: [
          { time: '03:15', event: 'Direct ICU admission via Emergency Ambulance' },
          { time: '04:00', event: 'Dr. Ravi Shankar bedside assessment & Heparin infusion started' },
          { time: '07:30', event: 'First 6-hour Troponin-I repeat test' },
          { time: '14:00', event: '2D Echo: LVEF 50%, hypokinesia in anterior wall' }
        ]
      },
      {
        day: 'Day 2 (23 Sep 2026)',
        diagnosis: 'Post-NSTEMI Stabilization',
        location: 'ICU – Bed 08',
        medication: 'Maintenance Heparin infusion, ACE inhibitor titration',
        investigation: 'Troponin-I repeat (1.1 ng/mL - trending down)',
        doctorNotes: 'No further chest pain episodes. Hemodynamically stable. Planned for shift to step-down telemetry ward.',
        timeline: [
          { time: '08:15', event: 'ICU morning round: Heart rate regular, no gallop rhythm' },
          { time: '13:00', event: 'Bedside counseling regarding CAG procedure' },
          { time: '19:00', event: 'Evening vitals and tele-monitoring check' }
        ]
      }
    ]
  },
  {
    id: 'PT-1026',
    name: 'Venkata Rao',
    age: 61,
    gender: 'Male',
    assignedDoctorId: 'KD-DOC-001',
    doctorName: 'Dr. Ravi Shankar',
    department: 'Cardiology',
    ward: 'OPD',
    room: 'Room 102',
    bed: 'OPD Chair 02',
    admissionDate: '2026-09-24',
    diagnosis: 'Essential Hypertension & Stable Exertional Angina',
    condition: 'Stable',
    treatmentPlan: 'Lifestyle modifications, antihypertensive titration, treadmill test scheduled next week.',
    medications: [
      { name: 'Tab Telmisartan 40mg', dose: 'OD Morning', time: '08:00 AM', status: 'Prescribed' },
      { name: 'Tab Metoprolol Succinate 25mg', dose: 'OD', time: '09:00 AM', status: 'Prescribed' }
    ],
    investigations: ['Serum Creatinine', 'HbA1c', 'Lipid Panel', 'TMT'],
    vitals: { bp: '138/88', pulse: '72 bpm', spo2: '99%', temp: '98.4°F', resp: '16/min' },
    clinicalNotes: 'Routine outpatient consultation. Blood pressure moderately controlled. Advised low-salt DASH diet and brisk walking.',
    dayWiseHistory: [
      {
        day: 'Day 1 (24 Sep 2026)',
        diagnosis: 'Stage 1 Hypertension & Angina Pectoris NYHA Class II',
        location: 'OPD Consultation Room 102',
        medication: 'Prescription renewed with beta-blocker addition',
        investigation: 'Requisition given for TMT and fasting blood labs',
        doctorNotes: 'Symptoms appear primarily upon climbing stairs. Advised SOS Sorbitrate and follow-up in 14 days.',
        timeline: [
          { time: '10:15', event: 'OPD Registration & Vitals Check by OPD Nurse' },
          { time: '10:40', event: 'Comprehensive Cardiology Consultation with Dr. Ravi Shankar' },
          { time: '11:05', event: 'Prescription counseling and diagnostic booking' }
        ]
      }
    ]
  },
  {
    id: 'PT-1027',
    name: 'Ananya Deshmukh',
    age: 34,
    gender: 'Female',
    assignedDoctorId: 'KD-DOC-002',
    doctorName: 'Dr. Anand Sharma',
    department: 'General Surgery / OT',
    ward: 'OT Recovery',
    room: 'Room 301',
    bed: 'Bed 01',
    admissionDate: '2026-09-23',
    diagnosis: 'Symptomatic Cholelithiasis (Gallstones)',
    condition: 'Post-Op Stable',
    treatmentPlan: 'Laparoscopic Cholecystectomy completed. Wound dressing intact, pain control.',
    medications: [
      { name: 'IV Tramadol 50mg', dose: 'SOS', time: 'As needed', status: 'Available' },
      { name: 'IV Ondansetron 4mg', dose: 'TDS', time: '02:00 PM', status: 'Scheduled' }
    ],
    investigations: ['Post-Op Hemoglobin', 'Abdominal ultrasound review'],
    vitals: { bp: '118/76', pulse: '80 bpm', spo2: '99%', temp: '98.8°F', resp: '16/min' },
    clinicalNotes: 'Uneventful laparoscopic procedure. Surgical ports dry and clean. Passing flatus. Oral sips initiated.',
    dayWiseHistory: []
  },
  {
    id: 'PT-1028',
    name: 'Babu Goud',
    age: 48,
    gender: 'Male',
    assignedDoctorId: 'KD-DOC-003',
    doctorName: 'Dr. Ramesh Babu',
    department: 'Critical Care / ICU',
    ward: 'ICU',
    room: 'ICU Isolation',
    bed: 'Bed 02',
    admissionDate: '2026-09-20',
    diagnosis: 'Acute Respiratory Distress Syndrome (ARDS) secondary to Sepsis',
    condition: 'Critical / Ventilated',
    treatmentPlan: 'Mechanical ventilation (SIMV mode), broad-spectrum antibiotics, noradrenaline infusion.',
    medications: [
      { name: 'IV Meropenem 1g', dose: 'TDS', time: '11:00 AM', status: 'Due' },
      { name: 'Noradrenaline Infusion', dose: 'Titrated', time: 'Continuous', status: 'Active' }
    ],
    investigations: ['ABG q6h', 'Procalcitonin', 'Endotracheal aspirate culture'],
    vitals: { bp: '102/64 (on inotrope)', pulse: '98 bpm', spo2: '94% (FiO2 45%)', temp: '100.4°F', resp: '22/min' },
    clinicalNotes: 'Ventilator parameters adjusted for lung-protective strategy. Tidal volume 380ml, PEEP 10 cmH2O. Hemodynamics stabilized.',
    dayWiseHistory: []
  }
];

// Nurse Tasks for Inpatient & ICU Units
export const NURSING_TASKS = [
  { id: 'NT-101', patientId: 'PT-1024', bed: 'Ward B - Bed 04', task: 'Administer IV Ceftriaxone 1g', type: 'Medication', due: '10:00 AM', status: 'Pending', nurse: 'Sister Mary' },
  { id: 'NT-102', patientId: 'PT-1025', bed: 'ICU - Bed 08', task: 'Check Vitals & Titrate Heparin Rate', type: 'Vitals & Infusion', due: '10:30 AM', status: 'Pending', nurse: 'Kavitha Nair' },
  { id: 'NT-103', patientId: 'PT-1024', bed: 'Ward B - Bed 04', task: 'Nebulization with Duolin', type: 'Respiratory', due: '12:00 PM', status: 'Scheduled', nurse: 'Sister Mary' },
  { id: 'NT-104', patientId: 'PT-1028', bed: 'ICU - Bed 02', task: 'Endotracheal Suctioning & Oral Care', type: 'Critical Care', due: '11:15 AM', status: 'Pending', nurse: 'Kavitha Nair' },
  { id: 'NT-105', patientId: 'PT-1027', bed: 'OT Recovery - Bed 01', task: 'Surgical Site Inspection & Dressing Check', type: 'Post-Op', due: '11:30 AM', status: 'Completed', nurse: 'Sister Anusha' },
  { id: 'NT-106', patientId: 'PT-1025', bed: 'ICU - Bed 08', task: 'Send Repeat Troponin Sample to Lab', type: 'Investigation', due: '01:00 PM', status: 'Scheduled', nurse: 'Kavitha Nair' }
];

// Lab Investigations / Workload
export const LAB_SAMPLES = [
  { id: 'LAB-1024', patientId: 'PT-1024', patientName: 'Rajesh Varma', test: 'Complete Blood Count (CBC) & ESR', doctor: 'Dr. Ravi Shankar', status: 'In Progress', sampleTime: '08:30 AM', turnaround: '45 mins', dept: 'Cardiology / Ward B' },
  { id: 'LAB-1025', patientId: 'PT-1025', patientName: 'Sunita Devi', test: 'Cardiac Enzymes (Troponin-I, CK-MB)', doctor: 'Dr. Ravi Shankar', status: 'Processing', sampleTime: '09:15 AM', turnaround: '30 mins (STAT)', dept: 'ICU Unit' },
  { id: 'LAB-1026', patientId: 'PT-1028', patientName: 'Babu Goud', test: 'Arterial Blood Gas (ABG) & Lactate', doctor: 'Dr. Ramesh Babu', status: 'Completed', sampleTime: '07:45 AM', turnaround: 'Ready', dept: 'ICU Unit' },
  { id: 'LAB-1027', patientId: 'PT-1026', patientName: 'Venkata Rao', test: 'Lipid Profile & HbA1c', doctor: 'Dr. Ravi Shankar', status: 'Sample Received', sampleTime: '10:20 AM', turnaround: '2 hours', dept: 'OPD' },
  { id: 'LAB-1028', patientId: 'PT-1027', patientName: 'Ananya Deshmukh', test: 'Post-Op Serum Electrolytes', doctor: 'Dr. Anand Sharma', status: 'Pending Collection', sampleTime: 'Scheduled 11:30', turnaround: '1 hour', dept: 'OT Recovery' }
];

// OT Schedule
export const OT_PROCEDURES = [
  { id: 'OT-901', patientName: 'Ananya Deshmukh', procedure: 'Laparoscopic Cholecystectomy', surgeon: 'Dr. Anand Sharma', room: 'OT-1 (Major)', time: '08:00 AM – 09:45 AM', status: 'Completed', anesthesiologist: 'Dr. K. Srinivas', team: 'Sister Anusha, Tech Rajesh' },
  { id: 'OT-902', patientName: 'G. Ramaiah', procedure: 'Cataract Phacoemulsification with IOL', surgeon: 'Dr. Vani Rao', room: 'OT-2 (Day Care)', time: '11:00 AM – 11:45 AM', status: 'In Prep', anesthesiologist: 'Local / Dr. K. Srinivas', team: 'Sister Deepa, Tech Mohan' },
  { id: 'OT-903', patientName: 'P. Krishna Murthy', procedure: 'Emergency Cesarean Section (LSCS)', surgeon: 'Dr. Sarala Devi', room: 'OT-1 (Emergency)', time: '01:30 PM – 02:30 PM', status: 'Scheduled', anesthesiologist: 'Dr. K. Srinivas', team: 'Sister Kavitha, Tech Rajesh' }
];

// OPD Appointments & Queue
export const OPD_QUEUE = [
  { token: 'T-01', patient: 'Venkata Rao', age: 61, doctor: 'Dr. Ravi Shankar', room: 'Room 102', time: '10:15 AM', status: 'In Consultation', fee: 'Paid (₹500)' },
  { token: 'T-02', patient: 'Laxmi Prasanna', age: 38, doctor: 'Dr. Ravi Shankar', room: 'Room 102', time: '10:35 AM', status: 'Waiting (Next)', fee: 'Paid (₹500)' },
  { token: 'T-03', patient: 'K. Mohan Reddy', age: 54, doctor: 'Dr. Srinivas Rao', room: 'Room 104', time: '10:45 AM', status: 'Waiting', fee: 'Paid (₹400)' },
  { token: 'T-04', patient: 'Sayed Farooq', age: 29, doctor: 'Dr. Ravi Shankar', room: 'Room 102', time: '11:00 AM', status: 'Registered', fee: 'Paid (₹500)' },
  { token: 'T-05', patient: 'S. Vijaya Lakshmi', age: 65, doctor: 'Dr. Ravi Teja (Physio)', room: 'Physio Bay 1', time: '11:15 AM', status: 'Arrived', fee: 'Paid (₹350)' }
];

// Physiotherapy Sessions
export const PHYSIO_SESSIONS = [
  { id: 'PT-S01', patient: 'S. Vijaya Lakshmi', age: 65, plan: 'Post-TKR Knee Joint Mobilization', sessionNum: 'Session 4 of 12', time: '11:15 AM', status: 'Scheduled', therapist: 'Mr. Ravi Teja' },
  { id: 'PT-S02', patient: 'Rajesh Varma', age: 52, plan: 'Incentive Spirometry & Chest Clearance', sessionNum: 'Session 2 of 5', time: '02:00 PM', status: 'Inpatient (Ward B)', therapist: 'Mr. Ravi Teja' },
  { id: 'PT-S03', patient: 'Chandrasekhar Rao', age: 44, plan: 'Lumbar Spondylosis Traction & Core Strengthening', sessionNum: 'Session 8 of 10', time: '03:30 PM', status: 'Confirmed', therapist: 'Mr. Ravi Teja' }
];

// Housekeeping & Sanitation Tasks
export const HOUSEKEEPING_ZONES = [
  { zone: 'ICU & Isolation Wards', staff: 'Aayah Meena & Sweeper Kiran', frequency: 'q2h Sterile Mop', lastCleaned: '08:45 AM', nextDue: '10:45 AM', status: 'In Progress', rating: '98% Audit Score' },
  { zone: 'OT Complex & Scrub Area', staff: 'Scavenger Naresh & Aayah Meena', frequency: 'Post-Surgery Terminal Disinfection', lastCleaned: '09:50 AM', nextDue: '12:00 PM', status: 'Clean & Certified', rating: '100% Sterile' },
  { zone: 'Ward A & Ward B Inpatient', staff: 'Sweeper Kiran Babu', frequency: 'Floor scrubbing & waste collection', lastCleaned: '08:15 AM', nextDue: '11:00 AM', status: 'Due Soon', rating: '94% Clean' },
  { zone: 'OPD Waiting & Registration', staff: 'Sweeper Arun Kumar', frequency: 'Continuous dry mop & sanitizer refill', lastCleaned: '09:30 AM', nextDue: '10:30 AM', status: 'Active', rating: '92% Clean' }
];

// Dhobi / Laundry Inventory
export const LAUNDRY_INVENTORY = [
  { item: 'Bed Sheets (Hospital White)', received: 42, processed: 35, pending: 7, rejected: 0, status: 'Active Wash Cycle' },
  { item: 'Pillow Covers', received: 50, processed: 48, pending: 2, rejected: 0, status: 'Ready for Pressing' },
  { item: 'OT Sterile Surgical Drapes (Green)', received: 18, processed: 18, pending: 0, rejected: 0, status: 'Sent to Autoclave' },
  { item: 'Staff Uniforms & Doctor Coats', received: 24, processed: 20, pending: 4, rejected: 0, status: 'Drying' },
  { item: 'Blankets & Patient Gowns', received: 16, processed: 12, pending: 4, rejected: 0, status: 'Pending Wash' }
];

// Security Postings & Cameras
export const SECURITY_POSTS = [
  { post: 'Main Gate & Ambulance Bay', guard: 'Siva Kumar', shift: '07:00 PM – 08:00 AM', status: 'On Post', visitorsLogged: 84, vehicleChecks: 32 },
  { post: 'Emergency Entrance & Triage', guard: 'V. Naidu', shift: '07:00 AM – 03:00 PM', status: 'On Post', visitorsLogged: 46, vehicleChecks: 12 },
  { post: 'CCTV Surveillance Control Room', guard: 'Nagaraju (Chief CSO)', shift: 'General Command', status: 'Monitoring 24 Feeds', alertStatus: 'Normal (1 Warning)' },
  { post: 'Night Corridor Patrol (2nd Floor & ICU)', guard: 'Raju Swamy', shift: '07:00 PM – 08:00 AM', status: 'Patrol Active', checkpointsDone: '18 of 24' }
];
