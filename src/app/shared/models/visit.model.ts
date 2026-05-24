import { BaseEntity } from './base.model';
import { VisitStatus } from '../enums/status.enums';

export interface Visit extends BaseEntity {
  visitNumber: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  doctorId: string;
  doctorName: string;
  visitDate: Date;
  status: VisitStatus;
  chiefComplaint?: string;
  hpiNotes?: string;
  physicalExamNotes?: string;
  clinicalNotes?: string;
  queueToken?: string;
  departmentId?: string;
}
