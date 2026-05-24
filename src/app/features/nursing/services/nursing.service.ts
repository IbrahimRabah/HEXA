import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { NURSING_MOCK } from '../../../mock-data/nursing.mock';
import { NursingAssessment, VitalSigns } from '../../../shared/models/nursing.model';

@Injectable({
  providedIn: 'root'
})
export class NursingService {
  private assessments: NursingAssessment[] = [...NURSING_MOCK];

  getNursingAssessments(): Observable<NursingAssessment[]> {
    return of(this.assessments);
  }

  getAssessmentByVisitId(visitId: string): Observable<NursingAssessment | undefined> {
    return of(this.assessments.find(a => a.visitId === visitId));
  }

  updateStatus(id: string, status: string): Observable<NursingAssessment | undefined> {
    const a = this.assessments.find(a => a.id === id);
    if (a) (a as any).status = status;
    return of(a);
  }

  saveVitals(visitId: string, vitals: VitalSigns, notes: string, status: string): Observable<NursingAssessment | undefined> {
    let a = this.assessments.find(a => a.visitId === visitId);
    if (a) {
      a.vitalSigns = vitals;
      a.nursingNotes = notes;
      (a as any).status = status;
    }
    return of(a);
  }
}
