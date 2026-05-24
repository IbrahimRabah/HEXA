import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadChildren: () => import('./features/auth/routes').then(m => m.AUTH_ROUTES) },
  {
    path: '',
    loadComponent: () => import('./core/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/routes').then(m => m.DASHBOARD_ROUTES) },
      { path: 'patients', loadChildren: () => import('./features/patients/routes').then(m => m.PATIENTS_ROUTES) },
      { path: 'appointments', loadChildren: () => import('./features/appointments/routes').then(m => m.APPOINTMENTS_ROUTES) },
      { path: 'reception', loadChildren: () => import('./features/reception/routes').then(m => m.RECEPTION_ROUTES) },
      { path: 'nursing', loadChildren: () => import('./features/nursing/routes').then(m => m.NURSING_ROUTES) },
      { path: 'doctor', loadChildren: () => import('./features/doctor/routes').then(m => m.DOCTOR_ROUTES) },
      { path: 'laboratory', loadChildren: () => import('./features/laboratory/routes').then(m => m.LAB_ROUTES) },
      { path: 'radiology', loadChildren: () => import('./features/radiology/routes').then(m => m.RADIOLOGY_ROUTES) },
      { path: 'pharmacy', loadChildren: () => import('./features/pharmacy/routes').then(m => m.PHARMACY_ROUTES) },
      { path: 'billing', loadChildren: () => import('./features/billing/routes').then(m => m.BILLING_ROUTES) },
      { path: 'operations', loadChildren: () => import('./features/operations/routes').then(m => m.OPERATIONS_ROUTES) },
      { path: 'admissions', loadChildren: () => import('./features/admissions/routes').then(m => m.ADMISSIONS_ROUTES) },
      { path: 'rooms', loadChildren: () => import('./features/rooms/routes').then(m => m.ROOMS_ROUTES) },
      { path: 'housekeeping', loadChildren: () => import('./features/housekeeping/routes').then(m => m.HOUSEKEEPING_ROUTES) },
      { path: 'ophthalmology', loadChildren: () => import('./features/ophthalmology/routes').then(m => m.OPHTHALMOLOGY_ROUTES) },
      { path: 'dental', loadChildren: () => import('./features/dental/routes').then(m => m.DENTAL_ROUTES) },
      { path: 'audit', loadChildren: () => import('./features/audit/routes').then(m => m.AUDIT_ROUTES) },
      { path: 'reports', loadChildren: () => import('./features/reports/routes').then(m => m.REPORTS_ROUTES) },
      { path: 'settings', loadChildren: () => import('./features/settings/routes').then(m => m.SETTINGS_ROUTES) },
      { path: 'user-management', loadChildren: () => import('./features/user-management/routes').then(m => m.USER_MANAGEMENT_ROUTES) },
    ]
  },
  { path: '**', redirectTo: '' }
];

