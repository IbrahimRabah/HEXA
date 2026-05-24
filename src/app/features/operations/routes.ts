import { Routes } from '@angular/router';

export const OPERATIONS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/operations-list/operations-list.component').then(m => m.OperationsListComponent) }
];
