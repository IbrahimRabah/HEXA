import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { USERS_MOCK } from '../../../mock-data/users.mock';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users = [...USERS_MOCK];
  getUsers(): Observable<any[]> { return of(this.users); }
  toggleActive(id: string): Observable<any> {
    const u = this.users.find(u => u.id === id);
    if (u) u.isActive = !u.isActive;
    return of(u);
  }
}
