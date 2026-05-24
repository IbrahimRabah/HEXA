import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { VISITS_MOCK } from '../../../mock-data/visits.mock';
import { Visit } from '../../../shared/models/visit.model';

@Injectable({
  providedIn: 'root'
})
export class ReceptionService {
  getVisits(): Observable<Visit[]> {
    return of(VISITS_MOCK);
  }
}
