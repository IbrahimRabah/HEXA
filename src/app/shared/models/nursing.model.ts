import { BaseEntity } from './base.model';

export interface VitalSigns {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  temperature: number;
  pulse: number;
  spO2: number;
  weight: number;
  height: number;
  bmi: number;
  painScale: number;
  respiratoryRate?: number;
}

export interface NursingAssessment extends BaseEntity {
  visitId: string;
  patientId: string;
  patientName: string;
  nurseId: string;
  nurseName: string;
  vitalSigns: VitalSigns;
  nursingNotes?: string;
  status: 'Waiting' | 'UnderAssessment' | 'ReadyForDoctor' | 'Completed';
  assessmentDate: Date;
}
