import { LabRequestStatus } from '../shared/enums/status.enums';

export const LAB_MOCK = [
  {
    id: 'lab-001',
    visitId: 'vis-001',
    patientId: 'pat-002',
    patientName: 'Alice Smith',
    doctorId: 'doc-003',
    doctorName: 'Dr. Emily Davis',
    testName: 'Complete Blood Count',
    testCode: 'CBC',
    priority: 'Routine',
    status: LabRequestStatus.Pending,
    requestDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'sys',
    updatedBy: 'sys'
  }
];
