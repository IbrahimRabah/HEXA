import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PHARMACY_MOCK } from '../../../mock-data/pharmacy.mock';

@Injectable({ providedIn: 'root' })
export class PharmacyService {
  private meds = [...PHARMACY_MOCK];
  getMedications(): Observable<any[]> { return of(this.meds); }
}
