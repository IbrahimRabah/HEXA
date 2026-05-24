import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AUDIT_MOCK } from '../../../mock-data/audit.mock';

@Injectable({ providedIn: 'root' })
export class AuditService {
  getLogs(): Observable<any[]> { return of(AUDIT_MOCK); }
}
