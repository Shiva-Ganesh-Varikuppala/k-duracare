// Mock camera and CCTV data
export const cameras = [
  { id: 'CAM-ICU-01', name: 'ICU Entrance', location: 'ICU', floor: '2nd Floor', zone: 'ICU_ENTRANCE', ip: '192.168.1.101', port: 554, status: 'Online', fps: 25, resolution: '1080p', aiActive: true, persons: 3 },
  { id: 'CAM-ICU-02', name: 'ICU Staff Area', location: 'ICU', floor: '2nd Floor', zone: 'ICU_STAFF', ip: '192.168.1.102', port: 554, status: 'Online', fps: 25, resolution: '1080p', aiActive: true, persons: 5 },
  { id: 'CAM-ICU-03', name: 'ICU Monitor Zone', location: 'ICU', floor: '2nd Floor', zone: 'ICU_MONITOR', ip: '192.168.1.103', port: 554, status: 'Degraded', fps: 10, resolution: '720p', aiActive: true, persons: 7 },
  { id: 'CAM-OPD-01', name: 'OPD Entrance', location: 'OPD', floor: 'Ground Floor', zone: 'OPD_ENTRANCE', ip: '192.168.1.110', port: 554, status: 'Online', fps: 25, resolution: '1080p', aiActive: true, persons: 12 },
  { id: 'CAM-OPD-02', name: 'OPD Corridor', location: 'OPD', floor: 'Ground Floor', zone: 'OPD_CORRIDOR', ip: '192.168.1.111', port: 554, status: 'Online', fps: 25, resolution: '1080p', aiActive: false, persons: 8 },
  { id: 'CAM-REC-01', name: 'Reception Area', location: 'Reception', floor: 'Ground Floor', zone: 'RECEPTION', ip: '192.168.1.120', port: 554, status: 'Online', fps: 30, resolution: '4K', aiActive: true, persons: 6 },
  { id: 'CAM-LAB-01', name: 'Laboratory', location: 'Laboratory', floor: '1st Floor', zone: 'LABORATORY', ip: '192.168.1.130', port: 554, status: 'Online', fps: 25, resolution: '1080p', aiActive: true, persons: 4 },
  { id: 'CAM-OT-01', name: 'OT Entrance', location: 'OT', floor: '3rd Floor', zone: 'OT_ENTRANCE', ip: '192.168.1.140', port: 554, status: 'Offline', fps: 0, resolution: '1080p', aiActive: false, persons: 0 },
  { id: 'CAM-SEC-01', name: 'Security Gate', location: 'Security', floor: 'Ground Floor', zone: 'SECURITY_GATE', ip: '192.168.1.150', port: 554, status: 'Online', fps: 30, resolution: '1080p', aiActive: true, persons: 2 },
  { id: 'CAM-STAFF-01', name: 'Staff Entrance', location: 'Staff', floor: 'Ground Floor', zone: 'STAFF_ENTRANCE', ip: '192.168.1.160', port: 554, status: 'Online', fps: 25, resolution: '1080p', aiActive: true, persons: 4 },
  { id: 'CAM-PARK-01', name: 'Parking Area', location: 'Parking', floor: 'Ground Floor', zone: 'PARKING', ip: '192.168.1.170', port: 554, status: 'Online', fps: 15, resolution: '720p', aiActive: false, persons: 0 },
  { id: 'CAM-NK-01', name: 'Nurse Station', location: 'Nursing', floor: '1st Floor', zone: 'NURSE_STATION', ip: '192.168.1.180', port: 554, status: 'Online', fps: 25, resolution: '1080p', aiActive: true, persons: 3 },
];

export const zones = [
  { id: 'ICU_ENTRANCE', name: 'ICU Entrance', type: 'Restricted', cameras: 1, active: true },
  { id: 'ICU_STAFF', name: 'ICU Staff Area', type: 'Staff Only', cameras: 1, active: true },
  { id: 'ICU_MONITOR', name: 'ICU Monitor Zone', type: 'Critical', cameras: 1, active: true },
  { id: 'OPD_ENTRANCE', name: 'OPD Entrance', type: 'Public', cameras: 1, active: true },
  { id: 'OPD_CORRIDOR', name: 'OPD Corridor', type: 'Public', cameras: 1, active: true },
  { id: 'RECEPTION', name: 'Reception', type: 'Public', cameras: 1, active: true },
  { id: 'LABORATORY', name: 'Laboratory', type: 'Staff Only', cameras: 1, active: true },
  { id: 'OT_ENTRANCE', name: 'OT Entrance', type: 'Restricted', cameras: 1, active: false },
  { id: 'SECURITY_GATE', name: 'Security Gate', type: 'Security', cameras: 1, active: true },
  { id: 'STAFF_ENTRANCE', name: 'Staff Entrance', type: 'Staff Only', cameras: 1, active: true },
  { id: 'PARKING', name: 'Parking Area', type: 'Public', cameras: 1, active: true },
  { id: 'NURSE_STATION', name: 'Nurse Station', type: 'Staff Only', cameras: 1, active: true },
];

export const activityEvents = [
  { id: 'AE-001', time: '07:02', camera: 'CAM-STAFF-01', zone: 'Staff Entrance', event: 'Zone Entry', trackingId: 'TRK-0182', confidence: 0.94, severity: 'Info' },
  { id: 'AE-002', time: '07:08', camera: 'CAM-ICU-01', zone: 'ICU Entrance', event: 'Zone Entry', trackingId: 'TRK-0182', confidence: 0.91, severity: 'Info' },
  { id: 'AE-003', time: '07:15', camera: 'CAM-ICU-02', zone: 'ICU Staff Area', event: 'Zone Entry', trackingId: 'TRK-0183', confidence: 0.88, severity: 'Info' },
  { id: 'AE-004', time: '08:42', camera: 'CAM-NK-01', zone: 'Nurse Station', event: 'Prolonged Presence', trackingId: 'TRK-0184', confidence: 0.95, severity: 'Info' },
  { id: 'AE-005', time: '09:12', camera: 'CAM-OPD-01', zone: 'OPD Entrance', event: 'Crowding Detected', trackingId: null, confidence: 0.87, severity: 'Medium' },
  { id: 'AE-006', time: '10:05', camera: 'CAM-ICU-03', zone: 'ICU Monitor Zone', event: 'Possible Safety Event', trackingId: 'TRK-0190', confidence: 0.79, severity: 'High' },
  { id: 'AE-007', time: '10:42', camera: 'CAM-ICU-03', zone: 'ICU Monitor Zone', event: 'Possible Fall Event', trackingId: 'TRK-0191', confidence: 0.91, severity: 'Critical' },
  { id: 'AE-008', time: '11:30', camera: 'CAM-OT-01', zone: 'OT Entrance', event: 'Camera Offline', trackingId: null, confidence: 1.0, severity: 'High' },
  { id: 'AE-009', time: '12:15', camera: 'CAM-SEC-01', zone: 'Security Gate', event: 'Zone Entry', trackingId: 'TRK-0195', confidence: 0.96, severity: 'Info' },
  { id: 'AE-010', time: '13:22', camera: 'CAM-ICU-01', zone: 'ICU Entrance', event: 'Restricted Zone Entry', trackingId: 'TRK-0200', confidence: 0.83, severity: 'High' },
];

export const cameraAlerts = [
  { id: 'CA-001', severity: 'Critical', type: 'Safety Event', message: 'Possible fall event detected in ICU Monitor Zone', camera: 'CAM-ICU-03', time: '10:42:18', status: 'Unresolved', confidence: 0.91 },
  { id: 'CA-002', severity: 'High', type: 'Camera Offline', message: 'CAM-OT-01 is offline — OT Entrance unmonitored', camera: 'CAM-OT-01', time: '11:30:00', status: 'Unresolved', confidence: 1.0 },
  { id: 'CA-003', severity: 'High', type: 'Restricted Zone', message: 'Unauthorized entry detected in ICU Entrance', camera: 'CAM-ICU-01', time: '13:22:05', status: 'Under Review', confidence: 0.83 },
  { id: 'CA-004', severity: 'Medium', type: 'Crowding', message: 'High occupancy in OPD Entrance area', camera: 'CAM-OPD-01', time: '09:12:33', status: 'Acknowledged', confidence: 0.87 },
  { id: 'CA-005', severity: 'Medium', type: 'Camera Degraded', message: 'CAM-ICU-03 stream degraded — low FPS', camera: 'CAM-ICU-03', time: '08:45:00', status: 'Acknowledged', confidence: 1.0 },
  { id: 'CA-006', severity: 'Info', type: 'Safety Event', message: 'Safety event in ICU Monitor Zone — review required', camera: 'CAM-ICU-03', time: '10:05:12', status: 'Resolved', confidence: 0.79 },
];
