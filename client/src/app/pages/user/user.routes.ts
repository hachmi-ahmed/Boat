import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('../../components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(m => m.UserProfileComponent)
  }
];
