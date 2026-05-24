import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HOUSEKEEPING_MOCK } from '../../../mock-data/housekeeping.mock';

@Injectable({ providedIn: 'root' })
export class HousekeepingService {
  private tasks = [...HOUSEKEEPING_MOCK];
  getTasks(): Observable<any[]> { return of(this.tasks); }
  complete(id: string): Observable<any> {
    const t = this.tasks.find(t => t.id === id);
    if (t) t.status = 'Completed';
    return of(t);
  }
}
