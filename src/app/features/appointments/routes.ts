import { Routes } from '@angular/router';

export const APPOINTMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/appointment-list/appointment-list.component').then(m => m.AppointmentListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/appointment-form/appointment-form.component').then(m => m.AppointmentFormComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/appointment-form/appointment-form.component').then(m => m.AppointmentFormComponent)
  }
];
