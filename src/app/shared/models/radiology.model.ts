import { BaseEntity } from './base.model';
import { RadiologyRequestStatus } from '../enums/status.enums';

export interface RadiologyRequest extends BaseEntity {
  visitId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  imagingType: 'X-Ray' | 'CT' | 'MRI' | 'Ultrasound' | 'OCT' | 'Fundus';
  bodyPart: string;
  priority: 'STAT' | 'Urgent' | 'Routine';
  status: RadiologyRequestStatus;
  requestDate: Date;
  scheduledDate?: Date;
  notes?: string;
}

export interface RadiologyResult extends BaseEntity {
  requestId: string;
  imagingType: string;
  findings: string;
  impression: string;
  imageUrl?: string;
  reportUrl?: string;
  radiologistId: string;
  radiologistName: string;
  approvedBy?: string;
  approvedAt?: Date;
}
