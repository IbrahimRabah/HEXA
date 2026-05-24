import { OperationStatus } from '../shared/enums/status.enums';

export const OPERATIONS_MOCK = [
  {
    id: 'op-001',
    patientId: 'pat-003',
    patientName: 'Michael Johnson',
    procedureName: 'Appendectomy',
    surgeonId: 'doc-005',
    surgeonName: 'Dr. William Garcia',
    scheduledDate: new Date(),
    scheduledTime: '10:00',
    estimatedDuration: 120,
    operationRoomId: 'or-01',
    operationRoomName: 'OR 1',
    status: OperationStatus.Scheduled,
    assistants: [],
    equipmentRequired: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'sys',
    updatedBy: 'sys',
    diagnosisDescription: 'Appendicitis'
  }
];
