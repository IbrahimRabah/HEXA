export const DASHBOARD_MOCK = {
  kpis: {
    todayAppointments: 42,
    totalPatients: 1250,
    newPatientsToday: 5,
    pendingLabRequests: 12,
    pendingRadiologyRequests: 4,
    roomOccupancyRate: 75,
    todayRevenue: 15400,
    monthRevenue: 345000
  },
  recentAppointments: [
    { id: 'apt-001', patientName: 'John Doe', time: '09:00', doctorName: 'Dr. Sarah Wilson', status: 'Confirmed' },
    { id: 'apt-002', patientName: 'Alice Smith', time: '10:00', doctorName: 'Dr. Emily Davis', status: 'CheckedIn' },
    { id: 'apt-003', patientName: 'Michael Johnson', time: '14:00', doctorName: 'Dr. James Brown', status: 'Pending' }
  ],
  roomStatusSummary: {
    available: 10,
    occupied: 30,
    cleaning: 2,
    maintenance: 1
  }
};
