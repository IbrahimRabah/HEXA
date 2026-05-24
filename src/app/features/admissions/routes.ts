import { Routes } from '@angular/router';

export const ADMISSIONS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/admission-list/admission-list.component').then(m => m.AdmissionListComponent) }
];
