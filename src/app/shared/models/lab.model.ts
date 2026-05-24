import { BaseEntity } from './base.model';
import { LabRequestStatus } from '../enums/status.enums';

export interface LabRequest extends BaseEntity {
  visitId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  testName: string;
  testCode: string;
  priority: 'STAT' | 'Urgent' | 'Routine';
  status: LabRequestStatus;
  requestDate: Date;
  resultDate?: Date;
  notes?: string;
}

export interface LabResult extends BaseEntity {
  requestId: string;
  testName: string;
  resultValue: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  interpretation?: string;
  attachmentUrl?: string;
  approvedBy?: string;
  approvedAt?: Date;
}
