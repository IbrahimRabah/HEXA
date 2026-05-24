import { Routes } from '@angular/router';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/doctor-queue/doctor-queue.component').then(m => m.DoctorQueueComponent)
  },
  {
    path: 'consultation/:visitId',
    loadComponent: () => import('./pages/consultation/consultation.component').then(m => m.ConsultationComponent)
  }
];

