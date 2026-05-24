import { Routes } from '@angular/router';

export const HOUSEKEEPING_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/housekeeping-list/housekeeping-list.component').then(m => m.HousekeepingListComponent) }
];
