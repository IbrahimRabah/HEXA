import { NursingAssessment } from '../shared/models/nursing.model';

const today = new Date();

export const NURSING_MOCK: NursingAssessment[] = [
  {
    id: 'nsg-001',
    visitId: 'vis-001',
    patientId: 'pat-002',
    patientName: 'Alice Smith',
    nurseId: 'nur-001',
    nurseName: 'Nurse Mary',
    vitalSigns: {
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      temperature: 38.5,
      pulse: 90,
      spO2: 98,
      weight: 65,
      height: 165,
      bmi: 23.8,
      painScale: 4
    },
    nursingNotes: 'Patient complains of fever and persistent cough.',
    status: 'Completed',
    assessmentDate: today,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'sys',
    updatedBy: 'sys'
  }
];
