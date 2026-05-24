import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { VISITS_MOCK } from '../../../mock-data/visits.mock';
import { Visit } from '../../../shared/models/visit.model';
import { VisitStatus } from '../../../shared/enums/status.enums';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private visits: Visit[] = [...VISITS_MOCK];

  getDoctorQueue(): Observable<Visit[]> {
    return of(this.visits);
  }

  getVisitById(id: string): Observable<Visit | undefined> {
    return of(this.visits.find(v => v.id === id));
  }

  updateVisit(id: string, data: Partial<Visit>): Observable<Visit | undefined> {
    const v = this.visits.find(v => v.id === id);
    if (v) Object.assign(v, data);
    return of(v);
  }

  updateStatus(id: string, status: VisitStatus): Observable<Visit | undefined> {
    return this.updateVisit(id, { status });
  }
}
