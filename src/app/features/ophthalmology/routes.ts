import { Routes } from '@angular/router';

export const OPHTHALMOLOGY_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/ophthalmology/ophthalmology.component').then(m => m.OphthalmologyComponent) }
];
