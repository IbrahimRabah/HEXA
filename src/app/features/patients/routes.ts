import { Routes } from '@angular/router';

export const PATIENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/patient-list/patient-list.component').then(m => m.PatientListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/patient-form/patient-form.component').then(m => m.PatientFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/patient-profile/patient-profile.component').then(m => m.PatientProfileComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/patient-form/patient-form.component').then(m => m.PatientFormComponent)
  }
];

