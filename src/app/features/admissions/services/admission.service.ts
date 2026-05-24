import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ADMISSIONS_MOCK } from '../../../mock-data/admissions.mock';

@Injectable({ providedIn: 'root' })
export class AdmissionService {
  private admissions = [...ADMISSIONS_MOCK];
  getAdmissions(): Observable<any[]> { return of(this.admissions); }
}
