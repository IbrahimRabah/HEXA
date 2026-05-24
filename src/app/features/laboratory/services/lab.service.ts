import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LAB_MOCK } from '../../../mock-data/lab.mock';
import { LabRequestStatus } from '../../../shared/enums/status.enums';

@Injectable({ providedIn: 'root' })
export class LabService {
  private requests = [...LAB_MOCK];

  getLabRequests(): Observable<any[]> { return of(this.requests); }

  updateStatus(id: string, status: LabRequestStatus): Observable<any> {
    const r = this.requests.find(r => r.id === id);
    if (r) r.status = status;
    return of(r);
  }
}
