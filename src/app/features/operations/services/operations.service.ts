import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OPERATIONS_MOCK } from '../../../mock-data/operations.mock';
import { OperationStatus } from '../../../shared/enums/status.enums';

@Injectable({ providedIn: 'root' })
export class OperationsService {
  private ops = [...OPERATIONS_MOCK];
  getOperations(): Observable<any[]> { return of(this.ops); }
  updateStatus(id: string, status: OperationStatus): Observable<any> {
    const op = this.ops.find(o => o.id === id);
    if (op) op.status = status;
    return of(op);
  }
}
