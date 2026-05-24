import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RADIOLOGY_MOCK } from '../../../mock-data/radiology.mock';
import { RadiologyRequestStatus } from '../../../shared/enums/status.enums';

@Injectable({ providedIn: 'root' })
export class RadiologyService {
  private requests = [...RADIOLOGY_MOCK];

  getRadiologyRequests(): Observable<any[]> { return of(this.requests); }

  updateStatus(id: string, status: RadiologyRequestStatus): Observable<any> {
    const r = this.requests.find(r => r.id === id);
    if (r) r.status = status;
    return of(r);
  }
}
