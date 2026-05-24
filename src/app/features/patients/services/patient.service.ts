import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { PATIENTS_MOCK } from '../../../mock-data/patients.mock';
import { Patient } from '../../../shared/models/patient.model';
import { Gender } from '../../../shared/enums/status.enums';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patients: Patient[] = [...PATIENTS_MOCK];

  getPatients(): Observable<Patient[]> {
    return of(this.patients);
  }

  getPatientById(id: string): Observable<Patient | undefined> {
    return of(this.patients.find(p => p.id === id));
  }

  createPatient(payload: Partial<Patient>): Observable<Patient> {
    const newPatient: Patient = {
      id: 'pat-' + Date.now(),
      mrn: 'PAT-' + String(this.patients.length + 1).padStart(3, '0'),
      firstName: payload.firstName!,
      lastName: payload.lastName!,
      fullName: `${payload.firstName} ${payload.lastName}`,
      dateOfBirth: payload.dateOfBirth!,
      gender: payload.gender || Gender.Male,
      nationality: payload.nationality || '',
      nationalId: payload.nationalId || '',
      phone: payload.phone!,
      email: payload.email || '',
      address: payload.address || '',
      bloodType: payload.bloodType || '',
      emergencyContactName: payload.emergencyContactName || '',
      emergencyContactPhone: payload.emergencyContactPhone || '',
      insuranceProvider: payload.insuranceProvider,
      insuranceNumber: payload.insuranceNumber,
      allergies: payload.allergies || [],
      chronicDiseases: payload.chronicDiseases || [],
      fixedMedications: payload.fixedMedications || [],
      status: 'Active',
      notes: payload.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user',
      updatedBy: 'current-user'
    };
    this.patients.unshift(newPatient);
    return of(newPatient);
  }

  updatePatient(id: string, payload: Partial<Patient>): Observable<Patient> {
    const index = this.patients.findIndex(p => p.id === id);
    if (index !== -1) {
      this.patients[index] = {
        ...this.patients[index],
        ...payload,
        fullName: `${payload.firstName || this.patients[index].firstName} ${payload.lastName || this.patients[index].lastName}`,
        updatedAt: new Date(),
        updatedBy: 'current-user'
      };
    }
    return of(this.patients[index]);
  }

  deletePatient(id: string): Observable<void> {
    this.patients = this.patients.filter(p => p.id !== id);
    return of(undefined);
  }
}

