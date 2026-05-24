import { Routes } from '@angular/router';

export const NURSING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/nursing-queue/nursing-queue.component').then(m => m.NursingQueueComponent)
  },
  {
    path: 'vitals/:visitId',
    loadComponent: () => import('./pages/vitals-form/vitals-form.component').then(m => m.VitalsFormComponent)
  }
];

