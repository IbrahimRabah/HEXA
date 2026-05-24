import { BaseEntity } from './base.model';
import { RoomStatus } from '../enums/status.enums';

export interface Admission extends BaseEntity {
  patientId: string;
  patientName: string;
  visitId?: string;
  admissionDate: Date;
  expectedDischargeDate?: Date;
  actualDischargeDate?: Date;
  roomId: string;
  roomName: string;
  bedNumber: string;
  stayClass: 'VIP' | 'Private' | 'SemiPrivate' | 'Shared' | 'General';
  attendingDoctorId: string;
  attendingDoctorName: string;
  admissionReason: string;
  status: 'Active' | 'Discharged' | 'Transferred';
  notes?: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: string;
  wing: string;
  type: 'Ward' | 'Private' | 'VIP' | 'ICU' | 'OperatingRoom' | 'Emergency';
  capacity: number;
  occupiedBeds: number;
  status: RoomStatus;
  lastCleanedAt?: Date;
}
