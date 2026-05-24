import { Routes } from '@angular/router';

export const LAB_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/lab-list/lab-list.component').then(m => m.LabListComponent)
  }
];
