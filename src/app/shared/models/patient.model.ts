import { BaseEntity } from './base.model';
import { Gender } from '../enums/status.enums';

export interface Patient extends BaseEntity {
  mrn: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: Date;
  gender: Gender;
  nationality: string;
  nationalId: string;
  phone: string;
  email: string;
  address: string;
  bloodType: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  allergies: string[];
  chronicDiseases: string[];
  fixedMedications: string[];
  profileImageUrl?: string;
  status: 'Active' | 'Inactive';
  notes?: string;
}

export interface PatientSummary {
  id: string;
  mrn: string;
  fullName: string;
  dateOfBirth: Date;
  gender: Gender;
  phone: string;
  status: 'Active' | 'Inactive';
}
