import { Routes } from '@angular/router';

export const RADIOLOGY_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/radiology-list/radiology-list.component').then(m => m.RadiologyListComponent) }
];
