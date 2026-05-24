import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ROOMS_MOCK } from '../../../mock-data/admissions.mock';
import { RoomStatus } from '../../../shared/enums/status.enums';

@Injectable({ providedIn: 'root' })
export class RoomsService {
  private rooms = [...ROOMS_MOCK];
  getRooms(): Observable<any[]> { return of(this.rooms); }
  updateStatus(id: string, status: RoomStatus): Observable<any> {
    const r = this.rooms.find(r => r.id === id);
    if (r) r.status = status;
    return of(r);
  }
}
