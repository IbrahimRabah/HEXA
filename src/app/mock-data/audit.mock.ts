export const AUDIT_MOCK = [
  { id: 'aud-001', userId: 'usr-001', userName: 'Admin', action: 'CREATE', module: 'Patients', resourceId: 'pat-001', description: 'Created patient John Doe', ipAddress: '192.168.1.1', timestamp: new Date(Date.now() - 3600000), createdAt: new Date(), updatedAt: new Date(), createdBy: 'sys', updatedBy: 'sys' },
  { id: 'aud-002', userId: 'usr-001', userName: 'Admin', action: 'UPDATE', module: 'Appointments', resourceId: 'apt-001', description: 'Updated appointment status to CheckedIn', ipAddress: '192.168.1.1', timestamp: new Date(Date.now() - 1800000), createdAt: new Date(), updatedAt: new Date(), createdBy: 'sys', updatedBy: 'sys' },
  { id: 'aud-003', userId: 'usr-001', userName: 'Admin', action: 'LOGIN', module: 'Auth', resourceId: null, description: 'User logged in', ipAddress: '192.168.1.1', timestamp: new Date(Date.now() - 7200000), createdAt: new Date(), updatedAt: new Date(), createdBy: 'sys', updatedBy: 'sys' },
];
