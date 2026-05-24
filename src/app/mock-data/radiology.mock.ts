import { RadiologyRequestStatus } from '../shared/enums/status.enums';

export const RADIOLOGY_MOCK = [
  {
    id: 'rad-001',
    visitId: 'vis-001',
    patientId: 'pat-002',
    patientName: 'Alice Smith',
    doctorId: 'doc-003',
    doctorName: 'Dr. Emily Davis',
    imagingType: 'X-Ray',
    bodyPart: 'Chest',
    priority: 'Routine',
    status: RadiologyRequestStatus.Pending,
    requestDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'sys',
    updatedBy: 'sys'
  }
];
