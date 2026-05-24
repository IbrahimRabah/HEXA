import { BaseEntity } from './base.model';
import { AppointmentStatus } from '../enums/status.enums';

export interface Appointment extends BaseEntity {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialtyId: string;
  specialtyName: string;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  type: 'New' | 'FollowUp' | 'Emergency';
  reason?: string;
  notes?: string;
  reminderSent: boolean;
}
