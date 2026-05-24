import { BaseEntity } from './base.model';

export interface Diagnosis extends BaseEntity {
  visitId: string;
  patientId: string;
  code: string;
  description: string;
  type: 'Primary' | 'Secondary';
  notes?: string;
}

export interface PrescriptionItem {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: 'Oral' | 'IV' | 'IM' | 'Topical' | 'Inhaled';
  instructions?: string;
}

export interface Prescription extends BaseEntity {
  visitId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  items: PrescriptionItem[];
  status: 'Active' | 'Dispensed' | 'Cancelled';
  notes?: string;
}
