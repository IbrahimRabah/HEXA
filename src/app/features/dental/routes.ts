import { Routes } from '@angular/router';

export const DENTAL_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/dental/dental.component').then(m => m.DentalComponent) }
];
