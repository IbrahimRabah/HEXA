import { Visit } from '../shared/models/visit.model';
import { VisitStatus } from '../shared/enums/status.enums';

const today = new Date();

export const VISITS_MOCK: Visit[] = [
  {
    id: 'vis-001',
    visitNumber: 'VST-1001',
    patientId: 'pat-002',
    patientName: 'Alice Smith',
    appointmentId: 'apt-002',
    doctorId: 'doc-003',
    doctorName: 'Dr. Emily Davis',
    visitDate: today,
    status: VisitStatus.InProgress,
    chiefComplaint: 'Fever and cough for 3 days',
    queueToken: 'A001',
    departmentId: 'dep-003',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'sys',
    updatedBy: 'sys'
  }
];
