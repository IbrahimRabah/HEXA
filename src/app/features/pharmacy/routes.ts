import { Routes } from '@angular/router';

export const PHARMACY_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/pharmacy-list/pharmacy-list.component').then(m => m.PharmacyListComponent) }
];
